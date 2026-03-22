import { cn } from "@/lib/utils";
import type { TemplateId } from "@/lib/types";

const previewMap: Record<TemplateId, { wrapper: string; accent: string }> = {
  professional: {
    wrapper: "bg-white",
    accent: "bg-primary/10"
  },
  minimal: {
    wrapper: "bg-white",
    accent: "bg-surface-container-low"
  },
  creative: {
    wrapper: "bg-surface-container-lowest",
    accent: "bg-primary text-white"
  }
};

export function TemplatePreview({ templateId, compact = false }: { templateId: TemplateId; compact?: boolean }) {
  const preview = previewMap[templateId];

  if (templateId === "creative") {
    return (
      <div className={cn("flex h-full w-full flex-col overflow-hidden rounded-2xl shadow-sm", preview.wrapper)}>
        <div className="grid h-full grid-cols-[0.9fr_1.4fr]">
          <div className="premium-gradient flex flex-col gap-4 p-5 text-on-primary">
            <div className="h-14 w-14 rounded-full bg-white/20" />
            <div className="space-y-2">
              <div className="h-3 w-16 rounded-full bg-white/60" />
              <div className="h-2 w-full rounded-full bg-white/25" />
              <div className="h-2 w-10/12 rounded-full bg-white/20" />
            </div>
            <div className="mt-auto space-y-2">
              <div className="h-2 w-10/12 rounded-full bg-white/30" />
              <div className="h-2 w-8/12 rounded-full bg-white/20" />
            </div>
          </div>
          <div className="flex flex-col gap-4 p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-4 w-24 rounded-full bg-primary/15" />
                <div className="h-2 w-32 rounded-full bg-surface-container-high" />
              </div>
              <div className="h-8 w-8 rounded-lg bg-primary/15" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-20 rounded-xl bg-surface-container-low" />
              <div className="h-20 rounded-xl bg-surface-container-low" />
            </div>
            <div className="h-24 rounded-xl bg-surface-container-low" />
          </div>
        </div>
      </div>
    );
  }

  if (templateId === "minimal") {
    return (
      <div className={cn("flex h-full w-full flex-col overflow-hidden rounded-2xl border border-outline-variant/40", preview.wrapper)}>
        <div className="border-b border-outline-variant/30 p-5">
          <div className="h-4 w-24 rounded-full bg-primary/15" />
          <div className="mt-3 h-2 w-2/3 rounded-full bg-surface-container-high" />
        </div>
        <div className="flex flex-1 flex-col gap-4 p-5">
          <div className="space-y-2">
            <div className="h-2 w-16 rounded-full bg-primary/20" />
            <div className="h-2 w-full rounded-full bg-surface-container" />
            <div className="h-2 w-10/12 rounded-full bg-surface-container" />
          </div>
          <div className="space-y-2">
            <div className="h-2 w-20 rounded-full bg-primary/20" />
            <div className="h-16 rounded-xl bg-surface-container-low" />
          </div>
          <div className={cn("mt-auto h-10 rounded-xl", preview.accent)} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex h-full w-full flex-col overflow-hidden rounded-2xl border border-outline-variant/40", preview.wrapper)}>
      <div className={cn("p-4", preview.accent)}>
        <div className="h-3 w-24 rounded-full bg-primary/20" />
      </div>
      <div className="grid flex-1 grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-col gap-4 p-5">
          <div className="space-y-2">
            <div className="h-2 w-16 rounded-full bg-primary/25" />
            <div className="h-2 w-full rounded-full bg-surface-container" />
            <div className="h-2 w-11/12 rounded-full bg-surface-container" />
          </div>
          <div className="h-20 rounded-xl bg-surface-container-low" />
          <div className="h-16 rounded-xl bg-surface-container-low" />
        </div>
        <div className="border-l border-outline-variant/20 bg-surface-container-low p-5">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary-fixed" />
          <div className="mt-5 space-y-2">
            <div className="h-2 w-full rounded-full bg-primary/15" />
            <div className="h-2 w-10/12 rounded-full bg-primary/15" />
            <div className="h-2 w-8/12 rounded-full bg-primary/15" />
          </div>
        </div>
      </div>
      {!compact ? <div className="h-3 w-full bg-surface-container-low" /> : null}
    </div>
  );
}
