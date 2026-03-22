/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { TemplateSwitcher } from "@/components/editor/template-switcher";
import { ResumeDocumentPreview } from "@/components/resume/resume-document-preview";
import { getResume, saveResume, uploadAvatar } from "@/lib/services/resume-service";
import { templateLibrary } from "@/lib/template-library";
import type { ResumeDocument, ResumeFormSection } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useResumeEditorStore } from "@/store/resume-editor-store";

const sections: Array<{ id: ResumeFormSection; label: string }> = [
  { id: "personal", label: "Personal" },
  { id: "summary", label: "Summary" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" }
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

export function ResumeEditorScreen({ resumeId }: { resumeId: string }) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const resume = useResumeEditorStore((state) => state.resume);
  const dirty = useResumeEditorStore((state) => state.dirty);
  const activeSection = useResumeEditorStore((state) => state.activeSection);
  const setResume = useResumeEditorStore((state) => state.setResume);
  const markSaved = useResumeEditorStore((state) => state.markSaved);
  const setActiveSection = useResumeEditorStore((state) => state.setActiveSection);
  const updateTitle = useResumeEditorStore((state) => state.updateTitle);
  const updateTemplate = useResumeEditorStore((state) => state.updateTemplate);
  const updateSummary = useResumeEditorStore((state) => state.updateSummary);
  const updatePersonal = useResumeEditorStore((state) => state.updatePersonal);
  const updateExperience = useResumeEditorStore((state) => state.updateExperience);
  const updateExperienceBullets = useResumeEditorStore((state) => state.updateExperienceBullets);
  const addExperience = useResumeEditorStore((state) => state.addExperience);
  const removeExperience = useResumeEditorStore((state) => state.removeExperience);
  const updateEducation = useResumeEditorStore((state) => state.updateEducation);
  const addEducation = useResumeEditorStore((state) => state.addEducation);
  const removeEducation = useResumeEditorStore((state) => state.removeEducation);
  const addSkill = useResumeEditorStore((state) => state.addSkill);
  const removeSkill = useResumeEditorStore((state) => state.removeSkill);
  const updateProject = useResumeEditorStore((state) => state.updateProject);
  const addProject = useResumeEditorStore((state) => state.addProject);
  const removeProject = useResumeEditorStore((state) => state.removeProject);
  const setAvatarUrl = useResumeEditorStore((state) => state.setAvatarUrl);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [mobileView, setMobileView] = useState<"build" | "preview">("build");
  const [skillInput, setSkillInput] = useState("");

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

  const progress = useMemo(() => {
    const resumeData = resume as ResumeDocument | null;

    if (!resumeData) {
      return 0;
    }

    const checks = [
      Boolean(resumeData.personal.fullName && resumeData.personal.title && resumeData.personal.email),
      Boolean(resumeData.summary.trim()),
      resumeData.experiences.some((item) => item.jobTitle && item.employer),
      resumeData.education.some((item) => item.degree && item.school),
      resumeData.skills.some(Boolean),
      resumeData.projects.some((item) => item.name && item.description)
    ];

    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [resume]);

  const activeTemplate = templateLibrary.find((template) => template.id === resume?.templateId);

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

  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!user || !resume) {
      return;
    }

    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const avatarUrl = await uploadAvatar(user.uid, resume.id, file);
      setAvatarUrl(avatarUrl);
      setStatusMessage("Avatar uploaded.");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unable to upload avatar.");
    } finally {
      setUploading(false);
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
              disabled
              className="rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-on-primary opacity-60"
              title="PDF export lands in the next phase"
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

            <SectionCard active={activeSection === "personal"} title="Resume settings" description="Control the document title, avatar and profile details shown in the preview.">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <FieldLabel>Resume title</FieldLabel>
                  <input value={resume.title} onFocus={() => setActiveSection("personal")} onChange={(event) => updateTitle(event.target.value)} className={`${inputClass} mt-2`} />
                </div>
                <div className="md:col-span-2">
                  <FieldLabel>Template style</FieldLabel>
                  <div className="mt-3">
                    <TemplateSwitcher selectedTemplate={resume.templateId} onSelect={updateTemplate} />
                  </div>
                </div>
                <div className="md:col-span-2 flex flex-wrap items-center gap-4">
                  {resume.avatarUrl ? <img src={resume.avatarUrl} alt={resume.personal.fullName} className="h-16 w-16 rounded-2xl object-cover" /> : <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-fixed text-lg font-bold text-primary">{resume.personal.fullName.slice(0, 1) || "A"}</div>}
                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-xl bg-surface-container-low px-4 py-2 text-sm font-semibold text-on-surface transition hover:bg-surface-container-high"
                    >
                      {uploading ? "Uploading..." : "Upload avatar"}
                    </button>
                    <p className="mt-2 text-xs text-on-surface-variant">PNG or JPG works. Stored per resume.</p>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </div>
                </div>
                <div>
                  <FieldLabel>Full name</FieldLabel>
                  <input value={resume.personal.fullName} onFocus={() => setActiveSection("personal")} onChange={(event) => updatePersonal("fullName", event.target.value)} className={`${inputClass} mt-2`} />
                </div>
                <div>
                  <FieldLabel>Professional title</FieldLabel>
                  <input value={resume.personal.title} onFocus={() => setActiveSection("personal")} onChange={(event) => updatePersonal("title", event.target.value)} className={`${inputClass} mt-2`} />
                </div>
                <div>
                  <FieldLabel>Email</FieldLabel>
                  <input value={resume.personal.email} onFocus={() => setActiveSection("personal")} onChange={(event) => updatePersonal("email", event.target.value)} className={`${inputClass} mt-2`} />
                </div>
                <div>
                  <FieldLabel>Phone</FieldLabel>
                  <input value={resume.personal.phone} onFocus={() => setActiveSection("personal")} onChange={(event) => updatePersonal("phone", event.target.value)} className={`${inputClass} mt-2`} />
                </div>
                <div>
                  <FieldLabel>Location</FieldLabel>
                  <input value={resume.personal.location} onFocus={() => setActiveSection("personal")} onChange={(event) => updatePersonal("location", event.target.value)} className={`${inputClass} mt-2`} />
                </div>
                <div>
                  <FieldLabel>Website</FieldLabel>
                  <input value={resume.personal.website} onFocus={() => setActiveSection("personal")} onChange={(event) => updatePersonal("website", event.target.value)} className={`${inputClass} mt-2`} />
                </div>
                <div>
                  <FieldLabel>LinkedIn</FieldLabel>
                  <input value={resume.personal.linkedin} onFocus={() => setActiveSection("personal")} onChange={(event) => updatePersonal("linkedin", event.target.value)} className={`${inputClass} mt-2`} />
                </div>
                <div>
                  <FieldLabel>GitHub</FieldLabel>
                  <input value={resume.personal.github} onFocus={() => setActiveSection("personal")} onChange={(event) => updatePersonal("github", event.target.value)} className={`${inputClass} mt-2`} />
                </div>
              </div>
            </SectionCard>

            <SectionCard active={activeSection === "summary"} title="Professional summary" description="Write the opening paragraph that frames your experience and strengths.">
              <div>
                <FieldLabel>Summary</FieldLabel>
                <textarea value={resume.summary} onFocus={() => setActiveSection("summary")} onChange={(event) => updateSummary(event.target.value)} className={`${textareaClass} mt-2`} />
              </div>
            </SectionCard>

            <SectionCard active={activeSection === "experience"} title="Experience" description="List the roles that matter most, newest first. Add bullets for measurable impact.">
              {resume.experiences.map((item) => (
                <div key={item.id} className="rounded-[1.5rem] border border-outline-variant/20 bg-surface-container-low p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <FieldLabel>Job title</FieldLabel>
                      <input value={item.jobTitle} onFocus={() => setActiveSection("experience")} onChange={(event) => updateExperience(item.id, "jobTitle", event.target.value)} className={`${inputClass} mt-2`} />
                    </div>
                    <div>
                      <FieldLabel>Employer</FieldLabel>
                      <input value={item.employer} onFocus={() => setActiveSection("experience")} onChange={(event) => updateExperience(item.id, "employer", event.target.value)} className={`${inputClass} mt-2`} />
                    </div>
                    <div>
                      <FieldLabel>Location</FieldLabel>
                      <input value={item.location} onFocus={() => setActiveSection("experience")} onChange={(event) => updateExperience(item.id, "location", event.target.value)} className={`${inputClass} mt-2`} />
                    </div>
                    <div>
                      <FieldLabel>Start date</FieldLabel>
                      <input value={item.startDate} onFocus={() => setActiveSection("experience")} onChange={(event) => updateExperience(item.id, "startDate", event.target.value)} className={`${inputClass} mt-2`} />
                    </div>
                    <div>
                      <FieldLabel>End date</FieldLabel>
                      <input value={item.endDate} onFocus={() => setActiveSection("experience")} onChange={(event) => updateExperience(item.id, "endDate", event.target.value)} className={`${inputClass} mt-2`} />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-3">
                      <input id={`current-${item.id}`} type="checkbox" checked={item.current} onChange={(event) => updateExperience(item.id, "current", event.target.checked)} />
                      <label htmlFor={`current-${item.id}`} className="text-sm font-medium text-on-surface">Current role</label>
                    </div>
                    <div className="md:col-span-2">
                      <FieldLabel>Description</FieldLabel>
                      <textarea value={item.description} onFocus={() => setActiveSection("experience")} onChange={(event) => updateExperience(item.id, "description", event.target.value)} className={`${textareaClass} mt-2`} />
                    </div>
                    <div className="md:col-span-2">
                      <FieldLabel>Bullets, one per line</FieldLabel>
                      <textarea value={item.bullets.join("\n")} onFocus={() => setActiveSection("experience")} onChange={(event) => updateExperienceBullets(item.id, event.target.value)} className={`${textareaClass} mt-2`} />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeExperience(item.id)} className="mt-4 text-sm font-semibold text-error">Remove entry</button>
                </div>
              ))}
              <button type="button" onClick={addExperience} className="rounded-2xl border border-dashed border-outline-variant px-4 py-3 text-sm font-semibold text-on-surface-variant transition hover:border-primary hover:text-primary">
                Add another experience
              </button>
            </SectionCard>

            <SectionCard active={activeSection === "education"} title="Education" description="Capture degrees, schools and short context that supports your target role.">
              {resume.education.map((item) => (
                <div key={item.id} className="rounded-[1.5rem] border border-outline-variant/20 bg-surface-container-low p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <FieldLabel>Degree</FieldLabel>
                      <input value={item.degree} onFocus={() => setActiveSection("education")} onChange={(event) => updateEducation(item.id, "degree", event.target.value)} className={`${inputClass} mt-2`} />
                    </div>
                    <div>
                      <FieldLabel>School</FieldLabel>
                      <input value={item.school} onFocus={() => setActiveSection("education")} onChange={(event) => updateEducation(item.id, "school", event.target.value)} className={`${inputClass} mt-2`} />
                    </div>
                    <div>
                      <FieldLabel>Location</FieldLabel>
                      <input value={item.location} onFocus={() => setActiveSection("education")} onChange={(event) => updateEducation(item.id, "location", event.target.value)} className={`${inputClass} mt-2`} />
                    </div>
                    <div>
                      <FieldLabel>Start date</FieldLabel>
                      <input value={item.startDate} onFocus={() => setActiveSection("education")} onChange={(event) => updateEducation(item.id, "startDate", event.target.value)} className={`${inputClass} mt-2`} />
                    </div>
                    <div>
                      <FieldLabel>End date</FieldLabel>
                      <input value={item.endDate} onFocus={() => setActiveSection("education")} onChange={(event) => updateEducation(item.id, "endDate", event.target.value)} className={`${inputClass} mt-2`} />
                    </div>
                    <div className="md:col-span-2">
                      <FieldLabel>Description</FieldLabel>
                      <textarea value={item.description} onFocus={() => setActiveSection("education")} onChange={(event) => updateEducation(item.id, "description", event.target.value)} className={`${textareaClass} mt-2`} />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeEducation(item.id)} className="mt-4 text-sm font-semibold text-error">Remove entry</button>
                </div>
              ))}
              <button type="button" onClick={addEducation} className="rounded-2xl border border-dashed border-outline-variant px-4 py-3 text-sm font-semibold text-on-surface-variant transition hover:border-primary hover:text-primary">
                Add education
              </button>
            </SectionCard>

            <SectionCard active={activeSection === "skills"} title="Skills" description="Add concise, searchable skills. These appear as tags or inline items depending on template.">
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, index) => (
                  <div key={`${skill}-${index}`} className="flex items-center gap-2 rounded-full bg-primary-fixed px-3 py-2 text-sm text-on-primary-fixed-variant">
                    <span>{skill}</span>
                    <button type="button" onClick={() => removeSkill(index)} className="font-bold text-primary">×</button>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input value={skillInput} onFocus={() => setActiveSection("skills")} onChange={(event) => setSkillInput(event.target.value)} placeholder="Add a skill" className={inputClass} />
                <button
                  type="button"
                  onClick={() => {
                    addSkill(skillInput);
                    setSkillInput("");
                  }}
                  className="rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-on-primary transition hover:opacity-95"
                >
                  Add skill
                </button>
              </div>
            </SectionCard>

            <SectionCard active={activeSection === "projects"} title="Projects" description="Showcase standout work, case studies or side projects with links and brief outcomes.">
              {resume.projects.map((project) => (
                <div key={project.id} className="rounded-[1.5rem] border border-outline-variant/20 bg-surface-container-low p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <FieldLabel>Project name</FieldLabel>
                      <input value={project.name} onFocus={() => setActiveSection("projects")} onChange={(event) => updateProject(project.id, "name", event.target.value)} className={`${inputClass} mt-2`} />
                    </div>
                    <div>
                      <FieldLabel>Role</FieldLabel>
                      <input value={project.role} onFocus={() => setActiveSection("projects")} onChange={(event) => updateProject(project.id, "role", event.target.value)} className={`${inputClass} mt-2`} />
                    </div>
                    <div>
                      <FieldLabel>Link</FieldLabel>
                      <input value={project.link} onFocus={() => setActiveSection("projects")} onChange={(event) => updateProject(project.id, "link", event.target.value)} className={`${inputClass} mt-2`} />
                    </div>
                    <div>
                      <FieldLabel>Start date</FieldLabel>
                      <input value={project.startDate} onFocus={() => setActiveSection("projects")} onChange={(event) => updateProject(project.id, "startDate", event.target.value)} className={`${inputClass} mt-2`} />
                    </div>
                    <div>
                      <FieldLabel>End date</FieldLabel>
                      <input value={project.endDate} onFocus={() => setActiveSection("projects")} onChange={(event) => updateProject(project.id, "endDate", event.target.value)} className={`${inputClass} mt-2`} />
                    </div>
                    <div className="md:col-span-2">
                      <FieldLabel>Description</FieldLabel>
                      <textarea value={project.description} onFocus={() => setActiveSection("projects")} onChange={(event) => updateProject(project.id, "description", event.target.value)} className={`${textareaClass} mt-2`} />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeProject(project.id)} className="mt-4 text-sm font-semibold text-error">Remove project</button>
                </div>
              ))}
              <button type="button" onClick={addProject} className="rounded-2xl border border-dashed border-outline-variant px-4 py-3 text-sm font-semibold text-on-surface-variant transition hover:border-primary hover:text-primary">
                Add project
              </button>
            </SectionCard>
          </div>
        </section>

        <section className={cn("print-shell bg-surface-dim/25 px-4 py-6 lg:px-6", mobileView === "build" ? "hidden lg:block" : "block")}>
          <div className="screen-only mx-auto mb-4 flex max-w-[960px] items-center justify-between rounded-[1.5rem] bg-surface-container-lowest px-5 py-4 shadow-sm">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.26em] text-primary">Live preview</div>
              <p className="mt-1 text-sm text-on-surface-variant">{activeTemplate ? `${activeTemplate.name} • ${activeTemplate.hook}` : "Changes on the left update this document immediately."}</p>
            </div>
            <div className="rounded-full bg-surface-container-high px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              {activeTemplate?.category ?? resume.templateId}
            </div>
          </div>
          <div className="mx-auto max-w-[960px] overflow-x-auto no-scrollbar">
            <ResumeDocumentPreview resume={resume} />
          </div>
        </section>
      </div>
    </main>
  );
}





