"use client";

import { useMemo } from "react";

import { useSettings } from "@/components/settings/settings-provider";
import { PreferenceSegmentedControl } from "@/components/settings/preference-segmented-control";

export function LocaleSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useSettings();

  const options = useMemo(
    () => [
      { value: "vi" as const, label: compact ? "VI" : "Ti?ng Vi?t" },
      { value: "en" as const, label: compact ? "EN" : "English" }
    ],
    [compact]
  );

  return <PreferenceSegmentedControl ariaLabel="Language" options={options} value={locale} onChange={setLocale} size={compact ? "sm" : "md"} />;
}
