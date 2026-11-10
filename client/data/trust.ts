import { SITE } from "@/lib/site";

export interface TrustAnchor {
  id: "concierge" | "approved" | "drivers" | "hotels";
  title: string;
  body: string;
}

/**
 * The four promises shown in <TrustBanner />. Every statement here is a public
 * claim about the business: keep it accurate and specific. For the
 * "approved" anchor, set SITE.accreditation in lib/site.ts to the approving
 * body and registration number so travellers can verify it.
 */
export const trustAnchors: TrustAnchor[] = [
  {
    id: "concierge",
    title: "24/7 Local Concierge",
    body: "A named contact in India on WhatsApp and phone, day or night, from the moment you land until you fly home.",
  },
  {
    id: "approved",
    title: "Government Approved Operator",
    body:
      SITE.accreditation ||
      "A registered Indian tour operator, so your booking is with an accountable, licensed company.",
  },
  {
    id: "drivers",
    title: "English-Fluent Personal Drivers",
    body: "The same experienced, English-speaking driver and a private air-conditioned car for your whole journey.",
  },
  {
    id: "hotels",
    title: "Strictly Vetted 4 & 5-Star Accommodations",
    body: "Heritage palaces and luxury hotels we have inspected in person for comfort, location, hygiene and service.",
  },
];
