/** Settings and tiny helpers for the PDF lead magnet. Kept apart from the modal so they stay in the main bundle while the modal itself loads on demand. */
export const LEAD_MAGNET = {
  /** Wait this long on the site before showing the offer unprompted. */
  delayMs: 45_000,
  /** Ignore exit intent from visitors who have only just arrived. */
  minDwellMs: 8_000,
  /** After a dismissal, stay quiet for this many days. */
  snoozeDays: 14,
  storageKey: "ot_lead_magnet_v1",
  /** Never interrupt these pages: the visitor is already converting or reading legal text. */
  excludedPaths: ["/adm", "/plan-my-trip", "/privacy", "/terms"],
} as const;

export const LEAD_MAGNET_EVENT = "ot:lead-magnet";

/** Open the offer from any button or link: <button onClick={() => openLeadMagnet()}>. */
export function openLeadMagnet(trigger = "cta") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(LEAD_MAGNET_EVENT, { detail: trigger }));
}

interface StoredState {
  until: number;
}

export function isSnoozed(): boolean {
  try {
    const raw = window.localStorage.getItem(LEAD_MAGNET.storageKey);
    if (!raw) return false;
    return (JSON.parse(raw) as StoredState).until > Date.now();
  } catch {
    return false;
  }
}

export function snooze(days: number = LEAD_MAGNET.snoozeDays) {
  try {
    const state: StoredState = { until: Date.now() + days * 24 * 60 * 60 * 1000 };
    window.localStorage.setItem(LEAD_MAGNET.storageKey, JSON.stringify(state));
  } catch {
    // Storage can be unavailable (private mode); the offer may simply show again.
  }
}
