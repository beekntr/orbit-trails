import { useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Set VITE_IMAGE_CDN=vercel (and deploy vercel.json's `images` block) to have
 * Vercel resize, convert to WebP/AVIF and edge-cache images from
 * images.orbittrails.com. The origin then serves each image once per size
 * instead of once per visitor.
 */
const USE_VERCEL_OPTIMIZER =
  import.meta.env.PROD && import.meta.env.VITE_IMAGE_CDN === "vercel";

const OWN_IMAGE_HOST = "images.orbittrails.com";
const DEFAULT_WIDTHS = [320, 640, 960, 1280, 1920];
export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=960&q=70";

/** URL for `src` at a given width, or null when the host cannot resize. */
export function resizedUrl(src: string, width: number): string | null {
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return null;
  }

  if (url.hostname === "images.unsplash.com") {
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "crop");
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", "70");
    return url.toString();
  }

  if (url.hostname === "images.pexels.com") {
    return `${url.origin}${url.pathname}?auto=compress&cs=tinysrgb&w=${width}`;
  }

  if (url.hostname === OWN_IMAGE_HOST && USE_VERCEL_OPTIMIZER) {
    return `/_vercel/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
  }

  return null;
}

export interface SmartImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "loading"> {
  src: string | undefined;
  alt: string;
  /** Above-the-fold image: loads eagerly with high priority. Use once per page. */
  priority?: boolean;
  /** CSS sizes hint, e.g. "(min-width: 1024px) 33vw, 100vw". */
  sizes?: string;
  widths?: number[];
  /** Shown if `src` is missing or fails. Pass null to hide the image instead. */
  fallbackSrc?: string | null;
}

/**
 * <img> with sensible defaults for a slow origin: native lazy loading, async
 * decoding, a responsive srcSet when the host can resize, a neutral
 * placeholder background while loading, and a one-shot error fallback.
 */
export default function SmartImage({
  src,
  alt,
  priority = false,
  sizes = "100vw",
  widths = DEFAULT_WIDTHS,
  fallbackSrc = FALLBACK_IMAGE,
  className,
  ...rest
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  const activeSrc = !src || failed ? fallbackSrc : src;

  if (!activeSrc) return null;

  const candidates = widths
    .map((width) => {
      const url = resizedUrl(activeSrc, width);
      return url ? `${url} ${width}w` : null;
    })
    .filter(Boolean) as string[];

  const defaultSrc = resizedUrl(activeSrc, 960) ?? activeSrc;

  return (
    <img
      {...rest}
      src={defaultSrc}
      srcSet={candidates.length ? candidates.join(", ") : undefined}
      sizes={candidates.length ? sizes : undefined}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={cn("bg-muted", className)}
      onError={() => {
        if (!failed) setFailed(true);
      }}
    />
  );
}
