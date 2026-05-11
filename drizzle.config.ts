import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://vle:vle@localhost:55432/vle_dev",
  },
  strict: true,
  verbose: true,
} satisfies Config;
