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

### lesson-01 — Next.js + Tailwind + Shadcn
- _to be filled after lesson-01 lands_

### lesson-02 — Schema & ORM
- _Will compare Drizzle's SQL-first schema files vs Prisma's `schema.prisma`
  DSL once both exist side-by-side._

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
