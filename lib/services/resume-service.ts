"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc
} from "firebase/firestore";

import {
  buildDefaultResume,
  createEmptyActivity,
  createEmptyAward,
  createEmptyCertification,
  createEmptyEducation,
  createEmptyExperience,
  createEmptyProject
} from "@/lib/default-resume";
import { firebaseDb } from "@/lib/firebase/client";
import {
  clampAvatarTransform,
  createEmptyLocalizedActivity,
  createEmptyLocalizedAward,
  createEmptyLocalizedCertification,
  createEmptyLocalizedEducation,
  createEmptyLocalizedExperience,
  createEmptyLocalizedProject,
  createEmptyLocalizedSkillGroup,
  defaultAvatarTransform
} from "@/lib/resume-content";
import { readLocalAppPreferences } from "@/lib/services/app-preferences-service";
import type {
  AvatarFrame,
  AvatarTransform,
  LegacyResumeDocument,
  Locale,
  ResumeDocument,
  ResumeLocalizedContent,
  SkillGroup,
  TemplateId
} from "@/lib/types";

const DEMO_RESUMES_KEY = "create-cv-demo-resumes";
const LOCAL_AVATAR_KEY = "create-cv-local-avatar-map";

type LocalAvatarEntry = {
  avatarUrl: string;
  avatarFrame: AvatarFrame;
  avatarTransform: AvatarTransform;
};

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function isLocale(value: unknown): value is Locale {
  return value === "vi" || value === "en";
}

function isLegacyResume(resume: ResumeDocument | LegacyResumeDocument): resume is LegacyResumeDocument {
  return !("content" in resume);
}

function getDefaultContentLocale(): Locale {
  try {
    return readLocalAppPreferences().locale;
  } catch {
    return "vi";
  }
}

function getDemoResumes(): Array<ResumeDocument | LegacyResumeDocument> {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(DEMO_RESUMES_KEY);
  return raw ? (JSON.parse(raw) as Array<ResumeDocument | LegacyResumeDocument>) : [];
}

function setDemoResumes(resumes: Array<ResumeDocument | LegacyResumeDocument>) {
  window.localStorage.setItem(DEMO_RESUMES_KEY, JSON.stringify(resumes));
}

function getLocalAvatarMap(): Record<string, LocalAvatarEntry> {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(LOCAL_AVATAR_KEY);
  return raw ? (JSON.parse(raw) as Record<string, LocalAvatarEntry>) : {};
}

function setLocalAvatarMap(entries: Record<string, LocalAvatarEntry>) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCAL_AVATAR_KEY, JSON.stringify(entries));
}

function saveLocalAvatar(resume: Pick<ResumeDocument, "id" | "avatarUrl" | "avatarFrame" | "avatarTransform">) {
  if (typeof window === "undefined") {
    return;
  }

  const entries = getLocalAvatarMap();

  if (!resume.avatarUrl) {
    delete entries[resume.id];
  } else {
    entries[resume.id] = {
      avatarUrl: resume.avatarUrl,
      avatarFrame: resume.avatarFrame,
      avatarTransform: resume.avatarTransform
    };
  }

  setLocalAvatarMap(entries);
}

function readLocalAvatar(resumeId: string): LocalAvatarEntry | null {
  return getLocalAvatarMap()[resumeId] ?? null;
}

function deleteLocalAvatar(resumeId: string) {
  if (typeof window === "undefined") {
    return;
  }

  const entries = getLocalAvatarMap();
  delete entries[resumeId];
  setLocalAvatarMap(entries);
}

function stripLocalAvatar(resume: ResumeDocument): ResumeDocument {
  return {
    ...resume,
    avatarUrl: ""
  };
}

function mergeLocalAvatar(resume: ResumeDocument): ResumeDocument {
  const localAvatar = readLocalAvatar(resume.id);

  if (!localAvatar) {
    return resume;
  }

  return {
    ...resume,
    avatarUrl: localAvatar.avatarUrl,
    avatarFrame: localAvatar.avatarFrame ?? resume.avatarFrame ?? "square",
    avatarTransform: clampAvatarTransform(localAvatar.avatarTransform ?? resume.avatarTransform)
  };
}

function ensureArray<T>(items: T[] | undefined, fallback: () => T, alwaysSeed = true) {
  if (!items || items.length === 0) {
    return alwaysSeed ? [fallback()] : [];
  }

  return items;
}

