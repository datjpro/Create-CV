"use client";

import { doc, getDoc, setDoc } from "firebase/firestore";

import { firebaseDb } from "@/lib/firebase/client";
import type { AppPreferences, Locale, ResolvedTheme, ThemePreference } from "@/lib/types";

export const APP_PREFERENCES_STORAGE_KEY = "create-cv-app-preferences";

const fallbackPreferences: AppPreferences = {
  locale: "en",
  theme: "system"
};

function isLocale(value: unknown): value is Locale {
  return value === "vi" || value === "en";
}

function isThemePreference(value: unknown): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

export function detectBrowserLocale(): Locale {
  if (typeof window === "undefined") {
    return fallbackPreferences.locale;
  }

  const candidates = [...(window.navigator.languages ?? []), window.navigator.language].filter(Boolean);
  return candidates.some((entry) => entry.toLowerCase().startsWith("vi")) ? "vi" : "en";
}

export function getDefaultAppPreferences(): AppPreferences {
  return {
    locale: detectBrowserLocale(),
    theme: fallbackPreferences.theme
  };
}

export function normalizeAppPreferences(value: Partial<AppPreferences> | null | undefined): AppPreferences {
  const defaults = getDefaultAppPreferences();

  return {
    locale: isLocale(value?.locale) ? value.locale : defaults.locale,
    theme: isThemePreference(value?.theme) ? value.theme : defaults.theme
  };
}

export function areAppPreferencesEqual(left: AppPreferences, right: AppPreferences) {
  return left.locale === right.locale && left.theme === right.theme;
}

export function readLocalAppPreferences(): AppPreferences {
  if (typeof window === "undefined") {
    return getDefaultAppPreferences();
  }

  try {
    const raw = window.localStorage.getItem(APP_PREFERENCES_STORAGE_KEY);
    return raw ? normalizeAppPreferences(JSON.parse(raw) as Partial<AppPreferences>) : getDefaultAppPreferences();
  } catch {
    return getDefaultAppPreferences();
  }
}

export function writeLocalAppPreferences(preferences: AppPreferences) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(APP_PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
}

export function resolveThemePreference(theme: ThemePreference, prefersDark?: boolean): ResolvedTheme {
  if (theme === "light" || theme === "dark") {
    return theme;
  }

  return prefersDark ? "dark" : "light";
}

export function applyPreferencesToDocument(preferences: AppPreferences, resolvedTheme: ResolvedTheme) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.lang = preferences.locale;
  root.dataset.themePreference = preferences.theme;
  root.dataset.theme = resolvedTheme;
  root.style.colorScheme = resolvedTheme;
}

export async function getRemoteAppPreferences(userId: string) {
  if (!firebaseDb) {
    return null;
  }

  const snapshot = await getDoc(doc(firebaseDb, "users", userId));

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as { preferences?: Partial<AppPreferences> | null };
  return data.preferences ? normalizeAppPreferences(data.preferences) : null;
}

export async function saveRemoteAppPreferences(userId: string, preferences: AppPreferences) {
  if (!firebaseDb) {
    return;
  }

  await setDoc(
    doc(firebaseDb, "users", userId),
    {
      preferences
    },
    {
      merge: true
    }
  );
}

export function getPreferencesBootstrapScript() {
  return `
    (function () {
      var storageKey = "${APP_PREFERENCES_STORAGE_KEY}";
      var locale = "en";
      var theme = "system";

      try {
        var candidates = (navigator.languages || []).concat(navigator.language || "");
        if (candidates.some(function (entry) { return String(entry).toLowerCase().indexOf("vi") === 0; })) {
          locale = "vi";
        }

        var raw = window.localStorage.getItem(storageKey);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (parsed && (parsed.locale === "vi" || parsed.locale === "en")) {
            locale = parsed.locale;
          }
          if (parsed && (parsed.theme === "light" || parsed.theme === "dark" || parsed.theme === "system")) {
            theme = parsed.theme;
          }
        }
      } catch (error) {}

      var resolvedTheme = theme === "system"
        ? (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : theme;

      document.documentElement.lang = locale;
      document.documentElement.dataset.themePreference = theme;
      document.documentElement.dataset.theme = resolvedTheme;
      document.documentElement.style.colorScheme = resolvedTheme;
    })();
  `;
}
