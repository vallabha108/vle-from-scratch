# Teacher Onboarding

Audience: you (Prem) and any future facilitator who runs a cohort through
this course. This is the **operational** doc: how to set up, how to grade,
how to debug a stuck learner.

---

## Prerequisites on your machine

- Node.js 20+ (`nvm install 20 && nvm use 20`)
- pnpm 9+ (`npm i -g pnpm` — chosen over npm for speed and workspace ergonomics)
- Docker Desktop (for local Postgres from lesson-02)
- gh CLI (already authed as `vallabha108`)
- A Neon account (free tier) for lesson-08 dry-runs
- A Resend account (free tier) for lesson-03 magic links

Each lesson's README lists its **new** prerequisites at the top so you can
warn learners ahead of time.

---

## How a lesson is structured

Every lesson is **simultaneously** three things:

1. **A tag** — `lesson-03` — a working snapshot of the app at that stage
2. **A folder** — `lessons/03-auth/` — narrative, exercises, solution
3. **A diff** — `git diff lesson-02..lesson-03` — the minimum change set

The narrative explains *why*. The diff shows *what*. The exercises validate
*understanding*.

---

## Running a session (90-minute slot)

| Minute | Activity | Notes |
|--------|----------|-------|
| 0–10   | Recap previous lesson, demo new lesson's end state | `git checkout lesson-N` and run it live |
| 10–25  | Walk the diff with screen share | Use `git diff lesson-(N-1)..lesson-N -- src/` |
| 25–35  | Explain the trade-off vs. vallabha_vle | Refer to `docs/COMPARISON.md` |
| 35–80  | Learners do the exercises (easy + medium) | You float; record questions for the FAQ |
| 80–90  | Hard exercise debrief, preview next lesson | Hard exercise is homework |

---

## How to test a lesson before teaching it

Run this **before every session**. Treat it as a smoke test:

```
git checkout lesson-N
pnpm install --frozen-lockfile
cp .env.example .env.local       # fill in secrets
pnpm db:push                     # if lesson-02+
pnpm db:seed                     # if lesson-02+
pnpm test                        # vitest unit tests (lesson-01+)
pnpm test:e2e                    # playwright (lesson-05+)
pnpm dev                         # eyeball it at http://localhost:3000
```

If any step fails, the lesson is broken. Fix on a branch, retag, push.

A turn-key script lives at `scripts/test-lesson.sh N` — runs the above and
returns non-zero on any failure. Use it in pre-flight.

---

## Grading rubric (per exercise)

| Score | Meaning |
|-------|---------|
| 0     | No attempt or non-runnable |
| 1     | Compiles but wrong behaviour |
| 2     | Correct happy path, no tests, no edge cases |
| 3     | Correct + at least one unit test + handles one edge case |
| 4     | Production-quality: tests, error handling, docs, follows repo conventions |

Pass mark per lesson: **average ≥ 2.5 across easy + medium** (hard is bonus).

---

## Onboarding a new learner

1. Send them [`docs/LEARNER.md`](LEARNER.md).
2. Verify their machine prereqs in a 15-min screen share.
3. Have them run `git checkout lesson-00 && cat README.md` — confirms clone works.
4. Schedule 10 sessions @ 90 min each (typically weekly).
5. Give them write access to a fork; they push PRs back for review.

---

## When a learner is stuck — debug ladder

1. **Did they run `pnpm install --frozen-lockfile`?** (90% of issues)
2. **Are they on the right tag?** `git log --oneline -1` should show the lesson tag.
3. **Is `.env.local` populated?** Compare with `.env.example`.
4. **Is Docker Postgres running?** `docker ps | grep postgres`.
5. **Did Drizzle migrate?** `pnpm db:push` then `pnpm db:studio`.
6. **Check the FAQ:** `docs/FAQ.md` (grows over time — add their question after solving).
7. **Diff their work against the solution:** `git diff lesson-N..lesson-N-solution -- src/`.

---

## Course-end deliverable

By the end of lesson-10 each learner should have:

- Their own fork at `lesson-10` running locally
- A deployed Cloud Run URL (from lesson-09)
- A markdown postmortem (from lesson-10) of one bug they hit and fixed
- A side-by-side reflection comparing their preferred choice (Prisma vs.
  Drizzle, Firebase vs. Auth.js, etc.) — this is the actual learning
  outcome of running the two-repo experiment

Stash these in `docs/learner-reflections/` (private fork only).

---

## Roadmap for this doc

This file evolves as you teach the course. After each cohort:

- Add real FAQ entries with verbatim questions
- Update timing estimates if a section consistently overran
- Add screenshots once the UI stabilises (lesson-05+)
