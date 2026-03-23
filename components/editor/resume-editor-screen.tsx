/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import { useAuth } from "@/components/auth/auth-provider";
import { TemplateSwitcher } from "@/components/editor/template-switcher";
import { ResumeDocumentPreview } from "@/components/resume/resume-document-preview";
import {
  careerStageOptions,
  getIndustryFocusLabel,
  getSkillsHint,
  getSummaryHint,
  industryFocusOptions
} from "@/lib/resume-metadata";
import { getResume, saveResume, uploadAvatar } from "@/lib/services/resume-service";
import { templateLibrary } from "@/lib/template-library";
import type { ResumeDocument, ResumeFormSection } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useResumeEditorStore } from "@/store/resume-editor-store";

const sections: Array<{ id: ResumeFormSection; label: string }> = [
  { id: "personal", label: "Profile" },
  { id: "summary", label: "Summary" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "awards", label: "Awards" },
  { id: "activities", label: "Activities" }
];

const inputClass =
  "w-full rounded-xl border-0 bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none ring-0 transition focus:bg-white focus:shadow-sm";
const textareaClass = `${inputClass} min-h-[120px] resize-y`;

function SectionCard({
  active,
  title,
  description,
  children
}: {
  active: boolean;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("rounded-[1.75rem] bg-surface-container-lowest p-6 shadow-sm transition", active && "ring-2 ring-primary/20")}>
      <h2 className="font-[var(--font-headline)] text-2xl font-extrabold tracking-tight text-primary">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-on-surface-variant">{description}</p>
      <div className="mt-6 space-y-4">{children}</div>
    </section>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-bold uppercase tracking-[0.24em] text-on-surface-variant">{children}</label>;
}

