import type { CSSProperties } from "react";

import type {
  AvatarTransform,
  Locale,
  ResumeDocument,
  ResumeLocalizedActivityItem,
  ResumeLocalizedAwardItem,
  ResumeLocalizedCertificationItem,
  ResumeLocalizedContent,
  ResumeLocalizedEducationItem,
  ResumeLocalizedExperienceItem,
  ResumeLocalizedProjectItem,
  SkillGroup
} from "@/lib/types";

export const defaultAvatarTransform: AvatarTransform = {
  zoom: 1,
  x: 50,
  y: 50
};

export function clampAvatarTransform(transform: Partial<AvatarTransform> | null | undefined): AvatarTransform {
  const zoom = Number.isFinite(transform?.zoom) ? Number(transform?.zoom) : defaultAvatarTransform.zoom;
  const x = Number.isFinite(transform?.x) ? Number(transform?.x) : defaultAvatarTransform.x;
  const y = Number.isFinite(transform?.y) ? Number(transform?.y) : defaultAvatarTransform.y;

  return {
    zoom: Math.min(2.5, Math.max(1, zoom)),
    x: Math.min(100, Math.max(0, x)),
    y: Math.min(100, Math.max(0, y))
  };
}

export function getAvatarImageStyle(transform: AvatarTransform): CSSProperties {
  const next = clampAvatarTransform(transform);

  return {
    objectPosition: `${next.x}% ${next.y}%`,
    transform: `scale(${next.zoom})`,
    transformOrigin: "center center"
  };
}

export function getResumeContent(resume: ResumeDocument, locale: Locale = resume.contentLocale): ResumeLocalizedContent {
  return resume.content[locale];
}

export function getLocalizedResumeTitle(resume: ResumeDocument, locale: Locale = resume.contentLocale) {
  return getResumeContent(resume, locale).title || resume.title;
}

function mapById<T extends { id: string }>(items: T[]) {
  return new Map(items.map((item) => [item.id, item]));
}

export function mergeLocalizedItems<TShared extends { id: string }, TLocalized extends { id: string }>(sharedItems: TShared[], localizedItems: TLocalized[]) {
  const localizedMap = mapById(localizedItems);

  return sharedItems.map((item) => ({
    ...item,
    ...localizedMap.get(item.id),
    id: item.id
  })) as Array<TShared & TLocalized>;
}

export function createEmptyLocalizedSkillGroup(locale: Locale, id: string) {
  return {
    id,
    name: locale === "vi" ? "Ky nang cot loi" : "Core Skills",
    skills: []
  } satisfies SkillGroup;
}

export function createEmptyLocalizedExperience(id: string): ResumeLocalizedExperienceItem {
  return {
    id,
    jobTitle: "",
    employer: "",
    location: "",
    description: "",
    bullets: []
  };
}

export function createEmptyLocalizedEducation(id: string): ResumeLocalizedEducationItem {
  return {
    id,
    degree: "",
    school: "",
    location: "",
    description: ""
  };
}

export function createEmptyLocalizedProject(id: string): ResumeLocalizedProjectItem {
  return {
    id,
    name: "",
    role: "",
    description: ""
  };
}

export function createEmptyLocalizedCertification(id: string): ResumeLocalizedCertificationItem {
  return {
    id,
    name: "",
    issuer: "",
    description: ""
  };
}

export function createEmptyLocalizedAward(id: string): ResumeLocalizedAwardItem {
  return {
    id,
    title: "",
    issuer: "",
    description: ""
  };
}

export function createEmptyLocalizedActivity(id: string): ResumeLocalizedActivityItem {
  return {
    id,
    name: "",
    organization: "",
    description: ""
  };
}

