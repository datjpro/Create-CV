/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { clampAvatarTransform } from "@/lib/resume-content";
import type { AvatarFrame, AvatarTransform } from "@/lib/types";
import { cn } from "@/lib/utils";

type Size = {
  width: number;
  height: number;
};

type CoverMode = "horizontal-cover" | "vertical-cover";

function getCoverMode(mediaSize: Size, containerSize: Size): CoverMode {
  const mediaAspect = mediaSize.width / mediaSize.height;
  const containerAspect = containerSize.width / containerSize.height;
  return mediaAspect < containerAspect ? "horizontal-cover" : "vertical-cover";
}

function getFittedMediaSize(mediaSize: Size, containerSize: Size, coverMode: CoverMode): Size {
  if (coverMode === "horizontal-cover") {
    return {
      width: containerSize.width,
      height: containerSize.width / (mediaSize.width / mediaSize.height)
    };
  }

  return {
    width: containerSize.height * (mediaSize.width / mediaSize.height),
    height: containerSize.height
  };
}

function getAvatarPreviewState(transform: AvatarTransform, containerSize: Size, mediaSize: Size) {
  const next = clampAvatarTransform(transform);
  const coverMode = getCoverMode(mediaSize, containerSize);
  const fittedMediaSize = getFittedMediaSize(mediaSize, containerSize, coverMode);
  const croppedWidth = Math.min(100, ((containerSize.width / fittedMediaSize.width) * 100) / next.zoom);
  const croppedHeight = Math.min(100, ((containerSize.height / fittedMediaSize.height) * 100) / next.zoom);
  const cropX = Math.min(100 - croppedWidth, Math.max(0, next.x - croppedWidth / 2));
  const cropY = Math.min(100 - croppedHeight, Math.max(0, next.y - croppedHeight / 2));
  const translateX = (next.zoom * fittedMediaSize.width) / 2 - containerSize.width / 2 - fittedMediaSize.width * next.zoom * (cropX / 100);
  const translateY = (next.zoom * fittedMediaSize.height) / 2 - containerSize.height / 2 - fittedMediaSize.height * next.zoom * (cropY / 100);

  return {
    coverMode,
    style: {
      transform: `translate(${translateX}px, ${translateY}px) scale(${next.zoom})`,
      transformOrigin: "center center"
    }
  };
}

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
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = useState<Size | null>(null);
  const [mediaSize, setMediaSize] = useState<Size | null>(null);

  useEffect(() => {
    setMediaSize(null);
  }, [src]);

  useEffect(() => {
    const node = frameRef.current;
    if (!node) {
      return;
    }

    const updateSize = () => {
      const width = node.clientWidth;
      const height = node.clientHeight;

      setContainerSize((current) => {
        if (current?.width === width && current?.height === height) {
          return current;
        }

        return { width, height };
      });
    };

    updateSize();

    const observer = new ResizeObserver(() => updateSize());
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const previewState = useMemo(() => {
    if (!src || !containerSize || !mediaSize || containerSize.width === 0 || containerSize.height === 0 || mediaSize.width === 0 || mediaSize.height === 0) {
      return null;
    }

    return getAvatarPreviewState(transform, containerSize, mediaSize);
  }, [containerSize, mediaSize, src, transform]);

  return (
    <div ref={frameRef} className={cn("relative flex items-center justify-center overflow-hidden bg-surface-container-high", className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={cn(
            "shrink-0 select-none will-change-transform",
            previewState
              ? previewState.coverMode === "horizontal-cover"
                ? "h-auto w-full max-w-none"
                : "h-full w-auto max-w-none"
              : "h-full w-full object-cover",
            imageClassName
          )}
          style={previewState?.style}
          draggable={false}
          onLoad={(event) => {
            setMediaSize({
              width: event.currentTarget.naturalWidth,
              height: event.currentTarget.naturalHeight
            });
          }}
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
