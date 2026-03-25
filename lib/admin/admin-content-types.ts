import type { CareerStage, IndustryFocus, Locale, TemplateId } from "@/lib/types";

export type MarketingCopy = {
  header: {
    templates: string;
    dashboard: string;
    pricing: string;
    login: string;
    createCv: string;
  };
  footer: {
    description: string;
    templates: string;
    login: string;
    dashboard: string;
    createCv: string;
    pricing: string;
  };
  home: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    socialProof: string;
    collectionEyebrow: string;
    collectionTitle: string;
    collectionDescription: string;
    featureEyebrow: string;
    featureTitle: string;
    featureDescription: string;
    atsTitle: string;
    atsBadge: string;
    atsDescription: string;
    livePreview: string;
    industryAware: string;
    finalTitle: string;
    finalDescription: string;
    finalCta: string;
  };
  templatesPage: {
    eyebrow: string;
    title: string;
    description: string;
    filterAll: string;
    filterSafe: string;
    filterNotes: string;
    filterEditable: string;
    startRecommended: string;
    signatureEyebrow: string;
    signatureTitle: string;
    signatureDescription: string;
    signatureCta: string;
    useTemplate: string;
  };
};

export type TemplateMetaCopy = {
  category: string;
  name: string;
  hook: string;
  description: string;
  badge?: string;
  featuredCopy: string;
  atsReadabilityLevel: string;
  layoutStyle: string;
  notes: string;
};

export type MarketingContentDoc = {
  version: 1;
  updatedAt: unknown;
  vi: MarketingCopy;
  en: MarketingCopy;
};

export type TemplateMetaDoc = {
  version: 1;
  updatedAt: unknown;
  vi: TemplateMetaCopy;
  en: TemplateMetaCopy;
};

export type TemplateConfig = {
  version: 1;
  updatedAt: unknown;
  enabled: boolean;
  featuredRank: number | null;
  sortRank: number;
  bestForIndustries?: IndustryFocus[];
  recommendedCareerStages?: CareerStage[];
};

export type LocaleMap<T> = Record<Locale, T>;
export type TemplateMetaMap<T = TemplateMetaDoc> = Partial<Record<TemplateId, T>>;
