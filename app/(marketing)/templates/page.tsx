import { MarketingResumeLink } from "@/components/marketing/marketing-auth-link";
import { TemplateCard } from "@/components/marketing/template-card";
import { TemplatePreview } from "@/components/marketing/template-preview";
import { templateLibrary } from "@/lib/template-library";

export default function TemplatesPage() {
  const [featured, ...rest] = templateLibrary;

  return (
    <main className="px-6 pb-24 pt-16 sm:px-8 sm:pt-24">
      <div className="mx-auto max-w-7xl">
        <header className="mb-16">
          <span className="text-sm font-bold uppercase tracking-[0.28em] text-primary">Template library</span>
          <h1 className="mt-4 font-[var(--font-headline)] text-5xl font-extrabold tracking-tight text-primary sm:text-6xl">
            Choose an ATS-safe style and write your own story.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-on-surface-variant">
            Every template keeps a single-column reading order, supports live editing and lets you write real content instead of starting from locked sample text.
          </p>
        </header>

        <section className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary">All templates</span>
            <span className="rounded-full bg-surface-container-high px-5 py-2.5 text-sm font-semibold text-on-surface-variant">ATS-safe</span>
            <span className="rounded-full bg-surface-container-high px-5 py-2.5 text-sm font-semibold text-on-surface-variant">Industry notes included</span>
            <span className="rounded-full bg-surface-container-high px-5 py-2.5 text-sm font-semibold text-on-surface-variant">Editable content</span>
          </div>
          <MarketingResumeLink templateId="professional" className="rounded-2xl bg-surface-container-high px-5 py-3 text-sm font-bold text-on-surface transition hover:bg-surface-container-highest">
            Start from recommended template
          </MarketingResumeLink>
        </section>

        <section className="grid gap-8 lg:grid-cols-3">
          <TemplateCard template={featured} featured />
          {rest.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </section>

        <section className="mt-24 overflow-hidden rounded-[2.5rem] premium-gradient px-10 py-12 text-on-primary sm:px-12">
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.26em]">Signature Series</span>
              <h2 className="mt-6 font-[var(--font-headline)] text-4xl font-extrabold tracking-tight sm:text-5xl">
                Need a safe default before customizing everything?
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-primary-fixed">
                Start with The Executive, then switch to Minimal or Modernist later. Your content model stays editable across all templates.
              </p>
              <MarketingResumeLink templateId="professional" className="mt-8 inline-flex rounded-2xl bg-white px-6 py-3 font-bold text-primary transition hover:bg-primary-fixed">
                Use The Executive
              </MarketingResumeLink>
            </div>
            <div className="rounded-[2rem] bg-white/10 p-6 backdrop-blur-md">
              <div className="aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-white p-5 shadow-float">
                <TemplatePreview templateId="professional" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
