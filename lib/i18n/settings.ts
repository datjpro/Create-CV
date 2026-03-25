import type { Locale, ThemePreference } from "@/lib/types";

export function getSettingsCopy(locale: Locale) {
  const localeOptions: Record<Locale, { vi: string; en: string }> = {
    en: { vi: "Tiếng Việt", en: "English" },
    vi: { vi: "Tiếng Việt", en: "English" }
  };

  const themeOptions: Record<Locale, Record<ThemePreference, string>> = {
    en: { light: "Light", dark: "Dark", system: "System" },
    vi: { light: "Sáng", dark: "Tối", system: "Theo hệ thống" }
  };

  const compactThemeOptions: Record<Locale, Record<ThemePreference, string>> = {
    en: { light: "Light", dark: "Dark", system: "Auto" },
    vi: { light: "Sáng", dark: "Tối", system: "Tự động" }
  };

  return locale === "vi"
    ? {
        title: "Tùy chọn workspace",
        subtitle: "Chọn giao diện hiển thị và ngôn ngữ bạn muốn dùng trên trang marketing, auth, dashboard và editor.",
        languageTitle: "Ngôn ngữ",
        languageDescription:
          "Chuyển giao diện ứng dụng giữa tiếng Việt và tiếng Anh. Nội dung resume của bạn vẫn được giữ nguyên như đã nhập.",
        currentLocale: "Ngôn ngữ hiện tại",
        localeOptions: localeOptions.vi,
        themeTitle: "Giao diện",
        themeDescription: "Chọn giao diện sáng, tối cố định hoặc tự động theo hệ điều hành.",
        activeMode: "Chế độ đang áp dụng",
        themeOptions: themeOptions.vi,
        compactThemeOptions: compactThemeOptions.vi,
        syncTitle: "Cách đồng bộ",
        syncDescription: "Tùy chọn được lưu ngay ở máy này và có thể đồng bộ lên tài khoản khi Firebase đang hoạt động.",
        syncFirebase: "Ngôn ngữ và giao diện của bạn được lưu ở trình duyệt này và đồng bộ với tài khoản đã đăng nhập.",
        syncDemo: "Demo mode đang bật nên tùy chọn chỉ được lưu trong trình duyệt này.",
        loadingSaved: "Đang tải tùy chọn đã lưu...",
        systemResolved: { light: "Sáng", dark: "Tối" },
        languageAria: "Ngôn ngữ",
        themeAria: "Giao diện"
      }
    : {
        title: "Workspace preferences",
        subtitle:
          "Choose how the app looks and which interface language you want to use across marketing pages, auth, dashboard and editor.",
        languageTitle: "Language",
        languageDescription:
          "Switch the app interface between Vietnamese and English. Your resume content stays exactly as you wrote it.",
        currentLocale: "Current locale",
        localeOptions: localeOptions.en,
        themeTitle: "Theme",
        themeDescription: "Choose a fixed light or dark appearance, or follow your operating system automatically.",
        activeMode: "Active mode",
        themeOptions: themeOptions.en,
        compactThemeOptions: compactThemeOptions.en,
        syncTitle: "Sync behavior",
        syncDescription: "Preferences are remembered locally right away and optionally synced to your account when Firebase is active.",
        syncFirebase: "Your language and theme preferences are saved to this browser and synced to your signed-in account.",
        syncDemo: "Demo mode is active, so preferences are stored in this browser only.",
        loadingSaved: "Loading saved preferences...",
        systemResolved: { light: "Light", dark: "Dark" },
        languageAria: "Language",
        themeAria: "Theme"
      };
}
