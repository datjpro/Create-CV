"use client";

import { DashboardMobileBar } from "@/components/dashboard/dashboard-mobile-bar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { LocaleSwitcher } from "@/components/settings/locale-switcher";
import { ThemeSwitcher } from "@/components/settings/theme-switcher";
import { useSettings } from "@/components/settings/settings-provider";
import { useAuth } from "@/components/auth/auth-provider";

function SettingsCard({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
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
  const { hydrated, locale, resolvedTheme, theme } = useSettings();

  return (
    <div className="min-h-screen bg-surface lg:flex">
      <DashboardSidebar />
      <div className="flex-1 px-6 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <DashboardMobileBar />
          <header className="mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Settings</span>
            <h1 className="mt-4 font-[var(--font-headline)] text-5xl font-extrabold tracking-tight text-primary">Workspace preferences</h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-on-surface-variant">
              Choose how the app looks and which interface language you want to use across marketing pages, auth, dashboard and editor.
            </p>
          </header>

          <div className="grid gap-6">
            <SettingsCard title="Language" description="Switch the app interface between Vietnamese and English. Your resume content stays exactly as you wrote it.">
              <LocaleSwitcher />
              <p className="mt-4 text-sm text-on-surface-variant">Current locale: <span className="font-semibold text-on-surface">{locale === "vi" ? "Ti?ng Vi?t" : "English"}</span></p>
            </SettingsCard>

            <SettingsCard title="Theme" description="Choose a fixed light or dark appearance, or follow your operating system automatically.">
              <ThemeSwitcher />
              <p className="mt-4 text-sm text-on-surface-variant">
                Active mode: <span className="font-semibold text-on-surface">{theme === "system" ? `System (${resolvedTheme})` : theme}</span>
              </p>
            </SettingsCard>

            <SettingsCard
              title="Sync behavior"
              description="Preferences are remembered locally right away and optionally synced to your account when Firebase is active."
            >
              <div className="rounded-[1.5rem] bg-surface-container-high p-4 text-sm leading-7 text-on-surface-variant">
                {authMode === "firebase"
                  ? "Your language and theme preferences are saved to this browser and synced to your signed-in account."
                  : "Demo mode is active, so preferences are stored in this browser only."}
              </div>
              {!hydrated ? <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">Loading saved preferences...</p> : null}
            </SettingsCard>
          </div>
        </div>
      </div>
    </div>
  );
}
