import { ResumeAvatarFrame } from "@/components/resume/resume-avatar-frame";
import { getResumeContent, mergeLocalizedItems } from "@/lib/resume-content";
import { getSectionOrder, getSkillSectionLabel } from "@/lib/resume-metadata";
import type { Locale, ResumeContentSection, ResumeDocument, TemplateId } from "@/lib/types";
import { cn, formatDateRange } from "@/lib/utils";

type InlineItem = {
  label: string;
  href?: string;
  external?: boolean;
};

type PreviewTheme = {
  kind: "standard" | "dark-portfolio" | "modern-columns";
  shell: string;
  divider: string;
  heading: string;
  accentText: string;
  tag: string;
  subtleText: string;
  photoClass: string;
  bodySpacing: string;
  sectionSpacing: string;
  itemCard?: string;
  summaryCard?: string;
  showSkillBand?: boolean;
};

const previewThemes: Record<TemplateId, PreviewTheme> = {
  professional: {
    kind: "standard",
    shell: "resume-paper resume-density-compact print-friendly rounded-[1rem] bg-white px-6 py-5 shadow-float",
    divider: "border-primary/20",
    heading: "text-primary border-primary/55",
    accentText: "text-primary",
    tag: "bg-primary/10 text-on-surface",
    subtleText: "text-on-surface-variant",
    photoClass: "h-[198px] w-[144px] rounded-[1rem]",
    bodySpacing: "mt-3.5",
    sectionSpacing: "space-y-3"
  },
  minimal: {
    kind: "standard",
    shell: "resume-paper resume-density-compact print-friendly rounded-[1rem] border border-outline-variant/35 bg-white px-6 py-5 shadow-float",
    divider: "border-outline-variant/40",
    heading: "text-on-surface border-outline-variant/60",
    accentText: "text-on-surface-variant",
    tag: "bg-surface-container-low text-on-surface",
    subtleText: "text-on-surface-variant",
    photoClass: "h-[188px] w-[140px] rounded-[1rem]",
    bodySpacing: "mt-3.5",
    sectionSpacing: "space-y-3"
  },
  creative: {
    kind: "standard",
    shell: "resume-paper resume-density-compact print-friendly rounded-[1rem] border border-primary/15 bg-white px-6 py-5 shadow-float",
    divider: "border-primary/25",
    heading: "text-primary border-primary/75",
    accentText: "text-primary",
    tag: "bg-primary/10 text-primary",
    subtleText: "text-on-surface-variant",
    photoClass: "h-[196px] w-[144px] rounded-[1.2rem]",
    bodySpacing: "mt-3.5",
    sectionSpacing: "space-y-3",
    summaryCard: "rounded-[1.25rem] bg-primary/5 p-3",
    showSkillBand: true
  },
  "corporate-slate": {
    kind: "standard",
    shell: "resume-paper resume-density-compact print-friendly rounded-[1rem] border border-slate-200 bg-slate-50 px-6 py-5 shadow-float",
    divider: "border-slate-300",
    heading: "text-slate-700 border-slate-300",
    accentText: "text-slate-700",
    tag: "bg-slate-200 text-slate-700",
    subtleText: "text-slate-600",
    photoClass: "h-[192px] w-[140px] rounded-[1rem]",
    bodySpacing: "mt-3.5",
    sectionSpacing: "space-y-3",
    itemCard: "rounded-[1rem] border border-slate-200 bg-white p-3"
  },
  "compact-fresher": {
    kind: "standard",
    shell: "resume-paper resume-density-compact print-friendly rounded-[1rem] border border-outline-variant/30 bg-white px-5 py-4 shadow-float",
    divider: "border-primary/15",
    heading: "text-primary border-primary/30",
    accentText: "text-primary",
    tag: "bg-primary/10 text-primary",
    subtleText: "text-on-surface-variant",
    photoClass: "h-[182px] w-[132px] rounded-[1rem]",
    bodySpacing: "mt-3",
    sectionSpacing: "space-y-2.5"
  },
  "clean-showcase": {
    kind: "standard",
    shell: "resume-paper resume-density-compact print-friendly rounded-[1rem] border border-primary/20 bg-white px-6 py-5 shadow-float",
    divider: "border-primary/20",
    heading: "text-primary border-primary/55",
    accentText: "text-primary",
    tag: "bg-primary/12 text-primary",
    subtleText: "text-on-surface-variant",
    photoClass: "h-[196px] w-[144px] rounded-[1.2rem]",
    bodySpacing: "mt-3.5",
    sectionSpacing: "space-y-3",
    itemCard: "rounded-[1rem] border border-primary/15 bg-primary/5 p-3",
    summaryCard: "rounded-[1.25rem] border border-primary/15 bg-primary/5 p-3",
    showSkillBand: true
  },
  "dark-portfolio": {
    kind: "dark-portfolio",
    shell: "resume-paper resume-density-compact print-friendly rounded-[1rem] bg-[#121212] px-0 py-0 text-white shadow-float",
    divider: "border-white/10",
    heading: "text-white border-white/15",
    accentText: "text-white",
    tag: "bg-white/10 text-white",
    subtleText: "text-white/65",
    photoClass: "h-[220px] w-[160px] rounded-[1.25rem]",
    bodySpacing: "",
    sectionSpacing: "space-y-4",
    itemCard: "rounded-[1.1rem] border border-white/10 bg-white/5 p-4",
    showSkillBand: false
  },
  "modern-columns": {
    kind: "modern-columns",
    shell: "resume-paper resume-density-compact print-friendly rounded-[1rem] border border-outline-variant/30 bg-white px-6 py-5 shadow-float",
    divider: "border-primary/20",
    heading: "text-primary border-primary/45",
    accentText: "text-primary",
    tag: "bg-primary/10 text-primary",
    subtleText: "text-on-surface-variant",
    photoClass: "h-[188px] w-[140px] rounded-[1rem]",
    bodySpacing: "mt-4",
    sectionSpacing: "space-y-3",
    itemCard: "rounded-[1rem] bg-surface-container-low p-3"
  }
};

