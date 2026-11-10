import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Quote, Star } from "lucide-react";
import {
  fallbackReviews,
  type Review,
  type ReviewSource,
  type ReviewsFeed,
  type ReviewSummary,
} from "@/data/reviews";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Optional live feed. Point VITE_REVIEWS_URL at any endpoint that returns
 * `{ reviews: Review[], summaries?: ReviewSummary[] }` — for example a small
 * route on the API server that caches the Google Places reviews response or
 * the Tripadvisor Content API. Until it is set, `fallbackReviews` is shown.
 */
const REVIEWS_URL: string | undefined = import.meta.env.VITE_REVIEWS_URL;

const SOURCE_LABEL: Record<ReviewSource, string> = {
  tripadvisor: "Tripadvisor",
  google: "Google",
  viator: "Viator",
  direct: "Orbit Trails guest",
};

function useReviewsFeed(): ReviewsFeed {
  const { data } = useQuery({
    queryKey: ["reviews"],
    enabled: Boolean(REVIEWS_URL),
    staleTime: 6 * 60 * 60 * 1000,
    queryFn: async ({ signal }): Promise<ReviewsFeed> => {
      const response = await fetch(REVIEWS_URL as string, { signal });
      if (!response.ok) throw new Error(`Reviews feed returned ${response.status}`);
      const body = await response.json();
      return body.data ?? body;
    },
  });
  return data?.reviews?.length ? data : { reviews: fallbackReviews };
}

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("flex items-center gap-0.5", className)} role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          aria-hidden="true"
          className={cn(
            "h-4 w-4",
            value <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
          )}
        />
      ))}
    </span>
  );
}

function formatDate(date?: string) {
  if (!date) return null;
  const parsed = new Date(date.length === 7 ? `${date}-01` : date);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

function ReviewCard({ review }: { review: Review }) {
  const initials = review.author
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const date = formatDate(review.date);

  return (
    <figure className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <Stars rating={review.rating} />
        <Quote className="h-6 w-6 text-primary/30" aria-hidden="true" />
      </div>
      <blockquote className="mt-4 flex-1 text-gray-700 leading-relaxed">
        <p>“{review.text}”</p>
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t pt-4">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
        >
          {initials}
        </span>
        <div className="min-w-0 text-sm">
          <div className="font-semibold text-secondary">
            {review.author}
            {review.country && <span className="font-normal text-gray-500"> · {review.country}</span>}
          </div>
          <div className="truncate text-gray-500">
            {[review.trip, date].filter(Boolean).join(" · ") || SOURCE_LABEL[review.source]}
          </div>
          {review.url && (
            <a
              href={review.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Read on {SOURCE_LABEL[review.source]}
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          )}
        </div>
      </figcaption>
    </figure>
  );
}

function PlatformBadges({ summaries }: { summaries?: ReviewSummary[] }) {
  const platforms = (Object.keys(SITE.reviewProfiles) as Array<keyof typeof SITE.reviewProfiles>)
    .map((source) => ({
      source,
      url: SITE.reviewProfiles[source] as string,
      summary: summaries?.find((item) => item.source === source),
    }))
    .filter((platform) => platform.url);

  if (!platforms.length) return null;

  return (
    <ul className="mt-8 flex flex-wrap items-center justify-center gap-3">
      {platforms.map(({ source, url, summary }) => (
        <li key={source}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-secondary shadow-sm transition-colors hover:border-primary"
          >
            {SOURCE_LABEL[source]}
            {summary && (
              <>
                <Stars rating={summary.rating} />
                <span className="text-gray-600">
                  {summary.rating.toFixed(1)} ({summary.count.toLocaleString("en-US")})
                </span>
              </>
            )}
            <ExternalLink className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}

interface ReviewsWidgetProps {
  heading?: string;
  subheading?: string;
  /** Max number of review cards. */
  limit?: number;
  className?: string;
}

/**
 * Guest reviews with links back to the original platforms.
 *
 * Data comes from the live feed when VITE_REVIEWS_URL is set, otherwise from
 * data/reviews.ts. Platform badges appear for every profile URL filled in
 * SITE.reviewProfiles; rating/count figures are only shown when the feed
 * supplies them, never computed from the handful of cards on screen.
 */
export default function ReviewsWidget({
  heading = "What Our Travellers Say",
  subheading = "Private journeys through India, in the words of the guests who took them.",
  limit = 6,
  className,
}: ReviewsWidgetProps) {
  const { reviews, summaries } = useReviewsFeed();
  const visible = reviews.slice(0, limit);

  if (!visible.length) return null;

  return (
    <section aria-labelledby="reviews-heading" className={cn("bg-gray-50 py-20", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="reviews-heading" className="text-3xl font-bold text-secondary md:text-4xl">
            {heading}
          </h2>
          <p className="mt-4 text-lg text-gray-600">{subheading}</p>
          <PlatformBadges summaries={summaries} />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
