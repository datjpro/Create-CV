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
  createEmptyProject,
  createEmptySkillGroup
} from "@/lib/default-resume";
import { firebaseDb } from "@/lib/firebase/client";
import type { AvatarFrame, ResumeDocument, TemplateId } from "@/lib/types";

const DEMO_RESUMES_KEY = "create-cv-demo-resumes";
const LOCAL_AVATAR_KEY = "create-cv-local-avatar-map";

type LocalAvatarEntry = {
  avatarUrl: string;
  avatarFrame: AvatarFrame;
};

function getDemoResumes(): ResumeDocument[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(DEMO_RESUMES_KEY);
  return raw ? (JSON.parse(raw) as ResumeDocument[]) : [];
}

function setDemoResumes(resumes: ResumeDocument[]) {
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

function saveLocalAvatar(resume: Pick<ResumeDocument, "id" | "avatarUrl" | "avatarFrame">) {
  if (typeof window === "undefined") {
    return;
  }

  const entries = getLocalAvatarMap();

  if (!resume.avatarUrl) {
    delete entries[resume.id];
  } else {
    entries[resume.id] = {
      avatarUrl: resume.avatarUrl,
      avatarFrame: resume.avatarFrame
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
    avatarFrame: localAvatar.avatarFrame ?? resume.avatarFrame ?? "square"
  };
}

function ensureArray<T>(items: T[] | undefined, fallback: () => T, alwaysSeed = true) {
  if (!items || items.length === 0) {
    return alwaysSeed ? [fallback()] : [];
  }

  return items;
}

export function normalizeResume(resume: ResumeDocument): ResumeDocument {
  const skillGroups =
    resume.skillGroups && resume.skillGroups.length > 0
      ? resume.skillGroups
      : resume.skills && resume.skills.length > 0
        ? [
            {
              ...createEmptySkillGroup("Core Skills"),
              skills: resume.skills.filter(Boolean)
            }
          ]
        : [createEmptySkillGroup("Core Skills")];

  return {
    ...resume,
    industryFocus: resume.industryFocus ?? "general",
    careerStage: resume.careerStage ?? "under_3_years",
    avatarUrl: resume.avatarUrl ?? "",
    avatarFrame: resume.avatarFrame ?? "square",
    experiences: ensureArray(resume.experiences, createEmptyExperience),
    education: ensureArray(resume.education, createEmptyEducation),
    skillGroups,
    projects: ensureArray(resume.projects, createEmptyProject),
    certifications: ensureArray(resume.certifications, createEmptyCertification, false),
    awards: ensureArray(resume.awards, createEmptyAward, false),
    activities: ensureArray(resume.activities, createEmptyActivity, false)
  };
}

function cloneResume(source: ResumeDocument): ResumeDocument {
  const now = Date.now();
  const next = structuredClone(normalizeResume(source));

  next.id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `resume-${now}`;
  next.title = `${source.title} Copy`;
  next.createdAt = now;
  next.updatedAt = now;
  next.experiences = next.experiences.map((item) => ({
    ...item,
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${item.id}-${now}`
  }));
  next.education = next.education.map((item) => ({
    ...item,
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${item.id}-${now}`
  }));
  next.projects = next.projects.map((item) => ({
    ...item,
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${item.id}-${now}`
  }));
  next.skillGroups = next.skillGroups.map((item) => ({
    ...item,
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${item.id}-${now}`
  }));
  next.certifications = next.certifications.map((item) => ({
    ...item,
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${item.id}-${now}`
  }));
  next.awards = next.awards.map((item) => ({
    ...item,
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${item.id}-${now}`
  }));
  next.activities = next.activities.map((item) => ({
    ...item,
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${item.id}-${now}`
  }));

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
    return snapshot.docs.map((entry) => mergeLocalAvatar(normalizeResume(entry.data() as ResumeDocument)));
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

    return mergeLocalAvatar(normalizeResume(snapshot.data() as ResumeDocument));
  }

  const resume = getDemoResumes().find((entry) => entry.userId === userId && entry.id === resumeId);
  return resume ? mergeLocalAvatar(normalizeResume(resume)) : null;
}

export async function createResume(userId: string, templateId: TemplateId = "professional", resumeId?: string) {
  const resume = normalizeResume(buildDefaultResume(userId, templateId, resumeId));

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