function alignLocalizedItems<TShared extends { id: string }, TLocalized extends { id: string }>(
  sharedItems: TShared[],
  localizedItems: TLocalized[] | undefined,
  createFallback: (id: string) => TLocalized
) {
  const nextItems = localizedItems ?? [];
  const localizedMap = new Map(nextItems.map((item) => [item.id, item]));

  return sharedItems.map((sharedItem, index) => {
    const matchingById = localizedMap.get(sharedItem.id);
    const matchingByIndex = nextItems[index];

    return {
      ...createFallback(sharedItem.id),
      ...(matchingByIndex ?? {}),
      ...(matchingById ?? {}),
      id: sharedItem.id
    };
  });
}

function normalizeSkillGroups(skillGroups: SkillGroup[] | undefined, locale: Locale, legacySkills?: string[]) {
  if (skillGroups && skillGroups.length > 0) {
    return skillGroups.map((group) => ({
      id: group.id || createId("skill-group"),
      name: group.name ?? "",
      skills: Array.isArray(group.skills) ? group.skills.filter(Boolean) : []
    }));
  }

  if (legacySkills && legacySkills.length > 0) {
    return [
      {
        ...createEmptyLocalizedSkillGroup(locale, createId("skill-group")),
        skills: legacySkills.filter(Boolean)
      }
    ];
  }

  return [createEmptyLocalizedSkillGroup(locale, createId("skill-group"))];
}

function buildLegacyLocalizedContent(resume: LegacyResumeDocument, locale: Locale): ResumeLocalizedContent {
  const resumeExperiences = resume.experiences ?? [];
  const resumeEducation = resume.education ?? [];
  const resumeProjects = resume.projects ?? [];
  const resumeCertifications = resume.certifications ?? [];
  const resumeAwards = resume.awards ?? [];
  const resumeActivities = resume.activities ?? [];
  const legacyExperiences = resumeExperiences.length > 0 ? resumeExperiences : [{ id: createId("exp"), jobTitle: "", employer: "", location: "", startDate: "", endDate: "", current: false, description: "", bullets: [] }];
  const legacyEducation = resumeEducation.length > 0 ? resumeEducation : [{ id: createId("edu"), degree: "", school: "", location: "", startDate: "", endDate: "", description: "" }];
  const legacyProjects = resumeProjects.length > 0 ? resumeProjects : [{ id: createId("project"), name: "", role: "", startDate: "", endDate: "", description: "", link: "" }];

  return {
    title: resume.title ?? (locale === "vi" ? "CV chua dat ten" : "Untitled Resume"),
    personal: {
      fullName: resume.personal?.fullName ?? "",
      title: resume.personal?.title ?? "",
      location: resume.personal?.location ?? ""
    },
    summary: resume.summary ?? "",
    experiences: legacyExperiences.map((item) => ({
      id: item.id,
      jobTitle: item.jobTitle ?? "",
      employer: item.employer ?? "",
      location: item.location ?? "",
      description: item.description ?? "",
      bullets: Array.isArray(item.bullets) ? item.bullets.filter(Boolean) : []
    })),
    education: legacyEducation.map((item) => ({
      id: item.id,
      degree: item.degree ?? "",
      school: item.school ?? "",
      location: item.location ?? "",
      description: item.description ?? ""
    })),
    skillGroups: normalizeSkillGroups(resume.skillGroups, locale, resume.skills),
    projects: legacyProjects.map((item) => ({
      id: item.id,
      name: item.name ?? "",
      role: item.role ?? "",
      description: item.description ?? ""
    })),
    certifications: resumeCertifications.map((item) => ({
      id: item.id,
      name: item.name ?? "",
      issuer: item.issuer ?? "",
      description: item.description ?? ""
    })),
    awards: resumeAwards.map((item) => ({
      id: item.id,
      title: item.title ?? "",
      issuer: item.issuer ?? "",
      description: item.description ?? ""
    })),
    activities: resumeActivities.map((item) => ({
      id: item.id,
      name: item.name ?? "",
      organization: item.organization ?? "",
      description: item.description ?? ""
    }))
  };
}

