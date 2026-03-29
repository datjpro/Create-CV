import {
  createEmptyLocalizedEducation,
  createEmptyLocalizedExperience,
  createEmptyLocalizedProject,
  createEmptyLocalizedSkillGroup,
  defaultAvatarTransform
} from "@/lib/resume-content";
import type {
  ActivityItem,
  AwardItem,
  CertificationItem,
  EducationItem,
  ExperienceItem,
  Locale,
  ProjectItem,
  ResumeDocument,
  ResumeLocalizedContent,
  TemplateId
} from "@/lib/types";

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createEmptyExperience(id = createId("exp")): ExperienceItem {
  return {
    id,
    startDate: "",
    endDate: "",
    current: false
  };
}

export function createEmptyEducation(id = createId("edu")): EducationItem {
  return {
    id,
    startDate: "",
    endDate: ""
  };
}

export function createEmptyProject(id = createId("project")): ProjectItem {
  return {
    id,
    startDate: "",
    endDate: "",
    link: ""
  };
}

export function createEmptyCertification(id = createId("cert")): CertificationItem {
  return {
    id,
    date: ""
  };
}

export function createEmptyAward(id = createId("award")): AwardItem {
  return {
    id,
    date: ""
  };
}

export function createEmptyActivity(id = createId("activity")): ActivityItem {
  return {
    id,
    date: ""
  };
}

export function createEmptyLocalizedContent(locale: Locale, ids?: {
  experienceId?: string;
  educationId?: string;
  projectId?: string;
  skillGroupId?: string;
}): ResumeLocalizedContent {
  const experienceId = ids?.experienceId ?? createId("exp");
  const educationId = ids?.educationId ?? createId("edu");
  const projectId = ids?.projectId ?? createId("project");
  const skillGroupId = ids?.skillGroupId ?? createId("skill-group");

  return {
    title: locale === "vi" ? "CV chua dat ten" : "Untitled Resume",
    personal: {
      fullName: "",
      title: "",
      location: ""
    },
    summary: "",
    experiences: [createEmptyLocalizedExperience(experienceId)],
    education: [createEmptyLocalizedEducation(educationId)],
    skillGroups: [createEmptyLocalizedSkillGroup(locale, skillGroupId)],
    projects: [createEmptyLocalizedProject(projectId)],
    certifications: [],
    awards: [],
    activities: []
  };
}

export function buildDefaultResume(userId: string, templateId: TemplateId = "professional", resumeId?: string, locale: Locale = "en"): ResumeDocument {
  const now = Date.now();
  const experience = createEmptyExperience();
  const education = createEmptyEducation();
  const project = createEmptyProject();
  const skillGroupId = createId("skill-group");

  return {
    id: resumeId ?? createId("resume"),
    userId,
    title: locale === "vi" ? "CV chua dat ten" : "Untitled Resume",
    status: "draft",
    templateId,
    industryFocus: "general",
    careerStage: "under_3_years",
    contentLocale: locale,
    avatarUrl: "",
    avatarFrame: "square",
    avatarTransform: defaultAvatarTransform,
    personal: {
      email: "",
      phone: "",
      website: "",
      linkedin: "",
      github: ""
    },
    content: {
      vi: createEmptyLocalizedContent("vi", {
        experienceId: experience.id,
        educationId: education.id,
        projectId: project.id,
        skillGroupId
      }),
      en: createEmptyLocalizedContent("en", {
        experienceId: experience.id,
        educationId: education.id,
        projectId: project.id,
        skillGroupId
      })
    },
    experiences: [experience],
    education: [education],
    projects: [project],
    certifications: [],
    awards: [],
    activities: [],
    createdAt: now,
    updatedAt: now
  };
}

