import { clsx, type ClassValue } from "clsx";

import type { Locale } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function toIntlLocale(locale: Locale) {
  return locale === "vi" ? "vi-VN" : "en-US";
}

export function formatUpdatedAt(timestamp: number, locale: Locale = "en") {
  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(timestamp);
}

export function formatDateRange(startDate: string, endDate: string, current?: boolean) {
  if (!startDate && !endDate) {
    return "";
  }

  const start = startDate || "";
  const end = current ? "Present" : endDate || "";

  return [start, end].filter(Boolean).join(" - ");
}

export function slugifyTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

