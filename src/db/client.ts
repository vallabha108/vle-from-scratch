import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url =
  process.env.DATABASE_URL ?? "postgresql://vle:vle@localhost:55432/vle_dev";

// One client per process. Re-export the driver and Drizzle handle so
// scripts can run raw SQL when needed (seeds, teardown).
export const sqlClient = postgres(url, { max: 5 });
export const db = drizzle(sqlClient, { schema, logger: false });
export { schema };
