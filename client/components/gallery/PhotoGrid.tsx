import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import SmartImage from "@/components/SmartImage";
import { photoUrl, type GalleryPhoto } from "@/data/gallery";
import { cn } from "@/lib/utils";

interface PhotoGridProps {
  photos: GalleryPhoto[];
  /** Grid columns on large screens. */
  columns?: 3 | 4 | 6;
  className?: string;
}

/**
 * Square photo grid. Clicking a photo opens it full size with its caption;
 * arrow keys or the on-screen buttons move between photos.
 */
export default function PhotoGrid({ photos, columns = 4, className }: PhotoGridProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const current = openIndex === null ? null : photos[openIndex];

  const step = useCallback(
    (delta: number) =>
      setOpenIndex((index) => (index === null ? index : (index + delta + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, step]);

  return (
    <>
      <ul
        className={cn(
          "grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4",
          columns === 4 && "lg:grid-cols-4",
          columns === 6 && "lg:grid-cols-6",
          className,
        )}
      >
        {photos.map((photo, index) => (
          <li key={photo.file}>
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group relative block aspect-square w-full overflow-hidden rounded-lg bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`Open photo: ${photo.caption}`}
            >
              <SmartImage
                src={photoUrl(photo)}
                alt={photo.alt}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                widths={[320, 480, 640]}
                width={480}
                height={480}
                fallbackSrc={null}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-left text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {photo.caption}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={current !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <DialogContent className="max-w-5xl gap-0 overflow-hidden border-0 bg-black p-0 text-white">
          {current && (
            <figure>
              <div className="relative flex max-h-[80vh] items-center justify-center bg-black">
                <img
                  src={photoUrl(current)}
                  alt={current.alt}
                  className="max-h-[80vh] w-auto max-w-full object-contain"
                />
                {photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </>
                )}
              </div>
              <figcaption className="flex items-center justify-between gap-4 px-5 py-4">
                <DialogTitle className="text-base font-medium text-white">{current.caption}</DialogTitle>
                <DialogDescription className="shrink-0 text-sm text-gray-400">
                  {(openIndex ?? 0) + 1} / {photos.length}
                </DialogDescription>
              </figcaption>
            </figure>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
