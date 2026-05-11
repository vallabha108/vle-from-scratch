/**
 * Auth.js v5 (next-auth beta) wiring.
 *
 * - DrizzleAdapter persists users/accounts/sessions/verificationTokens.
 * - Email magic links: the body is whatever sendVerificationRequest does.
 *   In dev (EMAIL_TRANSPORT=console) we print the link to stdout — no
 *   email provider needed to onboard a learner to lesson-03.
 * - Tenant resolution: when a user is created (first sign-in), the
 *   `events.createUser` hook resolves a tenant from the email domain.
 *   Unrecognised domains land in the "demo" tenant (seeded in seed.ts).
 *   This keeps `users.tenantId` null only for a few hundred milliseconds.
 */
import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { tenants, users, accounts, sessions, verificationTokens } from "@/db/schema";

const EMAIL_TRANSPORT = process.env.EMAIL_TRANSPORT ?? "console";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: "database" },
  pages: { signIn: "/login" },
  providers: [
    Nodemailer({
      // streamTransport keeps Nodemailer happy without actually sending.
      // We override sendVerificationRequest below anyway.
      server: {
        streamTransport: true,
        newline: "unix",
        buffer: true,
      },
      from: process.env.EMAIL_FROM ?? "noreply@vle-from-scratch.local",
      sendVerificationRequest: async ({ identifier, url }) => {
        if (EMAIL_TRANSPORT === "console") {
          // Make this very visible in the dev terminal.
          /* eslint-disable no-console */
          console.log(
            "\n" +
              "─".repeat(72) +
              "\n📧  MAGIC LINK for " +
              identifier +
              "\n\n   " +
              url +
              "\n\n   (copy/paste into a browser to sign in)\n" +
              "─".repeat(72) +
              "\n",
          );
          /* eslint-enable no-console */
          return;
        }
        // Future: resend / nodemailer SMTP branches go here.
        throw new Error(`EMAIL_TRANSPORT=${EMAIL_TRANSPORT} not implemented`);
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Expose tenantId + role on the session for server components.
      const [u] = await db
        .select({ tenantId: users.tenantId, role: users.role })
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          tenantId: u?.tenantId ?? null,
          role: u?.role ?? "LEARNER",
        },
      };
    },
  },
  events: {
    async createUser({ user }) {
      if (!user.email || !user.id) return;
      // Resolve tenant from email domain. Anything unrecognised → demo.
      const domain = user.email.split("@")[1]?.toLowerCase() ?? "";
      const [match] = await db
        .select({ id: tenants.id })
        .from(tenants)
        .where(eq(tenants.domain, domain))
        .limit(1);
      let tenantId: string | undefined = match?.id;
      if (!tenantId) {
        const [demo] = await db
          .select({ id: tenants.id })
          .from(tenants)
          .where(eq(tenants.slug, "demo"))
          .limit(1);
        tenantId = demo?.id;
      }
      if (tenantId) {
        await db
          .update(users)
          .set({ tenantId })
          .where(eq(users.id, user.id));
      }
    },
  },
});
