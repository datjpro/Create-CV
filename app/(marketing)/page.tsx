"use client";

import Link from "next/link";

import { MarketingResumeLink } from "@/components/marketing/marketing-auth-link";
import { TemplateCard } from "@/components/marketing/template-card";
import { TemplatePreview } from "@/components/marketing/template-preview";
import { useI18n } from "@/components/settings/use-i18n";
import { templateLibrary } from "@/lib/template-library";

export default function HomePage() {
  const { copy } = useI18n();

  return (
    <main>
      <section className="overflow-hidden bg-paper-glow px-6 pb-24 pt-16 sm:px-8 sm:pb-32 sm:pt-24">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.2fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full bg-primary-fixed px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-on-primary-fixed-variant">
              {copy.marketing.home.eyebrow}
            </span>
            <h1 className="mt-8 max-w-4xl font-[var(--font-headline)] text-5xl font-extrabold tracking-tight text-primary sm:text-7xl">
              {copy.marketing.home.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-on-surface-variant sm:text-2xl">
              {copy.marketing.home.description}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <MarketingResumeLink
                templateId="professional"
                className="premium-gradient rounded-2xl px-8 py-4 text-center text-lg font-bold text-on-primary shadow-float transition hover:-translate-y-0.5"
              >
                {copy.marketing.home.primaryCta}
              </MarketingResumeLink>
              <Link href="/templates" className="rounded-2xl bg-surface-container-high px-8 py-4 text-center text-lg font-bold text-on-surface transition hover:bg-surface-container-highest">
                {copy.marketing.home.secondaryCta}
              </Link>
            </div>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex -space-x-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-surface bg-primary-fixed text-sm font-bold text-primary">AA</div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-surface bg-secondary-container text-sm font-bold text-primary">MJ</div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-surface bg-primary text-xs font-bold text-on-primary">+2k</div>
              </div>
              <p className="text-sm font-medium text-on-surface-variant">{copy.marketing.home.socialProof}</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary-fixed/60 blur-3xl" />
            <div className="absolute -bottom-12 -right-10 h-48 w-48 rounded-full bg-secondary-container/70 blur-3xl" />
            <div className="relative rounded-[2rem] bg-surface-container-lowest p-5 shadow-float lg:rotate-3 lg:transition lg:hover:rotate-0">
              <div className="aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-surface-container-low p-5">
                <TemplatePreview templateId="professional" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low px-6 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.28em] text-primary">{copy.marketing.home.collectionEyebrow}</span>
              <h2 className="mt-4 font-[var(--font-headline)] text-4xl font-extrabold tracking-tight text-on-surface sm:text-5xl">
                {copy.marketing.home.collectionTitle}
              </h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-on-surface-variant">
              {copy.marketing.home.collectionDescription}
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {templateLibrary.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-surface px-6 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-4 md:grid-rows-2 md:[grid-auto-rows:minmax(0,1fr)]">
          <div className="premium-gradient rounded-[2rem] p-10 text-on-primary md:col-span-2 md:row-span-2">
            <div className="mb-8 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.26em]">{copy.marketing.home.featureEyebrow}</div>
            <h3 className="font-[var(--font-headline)] text-4xl font-extrabold tracking-tight">{copy.marketing.home.featureTitle}</h3>
            <p className="mt-6 max-w-lg text-lg leading-8 text-primary-fixed">
              {copy.marketing.home.featureDescription}
            </p>
          </div>
          <div className="rounded-[2rem] bg-secondary-container p-8">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-[var(--font-headline)] text-2xl font-bold text-on-surface">{copy.marketing.home.atsTitle}</h3>
              <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-primary">{copy.marketing.home.atsBadge}</span>
            </div>
            <p className="mt-4 text-base leading-7 text-on-surface-variant">{copy.marketing.home.atsDescription}</p>
          </div>
          <div className="rounded-[2rem] bg-surface-container p-8 text-center">
            <div className="text-xs font-bold uppercase tracking-[0.28em] text-primary">Real-time</div>
            <h3 className="mt-3 text-2xl font-bold text-on-surface">{copy.marketing.home.livePreview}</h3>
          </div>
          <div className="rounded-[2rem] bg-surface-container p-8 text-center">
            <div className="text-xs font-bold uppercase tracking-[0.28em] text-primary">Flexible</div>
            <h3 className="mt-3 text-2xl font-bold text-on-surface">{copy.marketing.home.industryAware}</h3>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 sm:px-8">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-surface-container-lowest p-12 text-center shadow-editorial sm:p-20">
          <h2 className="font-[var(--font-headline)] text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
            {copy.marketing.home.finalTitle}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-on-surface-variant">
            {copy.marketing.home.finalDescription}
          </p>
          <MarketingResumeLink
            templateId="professional"
            className="premium-gradient mt-10 inline-flex rounded-2xl px-10 py-5 text-lg font-bold text-on-primary shadow-float transition hover:-translate-y-0.5"
          >
            {copy.marketing.home.finalCta}
          </MarketingResumeLink>
        </div>
      </section>
    </main>
  );
}

