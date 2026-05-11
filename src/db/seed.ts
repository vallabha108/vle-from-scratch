/**
 * Idempotent seed. Re-runnable. Truncates first, then inserts.
 *
 * Why truncate-then-insert and not upsert?
 *   - Smaller code, easier to read in a teaching context.
 *   - Multi-tenant invariants are easier to assert from a clean slate.
 *   - For production data import we'd upsert; for dev/teaching, reset.
 */
import { sqlClient, db } from "./client";
import { tenants, users, programs, weeks, modules } from "./schema";

async function main() {
  console.log("Seeding…");

  // Clean slate (cascades through FKs).
  await sqlClient`TRUNCATE TABLE tenants CASCADE`;

  const [vallabha] = await db
    .insert(tenants)
    .values({
      name: "Vallabha Systems",
      slug: "vallabha",
      domain: "vallabhasystems.com",
    })
    .returning();

  const [demo] = await db
    .insert(tenants)
    .values({
      name: "Demo Customer Inc",
      slug: "demo",
      domain: "demo.example.com",
    })
    .returning();

  await db.insert(users).values([
    {
      tenantId: vallabha.id,
      email: "prem@vallabhasystems.com",
      name: "Prem Narayanan",
      role: "SUPER_ADMIN",
    },
    {
      tenantId: vallabha.id,
      email: "instructor@vallabhasystems.com",
      name: "Sample Instructor",
      role: "INSTRUCTOR",
    },
    {
      tenantId: demo.id,
      email: "alice@demo.example.com",
      name: "Alice Learner",
      role: "LEARNER",
    },
    {
      tenantId: demo.id,
      email: "bob@demo.example.com",
      name: "Bob Learner",
      role: "LEARNER",
    },
  ]);

  const [program] = await db
    .insert(programs)
    .values({
      tenantId: vallabha.id,
      title: "AI Engineering Enablement (Mini)",
      description:
        "A trimmed teaching program: 3 weeks, 2 modules each. " +
        "Vehicle to demonstrate the multi-tenant schema end-to-end.",
      totalWeeks: 3,
    })
    .returning();

  const weekRows = await db
    .insert(weeks)
    .values([
      {
        programId: program.id,
        weekNumber: 1,
        title: "Foundations",
        description: "What is AI engineering?",
      },
      {
        programId: program.id,
        weekNumber: 2,
        title: "RAG Pipelines",
        description: "Retrieval-augmented generation end to end.",
      },
      {
        programId: program.id,
        weekNumber: 3,
        title: "Production",
        description: "Observability, evals, rollback.",
      },
    ])
    .returning();

  const moduleRows = weekRows.flatMap((w) => [
    {
      tenantId: vallabha.id,
      weekId: w.id,
      title: `Week ${w.weekNumber} · Lecture`,
      description: "Core concepts.",
      durationMinutes: 45,
      order: 1,
    },
    {
      tenantId: vallabha.id,
      weekId: w.id,
      title: `Week ${w.weekNumber} · Lab`,
      description: "Hands-on exercise.",
      durationMinutes: 60,
      order: 2,
    },
  ]);

  await db.insert(modules).values(moduleRows);

  console.log(
    `Seeded: 2 tenants, 4 users, 1 program, ${weekRows.length} weeks, ${moduleRows.length} modules`,
  );
  await sqlClient.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
