/* eslint-disable @next/next/no-img-element */
import { getAvatarImageStyle } from "@/lib/resume-content";
import type { AvatarFrame, AvatarTransform } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ResumeAvatarFrame({
  src,
  alt,
  frame,
  transform,
  className,
  fallbackText,
  fallbackClassName,
  imageClassName
}: {
  src: string;
  alt: string;
  frame: AvatarFrame;
  transform: AvatarTransform;
  className: string;
  fallbackText: string;
  fallbackClassName?: string;
  imageClassName?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-surface-container-high", className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={cn("h-full w-full object-cover will-change-transform", imageClassName)}
          style={getAvatarImageStyle(transform)}
          draggable={false}
        />
      ) : (
        <div className={cn("flex h-full w-full items-center justify-center bg-primary-fixed text-lg font-bold text-primary", fallbackClassName)}>
          {fallbackText}
        </div>
      )}
      <div className={cn("pointer-events-none absolute inset-0 border border-outline-variant/25", frame === "portrait" ? "rounded-[1.25rem]" : "rounded-2xl")} />
    </div>
  );
}

