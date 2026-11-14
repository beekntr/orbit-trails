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
      postalCode: "302033",
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
    linkedin: "https://in.linkedin.com/company/orbit-trails",
  },
  /**
   * Public review listings. Leave a value empty until the listing exists:
   * empty profiles are not linked anywhere on the site.
   */
  reviewProfiles: {
    tripadvisor: "https://www.tripadvisor.com/Attraction_Review-g304555-d34813742-Reviews-Orbit_Trails-Jaipur_Jaipur_District_Rajasthan.html",
    google: "https://g.page/r/CQ2WqLkvSRQAEAI",
    viator: "",
  },
  /** Direct "write a review" links, for guests who have travelled with us. */
  reviewLinks: {
    google: "https://g.page/r/CQ2WqLkvSRQAEAI/review",
  },
  /**
   * Advertising IDs. Leave empty until the accounts exist; nothing loads for an
   * empty value. All are public identifiers, safe to keep in the code.
   */
  tracking: {
    /** Meta Events Manager > Data sources > your pixel: a 15-16 digit number. */
    metaPixelId: "1828586951682574",
    /** Google Ads > Goals > Conversions > your lead conversion > Tag setup: "AW-123456789". */
    googleAdsId: "",
    /** From the same screen: the part after the slash in send_to, e.g. "AbC-D_efG1234". */
    googleAdsLeadLabel: "",
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
