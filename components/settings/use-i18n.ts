"use client";

import { useMemo } from "react";

import { useSettings } from "@/components/settings/settings-provider";
import { getDictionary } from "@/lib/i18n";

export function useI18n() {
  const { locale } = useSettings();
  const copy = useMemo(() => getDictionary(locale), [locale]);

  return {
    locale,
    copy
  };
}

