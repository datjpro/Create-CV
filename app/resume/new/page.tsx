"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { PrivateRouteShell } from "@/components/auth/private-route-shell";
import { createResume } from "@/lib/services/resume-service";
import type { TemplateId } from "@/lib/types";

const RESUME_CREATION_INTENT_KEY = "createCvResumeCreationIntent";

type ResumeCreationHistoryState = {
  [RESUME_CREATION_INTENT_KEY]?: string;
};

function readTemplateId(): TemplateId {
  if (typeof window === "undefined") {
    return "professional";
  }

  const value = new URLSearchParams(window.location.search).get("template");
  return value === "minimal" || value === "creative" || value === "professional" ? value : "professional";
}

function readResumeCreationIntent() {
  if (typeof window === "undefined") {
    return "resume-intent-server";
  }

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

function CreateResumeFlow() {
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
        const resume = await createResume(user.uid, readTemplateId(), buildResumeId(user.uid, resumeIntent));
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
  }, [router, user]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6">
      <div className="max-w-lg rounded-[2rem] bg-surface-container-low p-10 text-center shadow-editorial">
        <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-primary-fixed" />
        <h1 className="mt-6 font-[var(--font-headline)] text-3xl font-extrabold tracking-tight text-on-surface">Creating your resume...</h1>
        <p className="mt-4 text-base leading-7 text-on-surface-variant">
          We are preparing a starter document and taking you straight into the editor.
        </p>
        {error ? <div className="mt-6 rounded-2xl bg-error-container px-4 py-3 text-sm text-on-error-container">{error}</div> : null}
      </div>
    </main>
  );
}

export default function NewResumePage() {
  return (
    <PrivateRouteShell>
      <CreateResumeFlow />
    </PrivateRouteShell>
  );
}
