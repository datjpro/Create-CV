"use client";

import { createContext, useContext, useMemo, type PropsWithChildren } from "react";

import { useAppContent } from "@/components/content/app-content-provider";
import { templateLibrary, type TemplatePreset } from "@/lib/template-library";
import type { CareerStage, IndustryFocus, TemplateId } from "@/lib/types";

export type TemplateCatalogItem = TemplatePreset & {
  enabled: boolean;
  featuredRank: number | null;
  sortRank: number;
  bestForIndustries: IndustryFocus[];
  recommendedCareerStages: CareerStage[];
};

type TemplateCatalogValue = {
  allTemplates: TemplateCatalogItem[];
  publicTemplates: TemplateCatalogItem[];
  featuredTemplates: TemplateCatalogItem[];
  configById: Partial<Record<TemplateId, { enabled: boolean; featuredRank: number | null; sortRank: number }>>;
};

const TemplateCatalogContext = createContext<TemplateCatalogValue | null>(null);

function baseIndexById() {
  const index: Partial<Record<TemplateId, number>> = {};
  templateLibrary.forEach((template, i) => {
    index[template.id] = i;
  });
  return index;
}

const baseIndex = baseIndexById();

export function TemplateCatalogProvider({ children }: PropsWithChildren) {
  const { templateConfig } = useAppContent();

  const allTemplates = useMemo<TemplateCatalogItem[]>(() => {
    return templateLibrary
      .map((template) => {
        const config = templateConfig[template.id];
        const enabled = config?.enabled ?? true;
        const sortRank = typeof config?.sortRank === "number" ? config.sortRank : (baseIndex[template.id] ?? 0);
        const featuredRank = config?.featuredRank ?? null;

        return {
          ...template,
          enabled,
          sortRank,
          featuredRank,
          bestForIndustries: config?.bestForIndustries ?? template.bestForIndustries,
          recommendedCareerStages: config?.recommendedCareerStages ?? template.recommendedCareerStages
        };
      })
      .sort((a, b) => (a.sortRank - b.sortRank) || ((baseIndex[a.id] ?? 0) - (baseIndex[b.id] ?? 0)));
  }, [templateConfig]);

  const publicTemplates = useMemo(() => allTemplates.filter((template) => template.enabled), [allTemplates]);

  const featuredTemplates = useMemo(() => {
    return publicTemplates
      .filter((template) => template.featuredRank != null)
      .sort((a, b) => (Number(b.featuredRank) - Number(a.featuredRank)) || (a.sortRank - b.sortRank));
  }, [publicTemplates]);

  const configById = useMemo<TemplateCatalogValue["configById"]>(() => {
    const map: TemplateCatalogValue["configById"] = {};
    allTemplates.forEach((t) => {
      map[t.id] = { enabled: t.enabled, featuredRank: t.featuredRank, sortRank: t.sortRank };
    });
    return map;
  }, [allTemplates]);

  const value = useMemo<TemplateCatalogValue>(
    () => ({
      allTemplates,
      publicTemplates,
      featuredTemplates,
      configById
    }),
    [allTemplates, publicTemplates, featuredTemplates, configById]
  );

  return <TemplateCatalogContext.Provider value={value}>{children}</TemplateCatalogContext.Provider>;
}

export function useTemplateCatalog() {
  const context = useContext(TemplateCatalogContext);

  if (!context) {
    throw new Error("useTemplateCatalog must be used within TemplateCatalogProvider");
  }

  return context;
}
