/* eslint-disable @next/next/no-img-element */
import type { ResumeDocument } from "@/lib/types";
import { formatDateRange } from "@/lib/utils";

function ResumeHeader({ resume, inverse = false }: { resume: ResumeDocument; inverse?: boolean }) {
  return (
    <header className={inverse ? "border-b border-white/15 pb-8 text-white" : "border-b border-primary/20 pb-8 text-on-surface"}>
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          {resume.avatarUrl ? (
            <img src={resume.avatarUrl} alt={resume.personal.fullName} className="h-16 w-16 rounded-2xl object-cover" />
          ) : null}
          <div>
            <h1 className="font-[var(--font-headline)] text-4xl font-extrabold tracking-tight">{resume.personal.fullName || "Your name"}</h1>
            <p className={inverse ? "mt-2 text-lg font-semibold text-primary-fixed" : "mt-2 text-lg font-semibold text-primary"}>
              {resume.personal.title || "Professional title"}
            </p>
          </div>
        </div>
        <div className={inverse ? "space-y-1 text-right text-sm text-primary-fixed" : "space-y-1 text-right text-sm text-on-surface-variant"}>
          <p>{resume.personal.email}</p>
          <p>{resume.personal.phone}</p>
          <p>{resume.personal.location}</p>
          {resume.personal.website ? <p>{resume.personal.website}</p> : null}
        </div>
      </div>
    </header>
  );
}

function SectionTitle({ label, inverse = false }: { label: string; inverse?: boolean }) {
  return (
    <h2 className={inverse ? "mb-4 border-l-2 border-primary-fixed pl-3 font-[var(--font-headline)] text-xs font-extrabold uppercase tracking-[0.3em] text-primary-fixed" : "mb-4 border-l-2 border-primary pl-3 font-[var(--font-headline)] text-xs font-extrabold uppercase tracking-[0.3em] text-on-surface"}>
      {label}
    </h2>
  );
}

