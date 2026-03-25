"use client";

import { TemplatePreview } from "@/components/marketing/template-preview";
import { useI18n } from "@/components/settings/use-i18n";
import { useTemplateCatalog } from "@/components/templates/template-catalog-provider";
import { getIndustryFocusLabel } from "@/lib/resume-metadata";
import type { TemplateId } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TemplateSwitcher({
  selectedTemplate,
  onSelect
}: {
  selectedTemplate: TemplateId;
  onSelect: (templateId: TemplateId) => void;
}) {
  const { locale, copy } = useI18n();
  const { allTemplates } = useTemplateCatalog();

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {allTemplates.map((template) => {
        const templateCopy = copy.templateMeta[template.id];
        const disabled = !template.enabled;

        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template.id)}
            className={cn(
              "rounded-[1.5rem] border p-3 text-left transition",
              selectedTemplate === template.id
                ? "border-primary bg-primary-fixed/40 shadow-sm"
                : "border-outline-variant/20 bg-surface-container-low hover:border-primary/40 hover:bg-surface-container-high"
            )}
          >
            <div className="aspect-[4/5] overflow-hidden rounded-[1rem] bg-surface-container-lowest p-3">
              <TemplatePreview templateId={template.id} compact />
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">{templateCopy.category}</div>
                {disabled ? (
                  <span className="rounded-full bg-error-container px-2 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-on-error-container">
                    {locale === "vi" ? "?ang ?n" : "Hidden"}
                  </span>
                ) : null}
              </div>
              <div className="mt-1 font-[var(--font-headline)] text-lg font-extrabold text-on-surface">{templateCopy.name}</div>
              <p className="mt-1 text-xs leading-5 text-on-surface-variant">{templateCopy.hook}</p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">{templateCopy.layoutStyle}</p>
              <p className="mt-2 text-xs leading-5 text-on-surface-variant">
                {copy.common.bestFor} {template.bestForIndustries.map((industry) => getIndustryFocusLabel(industry, locale)).join(", ")}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
