/**
 * Cookie consent: what the visitor allowed, and applying it to Google's tags
 * (Consent Mode v2) and the Meta Pixel.
 *
 * Defaults are set in index.html before any Google tag runs: everything that
 * stores data is denied until the visitor chooses. A stored choice is applied
 * there too, so returning visitors are measured from their first page view.
 */
import { SITE } from "./site";

export interface ConsentChoice {
  /** Google Analytics: visit statistics. */
  analytics: boolean;
  /** Google Ads and Meta (Instagram/Facebook): measuring ads and showing them to past visitors. */
  marketing: boolean;
}

/** Must match the key read by the inline script in index.html. */
export const CONSENT_STORAGE_KEY = "ot_consent_v1";
export const CONSENT_SETTINGS_EVENT = "ot:consent-settings";

type Gtag = (...args: unknown[]) => void;
type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  push?: unknown;
  loaded?: boolean;
  version?: string;
};

const w = () =>
  window as unknown as Window & { gtag?: Gtag; fbq?: Fbq; _fbq?: Fbq };

export function readConsent(): ConsentChoice | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { analytics: Boolean(parsed.analytics), marketing: Boolean(parsed.marketing) };
  } catch {
    return null;
  }
}

export function saveConsent(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ ...choice, savedAt: new Date().toISOString() }),
    );
  } catch {
    // Private browsing can block storage; the choice still applies to this visit.
  }
  applyConsent(choice);
}

/** Open the cookie settings panel from anywhere (e.g. the footer link). */
export function openConsentSettings() {
  window.dispatchEvent(new Event(CONSENT_SETTINGS_EVENT));
}

let metaPixelLoaded = false;

function loadMetaPixel(pixelId: string) {
  const win = w();
  if (metaPixelLoaded || win.fbq) return;
  metaPixelLoaded = true;

  // Meta's standard loader: queues calls until fbevents.js arrives.
  const fbq: Fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue!.push(args);
  } as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  win.fbq = fbq;
  win._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  fbq("init", pixelId);
  fbq("track", "PageView");
}

/** Tell Google's tags and Meta what is allowed now. */
export function applyConsent(choice: ConsentChoice) {
  const win = w();
  const marketing = choice.marketing ? "granted" : "denied";

  win.gtag?.("consent", "update", {
    analytics_storage: choice.analytics ? "granted" : "denied",
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
  });

  if (SITE.tracking.metaPixelId) {
    if (choice.marketing) {
      loadMetaPixel(SITE.tracking.metaPixelId);
      win.fbq?.("consent", "grant");
    } else {
      // Once loaded, the pixel stays on the page; revoking stops it sending anything.
      win.fbq?.("consent", "revoke");
    }
  }
}

let adsTagConfigured = false;

/** Register the Google Ads tag (if configured). Consent Mode decides what it may store. */
export function initAdTags() {
  const { googleAdsId } = SITE.tracking;
  if (!googleAdsId || adsTagConfigured) return;
  adsTagConfigured = true;
  w().gtag?.("config", googleAdsId);
}

export function marketingAllowed(): boolean {
  return readConsent()?.marketing === true;
}
