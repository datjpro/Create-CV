"use client";

import { cn } from "@/lib/utils";

type PreferenceOption<T extends string> = {
  value: T;
  label: string;
};

type PreferenceSegmentedControlProps<T extends string> = {
  ariaLabel: string;
  className?: string;
  options: PreferenceOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md";
};

export function PreferenceSegmentedControl<T extends string>({
  ariaLabel,
  className,
  options,
  value,
  onChange,
  size = "md"
}: PreferenceSegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex flex-wrap items-center rounded-full bg-surface-container-high p-1",
        size === "sm" ? "gap-1" : "gap-1.5",
        className
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-full font-semibold transition",
              size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
              active
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
