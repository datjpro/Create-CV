"use client";

import Link from "next/link";

import { TemplatePreview } from "@/components/marketing/template-preview";
import { templateLibrary } from "@/lib/template-library";
import type { ResumeDocument } from "@/lib/types";
import { formatUpdatedAt } from "@/lib/utils";

export function ResumeCard({
  resume,
  onDuplicate,
  onDelete
}: {
  resume: ResumeDocument;
  onDuplicate: (resumeId: string) => void;
  onDelete: (resumeId: string) => void;
}) {
  const template = templateLibrary.find((item) => item.id === resume.templateId);

  return (
    <article className="group overflow-hidden rounded-[1.75rem] bg-surface-container-lowest shadow-editorial transition hover:-translate-y-1 hover:shadow-float">
      <div className="aspect-[3/4] overflow-hidden bg-surface-container p-4">
        <TemplatePreview templateId={resume.templateId} compact />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-[var(--font-headline)] text-2xl font-bold tracking-tight text-on-surface">{resume.title}</h3>
            <p className="mt-1 text-sm text-on-surface-variant">Edited {formatUpdatedAt(resume.updatedAt)}</p>
            {template ? <p className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">{template.name}</p> : null}
          </div>
          <span className="rounded-full bg-primary-fixed px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-on-primary-fixed-variant">
            {resume.status}
          </span>
        </div>
        <div className="mt-6 flex items-center gap-2">
          <Link
            href={`/resume/${resume.id}/edit`}
            className="premium-gradient flex-1 rounded-xl px-4 py-3 text-center text-sm font-bold text-on-primary transition hover:opacity-95"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => onDuplicate(resume.id)}
            className="rounded-xl bg-surface-container-low px-4 py-3 text-sm font-semibold text-on-surface transition hover:bg-surface-container-high"
          >
            Duplicate
          </button>
          <button
            type="button"
            onClick={() => onDelete(resume.id)}
            className="rounded-xl bg-error-container px-4 py-3 text-sm font-semibold text-on-error-container transition hover:opacity-90"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
