export type Lesson = {
  tag: string;
  title: string;
  status: "done" | "next" | "planned";
};

export const LESSONS: Lesson[] = [
  { tag: "lesson-00", title: "Project framing & docs", status: "done" },
  { tag: "lesson-01", title: "Next.js 14 + Tailwind + Shadcn + Vitest", status: "done" },
  { tag: "lesson-02", title: "Drizzle schema for multi-tenancy", status: "done" },
  { tag: "lesson-03", title: "Auth.js v5 email magic-link", status: "next" },
  { tag: "lesson-04", title: "RBAC + scoped middleware", status: "planned" },
  { tag: "lesson-05", title: "Learner UX: dashboard, weekly plan, modules", status: "planned" },
  { tag: "lesson-06", title: "Progress tracking + telemetry", status: "planned" },
  { tag: "lesson-07", title: "Dockerise (standalone)", status: "planned" },
  { tag: "lesson-08", title: "Pulumi: Cloud Run + Neon", status: "planned" },
  { tag: "lesson-09", title: "GitHub Actions CI/CD", status: "planned" },
  { tag: "lesson-10", title: "Production pitfalls, observability, postmortems", status: "planned" },
];

export function Lessons() {
  return (
    <ol className="space-y-2">
      {LESSONS.map((l) => (
        <li
          key={l.tag}
          className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
        >
          <div>
            <code className="text-sm font-medium text-brand">{l.tag}</code>
            <span className="ml-3 text-slate-800 dark:text-slate-200">{l.title}</span>
          </div>
          <StatusPill status={l.status} />
        </li>
      ))}
    </ol>
  );
}

function StatusPill({ status }: { status: Lesson["status"] }) {
  const map: Record<Lesson["status"], string> = {
    done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    next: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    planned: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${map[status]}`}>
      {status}
    </span>
  );
}
