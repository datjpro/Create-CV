import { cn } from "@/lib/utils";
import type { TemplateId } from "@/lib/types";

function StandardPreview({
  accent,
  divider,
  highlight,
  dense = false,
  showcase = false
}: {
  accent: string;
  divider: string;
  highlight: string;
  dense?: boolean;
  showcase?: boolean;
}) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-outline-variant/30 bg-white">
      <div className="border-b border-outline-variant/20 p-4">
        <div className={cn("h-4 rounded-full", divider, showcase ? "w-32" : "w-24")} />
        <div className="mt-3 h-2 w-2/3 rounded-full bg-surface-container-high" />
        <div className="mt-2 h-2 w-1/2 rounded-full bg-surface-container-high" />
      </div>
      <div className={cn("flex flex-1 flex-col p-4", dense ? "gap-2.5" : "gap-4")}>
        <div className="space-y-2">
          <div className={cn("h-2 w-24 rounded-full", divider)} />
          <div className="h-2 w-full rounded-full bg-surface-container" />
          <div className="h-2 w-10/12 rounded-full bg-surface-container" />
        </div>
        <div className={cn("rounded-xl p-3", accent)}>
          <div className={cn("h-2 w-24 rounded-full", divider)} />
          <div className="mt-3 h-2 w-full rounded-full bg-white/70" />
          <div className="mt-2 h-2 w-11/12 rounded-full bg-white/70" />
        </div>
        {showcase ? (
          <div className="grid flex-1 gap-3 md:grid-cols-2">
            <div className={cn("rounded-xl p-3", highlight)}>
              <div className={cn("h-2 w-20 rounded-full", divider)} />
              <div className="mt-3 h-2 w-full rounded-full bg-surface-container-lowest/70" />
              <div className="mt-2 h-2 w-10/12 rounded-full bg-surface-container-lowest/70" />
            </div>
            <div className="rounded-xl bg-surface-container-low p-3">
              <div className={cn("h-2 w-16 rounded-full", divider)} />
              <div className="mt-3 h-2 w-full rounded-full bg-surface-container" />
              <div className="mt-2 h-2 w-9/12 rounded-full bg-surface-container" />
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className={cn("h-2 w-24 rounded-full", divider)} />
              <div className="h-10 rounded-xl bg-surface-container-low" />
            </div>
            <div className="space-y-2">
              <div className={cn("h-2 w-16 rounded-full", divider)} />
              <div className="h-12 rounded-xl bg-surface-container-low" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DarkPortfolioPreview() {
  return (
    <div className="flex h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-[#121212] text-white">
      <div className="flex w-[38%] flex-col gap-3 border-r border-white/10 p-4">
        <div className="mx-auto h-20 w-16 rounded-xl bg-white/90" />
        <div className="h-3 w-4/5 rounded-full bg-white/90" />
        <div className="h-2 w-3/5 rounded-full bg-white/35" />
        <div className="space-y-2 pt-2">
          <div className="h-2 w-16 rounded-full bg-white/35" />
          <div className="h-2 w-full rounded-full bg-white/15" />
          <div className="h-2 w-10/12 rounded-full bg-white/15" />
        </div>
        <div className="space-y-2 pt-1">
          <div className="h-2 w-20 rounded-full bg-white/35" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-6 rounded-full bg-white/10" />
            <div className="h-6 rounded-full bg-white/10" />
            <div className="h-6 rounded-full bg-white/10" />
            <div className="h-6 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-2">
          <div className="h-3 w-24 rounded-full bg-white/90" />
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="h-2 w-11/12 rounded-full bg-white/25" />
            <div className="mt-2 h-2 w-full rounded-full bg-white/15" />
            <div className="mt-2 h-2 w-10/12 rounded-full bg-white/15" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-20 rounded-full bg-white/90" />
          <div className="grid flex-1 gap-2 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3" />
            <div className="rounded-xl border border-white/10 bg-white/5 p-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ModernColumnsPreview() {
  return (
    <div className="flex h-full w-full overflow-hidden rounded-2xl border border-outline-variant/30 bg-white">
      <div className="flex w-[34%] flex-col gap-3 bg-surface-container-low p-4">
        <div className="h-4 w-20 rounded-full bg-primary/25" />
        <div className="h-12 rounded-xl bg-white" />
        <div className="h-10 rounded-xl bg-white" />
        <div className="h-16 rounded-xl bg-white" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-4 w-28 rounded-full bg-primary/20" />
        <div className="h-20 rounded-2xl bg-surface-container-low" />
        <div className="grid flex-1 gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-primary/8 p-3" />
          <div className="rounded-2xl bg-surface-container-low p-3" />
        </div>
      </div>
    </div>
  );
}

export function TemplatePreview({ templateId, compact = false }: { templateId: TemplateId; compact?: boolean }) {
  switch (templateId) {
    case "dark-portfolio":
      return <DarkPortfolioPreview />;
    case "modern-columns":
      return <ModernColumnsPreview />;
    case "corporate-slate":
      return <StandardPreview accent="bg-slate-100" divider="bg-slate-400/50" highlight="bg-slate-200/80" />;
    case "compact-fresher":
      return <StandardPreview accent="bg-primary/8" divider="bg-primary/20" highlight="bg-primary/10" dense />;
    case "clean-showcase":
      return <StandardPreview accent="bg-primary/10" divider="bg-primary/25" highlight="bg-primary/12" showcase />;
    case "creative":
      return <StandardPreview accent="bg-primary/10" divider="bg-primary/25" highlight="bg-primary/12" showcase={compact} />;
    case "minimal":
      return <StandardPreview accent="bg-surface-container-low" divider="bg-outline-variant/35" highlight="bg-surface-container-high" />;
    case "professional":
    default:
      return <StandardPreview accent="bg-primary/10" divider="bg-primary/20" highlight="bg-primary/12" />;
  }
}
