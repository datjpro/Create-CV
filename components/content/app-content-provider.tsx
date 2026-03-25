"use client";

import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";

import { firebaseDb } from "@/lib/firebase/client";
import type { MarketingContentDoc, TemplateConfig, TemplateMetaDoc } from "@/lib/admin/admin-content-types";
import type { TemplateId } from "@/lib/types";

type AppContentValue = {
  marketing: MarketingContentDoc | null;
  templateMeta: Partial<Record<TemplateId, TemplateMetaDoc>>;
  templateConfig: Partial<Record<TemplateId, TemplateConfig>>;
};

const AppContentContext = createContext<AppContentValue | null>(null);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function looksLikeMarketingDoc(value: unknown): value is MarketingContentDoc {
  if (!isRecord(value)) {
    return false;
  }

  return value.version === 1 && isRecord(value.vi) && isRecord(value.en);
}

function looksLikeTemplateMetaDoc(value: unknown): value is TemplateMetaDoc {
  if (!isRecord(value)) {
    return false;
  }

  return value.version === 1 && isRecord(value.vi) && isRecord(value.en);
}

function looksLikeTemplateConfig(value: unknown): value is TemplateConfig {
  if (!isRecord(value)) {
    return false;
  }

  if (value.version !== 1) {
    return false;
  }

  return typeof value.enabled === "boolean" && (typeof value.sortRank === "number" || typeof value.sortRank === "bigint");
}

export function AppContentProvider({ children }: PropsWithChildren) {
  const [marketing, setMarketing] = useState<MarketingContentDoc | null>(null);
  const [templateMeta, setTemplateMeta] = useState<Partial<Record<TemplateId, TemplateMetaDoc>>>({});
  const [templateConfig, setTemplateConfig] = useState<Partial<Record<TemplateId, TemplateConfig>>>({});

  useEffect(() => {
    if (!firebaseDb) {
      return;
    }

    const ref = doc(firebaseDb, "site_content", "marketing");
    return onSnapshot(
      ref,
      (snap) => {
        const data = snap.data();
        if (looksLikeMarketingDoc(data)) {
          setMarketing(data);
        }
      },
      () => {
        // Public content should not block the app.
      }
    );
  }, []);

  useEffect(() => {
    if (!firebaseDb) {
      return;
    }

    const ref = collection(firebaseDb, "template_meta");
    return onSnapshot(
      ref,
      (snapshot) => {
        const next: Partial<Record<TemplateId, TemplateMetaDoc>> = {};

        snapshot.forEach((docSnap) => {
          const id = docSnap.id as TemplateId;
          const data = docSnap.data();
          if (looksLikeTemplateMetaDoc(data)) {
            next[id] = data;
          }
        });

        setTemplateMeta(next);
      },
      () => {
        // Ignore permission failures until rules are deployed.
      }
    );
  }, []);

  useEffect(() => {
    if (!firebaseDb) {
      return;
    }

    const ref = collection(firebaseDb, "template_config");
    return onSnapshot(
      ref,
      (snapshot) => {
        const next: Partial<Record<TemplateId, TemplateConfig>> = {};

        snapshot.forEach((docSnap) => {
          const id = docSnap.id as TemplateId;
          const data = docSnap.data();
          if (looksLikeTemplateConfig(data)) {
            next[id] = {
              ...data,
              sortRank: Number(data.sortRank)
            } as TemplateConfig;
          }
        });

        setTemplateConfig(next);
      },
      () => {
        // Ignore permission failures until rules are deployed.
      }
    );
  }, []);

  const value = useMemo<AppContentValue>(
    () => ({
      marketing,
      templateMeta,
      templateConfig
    }),
    [marketing, templateMeta, templateConfig]
  );

  return <AppContentContext.Provider value={value}>{children}</AppContentContext.Provider>;
}

export function useAppContent() {
  const context = useContext(AppContentContext);

  if (!context) {
    throw new Error("useAppContent must be used within AppContentProvider");
  }

  return context;
}
