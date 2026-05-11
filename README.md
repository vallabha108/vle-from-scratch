# VLE From Scratch

A 10-lesson companion course that builds a multi-tenant Virtual Learning
Environment from zero. Sister project to
[vallabha_vle](https://github.com/vallabha108/vallabha_vle) (the production
platform). Each lesson is a tagged commit. Each tag is a working app.

> Maintained by Vallabha Systems · https://vallabhasystems.com
> Author: Dr. Premnath K. Narayanan, PhD

---

## Why two repos?

`vallabha_vle` is the real product — built pragmatically, deployed to
production, full of hard-won decisions. This repo (`vle-from-scratch`) builds
a smaller cousin **deliberately**, lesson by lesson, with **different
technology choices** so learners can see the trade-offs side by side.

| Concern              | vallabha_vle (production) | vle-from-scratch (teaching) | Trade-off the comparison teaches |
|----------------------|----------------------------|------------------------------|----------------------------------|
| ORM                  | Prisma                     | Drizzle                      | DX & migrations vs. SQL transparency & bundle size |
| Auth                 | Firebase Auth              | Auth.js v5 (NextAuth)        | Hosted convenience vs. self-hosted control & no vendor lock-in |
| Postgres host        | Cloud SQL (provisioned)    | Neon (serverless branching)  | Predictable cost & latency vs. cheap dev, branch-per-PR |
| IaC                  | Terraform (HCL)            | Pulumi (TypeScript)          | Mature ecosystem vs. real language for control flow |
| CI/CD                | Cloud Build                | GitHub Actions               | Tight GCP integration vs. portability |
| Tests                | Manual                     | Vitest + Playwright from L1  | Why TDD matters in real projects |
| Deploy target        | Cloud Run                  | Cloud Run                    | (held constant on purpose) |
| UI kit               | Tailwind + Shadcn          | Tailwind + Shadcn            | (held constant on purpose) |

Two variables are deliberately held constant (deploy target, UI kit) so the
comparison stays focused on data, auth, infra, and process.

---

## The 10 lessons

| Tag         | Title                                   | What you can do after this lesson |
|-------------|-----------------------------------------|------------------------------------|
| `lesson-00` | Project setup & teaching framing        | Read the roadmap, run `npm install`, understand the grading rubric |
| `lesson-01` | Next.js 14 App Router + Tailwind + Shadcn | See a styled landing page running locally |
| `lesson-02` | Drizzle schema for multi-tenancy        | `pnpm db:push` against local Docker Postgres; see Tenant/User/Program/Week/Module tables |
| `lesson-03` | Auth.js v5 email + magic link           | Sign in, get a session cookie, protected routes redirect |
| `lesson-04` | RBAC: roles + scoped middleware         | Learner cannot see /admin; admin cannot mutate other tenants |
| `lesson-05` | Learner UX: dashboard, weekly plan, module pages | Click through a seeded program end-to-end |
| `lesson-06` | Progress tracking + telemetry           | Mark modules complete; see ActivityLog rows in DB |
| `lesson-07` | Dockerise (multi-stage, standalone)     | `docker build && docker run` — same image you'd ship |
| `lesson-08` | Pulumi: Cloud Run + Neon + Artifact Registry | `pulumi up` provisions a working prod stack |
| `lesson-09` | GitHub Actions CI/CD                    | PR → lint/typecheck/test/build → main → deploy |
| `lesson-10` | Production pitfalls, observability, postmortems | You can debug the things that bit the production sister project |

Each lesson lives in `lessons/NN-slug/` and contains:

```
lessons/03-auth/
├── README.md       narrative + why-not-alternatives
├── exercises.md    3 graded tasks (easy / medium / hard)
└── solution/       reference solution branch
```

To jump to a lesson:

```
git checkout lesson-03
```

To compare two lessons:

```
git diff lesson-02..lesson-03 -- src/
```

---

## Who this is for

Two audiences, two onboarding docs:

- **Learners** — start at [`docs/LEARNER.md`](docs/LEARNER.md)
- **Teachers / facilitators** — start at [`docs/TEACHER.md`](docs/TEACHER.md)

There is also a [comparison log](docs/COMPARISON.md) updated after each
lesson, recording what differed between this repo and `vallabha_vle` and
which approach we (eventually) preferred.

---

## Quick start (any audience)

```
git clone https://github.com/vallabha108/vle-from-scratch
cd vle-from-scratch
cp .env.example .env.local            # fill in dev secrets later
# lesson-01 onward: pnpm install && pnpm dev
```

At `lesson-00` (this commit) there is no app yet — only the roadmap, docs,
and tooling configs.

---

## License

MIT — see [LICENSE](LICENSE). Use it, fork it, teach with it.
