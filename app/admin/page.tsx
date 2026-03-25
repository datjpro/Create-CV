export default function AdminPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-[2rem] bg-surface-container-low p-8 shadow-sm">
        <h1 className="font-[var(--font-headline)] text-3xl font-extrabold tracking-tight text-on-surface">Admin overview</h1>
        <p className="mt-4 text-base leading-7 text-on-surface-variant">
          Manage templates and marketing content that is used across the app.
        </p>
      </div>
      <div className="rounded-[2rem] bg-surface-container-lowest p-8 shadow-sm">
        <div className="text-xs font-bold uppercase tracking-[0.26em] text-primary">Quick links</div>
        <div className="mt-4 grid gap-3">
          <a className="rounded-2xl bg-surface-container-high px-5 py-4 font-semibold text-on-surface transition hover:bg-surface-container-highest" href="/admin/templates">Templates</a>
          <a className="rounded-2xl bg-surface-container-high px-5 py-4 font-semibold text-on-surface transition hover:bg-surface-container-highest" href="/admin/marketing">Marketing content</a>
        </div>
      </div>
    </div>
  );
}
