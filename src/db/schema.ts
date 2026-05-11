/**
 * Drizzle schema — multi-tenant core.
 *
 * Design rules (read before adding tables):
 *
 *   1. EVERY non-root table carries `tenantId` either directly or through a
 *      parent that obviously does. The `tenantId` column is the single
 *      most important field in this schema.
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
 */
import { sql } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  integer,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

// --- Enums -----------------------------------------------------------------

export const roleEnum = pgEnum("role", [
  "LEARNER",
  "INSTRUCTOR",
  "ADMIN",
  "TENANT_ADMIN",
  "SUPER_ADMIN",
]);

// --- Tables ---------------------------------------------------------------

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
    tenantId: text("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    name: text("name").notNull(),
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

// --- TS helper types for the rest of the app to import --------------------

export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Program = typeof programs.$inferSelect;
export type Week = typeof weeks.$inferSelect;
export type Module = typeof modules.$inferSelect;

/** Every table we own, in dependency order — used by tests + tooling. */
export const ALL_TABLES = [tenants, users, programs, weeks, modules] as const;
