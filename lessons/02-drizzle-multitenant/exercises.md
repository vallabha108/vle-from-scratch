# Lesson 02 — Exercises

Do **easy** and **medium**. **Hard** is optional but recommended.

Commit your answers in a branch in your fork:
`exercises/lesson-02/<your-initials>`.

---

## Easy — Add a `Reference` table

**Task:** A module can have many external `Reference` rows (articles,
papers, docs). Add the table, with these columns:

- `id` text PK (CUID2)
- `moduleId` FK → modules, cascade on delete
- `title` text NOT NULL
- `url` text NOT NULL
- `kind` enum: `ARTICLE | PAPER | DOC | BOOK | OTHER`
- `order` integer default 0
- `createdAt` timestamptz default now()

Add it to `ALL_TABLES` (after `modules`). Add at least two seed rows.
Update `schema.test.ts` so the new table is checked by the invariants.

**Pass criteria:**
- `npm test -- --run` all green (including a new test that `references`
  has a `tenant_id`-equivalent scope path)
- `npm run db:push` succeeds
- `npm run db:seed` shows the new rows
- `npm run db:studio` lists the new table

**Question to think about (write a 3-line answer):** does `Reference`
need its own `tenant_id`, or is "scoped via module" sufficient? When
might that be wrong?

---

## Medium — A `requireTenant()` helper + a test

**Task:** Write `src/db/queries.ts` exporting:

```ts
export function modulesForTenant(tenantId: string) { ... }
export function modulesInWeek(tenantId: string, weekId: string) { ... }
```

Both functions MUST filter by `tenantId` even though `Week → Program →
Tenant` is implicit. Write a Vitest test that uses a fresh seed and
proves a tenant cannot read another tenant's modules.

**Pass criteria:**
- Functions live in `src/db/queries.ts`
- Test seeds two tenants, queries with one tenant's id, asserts the
  other tenant's modules are NOT in the result
- Test runs against the real Docker Postgres (a new file
  `src/db/queries.integration.test.ts` is fine; gate it behind an env
  var like `INTEGRATION=1`)
- Existing invariant tests still pass

**Hint:** Drizzle `where` accepts `eq(modules.tenantId, tenantId)`.

---

## Hard — A "no implicit cross-tenant read" lint

**Task:** Add a Vitest test that **statically** (i.e., by reading the
source files with `fs`, no DB) rejects any function exported from
`src/db/queries.ts` that:

1. Does NOT take a `tenantId: string` first argument, AND
2. Does NOT call `eq(<table>.tenantId, …)` somewhere in its body

Make the error message name the offending function.

**Why:** this catches the most common multi-tenant bug class (forgotten
scope) before it ships. It's a poor-engineer's eslint rule.

**Pass criteria:**
- The check lives in `src/db/queries.invariants.test.ts`
- Failure messages are useful enough that a learner could fix the issue
  without reading the test
- Deliberately add a buggy function, watch the test fail with a clear
  message, then revert

---

## Write-up

After finishing, either:
- Add an FAQ entry in `docs/FAQ.md` if you hit something painful, OR
- Add a row to `docs/COMPARISON.md` if your work surfaced a new
  difference vs vallabha_vle.
