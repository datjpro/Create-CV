import type { CareerStage, IndustryFocus, TemplateId } from "@/lib/types";

export type TemplatePreset = {
  id: TemplateId;
  category: string;
  name: string;
  hook: string;
  description: string;
  badge?: string;
  featuredCopy: string;
  bestForIndustries: IndustryFocus[];
  atsReadabilityLevel: string;
  layoutStyle: string;
  recommendedCareerStages: CareerStage[];
  notes: string;
};

export const templateLibrary: TemplatePreset[] = [
  {
    id: "professional",
    category: "Professional",
    name: "The Executive",
    hook: "Balanced hierarchy for business and corporate roles",
    description: "A structured one-column template for operations, finance, legal and broad corporate hiring flows.",
    badge: "Popular",
    featuredCopy: "A polished ATS-safe layout for business, finance, operations and experienced individual contributors.",
    bestForIndustries: ["general", "finance"],
    atsReadabilityLevel: "ATS-first",
    layoutStyle: "Structured one-column",
    recommendedCareerStages: ["under_3_years", "3_plus_years"],
    notes: "Best when you want a conservative, high-trust document with strong section rhythm."
  },
  {
    id: "minimal",
    category: "Minimal",
    name: "The Minimalist",
    hook: "Whitespace-first layout for technical and product resumes",
    description: "A clean one-column system designed for ATS safety, easy scanning and technical resumes with grouped skills.",
    featuredCopy: "Ideal for software, product, data and other text-first resumes where content clarity matters most.",
    bestForIndustries: ["it", "general"],
    atsReadabilityLevel: "Maximum ATS safety",
    layoutStyle: "Minimal one-column",
    recommendedCareerStages: ["student", "under_3_years", "3_plus_years"],
    notes: "Works especially well for IT, product, data and applicants who want a no-noise format."
  },
  {
    id: "creative",
    category: "Creative",
    name: "The Modernist",
    hook: "Expressive typography with ATS-safe single-column flow",
    description: "A more distinctive one-column layout for marketing, content and design-adjacent roles without sacrificing machine readability.",
    badge: "New",
    featuredCopy: "Best when you want more personality for marketing or creative roles while keeping a recruiter-safe structure.",
    bestForIndustries: ["marketing", "general"],
    atsReadabilityLevel: "ATS-safe",
    layoutStyle: "Expressive one-column",
    recommendedCareerStages: ["student", "under_3_years", "3_plus_years"],
    notes: "Keeps the reading order linear while giving the page more character through type and accents."
  }
];

export function buildResumeCreateHref(templateId: TemplateId) {
  return `/resume/new?template=${templateId}`;
}

export function buildResumeStartHref(templateId: TemplateId) {
  return `/login?redirect=${encodeURIComponent(buildResumeCreateHref(templateId))}`;
}
