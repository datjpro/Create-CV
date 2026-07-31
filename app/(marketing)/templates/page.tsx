"use client";

import { useMemo, useState } from "react";
import { MarketingResumeLink } from "@/components/marketing/marketing-auth-link";
import { TemplateCard } from "@/components/marketing/template-card";
import { TemplatePreview } from "@/components/marketing/template-preview";
import { useI18n } from "@/components/settings/use-i18n";
import { useTemplateCatalog } from "@/components/templates/template-catalog-provider";
import { cn } from "@/lib/utils";

export default function TemplatesPage() {
  const { copy, locale } = useI18n();
  const { publicTemplates, featuredTemplates } = useTemplateCatalog();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = useMemo(() => {
    const set = new Set<string>();
    publicTemplates.forEach((t) => set.add(t.category));
    return Array.from(set);
  }, [publicTemplates]);

  const filteredTemplates = useMemo(() => {
    return publicTemplates.filter((template) => {
      const matchesCategory = selectedCategory === "all" || template.category.toLowerCase() === selectedCategory.toLowerCase();
      const meta = copy.templateMeta[template.id];
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        template.name.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query) ||
        (meta?.name && meta.name.toLowerCase().includes(query)) ||
        (meta?.description && meta.description.toLowerCase().includes(query)) ||
        (meta?.hook && meta.hook.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [publicTemplates, selectedCategory, searchQuery, copy.templateMeta]);

  const featured = featuredTemplates[0] ?? publicTemplates[0] ?? null;
  const showFeaturedSpotlight = selectedCategory === "all" && !searchQuery.trim();

  return (
    <main className="px-6 pb-24 pt-16 sm:px-8 sm:pt-24">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12">
          <span className="text-sm font-bold uppercase tracking-[0.28em] text-primary">{copy.marketing.templatesPage.eyebrow}</span>
          <h1 className="mt-4 font-[var(--font-headline)] text-5xl font-extrabold tracking-tight text-primary sm:text-6xl">{copy.marketing.templatesPage.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-on-surface-variant">{copy.marketing.templatesPage.description}</p>
        </header>

        <section className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-semibold transition",
                selectedCategory === "all"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
              )}
            >
              {copy.marketing.templatesPage.filterAll} ({publicTemplates.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "rounded-full px-5 py-2.5 text-sm font-semibold transition",
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={locale === "vi" ? "Tìm kiếm mẫu CV..." : "Search templates..."}
                className="w-full rounded-2xl border border-outline-variant/40 bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant hover:text-on-surface"
                >
                  ✕
                </button>
              ) : null}
            </div>

            <MarketingResumeLink templateId="professional" className="shrink-0 rounded-2xl bg-surface-container-high px-5 py-2.5 text-sm font-bold text-on-surface transition hover:bg-surface-container-highest">
              {copy.marketing.templatesPage.startRecommended}
            </MarketingResumeLink>
          </div>
        </section>

        {filteredTemplates.length === 0 ? (
          <div className="rounded-[2rem] border border-outline-variant/30 bg-surface-container-low p-12 text-center">
            <p className="text-lg font-bold text-on-surface">{locale === "vi" ? "Không tìm thấy mẫu CV phù hợp." : "No matching templates found."}</p>
            <p className="mt-2 text-sm text-on-surface-variant">{locale === "vi" ? "Thử đổi từ khóa hoặc chọn tất cả danh mục." : "Try clearing your search or switching categories."}</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="mt-6 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-on-primary"
            >
              {locale === "vi" ? "Xem tất cả mẫu CV" : "View all templates"}
            </button>
          </div>
        ) : (
          <section className="grid gap-8 lg:grid-cols-3">
            {showFeaturedSpotlight && featured && filteredTemplates.some((t) => t.id === featured.id) ? (
              <>
                <TemplateCard template={featured} featured />
                {filteredTemplates
                  .filter((t) => t.id !== featured.id)
                  .map((template) => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
              </>
            ) : (
              filteredTemplates.map((template) => <TemplateCard key={template.id} template={template} />)
            )}
          </section>
        )}

        <section className="mt-24 overflow-hidden rounded-[2.5rem] premium-gradient px-10 py-12 text-on-primary sm:px-12">
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.26em]">{copy.marketing.templatesPage.signatureEyebrow}</span>
              <h2 className="mt-6 font-[var(--font-headline)] text-4xl font-extrabold tracking-tight sm:text-5xl">{copy.marketing.templatesPage.signatureTitle}</h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-primary-fixed">{copy.marketing.templatesPage.signatureDescription}</p>
              <MarketingResumeLink templateId="professional" className="mt-8 inline-flex rounded-2xl bg-white px-6 py-3 font-bold text-primary transition hover:bg-primary-fixed">
                {copy.marketing.templatesPage.signatureCta}
              </MarketingResumeLink>
            </div>
            <div className="rounded-[2rem] bg-white/10 p-6 backdrop-blur-md">
              <div className="aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-white p-5 shadow-float">
                <TemplatePreview templateId="professional" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

