import { Lessons } from "@/components/Lessons";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12">
        <p className="text-sm font-medium uppercase tracking-widest text-brand">
          Vallabha Systems · Teaching artefact
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          VLE From Scratch
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          A 10-lesson companion course. Each lesson is a tag. Each tag is a
          working app. You are at <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">lesson-01</code>:
          the Next.js skeleton just landed.
        </p>
      </header>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Roadmap</h2>
        <Lessons />
      </section>

      <footer className="mt-16 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <p>
          Source: <a className="underline" href="https://github.com/vallabha108/vle-from-scratch">github.com/vallabha108/vle-from-scratch</a>
          {" · "}
          Production sibling: <a className="underline" href="https://github.com/vallabha108/vallabha_vle">vallabha_vle</a>
        </p>
      </footer>
    </main>
  );
}
