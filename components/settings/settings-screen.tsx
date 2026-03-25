"use client";

import { LocaleSwitcher } from "@/components/settings/locale-switcher";
import { ThemeSwitcher } from "@/components/settings/theme-switcher";
import { useSettings } from "@/components/settings/settings-provider";
import { useI18n } from "@/components/settings/use-i18n";
import { DashboardMobileBar } from "@/components/dashboard/dashboard-mobile-bar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { useAuth } from "@/components/auth/auth-provider";

function SettingsCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[1.75rem] bg-surface-container-low p-6 shadow-sm sm:p-7">
      <h2 className="font-[var(--font-headline)] text-2xl font-extrabold tracking-tight text-on-surface">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">{description}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function SettingsScreen() {
  const { authMode } = useAuth();
  const { copy } = useI18n();
  const { hydrated, locale, resolvedTheme, theme } = useSettings();

  return (
    <div className="min-h-screen bg-surface lg:flex">
      <DashboardSidebar />
      <div className="flex-1 px-6 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <DashboardMobileBar />
          <header className="mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">{copy.common.settings}</span>
            <h1 className="mt-4 font-[var(--font-headline)] text-5xl font-extrabold tracking-tight text-primary">{copy.settings.title}</h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-on-surface-variant">{copy.settings.subtitle}</p>
          </header>

          <div className="grid gap-6">
            <SettingsCard title={copy.settings.languageTitle} description={copy.settings.languageDescription}>
              <LocaleSwitcher />
              <p className="mt-4 text-sm text-on-surface-variant">{copy.settings.currentLocale}: <span className="font-semibold text-on-surface">{copy.settings.localeOptions[locale]}</span></p>
            </SettingsCard>

            <SettingsCard title={copy.settings.themeTitle} description={copy.settings.themeDescription}>
              <ThemeSwitcher />
              <p className="mt-4 text-sm text-on-surface-variant">
                {copy.settings.activeMode}: <span className="font-semibold text-on-surface">{theme === "system" ? `${copy.settings.themeOptions.system} (${copy.settings.systemResolved[resolvedTheme]})` : copy.settings.themeOptions[theme]}</span>
              </p>
            </SettingsCard>

            <SettingsCard title={copy.settings.syncTitle} description={copy.settings.syncDescription}>
              <div className="rounded-[1.5rem] bg-surface-container-high p-4 text-sm leading-7 text-on-surface-variant">
                {authMode === "firebase" ? copy.settings.syncFirebase : copy.settings.syncDemo}
              </div>
              {!hydrated ? <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">{copy.settings.loadingSaved}</p> : null}
            </SettingsCard>
          </div>
        </div>
      </div>
    </div>
  );
}

