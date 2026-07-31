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
  },
  {
    id: "nordic-minimal",
    category: "Minimal",
    name: "The Nordic Modern",
    hook: "Scandinavian editorial style with typography contrast and line geometry",
    description: "A pristine minimal template featuring refined serif headers, warm neutral borders, and clear metadata hierarchy.",
    badge: "Design Pick",
    featuredCopy: "Designed for product, UX/UI, design lead and creative strategists who appreciate typography and whitespace.",
    bestForIndustries: ["marketing", "general"],
    atsReadabilityLevel: "ATS-first",
    layoutStyle: "Scandinavian minimal",
    recommendedCareerStages: ["under_3_years", "3_plus_years"],
    notes: "Harmonious line geometry and generous whitespace make reading effortless."
  },
  {
    id: "emerald-executive",
    category: "Executive",
    name: "The Emerald Executive",
    hook: "Deep emerald identity header with high-trust corporate metrics",
    description: "An authoritative executive resume with rich forest emerald headers, gold subtle accents, and double-column metric alignment.",
    badge: "Executive",
    featuredCopy: "Tailored for senior directors, operations leaders, managers and high-responsibility corporate executives.",
    bestForIndustries: ["finance", "general"],
    atsReadabilityLevel: "ATS-first",
    layoutStyle: "Emerald banner executive",
    recommendedCareerStages: ["3_plus_years"],
    notes: "Exudes authority, trust, and structured leadership impact."
  },
  {
    id: "tech-matrix",
    category: "Technical",
    name: "The Tech Matrix",
    hook: "Code-inspired architecture built specifically for software engineers",
    description: "A dark terminal-accented tech template with code-block skill tags, GitHub highlights, and project metrics spotlight.",
    badge: "Developer",
    featuredCopy: "Engineered for full-stack developers, DevOps, systems architects and data scientists.",
    bestForIndustries: ["it"],
    atsReadabilityLevel: "ATS-safe",
    layoutStyle: "Developer matrix layout",
    recommendedCareerStages: ["student", "under_3_years", "3_plus_years"],
    notes: "Highlights technical stack, GitHub repositories, system architecture and code contributions."
  },
  {
    id: "editorial-elegance",
    category: "Editorial",
    name: "The Editorial Serif",
    hook: "Publication-style elegance with high contrast serif headings",
    description: "A sophisticated magazine-style resume layout with Playfair-inspired typography, elegant quotes, and vertical accent rules.",
    badge: "Premium",
    featuredCopy: "Ideal for marketing leaders, PR strategists, journalists, architects and brand consultants.",
    bestForIndustries: ["marketing", "general"],
    atsReadabilityLevel: "ATS-safe",
    layoutStyle: "Publication editorial",
    recommendedCareerStages: ["under_3_years", "3_plus_years"],
    notes: "Stand out with publication-grade editorial styling and refined serif contrast."
  },
  {
    id: "vibrant-gradient",
    category: "Creative",
    name: "The Modern Accent",
    hook: "Contemporary gradient identity with pill badges and modern cards",
    description: "A dynamic layout featuring a vibrant Indigo-to-Teal header, floating skill cards, and modern badge badges.",
    badge: "Trending",
    featuredCopy: "Perfect for tech startups, growth marketers, digital designers, and modern product leads.",
    bestForIndustries: ["it", "marketing", "general"],
    atsReadabilityLevel: "ATS-safe",
    layoutStyle: "Gradient banner modern",
    recommendedCareerStages: ["student", "under_3_years", "3_plus_years"],
    notes: "Catch immediate visual attention while keeping machine readability intact."
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
