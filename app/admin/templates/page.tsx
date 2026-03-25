"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { TemplatePreview } from "@/components/marketing/template-preview";
import { useAppContent } from "@/components/content/app-content-provider";
import { useTemplateCatalog } from "@/components/templates/template-catalog-provider";
import type { TemplateMetaCopy } from "@/lib/admin/admin-content-types";
import { getTemplateMetaCopy } from "@/lib/i18n/template-meta";
import { saveTemplateConfig, saveTemplateMeta } from "@/lib/services/admin-content-service";
import type { CareerStage, IndustryFocus, Locale, TemplateId } from "@/lib/types";

const INDUSTRIES: IndustryFocus[] = ["general", "it", "marketing", "finance"];
const CAREER_STAGES: CareerStage[] = ["student", "under_3_years", "3_plus_years"];

function toNullableNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

function asNumber(value: string, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function labelIndustry(value: IndustryFocus) {
  switch (value) {
    case "general":
      return "General";
    case "it":
      return "IT";
    case "marketing":
      return "Marketing";
    case "finance":
      return "Finance";
  }
}

function labelCareerStage(value: CareerStage) {
  switch (value) {
    case "student":
      return "Student";
    case "under_3_years":
      return "< 3 years";
    case "3_plus_years":
      return "3+ years";
  }
}

function toggleInList<T extends string>(items: T[], value: T) {
  return items.includes(value) ? items.filter((item) => item !== value) : [...items, value];
}

type TemplateMetaShape = TemplateMetaCopy;

type TemplateMetaDraft = {
  category: string;
  name: string;
  hook: string;
  description: string;
  badge: string;
  featuredCopy: string;
  atsReadabilityLevel: string;
  layoutStyle: string;
  notes: string;
};

function draftFromMeta(meta: TemplateMetaShape): TemplateMetaDraft {
  return {
    category: meta.category,
    name: meta.name,
    hook: meta.hook,
    description: meta.description,
    badge: meta.badge ?? "",
    featuredCopy: meta.featuredCopy,
    atsReadabilityLevel: meta.atsReadabilityLevel,
    layoutStyle: meta.layoutStyle,
    notes: meta.notes
  };
}

function metaFromDraft(draft: TemplateMetaDraft) {
  return {
    category: draft.category,
    name: draft.name,
    hook: draft.hook,
    description: draft.description,
    badge: draft.badge.trim() ? draft.badge.trim() : undefined,
    featuredCopy: draft.featuredCopy,
    atsReadabilityLevel: draft.atsReadabilityLevel,
    layoutStyle: draft.layoutStyle,
    notes: draft.notes
  };
}

function TemplateAdminCard({ templateId }: { templateId: TemplateId }) {
  const { templateMeta, templateConfig } = useAppContent();
  const baseVi = useMemo(() => getTemplateMetaCopy("vi")[templateId] as TemplateMetaCopy, [templateId]);
  const baseEn = useMemo(() => getTemplateMetaCopy("en")[templateId] as TemplateMetaCopy, [templateId]);

  const remoteMeta = templateMeta[templateId];
  const remoteConfig = templateConfig[templateId];

  const [activeLocale, setActiveLocale] = useState<Locale>("vi");
  const [enabled, setEnabled] = useState(true);
  const [featuredRank, setFeaturedRank] = useState<string>("");
  const [sortRank, setSortRank] = useState<string>("");
  const [bestForIndustries, setBestForIndustries] = useState<IndustryFocus[]>([]);
  const [recommendedCareerStages, setRecommendedCareerStages] = useState<CareerStage[]>([]);

  const [viDraft, setViDraft] = useState<TemplateMetaDraft>(() => draftFromMeta(baseVi));
  const [enDraft, setEnDraft] = useState<TemplateMetaDraft>(() => draftFromMeta(baseEn));

  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");
  const dirtyRef = useRef(false);

  useEffect(() => {
    if (dirtyRef.current) {
      return;
    }

    setEnabled(remoteConfig?.enabled ?? true);
    setFeaturedRank(remoteConfig?.featuredRank == null ? "" : String(remoteConfig.featuredRank));
    setSortRank(typeof remoteConfig?.sortRank === "number" ? String(remoteConfig.sortRank) : "");
    setBestForIndustries(remoteConfig?.bestForIndustries ?? []);
    setRecommendedCareerStages(remoteConfig?.recommendedCareerStages ?? []);

    setViDraft(draftFromMeta(remoteMeta?.vi ?? baseVi));
    setEnDraft(draftFromMeta(remoteMeta?.en ?? baseEn));
  }, [baseEn, baseVi, remoteConfig, remoteMeta]);

  async function handleSave() {
    setStatus("saving");
    setError("");

    try {
      await saveTemplateConfig(templateId, {
        enabled,
        featuredRank: toNullableNumber(featuredRank),
        sortRank: asNumber(sortRank, 0),
        bestForIndustries: bestForIndustries.length ? bestForIndustries : undefined,
        recommendedCareerStages: recommendedCareerStages.length ? recommendedCareerStages : undefined
      });

      await saveTemplateMeta(templateId, {
        vi: metaFromDraft(viDraft),
        en: metaFromDraft(enDraft)
      });

      dirtyRef.current = false;
      setStatus("saved");
      window.setTimeout(() => setStatus("idle"), 1200);
    } catch (nextError) {
      setStatus("error");
      setError(nextError instanceof Error ? nextError.message : "Unable to save template.");
    }
  }

  const draft = activeLocale === "vi" ? viDraft : enDraft;
  const setDraft = activeLocale === "vi" ? setViDraft : setEnDraft;

  return (
    <div className="rounded-[2rem] bg-surface-container-low p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-5">
          <div className="h-28 w-24 overflow-hidden rounded-2xl bg-surface-container-lowest p-2">
            <TemplatePreview templateId={templateId} compact />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.26em] text-primary">{templateId}</div>
            <div className="mt-2 font-[var(--font-headline)] text-2xl font-extrabold tracking-tight text-on-surface">{draft.name}</div>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant">{draft.hook}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setActiveLocale("vi")} className={activeLocale === "vi" ? "rounded-xl bg-primary px-4 py-2 text-sm font-bold text-on-primary" : "rounded-xl bg-surface-container-high px-4 py-2 text-sm font-bold text-on-surface"}>VI</button>
          <button type="button" onClick={() => setActiveLocale("en")} className={activeLocale === "en" ? "rounded-xl bg-primary px-4 py-2 text-sm font-bold text-on-primary" : "rounded-xl bg-surface-container-high px-4 py-2 text-sm font-bold text-on-surface"}>EN</button>
          <button type="button" onClick={handleSave} disabled={status === "saving"} className="premium-gradient rounded-xl px-5 py-2.5 text-sm font-bold text-on-primary transition hover:opacity-95 disabled:opacity-60">
            {status === "saving" ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {status === "saved" ? <div className="mt-4 rounded-2xl bg-secondary-container px-4 py-3 text-sm font-semibold text-on-surface">Saved.</div> : null}
      {status === "error" ? <div className="mt-4 rounded-2xl bg-error-container px-4 py-3 text-sm text-on-error-container">{error}</div> : null}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-surface-container-lowest p-4">
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Visibility</div>
          <label className="mt-3 flex items-center justify-between gap-3 text-sm font-semibold text-on-surface">
            Enabled
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => {
                dirtyRef.current = true;
                setEnabled(e.target.checked);
              }}
              className="h-5 w-5"
            />
          </label>
        </div>
        <div className="rounded-2xl bg-surface-container-lowest p-4">
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Ordering</div>
          <label className="mt-3 block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">Sort rank</label>
          <input
            value={sortRank}
            onChange={(e) => {
              dirtyRef.current = true;
              setSortRank(e.target.value);
            }}
            placeholder="0"
            className="mt-2 w-full rounded-xl border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
          />
          <label className="mt-4 block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">Featured rank</label>
          <input
            value={featuredRank}
            onChange={(e) => {
              dirtyRef.current = true;
              setFeaturedRank(e.target.value);
            }}
            placeholder="(blank)"
            className="mt-2 w-full rounded-xl border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
          />
        </div>
        <div className="rounded-2xl bg-surface-container-lowest p-4">
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Tags</div>
          <div className="mt-3 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">Best for industries</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {INDUSTRIES.map((industry) => (
              <button
                key={industry}
                type="button"
                onClick={() => {
                  dirtyRef.current = true;
                  setBestForIndustries((current) => toggleInList(current, industry));
                }}
                className={bestForIndustries.includes(industry) ? "rounded-full bg-primary px-3 py-1 text-xs font-bold text-on-primary" : "rounded-full bg-surface-container-high px-3 py-1 text-xs font-bold text-on-surface"}
              >
                {labelIndustry(industry)}
              </button>
            ))}
          </div>
          <div className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">Recommended career stages</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {CAREER_STAGES.map((stage) => (
              <button
                key={stage}
                type="button"
                onClick={() => {
                  dirtyRef.current = true;
                  setRecommendedCareerStages((current) => toggleInList(current, stage));
                }}
                className={recommendedCareerStages.includes(stage) ? "rounded-full bg-primary px-3 py-1 text-xs font-bold text-on-primary" : "rounded-full bg-surface-container-high px-3 py-1 text-xs font-bold text-on-surface"}
              >
                {labelCareerStage(stage)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-surface-container-lowest p-5">
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Template meta ({activeLocale.toUpperCase()})</div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">Category</label>
            <input
              value={draft.category}
              onChange={(e) => {
                dirtyRef.current = true;
                setDraft((cur) => ({ ...cur, category: e.target.value }));
              }}
              className="mt-2 w-full rounded-xl border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">Name</label>
            <input
              value={draft.name}
              onChange={(e) => {
                dirtyRef.current = true;
                setDraft((cur) => ({ ...cur, name: e.target.value }));
              }}
              className="mt-2 w-full rounded-xl border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">Hook</label>
            <input
              value={draft.hook}
              onChange={(e) => {
                dirtyRef.current = true;
                setDraft((cur) => ({ ...cur, hook: e.target.value }));
              }}
              className="mt-2 w-full rounded-xl border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">Description</label>
            <textarea
              value={draft.description}
              onChange={(e) => {
                dirtyRef.current = true;
                setDraft((cur) => ({ ...cur, description: e.target.value }));
              }}
              rows={3}
              className="mt-2 w-full rounded-xl border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">Badge (optional)</label>
            <input
              value={draft.badge}
              onChange={(e) => {
                dirtyRef.current = true;
                setDraft((cur) => ({ ...cur, badge: e.target.value }));
              }}
              className="mt-2 w-full rounded-xl border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">ATS label</label>
            <input
              value={draft.atsReadabilityLevel}
              onChange={(e) => {
                dirtyRef.current = true;
                setDraft((cur) => ({ ...cur, atsReadabilityLevel: e.target.value }));
              }}
              className="mt-2 w-full rounded-xl border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">Layout style</label>
            <input
              value={draft.layoutStyle}
              onChange={(e) => {
                dirtyRef.current = true;
                setDraft((cur) => ({ ...cur, layoutStyle: e.target.value }));
              }}
              className="mt-2 w-full rounded-xl border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">Featured copy</label>
            <textarea
              value={draft.featuredCopy}
              onChange={(e) => {
                dirtyRef.current = true;
                setDraft((cur) => ({ ...cur, featuredCopy: e.target.value }));
              }}
              rows={3}
              className="mt-2 w-full rounded-xl border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">Notes</label>
            <textarea
              value={draft.notes}
              onChange={(e) => {
                dirtyRef.current = true;
                setDraft((cur) => ({ ...cur, notes: e.target.value }));
              }}
              rows={2}
              className="mt-2 w-full rounded-xl border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminTemplatesPage() {
  const { allTemplates } = useTemplateCatalog();

  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-[0.26em] text-primary">Admin</div>
      <h1 className="mt-3 font-[var(--font-headline)] text-4xl font-extrabold tracking-tight text-on-surface">Templates</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-on-surface-variant">Manage visibility, ordering, tags, and locale copy for each built-in template.</p>

      <div className="mt-8 grid gap-6">
        {allTemplates.map((template) => (
          <TemplateAdminCard key={template.id} templateId={template.id} />
        ))}
      </div>
    </div>
  );
}
