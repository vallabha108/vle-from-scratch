# Lesson 03 — Auth.js v5 magic-link sign-in

**Tag:** `lesson-03`
**Prereqs:** Everything from lesson-02 (Docker Postgres running, schema pushed)
**Time:** ~75 min walk + ~45 min exercises

After this lesson you can request a magic link from `/login`, click it
in the dev terminal, and land on a protected `/dashboard` that shows
your session — including the tenant resolved from your email domain.
No email provider, no third-party signup needed.

---

## What landed

```
src/auth.ts                                Auth.js v5 config + tenant-resolution hook
src/app/api/auth/[...nextauth]/route.ts    Catch-all auth route (GET/POST handlers)
src/app/login/page.tsx                     Server-action sign-in form
src/app/dashboard/page.tsx                 Protected example page, shows session
src/middleware.ts                          Protects /dashboard/*
src/db/schema.ts                           +accounts, +sessions, +verificationToken
                                           users gained: emailVerified, image,
                                           name default '', tenantId NULLABLE
drizzle/0001_lesson03_auth.sql             generated migration (additive)
```

New runtime dependencies: `next-auth@5.0.0-beta.25`, `@auth/drizzle-adapter`, `nodemailer`.

---

## End-to-end smoke test

```bash
# 1. Make sure Postgres is up and migrated.
npm run docker:up
npm run db:push          # adds accounts/sessions/verificationToken tables

# 2. Add the only secret we need today to .env.local
echo 'AUTH_SECRET="'"$(openssl rand -base64 32)"'"' >> .env.local
echo 'EMAIL_TRANSPORT="console"' >> .env.local

# 3. Run the app
npm run dev
```

Then in a browser:

1. Visit http://localhost:3000 → click **Sign in**.
2. Enter any email. Try `alice@demo.example.com` (the seed maps that
   domain to the **demo** tenant).
3. The page redirects to `/login?sent=1` ("Magic link sent. Check the
   terminal…").
4. In the terminal running `npm run dev` you'll see:

   ```
   ────────────────────────────────────────────────────────────────────────
   📧  MAGIC LINK for alice@demo.example.com

      http://localhost:3000/api/auth/callback/nodemailer?callbackUrl=…&token=…

      (copy/paste into a browser to sign in)
   ────────────────────────────────────────────────────────────────────────
   ```

5. Copy the URL, paste it in the browser, hit Enter.
6. You land on `/dashboard` showing your email, the resolved tenant id,
   and your role (`LEARNER`).

Try visiting `/dashboard` directly in a private window — the middleware
redirects you to `/login`. That's auth working.

---

## Why these choices

### Auth.js v5 (next-auth beta), not Firebase
- **No vendor lock-in.** Identity rows live in your own Postgres,
  next to the rest of the domain. Easy to back up, easy to leave.
- **Cheaper at scale.** No per-MAU charge.
- **Magic links are great for a learning audience.** No passwords for
  students to forget; works fine with throwaway emails.
- The cost: you operate the email provider. We side-step that in dev
  with the console transport.

### `session: "database"`, not JWT
- Server can revoke a session instantly (delete the row). With JWT you
  have to wait for it to expire.
- Slightly more DB load on every request — fine until you're at scale.

### `users.tenantId` is NULLABLE
- The Auth.js adapter creates the user row before any of our callbacks
  run. We don't know the tenant yet.
- The `events.createUser` hook fills it in synchronously after creation
  by matching the email domain against `tenants.domain`. Unknown
  domains fall back to the **demo** tenant.
- Schema invariant test was updated to allow nullable; documented inline.

### Console magic links in dev
- Onboarding a learner to this lesson must not require signing up for an
  email provider. `EMAIL_TRANSPORT=console` prints the link to stdout.
- Production swap-in (`EMAIL_TRANSPORT=resend`) is an exercise for
  later.

---

## Compare with `vallabha_vle` (Firebase Auth)

| Concern | vallabha_vle (Firebase) | vle-from-scratch (Auth.js) | Notes |
|---|---|---|---|
| Identity store | Firebase Auth (vendor) | Postgres rows in your DB | Auth.js wins on portability; Firebase wins on MFA-out-of-the-box |
| Session model | Firebase ID token → session cookie (`__session`) | DB-backed session, opaque token cookie | Track A wins for instant revocation |
| Two stores to keep in sync | YES — Firebase Auth + Prisma User | NO — one users table | A whole category of bugs (vallabha_vle PITFALLS §6) disappears |
| Cost | per MAU | per Postgres row + email send | Negligible at < 10k learners either way |
| Failure-mode complexity | 4-step chain (see vallabha_vle docs/AUTH-FLOW.md) | 1 chain: form → DB → cookie | Track A wins for debugging |
| Magic link in dev | n/a (Firebase has no built-in console mode) | yes, via `EMAIL_TRANSPORT=console` | Onboarding friction much lower |

**Verdict (lesson-03):** for a teaching artefact and an early-stage SaaS,
Auth.js is the right call. Firebase makes sense if your team is already
in the Firebase ecosystem or you need its MFA/SMS features cheaply.
Recorded in [`docs/COMPARISON.md`](../../docs/COMPARISON.md).

---

## Pitfalls

### A. `AUTH_SECRET` missing
**Symptom:** Build or runtime errors mentioning `AUTH_SECRET`.
**Fix:** `openssl rand -base64 32` into `.env.local` (one line).
Never reuse the dev value in production.

### B. Magic link URL shows `https://` in dev
**Symptom:** Clicking the link 404s.
**Cause:** `AUTH_URL` set to https in dev.
**Fix:** Leave `AUTH_URL` unset locally — Auth.js infers it. Only set
it in production where you have a fixed origin.

### C. "Untrusted host" error in production-like containers
**Symptom:** Auth.js refuses to issue cookies behind a proxy.
**Fix:** Set `AUTH_TRUST_HOST=true`. We'll wire this in Terraform in
lesson-08 for Cloud Run.

### D. Tenant shows "(not assigned)" on first sign-in
**Symptom:** Dashboard shows no tenant id for ~1 page load.
**Cause:** The `createUser` event runs after the row is inserted but
just before the session is established. Almost never visible, but a
race can show it on the very first request after sign-in.
**Workaround:** refresh once. Real fix is to do the assignment in a
trigger or to make the adapter aware — both out of scope here.

---

## Read next

- Exercises: [`exercises.md`](exercises.md)
- Lesson 04 will add role-based access control: an `/admin` page that
  only `ADMIN`+ roles can see, plus a query helper that enforces
  tenant scope on every read.
