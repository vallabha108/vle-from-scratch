/**
 * Drizzle schema — multi-tenant core + Auth.js v5 tables.
 *
 * Design rules (read before adding tables):
 *
 *   1. EVERY non-root table carries `tenantId` either directly or through a
 *      parent that obviously does. The `tenantId` column is the single
 *      most important field in this schema.
 *      EXCEPTION: Auth.js bookkeeping tables (accounts, sessions,
 *      verificationTokens) are owned by the auth library and have no
 *      tenant — they describe identity, not domain data.
 *
 *   2. CUIDs are stored as text. We don't use serial / bigserial — they
 *      leak business volume.
 *
 *   3. Timestamps are `timestamp with time zone` (`timestamptz`). The
 *      database stores UTC; clients display local.
 *
 *   4. Use the `pgEnum`s in this file, not string columns, for closed
 *      sets — we want the DB to reject typos.
 *
 *   5. Add an index for every column you `WHERE` on. Multi-tenant apps
 *      that forget this are slow in week 2.
 *
 *   6. `users.tenantId` is NULLABLE: Auth.js inserts users before we know
 *      which tenant they belong to. A post-signin event resolves the
 *      tenant from the email domain (see src/auth.ts). Application code
 *      that reads domain data MUST treat a null tenantId as "not yet
 *      assigned" and reject the request.
 */
import { sql } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  integer,
  timestamp,
  primaryKey,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import type { AdapterAccountType } from "next-auth/adapters";

// --- Enums -----------------------------------------------------------------

export const roleEnum = pgEnum("role", [
  "LEARNER",
  "INSTRUCTOR",
  "ADMIN",
  "TENANT_ADMIN",
  "SUPER_ADMIN",
]);

// --- Domain tables ---------------------------------------------------------

export const tenants = pgTable(
  "tenants",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    domain: text("domain"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    slugUq: uniqueIndex("tenants_slug_uq").on(t.slug),
    domainIdx: index("tenants_domain_idx").on(t.domain),
  }),
);

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    // NULLABLE on purpose — Auth.js inserts before tenant resolution.
    tenantId: text("tenant_id").references(() => tenants.id, {
      onDelete: "cascade",
    }),
    email: text("email").notNull(),
    // Auth.js fields. emailVerified is set when the magic link is clicked.
    emailVerified: timestamp("email_verified", { withTimezone: true }),
    name: text("name").notNull().default(""),
    image: text("image"),
    role: roleEnum("role").notNull().default("LEARNER"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    emailUq: uniqueIndex("users_email_uq").on(t.email),
    tenantIdx: index("users_tenant_idx").on(t.tenantId),
    roleIdx: index("users_role_idx").on(t.role),
  }),
);

export const programs = pgTable(
  "programs",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    totalWeeks: integer("total_weeks").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    tenantIdx: index("programs_tenant_idx").on(t.tenantId),
  }),
);

export const weeks = pgTable(
  "weeks",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    programId: text("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),
    weekNumber: integer("week_number").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    programWeekUq: uniqueIndex("weeks_program_week_uq").on(
      t.programId,
      t.weekNumber,
    ),
    programIdx: index("weeks_program_idx").on(t.programId),
  }),
);

export const modules = pgTable(
  "modules",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    weekId: text("week_id")
      .notNull()
      .references(() => weeks.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    durationMinutes: integer("duration_minutes").notNull().default(0),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    weekIdx: index("modules_week_idx").on(t.weekId),
    tenantIdx: index("modules_tenant_idx").on(t.tenantId),
    orderIdx: index("modules_order_idx").on(t.order),
  }),
);

// --- Auth.js v5 tables (owned by @auth/drizzle-adapter) -------------------
//
// Column names follow the adapter's defaults exactly. Renaming requires a
// custom adapter map — not worth it.

export const accounts = pgTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.provider, t.providerAccountId] }),
  }),
);

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.identifier, t.token] }),
  }),
);

// --- Helpers --------------------------------------------------------------

export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Program = typeof programs.$inferSelect;
export type Week = typeof weeks.$inferSelect;
export type Module = typeof modules.$inferSelect;

/** Domain tables in dependency order. Auth.js tables are excluded — they
 *  are not domain data and the invariant rules do not apply. */
export const ALL_TABLES = [tenants, users, programs, weeks, modules] as const;