function normalizeLocalizedContent(
  locale: Locale,
  content: Partial<ResumeLocalizedContent> | undefined,
  resumeTitle: string,
  shared: Pick<ResumeDocument, "experiences" | "education" | "projects" | "certifications" | "awards" | "activities">,
  legacy?: LegacyResumeDocument
): ResumeLocalizedContent {
  const fallback = legacy ? buildLegacyLocalizedContent(legacy, locale) : null;

  return {
    title: content?.title ?? fallback?.title ?? resumeTitle,
    personal: {
      fullName: content?.personal?.fullName ?? fallback?.personal.fullName ?? "",
      title: content?.personal?.title ?? fallback?.personal.title ?? "",
      location: content?.personal?.location ?? fallback?.personal.location ?? ""
    },
    summary: content?.summary ?? fallback?.summary ?? "",
    experiences: alignLocalizedItems(
      shared.experiences,
      content?.experiences ?? fallback?.experiences,
      createEmptyLocalizedExperience
    ),
    education: alignLocalizedItems(shared.education, content?.education ?? fallback?.education, createEmptyLocalizedEducation),
    skillGroups: normalizeSkillGroups(content?.skillGroups ?? fallback?.skillGroups, locale),
    projects: alignLocalizedItems(shared.projects, content?.projects ?? fallback?.projects, createEmptyLocalizedProject),
    certifications: alignLocalizedItems(
      shared.certifications,
      content?.certifications ?? fallback?.certifications,
      createEmptyLocalizedCertification
    ),
    awards: alignLocalizedItems(shared.awards, content?.awards ?? fallback?.awards, createEmptyLocalizedAward),
    activities: alignLocalizedItems(shared.activities, content?.activities ?? fallback?.activities, createEmptyLocalizedActivity)
  };
}

export function normalizeResume(source: ResumeDocument | LegacyResumeDocument): ResumeDocument {
  const fallbackLocale = getDefaultContentLocale();
  const legacy = isLegacyResume(source) ? source : undefined;
  const experiences = legacy
    ? ensureArray(legacy.experiences, createEmptyExperience).map((item) => ({
        id: item.id,
        startDate: item.startDate ?? "",
        endDate: item.endDate ?? "",
        current: item.current ?? false
      }))
    : ensureArray(source.experiences, createEmptyExperience).map((item) => ({
        id: item.id,
        startDate: item.startDate ?? "",
        endDate: item.endDate ?? "",
        current: item.current ?? false
      }));
  const education = legacy
    ? ensureArray(legacy.education, createEmptyEducation).map((item) => ({
        id: item.id,
        startDate: item.startDate ?? "",
        endDate: item.endDate ?? ""
      }))
    : ensureArray(source.education, createEmptyEducation).map((item) => ({
        id: item.id,
        startDate: item.startDate ?? "",
        endDate: item.endDate ?? ""
      }));
  const projects = legacy
    ? ensureArray(legacy.projects, createEmptyProject).map((item) => ({
        id: item.id,
        startDate: item.startDate ?? "",
        endDate: item.endDate ?? "",
        link: item.link ?? ""
      }))
    : ensureArray(source.projects, createEmptyProject).map((item) => ({
        id: item.id,
        startDate: item.startDate ?? "",
        endDate: item.endDate ?? "",
        link: item.link ?? ""
      }));
  const certifications = legacy
    ? ensureArray(legacy.certifications, createEmptyCertification, false).map((item) => ({
        id: item.id,
        date: item.date ?? ""
      }))
    : ensureArray(source.certifications, createEmptyCertification, false).map((item) => ({
        id: item.id,
        date: item.date ?? ""
      }));
  const awards = legacy
    ? ensureArray(legacy.awards, createEmptyAward, false).map((item) => ({
        id: item.id,
        date: item.date ?? ""
      }))
    : ensureArray(source.awards, createEmptyAward, false).map((item) => ({
        id: item.id,
        date: item.date ?? ""
      }));
  const activities = legacy
    ? ensureArray(legacy.activities, createEmptyActivity, false).map((item) => ({
        id: item.id,
        date: item.date ?? ""
      }))
    : ensureArray(source.activities, createEmptyActivity, false).map((item) => ({
        id: item.id,
        date: item.date ?? ""
      }));
  const normalizedTitle = source.title ?? (fallbackLocale === "vi" ? "CV chua dat ten" : "Untitled Resume");
  const nextContent = legacy ? undefined : (source as ResumeDocument).content;
  const nextAvatarTransform = legacy ? defaultAvatarTransform : (source as ResumeDocument).avatarTransform;
  const contentLocale = legacy ? fallbackLocale : isLocale((source as ResumeDocument).contentLocale) ? (source as ResumeDocument).contentLocale : fallbackLocale;

  return {
    ...source,
    title: normalizedTitle,
    industryFocus: source.industryFocus ?? "general",
    careerStage: source.careerStage ?? "under_3_years",
    contentLocale,
    avatarUrl: source.avatarUrl ?? "",
    avatarFrame: source.avatarFrame ?? "square",
    avatarTransform: clampAvatarTransform(nextAvatarTransform),
    personal: legacy
      ? {
          email: legacy.personal?.email ?? "",
          phone: legacy.personal?.phone ?? "",
          website: legacy.personal?.website ?? "",
          linkedin: legacy.personal?.linkedin ?? "",
          github: legacy.personal?.github ?? ""
        }
      : {
          email: source.personal?.email ?? "",
          phone: source.personal?.phone ?? "",
          website: source.personal?.website ?? "",
          linkedin: source.personal?.linkedin ?? "",
          github: source.personal?.github ?? ""
        },
    content: {
      vi: normalizeLocalizedContent(
        "vi",
        nextContent?.vi,
        normalizedTitle,
        { experiences, education, projects, certifications, awards, activities },
        legacy
      ),
      en: normalizeLocalizedContent(
        "en",
        nextContent?.en,
        normalizedTitle,
        { experiences, education, projects, certifications, awards, activities },
        legacy
      )
    },
    experiences,
    education,
    projects,
    certifications,
    awards,
    activities
  };
}

