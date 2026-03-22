import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6">
      <div className="max-w-xl rounded-3xl bg-surface-container-low p-10 shadow-editorial">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">404</span>
        <h1 className="mt-4 font-[var(--font-headline)] text-4xl font-extrabold tracking-tight">Page not found</h1>
        <p className="mt-4 text-on-surface-variant">
          The route does not exist yet or has been moved while the project is being assembled.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-xl bg-primary px-5 py-3 font-semibold text-on-primary transition hover:opacity-90"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
