"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { PrivateRouteShell } from "@/components/auth/private-route-shell";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardMobileBar } from "@/components/dashboard/dashboard-mobile-bar";
import { ResumeCard } from "@/components/dashboard/resume-card";
import { useI18n } from "@/components/settings/use-i18n";
import { deleteResumeById, duplicateResume, listResumes } from "@/lib/services/resume-service";
import type { ResumeDocument } from "@/lib/types";

function DashboardContent() {
  const { user } = useAuth();
  const { copy } = useI18n();
  const [resumes, setResumes] = useState<ResumeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState("");

  const refresh = useCallback(async () => {
    if (!user) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const nextResumes = await listResumes(user.uid);
      setResumes(nextResumes);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unable to load resumes.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleDuplicate(resumeId: string) {
    if (!user) {
      return;
    }

    setActionId(resumeId);
    await duplicateResume(user.uid, resumeId);
    await refresh();
    setActionId("");
  }

  async function handleDelete(resumeId: string) {
    if (!user) {
      return;
    }

    if (typeof window !== "undefined" && !window.confirm(copy.dashboard.confirmDelete)) {
      return;
    }

    setActionId(resumeId);
    await deleteResumeById(user.uid, resumeId);
    await refresh();
    setActionId("");
  }

  const stats = useMemo(() => {
    const templateCount = new Set(resumes.map((resume) => resume.templateId)).size;
    const readyCount = resumes.filter((resume) => resume.status === "ready").length;

    return [
      { label: copy.dashboard.stats.resumes, value: resumes.length.toString() },
      { label: copy.dashboard.stats.templatesUsed, value: templateCount.toString() },
      { label: copy.dashboard.stats.readyToExport, value: readyCount.toString() }
    ];
  }, [copy.dashboard.stats, resumes]);

  return (
    <div className="min-h-screen bg-surface lg:flex">
      <DashboardSidebar />
      <div className="flex-1 px-6 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <DashboardMobileBar />
          <header className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">{copy.common.dashboard}</span>
              <h1 className="mt-4 font-[var(--font-headline)] text-5xl font-extrabold tracking-tight text-primary">{copy.dashboard.title}</h1>
              <p className="mt-3 max-w-2xl text-lg leading-8 text-on-surface-variant">{copy.dashboard.subtitle}</p>
            </div>
            <div className="flex gap-3">
              <Link href="/templates" className="rounded-2xl bg-surface-container-high px-5 py-3 text-sm font-bold text-on-surface transition hover:bg-surface-container-highest">{copy.dashboard.browseTemplates}</Link>
              <Link href="/resume/new" className="premium-gradient rounded-2xl px-5 py-3 text-sm font-bold text-on-primary transition hover:opacity-95">{copy.dashboard.newResume}</Link>
            </div>
          </header>

          <section className="mb-10 grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-[1.75rem] bg-surface-container-low p-6">
                <div className="text-sm font-semibold text-on-surface-variant">{stat.label}</div>
                <div className="mt-3 font-[var(--font-headline)] text-4xl font-extrabold text-on-surface">{stat.value}</div>
              </div>
            ))}
          </section>

          {error ? <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-error-container px-4 py-3 text-sm text-on-error-container sm:flex-row sm:items-center sm:justify-between"><span>{error}</span><button type="button" onClick={() => refresh()} className="rounded-xl bg-surface-container-lowest px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-error">{copy.common.retry}</button></div> : null}

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Link href="/resume/new" className="flex min-h-[420px] flex-col items-center justify-center rounded-[1.75rem] border-2 border-dashed border-outline-variant bg-surface-container-low text-center transition hover:border-primary hover:bg-surface-container-high">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed text-3xl font-bold text-primary">+</div>
              <h2 className="mt-5 font-[var(--font-headline)] text-2xl font-extrabold text-primary">{copy.dashboard.createCardTitle}</h2>
              <p className="mt-2 max-w-xs text-sm leading-6 text-on-surface-variant">{copy.dashboard.createCardDescription}</p>
            </Link>

            {loading ? (
              <div className="col-span-full rounded-[1.75rem] bg-surface-container-low p-8 text-center text-on-surface-variant">{copy.dashboard.loading}</div>
            ) : resumes.length === 0 ? (
              <div className="col-span-full rounded-[1.75rem] bg-surface-container-low p-10">
                <span className="text-xs font-bold uppercase tracking-[0.28em] text-primary">{copy.dashboard.emptyEyebrow}</span>
                <h2 className="mt-4 font-[var(--font-headline)] text-3xl font-extrabold tracking-tight text-on-surface">{copy.dashboard.emptyTitle}</h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-on-surface-variant">{copy.dashboard.emptyDescription}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/resume/new" className="premium-gradient rounded-2xl px-5 py-3 text-sm font-bold text-on-primary">{copy.common.createResume}</Link>
                  <Link href="/templates" className="rounded-2xl bg-surface-container-high px-5 py-3 text-sm font-bold text-on-surface">{copy.dashboard.openTemplates}</Link>
                </div>
              </div>
            ) : (
              resumes.map((resume) => (
                <div key={resume.id} className={actionId === resume.id ? "opacity-70" : ""}>
                  <ResumeCard resume={resume} onDuplicate={handleDuplicate} onDelete={handleDelete} />
                </div>
              ))
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <PrivateRouteShell>
      <DashboardContent />
    </PrivateRouteShell>
  );
}

