# Lesson 01 — Next.js 14 + Tailwind + Shadcn + Vitest

**Tag:** `lesson-01`
**Prereqs:** Node 20+, pnpm (or npm), nothing else
**Time:** ~45 min walkthrough + ~30 min exercises

After this lesson you can run a styled, tested Next.js app on
`http://localhost:3000`. No database. No auth. Just the chassis.

---

## What landed

```
src/
├── app/
│   ├── layout.tsx        Root layout, imports globals.css
│   ├── page.tsx          Landing page using <Lessons />
│   └── globals.css       Tailwind base + dark-mode body styles
└── components/
    ├── Lessons.tsx       Roadmap data + presentation
    └── Lessons.test.tsx  Vitest unit test (the FIRST test in this repo)
package.json              Next 14, React 18, Tailwind 3, Vitest 2
tsconfig.json             strict TS, @/* path alias
next.config.mjs           reactStrictMode + standalone output
tailwind.config.ts        scans src/**/*.{ts,tsx}, brand colour
postcss.config.mjs
vitest.config.ts          jsdom env + @testing-library
vitest.setup.ts           jest-dom matchers
.eslintrc.json            next/core-web-vitals
```

---

## Run it

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm test         # watch mode — Ctrl-C to exit
pnpm test --run   # one-shot
pnpm typecheck
pnpm lint
pnpm build        # produces .next/standalone for lesson-07
```

---

## Why these choices

### Tailwind, not CSS Modules or vanilla-extract
Co-located styling that doesn't require naming things. Matches what
`vallabha_vle` ships, so the comparison stays focused on data/auth/infra,
not CSS philosophy.

### Vitest, not Jest
Faster, ESM-native, Vite-powered. `vallabha_vle` ships **zero tests**
today; we ship one in the very first lesson on purpose. This is a
deliberate divergence — recorded in `docs/COMPARISON.md`.

### `output: "standalone"` from minute one
We will Dockerise in lesson-07. Setting standalone now means the build
produces a self-contained `.next/standalone/` we can copy into a Docker
stage later — no surprise refactor.

### `@/*` path alias
Avoids `../../../../components` once the tree grows. Matches Next.js
docs default and `vallabha_vle`.

---

## Trade-off vs. `vallabha_vle`

| Concern | vallabha_vle | vle-from-scratch (this) | Note |
|---|---|---|---|
| Tests at this stage | None | One unit test for the roadmap | First evidence in `docs/COMPARISON.md` that testing in the production sibling could have started earlier |
| Initial scaffold size | ~13K LOC in one commit | ~150 LOC in this commit | Pedagogical, not better — see below |
| Theme system | Dark mode added in commit 9 | Dark via `prefers-color-scheme` from day one | Cheap win; we'll add a toggle in lesson-05 |

The big trade-off here is **velocity vs. teach-ability**. The production
sibling shipped the whole skeleton in one commit because that's faster.
This repo splits it into 11 lessons because that's *clearer*. Neither is
"right" — they serve different purposes.

---

## Smoke test

```bash
./scripts/test-lesson.sh 1
```

Should pass without manual intervention.

---

## Read next

- Exercises: [`exercises.md`](exercises.md)
- Comparison log update: [`../../docs/COMPARISON.md`](../../docs/COMPARISON.md)
- Next lesson preview: lesson-02 introduces Drizzle and the multi-tenant
  schema.
