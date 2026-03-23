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

export const defaultTemplateId: TemplateId = "professional";

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
  },
  {
    id: "dark-portfolio",
    category: "Portfolio",
    name: "The Nightfolio",
    hook: "Dark photo-first portfolio with experience and project emphasis",
    description: "A dark portfolio-oriented template with a left identity rail and a projects-heavy main canvas for developer resumes.",
    badge: "Showcase",
    featuredCopy: "Built for software and portfolio-driven candidates who want stronger personal branding without losing export readability.",
    bestForIndustries: ["it", "marketing"],
    atsReadabilityLevel: "ATS-adapted",
    layoutStyle: "Dark split portfolio",
    recommendedCareerStages: ["student", "under_3_years", "3_plus_years"],
    notes: "Best for dev portfolios, freelance profiles and candidates who want projects to carry more visual weight."
  },
  {
    id: "corporate-slate",
    category: "Corporate",
    name: "The Slate Board",
    hook: "Crisp light layout with stronger executive rhythm",
    description: "A calm, slate-toned resume that emphasizes experience, summary and clean scanning for corporate hiring teams.",
    featuredCopy: "A safer polished alternative when you want a more premium corporate tone than the default professional template.",
    bestForIndustries: ["general", "finance"],
    atsReadabilityLevel: "ATS-first",
    layoutStyle: "Slate one-column",
    recommendedCareerStages: ["under_3_years", "3_plus_years"],
    notes: "Works well for operations, consulting, business, legal and cross-functional roles."
  },
  {
    id: "compact-fresher",
    category: "Compact",
    name: "The First Page",
    hook: "Dense but readable starter layout for students and fresh graduates",
    description: "A compact layout that gives more space to education, projects and grouped skills while staying export friendly.",
    featuredCopy: "Designed for students and early-career applicants who need to fit strong projects and education into a single page.",
    bestForIndustries: ["it", "general"],
    atsReadabilityLevel: "Maximum ATS safety",
    layoutStyle: "Compact one-column",
    recommendedCareerStages: ["student", "under_3_years"],
    notes: "Use this when you need a one-page junior resume with tighter spacing but clear hierarchy."
  },
  {
    id: "modern-columns",
    category: "Hybrid",
    name: "The Split Ledger",
    hook: "Structured two-zone layout for product, marketing and hybrid resumes",
    description: "A modern two-zone composition that separates profile context from experience-heavy content without becoming visually noisy.",
    featuredCopy: "Good for product, growth, marketing and cross-functional candidates who want a more editorial page structure.",
    bestForIndustries: ["marketing", "general"],
    atsReadabilityLevel: "ATS-safe",
    layoutStyle: "Two-zone editorial",
    recommendedCareerStages: ["under_3_years", "3_plus_years"],
    notes: "Balances stronger visual structure with recruiter-friendly spacing and printable sections."
  },
  {
    id: "clean-showcase",
    category: "Showcase",
    name: "The Clean Pitch",
    hook: "Sharper project and skills presentation without visual clutter",
    description: "A bright showcase layout for software, creative-tech and freelance profiles that need stronger project storytelling.",
    featuredCopy: "Best when you want a polished project-forward resume that still feels professional and lightweight.",
    bestForIndustries: ["it", "marketing", "general"],
    atsReadabilityLevel: "ATS-safe",
    layoutStyle: "Showcase one-column",
    recommendedCareerStages: ["student", "under_3_years", "3_plus_years"],
    notes: "Ideal when projects and skill depth should stand out more than a traditional corporate timeline."
  }
];

export function isTemplateId(value: string | null | undefined): value is TemplateId {
  return templateLibrary.some((template) => template.id === value);
}

export function getTemplatePreset(templateId: TemplateId) {
  return templateLibrary.find((template) => template.id === templateId) ?? templateLibrary[0];
}

export function buildResumeCreateHref(templateId: TemplateId) {
  return `/resume/new?template=${templateId}`;
}

export function buildResumeStartHref(templateId: TemplateId) {
  return `/login?redirect=${encodeURIComponent(buildResumeCreateHref(templateId))}`;
}
