"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { PrivateRouteShell } from "@/components/auth/private-route-shell";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { ResumeCard } from "@/components/dashboard/resume-card";
import { deleteResumeById, duplicateResume, listResumes } from "@/lib/services/resume-service";
import type { ResumeDocument } from "@/lib/types";

function DashboardContent() {
  const { user } = useAuth();
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

    if (typeof window !== "undefined" && !window.confirm("Delete this resume?")) {
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
      { label: "Resumes", value: resumes.length.toString() },
      { label: "Templates used", value: templateCount.toString() },
      { label: "Ready to export", value: readyCount.toString() }
    ];
  }, [resumes]);

  return (
    <div className="min-h-screen bg-surface lg:flex">
      <DashboardSidebar />
      <div className="flex-1 px-6 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <header className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Dashboard</span>
              <h1 className="mt-4 font-[var(--font-headline)] text-5xl font-extrabold tracking-tight text-primary">Your resume workspace</h1>
              <p className="mt-3 max-w-2xl text-lg leading-8 text-on-surface-variant">
                Create, duplicate and manage resume variants for different roles without rewriting your core profile every time.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/templates" className="rounded-2xl bg-surface-container-high px-5 py-3 text-sm font-bold text-on-surface transition hover:bg-surface-container-highest">
                Browse templates
              </Link>
              <Link href="/resume/new?template=professional" className="premium-gradient rounded-2xl px-5 py-3 text-sm font-bold text-on-primary transition hover:opacity-95">
                New resume
              </Link>
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

          {error ? <div className="mb-6 rounded-2xl bg-error-container px-4 py-3 text-sm text-on-error-container">{error}</div> : null}

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Link
              href="/resume/new?template=professional"
              className="flex min-h-[420px] flex-col items-center justify-center rounded-[1.75rem] border-2 border-dashed border-outline-variant bg-surface-container-low text-center transition hover:border-primary hover:bg-white"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed text-3xl font-bold text-primary">+</div>
              <h2 className="mt-5 font-[var(--font-headline)] text-2xl font-extrabold text-primary">Create New CV</h2>
              <p className="mt-2 max-w-xs text-sm leading-6 text-on-surface-variant">Start from a polished default document and switch templates later.</p>
            </Link>

            {loading ? (
              <div className="col-span-full rounded-[1.75rem] bg-surface-container-low p-8 text-center text-on-surface-variant">Loading resumes...</div>
            ) : resumes.length === 0 ? (
              <div className="col-span-full rounded-[1.75rem] bg-surface-container-low p-10">
                <span className="text-xs font-bold uppercase tracking-[0.28em] text-primary">Empty state</span>
                <h2 className="mt-4 font-[var(--font-headline)] text-3xl font-extrabold tracking-tight text-on-surface">No resumes yet.</h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-on-surface-variant">
                  Create your first resume from the dashboard or start from the template gallery. Your documents will stay scoped to your signed-in account.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/resume/new?template=professional" className="premium-gradient rounded-2xl px-5 py-3 text-sm font-bold text-on-primary">Create resume</Link>
                  <Link href="/templates" className="rounded-2xl bg-surface-container-high px-5 py-3 text-sm font-bold text-on-surface">Open templates</Link>
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
