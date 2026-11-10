import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { LEAD_MAGNET, LEAD_MAGNET_EVENT, isSnoozed, snooze } from "./leadMagnet";

const LeadMagnetModal = lazy(() => import("./LeadMagnetModal"));

/**
 * Decides when the route-planner offer appears. Mounted once in the app shell.
 *
 * It opens when the visitor:
 *  - moves the pointer out of the top of the window (desktop exit intent), or
 *  - has been on the site for LEAD_MAGNET.delayMs (covers touch devices), or
 *  - clicks anything that calls openLeadMagnet().
 *
 * The first two happen at most once every LEAD_MAGNET.snoozeDays and never on
 * the excluded pages. The modal code is only downloaded when it is needed.
 */
export default function LeadMagnetHost() {
  const { pathname } = useLocation();
  const pathRef = useRef(pathname);
  pathRef.current = pathname;
  const [trigger, setTrigger] = useState<string | null>(null);

  useEffect(() => {
    const startedAt = Date.now();
    const allowed = () =>
      !isSnoozed() &&
      !LEAD_MAGNET.excludedPaths.some((path) => pathRef.current.startsWith(path));

    const openAutomatically = (reason: string) => {
      if (allowed()) setTrigger((current) => current ?? reason);
    };

    const timer = window.setTimeout(() => openAutomatically("timer"), LEAD_MAGNET.delayMs);

    const onMouseOut = (event: MouseEvent) => {
      const leavingTop = event.clientY <= 0 && !event.relatedTarget;
      if (leavingTop && Date.now() - startedAt > LEAD_MAGNET.minDwellMs) {
        openAutomatically("exit-intent");
      }
    };

    const onManualOpen = (event: Event) => {
      setTrigger((event as CustomEvent<string>).detail || "cta");
    };

    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener(LEAD_MAGNET_EVENT, onManualOpen);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener(LEAD_MAGNET_EVENT, onManualOpen);
    };
  }, []);

  if (!trigger) return null;

  return (
    <Suspense fallback={null}>
      <LeadMagnetModal
        trigger={trigger}
        onClose={(converted) => {
          snooze(converted ? 365 : LEAD_MAGNET.snoozeDays);
          setTrigger(null);
        }}
      />
    </Suspense>
  );
}
