import { describe, it, expect } from "vitest";
import { getTableName, getTableColumns } from "drizzle-orm";
import {
  ALL_TABLES,
  tenants,
  users,
  programs,
  weeks,
  modules,
} from "./schema";

/**
 * Schema invariants — pure, no DB needed.
 *
 * Asserts the design rules from schema.ts. If a teammate adds a new table
 * without a tenant scope, or forgets created_at, these fail loudly.
 */

const columnNames = (table: any): string[] =>
  Object.values(getTableColumns(table)).map((c: any) => c.name);

describe("schema invariants", () => {
  it("every non-tenants table has a tenant scope (direct or via parent)", () => {
    // Direct tenantId (users is nullable: Auth.js inserts before tenant
    // resolution; see schema.ts §6).
    expect(columnNames(users)).toContain("tenant_id");
    expect(columnNames(programs)).toContain("tenant_id");
    expect(columnNames(modules)).toContain("tenant_id");
    // Scoped via parent
    expect(columnNames(weeks)).toContain("program_id");
  });

  it("every table has created_at", () => {
    for (const t of ALL_TABLES) {
      expect(columnNames(t)).toContain("created_at");
    }
  });

  it("ALL_TABLES is in dependency order (parents before children)", () => {
    const order = ALL_TABLES.map((t) => getTableName(t) as string);
    const i = (n: string) => order.indexOf(n);
    expect(i("tenants")).toBeLessThan(i("users"));
    expect(i("tenants")).toBeLessThan(i("programs"));
    expect(i("programs")).toBeLessThan(i("weeks"));
    expect(i("weeks")).toBeLessThan(i("modules"));
    expect(i("tenants")).toBeLessThan(i("modules"));
  });

  it("exposes the 5 core tables", () => {
    expect(getTableName(tenants)).toBe("tenants");
    expect(getTableName(users)).toBe("users");
    expect(getTableName(programs)).toBe("programs");
    expect(getTableName(weeks)).toBe("weeks");
    expect(getTableName(modules)).toBe("modules");
    expect(ALL_TABLES).toHaveLength(5);
  });
});
