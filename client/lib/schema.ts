/**
 * JSON-LD builders. Each returns a plain object for <JsonLd /> / <Seo jsonLd>.
 *
 * Notes on types:
 *  - schema.org has no "Tour" type. TouristTrip (a subtype of Trip) is the
 *    correct type for an itinerary.
 *  - TravelAgency is a subtype of Organization / LocalBusiness.
 *  - Ratings are deliberately not emitted here. Google only accepts review
 *    markup for reviews that are visible on the page and collected from real
 *    customers; add it back once verified reviews are wired in.
 */
import type { Tour } from "@shared/api";
import { SITE, absoluteUrl } from "./site";

const ORG_ID = `${SITE.url}/#organization`;
const WEBSITE_ID = `${SITE.url}/#website`;

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Crumb {
  name: string;
  path: string;
}

type TourLike = Pick<Tour, "name" | "slug"> & Partial<Tour>;

export function organizationSchema() {
  const sameAs = [
    SITE.social.instagram,
    SITE.social.twitter,
    ...Object.values(SITE.reviewProfiles),
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": ORG_ID,
    name: SITE.name,
    url: SITE.url,
    logo: SITE.logo,
    image: SITE.defaultOgImage,
    description:
      "India-based tour operator designing private, tailor-made journeys through the Golden Triangle, Rajasthan and beyond.",
    email: SITE.email,
    telephone: SITE.phones.india.e164,
    address: { "@type": "PostalAddress", ...SITE.address.india },
    areaServed: { "@type": "Country", name: "India" },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: SITE.phones.india.e164,
        email: SITE.email,
        availableLanguage: ["English", "Hindi"],
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: SITE.phones.uk.e164,
        areaServed: "GB",
        availableLanguage: ["English"],
      },
    ],
    sameAs,
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE.url,
    name: SITE.name,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

export function tourUrl(slug: string) {
  return absoluteUrl(`/tour-details/${slug}`);
}

/** "8 Days / 7 Nights" -> "P8D" */
function isoDuration(duration?: string): string | undefined {
  const days = duration?.match(/(\d+)\s*-?\s*day/i)?.[1];
  return days ? `P${days}D` : undefined;
}

export function tourSchema(tour: TourLike) {
  const url = tourUrl(tour.slug);
  const days = tour.itinerary ?? [];

  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${url}#trip`,
    name: tour.name,
    description: tour.overview || tour.description,
    url,
    ...(tour.images?.length ? { image: tour.images } : {}),
    ...(tour.category ? { touristType: [tour.category, "Private tour", "Cultural tourism"] } : {}),
    ...(isoDuration(tour.duration) ? { duration: isoDuration(tour.duration) } : {}),
    provider: { "@id": ORG_ID },
    ...(days.length
      ? {
          itinerary: {
            "@type": "ItemList",
            numberOfItems: days.length,
            itemListElement: days.map((day) => ({
              "@type": "ListItem",
              position: day.day,
              name: `Day ${day.day}: ${day.title}`,
              description: day.description,
            })),
          },
        }
      : {}),
    ...(tour.destinations?.length
      ? {
          subjectOf: tour.destinations.map((name) => ({
            "@type": "TouristDestination",
            name,
          })),
        }
      : {}),
    // Only emitted when a real price exists: an Offer without a numeric price is invalid.
    ...(typeof tour.price === "number" && tour.price > 0
      ? {
          offers: {
            "@type": "Offer",
            url,
            price: tour.price,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            seller: { "@id": ORG_ID },
          },
        }
      : {}),
  };
}

export function tourListSchema(name: string, tours: TourLike[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: tours.length,
    itemListElement: tours.map((tour, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: tourUrl(tour.slug),
      name: tour.name,
    })),
  };
}

export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function articleSchema(article: {
  title: string;
  description: string;
  path: string;
  image?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    ...(article.image ? { image: absoluteUrl(article.image) } : {}),
    mainEntityOfPage: absoluteUrl(article.path),
    author: article.author
      ? { "@type": "Person", name: article.author }
      : { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    ...(article.datePublished ? { datePublished: article.datePublished } : {}),
    ...(article.dateModified || article.datePublished
      ? { dateModified: article.dateModified || article.datePublished }
      : {}),
  };
}
