"use client";

import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { firebaseDb } from "@/lib/firebase/client";
import type { MarketingContentDoc, TemplateConfig, TemplateMetaDoc } from "@/lib/admin/admin-content-types";
import type { TemplateId } from "@/lib/types";

function ensureDb() {
  if (!firebaseDb) {
    throw new Error("Firebase is not configured.");
  }

  return firebaseDb;
}

export async function saveMarketingContent(payload: { vi: MarketingContentDoc["vi"]; en: MarketingContentDoc["en"] }) {
  const db = ensureDb();
  await setDoc(
    doc(db, "site_content", "marketing"),
    {
      version: 1,
      updatedAt: serverTimestamp(),
      vi: payload.vi,
      en: payload.en
    } satisfies MarketingContentDoc,
    { merge: false }
  );
}

export async function saveTemplateMeta(templateId: TemplateId, payload: { vi: TemplateMetaDoc["vi"]; en: TemplateMetaDoc["en"] }) {
  const db = ensureDb();
  await setDoc(
    doc(db, "template_meta", templateId),
    {
      version: 1,
      updatedAt: serverTimestamp(),
      vi: payload.vi,
      en: payload.en
    } satisfies TemplateMetaDoc,
    { merge: false }
  );
}

export async function saveTemplateConfig(templateId: TemplateId, payload: Omit<TemplateConfig, "version" | "updatedAt">) {
  const db = ensureDb();
  await setDoc(
    doc(db, "template_config", templateId),
    {
      version: 1,
      updatedAt: serverTimestamp(),
      ...payload
    } satisfies TemplateConfig,
    { merge: false }
  );
}
