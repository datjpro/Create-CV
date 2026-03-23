import { cn } from "@/lib/utils";
import type { TemplateId } from "@/lib/types";

const previewMap: Record<TemplateId, { wrapper: string; accent: string; divider: string }> = {
  professional: {
    wrapper: "bg-white",
    accent: "bg-primary/10",
    divider: "bg-primary/20"
  },
  minimal: {
    wrapper: "bg-white",
    accent: "bg-surface-container-low",
    divider: "bg-outline-variant/30"
  },
  creative: {
    wrapper: "bg-white",
    accent: "bg-primary/10",
    divider: "bg-primary/25"
  }
};

export function TemplatePreview({ templateId, compact = false }: { templateId: TemplateId; compact?: boolean }) {
  const preview = previewMap[templateId];

  return (
    <div className={cn("flex h-full w-full flex-col overflow-hidden rounded-2xl border border-outline-variant/30", preview.wrapper)}>
      <div className="border-b border-outline-variant/20 p-5">
        <div className={cn("h-4 w-24 rounded-full", preview.divider)} />
        <div className="mt-3 h-2 w-2/3 rounded-full bg-surface-container-high" />
        <div className="mt-2 h-2 w-1/2 rounded-full bg-surface-container-high" />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          <div className={cn("h-2 w-20 rounded-full", preview.divider)} />
          <div className="h-2 w-full rounded-full bg-surface-container" />
          <div className="h-2 w-11/12 rounded-full bg-surface-container" />
        </div>
        <div className={cn("rounded-xl p-4", preview.accent)}>
          <div className={cn("h-2 w-24 rounded-full", preview.divider)} />
          <div className="mt-3 h-2 w-full rounded-full bg-white/60" />
          <div className="mt-2 h-2 w-10/12 rounded-full bg-white/60" />
        </div>
        <div className="space-y-2">
          <div className={cn("h-2 w-24 rounded-full", preview.divider)} />
          <div className="h-12 rounded-xl bg-surface-container-low" />
        </div>
        <div className="space-y-2">
          <div className={cn("h-2 w-16 rounded-full", preview.divider)} />
          <div className="h-10 rounded-xl bg-surface-container-low" />
        </div>
        {!compact ? <div className="mt-auto h-3 w-full rounded-full bg-surface-container-low" /> : null}
      </div>
    </div>
  );
}
