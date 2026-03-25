import type { Locale } from "@/lib/types";
import { getAuthCopy } from "@/lib/i18n/auth";
import { getCommonCopy } from "@/lib/i18n/common";
import { getDashboardCopy } from "@/lib/i18n/dashboard";
import { getEditorCopy } from "@/lib/i18n/editor";
import { getMarketingCopy } from "@/lib/i18n/marketing";
import { getNewResumeCopy } from "@/lib/i18n/new-resume";
import { getResumeMetaCopy } from "@/lib/i18n/resume-meta";
import { getSettingsCopy } from "@/lib/i18n/settings";
import { getTemplateMetaCopy } from "@/lib/i18n/template-meta";

export function getDictionary(locale: Locale) {
  return {
    common: getCommonCopy(locale),
    marketing: getMarketingCopy(locale),
    auth: getAuthCopy(locale),
    dashboard: getDashboardCopy(locale),
    newResume: getNewResumeCopy(locale),
    settings: getSettingsCopy(locale),
    editor: getEditorCopy(locale),
    templateMeta: getTemplateMetaCopy(locale),
    resumeMeta: getResumeMetaCopy(locale)
  };
}

