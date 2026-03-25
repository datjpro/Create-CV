"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { TemplatePreview } from "@/components/marketing/template-preview";
import { useI18n } from "@/components/settings/use-i18n";
import { useTemplateCatalog } from "@/components/templates/template-catalog-provider";
import { getIndustryFocusLabel } from "@/lib/resume-metadata";
import { createResume } from "@/lib/services/resume-service";
import { buildResumeCreateHref } from "@/lib/template-library";
import type { TemplateId } from "@/lib/types";

const RESUME_CREATION_INTENT_KEY = "createCvResumeCreationIntent";

type ResumeCreationHistoryState = {
  [RESUME_CREATION_INTENT_KEY]?: string;
};

function readResumeCreationIntent() {
  const historyState = ((window.history.state ?? {}) as ResumeCreationHistoryState) ?? {};
  const existingIntent = historyState[RESUME_CREATION_INTENT_KEY];

  if (existingIntent) {
    return existingIntent;
  }

  const nextIntent = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `resume-intent-${Date.now()}`;
  window.history.replaceState({ ...historyState, [RESUME_CREATION_INTENT_KEY]: nextIntent }, "");

  return nextIntent;
}

function buildResumeId(userId: string, intent: string) {
  return `resume-${userId}-${intent}`;
}

function CreateResumeFlow({ templateId }: { templateId: TemplateId }) {
  const router = useRouter();
  const { user } = useAuth();
  const { copy } = useI18n();
  const [error, setError] = useState("");
  const hasStartedRef = useRef(false);
  const templateCopy = copy.templateMeta[templateId];

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!user || hasStartedRef.current) {
        return;
      }

      hasStartedRef.current = true;

      try {
        const resumeIntent = readResumeCreationIntent();
        const resume = await createResume(user.uid, templateId, buildResumeId(user.uid, resumeIntent));
        if (!cancelled) {
          router.replace(`/resume/${resume.id}/edit`);
        }
      } catch (nextError) {
        if (!cancelled) {
          setError(nextError instanceof Error ? nextError.message : "Unable to create resume.");
          hasStartedRef.current = false;
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [router, templateId, user]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6">
      <div className="max-w-lg rounded-[2rem] bg-surface-container-low p-10 text-center shadow-editorial">
        <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-primary-fixed" />
        <h1 className="mt-6 font-[var(--font-headline)] text-3xl font-extrabold tracking-tight text-on-surface">{copy.newResume.loadingTitle}</h1>
        <p className="mt-4 text-base leading-7 text-on-surface-variant">{copy.newResume.loadingDescription.replace("{template}", templateCopy.name)}</p>
        {error ? <div className="mt-6 rounded-2xl bg-error-container px-4 py-3 text-sm text-on-error-container">{error}</div> : null}
      </div>
    </main>
  );
}

function TemplatePicker() {
  const { locale, copy } = useI18n();
  const { publicTemplates } = useTemplateCatalog();

  return (
    <main className="min-h-screen bg-surface px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-primary">{copy.newResume.eyebrow}</span>
            <h1 className="mt-4 font-[var(--font-headline)] text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">{copy.newResume.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-on-surface-variant sm:text-lg sm:leading-8">{copy.newResume.description}</p>
          </div>
          <Link href="/dashboard" className="rounded-2xl bg-surface-container-high px-5 py-3 text-sm font-bold text-on-surface transition hover:bg-surface-container-highest">{copy.newResume.back}</Link>
        </div>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {publicTemplates.map((template) => {
            const templateCopy = copy.templateMeta[template.id];

            return (
              <article key={template.id} className="flex h-full flex-col rounded-[1.75rem] bg-surface-container-low p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-float">
                <div className="aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-surface-container-lowest p-3">
                  <TemplatePreview templateId={template.id} compact />
                </div>
                <div className="mt-4 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-[0.24em] text-primary">{templateCopy.category}</span>
                    {templateCopy.badge ? <span className="rounded-full bg-primary-fixed px-2 py-1 text-[10px] font-bold text-primary">{templateCopy.badge}</span> : null}
                  </div>
                  <h2 className="mt-2 font-[var(--font-headline)] text-2xl font-extrabold tracking-tight text-on-surface">{templateCopy.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-on-surface-variant">{templateCopy.hook}</p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">{templateCopy.layoutStyle}</p>
                  <p className="mt-3 text-sm leading-6 text-on-surface-variant">{copy.common.bestFor} {template.bestForIndustries.map((industry) => getIndustryFocusLabel(industry, locale)).join(", ")}</p>
                  <p className="mt-2 text-sm leading-6 text-on-surface-variant">{templateCopy.notes}</p>
                </div>
                <Link href={buildResumeCreateHref(template.id)} className="premium-gradient mt-5 inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-bold text-on-primary transition hover:opacity-95">{copy.newResume.useTemplate}</Link>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}

export function NewResumePageClient({ templateId }: { templateId: TemplateId | null }) {
  const { publicTemplates } = useTemplateCatalog();

  const resolvedTemplateId = useMemo(() => {
    if (!templateId) {
      return null;
    }

    return publicTemplates.some((template) => template.id === templateId) ? templateId : null;
  }, [publicTemplates, templateId]);

  if (!resolvedTemplateId) {
    return <TemplatePicker />;
  }

  return <CreateResumeFlow templateId={resolvedTemplateId} />;
}
