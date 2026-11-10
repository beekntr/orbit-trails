/**
 * Measurement helpers. Google Analytics and Google Ads load from index.html;
 * the Meta Pixel loads only after the visitor allows marketing cookies (see
 * lib/consent.ts). Every function is safe to call during prerender, before
 * consent, or when an ad blocker removes the tags: it then does nothing.
 */
import { SITE } from "./site";

type Gtag = (...args: unknown[]) => void;
type Fbq = (...args: unknown[]) => void;

const tags = () =>
  typeof window === "undefined"
    ? {}
    : (window as unknown as { gtag?: Gtag; fbq?: Fbq });

/** A Google Analytics event. */
export function track(event: string, params: Record<string, unknown> = {}) {
  tags().gtag?.("event", event, params);
}

/**
 * A completed enquiry: trip planner, route-planner download or contact form.
 * Sent to Google Analytics (`generate_lead`, which can be imported into Google
 * Ads as a conversion), to Google Ads directly when a conversion label is
 * configured, and to Meta as a `Lead`.
 */
export function trackLead(method: string, params: Record<string, unknown> = {}) {
  const { gtag, fbq } = tags();
  gtag?.("event", "generate_lead", { method, ...params });

  const { googleAdsId, googleAdsLeadLabel } = SITE.tracking;
  if (googleAdsId && googleAdsLeadLabel) {
    gtag?.("event", "conversion", { send_to: `${googleAdsId}/${googleAdsLeadLabel}` });
  }

  fbq?.("track", "Lead", { content_name: method });
}

/** A click on WhatsApp, phone or email: a warm lead even without a form. */
export function trackContactClick(channel: "whatsapp" | "phone" | "email", placement: string) {
  const { gtag, fbq } = tags();
  gtag?.("event", "contact", { method: channel, placement });
  fbq?.("track", "Contact", { content_name: `${channel}:${placement}` });
}

/** Meta needs a PageView on every in-app navigation; Google Analytics tracks these itself. */
export function trackPageView() {
  tags().fbq?.("track", "PageView");
}

/**
 * Count clicks on WhatsApp, phone and email links anywhere on the site with
 * one listener, so new links are covered without extra code. Returns a
 * cleanup function.
 */
export function installContactClickTracking(): () => void {
  const onClick = (event: MouseEvent) => {
    const link = (event.target as Element | null)?.closest?.("a[href]");
    if (!link) return;
    const href = link.getAttribute("href") || "";
    const placement = window.location.pathname;
    if (href.startsWith("https://wa.me/") || href.includes("api.whatsapp.com")) {
      trackContactClick("whatsapp", placement);
    } else if (href.startsWith("tel:")) {
      trackContactClick("phone", placement);
    } else if (href.startsWith("mailto:")) {
      trackContactClick("email", placement);
    }
  };
  document.addEventListener("click", onClick, { capture: true });
  return () => document.removeEventListener("click", onClick, { capture: true });
}
