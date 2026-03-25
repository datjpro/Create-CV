"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useAppContent } from "@/components/content/app-content-provider";
import { getMarketingCopy } from "@/lib/i18n/marketing";
import { saveMarketingContent } from "@/lib/services/admin-content-service";
import type { MarketingCopy } from "@/lib/admin/admin-content-types";
import type { Locale } from "@/lib/types";

function safeStringify(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export default function AdminMarketingPage() {
  const { marketing } = useAppContent();

  const defaults = useMemo(
    () => ({
      vi: getMarketingCopy("vi"),
      en: getMarketingCopy("en")
    }),
    []
  );

  const initial = useMemo(
    () => ({
      vi: marketing?.vi ?? defaults.vi,
      en: marketing?.en ?? defaults.en
    }),
    [defaults, marketing]
  );

  const [activeLocale, setActiveLocale] = useState<Locale>("vi");
  const [rawVi, setRawVi] = useState(() => safeStringify(initial.vi));
  const [rawEn, setRawEn] = useState(() => safeStringify(initial.en));
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");
  const dirtyRef = useRef(false);

  useEffect(() => {
    if (dirtyRef.current) {
      return;
    }

    setRawVi(safeStringify(initial.vi));
    setRawEn(safeStringify(initial.en));
  }, [initial]);

  async function handleSave() {
    setStatus("saving");
    setError("");

    try {
      const parsedVi = JSON.parse(rawVi) as MarketingCopy;
      const parsedEn = JSON.parse(rawEn) as MarketingCopy;

      await saveMarketingContent({
        vi: parsedVi,
        en: parsedEn
      });

      dirtyRef.current = false;
      setStatus("saved");
      window.setTimeout(() => setStatus("idle"), 1200);
    } catch (nextError) {
      setStatus("error");
      setError(nextError instanceof Error ? nextError.message : "Unable to save marketing content.");
    }
  }

  function handleResetDefaults() {
    dirtyRef.current = true;
    setRawVi(safeStringify(defaults.vi));
    setRawEn(safeStringify(defaults.en));
  }

  const raw = activeLocale === "vi" ? rawVi : rawEn;

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.26em] text-primary">Admin</div>
          <h1 className="mt-3 font-[var(--font-headline)] text-4xl font-extrabold tracking-tight text-on-surface">Marketing content</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-on-surface-variant">Edit the marketing copy shown on the home page and templates page. Stored in Firestore and applied live.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setActiveLocale("vi")} className={activeLocale === "vi" ? "rounded-xl bg-primary px-4 py-2 text-sm font-bold text-on-primary" : "rounded-xl bg-surface-container-high px-4 py-2 text-sm font-bold text-on-surface"}>VI</button>
          <button type="button" onClick={() => setActiveLocale("en")} className={activeLocale === "en" ? "rounded-xl bg-primary px-4 py-2 text-sm font-bold text-on-primary" : "rounded-xl bg-surface-container-high px-4 py-2 text-sm font-bold text-on-surface"}>EN</button>
          <button type="button" onClick={handleResetDefaults} className="rounded-xl bg-surface-container-high px-4 py-2 text-sm font-bold text-on-surface transition hover:bg-surface-container-highest">Reset to code defaults</button>
          <button type="button" onClick={handleSave} disabled={status === "saving"} className="premium-gradient rounded-xl px-5 py-2.5 text-sm font-bold text-on-primary transition hover:opacity-95 disabled:opacity-60">
            {status === "saving" ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {status === "saved" ? <div className="mt-6 rounded-2xl bg-secondary-container px-4 py-3 text-sm font-semibold text-on-surface">Saved.</div> : null}
      {status === "error" ? <div className="mt-6 rounded-2xl bg-error-container px-4 py-3 text-sm text-on-error-container">{error}</div> : null}

      <div className="mt-8 rounded-[2rem] bg-surface-container-low p-6 shadow-sm">
        <div className="text-xs font-bold uppercase tracking-[0.26em] text-primary">JSON ({activeLocale.toUpperCase()})</div>
        <textarea
          value={raw}
          onChange={(event) => {
            dirtyRef.current = true;
            if (activeLocale === "vi") {
              setRawVi(event.target.value);
            } else {
              setRawEn(event.target.value);
            }
          }}
          spellCheck={false}
          className="mt-4 h-[60vh] w-full resize-y rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 font-mono text-xs leading-6 text-on-surface outline-none focus:border-primary"
        />
      </div>
    </div>
  );
}
