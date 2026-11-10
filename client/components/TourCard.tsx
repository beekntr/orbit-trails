import { Link } from "react-router-dom";
import { ArrowRight, Calendar, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SmartImage from "@/components/SmartImage";
import type { TourSummary } from "@/hooks/useTours";
import { cleanTourName, tourTagline } from "@/lib/tourSeo";

interface TourCardProps {
  tour: TourSummary;
  badge?: string;
  /** First row of cards on a page: load the image eagerly. */
  priority?: boolean;
}

/**
 * Itinerary card. The whole card is a real <a href>, so crawlers can follow
 * it to the tour page (the previous cards navigated from onClick handlers,
 * which search engines do not follow).
 */
export default function TourCard({ tour, badge, priority = false }: TourCardProps) {
  const href = `/tour-details/${tour.slug}`;
  const stops = tour.destinations?.length ?? 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-xl">
      <Link to={href} className="relative block aspect-[16/10] overflow-hidden" tabIndex={-1} aria-hidden="true">
        <SmartImage
          src={tour.images?.[0]}
          alt={`${tour.name}: ${tour.category} private tour${stops ? ` covering ${tour.destinations.slice(0, 3).join(", ")}` : ""}`}
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          widths={[320, 480, 640, 960]}
          width={640}
          height={400}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge className="absolute left-4 top-4 bg-primary hover:bg-primary">
          {badge || tour.category}
        </Badge>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-snug text-secondary">
            <Link to={href} className="hover:text-primary focus-visible:underline focus-visible:outline-none">
              {cleanTourName(tour.name)}
              {tourTagline(tour) && (
                <>
                  <span className="sr-only">: </span>
                  <span className="mt-0.5 block text-sm font-medium text-gray-500">{tourTagline(tour)}</span>
                </>
              )}
            </Link>
          </h3>
          {tour.rating > 0 && (
            <div className="flex shrink-0 items-center gap-1 rounded bg-yellow-50 px-2 py-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
              <span className="text-sm font-medium text-yellow-700">
                <span className="sr-only">Rated </span>
                {tour.rating}
              </span>
            </div>
          )}
        </div>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">
          {tour.overview}
        </p>

        <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" aria-hidden="true" />
            <dt className="sr-only">Duration</dt>
            <dd className="font-medium">{tour.duration}</dd>
          </div>
          {stops > 0 && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
              <dt className="sr-only">Destinations</dt>
              <dd className="font-medium">
                {stops} {stops === 1 ? "destination" : "destinations"}
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          <Link
            to={href}
            className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
          >
            View itinerary
            <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to={`/plan-my-trip?tour=${encodeURIComponent(tour.slug)}`}
            className="inline-flex h-9 items-center rounded-md border border-accent px-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white"
          >
            Get a quote
          </Link>
        </div>
      </div>
    </article>
  );
}
