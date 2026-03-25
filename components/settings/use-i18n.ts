"use client";

import { useMemo } from "react";

import { useAppContent } from "@/components/content/app-content-provider";
import { useSettings } from "@/components/settings/settings-provider";
import type { MarketingCopy, TemplateMetaCopy, TemplateMetaDoc } from "@/lib/admin/admin-content-types";
import { getDictionary } from "@/lib/i18n";
import type { TemplateId } from "@/lib/types";

export function useI18n() {
  const { locale } = useSettings();
  const { marketing, templateMeta } = useAppContent();

  const baseCopy = useMemo(() => getDictionary(locale), [locale]);

  const copy = useMemo(() => {
    const marketingOverride: MarketingCopy | null = marketing ? (marketing[locale] as MarketingCopy) : null;

    const templateMetaOverride: Partial<Record<TemplateId, TemplateMetaCopy>> = {};
    (Object.entries(templateMeta) as Array<[TemplateId, TemplateMetaDoc | undefined]>).forEach(([id, doc]) => {
      if (!doc) {
        return;
      }

      templateMetaOverride[id] = doc[locale];
    });

    return {
      ...baseCopy,
      marketing: marketingOverride ?? baseCopy.marketing,
      templateMeta: {
        ...baseCopy.templateMeta,
        ...templateMetaOverride
      }
    };
  }, [baseCopy, locale, marketing, templateMeta]);

  return {
    locale,
    copy
  };
}
