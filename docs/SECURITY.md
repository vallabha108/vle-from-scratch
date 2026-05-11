# Security

## How we treat `npm audit`

After every dependency change, run:

```bash
npm audit --omit=dev    # what actually ships to users
npm audit               # full picture incl. dev tools
```

Triage rule:

| Surface                | Action |
|------------------------|--------|
| Direct production dep  | Patch within 24 h |
| Transitive production dep, exploitable at runtime | Patch within 7 d |
| Transitive production dep, **build-time only** (tooling) | Track here, patch when upstream releases |
| Dev-only dep           | Patch on a quiet day; never block a lesson on it |

`audit` does not distinguish "runtime" from "build-time" transitives — you
have to inspect with `npm ls <pkg>` and ask: does this code run inside the
deployed image, or only on a developer/CI machine?

---

## Currently known (accepted) findings

As of `lesson-01`:

### postcss < 8.5.10 inside `next`
- **Path:** `next > postcss@8.4.31`
- **Advisory:** GHSA-qx2v-qp2m-jg93 (XSS via unescaped `</style>` in CSS
  stringify output)
- **Why accepted:** PostCSS runs only at **build time** inside the
  Next.js compiler. The shipped JS/CSS bundle does not include PostCSS.
  No user input ever reaches the vulnerable code path.
- **Removal path:** when `next` bumps its internal `postcss` constraint
  (currently `^8.4.14`). Track Next.js releases.

### esbuild <= 0.24.2 (via vitest → vite)
- **Path:** `vitest > vite > esbuild`
- **Advisory:** GHSA-67mh-4wv8-2f99 (esbuild dev server allows any origin)
- **Why accepted:** Dev-only. Not in production image. Vitest does not
  start an esbuild dev server in our setup.
- **Removal path:** vitest will pull a newer vite when it next majors.

---

## Reporting

Found something we missed? Open a private security advisory:
https://github.com/vallabha108/vle-from-scratch/security/advisories/new

Do not file public issues for vulnerabilities.
