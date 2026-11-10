import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  CONSENT_SETTINGS_EVENT,
  applyConsent,
  initAdTags,
  readConsent,
  saveConsent,
  type ConsentChoice,
} from "@/lib/consent";
import { trackPageView } from "@/lib/analytics";

/**
 * Cookie banner and settings panel.
 *
 * Shown until the visitor chooses. "Reject" is as prominent as "Accept", as
 * UK and EU rules expect. Choices are stored in the browser and can be changed
 * later through the "Cookie settings" link in the footer. Also sends Meta a
 * PageView on each in-app navigation once the pixel is allowed.
 */
export default function CookieBanner() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const [customising, setCustomising] = useState(false);
  const [draft, setDraft] = useState<ConsentChoice>({ analytics: true, marketing: true });
  const firstPath = useRef(true);

  useEffect(() => {
    initAdTags();
    const stored = readConsent();
    if (stored) {
      // index.html already told Google; this loads the Meta Pixel if allowed.
      applyConsent(stored);
      setDraft(stored);
    } else {
      setVisible(true);
    }

    const openSettings = () => {
      setDraft(readConsent() ?? { analytics: true, marketing: true });
      setCustomising(true);
      setVisible(true);
    };
    window.addEventListener(CONSENT_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(CONSENT_SETTINGS_EVENT, openSettings);
  }, []);

  // The pixel's own PageView covers the landing page; later navigations need one each.
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    trackPageView();
  }, [pathname]);

  const choose = (choice: ConsentChoice) => {
    saveConsent(choice);
    setVisible(false);
    setCustomising(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md sm:p-0"
    >
      <div className="rounded-xl border bg-white p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <h2 id="cookie-banner-title" className="font-semibold text-secondary">
              Cookies on Orbit Trails
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">
              We use cookies to see how our site is used and to measure and show our ads. They only
              switch on if you allow them.{" "}
              <Link to="/privacy" className="underline hover:text-primary">
                Privacy policy
              </Link>
            </p>
          </div>
        </div>

        {customising && (
          <div className="mt-4 space-y-3 border-t pt-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-secondary">Essential</p>
                <p className="text-xs text-gray-500">
                  Remember your choices on this site, like this one. Always on.
                </p>
              </div>
              <Switch checked disabled aria-label="Essential cookies, always on" />
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <label htmlFor="consent-analytics" className="text-sm font-medium text-secondary">
                  Analytics
                </label>
                <p className="text-xs text-gray-500">Google Analytics: which pages are visited and how.</p>
              </div>
              <Switch
                id="consent-analytics"
                checked={draft.analytics}
                onCheckedChange={(analytics) => setDraft((d) => ({ ...d, analytics }))}
              />
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <label htmlFor="consent-marketing" className="text-sm font-medium text-secondary">
                  Marketing
                </label>
                <p className="text-xs text-gray-500">
                  Google Ads and Meta (Instagram, Facebook): measuring our ads and showing them to
                  past visitors.
                </p>
              </div>
              <Switch
                id="consent-marketing"
                checked={draft.marketing}
                onCheckedChange={(marketing) => setDraft((d) => ({ ...d, marketing }))}
              />
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            size="sm"
            className="flex-1 bg-secondary hover:bg-secondary/90"
            onClick={() => choose({ analytics: true, marketing: true })}
          >
            Accept all
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={() => choose({ analytics: false, marketing: false })}
          >
            Reject all
          </Button>
          {customising ? (
            <Button size="sm" variant="ghost" className="w-full" onClick={() => choose(draft)}>
              Save my choices
            </Button>
          ) : (
            <Button size="sm" variant="ghost" className="w-full" onClick={() => setCustomising(true)}>
              Choose cookies
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
