"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { PrivateRouteShell } from "@/components/auth/private-route-shell";
import { createResume } from "@/lib/services/resume-service";
import type { TemplateId } from "@/lib/types";

function readTemplateId(): TemplateId {
  if (typeof window === "undefined") {
    return "professional";
  }

  const value = new URLSearchParams(window.location.search).get("template");
  return value === "minimal" || value === "creative" || value === "professional" ? value : "professional";
}

function CreateResumeFlow() {
  const router = useRouter();
  const { user } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!user) {
        return;
      }

      try {
        const resume = await createResume(user.uid, readTemplateId());
        if (!cancelled) {
          router.replace(`/resume/${resume.id}/edit`);
        }
      } catch (nextError) {
        if (!cancelled) {
          setError(nextError instanceof Error ? nextError.message : "Unable to create resume.");
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
