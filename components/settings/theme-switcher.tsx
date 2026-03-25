"use client";

import { useMemo } from "react";

import { useSettings } from "@/components/settings/settings-provider";
import { PreferenceSegmentedControl } from "@/components/settings/preference-segmented-control";
import { useI18n } from "@/components/settings/use-i18n";

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useSettings();
  const { copy } = useI18n();

  const labels = compact ? copy.settings.compactThemeOptions : copy.settings.themeOptions;
  const options = useMemo(
    () => [
      { value: "light" as const, label: labels.light },
      { value: "dark" as const, label: labels.dark },
      { value: "system" as const, label: labels.system }
    ],
    [labels.dark, labels.light, labels.system]
  );

  return <PreferenceSegmentedControl ariaLabel={copy.settings.themeAria} options={options} value={theme} onChange={setTheme} size={compact ? "sm" : "md"} />;
}

