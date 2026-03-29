/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import Cropper from "react-easy-crop";
import { type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import { useAuth } from "@/components/auth/auth-provider";
import { PreferenceSegmentedControl } from "@/components/settings/preference-segmented-control";
import { useI18n } from "@/components/settings/use-i18n";
import { TemplateSwitcher } from "@/components/editor/template-switcher";
import { ResumeAvatarFrame } from "@/components/resume/resume-avatar-frame";
import { ResumeDocumentPreview } from "@/components/resume/resume-document-preview";
import { defaultAvatarTransform, getLocalizedResumeTitle } from "@/lib/resume-content";
import {
  getCareerStageOptions,
  getIndustryFocusLabel,
  getIndustryFocusOptions,
  getSkillsHint,
  getSummaryHint
} from "@/lib/resume-metadata";
import { getResume, saveResume, uploadAvatar } from "@/lib/services/resume-service";
import type { AvatarFrame, AvatarTransform, Locale, ResumeDocument, ResumeFormSection } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useResumeEditorStore } from "@/store/resume-editor-store";

const sectionIds: ResumeFormSection[] = ["personal", "summary", "skills", "projects", "experience", "education", "certifications", "awards", "activities"];

const inputClass =
  "w-full rounded-xl border-0 bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none ring-0 transition focus:bg-surface-container-high focus:shadow-sm";
const textareaClass = `${inputClass} min-h-[120px] resize-y`;
const avatarMinZoom = 1;
const avatarMaxZoom = 2.5;
const portraitAvatarAspect = 7 / 10;

type CropPoint = {
  x: number;
  y: number;
};

type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type CropSize = {
  width: number;
  height: number;
};

type CropMediaSize = CropSize & {
  naturalWidth: number;
  naturalHeight: number;
};

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, value));
}

function getAvatarAspect(frame: AvatarFrame) {
  return frame === "portrait" ? portraitAvatarAspect : 1;
}

function getStoredAvatarCropArea(transform: AvatarTransform, mediaSize: CropMediaSize, cropSize: CropSize): CropArea {
  const width = Math.min(100, ((cropSize.width / mediaSize.width) * 100) / transform.zoom);
  const height = Math.min(100, ((cropSize.height / mediaSize.height) * 100) / transform.zoom);
  const x = Math.min(100 - width, Math.max(0, transform.x - width / 2));
  const y = Math.min(100 - height, Math.max(0, transform.y - height / 2));

  return {
    x,
    y,
    width,
    height
  };
}

function getAvatarTransformFromCropArea(area: CropArea) {
  return {
    x: clampPercent(area.x + area.width / 2),
    y: clampPercent(area.y + area.height / 2)
  };
}

function getInitialAvatarCropFromArea(croppedAreaPercentages: CropArea, mediaSize: CropMediaSize, cropSize: CropSize, minZoom: number, maxZoom: number) {
  const zoom = Math.min(maxZoom, Math.max(minZoom, (cropSize.width / mediaSize.width) * (100 / croppedAreaPercentages.width)));

  return {
    crop: {
      x: (zoom * mediaSize.width) / 2 - cropSize.width / 2 - mediaSize.width * zoom * (croppedAreaPercentages.x / 100),
      y: (zoom * mediaSize.height) / 2 - cropSize.height / 2 - mediaSize.height * zoom * (croppedAreaPercentages.y / 100)
    },
    zoom
  };
}

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

function findById<T extends { id: string }>(items: T[], id: string) {
  return items.find((item) => item.id === id);
}

