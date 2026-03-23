/* eslint-disable @next/next/no-img-element */
import { getSectionOrder, getSkillSectionLabel } from "@/lib/resume-metadata";
import type { ResumeContentSection, ResumeDocument, TemplateId } from "@/lib/types";

type InlineItem = {
  label: string;
  href?: string;
  external?: boolean;
};
import { cn, formatDateRange } from "@/lib/utils";

type PreviewTheme = {
  shell: string;
  divider: string;
  heading: string;
  accentText: string;
  tag: string;
  subtleText: string;
};

const previewThemes: Record<TemplateId, PreviewTheme> = {
  professional: {
    shell: "resume-paper resume-density-compact print-friendly rounded-[1rem] bg-white px-6 py-5 shadow-float",
    divider: "border-primary/20",
    heading: "text-primary border-primary/55",
    accentText: "text-primary",
    tag: "bg-primary/10 text-on-surface",
    subtleText: "text-on-surface-variant"
  },
  minimal: {
    shell: "resume-paper resume-density-compact print-friendly rounded-[1rem] border border-outline-variant/35 bg-white px-6 py-5 shadow-float",
    divider: "border-outline-variant/40",
    heading: "text-on-surface border-outline-variant/60",
    accentText: "text-on-surface-variant",
    tag: "bg-surface-container-low text-on-surface",
    subtleText: "text-on-surface-variant"
  },
  creative: {
    shell: "resume-paper resume-density-compact print-friendly rounded-[1rem] border border-primary/15 bg-white px-6 py-5 shadow-float",
    divider: "border-primary/25",
    heading: "text-primary border-primary/75",
    accentText: "text-primary",
    tag: "bg-primary/10 text-primary",
    subtleText: "text-on-surface-variant"
  }
};

function hasText(value: string) {
  return value.trim().length > 0;
}

function formatLinkLabel(value: string) {
  return value.trim().replace(/^(https?:\/\/|mailto:|tel:)/i, "").replace(/\/$/, "");
}

