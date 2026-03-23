import type { CareerStage, IndustryFocus, ResumeContentSection, ResumeDocument } from "@/lib/types";

export const industryFocusOptions: Array<{ value: IndustryFocus; label: string; note: string }> = [
  {
    value: "general",
    label: "General corporate",
    note: "Best for operations, HR, admin and broad business roles."
  },
  {
    value: "it",
    label: "IT and software",
    note: "Keeps technical skills and projects prominent for engineering roles."
  },
  {
    value: "marketing",
    label: "Marketing and creative",
    note: "Keeps voice concise while still leaving room for campaigns and portfolio work."
  },
  {
    value: "finance",
    label: "Finance and legal",
    note: "Prioritizes conservative structure and a highly scannable order."
  }
];

export const careerStageOptions: Array<{ value: CareerStage; label: string; note: string }> = [
  {
    value: "student",
    label: "Student or new graduate",
    note: "Education is promoted higher in the resume."
  },
  {
    value: "under_3_years",
    label: "Under 3 years experience",
    note: "Balances education and experience for early-career roles."
  },
  {
    value: "3_plus_years",
    label: "3+ years experience",
    note: "Experience stays ahead of education by default."
  }
];

export function getIndustryFocusLabel(industryFocus: IndustryFocus) {
  return industryFocusOptions.find((option) => option.value === industryFocus)?.label ?? "General corporate";
}

export function getCareerStageLabel(careerStage: CareerStage) {
  return careerStageOptions.find((option) => option.value === careerStage)?.label ?? "Under 3 years experience";
}

export function getSkillSectionLabel(industryFocus: IndustryFocus) {
  return industryFocus === "it" ? "Technical Skills" : "Skills";
}

export function getSectionOrder(resume: Pick<ResumeDocument, "industryFocus" | "careerStage">): ResumeContentSection[] {
  const isEarlyCareer = resume.careerStage !== "3_plus_years";

  if (resume.industryFocus === "it") {
    return [
      "summary",
      "skills",
      "projects",
      ...(isEarlyCareer ? (["education", "experience"] as ResumeContentSection[]) : (["experience", "education"] as ResumeContentSection[])),
      "certifications",
      "awards",
      "activities"
    ];
  }

  return [
    "summary",
    "skills",
    ...(isEarlyCareer ? (["education", "experience"] as ResumeContentSection[]) : (["experience", "education"] as ResumeContentSection[])),
    "projects",
    "certifications",
    "awards",
    "activities"
  ];
}

export function getSummaryHint(industryFocus: IndustryFocus) {
  switch (industryFocus) {
    case "it":
      return "Write 2-4 lines covering your stack, years of experience and the kind of engineering problems you solve.";
    case "marketing":
      return "Lead with campaign impact, brand or channel strengths and the audience you understand best.";
    case "finance":
      return "Keep this concise and formal. Emphasize accuracy, domain knowledge and measurable responsibility.";
    default:
      return "Write 2-4 lines covering your experience, strengths and the direction you are targeting.";
  }
}

export function getSkillsHint(industryFocus: IndustryFocus) {
  switch (industryFocus) {
    case "it":
      return "Group skills by categories such as Languages, Frameworks, Databases and DevOps/Tools.";
    case "marketing":
      return "Use groups like Channels, Analytics, Content, Campaigns and Tools.";
    case "finance":
      return "Use groups like Core Skills, Systems, Compliance, Analysis or Reporting.";
    default:
      return "Use short searchable groups such as Core Skills, Tools, Certifications or Languages.";
  }
}
