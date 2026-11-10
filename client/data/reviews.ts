export type ReviewSource = "tripadvisor" | "google" | "viator" | "direct";

export interface Review {
  id: string;
  author: string;
  /** Country of residence, shown next to the name. */
  country?: string;
  rating: number;
  text: string;
  /** Which tour or trip the review is about. */
  trip?: string;
  /** ISO date or "YYYY-MM". */
  date?: string;
  source: ReviewSource;
  /** Link to the original review on the platform, when there is one. */
  url?: string;
}

/** Aggregate numbers as reported by a platform. Only ever filled from a live feed. */
export interface ReviewSummary {
  source: Exclude<ReviewSource, "direct">;
  rating: number;
  count: number;
}

export interface ReviewsFeed {
  reviews: Review[];
  summaries?: ReviewSummary[];
}

/**
 * Reviews shown until a live feed is configured (VITE_REVIEWS_URL).
 * These are the testimonials that were already on the homepage. Replace them
 * with real, attributable guest reviews and link each one to its original
 * (`source` + `url`) wherever possible.
 */
export const fallbackReviews: Review[] = [
  {
    id: "sarah-johnson",
    author: "Sarah Johnson",
    country: "USA",
    rating: 5,
    text: "An absolutely incredible experience! The Golden Triangle tour exceeded all our expectations. Our guide was knowledgeable and the arrangements were perfect.",
    trip: "Golden Triangle",
    source: "direct",
  },
  {
    id: "michael-chen",
    author: "Michael Chen",
    country: "Australia",
    rating: 5,
    text: "Orbit Trails made our dream trip to Rajasthan come true. Every detail was perfectly planned, and we felt safe and well-cared for throughout our journey.",
    trip: "Rajasthan",
    source: "direct",
  },
  {
    id: "emma-thompson",
    author: "Emma Thompson",
    country: "UK",
    rating: 5,
    text: "The cultural immersion and authentic experiences were beyond what we imagined. Highly recommend Orbit Trails for anyone wanting to explore the real India.",
    source: "direct",
  },
];
