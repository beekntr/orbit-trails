/**
 * Single source of truth for business details used in meta tags, JSON-LD,
 * the footer and CTAs. Keep name / address / phone identical everywhere
 * (and identical to your Google Business Profile).
 */
export const SITE = {
  url: "https://www.orbittrails.com",
  name: "Orbit Trails",
  tagline: "Private, tailor-made tours of India",
  logo: "https://images.orbittrails.com/ORBIT.png",
  /** Used when a page has no image of its own. Ideally a 1200x630 JPG. */
  defaultOgImage: "https://images.orbittrails.com/golden-triangle-4day.jpg",
  email: "info@orbittrails.com",
  whatsappNumber: "918619974762",
  phones: {
    india: { display: "+91 86199 74762", e164: "+918619974762" },
    uk: { display: "+44 7450 164575", e164: "+447450164575" },
  },
  address: {
    india: {
      streetAddress: "68/52, Pratap Nagar",
      addressLocality: "Jaipur",
      addressRegion: "Rajasthan",
      addressCountry: "IN",
    },
    uk: {
      streetAddress: "68, New Road",
      addressLocality: "London",
      postalCode: "TW14 8HT",
      addressCountry: "GB",
    },
  },
  social: {
    instagram: "https://www.instagram.com/orbittrails9/",
    twitter: "https://twitter.com/orbittrails",
  },
  /**
   * Public review listings. Leave a value empty until the listing exists:
   * empty profiles are not linked anywhere on the site.
   */
  reviewProfiles: {
    tripadvisor: "",
    google: "",
    viator: "",
  },
  /** Shown under "Government Approved Operator", e.g. the approving body and registration number. */
  accreditation: "",
} as const;

/** Absolute URL for a site path or an already absolute URL. */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return path === "/" ? `${SITE.url}/` : `${SITE.url}${path.replace(/\/$/, "")}`;
}

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${SITE.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Trim copy to a meta-description friendly length without cutting a word. */
export function truncate(text: string, max = 158): string {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:\s]+$/, "")}…`;
}
