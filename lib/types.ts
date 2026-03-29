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

export type Locale = "vi" | "en";

export type ThemePreference = "light" | "dark" | "system";

export type ResolvedTheme = Exclude<ThemePreference, "system">;

export type AppPreferences = {
  locale: Locale;
  theme: ThemePreference;
};

export type AppUser = {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: AuthProviderId;
};

export type ResumeStatus = "draft" | "ready";

export type AvatarTransform = {
  zoom: number;
  x: number;
  y: number;
};

export type ResumeContentLocale = Locale;

export type ResumeSharedPersonalInfo = {
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  github: string;
};

export type ResumeLocalizedPersonalInfo = {
  fullName: string;
  title: string;
  location: string;
};

export type ExperienceItem = {
  id: string;
  startDate: string;
  endDate: string;
  current: boolean;
};

export type ResumeLocalizedExperienceItem = {
  id: string;
  jobTitle: string;
  employer: string;
  location: string;
  description: string;
  bullets: string[];
};

export type EducationItem = {
  id: string;
  startDate: string;
  endDate: string;
};

export type ResumeLocalizedEducationItem = {
  id: string;
  degree: string;
  school: string;
  location: string;
  description: string;
};

export type ProjectItem = {
  id: string;
  startDate: string;
  endDate: string;
  link: string;
};

export type ResumeLocalizedProjectItem = {
  id: string;
  name: string;
  role: string;
  description: string;
};

export type SkillGroup = {
  id: string;
  name: string;
  skills: string[];
};

export type CertificationItem = {
  id: string;
  date: string;
};

export type ResumeLocalizedCertificationItem = {
  id: string;
  name: string;
  issuer: string;
  description: string;
};

export type AwardItem = {
  id: string;
  date: string;
};

export type ResumeLocalizedAwardItem = {
  id: string;
  title: string;
  issuer: string;
  description: string;
};

export type ActivityItem = {
  id: string;
  date: string;
};

export type ResumeLocalizedActivityItem = {
  id: string;
  name: string;
  organization: string;
  description: string;
};

export type ResumeLocalizedContent = {
  title: string;
  personal: ResumeLocalizedPersonalInfo;
  summary: string;
  experiences: ResumeLocalizedExperienceItem[];
  education: ResumeLocalizedEducationItem[];
  skillGroups: SkillGroup[];
  projects: ResumeLocalizedProjectItem[];
  certifications: ResumeLocalizedCertificationItem[];
  awards: ResumeLocalizedAwardItem[];
  activities: ResumeLocalizedActivityItem[];
};

export type ResumeDocument = {
  id: string;
  userId: string;
  title: string;
  status: ResumeStatus;
  templateId: TemplateId;
  industryFocus: IndustryFocus;
  careerStage: CareerStage;
  contentLocale: ResumeContentLocale;
  avatarUrl: string;
  avatarFrame: AvatarFrame;
  avatarTransform: AvatarTransform;
  personal: ResumeSharedPersonalInfo;
  content: Record<Locale, ResumeLocalizedContent>;
  experiences: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  awards: AwardItem[];
  activities: ActivityItem[];
  createdAt: number;
  updatedAt: number;
};

export type LegacyPersonalInfo = {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
};

export type LegacyExperienceItem = {
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

export type LegacyEducationItem = {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type LegacyProjectItem = {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  link: string;
};

export type LegacyCertificationItem = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description: string;
};

export type LegacyAwardItem = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
};

export type LegacyActivityItem = {
  id: string;
  name: string;
  organization: string;
  date: string;
  description: string;
};

export type LegacyResumeDocument = {
  id: string;
  userId: string;
  title: string;
  status: ResumeStatus;
  templateId: TemplateId;
  industryFocus: IndustryFocus;
  careerStage: CareerStage;
  avatarUrl: string;
  avatarFrame: AvatarFrame;
  personal: LegacyPersonalInfo;
  summary: string;
  experiences: LegacyExperienceItem[];
  education: LegacyEducationItem[];
  skills?: string[];
  skillGroups: SkillGroup[];
  projects: LegacyProjectItem[];
  certifications: LegacyCertificationItem[];
  awards: LegacyAwardItem[];
  activities: LegacyActivityItem[];
  createdAt: number;
  updatedAt: number;
};

export type EditablePersonalField = keyof ResumeSharedPersonalInfo | keyof ResumeLocalizedPersonalInfo;
export type EditableExperienceField = keyof ExperienceItem | keyof ResumeLocalizedExperienceItem;
export type EditableEducationField = keyof EducationItem | keyof ResumeLocalizedEducationItem;
export type EditableProjectField = keyof ProjectItem | keyof ResumeLocalizedProjectItem;
export type EditableCertificationField = keyof CertificationItem | keyof ResumeLocalizedCertificationItem;
export type EditableAwardField = keyof AwardItem | keyof ResumeLocalizedAwardItem;
export type EditableActivityField = keyof ActivityItem | keyof ResumeLocalizedActivityItem;

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

