"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { TemplatePreview } from "@/components/marketing/template-preview";
import { getIndustryFocusLabel } from "@/lib/resume-metadata";
import { createResume } from "@/lib/services/resume-service";
import { buildResumeCreateHref, templateLibrary } from "@/lib/template-library";
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
  window.history.replaceState(
    {
      ...historyState,
      [RESUME_CREATION_INTENT_KEY]: nextIntent
    },
    ""
  );

  return nextIntent;
}

function buildResumeId(userId: string, intent: string) {
  return `resume-${userId}-${intent}`;
}

function CreateResumeFlow({ templateId }: { templateId: TemplateId }) {
  const router = useRouter();
  const { user } = useAuth();
  const [error, setError] = useState("");
  const hasStartedRef = useRef(false);

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
        <h1 className="mt-6 font-[var(--font-headline)] text-3xl font-extrabold tracking-tight text-on-surface">Creating your resume...</h1>
        <p className="mt-4 text-base leading-7 text-on-surface-variant">
          We are preparing your {templateLibrary.find((template) => template.id === templateId)?.name ?? "selected"} template and taking you straight into the editor.
        </p>
        {error ? <div className="mt-6 rounded-2xl bg-error-container px-4 py-3 text-sm text-on-error-container">{error}</div> : null}
      </div>
    </main>
  );
}

function TemplatePicker() {
  return (
    <main className="min-h-screen bg-surface px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-primary">New resume</span>
            <h1 className="mt-4 font-[var(--font-headline)] text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">Choose a template before we create your CV.</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-on-surface-variant sm:text-lg sm:leading-8">
              Pick the layout that fits your role best. We will create one editable resume from that template and take you straight into the editor.
            </p>
          </div>
          <Link href="/dashboard" className="rounded-2xl bg-surface-container-high px-5 py-3 text-sm font-bold text-on-surface transition hover:bg-surface-container-highest">
            Back to dashboard
          </Link>
        </div>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {templateLibrary.map((template) => (
            <article key={template.id} className="flex h-full flex-col rounded-[1.75rem] bg-surface-container-low p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-float">
              <div className="aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-surface-container-lowest p-3">
                <TemplatePreview templateId={template.id} compact />
              </div>
              <div className="mt-4 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-[0.24em] text-primary">{template.category}</span>
                  {template.badge ? <span className="rounded-full bg-primary-fixed px-2 py-1 text-[10px] font-bold text-primary">{template.badge}</span> : null}
                </div>
                <h2 className="mt-2 font-[var(--font-headline)] text-2xl font-extrabold tracking-tight text-on-surface">{template.name}</h2>
                <p className="mt-2 text-sm leading-6 text-on-surface-variant">{template.hook}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">{template.layoutStyle}</p>
                <p className="mt-3 text-sm leading-6 text-on-surface-variant">
                  Best for {template.bestForIndustries.map((industry) => getIndustryFocusLabel(industry)).join(", ")}
                </p>
                <p className="mt-2 text-sm leading-6 text-on-surface-variant">{template.notes}</p>
              </div>
              <Link
                href={buildResumeCreateHref(template.id)}
                className="premium-gradient mt-5 inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-bold text-on-primary transition hover:opacity-95"
              >
                Use this template
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

export function NewResumePageClient({ templateId }: { templateId: TemplateId | null }) {
  if (!templateId) {
    return <TemplatePicker />;
  }

  return <CreateResumeFlow templateId={templateId} />;
}
