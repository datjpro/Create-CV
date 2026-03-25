"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import {
  applyPreferencesToDocument,
  APP_PREFERENCES_STORAGE_KEY,
  areAppPreferencesEqual,
  getDefaultAppPreferences,
  getRemoteAppPreferences,
  readLocalAppPreferences,
  resolveThemePreference,
  saveRemoteAppPreferences,
  writeLocalAppPreferences
} from "@/lib/services/app-preferences-service";
import type { AppPreferences, Locale, ResolvedTheme, ThemePreference } from "@/lib/types";

type SettingsContextValue = {
  hydrated: boolean;
  preferences: AppPreferences;
  locale: Locale;
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: ThemePreference) => void;
  setPreferences: (nextPreferences: AppPreferences) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: PropsWithChildren) {
  const { authMode, user } = useAuth();
  const [hydrated, setHydrated] = useState(false);
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);
  const [preferences, setPreferencesState] = useState<AppPreferences>(getDefaultAppPreferences);
  const latestPreferencesRef = useRef(preferences);
  const skipNextRemoteWriteRef = useRef(false);

  latestPreferencesRef.current = preferences;

  useEffect(() => {
    setPreferencesState((current) => {
      const next = readLocalAppPreferences();
      return areAppPreferencesEqual(current, next) ? current : next;
    });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => setSystemPrefersDark(mediaQuery.matches);
    updateTheme();

    mediaQuery.addEventListener("change", updateTheme);
    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, []);

  const resolvedTheme = useMemo(
    () => resolveThemePreference(preferences.theme, systemPrefersDark),
    [preferences.theme, systemPrefersDark]
  );

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    writeLocalAppPreferences(preferences);
    applyPreferencesToDocument(preferences, resolvedTheme);
  }, [hydrated, preferences, resolvedTheme]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== APP_PREFERENCES_STORAGE_KEY) {
        return;
      }

      const next = readLocalAppPreferences();
      setPreferencesState((current) => (areAppPreferencesEqual(current, next) ? current : next));
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated || authMode !== "firebase" || !user) {
      return;
    }

    let active = true;

    void (async () => {
      try {
        const remotePreferences = await getRemoteAppPreferences(user.uid);

        if (!active) {
          return;
        }

        if (remotePreferences) {
          skipNextRemoteWriteRef.current = true;
          setPreferencesState((current) => (areAppPreferencesEqual(current, remotePreferences) ? current : remotePreferences));
          return;
        }

        await saveRemoteAppPreferences(user.uid, latestPreferencesRef.current);
      } catch {
        // Settings persistence should not block the rest of the app.
      }
    })();

    return () => {
      active = false;
    };
  }, [authMode, hydrated, user]);

  useEffect(() => {
    if (!hydrated || authMode !== "firebase" || !user) {
      return;
    }

    if (skipNextRemoteWriteRef.current) {
      skipNextRemoteWriteRef.current = false;
      return;
    }

    void saveRemoteAppPreferences(user.uid, preferences).catch(() => undefined);
  }, [authMode, hydrated, preferences, user]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      hydrated,
      preferences,
      locale: preferences.locale,
      theme: preferences.theme,
      resolvedTheme,
      setLocale: (locale) => setPreferencesState((current) => (current.locale === locale ? current : { ...current, locale })),
      setTheme: (theme) => setPreferencesState((current) => (current.theme === theme ? current : { ...current, theme })),
      setPreferences: (nextPreferences) =>
        setPreferencesState((current) => (areAppPreferencesEqual(current, nextPreferences) ? current : nextPreferences))
    }),
    [hydrated, preferences, resolvedTheme]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }

  return context;
}
