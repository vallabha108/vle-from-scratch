# Learner Onboarding

Welcome. By the end of this course you will have built — from an empty
folder — a multi-tenant SaaS Virtual Learning Environment that runs in
production on Google Cloud. Same shape as Vallabha Systems' real product,
just smaller and with deliberately different tech choices so you can argue
about trade-offs.

---

## What you need before lesson-01

- Node.js 20+ — `node --version` should print `v20.x.x` or higher
- pnpm 9+ — install with `npm i -g pnpm`
- Docker Desktop — running, even just idling in the menu bar
- A GitHub account
- A code editor — VS Code is what we'll demo with
- Roughly 8 GB free disk

Optional but recommended:

- A free [Neon](https://neon.tech) account (used from lesson-08)
- A free [Resend](https://resend.com) account (used from lesson-03 for emails)

---

## First-time setup

```bash
git clone https://github.com/vallabha108/vle-from-scratch
cd vle-from-scratch
git checkout lesson-00      # start at the beginning
cat README.md               # read the roadmap
```

At `lesson-00` there is no app to run yet. That's the point — you'll watch
it grow under your hands.

---

## How to work through a lesson

Each lesson lives in `lessons/NN-slug/`:

```
lessons/03-auth/
├── README.md       Read this first. Story + concepts + trade-offs.
├── exercises.md    Do these. 3 tasks: easy → medium → hard.
└── solution/       Peek only after you've tried.
```

**Recommended loop per lesson:**

1. `git checkout lesson-(N-1)` — start from the previous lesson's end state.
2. Read `lessons/NN-*/README.md`.
3. Compare the diff: `git diff lesson-(N-1)..lesson-N -- src/`.
4. Reproduce the diff yourself (don't copy-paste — type it).
5. Run the lesson's smoke test: `./scripts/test-lesson.sh N`.
6. Do `exercises.md`. Commit your answers in your fork.
7. Only then peek at `solution/`.

**Forbidden:** running `git checkout lesson-N` before you've tried to
reproduce it. The struggle is the point.

---

## How to ask for help

When stuck, give your teacher these four things — in this order:

1. **Lesson tag**: `git rev-parse --abbrev-ref HEAD`
2. **What you expected to happen**
3. **What actually happened** (paste exact error)
4. **What you've already tried** (at least two things)

Without all four, the answer will be "try two things and come back."

---

## Grading

Each exercise is scored 0–4 (see `docs/TEACHER.md` for the rubric). Pass
mark per lesson is average ≥ 2.5 on easy + medium. Hard is bonus and
recommended if you want to actually understand the topic.

---

## Final deliverable

By the end of lesson-10 you will produce:

1. Your own deployed Cloud Run URL with your fork's name in it
2. A short markdown postmortem of one real bug you hit and fixed
3. A one-page reflection: **which of the two repos' choices would you
   adopt in your own work, and why** — Prisma or Drizzle, Firebase or
   Auth.js, Terraform or Pulumi, Cloud Build or GitHub Actions.

That reflection IS the learning outcome. The code is just a vehicle.
