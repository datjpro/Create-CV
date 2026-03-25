"use client";

import { LocaleSwitcher } from "@/components/settings/locale-switcher";
import { ThemeSwitcher } from "@/components/settings/theme-switcher";
import { cn } from "@/lib/utils";

export function PublicPreferenceControls({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <LocaleSwitcher compact />
      <ThemeSwitcher compact />
    </div>
  );
}
