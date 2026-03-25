"use client";

import { useMemo } from "react";

import { useSettings } from "@/components/settings/settings-provider";
import { PreferenceSegmentedControl } from "@/components/settings/preference-segmented-control";
import { useI18n } from "@/components/settings/use-i18n";

export function LocaleSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useSettings();
  const { copy } = useI18n();

  const options = useMemo(
    () => [
      { value: "vi" as const, label: compact ? "VI" : copy.settings.localeOptions.vi },
      { value: "en" as const, label: compact ? "EN" : copy.settings.localeOptions.en }
    ],
    [compact, copy.settings.localeOptions.en, copy.settings.localeOptions.vi]
  );

  return <PreferenceSegmentedControl ariaLabel={copy.settings.languageAria} options={options} value={locale} onChange={setLocale} size={compact ? "sm" : "md"} />;
}