function remapLocalizedIds<T extends { id: string }>(items: T[], idMap: Map<string, string>) {
  return items.map((item) => ({
    ...item,
    id: idMap.get(item.id) ?? item.id
  }));
}

function remapSkillGroupIds(skillGroups: SkillGroup[]) {
  return skillGroups.map((group) => ({
    ...group,
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : createId("skill-group")
  }));
}

function cloneResume(source: ResumeDocument): ResumeDocument {
  const now = Date.now();
  const next = structuredClone(normalizeResume(source));
  next.id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `resume-${now}`;
  next.title = `${source.title} Copy`;
  next.createdAt = now;
  next.updatedAt = now;

  const experienceIds = new Map<string, string>();
  const educationIds = new Map<string, string>();
  const projectIds = new Map<string, string>();
  const certificationIds = new Map<string, string>();
  const awardIds = new Map<string, string>();
  const activityIds = new Map<string, string>();

  next.experiences = next.experiences.map((item) => {
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${item.id}-${now}`;
    experienceIds.set(item.id, id);
    return { ...item, id };
  });
  next.education = next.education.map((item) => {
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${item.id}-${now}`;
    educationIds.set(item.id, id);
    return { ...item, id };
  });
  next.projects = next.projects.map((item) => {
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${item.id}-${now}`;
    projectIds.set(item.id, id);
    return { ...item, id };
  });
  next.certifications = next.certifications.map((item) => {
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${item.id}-${now}`;
    certificationIds.set(item.id, id);
    return { ...item, id };
  });
  next.awards = next.awards.map((item) => {
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${item.id}-${now}`;
    awardIds.set(item.id, id);
    return { ...item, id };
  });
  next.activities = next.activities.map((item) => {
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${item.id}-${now}`;
    activityIds.set(item.id, id);
    return { ...item, id };
  });

  next.content.vi = {
    ...next.content.vi,
    experiences: remapLocalizedIds(next.content.vi.experiences, experienceIds),
    education: remapLocalizedIds(next.content.vi.education, educationIds),
    projects: remapLocalizedIds(next.content.vi.projects, projectIds),
    certifications: remapLocalizedIds(next.content.vi.certifications, certificationIds),
    awards: remapLocalizedIds(next.content.vi.awards, awardIds),
    activities: remapLocalizedIds(next.content.vi.activities, activityIds),
    skillGroups: remapSkillGroupIds(next.content.vi.skillGroups)
  };
  next.content.en = {
    ...next.content.en,
    experiences: remapLocalizedIds(next.content.en.experiences, experienceIds),
    education: remapLocalizedIds(next.content.en.education, educationIds),
    projects: remapLocalizedIds(next.content.en.projects, projectIds),
    certifications: remapLocalizedIds(next.content.en.certifications, certificationIds),
    awards: remapLocalizedIds(next.content.en.awards, awardIds),
    activities: remapLocalizedIds(next.content.en.activities, activityIds),
    skillGroups: remapSkillGroupIds(next.content.en.skillGroups)
  };

  return next;
}

