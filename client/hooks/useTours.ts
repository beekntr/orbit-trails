import { useQuery, useQueryClient } from "@tanstack/react-query";
import { OrbitTrailsAPI, type ApiResponse, type Tour } from "@shared/api";

/** Fields needed to draw a tour card. Listing pages never need the day-by-day itinerary. */
export type TourSummary = Pick<
  Tour,
  | "_id"
  | "name"
  | "slug"
  | "overview"
  | "category"
  | "duration"
  | "rating"
  | "reviews"
  | "destinations"
  | "price"
  | "updatedAt"
> & { images: string[]; description?: string };

export const tourKeys = {
  list: ["tours", "list"] as const,
  detail: (slug: string) => ["tours", "detail", slug] as const,
};

export class ApiError extends Error {
  kind: "network" | "not-found" | "other";
  constructor(message: string, kind: ApiError["kind"]) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
  }
}

/** OrbitTrailsAPI never throws; convert its envelope into data or a typed error. */
async function unwrap<T>(request: Promise<ApiResponse<T>>): Promise<T> {
  const response = await request;
  if (response.success && response.data != null) return response.data;
  const message = response.message || "Request failed";
  const kind = /network/i.test(message)
    ? "network"
    : /not found/i.test(message)
      ? "not-found"
      : "other";
  throw new ApiError(message, kind);
}

export function toTourSummary(tour: Tour | TourSummary): TourSummary {
  return {
    _id: tour._id,
    name: tour.name,
    slug: tour.slug,
    overview: tour.overview || tour.description || "",
    category: tour.category,
    duration: tour.duration,
    rating: tour.rating,
    reviews: tour.reviews,
    destinations: tour.destinations || [],
    price: tour.price,
    updatedAt: tour.updatedAt,
    images: (tour.images || []).slice(0, 1),
  };
}

/** All active tours, card fields only. Shared by home, /tours and the hub page. */
export function useTours() {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: tourKeys.list,
    queryFn: async ({ signal }) => {
      const data = await unwrap(OrbitTrailsAPI.getTours({ view: "card", signal }));
      // A server that ignores ?view=card sends full tours: keep them so opening
      // a tour afterwards needs no second request.
      for (const tour of data.tours) {
        if (tour.itinerary?.length) {
          queryClient.setQueryData(tourKeys.detail(tour.slug), tour);
        }
      }
      return data.tours.map(toTourSummary);
    },
  });
}

/** One full tour. Reuses whatever the prerender step or a previous page already loaded. */
export function useTour(slug: string | undefined) {
  const queryClient = useQueryClient();
  // While the full tour loads, show the card data we already have.
  const summary = queryClient
    .getQueryData<TourSummary[]>(tourKeys.list)
    ?.find((tour) => tour.slug === slug);

  return useQuery<Tour, Error>({
    queryKey: tourKeys.detail(slug ?? ""),
    enabled: Boolean(slug),
    queryFn: ({ signal }) => unwrap(OrbitTrailsAPI.getTourBySlug(slug as string, signal)),
    placeholderData: summary ? (summary as unknown as Tour) : undefined,
  });
}

/** Stable "featured" pick: best rated first, most reviewed as the tie-break. */
export function pickFeatured<T extends { rating: number; reviews: number }>(
  tours: T[],
  count = 3,
): T[] {
  return [...tours]
    .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    .slice(0, count);
}
