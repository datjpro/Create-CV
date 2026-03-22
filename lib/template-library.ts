import type { TemplateId } from "@/lib/types";

export type TemplatePreset = {
  id: TemplateId;
  category: string;
  name: string;
  hook: string;
  description: string;
  badge?: string;
  featuredCopy: string;
};

export const templateLibrary: TemplatePreset[] = [
  {
    id: "professional",
    category: "Professional",
    name: "The Executive",
    hook: "Balanced hierarchy for leadership roles",
    description: "A high-trust template with strong section rhythm, restrained typography and ATS-friendly structure.",
    badge: "Popular",
    featuredCopy: "The most versatile layout for business, operations, finance and senior IC roles."
  },
  {
    id: "minimal",
    category: "Minimal",
    name: "The Minimalist",
    hook: "Whitespace-first layout with editorial rhythm",
    description: "A calm one-column system built for clean storytelling and easy scanning by recruiters and ATS systems.",
    featuredCopy: "Ideal when you want your experience to carry the page without decorative noise."
  },
  {
    id: "creative",
    category: "Creative",
    name: "The Modernist",
    hook: "Bold structure for portfolios and creative profiles",
    description: "A confident split layout with stronger typographic contrast for designers, marketers and storytellers.",
    badge: "New",
    featuredCopy: "Best when you need a little more personality without sacrificing machine-readable text."
  }
];

export function buildResumeStartHref(templateId: TemplateId) {
  return `/login?redirect=${encodeURIComponent(`/resume/new?template=${templateId}`)}`;
}
