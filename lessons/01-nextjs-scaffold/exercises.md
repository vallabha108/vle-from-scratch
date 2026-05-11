# Lesson 01 — Exercises

Do **easy** and **medium**. **Hard** is optional but encouraged.

For each exercise, commit your answer in a branch named
`exercises/lesson-01/<your-initials>` in your fork.

---

## Easy — Add an "Author" line

**Task:** Show "Authored by Dr. Premnath K. Narayanan" in the page
footer.

**Pass criteria:**
- Visible in the rendered page
- Implemented as a separate component in `src/components/`
- Imported by `src/app/page.tsx`

**Hint:** Mirror the existing `<Lessons />` component pattern.

---

## Medium — Tag-link the roadmap

**Task:** Make each `lesson-NN` code badge in the roadmap a clickable link
to the corresponding GitHub tag, e.g.
`https://github.com/vallabha108/vle-from-scratch/tree/lesson-02`.

**Pass criteria:**
- Only `done` and `next` lessons are clickable; `planned` are not
- External links open in a new tab and have `rel="noopener noreferrer"`
- Existing tests still pass (and you added at least one new test asserting
  link presence on `lesson-01`)

**Hint:** `LESSONS` already has a `status` field — use it.

---

## Hard — Build a test that fails the build

**Task:** Add a Vitest test that **fails** if any of these are true:
1. `LESSONS` is not sorted by tag ascending
2. A `done` lesson appears *after* a `planned` lesson
3. More than one lesson has `status: "next"`

These are invariants of the roadmap that we want to enforce as the file
evolves. Make the failure messages helpful — a future you (or a learner)
should know what to fix.

**Pass criteria:**
- New test file `src/components/Lessons.invariants.test.tsx`
- All three invariants asserted individually
- Each assertion's failure message names the offending entry
- `pnpm test --run` passes today; deliberately break `LESSONS` to verify
  each invariant fires, then revert

**Bonus:** make the invariant test runnable via `pnpm test:invariants`
(define the script in `package.json`).

---

## What to write up

After finishing, append a short note to `docs/FAQ.md` if you got stuck.
Add a row to `docs/COMPARISON.md` if you noticed something the production
sibling does differently that we haven't recorded yet.
