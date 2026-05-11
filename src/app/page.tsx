import { auth } from "@/auth";
import Link from "next/link";
import { Lessons } from "@/components/Lessons";

export default async function HomePage() {
  const session = await auth();
  const signedIn = !!session?.user;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12 flex items-start justify-between gap-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-brand">
            Vallabha Systems · Teaching artefact
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            VLE From Scratch
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            A 10-lesson companion course. Each lesson is a tag. Each tag is
            a working app. You are at{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">
              lesson-03
            </code>
            : magic-link sign-in just landed.
          </p>
        </div>
        <Link
          href={signedIn ? "/dashboard" : "/login"}
          className="shrink-0 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-fg hover:opacity-90"
        >
          {signedIn ? "Open dashboard" : "Sign in"}
        </Link>
      </header>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Roadmap</h2>
        <Lessons />
      </section>

      <footer className="mt-16 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <p>
          Source:{" "}
          <a className="underline" href="https://github.com/vallabha108/vle-from-scratch">
            github.com/vallabha108/vle-from-scratch
          </a>
          {" · "}
          Production sibling:{" "}
          <a className="underline" href="https://github.com/vallabha108/vallabha_vle">
            vallabha_vle
          </a>
        </p>
      </footer>
    </main>
  );
}
