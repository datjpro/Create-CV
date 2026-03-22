import Link from "next/link";

type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  links?: Array<{ href: string; label: string }>;
};

export function PlaceholderPage({ eyebrow, title, description, links = [] }: PlaceholderPageProps) {
  return (
    <main className="min-h-screen bg-paper-glow">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-20 sm:px-10">
        <span className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-primary">{eyebrow}</span>
        <h1 className="max-w-3xl font-[var(--font-headline)] text-4xl font-extrabold tracking-tight text-on-surface sm:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-on-surface-variant">{description}</p>
        {links.length > 0 ? (
          <div className="mt-10 flex flex-wrap gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl bg-surface-container-lowest px-5 py-3 font-semibold text-primary shadow-editorial transition hover:-translate-y-0.5"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
