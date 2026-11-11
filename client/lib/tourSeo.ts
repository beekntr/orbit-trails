import type { Tour } from "@shared/api";

type TourNaming = Pick<Tour, "name" | "category" | "duration">;

/** The destination each category should rank for. */
const CATEGORY_DESTINATION: Record<string, string> = {
  "Golden Triangle": "Golden Triangle",
  "Rajasthan Tours": "Rajasthan",
  "Extended Tours": "India",
};

/** A name that already says where the tour goes needs no destination added. */
const NAMES_A_DESTINATION = /golden triangle|rajasthan|\bindia\b/i;

/** "8 Days / 7 Nights" -> 8 */
export function tourDays(duration?: string): number | null {
  const days = duration?.match(/(\d+)\s*-?\s*day/i)?.[1];
  return days ? Number(days) : null;
}

/** Tour names come from the admin panel and can carry stray spaces. */
export function cleanTourName(name: string): string {
  return name.replace(/\s+/g, " ").trim();
}

/**
 * The searchable description shown under a tour's name, made only of what the
 * name itself leaves out: length, "private", destination and "tour".
 *
 *   "Land of Kings"                      -> "11-Day Private Rajasthan Tour"
 *   "Colourful Rajasthan with Taj Mahal" -> "11-Day Private Tour"
 *   "4 Day Golden Triangle Tour"         -> "Private Tour"
 *   "Rajasthan Private Tour: Land of Kings (11 Days)" -> null (nothing to add)
 *
 * Brand-style names are not what people type into Google, so this puts the
 * search phrase into each tour page's title and main heading without anyone
 * having to rename tours in the admin panel.
 */
export function tourTagline(tour: TourNaming): string | null {
  const name = cleanTourName(tour.name);
  const days = tourDays(tour.duration);
  const parts: string[] = [];

  if (days && !new RegExp(`\\b${days}\\s*-?\\s*days?\\b`, "i").test(name)) parts.push(`${days}-Day`);
  if (!/\bprivate\b/i.test(name)) parts.push("Private");
  if (!NAMES_A_DESTINATION.test(name)) {
    parts.push(CATEGORY_DESTINATION[tour.category] ?? CATEGORY_DESTINATION["Extended Tours"]);
  }
  // Always end on the noun, even if the name already says "tour": "Private Tour", not "Private".
  if (parts.length) parts.push("Tour");

  return parts.length ? parts.join(" ") : null;
}

/** <title> for a tour page, e.g. "Land of Kings: 11-Day Private Rajasthan Tour | Orbit Trails". */
export function tourPageTitle(tour: TourNaming): string {
  const tagline = tourTagline(tour);
  const title = `${cleanTourName(tour.name)}${tagline ? `: ${tagline}` : ""}`;
  // Google shows about 60 characters. Keep the brand only when it fits, so the
  // search phrase is never the part that gets cut off.
  const branded = `${title} | Orbit Trails`;
  return branded.length <= 60 ? branded : title;
}
