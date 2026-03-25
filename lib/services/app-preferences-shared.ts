export const APP_PREFERENCES_STORAGE_KEY = "create-cv-app-preferences";

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
