"use client";

import { useMemo } from "react";

import { useSettings } from "@/components/settings/settings-provider";
import { PreferenceSegmentedControl } from "@/components/settings/preference-segmented-control";

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useSettings();

  const options = useMemo(
    () => [
      { value: "light" as const, label: compact ? "Light" : "Light" },
      { value: "dark" as const, label: compact ? "Dark" : "Dark" },
      { value: "system" as const, label: compact ? "Auto" : "System" }
    ],
    [compact]
  );

  return <PreferenceSegmentedControl ariaLabel="Theme" options={options} value={theme} onChange={setTheme} size={compact ? "sm" : "md"} />;
}