function getCompletionScore(resume: ResumeDocument) {
  const content = resume.content[resume.contentLocale];
  const checks = [
    Boolean(content.personal.fullName && content.personal.title && resume.personal.email),
    Boolean(content.summary.trim()),
    content.skillGroups.some((group) => group.name.trim() || group.skills.some(Boolean)),
    content.projects.some((item) => item.name.trim() || item.description.trim()),
    content.experiences.some((item) => item.jobTitle.trim() || item.employer.trim()),
    content.education.some((item) => item.degree.trim() || item.school.trim())
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function ResumeEditorScreen({ resumeId }: { resumeId: string }) {
  const { user } = useAuth();
  const { locale, copy } = useI18n();
  const printRef = useRef<HTMLDivElement | null>(null);
  const avatarSourceKeyRef = useRef("");
  const avatarRestoreKeyRef = useRef("");
  const resume = useResumeEditorStore((state) => state.resume);
  const dirty = useResumeEditorStore((state) => state.dirty);
  const activeSection = useResumeEditorStore((state) => state.activeSection);
  const setResume = useResumeEditorStore((state) => state.setResume);
  const markSaved = useResumeEditorStore((state) => state.markSaved);
  const setActiveSection = useResumeEditorStore((state) => state.setActiveSection);
  const setContentLocale = useResumeEditorStore((state) => state.setContentLocale);
  const copyLocaleContent = useResumeEditorStore((state) => state.copyLocaleContent);
  const updateTitle = useResumeEditorStore((state) => state.updateTitle);
  const updateTemplate = useResumeEditorStore((state) => state.updateTemplate);
  const updateIndustryFocus = useResumeEditorStore((state) => state.updateIndustryFocus);
  const updateCareerStage = useResumeEditorStore((state) => state.updateCareerStage);
  const updateSummary = useResumeEditorStore((state) => state.updateSummary);
  const setAvatarUrl = useResumeEditorStore((state) => state.setAvatarUrl);
  const updateAvatarFrame = useResumeEditorStore((state) => state.updateAvatarFrame);
  const updateAvatarTransform = useResumeEditorStore((state) => state.updateAvatarTransform);
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
  const [avatarCrop, setAvatarCrop] = useState<CropPoint>({ x: 0, y: 0 });
  const [avatarZoom, setAvatarZoom] = useState(defaultAvatarTransform.zoom);
  const [avatarMediaSize, setAvatarMediaSize] = useState<CropMediaSize | null>(null);
  const [avatarCropSize, setAvatarCropSize] = useState<CropSize | null>(null);

  const industryFocusOptions = useMemo(() => getIndustryFocusOptions(locale), [locale]);
  const careerStageOptions = useMemo(() => getCareerStageOptions(locale), [locale]);
  const sections = useMemo(() => sectionIds.map((id) => ({ id, label: copy.editor.sections[id] })), [copy.editor.sections]);

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
          setError(nextError instanceof Error ? nextError.message : copy.editor.unavailableDescription);
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
  }, [copy.editor.unavailableDescription, resumeId, setResume, user]);

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
  const activeTemplate = resume ? copy.templateMeta[resume.templateId] : null;
  const activeContent = resume ? resume.content[resume.contentLocale] : null;
  const avatarAspect = resume ? getAvatarAspect(resume.avatarFrame) : 1;
  const avatarSourceKey = resume ? `${resume.id}:${resume.avatarFrame}:${resume.avatarUrl}` : "";
  const localeOptions = useMemo(
    () => [
      { value: "vi" as const, label: copy.editor.contentLocale.vi },
      { value: "en" as const, label: copy.editor.contentLocale.en }
    ],
    [copy.editor.contentLocale.en, copy.editor.contentLocale.vi]
  );
  const printTitle = resume ? getLocalizedResumeTitle(resume) : "resume";
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: printTitle ? `${printTitle.replace(/\s+/g, "-").toLowerCase()}` : "resume",
    pageStyle: "@page { size: A4; margin: 8mm; }"
  });

  const restoreAvatarEditor = useCallback((transform: AvatarTransform) => {
    if (!resume?.avatarUrl || !avatarMediaSize || !avatarCropSize) {
      setAvatarCrop({ x: 0, y: 0 });
      setAvatarZoom(transform.zoom);
      return;
    }

    const storedArea = getStoredAvatarCropArea(transform, avatarMediaSize, avatarCropSize);
    const { crop, zoom } = getInitialAvatarCropFromArea(storedArea, avatarMediaSize, avatarCropSize, avatarMinZoom, avatarMaxZoom);

    setAvatarCrop(crop);
    setAvatarZoom(zoom);
  }, [avatarCropSize, avatarMediaSize, resume?.avatarUrl]);

  useEffect(() => {
    if (avatarSourceKeyRef.current === avatarSourceKey) {
      return;
    }

    avatarSourceKeyRef.current = avatarSourceKey;
    avatarRestoreKeyRef.current = "";

    if (!resume?.avatarUrl) {
      setAvatarCrop({ x: 0, y: 0 });
      setAvatarZoom(defaultAvatarTransform.zoom);
      setAvatarMediaSize(null);
      setAvatarCropSize(null);
      return;
    }

    setAvatarCrop({ x: 0, y: 0 });
    setAvatarZoom(resume.avatarTransform.zoom);
    setAvatarMediaSize(null);
    setAvatarCropSize(null);
  }, [avatarSourceKey, resume]);

  useEffect(() => {
    if (!resume?.avatarUrl || !avatarMediaSize || !avatarCropSize) {
      return;
    }

    const nextRestoreKey = `${avatarSourceKey}:${avatarMediaSize.width}x${avatarMediaSize.height}:${avatarCropSize.width}x${avatarCropSize.height}`;
    if (avatarRestoreKeyRef.current === nextRestoreKey) {
      return;
    }

    avatarRestoreKeyRef.current = nextRestoreKey;
    restoreAvatarEditor(resume.avatarTransform);
  }, [avatarCropSize, avatarMediaSize, avatarSourceKey, resume, restoreAvatarEditor]);

  function handleAvatarCropAreaChange(croppedArea: CropArea) {
    updateAvatarTransform(getAvatarTransformFromCropArea(croppedArea));
  }

  function handleAvatarZoomChange(nextZoom: number) {
    setAvatarZoom(nextZoom);
    updateAvatarTransform({ zoom: nextZoom });
  }

  function handleResetAvatarPosition() {
    updateAvatarTransform(defaultAvatarTransform);
    restoreAvatarEditor(defaultAvatarTransform);
  }

  function handleClearAvatar() {
    clearAvatar();
    setAvatarCrop({ x: 0, y: 0 });
    setAvatarZoom(defaultAvatarTransform.zoom);
    setAvatarMediaSize(null);
    setAvatarCropSize(null);
  }

  async function handleSave() {
    if (!resume) {
      return;
    }

    setSaving(true);
    setStatusMessage("");

    try {
      const savedResume = await saveResume(resume);
      markSaved(savedResume);
      setStatusMessage(copy.editor.saved);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : copy.editor.unavailableDescription);
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
      updateAvatarTransform(defaultAvatarTransform);
      setAvatarCrop({ x: 0, y: 0 });
      setAvatarZoom(defaultAvatarTransform.zoom);
      setAvatarMediaSize(null);
      setAvatarCropSize(null);
      setStatusMessage(copy.editor.photoStored);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : copy.editor.unavailableDescription);
    } finally {
      setUploadingAvatar(false);
      event.target.value = "";
    }
  }

  function handleCopyToLocale(targetLocale: Locale) {
    if (!resume || targetLocale === resume.contentLocale) {
      return;
    }

    copyLocaleContent(resume.contentLocale, targetLocale);
    setStatusMessage(targetLocale === "en" ? copy.editor.copiedToEn : copy.editor.copiedToVi);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface px-6">
        <div className="rounded-[2rem] bg-surface-container-low p-8 text-center shadow-editorial">
          <div className="mx-auto h-10 w-10 animate-pulse rounded-full bg-primary-fixed" />
          <p className="mt-4 text-sm font-semibold text-on-surface-variant">{copy.editor.loading}</p>
        </div>
      </main>
    );
  }

  if (error || !resume || !activeContent) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface px-6">
        <div className="max-w-xl rounded-[2rem] bg-error-container p-8 text-on-error-container shadow-editorial">
          <h1 className="font-[var(--font-headline)] text-3xl font-extrabold tracking-tight">{copy.editor.unavailableTitle}</h1>
          <p className="mt-4 text-base leading-7">{error || copy.editor.unavailableDescription}</p>
          <Link href="/dashboard" className="mt-8 inline-flex rounded-2xl bg-on-error px-5 py-3 font-bold text-error transition hover:opacity-90">
            {copy.editor.backToDashboard}
          </Link>
        </div>
      </main>
    );
  }

  const activeTitle = activeContent.title || resume.title;
  const avatarFrameClass = resume.avatarFrame === "portrait" ? "h-40 w-28 rounded-[1.25rem]" : "h-32 w-32 rounded-2xl";

  return (
    <main className="min-h-screen bg-surface">
      <div className="screen-only sticky top-0 z-40 border-b border-outline-variant/20 bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1800px] flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <Link href="/dashboard" className="text-sm font-semibold text-on-surface-variant transition hover:text-on-surface">
              {copy.editor.backToDashboard}
            </Link>
            <h1 className="mt-2 font-[var(--font-headline)] text-3xl font-extrabold tracking-tight text-on-surface">{copy.editor.title}</h1>
            <p className="mt-1 text-sm text-on-surface-variant">{dirty ? copy.editor.unsaved : copy.editor.upToDate}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full bg-secondary-container px-4 py-2 text-sm font-semibold text-on-surface">{progress}% {copy.editor.complete}</div>
            <button type="button" onClick={handleSave} disabled={saving} className="rounded-2xl bg-surface-container-high px-5 py-3 text-sm font-bold text-on-surface transition hover:bg-surface-container-highest disabled:opacity-60">
              {saving ? copy.common.saving : copy.common.save}
            </button>
            <button type="button" onClick={() => handlePrint()} className="rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-on-primary transition hover:opacity-95" title={copy.editor.exportHint}>
              {copy.editor.exportPdf}
            </button>
          </div>
        </div>
        <div className="screen-only mx-auto flex max-w-[1800px] gap-2 overflow-x-auto px-6 pb-4 no-scrollbar lg:px-8">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={cn("rounded-full px-4 py-2 text-sm font-semibold transition", activeSection === section.id ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest")}
            >
              {section.label}
            </button>
          ))}
          <div className="ml-auto flex rounded-full bg-surface-container-high p-1 lg:hidden">
            <button type="button" onClick={() => setMobileView("build")} className={cn("rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] transition", mobileView === "build" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant")}>
              {copy.editor.build}
            </button>
            <button type="button" onClick={() => setMobileView("preview")} className={cn("rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] transition", mobileView === "preview" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant")}>
              {copy.editor.preview}
            </button>
          </div>
        </div>
      </div>

      <div className="grid min-h-[calc(100vh-124px)] lg:grid-cols-2">
        <section className={cn("border-r border-outline-variant/20 bg-surface-container-low", mobileView === "preview" ? "hidden lg:block" : "block")}>
          <div className="mx-auto max-w-3xl space-y-6 px-6 py-8 lg:px-8">
            {statusMessage ? <div className="rounded-2xl bg-primary-fixed px-4 py-3 text-sm text-on-primary-fixed-variant">{statusMessage}</div> : null}
            {error ? <div className="rounded-2xl bg-error-container px-4 py-3 text-sm text-on-error-container">{error}</div> : null}

            <SectionCard active={activeSection === "personal"} title={copy.editor.personal.title} description={copy.editor.personal.description}>
              <div className="rounded-[1.5rem] bg-surface-container-low p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <FieldLabel>{copy.editor.contentLocale.label}</FieldLabel>
                    <div className="mt-2">
                      <PreferenceSegmentedControl ariaLabel={copy.editor.contentLocale.label} options={localeOptions} value={resume.contentLocale} onChange={setContentLocale} />
                    </div>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant">{copy.editor.contentLocale.description}</p>
                    <p className="mt-2 max-w-2xl text-xs leading-5 text-on-surface-variant">{copy.editor.contentLocale.sharedFields}</p>
                  </div>
                  <button type="button" onClick={() => handleCopyToLocale(resume.contentLocale === "vi" ? "en" : "vi")} className="rounded-2xl bg-surface-container-high px-4 py-3 text-sm font-semibold text-on-surface transition hover:bg-surface-container-highest">
                    {resume.contentLocale === "vi" ? copy.editor.contentLocale.copyToEn : copy.editor.contentLocale.copyToVi}
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <FieldLabel>{copy.editor.personal.resumeTitle}</FieldLabel>
                  <input value={activeTitle} onFocus={() => setActiveSection("personal")} onChange={(event) => updateTitle(event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.personal.resumeTitlePlaceholder} />
                </div>
                <div className="md:col-span-2">
                  <FieldLabel>{copy.editor.personal.templateStyle}</FieldLabel>
                  <div className="mt-3">
                    <TemplateSwitcher selectedTemplate={resume.templateId} onSelect={updateTemplate} />
                  </div>
                </div>
                <div>
                  <FieldLabel>{copy.editor.personal.industryFocus}</FieldLabel>
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
                  <FieldLabel>{copy.editor.personal.careerStage}</FieldLabel>
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
                    <div className="space-y-3">
                      <div className={cn("relative overflow-hidden bg-surface-container-high shadow-inner", avatarFrameClass)}>
                        {resume.avatarUrl ? (
                          <Cropper
                            image={resume.avatarUrl}
                            crop={avatarCrop}
                            zoom={avatarZoom}
                            aspect={avatarAspect}
                            minZoom={avatarMinZoom}
                            maxZoom={avatarMaxZoom}
                            cropShape="rect"
                            objectFit="cover"
                            restrictPosition
                            zoomWithScroll={false}
                            onCropChange={setAvatarCrop}
                            onCropAreaChange={handleAvatarCropAreaChange}
                            onZoomChange={handleAvatarZoomChange}
                            setMediaSize={(size) => setAvatarMediaSize(size)}
                            setCropSize={(size) => setAvatarCropSize(size)}
                            classes={{
                              containerClassName: cn("!bg-surface-container-high", resume.avatarFrame === "portrait" ? "!rounded-[1.25rem]" : "!rounded-2xl"),
                              cropAreaClassName: cn("!border-white/85 !shadow-[0_0_0_9999px_rgba(15,23,42,0.32)]", resume.avatarFrame === "portrait" ? "!rounded-[1.25rem]" : "!rounded-2xl")
                            }}
                            mediaProps={{ alt: activeContent.personal.fullName || "Profile photo" }}
                          />
                        ) : (
                          <ResumeAvatarFrame
                            src={resume.avatarUrl}
                            alt={activeContent.personal.fullName || "Profile photo"}
                            frame={resume.avatarFrame}
                            transform={resume.avatarTransform}
                            className={avatarFrameClass}
                            fallbackText={activeContent.personal.fullName.slice(0, 1) || "A"}
                          />
                        )}
                      </div>
                      {resume.avatarUrl ? <p className="max-w-[220px] text-xs leading-5 text-on-surface-variant">{copy.editor.personal.photoZoomHint}</p> : null}
                    </div>
                    <div className="min-w-[220px] flex-1">
                      <div className="rounded-xl bg-surface-container-high px-4 py-3 text-sm font-semibold text-on-surface">{copy.editor.personal.photoBrowserOnly}</div>
                      <p className="mt-2 max-w-xl text-xs leading-5 text-on-surface-variant">{copy.editor.personal.photoDescription}</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <label className="cursor-pointer rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition hover:opacity-95">
                          {uploadingAvatar ? copy.editor.personal.uploading : resume.avatarUrl ? copy.editor.personal.replacePhoto : copy.editor.personal.uploadPhoto}
                          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
                        </label>
                        {resume.avatarUrl ? (
                          <button type="button" onClick={handleClearAvatar} className="rounded-xl bg-surface-container-high px-4 py-2.5 text-sm font-semibold text-on-surface transition hover:bg-surface-container-highest">
                            {copy.editor.personal.removePhoto}
                          </button>
                        ) : null}
                      </div>
                      <div className="mt-4">
                        <FieldLabel>{copy.editor.personal.photoFrame}</FieldLabel>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button type="button" onClick={() => updateAvatarFrame("square")} className={cn("rounded-full px-4 py-2 text-sm font-semibold transition", resume.avatarFrame === "square" ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant")}>
                            {copy.editor.personal.square}
                          </button>
                          <button type="button" onClick={() => updateAvatarFrame("portrait")} className={cn("rounded-full px-4 py-2 text-sm font-semibold transition", resume.avatarFrame === "portrait" ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant")}>
                            {copy.editor.personal.portrait}
                          </button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <FieldLabel>{copy.editor.personal.photoZoom}</FieldLabel>
                        <input type="range" min={1} max={2.5} step={0.05} value={avatarZoom} onChange={(event) => handleAvatarZoomChange(Number(event.target.value))} className="mt-3 w-full accent-primary" />
                        <div className="mt-2 flex items-center justify-between text-xs text-on-surface-variant">
                          <span>{avatarZoom.toFixed(2)}x</span>
                          <button type="button" onClick={handleResetAvatarPosition} className="font-semibold text-primary">
                            {copy.editor.personal.photoResetPosition}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <FieldLabel>{copy.editor.personal.fullName}</FieldLabel>
                  <input value={activeContent.personal.fullName} onFocus={() => setActiveSection("personal")} onChange={(event) => updatePersonal("fullName", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.personal.fullNamePlaceholder} />
                </div>
                <div>
                  <FieldLabel>{copy.editor.personal.professionalTitle}</FieldLabel>
                  <input value={activeContent.personal.title} onFocus={() => setActiveSection("personal")} onChange={(event) => updatePersonal("title", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.personal.professionalTitlePlaceholder} />
                </div>
                <div>
                  <FieldLabel>{copy.editor.personal.email}</FieldLabel>
                  <input value={resume.personal.email} onFocus={() => setActiveSection("personal")} onChange={(event) => updatePersonal("email", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.personal.emailPlaceholder} />
                </div>
                <div>
                  <FieldLabel>{copy.editor.personal.phone}</FieldLabel>
                  <input value={resume.personal.phone} onFocus={() => setActiveSection("personal")} onChange={(event) => updatePersonal("phone", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.personal.phonePlaceholder} />
                </div>
                <div>
                  <FieldLabel>{copy.editor.personal.location}</FieldLabel>
                  <input value={activeContent.personal.location} onFocus={() => setActiveSection("personal")} onChange={(event) => updatePersonal("location", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.personal.locationPlaceholder} />
                </div>
                <div>
                  <FieldLabel>{copy.editor.personal.website}</FieldLabel>
                  <input value={resume.personal.website} onFocus={() => setActiveSection("personal")} onChange={(event) => updatePersonal("website", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.personal.websitePlaceholder} />
                </div>
                <div>
                  <FieldLabel>{copy.editor.personal.linkedin}</FieldLabel>
                  <input value={resume.personal.linkedin} onFocus={() => setActiveSection("personal")} onChange={(event) => updatePersonal("linkedin", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.personal.linkedinPlaceholder} />
                </div>
                <div>
                  <FieldLabel>{copy.editor.personal.github}</FieldLabel>
                  <input value={resume.personal.github} onFocus={() => setActiveSection("personal")} onChange={(event) => updatePersonal("github", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.personal.githubPlaceholder} />
                </div>
              </div>
            </SectionCard>

            <SectionCard active={activeSection === "summary"} title={copy.editor.summary.title} description={getSummaryHint(resume.industryFocus, locale)}>
              <div>
                <FieldLabel>{copy.editor.summary.label}</FieldLabel>
                <textarea value={activeContent.summary} onFocus={() => setActiveSection("summary")} onChange={(event) => updateSummary(event.target.value)} className={`${textareaClass} mt-2`} placeholder={copy.editor.summary.placeholder} />
              </div>
            </SectionCard>

            <SectionCard active={activeSection === "skills"} title={copy.editor.skills.title} description={getSkillsHint(resume.industryFocus, locale)}>
              {activeContent.skillGroups.map((group) => (
                <div key={group.id} className="rounded-[1.5rem] border border-outline-variant/20 bg-surface-container-low p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <FieldLabel>{copy.editor.skills.groupName}</FieldLabel>
                      <input value={group.name} onFocus={() => setActiveSection("skills")} onChange={(event) => updateSkillGroup(group.id, "name", event.target.value)} className={`${inputClass} mt-2`} placeholder={resume.industryFocus === "it" ? copy.editor.skills.groupNamePlaceholderIt : copy.editor.skills.groupNamePlaceholderDefault} />
                    </div>
                    <div className="md:col-span-2">
                      <FieldLabel>{copy.editor.skills.skillsList}</FieldLabel>
                      <textarea value={group.skills.join("\n")} onFocus={() => setActiveSection("skills")} onChange={(event) => updateSkillGroupSkills(group.id, event.target.value)} className={`${textareaClass} mt-2`} placeholder={resume.industryFocus === "it" ? copy.editor.skills.skillsPlaceholderIt : copy.editor.skills.skillsPlaceholderDefault} />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeSkillGroup(group.id)} className="mt-4 text-sm font-semibold text-error">
                    {copy.editor.skills.removeGroup}
                  </button>
                </div>
              ))}
              <button type="button" onClick={addSkillGroup} className="rounded-2xl border border-dashed border-outline-variant px-4 py-3 text-sm font-semibold text-on-surface-variant transition hover:border-primary hover:text-primary">
                {copy.editor.skills.addGroup}
              </button>
            </SectionCard>

            <SectionCard active={activeSection === "projects"} title={copy.editor.projects.title} description={copy.editor.projects.description}>
              {resume.projects.map((project) => {
                const localizedProject = findById(activeContent.projects, project.id);
                return (
                  <div key={project.id} className="rounded-[1.5rem] border border-outline-variant/20 bg-surface-container-low p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <FieldLabel>{copy.editor.projects.name}</FieldLabel>
                        <input value={localizedProject?.name ?? ""} onFocus={() => setActiveSection("projects")} onChange={(event) => updateProject(project.id, "name", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.projects.namePlaceholder} />
                      </div>
                      <div>
                        <FieldLabel>{copy.editor.projects.role}</FieldLabel>
                        <input value={localizedProject?.role ?? ""} onFocus={() => setActiveSection("projects")} onChange={(event) => updateProject(project.id, "role", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.projects.rolePlaceholder} />
                      </div>
                      <div>
                        <FieldLabel>{copy.editor.projects.link}</FieldLabel>
                        <input value={project.link} onFocus={() => setActiveSection("projects")} onChange={(event) => updateProject(project.id, "link", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.projects.linkPlaceholder} />
                      </div>
                      <div>
                        <FieldLabel>{copy.editor.projects.startDate}</FieldLabel>
                        <input value={project.startDate} onFocus={() => setActiveSection("projects")} onChange={(event) => updateProject(project.id, "startDate", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.projects.startDatePlaceholder} />
                      </div>
                      <div>
                        <FieldLabel>{copy.editor.projects.endDate}</FieldLabel>
                        <input value={project.endDate} onFocus={() => setActiveSection("projects")} onChange={(event) => updateProject(project.id, "endDate", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.projects.endDatePlaceholder} />
                      </div>
                      <div className="md:col-span-2">
                        <FieldLabel>{copy.editor.projects.itemDescription}</FieldLabel>
                        <textarea value={localizedProject?.description ?? ""} onFocus={() => setActiveSection("projects")} onChange={(event) => updateProject(project.id, "description", event.target.value)} className={`${textareaClass} mt-2`} placeholder={copy.editor.projects.itemDescriptionPlaceholder} />
                      </div>
                    </div>
                    <button type="button" onClick={() => removeProject(project.id)} className="mt-4 text-sm font-semibold text-error">{copy.editor.projects.remove}</button>
                  </div>
                );
              })}
              <button type="button" onClick={addProject} className="rounded-2xl border border-dashed border-outline-variant px-4 py-3 text-sm font-semibold text-on-surface-variant transition hover:border-primary hover:text-primary">
                {copy.editor.projects.add}
              </button>
            </SectionCard>
            <SectionCard active={activeSection === "experience"} title={copy.editor.experience.title} description={copy.editor.experience.description}>
              {resume.experiences.map((item) => {
                const localizedExperience = findById(activeContent.experiences, item.id);
                return (
                  <div key={item.id} className="rounded-[1.5rem] border border-outline-variant/20 bg-surface-container-low p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <FieldLabel>{copy.editor.experience.jobTitle}</FieldLabel>
                        <input value={localizedExperience?.jobTitle ?? ""} onFocus={() => setActiveSection("experience")} onChange={(event) => updateExperience(item.id, "jobTitle", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.experience.jobTitlePlaceholder} />
                      </div>
                      <div>
                        <FieldLabel>{copy.editor.experience.employer}</FieldLabel>
                        <input value={localizedExperience?.employer ?? ""} onFocus={() => setActiveSection("experience")} onChange={(event) => updateExperience(item.id, "employer", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.experience.employerPlaceholder} />
                      </div>
                      <div>
                        <FieldLabel>{copy.editor.personal.location}</FieldLabel>
                        <input value={localizedExperience?.location ?? ""} onFocus={() => setActiveSection("experience")} onChange={(event) => updateExperience(item.id, "location", event.target.value)} className={`${inputClass} mt-2`} placeholder="Remote" />
                      </div>
                      <div>
                        <FieldLabel>{copy.editor.projects.startDate}</FieldLabel>
                        <input value={item.startDate} onFocus={() => setActiveSection("experience")} onChange={(event) => updateExperience(item.id, "startDate", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.experience.startDatePlaceholder} />
                      </div>
                      <div>
                        <FieldLabel>{copy.editor.projects.endDate}</FieldLabel>
                        <input value={item.endDate} onFocus={() => setActiveSection("experience")} onChange={(event) => updateExperience(item.id, "endDate", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.experience.endDatePlaceholder} />
                      </div>
                      <div className="md:col-span-2 flex items-center gap-3">
                        <input id={`current-${item.id}`} type="checkbox" checked={item.current} onChange={(event) => updateExperience(item.id, "current", event.target.checked)} />
                        <label htmlFor={`current-${item.id}`} className="text-sm font-medium text-on-surface">{copy.editor.experience.currentRole}</label>
                      </div>
                      <div className="md:col-span-2">
                        <FieldLabel>{copy.editor.experience.context}</FieldLabel>
                        <textarea value={localizedExperience?.description ?? ""} onFocus={() => setActiveSection("experience")} onChange={(event) => updateExperience(item.id, "description", event.target.value)} className={`${textareaClass} mt-2`} placeholder={copy.editor.experience.contextPlaceholder} />
                      </div>
                      <div className="md:col-span-2">
                        <FieldLabel>{copy.editor.experience.bullets}</FieldLabel>
                        <textarea value={localizedExperience ? localizedExperience.bullets.join("\n") : ""} onFocus={() => setActiveSection("experience")} onChange={(event) => updateExperienceBullets(item.id, event.target.value)} className={`${textareaClass} mt-2`} placeholder={copy.editor.experience.bulletsPlaceholder} />
                      </div>
                    </div>
                    <button type="button" onClick={() => removeExperience(item.id)} className="mt-4 text-sm font-semibold text-error">{copy.editor.experience.remove}</button>
                  </div>
                );
              })}
              <button type="button" onClick={addExperience} className="rounded-2xl border border-dashed border-outline-variant px-4 py-3 text-sm font-semibold text-on-surface-variant transition hover:border-primary hover:text-primary">
                {copy.editor.experience.add}
              </button>
            </SectionCard>

            <SectionCard active={activeSection === "education"} title={copy.editor.education.title} description={copy.editor.education.description}>
              {resume.education.map((item) => {
                const localizedEducation = findById(activeContent.education, item.id);
                return (
                  <div key={item.id} className="rounded-[1.5rem] border border-outline-variant/20 bg-surface-container-low p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <FieldLabel>{copy.editor.education.degree}</FieldLabel>
                        <input value={localizedEducation?.degree ?? ""} onFocus={() => setActiveSection("education")} onChange={(event) => updateEducation(item.id, "degree", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.education.degreePlaceholder} />
                      </div>
                      <div>
                        <FieldLabel>{copy.editor.education.school}</FieldLabel>
                        <input value={localizedEducation?.school ?? ""} onFocus={() => setActiveSection("education")} onChange={(event) => updateEducation(item.id, "school", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.education.schoolPlaceholder} />
                      </div>
                      <div>
                        <FieldLabel>{copy.editor.personal.location}</FieldLabel>
                        <input value={localizedEducation?.location ?? ""} onFocus={() => setActiveSection("education")} onChange={(event) => updateEducation(item.id, "location", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.education.locationPlaceholder} />
                      </div>
                      <div>
                        <FieldLabel>{copy.editor.projects.startDate}</FieldLabel>
                        <input value={item.startDate} onFocus={() => setActiveSection("education")} onChange={(event) => updateEducation(item.id, "startDate", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.education.startDatePlaceholder} />
                      </div>
                      <div>
                        <FieldLabel>{copy.editor.projects.endDate}</FieldLabel>
                        <input value={item.endDate} onFocus={() => setActiveSection("education")} onChange={(event) => updateEducation(item.id, "endDate", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.awards.datePlaceholder} />
                      </div>
                      <div className="md:col-span-2">
                        <FieldLabel>{copy.editor.projects.itemDescription}</FieldLabel>
                        <textarea value={localizedEducation?.description ?? ""} onFocus={() => setActiveSection("education")} onChange={(event) => updateEducation(item.id, "description", event.target.value)} className={`${textareaClass} mt-2`} placeholder={copy.editor.education.itemDescriptionPlaceholder} />
                      </div>
                    </div>
                    <button type="button" onClick={() => removeEducation(item.id)} className="mt-4 text-sm font-semibold text-error">{copy.editor.education.remove}</button>
                  </div>
                );
              })}
              <button type="button" onClick={addEducation} className="rounded-2xl border border-dashed border-outline-variant px-4 py-3 text-sm font-semibold text-on-surface-variant transition hover:border-primary hover:text-primary">
                {copy.editor.education.add}
              </button>
            </SectionCard>

            <SectionCard active={activeSection === "certifications"} title={copy.editor.certifications.title} description={copy.editor.certifications.description}>
              {resume.certifications.map((item) => {
                const localizedCertification = findById(activeContent.certifications, item.id);
                return (
                  <div key={item.id} className="rounded-[1.5rem] border border-outline-variant/20 bg-surface-container-low p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <FieldLabel>{copy.editor.certifications.name}</FieldLabel>
                        <input value={localizedCertification?.name ?? ""} onFocus={() => setActiveSection("certifications")} onChange={(event) => updateCertification(item.id, "name", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.certifications.namePlaceholder} />
                      </div>
                      <div>
                        <FieldLabel>{copy.editor.certifications.issuer}</FieldLabel>
                        <input value={localizedCertification?.issuer ?? ""} onFocus={() => setActiveSection("certifications")} onChange={(event) => updateCertification(item.id, "issuer", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.certifications.issuerPlaceholder} />
                      </div>
                      <div>
                        <FieldLabel>{copy.editor.certifications.date}</FieldLabel>
                        <input value={item.date} onFocus={() => setActiveSection("certifications")} onChange={(event) => updateCertification(item.id, "date", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.certifications.datePlaceholder} />
                      </div>
                      <div className="md:col-span-2">
                        <FieldLabel>{copy.editor.projects.itemDescription}</FieldLabel>
                        <textarea value={localizedCertification?.description ?? ""} onFocus={() => setActiveSection("certifications")} onChange={(event) => updateCertification(item.id, "description", event.target.value)} className={`${textareaClass} mt-2`} placeholder={copy.editor.certifications.itemDescriptionPlaceholder} />
                      </div>
                    </div>
                    <button type="button" onClick={() => removeCertification(item.id)} className="mt-4 text-sm font-semibold text-error">{copy.editor.certifications.remove}</button>
                  </div>
                );
              })}
              <button type="button" onClick={addCertification} className="rounded-2xl border border-dashed border-outline-variant px-4 py-3 text-sm font-semibold text-on-surface-variant transition hover:border-primary hover:text-primary">
                {copy.editor.certifications.add}
              </button>
            </SectionCard>

            <SectionCard active={activeSection === "awards"} title={copy.editor.awards.title} description={copy.editor.awards.description}>
              {resume.awards.map((item) => {
                const localizedAward = findById(activeContent.awards, item.id);
                return (
                  <div key={item.id} className="rounded-[1.5rem] border border-outline-variant/20 bg-surface-container-low p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <FieldLabel>{copy.editor.awards.titleLabel}</FieldLabel>
                        <input value={localizedAward?.title ?? ""} onFocus={() => setActiveSection("awards")} onChange={(event) => updateAward(item.id, "title", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.awards.titlePlaceholder} />
                      </div>
                      <div>
                        <FieldLabel>{copy.editor.certifications.issuer}</FieldLabel>
                        <input value={localizedAward?.issuer ?? ""} onFocus={() => setActiveSection("awards")} onChange={(event) => updateAward(item.id, "issuer", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.awards.issuerPlaceholder} />
                      </div>
                      <div>
                        <FieldLabel>{copy.editor.certifications.date}</FieldLabel>
                        <input value={item.date} onFocus={() => setActiveSection("awards")} onChange={(event) => updateAward(item.id, "date", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.awards.datePlaceholder} />
                      </div>
                      <div className="md:col-span-2">
                        <FieldLabel>{copy.editor.projects.itemDescription}</FieldLabel>
                        <textarea value={localizedAward?.description ?? ""} onFocus={() => setActiveSection("awards")} onChange={(event) => updateAward(item.id, "description", event.target.value)} className={`${textareaClass} mt-2`} placeholder={copy.editor.awards.itemDescriptionPlaceholder} />
                      </div>
                    </div>
                    <button type="button" onClick={() => removeAward(item.id)} className="mt-4 text-sm font-semibold text-error">{copy.editor.awards.remove}</button>
                  </div>
                );
              })}
              <button type="button" onClick={addAward} className="rounded-2xl border border-dashed border-outline-variant px-4 py-3 text-sm font-semibold text-on-surface-variant transition hover:border-primary hover:text-primary">
                {copy.editor.awards.add}
              </button>
            </SectionCard>
            <SectionCard active={activeSection === "activities"} title={copy.editor.activities.title} description={copy.editor.activities.description}>
              {resume.activities.map((item) => {
                const localizedActivity = findById(activeContent.activities, item.id);
                return (
                  <div key={item.id} className="rounded-[1.5rem] border border-outline-variant/20 bg-surface-container-low p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <FieldLabel>{copy.editor.activities.name}</FieldLabel>
                        <input value={localizedActivity?.name ?? ""} onFocus={() => setActiveSection("activities")} onChange={(event) => updateActivity(item.id, "name", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.activities.namePlaceholder} />
                      </div>
                      <div>
                        <FieldLabel>{copy.editor.activities.organization}</FieldLabel>
                        <input value={localizedActivity?.organization ?? ""} onFocus={() => setActiveSection("activities")} onChange={(event) => updateActivity(item.id, "organization", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.activities.organizationPlaceholder} />
                      </div>
                      <div>
                        <FieldLabel>{copy.editor.certifications.date}</FieldLabel>
                        <input value={item.date} onFocus={() => setActiveSection("activities")} onChange={(event) => updateActivity(item.id, "date", event.target.value)} className={`${inputClass} mt-2`} placeholder={copy.editor.activities.datePlaceholder} />
                      </div>
                      <div className="md:col-span-2">
                        <FieldLabel>{copy.editor.projects.itemDescription}</FieldLabel>
                        <textarea value={localizedActivity?.description ?? ""} onFocus={() => setActiveSection("activities")} onChange={(event) => updateActivity(item.id, "description", event.target.value)} className={`${textareaClass} mt-2`} placeholder={copy.editor.activities.itemDescriptionPlaceholder} />
                      </div>
                    </div>
                    <button type="button" onClick={() => removeActivity(item.id)} className="mt-4 text-sm font-semibold text-error">{copy.editor.activities.remove}</button>
                  </div>
                );
              })}
              <button type="button" onClick={addActivity} className="rounded-2xl border border-dashed border-outline-variant px-4 py-3 text-sm font-semibold text-on-surface-variant transition hover:border-primary hover:text-primary">
                {copy.editor.activities.add}
              </button>
            </SectionCard>
          </div>
        </section>

        <section className={cn("print-shell bg-surface-dim/25 px-4 py-6 lg:px-6", mobileView === "build" ? "hidden lg:block" : "block")}>
          <div className="screen-only mx-auto mb-4 flex max-w-[960px] items-center justify-between rounded-[1.5rem] bg-surface-container-lowest px-5 py-4 shadow-sm">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.26em] text-primary">{copy.editor.previewPanel.title}</div>
              <p className="mt-1 text-sm text-on-surface-variant">
                {activeTemplate
                  ? `${activeTemplate.name} • ${getIndustryFocusLabel(resume.industryFocus, locale)} • ${activeTemplate.atsReadabilityLevel}`
                  : copy.editor.previewPanel.fallback}
              </p>
            </div>
            <div className="rounded-full bg-surface-container-high px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              {activeTemplate?.layoutStyle ?? resume.templateId}
            </div>
          </div>
          <div className="screen-only mx-auto mb-4 max-w-[960px] text-right text-xs text-on-surface-variant">
            {copy.editor.previewPanel.printHint}
          </div>
          <div ref={printRef} className="mx-auto max-w-[960px] overflow-x-auto no-scrollbar">
            <ResumeDocumentPreview resume={resume} />
          </div>
        </section>
      </div>
    </main>
  );
}

