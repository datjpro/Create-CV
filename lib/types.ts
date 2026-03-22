export type TemplateId = "minimal" | "professional" | "creative";

export type AuthProviderId = "password" | "google" | "github" | "demo";

export type AppUser = {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: AuthProviderId;
};

export type ResumeStatus = "draft" | "ready";

export type PersonalInfo = {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
};

export type ExperienceItem = {
  id: string;
  jobTitle: string;
  employer: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  bullets: string[];
};

export type EducationItem = {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type ProjectItem = {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  link: string;
};

export type ResumeDocument = {
  id: string;
  userId: string;
  title: string;
  status: ResumeStatus;
  templateId: TemplateId;
  avatarUrl: string;
  personal: PersonalInfo;
  summary: string;
  experiences: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  projects: ProjectItem[];
  createdAt: number;
  updatedAt: number;
};

export type ResumeFormSection =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects";
