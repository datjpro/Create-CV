import { MarketingResumeLink } from "@/components/marketing/marketing-auth-link";
import { cn } from "@/lib/utils";
import type { TemplatePreset } from "@/lib/template-library";

import { TemplatePreview } from "./template-preview";

export function TemplateCard({ template, featured = false }: { template: TemplatePreset; featured?: boolean }) {
  return (
    <div
      className={cn(
        "group rounded-[2rem] bg-surface-container-low p-4 transition duration-300 hover:-translate-y-1 hover:shadow-float",
        featured && "lg:col-span-2"
      )}
    >
      <div className={cn("overflow-hidden rounded-[1.5rem] bg-surface-container-lowest p-4", featured ? "aspect-[21/9]" : "aspect-[3/4]")}>
        <TemplatePreview templateId={template.id} compact={!featured} />
      </div>
      <div className="flex items-end justify-between gap-4 px-2 pb-2 pt-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-black uppercase tracking-[0.28em] text-primary-container">{template.category}</span>
            {template.badge ? (
              <span className="rounded-full bg-tertiary-fixed px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-tertiary">
                {template.badge}
              </span>
            ) : null}
          </div>
          <h3 className={cn("mt-2 font-[var(--font-headline)] font-extrabold tracking-tight text-on-surface", featured ? "text-3xl" : "text-2xl")}>
            {template.name}
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-on-surface-variant">{featured ? template.featuredCopy : template.description}</p>
        </div>
        <MarketingResumeLink
          templateId={template.id}
          className="premium-gradient shrink-0 rounded-2xl px-5 py-3 text-sm font-bold text-on-primary transition hover:opacity-95"
        >
          Use template
        </MarketingResumeLink>
      </div>
    </div>
  );
}
