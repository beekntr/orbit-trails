/**
 * Thin wrapper around GA4 (gtag is loaded in index.html).
 * Safe to call during prerender or when an ad blocker removes gtag.
 */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") gtag("event", event, params);
}
