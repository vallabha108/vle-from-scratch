# Lesson 03 — Exercises

Do **easy** and **medium**. **Hard** is optional but recommended.

Commit your answers in a branch in your fork:
`exercises/lesson-03/<your-initials>`.

---

## Easy — Show "last sign-in"

**Task:** On `/dashboard`, display the timestamp of the most recent
`session` row for the user. Format it as a relative time string
("2 minutes ago") — install `date-fns` (already a dependency in the
production sibling, so the comparison is fair).

**Pass criteria:**
- New utility in `src/lib/relative-time.ts` with a Vitest test that
  pins a fixed `new Date()` reference and asserts a known input
  formats correctly
- Dashboard renders the timestamp on every visit
- `npm run typecheck` and `npm test -- --run` stay green

---

## Medium — A real email provider behind a flag

**Task:** Implement `EMAIL_TRANSPORT=resend`. When set, the magic-link
email goes through the [Resend](https://resend.com) free tier instead
of the console.

**Pass criteria:**
- `src/auth.ts` branches on `EMAIL_TRANSPORT` cleanly (resend / console)
- `EMAIL_FROM` and `RESEND_API_KEY` are honoured
- A failing request (bad API key) does NOT block the magic-link flow —
  it logs an error and falls back to console
- `.env.example` documents both modes
- README adds a "How to switch to Resend in 60 seconds" section

**Hint:** Resend has an official Node SDK; you can also call their HTTP
API directly. Either is fine.

---

## Hard — End-to-end test (Playwright)

**Task:** Add a Playwright test that does the full magic-link dance
against a real dev server:

1. Visit `/login`, type an email, submit
2. Tail the server stdout, extract the magic link
3. Visit it
4. Assert you land on `/dashboard` and the page contains the email

**Pass criteria:**
- A new script `pnpm test:e2e` (replace the placeholder) runs Playwright
- The test isolates state — it should pass twice in a row without
  manual DB cleanup (hint: unique email per run)
- CI-friendly: tear down on failure
- Document any flake you observed and how you eliminated it

**Why:** this is the lesson where we go from "tests in unit" to "tests
across processes". Setting up the harness now pays off every lesson
afterwards.

---

## Write-up

If the magic-link flow surprised you anywhere, add an FAQ entry in
`docs/FAQ.md`. If you found a comparison-worthy difference, add it to
`docs/COMPARISON.md`.
