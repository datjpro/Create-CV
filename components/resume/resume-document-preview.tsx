import { getSectionOrder, getSkillSectionLabel } from "@/lib/resume-metadata";
import type { ResumeContentSection, ResumeDocument, TemplateId } from "@/lib/types";
import { cn, formatDateRange } from "@/lib/utils";

type PreviewTheme = {
  shell: string;
  divider: string;
  heading: string;
  accentText: string;
  tag: string;
  card: string;
};

const previewThemes: Record<TemplateId, PreviewTheme> = {
  professional: {
    shell: "resume-paper print-friendly rounded-[1.5rem] bg-white p-10 shadow-float",
    divider: "border-primary/20",
    heading: "text-primary border-primary/60",
    accentText: "text-primary",
    tag: "bg-primary-fixed text-on-primary-fixed-variant",
    card: "bg-surface-container-low"
  },
  minimal: {
    shell: "resume-paper print-friendly rounded-[1.5rem] border border-outline-variant/40 bg-white p-12 shadow-float",
    divider: "border-outline-variant/40",
    heading: "text-on-surface border-outline-variant/60",
    accentText: "text-on-surface-variant",
    tag: "bg-surface-container-low text-on-surface",
    card: "bg-surface-container-low"
  },
  creative: {
    shell: "resume-paper print-friendly rounded-[1.5rem] border border-primary/15 bg-white p-10 shadow-float",
    divider: "border-primary/25",
    heading: "text-primary border-primary",
    accentText: "text-primary",
    tag: "bg-primary/10 text-primary",
    card: "bg-primary/5"
  }
};

function hasText(value: string) {
  return value.trim().length > 0;
}

function hasRenderableContent(resume: ResumeDocument, section: ResumeContentSection) {
  switch (section) {
    case "summary":
      return hasText(resume.summary);
    case "skills":
      return resume.skillGroups.some((group) => hasText(group.name) || group.skills.some((skill) => hasText(skill)));
    case "projects":
      return resume.projects.some((item) => hasText(item.name) || hasText(item.description) || hasText(item.role));
    case "experience":
      return resume.experiences.some((item) => hasText(item.jobTitle) || hasText(item.employer) || item.bullets.some((bullet) => hasText(bullet)));
    case "education":
      return resume.education.some((item) => hasText(item.degree) || hasText(item.school));
    case "certifications":
      return resume.certifications.some((item) => hasText(item.name) || hasText(item.issuer));
    case "awards":
      return resume.awards.some((item) => hasText(item.title) || hasText(item.issuer));
    case "activities":
      return resume.activities.some((item) => hasText(item.name) || hasText(item.organization));
  }
}

function sectionTitle(section: ResumeContentSection, resume: ResumeDocument) {
  switch (section) {
    case "summary":
      return "Professional Summary";
    case "skills":
      return getSkillSectionLabel(resume.industryFocus);
    case "projects":
      return "Projects";
    case "experience":
      return "Work Experience";
    case "education":
      return "Education";
    case "certifications":
      return "Certifications";
    case "awards":
      return "Awards";
    case "activities":
      return "Activities";
  }
}

function SectionHeading({ label, theme }: { label: string; theme: PreviewTheme }) {
  return <h2 className={cn("mb-4 border-b pb-2 font-[var(--font-headline)] text-sm font-extrabold uppercase tracking-[0.24em]", theme.heading)}>{label}</h2>;
}

function ResumeHeader({ resume, theme }: { resume: ResumeDocument; theme: PreviewTheme }) {
  const contactItems = [
    resume.personal.email,
    resume.personal.phone,
    resume.personal.location,
    resume.personal.website,
    resume.personal.linkedin,
    resume.personal.github
  ].filter(hasText);

  return (
    <header className={cn("border-b pb-8", theme.divider)}>
      <h1 className="font-[var(--font-headline)] text-4xl font-extrabold tracking-tight text-on-surface">{resume.personal.fullName || "Your name"}</h1>
      <p className={cn("mt-2 text-lg font-semibold", theme.accentText)}>{resume.personal.title || "Professional title"}</p>
      {contactItems.length > 0 ? <p className="mt-4 text-sm leading-7 text-on-surface-variant">{contactItems.join(" • ")}</p> : null}
    </header>
  );
}

