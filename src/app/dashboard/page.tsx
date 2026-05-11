import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const u = session.user as {
    email?: string | null;
    name?: string | null;
    tenantId?: string | null;
    role?: string;
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-8 flex items-start justify-between gap-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-brand">
            Signed in
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Welcome{u.name ? `, ${u.name}` : ""}.
          </h1>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
            Sign out
          </button>
        </form>
      </header>

      <section className="rounded-md border border-slate-200 p-5 dark:border-slate-800">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Session
        </h2>
        <dl className="mt-3 grid grid-cols-1 gap-y-2 text-sm sm:grid-cols-3">
          <dt className="font-medium text-slate-500">Email</dt>
          <dd className="sm:col-span-2">{u.email ?? "—"}</dd>
          <dt className="font-medium text-slate-500">Tenant</dt>
          <dd className="sm:col-span-2">{u.tenantId ?? "(not assigned)"}</dd>
          <dt className="font-medium text-slate-500">Role</dt>
          <dd className="sm:col-span-2">
            <code className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">
              {u.role ?? "LEARNER"}
            </code>
          </dd>
        </dl>
      </section>

      <p className="mt-8 text-sm text-slate-500">
        Lesson 03 deliverable: you got here through a magic link. Lesson 04
        will add role-scoped routes (an <code>/admin</code> page that
        learners cannot see).
      </p>
    </main>
  );
}