const previewLabels: Record<Locale, Record<ResumeContentSection, string>> = {
  en: {
    summary: "PROFESSIONAL SUMMARY",
    skills: "SKILLS",
    projects: "PROJECTS",
    experience: "WORK EXPERIENCE",
    education: "EDUCATION",
    certifications: "CERTIFICATIONS",
    awards: "AWARDS",
    activities: "ACTIVITIES"
  },
  vi: {
    summary: "TOM TAT CHUYEN MON",
    skills: "KY NANG",
    projects: "DU AN",
    experience: "KINH NGHIEM LAM VIEC",
    education: "HOC VAN",
    certifications: "CHUNG CHI",
    awards: "GIAI THUONG",
    activities: "HOAT DONG"
  }
};

type ResumeView = ReturnType<typeof buildResumeView>;
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

function compactInlineItems(items: Array<InlineItem | null | false>): InlineItem[] {
  return items.filter((item): item is InlineItem => Boolean(item));
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
            <a href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noreferrer" : undefined} className="underline-offset-2 transition hover:underline">
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

function buildResumeView(resume: ResumeDocument) {
  const locale = resume.contentLocale;
  const content = getResumeContent(resume);
  const experiences = mergeLocalizedItems(resume.experiences, content.experiences);
  const education = mergeLocalizedItems(resume.education, content.education);
  const projects = mergeLocalizedItems(resume.projects, content.projects);
  const certifications = mergeLocalizedItems(resume.certifications, content.certifications);
  const awards = mergeLocalizedItems(resume.awards, content.awards);
  const activities = mergeLocalizedItems(resume.activities, content.activities);

  return {
    locale,
    content,
    labels: previewLabels[locale],
    experiences,
    education,
    projects,
    certifications,
    awards,
    activities,
    skills: content.skillGroups,
    allSkills: content.skillGroups.flatMap((group) => group.skills).filter(hasText),
    contactItems: compactInlineItems([
      resume.personal.email ? { label: resume.personal.email.trim(), href: `mailto:${resume.personal.email.trim()}` } : null,
      resume.personal.phone ? { label: resume.personal.phone.trim(), href: normalizePhoneHref(resume.personal.phone) } : null,
      content.personal.location ? { label: content.personal.location.trim() } : null,
      resume.personal.website ? { label: formatLinkLabel(resume.personal.website), href: normalizeExternalHref(resume.personal.website), external: true } : null,
      resume.personal.linkedin ? { label: formatLinkLabel(resume.personal.linkedin), href: normalizeExternalHref(resume.personal.linkedin), external: true } : null,
      resume.personal.github ? { label: formatLinkLabel(resume.personal.github), href: normalizeExternalHref(resume.personal.github), external: true } : null
    ])
  };
}

function hasRenderableContent(view: ResumeView, section: ResumeContentSection) {
  switch (section) {
    case "summary":
      return hasText(view.content.summary);
    case "skills":
      return view.skills.some((group) => hasText(group.name) || group.skills.some(hasText));
    case "projects":
      return view.projects.some((item) => hasText(item.name) || hasText(item.description) || hasText(item.role));
    case "experience":
      return view.experiences.some((item) => hasText(item.jobTitle) || hasText(item.employer) || item.bullets.some(hasText));
    case "education":
      return view.education.some((item) => hasText(item.degree) || hasText(item.school));
    case "certifications":
      return view.certifications.some((item) => hasText(item.name) || hasText(item.issuer));
    case "awards":
      return view.awards.some((item) => hasText(item.title) || hasText(item.issuer));
    case "activities":
      return view.activities.some((item) => hasText(item.name) || hasText(item.organization));
  }
}

function getSectionLabel(section: ResumeContentSection, resume: ResumeDocument, view: ResumeView) {
  if (section === "skills") {
    return getSkillSectionLabel(resume.industryFocus, view.locale).toUpperCase();
  }

  return view.labels[section];
}

function SectionHeading({ label, theme }: { label: string; theme: PreviewTheme }) {
  return <h2 className={cn("mb-2 border-b pb-1 font-[var(--font-headline)] text-[11px] font-extrabold", theme.heading)}>{label}</h2>;
}

function ResumeIdentity({ view, theme }: { view: ResumeView; theme: PreviewTheme }) {
  return (
    <div className="min-w-0">
      <h1 className={cn("font-[var(--font-headline)] text-[27px] font-extrabold tracking-tight", theme.accentText)}>{view.content.personal.fullName || "Your name"}</h1>
      <p className={cn("mt-0.5 text-[13px] font-semibold", theme.accentText)}>{view.content.personal.title || "Professional title"}</p>
      {renderInlineItems(view.contactItems, "mt-1.5 text-[10.5px] leading-[1.45]", theme)}
    </div>
  );
}

function StandardResumeHeader({ resume, theme, view, showSummary }: { resume: ResumeDocument; theme: PreviewTheme; view: ResumeView; showSummary: boolean }) {
  const photo = resume.avatarUrl ? (
    <ResumeAvatarFrame src={resume.avatarUrl} alt={view.content.personal.fullName || "Profile photo"} frame={resume.avatarFrame} transform={resume.avatarTransform} className={theme.photoClass} fallbackText={view.content.personal.fullName.slice(0, 1) || "A"} imageClassName="border border-outline-variant/25" />
  ) : null;

  if (photo) {
    return (
      <header className={cn("border-b pb-3", theme.divider)}>
        <div className="grid items-start gap-x-4 gap-y-2 [grid-template-columns:minmax(0,1fr)_144px]">
          <ResumeIdentity view={view} theme={theme} />
          <div className="row-span-2 flex justify-end">{photo}</div>
          {showSummary ? (
            <section className={cn("min-w-0", theme.summaryCard)}>
              <SectionHeading label={view.labels.summary} theme={theme} />
              <p className={cn("pr-1 text-[11px] leading-[1.42]", theme.subtleText)}>{view.content.summary}</p>
            </section>
          ) : null}
        </div>
      </header>
    );
  }

  return (
    <header className={cn("border-b pb-3", theme.divider)}>
      <ResumeIdentity view={view} theme={theme} />
      {showSummary ? (
        <section className={cn("mt-3 min-w-0", theme.summaryCard)}>
          <SectionHeading label={view.labels.summary} theme={theme} />
          <p className={cn("text-[11px] leading-[1.42]", theme.subtleText)}>{view.content.summary}</p>
        </section>
      ) : null}
    </header>
  );
}

function ResumeSection({ resume, section, theme, view }: { resume: ResumeDocument; section: ResumeContentSection; theme: PreviewTheme; view: ResumeView }) {
  if (!hasRenderableContent(view, section)) {
    return null;
  }

  if (section === "summary") {
    return (
      <section className={theme.itemCard}>
        <SectionHeading label={view.labels.summary} theme={theme} />
        <p className={cn("text-[11px] leading-[1.45]", theme.subtleText)}>{view.content.summary}</p>
      </section>
    );
  }

  if (section === "skills") {
    return (
      <section className={theme.itemCard}>
        <SectionHeading label={getSectionLabel(section, resume, view)} theme={theme} />
        <div className="space-y-2">
          {view.skills.filter((group) => hasText(group.name) || group.skills.some(hasText)).map((group) => (
            <div key={group.id} className="text-[11px] leading-[1.4] text-on-surface">
              <span className={cn("font-semibold", theme.accentText)}>{group.name || "Skill Group"}: </span>
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
        <SectionHeading label={view.labels.projects} theme={theme} />
        <div className="space-y-2.5">
          {view.projects.filter((item) => hasText(item.name) || hasText(item.description) || hasText(item.role)).map((project) => (
            <article key={project.id} className={cn("page-break-avoid", theme.itemCard)}>
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
        <SectionHeading label={view.labels.experience} theme={theme} />
        <div className="space-y-2.5">
          {view.experiences.filter((item) => hasText(item.jobTitle) || hasText(item.employer) || item.bullets.some(hasText)).map((item) => (
            <article key={item.id} className={cn("page-break-avoid", theme.itemCard)}>
              <div className="flex items-start justify-between gap-3 text-[11px] font-semibold text-on-surface">
                <span>{item.jobTitle || "Role"}</span>
                <span className={cn("shrink-0", theme.accentText)}>{formatDateRange(item.startDate, item.endDate, item.current)}</span>
              </div>
              <p className={cn("mt-0.5 text-[11px] italic", theme.subtleText)}>{[item.employer, item.location].filter(hasText).join(" | ")}</p>
              {item.description ? <p className={cn("mt-1 text-[11px] leading-[1.45]", theme.subtleText)}>{item.description}</p> : null}
              {item.bullets.filter(hasText).length > 0 ? <ul className={cn("mt-1 list-disc space-y-0.5 pl-4 text-[11px] leading-[1.4]", theme.subtleText)}>{item.bullets.filter(hasText).map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
            </article>
          ))}
        </div>
      </section>
    );
  }
  if (section === "education") {
    return (
      <section>
        <SectionHeading label={view.labels.education} theme={theme} />
        <div className="space-y-2">
          {view.education.filter((item) => hasText(item.degree) || hasText(item.school)).map((item) => (
            <article key={item.id} className={cn("page-break-avoid", theme.itemCard)}>
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
      ? view.certifications.map((item) => ({ id: item.id, title: item.name, subtitle: item.issuer, date: item.date, description: item.description }))
      : section === "awards"
        ? view.awards.map((item) => ({ id: item.id, title: item.title, subtitle: item.issuer, date: item.date, description: item.description }))
        : view.activities.map((item) => ({ id: item.id, title: item.name, subtitle: item.organization, date: item.date, description: item.description }));

  return (
    <section>
      <SectionHeading label={getSectionLabel(section, resume, view)} theme={theme} />
      <div className="space-y-2">
        {items.filter((item) => hasText(item.title) || hasText(item.subtitle)).map((item) => (
          <article key={item.id} className={cn("page-break-avoid", theme.itemCard)}>
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

function StandardResumeLayout({ resume, theme, view }: { resume: ResumeDocument; theme: PreviewTheme; view: ResumeView }) {
  const orderedSections = getSectionOrder(resume).filter((section) => hasRenderableContent(view, section));
  const showSummary = orderedSections.includes("summary");
  const bodySections = orderedSections.filter((section) => section !== "summary");

  return (
    <div className={theme.shell}>
      <StandardResumeHeader resume={resume} theme={theme} view={view} showSummary={showSummary} />
      <div className={cn(theme.bodySpacing, theme.sectionSpacing)}>
        {bodySections.map((section) => <ResumeSection key={section} resume={resume} section={section} theme={theme} view={view} />)}
      </div>
      {theme.showSkillBand && view.allSkills.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-primary/15 pt-2.5">
          {view.allSkills.slice(0, 8).map((skill) => <span key={skill} className={cn("rounded-full px-2.5 py-1 text-[10px] font-semibold", theme.tag)}>{skill}</span>)}
        </div>
      ) : null}
    </div>
  );
}

function SidebarCompactSection({ title, children, theme }: { title: string; children: React.ReactNode; theme: PreviewTheme }) {
  if (!children) {
    return null;
  }

  return (
    <section>
      <SectionHeading label={title} theme={theme} />
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function DarkPortfolioLayout({ resume, theme, view }: { resume: ResumeDocument; theme: PreviewTheme; view: ResumeView }) {
  const experiences = view.experiences.filter((item) => hasText(item.jobTitle) || hasText(item.employer) || item.bullets.some(hasText));
  const projects = view.projects.filter((item) => hasText(item.name) || hasText(item.description) || hasText(item.role));
  const education = view.education.filter((item) => hasText(item.degree) || hasText(item.school));
  const certifications = view.certifications.filter((item) => hasText(item.name) || hasText(item.issuer));
  const awards = view.awards.filter((item) => hasText(item.title) || hasText(item.issuer));

  return (
    <div className={theme.shell}>
      <div className="grid min-h-full [grid-template-columns:250px_minmax(0,1fr)]">
        <aside className="border-r border-white/10 p-6">
          <div className="space-y-5">
            {resume.avatarUrl ? <ResumeAvatarFrame src={resume.avatarUrl} alt={view.content.personal.fullName || "Profile photo"} frame={resume.avatarFrame} transform={resume.avatarTransform} className={theme.photoClass} fallbackText={view.content.personal.fullName.slice(0, 1) || "A"} /> : null}
            <div>
              <h1 className="font-[var(--font-headline)] text-[26px] font-extrabold tracking-tight text-white">{view.content.personal.fullName || "Your name"}</h1>
              <p className="mt-1 text-sm font-semibold text-white/80">{view.content.personal.title || "Professional title"}</p>
              {renderInlineItems(view.contactItems, "mt-3 text-[10.5px] leading-5", theme)}
            </div>
            {hasText(view.content.summary) ? <SidebarCompactSection title={view.labels.summary} theme={theme}><p className="text-[10.5px] leading-[1.55] text-white/65">{view.content.summary}</p></SidebarCompactSection> : null}
            {education.length > 0 ? <SidebarCompactSection title={view.labels.education} theme={theme}>{education.map((item) => <article key={item.id} className="space-y-0.5 text-[10.5px] text-white/80"><div className="font-semibold text-white">{item.school || item.degree || "School"}</div><div>{item.degree}</div><div className="text-white/55">{formatDateRange(item.startDate, item.endDate)}</div></article>)}</SidebarCompactSection> : null}
            {certifications.length > 0 ? <SidebarCompactSection title={view.labels.certifications} theme={theme}>{certifications.map((item) => <article key={item.id} className="space-y-0.5 text-[10.5px] text-white/80"><div className="font-semibold text-white">{item.name || "Certification"}</div><div>{item.issuer}</div></article>)}</SidebarCompactSection> : null}
            {awards.length > 0 ? <SidebarCompactSection title={view.labels.awards} theme={theme}>{awards.map((item) => <article key={item.id} className="space-y-0.5 text-[10.5px] text-white/80"><div className="font-semibold text-white">{item.title || "Award"}</div><div>{item.issuer}</div></article>)}</SidebarCompactSection> : null}
            {view.allSkills.length > 0 ? <SidebarCompactSection title={getSkillSectionLabel(resume.industryFocus, view.locale).toUpperCase()} theme={theme}><div className="flex flex-wrap gap-1.5">{view.allSkills.slice(0, 18).map((skill) => <span key={skill} className={cn("rounded-full px-2.5 py-1 text-[10px] font-semibold", theme.tag)}>{skill}</span>)}</div></SidebarCompactSection> : null}
          </div>
        </aside>
        <section className="p-6">
          <div className="space-y-5">
            {experiences.length > 0 ? <section><SectionHeading label={view.labels.experience} theme={theme} /><div className="space-y-4">{experiences.map((item) => <article key={item.id} className={cn("grid gap-4 page-break-avoid", theme.itemCard, "[grid-template-columns:72px_minmax(0,1fr)]")}><div className="pt-1 text-[10.5px] font-semibold text-white/55">{formatDateRange(item.startDate, item.endDate, item.current)}</div><div className="border-l border-white/10 pl-4"><div className="text-[12px] font-semibold text-white">{item.jobTitle || "Role"}</div><p className="mt-0.5 text-[10.5px] text-white/60">{[item.employer, item.location].filter(hasText).join(" | ")}</p>{item.description ? <p className="mt-2 text-[10.5px] leading-[1.5] text-white/70">{item.description}</p> : null}{item.bullets.filter(hasText).length > 0 ? <ul className="mt-2 list-disc space-y-1 pl-4 text-[10.5px] leading-[1.45] text-white/70">{item.bullets.filter(hasText).map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}</div></article>)}</div></section> : null}
            {projects.length > 0 ? <section><SectionHeading label={view.labels.projects} theme={theme} /><div className="grid gap-3 md:grid-cols-2">{projects.map((project) => <article key={project.id} className={cn("page-break-avoid", theme.itemCard)}><div className="flex items-start justify-between gap-3 text-[11px] font-semibold text-white"><span>{project.name || "Project"}</span><span className="text-white/55">{formatDateRange(project.startDate, project.endDate)}</span></div>{renderInlineItems(compactInlineItems([project.role ? { label: project.role } : null, project.link ? { label: formatLinkLabel(project.link), href: normalizeExternalHref(project.link), external: true } : null]), "mt-1 text-[10.5px] italic", theme)}{project.description ? <p className="mt-2 text-[10.5px] leading-[1.5] text-white/70">{project.description}</p> : null}</article>)}</div></section> : null}
          </div>
        </section>
      </div>
    </div>
  );
}

function ModernColumnsLayout({ resume, theme, view }: { resume: ResumeDocument; theme: PreviewTheme; view: ResumeView }) {
  const orderedSections = getSectionOrder(resume).filter((section) => hasRenderableContent(view, section));
  const leftSections = orderedSections.filter((section) => ["summary", "skills", "education", "certifications", "awards", "activities"].includes(section));
  const rightSections = orderedSections.filter((section) => ["experience", "projects"].includes(section));

  return (
    <div className={theme.shell}>
      <StandardResumeHeader resume={resume} theme={theme} view={view} showSummary={false} />
      <div className={cn(theme.bodySpacing, "grid gap-5 [grid-template-columns:0.92fr_1.28fr]")}>
        <div className={cn("space-y-3 rounded-[1.5rem] bg-surface-container-low p-4", theme.divider)}>
          {leftSections.map((section) => <ResumeSection key={`left-${section}`} resume={resume} section={section} theme={theme} view={view} />)}
        </div>
        <div className={theme.sectionSpacing}>
          {rightSections.map((section) => <ResumeSection key={`right-${section}`} resume={resume} section={section} theme={theme} view={view} />)}
        </div>
      </div>
    </div>
  );
}

export function ResumeDocumentPreview({ resume }: { resume: ResumeDocument }) {
  const theme = previewThemes[resume.templateId];
  const view = buildResumeView(resume);

  if (theme.kind === "dark-portfolio") {
    return <DarkPortfolioLayout resume={resume} theme={theme} view={view} />;
  }

  if (theme.kind === "modern-columns") {
    return <ModernColumnsLayout resume={resume} theme={theme} view={view} />;
  }

  return <StandardResumeLayout resume={resume} theme={theme} view={view} />;
}

