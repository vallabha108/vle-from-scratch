import { signIn, auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { sent?: string; error?: string };
}) {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Sign in</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Enter your email. We&apos;ll print a magic link to the dev terminal
        (in production this would arrive by email).
      </p>

      {searchParams.sent && (
        <p className="mt-4 rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">
          Magic link sent. Check the terminal running <code>npm run dev</code>.
        </p>
      )}
      {searchParams.error && (
        <p className="mt-4 rounded-md border border-rose-300 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-200">
          Sign-in failed: {searchParams.error}
        </p>
      )}

      <form
        action={async (formData) => {
          "use server";
          const email = String(formData.get("email") ?? "").trim();
          if (!email) return;
          await signIn("nodemailer", {
            email,
            redirectTo: "/login?sent=1",
          });
        }}
        className="mt-6 space-y-3"
      >
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
        <button
          type="submit"
          className="w-full rounded-md bg-brand px-4 py-2 font-medium text-brand-fg hover:opacity-90"
        >
          Email me a magic link
        </button>
      </form>

      <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
        Tip: try <code>alice@demo.example.com</code> — the seed maps that
        domain to the demo tenant.
      </p>
    </main>
  );
}