function ProfessionalDocument({ resume }: { resume: ResumeDocument }) {
  return (
    <div className="resume-paper print-friendly rounded-[1.5rem] bg-white p-10 shadow-float">
      <ResumeHeader resume={resume} />
      <div className="mt-8 grid gap-8 md:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-8">
          <section className="page-break-avoid">
            <SectionTitle label="Professional Summary" />
            <p className="text-sm leading-7 text-on-surface-variant">{resume.summary}</p>
          </section>
          <section className="page-break-avoid">
            <SectionTitle label="Experience" />
            <div className="space-y-6">
              {resume.experiences.map((item) => (
                <article key={item.id}>
                  <div className="flex items-start justify-between gap-4 text-sm font-semibold text-on-surface">
                    <span>{item.jobTitle || "Role"}</span>
                    <span className="text-primary">{formatDateRange(item.startDate, item.endDate, item.current)}</span>
                  </div>
                  <p className="mt-1 text-sm italic text-on-surface-variant">{[item.employer, item.location].filter(Boolean).join(", ")}</p>
                  {item.description ? <p className="mt-3 text-sm leading-7 text-on-surface-variant">{item.description}</p> : null}
                  {item.bullets.length > 0 ? (
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-7 text-on-surface-variant">
                      {item.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
          <section className="page-break-avoid">
            <SectionTitle label="Projects" />
            <div className="space-y-5">
              {resume.projects.map((project) => (
                <article key={project.id}>
                  <div className="flex items-start justify-between gap-4 text-sm font-semibold text-on-surface">
                    <span>{project.name || "Project"}</span>
                    <span className="text-primary">{formatDateRange(project.startDate, project.endDate)}</span>
                  </div>
                  <p className="mt-1 text-sm italic text-on-surface-variant">{project.role}</p>
                  <p className="mt-2 text-sm leading-7 text-on-surface-variant">{project.description}</p>
                  {project.link ? <p className="mt-2 text-sm text-primary">{project.link}</p> : null}
                </article>
              ))}
            </div>
          </section>
        </div>
        <div className="space-y-8">
          <section className="page-break-avoid">
            <SectionTitle label="Skills" />
            <div className="flex flex-wrap gap-2 text-sm text-on-surface-variant">
              {resume.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-primary-fixed px-3 py-1.5 font-medium text-on-primary-fixed-variant">
                  {skill}
                </span>
              ))}
            </div>
          </section>
          <section className="page-break-avoid">
            <SectionTitle label="Education" />
            <div className="space-y-4">
              {resume.education.map((item) => (
                <article key={item.id}>
                  <p className="text-sm font-semibold text-on-surface">{item.degree || "Degree"}</p>
                  <p className="text-sm text-on-surface-variant">{item.school}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">{formatDateRange(item.startDate, item.endDate)}</p>
                  {item.description ? <p className="mt-2 text-sm leading-7 text-on-surface-variant">{item.description}</p> : null}
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function MinimalDocument({ resume }: { resume: ResumeDocument }) {
  return (
    <div className="resume-paper print-friendly rounded-[1.5rem] bg-white p-12 shadow-float">
      <div className="border-b border-outline-variant/40 pb-8">
        <h1 className="font-[var(--font-headline)] text-5xl font-extrabold tracking-tight text-on-surface">{resume.personal.fullName || "Your name"}</h1>
        <p className="mt-3 text-base font-semibold uppercase tracking-[0.24em] text-primary">{resume.personal.title || "Professional title"}</p>
        <p className="mt-4 text-sm leading-7 text-on-surface-variant">
          {[resume.personal.email, resume.personal.phone, resume.personal.location, resume.personal.website].filter(Boolean).join(" • ")}
        </p>
      </div>
      <section className="page-break-avoid mt-8">
        <p className="text-sm leading-8 text-on-surface-variant">{resume.summary}</p>
      </section>
      <div className="mt-10 space-y-10">
        <section className="page-break-avoid">
          <div className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-primary">Experience</div>
          <div className="space-y-6">
            {resume.experiences.map((item) => (
              <article key={item.id} className="rounded-2xl bg-surface-container-low p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-[var(--font-headline)] text-xl font-bold text-on-surface">{item.jobTitle || "Role"}</h2>
                    <p className="text-sm text-on-surface-variant">{[item.employer, item.location].filter(Boolean).join(" • ")}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary">{formatDateRange(item.startDate, item.endDate, item.current)}</span>
                </div>
                {item.description ? <p className="mt-3 text-sm leading-7 text-on-surface-variant">{item.description}</p> : null}
                {item.bullets.length > 0 ? (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-7 text-on-surface-variant">
                    {item.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </section>
        <section className="page-break-avoid grid gap-8 md:grid-cols-2">
          <div>
            <div className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-primary">Education</div>
            <div className="space-y-4">
              {resume.education.map((item) => (
                <article key={item.id}>
                  <p className="font-semibold text-on-surface">{item.degree}</p>
                  <p className="text-sm text-on-surface-variant">{item.school}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">{formatDateRange(item.startDate, item.endDate)}</p>
                </article>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-primary">Skills</div>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-surface-container-low px-3 py-1.5 text-sm text-on-surface">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function CreativeDocument({ resume }: { resume: ResumeDocument }) {
  return (
    <div className="resume-paper print-friendly overflow-hidden rounded-[1.5rem] bg-white shadow-float">
      <div className="grid min-h-[297mm] grid-cols-[0.92fr_1.58fr]">
        <aside className="premium-gradient flex flex-col gap-8 p-8 text-on-primary">
          {resume.avatarUrl ? <img src={resume.avatarUrl} alt={resume.personal.fullName} className="h-20 w-20 rounded-[1.5rem] object-cover" /> : null}
          <div>
            <h1 className="font-[var(--font-headline)] text-4xl font-extrabold tracking-tight">{resume.personal.fullName || "Your name"}</h1>
            <p className="mt-3 text-base font-semibold text-primary-fixed">{resume.personal.title || "Professional title"}</p>
          </div>
          <section>
            <SectionTitle label="Contact" inverse />
            <div className="space-y-2 text-sm text-primary-fixed">
              <p>{resume.personal.email}</p>
              <p>{resume.personal.phone}</p>
              <p>{resume.personal.location}</p>
              {resume.personal.website ? <p>{resume.personal.website}</p> : null}
              {resume.personal.linkedin ? <p>{resume.personal.linkedin}</p> : null}
              {resume.personal.github ? <p>{resume.personal.github}</p> : null}
            </div>
          </section>
          <section>
            <SectionTitle label="Skills" inverse />
            <div className="flex flex-wrap gap-2 text-sm text-on-primary">
              {resume.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-white/12 px-3 py-1.5">{skill}</span>
              ))}
            </div>
          </section>
          <section>
            <SectionTitle label="Education" inverse />
            <div className="space-y-4 text-sm text-primary-fixed">
              {resume.education.map((item) => (
                <article key={item.id}>
                  <p className="font-semibold text-white">{item.degree}</p>
                  <p>{item.school}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary-fixed">{formatDateRange(item.startDate, item.endDate)}</p>
                </article>
              ))}
            </div>
          </section>
        </aside>
        <div className="space-y-8 p-8">
          <section className="page-break-avoid">
            <SectionTitle label="Profile" />
            <p className="text-sm leading-8 text-on-surface-variant">{resume.summary}</p>
          </section>
          <section className="page-break-avoid">
            <SectionTitle label="Experience" />
            <div className="space-y-6">
              {resume.experiences.map((item) => (
                <article key={item.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-[var(--font-headline)] text-xl font-bold text-on-surface">{item.jobTitle || "Role"}</h2>
                      <p className="text-sm text-on-surface-variant">{[item.employer, item.location].filter(Boolean).join(" • ")}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary">{formatDateRange(item.startDate, item.endDate, item.current)}</span>
                  </div>
                  {item.description ? <p className="mt-3 text-sm leading-7 text-on-surface-variant">{item.description}</p> : null}
                  {item.bullets.length > 0 ? (
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-7 text-on-surface-variant">
                      {item.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
          <section className="page-break-avoid">
            <SectionTitle label="Projects" />
            <div className="space-y-5">
              {resume.projects.map((project) => (
                <article key={project.id}>
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-[var(--font-headline)] text-xl font-bold text-on-surface">{project.name || "Project"}</h2>
                    <span className="text-sm font-semibold text-primary">{formatDateRange(project.startDate, project.endDate)}</span>
                  </div>
                  <p className="mt-1 text-sm italic text-on-surface-variant">{project.role}</p>
                  <p className="mt-2 text-sm leading-7 text-on-surface-variant">{project.description}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export function ResumeDocumentPreview({ resume }: { resume: ResumeDocument }) {
  if (resume.templateId === "minimal") {
    return <MinimalDocument resume={resume} />;
  }

  if (resume.templateId === "creative") {
    return <CreativeDocument resume={resume} />;
  }

  return <ProfessionalDocument resume={resume} />;
}

