export type TemplateId =
  | "minimal"
  | "professional"
  | "creative"
  | "dark-portfolio"
  | "corporate-slate"
  | "compact-fresher"
  | "modern-columns"
  | "clean-showcase";

export type AuthProviderId = "password" | "google" | "github" | "demo";

export type IndustryFocus = "general" | "it" | "marketing" | "finance";

export type CareerStage = "student" | "under_3_years" | "3_plus_years";

export type AvatarFrame = "square" | "portrait";

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

export type SkillGroup = {
  id: string;
  name: string;
  skills: string[];
};

export type CertificationItem = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description: string;
};

export type AwardItem = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
};

export type ActivityItem = {
  id: string;
  name: string;
  organization: string;
  date: string;
  description: string;
};

export type ResumeDocument = {
  id: string;
  userId: string;
  title: string;
  status: ResumeStatus;
  templateId: TemplateId;
  industryFocus: IndustryFocus;
  careerStage: CareerStage;
  avatarUrl: string;
  avatarFrame: AvatarFrame;
  personal: PersonalInfo;
  summary: string;
  experiences: ExperienceItem[];
  education: EducationItem[];
  skills?: string[];
  skillGroups: SkillGroup[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  awards: AwardItem[];
  activities: ActivityItem[];
  createdAt: number;
  updatedAt: number;
};

export type ResumeFormSection =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "awards"
  | "activities";

export type ResumeContentSection = Exclude<ResumeFormSection, "personal">;



