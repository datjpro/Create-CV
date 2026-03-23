import type {
  ActivityItem,
  AwardItem,
  CertificationItem,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  ResumeDocument,
  SkillGroup,
  TemplateId
} from "@/lib/types";

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createEmptyExperience(): ExperienceItem {
  return {
    id: createId("exp"),
    jobTitle: "",
    employer: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    bullets: []
  };
}

export function createEmptyEducation(): EducationItem {
  return {
    id: createId("edu"),
    degree: "",
    school: "",
    location: "",
    startDate: "",
    endDate: "",
    description: ""
  };
}

export function createEmptyProject(): ProjectItem {
  return {
    id: createId("project"),
    name: "",
    role: "",
    startDate: "",
    endDate: "",
    description: "",
    link: ""
  };
}

export function createEmptySkillGroup(name = "Core Skills"): SkillGroup {
  return {
    id: createId("skill-group"),
    name,
    skills: []
  };
}

export function createEmptyCertification(): CertificationItem {
  return {
    id: createId("cert"),
    name: "",
    issuer: "",
    date: "",
    description: ""
  };
}

export function createEmptyAward(): AwardItem {
  return {
    id: createId("award"),
    title: "",
    issuer: "",
    date: "",
    description: ""
  };
}

export function createEmptyActivity(): ActivityItem {
  return {
    id: createId("activity"),
    name: "",
    organization: "",
    date: "",
    description: ""
  };
}

export function buildDefaultResume(userId: string, templateId: TemplateId = "professional", resumeId?: string): ResumeDocument {
  const now = Date.now();

  return {
    id: resumeId ?? createId("resume"),
    userId,
    title: "Untitled Resume",
    status: "draft",
    templateId,
    industryFocus: "general",
    careerStage: "under_3_years",
    avatarUrl: "",
    personal: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: ""
    },
    summary: "",
    experiences: [createEmptyExperience()],
    education: [createEmptyEducation()],
    skillGroups: [createEmptySkillGroup()],
    projects: [createEmptyProject()],
    certifications: [],
    awards: [],
    activities: [],
    createdAt: now,
    updatedAt: now
  };
}
