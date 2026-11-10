import { BadgeCheck, CarFront, Headset, Hotel, type LucideIcon } from "lucide-react";
import { trustAnchors, type TrustAnchor } from "@/data/trust";
import { cn } from "@/lib/utils";

const icons: Record<TrustAnchor["id"], LucideIcon> = {
  concierge: Headset,
  approved: BadgeCheck,
  drivers: CarFront,
  hotels: Hotel,
};

interface TrustBannerProps {
  /** "dark" for a full-width band, "light" on white pages, "compact" for sidebars. */
  variant?: "dark" | "light" | "compact";
  heading?: string;
  className?: string;
}

/** Premium value-prop band: the four reasons an overseas traveller can book with confidence. */
export default function TrustBanner({
  variant = "dark",
  heading = "Travel India with complete peace of mind",
  className,
}: TrustBannerProps) {
  if (variant === "compact") {
    return (
      <ul className={cn("space-y-3", className)} aria-label="Why book with Orbit Trails">
        {trustAnchors.map((anchor) => {
          const Icon = icons[anchor.id];
          return (
            <li key={anchor.id} className="flex items-center gap-3 text-sm text-gray-700">
              <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <span className="font-medium">{anchor.title}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  const dark = variant === "dark";

  return (
    <section
      aria-labelledby="trust-heading"
      className={cn(
        "py-14",
        dark ? "bg-secondary text-white" : "border-y border-gray-200 bg-white",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-[0.2em]",
              dark ? "text-primary" : "text-accent",
            )}
          >
            The Orbit Trails promise
          </p>
          <h2
            id="trust-heading"
            className={cn("mt-2 text-2xl font-bold md:text-3xl", !dark && "text-secondary")}
          >
            {heading}
          </h2>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustAnchors.map((anchor) => {
            const Icon = icons[anchor.id];
            return (
              <li
                key={anchor.id}
                className={cn(
                  "rounded-xl p-6",
                  dark
                    ? "bg-white/5 ring-1 ring-white/10"
                    : "bg-gray-50 ring-1 ring-gray-200",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-12 w-12 items-center justify-center rounded-full",
                    dark ? "bg-primary/15 text-primary" : "bg-primary/10 text-primary",
                  )}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className={cn("mt-4 text-lg font-semibold", !dark && "text-secondary")}>
                  {anchor.title}
                </h3>
                <p
                  className={cn(
                    "mt-2 text-sm leading-relaxed",
                    dark ? "text-gray-300" : "text-gray-600",
                  )}
                >
                  {anchor.body}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