function sortResumes(resumes: ResumeDocument[]) {
  return [...resumes].sort((a, b) => b.updatedAt - a.updatedAt);
}

function ensureResumeBelongsToUser(resume: ResumeDocument | null | undefined, userId: string) {
  if (!resume || resume.userId !== userId) {
    throw new Error("Resume not found.");
  }

  return mergeLocalAvatar(normalizeResume(resume));
}

function resumesCollection(userId: string) {
  if (!firebaseDb) {
    return null;
  }

  return collection(firebaseDb, "users", userId, "resumes");
}

export async function listResumes(userId: string) {
  if (firebaseDb) {
    const collectionRef = resumesCollection(userId);

    if (!collectionRef) {
      return [];
    }

    const snapshot = await getDocs(query(collectionRef, orderBy("updatedAt", "desc")));
    return snapshot.docs.map((entry) => mergeLocalAvatar(normalizeResume(entry.data() as ResumeDocument | LegacyResumeDocument)));
  }

  return sortResumes(getDemoResumes().filter((resume) => resume.userId === userId).map(normalizeResume).map(mergeLocalAvatar));
}

export async function getResume(userId: string, resumeId: string) {
  if (firebaseDb) {
    const reference = doc(firebaseDb, "users", userId, "resumes", resumeId);
    const snapshot = await getDoc(reference);

    if (!snapshot.exists()) {
      return null;
    }

    return mergeLocalAvatar(normalizeResume(snapshot.data() as ResumeDocument | LegacyResumeDocument));
  }

  const resume = getDemoResumes().find((entry) => entry.userId === userId && entry.id === resumeId);
  return resume ? mergeLocalAvatar(normalizeResume(resume)) : null;
}

export async function createResume(userId: string, templateId: TemplateId = "professional", resumeId?: string) {
  const resume = normalizeResume(buildDefaultResume(userId, templateId, resumeId, getDefaultContentLocale()));

  if (firebaseDb) {
    const reference = doc(firebaseDb, "users", userId, "resumes", resume.id);
    await setDoc(reference, stripLocalAvatar(resume));
    return resume;
  }

  const resumes = getDemoResumes();
  const existingIndex = resumes.findIndex((entry) => entry.userId === userId && entry.id === resume.id);

  if (existingIndex === -1) {
    resumes.push(stripLocalAvatar(resume));
  } else {
    resumes[existingIndex] = stripLocalAvatar(resume);
  }

  setDemoResumes(resumes);
  return resume;
}

export async function saveResume(resume: ResumeDocument) {
  const nextResume = normalizeResume({
    ...resume,
    updatedAt: Date.now()
  });

  saveLocalAvatar(nextResume);
  const persistedResume = stripLocalAvatar(nextResume);

  if (firebaseDb) {
    const reference = doc(firebaseDb, "users", resume.userId, "resumes", resume.id);
    await setDoc(reference, persistedResume);
    return nextResume;
  }

  const resumes = getDemoResumes();
  const index = resumes.findIndex((entry) => entry.id === resume.id && entry.userId === resume.userId);

  if (index === -1) {
    resumes.push(persistedResume);
  } else {
    resumes[index] = persistedResume;
  }

  setDemoResumes(resumes);
  return nextResume;
}

export async function duplicateResume(userId: string, resumeId: string) {
  const source = ensureResumeBelongsToUser(await getResume(userId, resumeId), userId);
  const duplicate = cloneResume(source);

  saveLocalAvatar(duplicate);

  if (firebaseDb) {
    const reference = doc(firebaseDb, "users", userId, "resumes", duplicate.id);
    await setDoc(reference, stripLocalAvatar(duplicate));
    return duplicate;
  }

  const resumes = getDemoResumes();
  resumes.push(stripLocalAvatar(duplicate));
  setDemoResumes(resumes);
  return duplicate;
}

export async function deleteResumeById(userId: string, resumeId: string) {
  deleteLocalAvatar(resumeId);

  if (firebaseDb) {
    await deleteDoc(doc(firebaseDb, "users", userId, "resumes", resumeId));
    return;
  }

  const resumes = getDemoResumes().filter((resume) => !(resume.userId === userId && resume.id === resumeId));
  setDemoResumes(resumes);
}

export async function uploadAvatar(_userId: string, _resumeId: string, file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Unable to read avatar file."));
    reader.readAsDataURL(file);
  });
}