function normalizeExternalHref(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  return /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function normalizePhoneHref(value: string) {
  const sanitized = value.trim().replace(/[^\d+]/g, "");
  return sanitized ? `tel:${sanitized}` : "";
}

function renderInlineItems(items: InlineItem[], className: string, theme: PreviewTheme) {
  if (items.length === 0) {
    return null;
  }

  return (
    <p className={cn(className, theme.subtleText)}>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`}>
          {index > 0 ? " | " : null}
          {item.href ? (
            <a
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noreferrer" : undefined}
              className="underline-offset-2 transition hover:underline"
            >
              {item.label}
            </a>
          ) : (
            item.label
          )}
        </span>
      ))}
    </p>
  );
}

function compactInlineItems(items: Array<InlineItem | null | false>): InlineItem[] {
  return items.filter((item): item is InlineItem => Boolean(item));
}

function buildContactItems(resume: ResumeDocument): InlineItem[] {
  return compactInlineItems([
    resume.personal.email ? { label: resume.personal.email.trim(), href: `mailto:${resume.personal.email.trim()}` } : null,
    resume.personal.phone ? { label: resume.personal.phone.trim(), href: normalizePhoneHref(resume.personal.phone) } : null,
    resume.personal.location ? { label: resume.personal.location.trim() } : null,
    resume.personal.website ? { label: formatLinkLabel(resume.personal.website), href: normalizeExternalHref(resume.personal.website), external: true } : null,
    resume.personal.linkedin ? { label: formatLinkLabel(resume.personal.linkedin), href: normalizeExternalHref(resume.personal.linkedin), external: true } : null,
    resume.personal.github ? { label: formatLinkLabel(resume.personal.github), href: normalizeExternalHref(resume.personal.github), external: true } : null
  ]);
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
  return <h2 className={cn("mb-2 border-b pb-1 font-[var(--font-headline)] text-[11px] font-extrabold uppercase tracking-[0.22em]", theme.heading)}>{label}</h2>;
}

function ResumeIdentity({ resume, theme }: { resume: ResumeDocument; theme: PreviewTheme }) {
  const contactItems = buildContactItems(resume);

  return (
    <div className="min-w-0">
      <h1 className="font-[var(--font-headline)] text-[27px] font-extrabold tracking-tight text-on-surface">{resume.personal.fullName || "Your name"}</h1>
      <p className={cn("mt-0.5 text-[13px] font-semibold", theme.accentText)}>{resume.personal.title || "Professional title"}</p>
      {renderInlineItems(contactItems, "mt-1.5 text-[10.5px] leading-[1.45]", theme)}
    </div>
  );
}

function ResumeHeader({ resume, theme, showSummary }: { resume: ResumeDocument; theme: PreviewTheme; showSummary: boolean }) {
  const photo = resume.avatarUrl ? (
    <img
      src={resume.avatarUrl}
      alt={resume.personal.fullName || "Profile photo"}
      className={cn(
        "shrink-0 object-cover border border-outline-variant/25",
        resume.avatarFrame === "portrait" ? "h-[198px] w-[144px] rounded-[1rem]" : "h-[144px] w-[144px] rounded-[1rem]"
      )}
    />
  ) : null;

  if (photo) {
    return (
      <header className={cn("border-b pb-3", theme.divider)}>
        <div className="grid items-start gap-x-4 gap-y-2 [grid-template-columns:minmax(0,1fr)_144px]">
          <ResumeIdentity resume={resume} theme={theme} />
          <div className="row-span-2 flex justify-end">{photo}</div>
          {showSummary ? (
            <section className="min-w-0">
              <SectionHeading label="Professional Summary" theme={theme} />
              <p className={cn("pr-1 text-[11px] leading-[1.42]", theme.subtleText)}>{resume.summary}</p>
            </section>
          ) : null}
        </div>
      </header>
    );
  }

  return (
    <header className={cn("border-b pb-3", theme.divider)}>
      <ResumeIdentity resume={resume} theme={theme} />
      {showSummary ? (
        <section className="mt-3 min-w-0">
          <SectionHeading label="Professional Summary" theme={theme} />
          <p className={cn("text-[11px] leading-[1.42]", theme.subtleText)}>{resume.summary}</p>
        </section>
      ) : null}
    </header>
  );
}

function ResumeSection({ resume, section, theme }: { resume: ResumeDocument; section: ResumeContentSection; theme: PreviewTheme }) {
  if (!hasRenderableContent(resume, section)) {
    return null;
  }

  if (section === "summary") {
    return (
      <section>
        <SectionHeading label={sectionTitle(section, resume)} theme={theme} />
        <p className={cn("text-[11px] leading-[1.45]", theme.subtleText)}>{resume.summary}</p>
      </section>
    );
  }

  if (section === "skills") {
    return (
      <section>
        <SectionHeading label={sectionTitle(section, resume)} theme={theme} />
        <div className="space-y-2">
          {resume.skillGroups
            .filter((group) => hasText(group.name) || group.skills.some((skill) => hasText(skill)))
            .map((group) => (
              <div key={group.id} className="text-[11px] leading-[1.4] text-on-surface">
                <span className="font-semibold">{group.name || "Skill Group"}: </span>
                <span className={theme.subtleText}>{group.skills.filter(hasText).join(" | ")}</span>
              </div>
            ))}
        </div>
      </section>
    );
  }

  if (section === "projects") {
    return (
      <section>
        <SectionHeading label="Projects" theme={theme} />
        <div className="space-y-2.5">
          {resume.projects
            .filter((item) => hasText(item.name) || hasText(item.description) || hasText(item.role))
            .map((project) => (
              <article key={project.id} className="page-break-avoid">
                <div className="flex items-start justify-between gap-3 text-[11px] font-semibold text-on-surface">
                  <span>{project.name || "Project"}</span>
                  <span className={cn("shrink-0", theme.accentText)}>{formatDateRange(project.startDate, project.endDate)}</span>
                </div>
                {renderInlineItems(compactInlineItems([project.role ? { label: project.role } : null, project.link ? { label: formatLinkLabel(project.link), href: normalizeExternalHref(project.link), external: true } : null]), "mt-0.5 text-[11px] italic", theme)}
                {project.description ? <p className={cn("mt-1 text-[11px] leading-[1.45]", theme.subtleText)}>{project.description}</p> : null}
              </article>
            ))}
        </div>
      </section>
    );
  }

  if (section === "experience") {
    return (
      <section>
        <SectionHeading label="Work Experience" theme={theme} />
        <div className="space-y-2.5">
          {resume.experiences
            .filter((item) => hasText(item.jobTitle) || hasText(item.employer) || item.bullets.some((bullet) => hasText(bullet)))
            .map((item) => (
              <article key={item.id} className="page-break-avoid">
                <div className="flex items-start justify-between gap-3 text-[11px] font-semibold text-on-surface">
                  <span>{item.jobTitle || "Role"}</span>
                  <span className={cn("shrink-0", theme.accentText)}>{formatDateRange(item.startDate, item.endDate, item.current)}</span>
                </div>
                <p className={cn("mt-0.5 text-[11px] italic", theme.subtleText)}>{[item.employer, item.location].filter(hasText).join(" | ")}</p>
                {item.description ? <p className={cn("mt-1 text-[11px] leading-[1.45]", theme.subtleText)}>{item.description}</p> : null}
                {item.bullets.filter(hasText).length > 0 ? (
                  <ul className={cn("mt-1 list-disc space-y-0.5 pl-4 text-[11px] leading-[1.4]", theme.subtleText)}>
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
      <section>
        <SectionHeading label="Education" theme={theme} />
        <div className="space-y-2">
          {resume.education
            .filter((item) => hasText(item.degree) || hasText(item.school))
            .map((item) => (
              <article key={item.id} className="page-break-avoid">
                <div className="flex items-start justify-between gap-3 text-[11px] font-semibold text-on-surface">
                  <span>{item.degree || "Degree"}</span>
                  <span className={cn("shrink-0", theme.accentText)}>{formatDateRange(item.startDate, item.endDate)}</span>
                </div>
                <p className={cn("mt-0.5 text-[11px]", theme.subtleText)}>{[item.school, item.location].filter(hasText).join(" | ")}</p>
                {item.description ? <p className={cn("mt-1 text-[11px] leading-[1.4]", theme.subtleText)}>{item.description}</p> : null}
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
    <section>
      <SectionHeading label={sectionTitle(section, resume)} theme={theme} />
      <div className="space-y-2">
        {items
          .filter((item) => hasText(item.title) || hasText(item.subtitle))
          .map((item) => (
            <article key={item.id} className="page-break-avoid">
              <div className="flex items-start justify-between gap-3 text-[11px] font-semibold text-on-surface">
                <span>{item.title || "Item"}</span>
                {item.date ? <span className={cn("shrink-0", theme.accentText)}>{item.date}</span> : null}
              </div>
              {item.subtitle ? <p className={cn("mt-0.5 text-[11px]", theme.subtleText)}>{item.subtitle}</p> : null}
              {item.description ? <p className={cn("mt-1 text-[11px] leading-[1.4]", theme.subtleText)}>{item.description}</p> : null}
            </article>
          ))}
      </div>
    </section>
  );
}

export function ResumeDocumentPreview({ resume }: { resume: ResumeDocument }) {
  const theme = previewThemes[resume.templateId];
  const orderedSections = getSectionOrder(resume).filter((section) => hasRenderableContent(resume, section));
  const showSummary = orderedSections.includes("summary");
  const bodySections = orderedSections.filter((section) => section !== "summary");
  const allSkills = resume.skillGroups.flatMap((group) => group.skills).filter(hasText);

  return (
    <div className={theme.shell}>
      <ResumeHeader resume={resume} theme={theme} showSummary={showSummary} />
      <div className="mt-3.5 space-y-3">
        {bodySections.map((section) => (
          <ResumeSection key={section} resume={resume} section={section} theme={theme} />
        ))}
      </div>
      {resume.templateId === "creative" && allSkills.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-primary/15 pt-2.5">
          {allSkills.slice(0, 6).map((skill) => (
            <span key={skill} className={cn("rounded-full px-2.5 py-1 text-[10px] font-semibold", theme.tag)}>
              {skill}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

