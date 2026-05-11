# Lesson 02 — Drizzle schema for multi-tenancy

**Tag:** `lesson-02`
**Prereqs:** Docker Desktop running. Everything from lesson-01.
**Time:** ~60 min walk + ~45 min exercises

After this lesson you have a Postgres database running in Docker, five
tables modelling a multi-tenant learning platform, and a typesafe ORM
handle (`db`) you can import anywhere in the app. The 4 schema-invariant
tests guard the design rules so future commits cannot quietly break them.

---

## What landed

```
docker-compose.yml           Postgres 16 on host port 55432
drizzle.config.ts            schema location + connection
drizzle/0000_lesson02_*.sql  generated SQL for the initial migration
src/db/
├── schema.ts                Tenant, User, Program, Week, Module + role enum
├── client.ts                drizzle handle + raw postgres client
├── seed.ts                  idempotent seed (truncate-then-insert)
└── schema.test.ts           invariant tests (4, all DB-free)
```

New `package.json` scripts:

```
npm run docker:up      # start Postgres (host port 55432)
npm run docker:down    # stop, keep data
npm run docker:wipe    # stop + delete volume
npm run db:push        # apply schema to DB (no migrations file)
npm run db:generate    # emit SQL migration into drizzle/
npm run db:studio      # browse data in the Drizzle web UI
npm run db:seed        # truncate + insert seed data
```

---

## End-to-end smoke test

```bash
npm run docker:up
npm run db:push          # creates 5 tables, 1 enum, all indexes
npm run db:seed          # 2 tenants, 4 users, 1 program, 3 weeks, 6 modules
npm test -- --run        # 7/7 pass (3 lesson-01 + 4 schema invariants)
npm run db:studio        # opens https://local.drizzle.studio
```

If `db:push` fails with `role "vle" does not exist`, you have another
Postgres squatting on port 5432. We deliberately chose host port
**55432** to avoid this — make sure `DATABASE_URL` in `.env.local` uses
`localhost:55432`. See [Pitfalls](#pitfalls) below.

---

## Why these choices

### Drizzle, not Prisma
- SQL-first: the schema reads like CREATE TABLE statements you already
  know. Migrations are inspectable diffs of SQL.
- Smaller bundle and no binary engine — matters for Cloud Run cold starts
  later.
- The cost: less hand-holding on relations, manual joins in some places.
- Documented in `docs/COMPARISON.md` — first head-to-head with
  vallabha_vle's Prisma.

### `text` columns + CUID2 ids, not `serial`
- Auto-increment integers leak business volume (`/users/42` tells you a
  competitor has at most 42 users).
- CUID2 is short, URL-safe, sortable-ish, and collision-resistant.

### `timestamptz`, default `now()`
- Always store UTC. Always.
- Defaults applied by Postgres, not Drizzle — so direct SQL inserts work
  too.

### `tenants` slug + `domain` index
- The eventual middleware will route `acme.vle.app` → tenant by domain,
  and `vle.app/t/acme` → tenant by slug. Index both now to avoid a
  performance scramble later.

### Schema invariant tests (NEW)
- Pure unit tests that fail loudly if anyone adds a tenant-scoped table
  without `tenant_id`, forgets `created_at`, or breaks the dependency
  ordering of `ALL_TABLES` (used by tooling).
- This is one concrete answer to *"how do you stop multi-tenant data
  leaks during refactors?"* — make the invariant a test.

---

## Compare with `vallabha_vle`

| Concern | vallabha_vle (Prisma) | vle-from-scratch (Drizzle) |
|---|---|---|
| Schema definition | `prisma/schema.prisma` DSL | TypeScript with `pgTable()` |
| Migrations | `prisma db push` (no migration files) | `drizzle-kit generate` emits SQL in `drizzle/` |
| Client | `@prisma/client` generated to `node_modules` | typed inference from your schema file |
| Default IDs | `cuid()` | `cuid2` |
| Soft enforcement of `tenantId` | convention only | convention + invariant test |
| Multi-tenant join helpers | none | none yet (lesson-04 adds scoped query helpers) |

Verdict (now in `docs/COMPARISON.md`): Drizzle gives you the SQL you'd
have written anyway, with types. Prisma gives you a faster first hour at
the cost of a heavier runtime and an opinionated migration tool. Neither
is wrong; they prefer different audiences.

---

## Pitfalls

### A. Port 5432 is taken by host Postgres
**Symptom:** `db:push` errors with `role "vle" does not exist` even though
the container is healthy.

**Cause:** macOS frequently runs Postgres.app or a Homebrew Postgres on
5432. Connections from `localhost:5432` hit that, not your container.

**Fix:** We bind the container to **host port 55432**. `.env.example`
already reflects this. Do NOT change it back to 5432 unless you've
stopped your host Postgres first.

**Verify:**
```bash
lsof -i :5432    # should show no postgres OR show only docker-proxy
docker ps --filter publish=55432
```

### B. Re-running `db:seed` after schema changes
**Symptom:** Seed fails with column-not-found.

**Fix:** Run `db:push` first. Drizzle's `push` is destructive-ish — it
will warn before dropping columns. If you ever want a guaranteed clean
state: `npm run docker:wipe && npm run docker:up && npm run db:push && npm run db:seed`.

### C. `drizzle-kit generate` complains about no diff
**Symptom:** After your first push, generate says "No schema changes".

**Cause:** You already pushed. `generate` emits a migration from the
*last known snapshot* to the current schema, but `push` updates the
snapshot too. Edit schema → generate produces a real diff.

---

## Read next

- Exercises: [`exercises.md`](exercises.md)
- Comparison log: [`../../docs/COMPARISON.md`](../../docs/COMPARISON.md)
- Next lesson: lesson-03 wires Auth.js v5 magic-link login on top of this
  schema.