function getCompletionScore(resume: ResumeDocument) {
  const checks = [
    Boolean(resume.personal.fullName && resume.personal.title && resume.personal.email),
    Boolean(resume.summary.trim()),
    resume.skillGroups.some((group) => group.name.trim() || group.skills.some(Boolean)),
    resume.projects.some((item) => item.name.trim() || item.description.trim()),
    resume.experiences.some((item) => item.jobTitle.trim() || item.employer.trim()),
    resume.education.some((item) => item.degree.trim() || item.school.trim())
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function ResumeEditorScreen({ resumeId }: { resumeId: string }) {
  const { user } = useAuth();
  const printRef = useRef<HTMLDivElement | null>(null);
  const resume = useResumeEditorStore((state) => state.resume);
  const dirty = useResumeEditorStore((state) => state.dirty);
  const activeSection = useResumeEditorStore((state) => state.activeSection);
  const setResume = useResumeEditorStore((state) => state.setResume);
  const markSaved = useResumeEditorStore((state) => state.markSaved);
  const setActiveSection = useResumeEditorStore((state) => state.setActiveSection);
  const updateTitle = useResumeEditorStore((state) => state.updateTitle);
  const updateTemplate = useResumeEditorStore((state) => state.updateTemplate);
  const updateIndustryFocus = useResumeEditorStore((state) => state.updateIndustryFocus);
  const updateCareerStage = useResumeEditorStore((state) => state.updateCareerStage);
  const updateSummary = useResumeEditorStore((state) => state.updateSummary);
  const setAvatarUrl = useResumeEditorStore((state) => state.setAvatarUrl);
  const updateAvatarFrame = useResumeEditorStore((state) => state.updateAvatarFrame);
  const clearAvatar = useResumeEditorStore((state) => state.clearAvatar);
  const updatePersonal = useResumeEditorStore((state) => state.updatePersonal);
  const updateExperience = useResumeEditorStore((state) => state.updateExperience);
  const updateExperienceBullets = useResumeEditorStore((state) => state.updateExperienceBullets);
  const addExperience = useResumeEditorStore((state) => state.addExperience);
  const removeExperience = useResumeEditorStore((state) => state.removeExperience);
  const updateEducation = useResumeEditorStore((state) => state.updateEducation);
  const addEducation = useResumeEditorStore((state) => state.addEducation);
  const removeEducation = useResumeEditorStore((state) => state.removeEducation);
  const updateProject = useResumeEditorStore((state) => state.updateProject);
  const addProject = useResumeEditorStore((state) => state.addProject);
  const removeProject = useResumeEditorStore((state) => state.removeProject);
  const updateSkillGroup = useResumeEditorStore((state) => state.updateSkillGroup);
  const updateSkillGroupSkills = useResumeEditorStore((state) => state.updateSkillGroupSkills);
  const addSkillGroup = useResumeEditorStore((state) => state.addSkillGroup);
  const removeSkillGroup = useResumeEditorStore((state) => state.removeSkillGroup);
  const updateCertification = useResumeEditorStore((state) => state.updateCertification);
  const addCertification = useResumeEditorStore((state) => state.addCertification);
  const removeCertification = useResumeEditorStore((state) => state.removeCertification);
  const updateAward = useResumeEditorStore((state) => state.updateAward);
  const addAward = useResumeEditorStore((state) => state.addAward);
  const removeAward = useResumeEditorStore((state) => state.removeAward);
  const updateActivity = useResumeEditorStore((state) => state.updateActivity);
  const addActivity = useResumeEditorStore((state) => state.addActivity);
  const removeActivity = useResumeEditorStore((state) => state.removeActivity);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [mobileView, setMobileView] = useState<"build" | "preview">("build");

  useEffect(() => {
    let cancelled = false;

    async function loadResume() {
      if (!user) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        const nextResume = await getResume(user.uid, resumeId);
        if (!nextResume) {
          throw new Error("Resume not found.");
        }

        if (!cancelled) {
          setResume(nextResume);
        }
      } catch (nextError) {
        if (!cancelled) {
          setError(nextError instanceof Error ? nextError.message : "Unable to load resume.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadResume();

    return () => {
      cancelled = true;
    };
  }, [resumeId, setResume, user]);

  useEffect(() => {
    if (!dirty) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dirty]);

  useEffect(() => {
    if (!statusMessage) {
      return;
    }

    const timer = window.setTimeout(() => setStatusMessage(""), 2500);
    return () => window.clearTimeout(timer);
  }, [statusMessage]);

  const progress = useMemo(() => (resume ? getCompletionScore(resume) : 0), [resume]);

  const activeTemplate = templateLibrary.find((template) => template.id === resume?.templateId);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: resume?.title ? `${resume.title.replace(/\s+/g, "-").toLowerCase()}` : "resume",
    pageStyle: "@page { size: A4; margin: 8mm; }"
  });

  async function handleSave() {
    if (!resume) {
      return;
    }

    setSaving(true);
    setStatusMessage("");

    try {
      const savedResume = await saveResume(resume);
      markSaved(savedResume);
      setStatusMessage("All changes saved.");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unable to save resume.");
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarUpload(event: ChangeEvent<HTMLInputElement>) {
    if (!user || !resume) {
      return;
    }

    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadingAvatar(true);
    setError("");

    try {
      const avatarUrl = await uploadAvatar(user.uid, resume.id, file);
      setAvatarUrl(avatarUrl);
      setStatusMessage("Photo stored in this browser for the current resume.");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unable to upload photo.");
    } finally {
      setUploadingAvatar(false);
      event.target.value = "";
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface px-6">
        <div className="rounded-[2rem] bg-surface-container-low p-8 text-center shadow-editorial">
          <div className="mx-auto h-10 w-10 animate-pulse rounded-full bg-primary-fixed" />
          <p className="mt-4 text-sm font-semibold text-on-surface-variant">Loading editor...</p>
        </div>
      </main>
    );
  }

  if (error || !resume) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface px-6">
        <div className="max-w-xl rounded-[2rem] bg-error-container p-8 text-on-error-container shadow-editorial">
          <h1 className="font-[var(--font-headline)] text-3xl font-extrabold tracking-tight">Editor unavailable</h1>
          <p className="mt-4 text-base leading-7">{error || "The requested resume could not be loaded."}</p>
          <Link href="/dashboard" className="mt-8 inline-flex rounded-2xl bg-on-error px-5 py-3 font-bold text-error transition hover:opacity-90">
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface">
      <div className="screen-only sticky top-0 z-40 border-b border-outline-variant/20 bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1800px] flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <Link href="/dashboard" className="text-sm font-semibold text-on-surface-variant transition hover:text-on-surface">
              Back to dashboard
            </Link>
            <h1 className="mt-2 font-[var(--font-headline)] text-3xl font-extrabold tracking-tight text-on-surface">Edit resume</h1>
            <p className="mt-1 text-sm text-on-surface-variant">{dirty ? "Unsaved changes" : "Everything up to date"}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full bg-secondary-container px-4 py-2 text-sm font-semibold text-on-surface">{progress}% complete</div>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-2xl bg-surface-container-high px-5 py-3 text-sm font-bold text-on-surface transition hover:bg-surface-container-highest disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => handlePrint()}
              className="rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-on-primary transition hover:opacity-95"
              title="Use Save as PDF in your browser print dialog. Turn off browser headers and footers for the cleanest result."
            >
              Export PDF
            </button>
          </div>
        </div>
        <div className="screen-only mx-auto flex max-w-[1800px] gap-2 overflow-x-auto px-6 pb-4 no-scrollbar lg:px-8">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                activeSection === section.id ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
              )}
            >
              {section.label}
            </button>
          ))}
          <div className="ml-auto flex rounded-full bg-surface-container-high p-1 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileView("build")}
              className={cn("rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] transition", mobileView === "build" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant")}
            >
              Build
            </button>
            <button
              type="button"
              onClick={() => setMobileView("preview")}
              className={cn("rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] transition", mobileView === "preview" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant")}
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      <div className="grid min-h-[calc(100vh-124px)] lg:grid-cols-2">
        <section className={cn("border-r border-outline-variant/20 bg-surface-container-low", mobileView === "preview" ? "hidden lg:block" : "block")}>
          <div className="mx-auto max-w-3xl space-y-6 px-6 py-8 lg:px-8">
            {statusMessage ? <div className="rounded-2xl bg-primary-fixed px-4 py-3 text-sm text-on-primary-fixed-variant">{statusMessage}</div> : null}
            {error ? <div className="rounded-2xl bg-error-container px-4 py-3 text-sm text-on-error-container">{error}</div> : null}

            <SectionCard active={activeSection === "personal"} title="Resume settings" description="Choose the best structure for your target role, then fill in the real content you want recruiters to read.">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <FieldLabel>Resume title</FieldLabel>
                  <input value={resume.title} onFocus={() => setActiveSection("personal")} onChange={(event) => updateTitle(event.target.value)} className={`${inputClass} mt-2`} placeholder="e.g. Product Designer Resume" />
                </div>
                <div className="md:col-span-2">
                  <FieldLabel>Template style</FieldLabel>
                  <div className="mt-3">
                    <TemplateSwitcher selectedTemplate={resume.templateId} onSelect={updateTemplate} />
                  </div>
                </div>
                <div>
                  <FieldLabel>Industry focus</FieldLabel>
                  <select value={resume.industryFocus} onFocus={() => setActiveSection("personal")} onChange={(event) => updateIndustryFocus(event.target.value as ResumeDocument["industryFocus"])} className={`${inputClass} mt-2`}>
                    {industryFocusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs leading-5 text-on-surface-variant">{industryFocusOptions.find((option) => option.value === resume.industryFocus)?.note}</p>
                </div>
                <div>
                  <FieldLabel>Career stage</FieldLabel>
                  <select value={resume.careerStage} onFocus={() => setActiveSection("personal")} onChange={(event) => updateCareerStage(event.target.value as ResumeDocument["careerStage"])} className={`${inputClass} mt-2`}>
                    {careerStageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs leading-5 text-on-surface-variant">{careerStageOptions.find((option) => option.value === resume.careerStage)?.note}</p>
                </div>
                <div className="md:col-span-2 rounded-[1.5rem] bg-surface-container-low p-4">
                  <div className="flex flex-wrap items-start gap-4">
                    {resume.avatarUrl ? (
                      <img
                        src={resume.avatarUrl}
                        alt={resume.personal.fullName}
                        className={cn("object-cover shadow-sm", resume.avatarFrame === "portrait" ? "h-32 w-24 rounded-[1.25rem]" : "h-24 w-24 rounded-2xl")}
                      />
                    ) : (
                      <div className={cn("flex items-center justify-center bg-primary-fixed text-lg font-bold text-primary", resume.avatarFrame === "portrait" ? "h-32 w-24 rounded-[1.25rem]" : "h-24 w-24 rounded-2xl")}>
                        {resume.personal.fullName.slice(0, 1) || "A"}
                      </div>
                    )}
                    <div className="min-w-[220px] flex-1">
                      <div className="rounded-xl bg-surface-container-high px-4 py-3 text-sm font-semibold text-on-surface">Photo stays in this browser only</div>
                      <p className="mt-2 max-w-xl text-xs leading-5 text-on-surface-variant">
                        Add a profile photo locally for this device. It will appear in the CV preview and export, but the image file is not uploaded to Firebase Storage.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <label className="cursor-pointer rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition hover:opacity-95">
                          {uploadingAvatar ? "Uploading..." : resume.avatarUrl ? "Replace photo" : "Upload photo"}
                          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
                        </label>
                        {resume.avatarUrl ? (
                          <button
                            type="button"
                            onClick={() => clearAvatar()}
                            className="rounded-xl bg-surface-container-high px-4 py-2.5 text-sm font-semibold text-on-surface transition hover:bg-surface-container-highest"
                          >
                            Remove photo
                          </button>
                        ) : null}
                      </div>
                      <div className="mt-4">
                        <FieldLabel>Photo frame</FieldLabel>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => updateAvatarFrame("square")}
                            className={cn("rounded-full px-4 py-2 text-sm font-semibold transition", resume.avatarFrame === "square" ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant")}
                          >
                            Square
                          </button>
                          <button
                            type="button"
                            onClick={() => updateAvatarFrame("portrait")}
                            className={cn("rounded-full px-4 py-2 text-sm font-semibold transition", resume.avatarFrame === "portrait" ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant")}
                          >
                            Portrait
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <FieldLabel>Full name</FieldLabel>
                  <input value={resume.personal.fullName} onFocus={() => setActiveSection("personal")} onChange={(event) => updatePersonal("fullName", event.target.value)} className={`${inputClass} mt-2`} placeholder="Jane Nguyen" />
                </div>
                <div>
                  <FieldLabel>Professional title</FieldLabel>
                  <input value={resume.personal.title} onFocus={() => setActiveSection("personal")} onChange={(event) => updatePersonal("title", event.target.value)} className={`${inputClass} mt-2`} placeholder="Frontend Engineer" />
                </div>
                <div>
                  <FieldLabel>Email</FieldLabel>
                  <input value={resume.personal.email} onFocus={() => setActiveSection("personal")} onChange={(event) => updatePersonal("email", event.target.value)} className={`${inputClass} mt-2`} placeholder="name@email.com" />
                </div>
                <div>
                  <FieldLabel>Phone</FieldLabel>
                  <input value={resume.personal.phone} onFocus={() => setActiveSection("personal")} onChange={(event) => updatePersonal("phone", event.target.value)} className={`${inputClass} mt-2`} placeholder="+84 9xx xxx xxx" />
                </div>
                <div>
                  <FieldLabel>Location</FieldLabel>
                  <input value={resume.personal.location} onFocus={() => setActiveSection("personal")} onChange={(event) => updatePersonal("location", event.target.value)} className={`${inputClass} mt-2`} placeholder="Ho Chi Minh City" />
                </div>
                <div>
                  <FieldLabel>Website</FieldLabel>
                  <input value={resume.personal.website} onFocus={() => setActiveSection("personal")} onChange={(event) => updatePersonal("website", event.target.value)} className={`${inputClass} mt-2`} placeholder="portfolio.com" />
                </div>
                <div>
                  <FieldLabel>LinkedIn</FieldLabel>
                  <input value={resume.personal.linkedin} onFocus={() => setActiveSection("personal")} onChange={(event) => updatePersonal("linkedin", event.target.value)} className={`${inputClass} mt-2`} placeholder="linkedin.com/in/yourname" />
                </div>
                <div>
                  <FieldLabel>GitHub</FieldLabel>
                  <input value={resume.personal.github} onFocus={() => setActiveSection("personal")} onChange={(event) => updatePersonal("github", event.target.value)} className={`${inputClass} mt-2`} placeholder="github.com/yourname" />
                </div>
              </div>
            </SectionCard>

            <SectionCard active={activeSection === "summary"} title="Professional summary" description={getSummaryHint(resume.industryFocus)}>
              <div>
                <FieldLabel>Summary</FieldLabel>
                <textarea
                  value={resume.summary}
                  onFocus={() => setActiveSection("summary")}
                  onChange={(event) => updateSummary(event.target.value)}
                  className={`${textareaClass} mt-2`}
                  placeholder="Summarize your strengths, experience and target role in 2-4 lines."
                />
              </div>
            </SectionCard>

            <SectionCard active={activeSection === "skills"} title="Skills" description={getSkillsHint(resume.industryFocus)}>
              {resume.skillGroups.map((group) => (
                <div key={group.id} className="rounded-[1.5rem] border border-outline-variant/20 bg-surface-container-low p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <FieldLabel>Group name</FieldLabel>
                      <input
                        value={group.name}
                        onFocus={() => setActiveSection("skills")}
                        onChange={(event) => updateSkillGroup(group.id, "name", event.target.value)}
                        className={`${inputClass} mt-2`}
                        placeholder={resume.industryFocus === "it" ? "Languages" : "Core Skills"}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <FieldLabel>Skills, one per line</FieldLabel>
                      <textarea
                        value={group.skills.join("\n")}
                        onFocus={() => setActiveSection("skills")}
                        onChange={(event) => updateSkillGroupSkills(group.id, event.target.value)}
                        className={`${textareaClass} mt-2`}
                        placeholder={resume.industryFocus === "it" ? "TypeScript\nReact\nNext.js" : "Stakeholder communication\nProcess improvement\nHiring coordination"}
                      />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeSkillGroup(group.id)} className="mt-4 text-sm font-semibold text-error">
                    Remove group
                  </button>
                </div>
              ))}
              <button type="button" onClick={addSkillGroup} className="rounded-2xl border border-dashed border-outline-variant px-4 py-3 text-sm font-semibold text-on-surface-variant transition hover:border-primary hover:text-primary">
                Add skill group
              </button>
            </SectionCard>

            <SectionCard active={activeSection === "projects"} title="Projects" description="Use this section for standout work, especially if you are early-career, changing fields or targeting technical roles.">
              {resume.projects.map((project) => (
                <div key={project.id} className="rounded-[1.5rem] border border-outline-variant/20 bg-surface-container-low p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <FieldLabel>Project name</FieldLabel>
                      <input value={project.name} onFocus={() => setActiveSection("projects")} onChange={(event) => updateProject(project.id, "name", event.target.value)} className={`${inputClass} mt-2`} placeholder="Realtime analytics dashboard" />
                    </div>
                    <div>
                      <FieldLabel>Role</FieldLabel>
                      <input value={project.role} onFocus={() => setActiveSection("projects")} onChange={(event) => updateProject(project.id, "role", event.target.value)} className={`${inputClass} mt-2`} placeholder="Lead developer" />
                    </div>
                    <div>
                      <FieldLabel>Link</FieldLabel>
                      <input value={project.link} onFocus={() => setActiveSection("projects")} onChange={(event) => updateProject(project.id, "link", event.target.value)} className={`${inputClass} mt-2`} placeholder="https://..." />
                    </div>
                    <div>
                      <FieldLabel>Start date</FieldLabel>
                      <input value={project.startDate} onFocus={() => setActiveSection("projects")} onChange={(event) => updateProject(project.id, "startDate", event.target.value)} className={`${inputClass} mt-2`} placeholder="2025" />
                    </div>
                    <div>
                      <FieldLabel>End date</FieldLabel>
                      <input value={project.endDate} onFocus={() => setActiveSection("projects")} onChange={(event) => updateProject(project.id, "endDate", event.target.value)} className={`${inputClass} mt-2`} placeholder="2026" />
                    </div>
                    <div className="md:col-span-2">
                      <FieldLabel>Description</FieldLabel>
                      <textarea value={project.description} onFocus={() => setActiveSection("projects")} onChange={(event) => updateProject(project.id, "description", event.target.value)} className={`${textareaClass} mt-2`} placeholder="Describe the scope, stack or result of the project in a few concise lines." />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeProject(project.id)} className="mt-4 text-sm font-semibold text-error">Remove project</button>
                </div>
              ))}
              <button type="button" onClick={addProject} className="rounded-2xl border border-dashed border-outline-variant px-4 py-3 text-sm font-semibold text-on-surface-variant transition hover:border-primary hover:text-primary">
                Add project
              </button>
            </SectionCard>

            <SectionCard active={activeSection === "experience"} title="Work experience" description="List the roles that matter most, newest first. Keep bullets short and measurable.">
              {resume.experiences.map((item) => (
                <div key={item.id} className="rounded-[1.5rem] border border-outline-variant/20 bg-surface-container-low p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <FieldLabel>Job title</FieldLabel>
                      <input value={item.jobTitle} onFocus={() => setActiveSection("experience")} onChange={(event) => updateExperience(item.id, "jobTitle", event.target.value)} className={`${inputClass} mt-2`} placeholder="Software Engineer" />
                    </div>
                    <div>
                      <FieldLabel>Employer</FieldLabel>
                      <input value={item.employer} onFocus={() => setActiveSection("experience")} onChange={(event) => updateExperience(item.id, "employer", event.target.value)} className={`${inputClass} mt-2`} placeholder="Acme Corp" />
                    </div>
                    <div>
                      <FieldLabel>Location</FieldLabel>
                      <input value={item.location} onFocus={() => setActiveSection("experience")} onChange={(event) => updateExperience(item.id, "location", event.target.value)} className={`${inputClass} mt-2`} placeholder="Remote" />
                    </div>
                    <div>
                      <FieldLabel>Start date</FieldLabel>
                      <input value={item.startDate} onFocus={() => setActiveSection("experience")} onChange={(event) => updateExperience(item.id, "startDate", event.target.value)} className={`${inputClass} mt-2`} placeholder="2024" />
                    </div>
                    <div>
                      <FieldLabel>End date</FieldLabel>
                      <input value={item.endDate} onFocus={() => setActiveSection("experience")} onChange={(event) => updateExperience(item.id, "endDate", event.target.value)} className={`${inputClass} mt-2`} placeholder="Present or 2026" />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-3">
                      <input id={`current-${item.id}`} type="checkbox" checked={item.current} onChange={(event) => updateExperience(item.id, "current", event.target.checked)} />
                      <label htmlFor={`current-${item.id}`} className="text-sm font-medium text-on-surface">Current role</label>
                    </div>
                    <div className="md:col-span-2">
                      <FieldLabel>Context</FieldLabel>
                      <textarea value={item.description} onFocus={() => setActiveSection("experience")} onChange={(event) => updateExperience(item.id, "description", event.target.value)} className={`${textareaClass} mt-2`} placeholder="Summarize the team, mission or scope of the role." />
                    </div>
                    <div className="md:col-span-2">
                      <FieldLabel>Bullets, one per line</FieldLabel>
                      <textarea value={item.bullets.join("\n")} onFocus={() => setActiveSection("experience")} onChange={(event) => updateExperienceBullets(item.id, event.target.value)} className={`${textareaClass} mt-2`} placeholder="Improved conversion by 18% through funnel redesign\nReduced report turnaround time from 2 days to 4 hours" />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeExperience(item.id)} className="mt-4 text-sm font-semibold text-error">Remove entry</button>
                </div>
              ))}
              <button type="button" onClick={addExperience} className="rounded-2xl border border-dashed border-outline-variant px-4 py-3 text-sm font-semibold text-on-surface-variant transition hover:border-primary hover:text-primary">
                Add another experience
              </button>
            </SectionCard>

            <SectionCard active={activeSection === "education"} title="Education" description="Move this section higher automatically by choosing an early-career stage in the profile settings.">
              {resume.education.map((item) => (
                <div key={item.id} className="rounded-[1.5rem] border border-outline-variant/20 bg-surface-container-low p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <FieldLabel>Degree</FieldLabel>
                      <input value={item.degree} onFocus={() => setActiveSection("education")} onChange={(event) => updateEducation(item.id, "degree", event.target.value)} className={`${inputClass} mt-2`} placeholder="B.S. in Computer Science" />
                    </div>
                    <div>
                      <FieldLabel>School</FieldLabel>
                      <input value={item.school} onFocus={() => setActiveSection("education")} onChange={(event) => updateEducation(item.id, "school", event.target.value)} className={`${inputClass} mt-2`} placeholder="University name" />
                    </div>
                    <div>
                      <FieldLabel>Location</FieldLabel>
                      <input value={item.location} onFocus={() => setActiveSection("education")} onChange={(event) => updateEducation(item.id, "location", event.target.value)} className={`${inputClass} mt-2`} placeholder="Hanoi" />
                    </div>
                    <div>
                      <FieldLabel>Start date</FieldLabel>
                      <input value={item.startDate} onFocus={() => setActiveSection("education")} onChange={(event) => updateEducation(item.id, "startDate", event.target.value)} className={`${inputClass} mt-2`} placeholder="2020" />
                    </div>
                    <div>
                      <FieldLabel>End date</FieldLabel>
                      <input value={item.endDate} onFocus={() => setActiveSection("education")} onChange={(event) => updateEducation(item.id, "endDate", event.target.value)} className={`${inputClass} mt-2`} placeholder="2024" />
                    </div>
                    <div className="md:col-span-2">
                      <FieldLabel>Description</FieldLabel>
                      <textarea value={item.description} onFocus={() => setActiveSection("education")} onChange={(event) => updateEducation(item.id, "description", event.target.value)} className={`${textareaClass} mt-2`} placeholder="Relevant coursework, GPA, thesis, honors or exchange program details if useful." />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeEducation(item.id)} className="mt-4 text-sm font-semibold text-error">Remove entry</button>
                </div>
              ))}
              <button type="button" onClick={addEducation} className="rounded-2xl border border-dashed border-outline-variant px-4 py-3 text-sm font-semibold text-on-surface-variant transition hover:border-primary hover:text-primary">
                Add education
              </button>
            </SectionCard>

            <SectionCard active={activeSection === "certifications"} title="Certifications" description="Use this for licenses, certificates or formal technical credentials.">
              {resume.certifications.map((item) => (
                <div key={item.id} className="rounded-[1.5rem] border border-outline-variant/20 bg-surface-container-low p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <FieldLabel>Certification name</FieldLabel>
                      <input value={item.name} onFocus={() => setActiveSection("certifications")} onChange={(event) => updateCertification(item.id, "name", event.target.value)} className={`${inputClass} mt-2`} placeholder="AWS Certified Cloud Practitioner" />
                    </div>
                    <div>
                      <FieldLabel>Issuer</FieldLabel>
                      <input value={item.issuer} onFocus={() => setActiveSection("certifications")} onChange={(event) => updateCertification(item.id, "issuer", event.target.value)} className={`${inputClass} mt-2`} placeholder="Amazon Web Services" />
                    </div>
                    <div>
                      <FieldLabel>Date</FieldLabel>
                      <input value={item.date} onFocus={() => setActiveSection("certifications")} onChange={(event) => updateCertification(item.id, "date", event.target.value)} className={`${inputClass} mt-2`} placeholder="2025" />
                    </div>
                    <div className="md:col-span-2">
                      <FieldLabel>Description</FieldLabel>
                      <textarea value={item.description} onFocus={() => setActiveSection("certifications")} onChange={(event) => updateCertification(item.id, "description", event.target.value)} className={`${textareaClass} mt-2`} placeholder="Optional note about scope, score or relevance." />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeCertification(item.id)} className="mt-4 text-sm font-semibold text-error">Remove certification</button>
                </div>
              ))}
              <button type="button" onClick={addCertification} className="rounded-2xl border border-dashed border-outline-variant px-4 py-3 text-sm font-semibold text-on-surface-variant transition hover:border-primary hover:text-primary">
                Add certification
              </button>
            </SectionCard>

            <SectionCard active={activeSection === "awards"} title="Awards" description="Add scholarships, recognitions or competition results that reinforce credibility.">
              {resume.awards.map((item) => (
                <div key={item.id} className="rounded-[1.5rem] border border-outline-variant/20 bg-surface-container-low p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <FieldLabel>Award title</FieldLabel>
                      <input value={item.title} onFocus={() => setActiveSection("awards")} onChange={(event) => updateAward(item.id, "title", event.target.value)} className={`${inputClass} mt-2`} placeholder="Dean's List" />
                    </div>
                    <div>
                      <FieldLabel>Issuer</FieldLabel>
                      <input value={item.issuer} onFocus={() => setActiveSection("awards")} onChange={(event) => updateAward(item.id, "issuer", event.target.value)} className={`${inputClass} mt-2`} placeholder="University or organization" />
                    </div>
                    <div>
                      <FieldLabel>Date</FieldLabel>
                      <input value={item.date} onFocus={() => setActiveSection("awards")} onChange={(event) => updateAward(item.id, "date", event.target.value)} className={`${inputClass} mt-2`} placeholder="2024" />
                    </div>
                    <div className="md:col-span-2">
                      <FieldLabel>Description</FieldLabel>
                      <textarea value={item.description} onFocus={() => setActiveSection("awards")} onChange={(event) => updateAward(item.id, "description", event.target.value)} className={`${textareaClass} mt-2`} placeholder="Optional context about why you received it." />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeAward(item.id)} className="mt-4 text-sm font-semibold text-error">Remove award</button>
                </div>
              ))}
              <button type="button" onClick={addAward} className="rounded-2xl border border-dashed border-outline-variant px-4 py-3 text-sm font-semibold text-on-surface-variant transition hover:border-primary hover:text-primary">
                Add award
              </button>
            </SectionCard>

            <SectionCard active={activeSection === "activities"} title="Activities" description="Use this for leadership, volunteering, clubs or speaking experience when it supports your target role.">
              {resume.activities.map((item) => (
                <div key={item.id} className="rounded-[1.5rem] border border-outline-variant/20 bg-surface-container-low p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <FieldLabel>Activity name</FieldLabel>
                      <input value={item.name} onFocus={() => setActiveSection("activities")} onChange={(event) => updateActivity(item.id, "name", event.target.value)} className={`${inputClass} mt-2`} placeholder="Volunteer mentor" />
                    </div>
                    <div>
                      <FieldLabel>Organization</FieldLabel>
                      <input value={item.organization} onFocus={() => setActiveSection("activities")} onChange={(event) => updateActivity(item.id, "organization", event.target.value)} className={`${inputClass} mt-2`} placeholder="Organization name" />
                    </div>
                    <div>
                      <FieldLabel>Date</FieldLabel>
                      <input value={item.date} onFocus={() => setActiveSection("activities")} onChange={(event) => updateActivity(item.id, "date", event.target.value)} className={`${inputClass} mt-2`} placeholder="2023-2025" />
                    </div>
                    <div className="md:col-span-2">
                      <FieldLabel>Description</FieldLabel>
                      <textarea value={item.description} onFocus={() => setActiveSection("activities")} onChange={(event) => updateActivity(item.id, "description", event.target.value)} className={`${textareaClass} mt-2`} placeholder="Describe the contribution or leadership impact in a concise way." />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeActivity(item.id)} className="mt-4 text-sm font-semibold text-error">Remove activity</button>
                </div>
              ))}
              <button type="button" onClick={addActivity} className="rounded-2xl border border-dashed border-outline-variant px-4 py-3 text-sm font-semibold text-on-surface-variant transition hover:border-primary hover:text-primary">
                Add activity
              </button>
            </SectionCard>
          </div>
        </section>

        <section className={cn("print-shell bg-surface-dim/25 px-4 py-6 lg:px-6", mobileView === "build" ? "hidden lg:block" : "block")}>
          <div className="screen-only mx-auto mb-4 flex max-w-[960px] items-center justify-between rounded-[1.5rem] bg-surface-container-lowest px-5 py-4 shadow-sm">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.26em] text-primary">Live preview</div>
              <p className="mt-1 text-sm text-on-surface-variant">
                {activeTemplate
                  ? `${activeTemplate.name} • ${getIndustryFocusLabel(resume.industryFocus)} • ${activeTemplate.atsReadabilityLevel}`
                  : "Changes on the left update this document immediately."}
              </p>
            </div>
            <div className="rounded-full bg-surface-container-high px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              {activeTemplate?.layoutStyle ?? resume.templateId}
            </div>
          </div>
          <div className="screen-only mx-auto mb-4 max-w-[960px] text-right text-xs text-on-surface-variant">
            Use your browser print dialog and turn off headers and footers for the cleanest PDF.
          </div>
          <div ref={printRef} className="mx-auto max-w-[960px] overflow-x-auto no-scrollbar">
            <ResumeDocumentPreview resume={resume} />
          </div>
        </section>
      </div>
    </main>
  );
}












