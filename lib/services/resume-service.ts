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
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { buildDefaultResume } from "@/lib/default-resume";
import { firebaseDb, firebaseStorage } from "@/lib/firebase/client";
import type { ResumeDocument, TemplateId } from "@/lib/types";

const DEMO_RESUMES_KEY = "create-cv-demo-resumes";

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

function cloneResume(source: ResumeDocument): ResumeDocument {
  const now = Date.now();
  const next = structuredClone(source);

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

  return next;
}

function sortResumes(resumes: ResumeDocument[]) {
  return [...resumes].sort((a, b) => b.updatedAt - a.updatedAt);
}

function ensureResumeBelongsToUser(resume: ResumeDocument | null | undefined, userId: string) {
  if (!resume || resume.userId !== userId) {
    throw new Error("Resume not found.");
  }

  return resume;
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
    return snapshot.docs.map((entry) => entry.data() as ResumeDocument);
  }

  return sortResumes(getDemoResumes().filter((resume) => resume.userId === userId));
}

export async function getResume(userId: string, resumeId: string) {
  if (firebaseDb) {
    const reference = doc(firebaseDb, "users", userId, "resumes", resumeId);
    const snapshot = await getDoc(reference);

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data() as ResumeDocument;
  }

  return getDemoResumes().find((resume) => resume.userId === userId && resume.id === resumeId) ?? null;
}

export async function createResume(userId: string, templateId: TemplateId = "professional") {
  const resume = buildDefaultResume(userId, templateId);

  if (firebaseDb) {
    const reference = doc(firebaseDb, "users", userId, "resumes", resume.id);
    await setDoc(reference, resume);
    return resume;
  }

  const resumes = getDemoResumes();
  resumes.push(resume);
  setDemoResumes(resumes);
  return resume;
}

export async function saveResume(resume: ResumeDocument) {
  const nextResume = {
    ...resume,
    updatedAt: Date.now()
  };

  if (firebaseDb) {
    const reference = doc(firebaseDb, "users", resume.userId, "resumes", resume.id);
    await setDoc(reference, nextResume);
    return nextResume;
  }

  const resumes = getDemoResumes();
  const index = resumes.findIndex((entry) => entry.id === resume.id && entry.userId === resume.userId);

  if (index === -1) {
    resumes.push(nextResume);
  } else {
    resumes[index] = nextResume;
  }

  setDemoResumes(resumes);
  return nextResume;
}

export async function duplicateResume(userId: string, resumeId: string) {
  const source = ensureResumeBelongsToUser(await getResume(userId, resumeId), userId);
  const duplicate = cloneResume(source);

  if (firebaseDb) {
    const reference = doc(firebaseDb, "users", userId, "resumes", duplicate.id);
    await setDoc(reference, duplicate);
    return duplicate;
  }

  const resumes = getDemoResumes();
  resumes.push(duplicate);
  setDemoResumes(resumes);
  return duplicate;
}

export async function deleteResumeById(userId: string, resumeId: string) {
  if (firebaseDb) {
    await deleteDoc(doc(firebaseDb, "users", userId, "resumes", resumeId));
    return;
  }

  const resumes = getDemoResumes().filter((resume) => !(resume.userId === userId && resume.id === resumeId));
  setDemoResumes(resumes);
}

export async function uploadAvatar(userId: string, resumeId: string, file: File) {
  if (firebaseStorage) {
    const storageRef = ref(firebaseStorage, `users/${userId}/resumes/${resumeId}/avatar/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Unable to read avatar file."));
    reader.readAsDataURL(file);
  });
}

