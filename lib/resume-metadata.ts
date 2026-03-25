import type { CareerStage, IndustryFocus, ResumeContentSection, ResumeDocument, Locale } from "@/lib/types";
import { getResumeMetaCopy } from "@/lib/i18n/resume-meta";

export function getIndustryFocusOptions(locale: Locale = "en"): Array<{ value: IndustryFocus; label: string; note: string }> {
  const copy = getResumeMetaCopy(locale).industryFocus;

  return [
    { value: "general", label: copy.general.label, note: copy.general.note },
    { value: "it", label: copy.it.label, note: copy.it.note },
    { value: "marketing", label: copy.marketing.label, note: copy.marketing.note },
    { value: "finance", label: copy.finance.label, note: copy.finance.note }
  ];
}

export function getCareerStageOptions(locale: Locale = "en"): Array<{ value: CareerStage; label: string; note: string }> {
  const copy = getResumeMetaCopy(locale).careerStage;

  return [
    { value: "student", label: copy.student.label, note: copy.student.note },
    { value: "under_3_years", label: copy.under_3_years.label, note: copy.under_3_years.note },
    { value: "3_plus_years", label: copy["3_plus_years"].label, note: copy["3_plus_years"].note }
  ];
}

export function getIndustryFocusLabel(industryFocus: IndustryFocus, locale: Locale = "en") {
  const options = getIndustryFocusOptions(locale);
  return options.find((option) => option.value === industryFocus)?.label ?? options[0].label;
}

export function getCareerStageLabel(careerStage: CareerStage, locale: Locale = "en") {
  const options = getCareerStageOptions(locale);
  return options.find((option) => option.value === careerStage)?.label ?? options[1].label;
}

export function getSkillSectionLabel(industryFocus: IndustryFocus, locale: Locale = "en") {
  const copy = getResumeMetaCopy(locale).skillSectionLabel;
  return industryFocus === "it" ? copy.it : copy.default;
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

export function getSummaryHint(industryFocus: IndustryFocus, locale: Locale = "en") {
  return getResumeMetaCopy(locale).summaryHint[industryFocus];
}

export function getSkillsHint(industryFocus: IndustryFocus, locale: Locale = "en") {
  return getResumeMetaCopy(locale).skillsHint[industryFocus];
}