function ResumeSection({ resume, section, theme }: { resume: ResumeDocument; section: ResumeContentSection; theme: PreviewTheme }) {
  if (!hasRenderableContent(resume, section)) {
    return null;
  }

  if (section === "summary") {
    return (
      <section className="page-break-avoid">
        <SectionHeading label={sectionTitle(section, resume)} theme={theme} />
        <p className="text-sm leading-7 text-on-surface-variant">{resume.summary}</p>
      </section>
    );
  }

  if (section === "skills") {
    return (
      <section className="page-break-avoid">
        <SectionHeading label={sectionTitle(section, resume)} theme={theme} />
        <div className="space-y-3">
          {resume.skillGroups
            .filter((group) => hasText(group.name) || group.skills.some((skill) => hasText(skill)))
            .map((group) => (
              <div key={group.id} className={cn("rounded-2xl p-4", theme.card)}>
                <p className="text-sm font-semibold text-on-surface">{group.name || "Skill Group"}</p>
                <p className="mt-2 text-sm leading-7 text-on-surface-variant">{group.skills.filter(hasText).join(" • ")}</p>
              </div>
            ))}
        </div>
      </section>
    );
  }

  if (section === "projects") {
    return (
      <section className="page-break-avoid">
        <SectionHeading label="Projects" theme={theme} />
        <div className="space-y-5">
          {resume.projects
            .filter((item) => hasText(item.name) || hasText(item.description) || hasText(item.role))
            .map((project) => (
              <article key={project.id}>
                <div className="flex items-start justify-between gap-4 text-sm font-semibold text-on-surface">
                  <span>{project.name || "Project"}</span>
                  <span className={theme.accentText}>{formatDateRange(project.startDate, project.endDate)}</span>
                </div>
                {project.role ? <p className="mt-1 text-sm italic text-on-surface-variant">{project.role}</p> : null}
                {project.description ? <p className="mt-2 text-sm leading-7 text-on-surface-variant">{project.description}</p> : null}
                {project.link ? <p className={cn("mt-2 text-sm", theme.accentText)}>{project.link}</p> : null}
              </article>
            ))}
        </div>
      </section>
    );
  }

  if (section === "experience") {
    return (
      <section className="page-break-avoid">
        <SectionHeading label="Work Experience" theme={theme} />
        <div className="space-y-6">
          {resume.experiences
            .filter((item) => hasText(item.jobTitle) || hasText(item.employer) || item.bullets.some((bullet) => hasText(bullet)))
            .map((item) => (
              <article key={item.id}>
                <div className="flex items-start justify-between gap-4 text-sm font-semibold text-on-surface">
                  <span>{item.jobTitle || "Role"}</span>
                  <span className={theme.accentText}>{formatDateRange(item.startDate, item.endDate, item.current)}</span>
                </div>
                <p className="mt-1 text-sm italic text-on-surface-variant">{[item.employer, item.location].filter(hasText).join(" • ")}</p>
                {item.description ? <p className="mt-2 text-sm leading-7 text-on-surface-variant">{item.description}</p> : null}
                {item.bullets.filter(hasText).length > 0 ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-7 text-on-surface-variant">
                    {item.bullets.filter(hasText).map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
        </div>
      </section>
    );
  }

  if (section === "education") {
    return (
      <section className="page-break-avoid">
        <SectionHeading label="Education" theme={theme} />
        <div className="space-y-4">
          {resume.education
            .filter((item) => hasText(item.degree) || hasText(item.school))
            .map((item) => (
              <article key={item.id}>
                <p className="text-sm font-semibold text-on-surface">{item.degree || "Degree"}</p>
                <p className="text-sm text-on-surface-variant">{[item.school, item.location].filter(hasText).join(" • ")}</p>
                <p className={cn("mt-1 text-xs font-bold uppercase tracking-[0.22em]", theme.accentText)}>{formatDateRange(item.startDate, item.endDate)}</p>
                {item.description ? <p className="mt-2 text-sm leading-7 text-on-surface-variant">{item.description}</p> : null}
              </article>
            ))}
        </div>
      </section>
    );
  }

  const items =
    section === "certifications"
      ? resume.certifications.map((item) => ({ id: item.id, title: item.name, subtitle: item.issuer, date: item.date, description: item.description }))
      : section === "awards"
        ? resume.awards.map((item) => ({ id: item.id, title: item.title, subtitle: item.issuer, date: item.date, description: item.description }))
        : resume.activities.map((item) => ({ id: item.id, title: item.name, subtitle: item.organization, date: item.date, description: item.description }));

  return (
    <section className="page-break-avoid">
      <SectionHeading label={sectionTitle(section, resume)} theme={theme} />
      <div className="space-y-4">
        {items
          .filter((item) => hasText(item.title) || hasText(item.subtitle))
          .map((item) => (
            <article key={item.id}>
              <div className="flex items-start justify-between gap-4 text-sm font-semibold text-on-surface">
                <span>{item.title || "Item"}</span>
                {item.date ? <span className={theme.accentText}>{item.date}</span> : null}
              </div>
              {item.subtitle ? <p className="mt-1 text-sm text-on-surface-variant">{item.subtitle}</p> : null}
              {item.description ? <p className="mt-2 text-sm leading-7 text-on-surface-variant">{item.description}</p> : null}
            </article>
          ))}
      </div>
    </section>
  );
}

export function ResumeDocumentPreview({ resume }: { resume: ResumeDocument }) {
  const theme = previewThemes[resume.templateId];
  const orderedSections = getSectionOrder(resume).filter((section) => hasRenderableContent(resume, section));

  return (
    <div className={theme.shell}>
      <ResumeHeader resume={resume} theme={theme} />
      <div className="mt-8 space-y-8">
        {orderedSections.map((section) => (
          <ResumeSection key={section} resume={resume} section={section} theme={theme} />
        ))}
      </div>
      {resume.templateId === "creative" ? (
        <div className="mt-8 flex flex-wrap gap-2 border-t border-primary/15 pt-6">
          {resume.skillGroups
            .flatMap((group) => group.skills)
            .filter(hasText)
            .slice(0, 6)
            .map((skill) => (
              <span key={skill} className={cn("rounded-full px-3 py-1.5 text-xs font-semibold", theme.tag)}>
                {skill}
              </span>
            ))}
        </div>
      ) : null}
    </div>
  );
}
