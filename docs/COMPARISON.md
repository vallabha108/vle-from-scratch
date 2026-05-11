# Comparison Log: vle-from-scratch vs. vallabha_vle

A living document. After each lesson lands here, fill in what differed and —
where we have empirical evidence — which choice we'd actually pick.

> "We don't know yet" is a valid answer. Update later.

---

## Header summary

| Dimension | vallabha_vle | vle-from-scratch | Verdict so far |
|-----------|--------------|------------------|----------------|
| ORM       | Prisma 5.22  | Drizzle (planned, lesson-02) | TBD |
| Auth      | Firebase Auth | Auth.js v5 (planned, lesson-03) | TBD |
| DB host   | Cloud SQL    | Neon (planned, lesson-08) | TBD |
| IaC       | Terraform    | Pulumi (planned, lesson-08) | TBD |
| CI        | Cloud Build  | GitHub Actions (planned, lesson-09) | TBD |
| Tests     | None         | Vitest + Playwright (lesson-01+) | **Track A wins by default** |

---

## Per-lesson notes

### lesson-00 — Project framing
- vallabha_vle: skeleton landed in a single 13K-LOC initial commit. Hard
  to retrace decisions; the "why" lives only in `CLAUDE.md` and `README.md`.
- vle-from-scratch: each decision has a numbered lesson. Slower to ship,
  much easier to teach.
- Verdict: for **production** a fast initial commit is fine. For
  **teaching** the lesson-tag approach is non-negotiable.

### lesson-01 — Next.js + Tailwind + Shadcn + Vitest

| Concern | vallabha_vle | vle-from-scratch | Evidence |
|---|---|---|---|
| Scaffold delivery | 13K LOC in one commit (`672a47b`) | ~150 LOC, plus tests, in `lesson-01` | velocity vs. teach-ability — both valid |
| Tests | none at any commit | 1 unit test (`Lessons.test.tsx`) from lesson-01 | **Track A wins for teaching** — early tests catch regressions in roadmap data |
| Dark mode | added in commit 9 (`89ebb0b`) | day-one via `prefers-color-scheme` | trivial in greenfield, retrofit-cost in prod |
| Standalone output | enabled later when Dockerising | enabled at lesson-01 | no surprise refactor in lesson-07 |

**Verdict (lesson-01):** for *teaching*, the slow-lesson approach wins
clearly. For *shipping*, the big-initial-commit approach is faster and
the lack of upfront tests is defensible **if** you add them when the
first regression happens. (Track C will add tests in its Phase C3.)

### lesson-02 — Schema & ORM

| Concern | vallabha_vle (Prisma) | vle-from-scratch (Drizzle) | Evidence |
|---|---|---|---|
| Definition language | `schema.prisma` DSL | TS w/ `pgTable()` | Drizzle reads like SQL you'd have written anyway |
| ID strategy | `cuid()` | `cuid2` | both opaque; cuid2 is the newer drop-in |
| Migration files | none (push only) | both supported: `db:push` + `db:generate` produces SQL in `drizzle/` | **Track A wins for review-ability** — generated SQL is grep-able |
| Tenant-scope safety | convention | convention + 4 invariant unit tests | first concrete proof that Track A's "tests from day one" rule helps |
| Studio | `prisma studio` | `drizzle-kit studio` | tied — both fine |
| Bundle weight (server) | ~2 MB Prisma client + binary engine | ~250 KB drizzle-orm | matters for Cloud Run cold start (lesson-07) |
| Required Postgres port | 5432 (host) | 55432 (host) | Track A learned the Postgres.app collision the hard way; doc'd in lesson README |

**Verdict (lesson-02):**
- For **teaching**, Drizzle wins clearly — students see SQL, the
  schema-as-code is one file, and invariant tests are trivial to write.
- For **shipping**, Prisma's faster onboarding is real and probably worth
  it if the team isn't comfortable with SQL.
- The new finding for vallabha_vle: **add schema-invariant unit tests** —
  cost = ~50 LOC, value = catching tenant-scope refactor errors before
  they ship.

### lesson-03 — Auth
- _Will compare Firebase Auth (vallabha_vle) vs Auth.js v5 magic-link
  (vle-from-scratch) on: setup friction, prod cost, vendor lock-in, UX._

### lesson-04..lesson-10
- _to be filled_

---

## Honest scoreboard (updated as evidence accrues)

> Update only when you have run-time evidence, not opinion.

| Lesson | Winner | Why |
|--------|--------|-----|
| —      | —      | _no data yet_ |
