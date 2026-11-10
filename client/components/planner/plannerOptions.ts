import {
  Castle,
  Flower2,
  Heart,
  Mountain,
  PawPrint,
  Sailboat,
  User,
  Users,
  UsersRound,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

export interface VibeOption {
  id: string;
  label: string;
  blurb: string;
  icon: LucideIcon;
}

export const VIBES: VibeOption[] = [
  { id: "heritage", label: "Heritage & Palaces", blurb: "The Taj Mahal, Rajput forts and palace hotels", icon: Castle },
  { id: "wildlife", label: "Wildlife & Safaris", blurb: "Tiger safaris in Ranthambore and beyond", icon: PawPrint },
  { id: "wellness", label: "Yoga & Wellness", blurb: "Ayurveda retreats, Rishikesh and slow days", icon: Flower2 },
  { id: "beaches", label: "Beaches & Houseboats", blurb: "Kerala backwaters and the Goa coast", icon: Sailboat },
  { id: "food", label: "Food & Culture", blurb: "Markets, cooking classes and festivals", icon: UtensilsCrossed },
  { id: "mountains", label: "Himalayas & Hill Stations", blurb: "Shimla, Darjeeling and mountain air", icon: Mountain },
];

export type CrewId = "Solo" | "Couple" | "Family" | "Group";

export interface CrewOption {
  id: CrewId;
  blurb: string;
  travellers: number;
  /** Family and Group let the visitor adjust the head count. */
  adjustable: boolean;
  icon: LucideIcon;
}

export const CREWS: CrewOption[] = [
  { id: "Solo", blurb: "Just me", travellers: 1, adjustable: false, icon: User },
  { id: "Couple", blurb: "Two of us", travellers: 2, adjustable: false, icon: Heart },
  { id: "Family", blurb: "With children or parents", travellers: 4, adjustable: true, icon: Users },
  { id: "Group", blurb: "Friends or a private group", travellers: 6, adjustable: true, icon: UsersRound },
];

export type CurrencyCode = "USD" | "GBP" | "EUR";

export const CURRENCIES: Record<
  CurrencyCode,
  { symbol: string; min: number; max: number; step: number; initial: number; luxuryFrom: number }
> = {
  USD: { symbol: "$", min: 1000, max: 10000, step: 250, initial: 3000, luxuryFrom: 4000 },
  GBP: { symbol: "£", min: 800, max: 8000, step: 200, initial: 2400, luxuryFrom: 3200 },
  EUR: { symbol: "€", min: 900, max: 9000, step: 300, initial: 2700, luxuryFrom: 3600 },
};

export const DURATION = { min: 4, max: 21, initial: 10 };

export interface CountryOption {
  name: string;
  dial: string;
  currency: CurrencyCode;
}

/** Target markets first; "Other" lets anyone else through. */
export const COUNTRIES: CountryOption[] = [
  { name: "United States", dial: "+1", currency: "USD" },
  { name: "United Kingdom", dial: "+44", currency: "GBP" },
  { name: "Canada", dial: "+1", currency: "USD" },
  { name: "Australia", dial: "+61", currency: "USD" },
  { name: "Ireland", dial: "+353", currency: "EUR" },
  { name: "Germany", dial: "+49", currency: "EUR" },
  { name: "France", dial: "+33", currency: "EUR" },
  { name: "Netherlands", dial: "+31", currency: "EUR" },
  { name: "Spain", dial: "+34", currency: "EUR" },
  { name: "Italy", dial: "+39", currency: "EUR" },
  { name: "Switzerland", dial: "+41", currency: "EUR" },
  { name: "Sweden", dial: "+46", currency: "EUR" },
  { name: "South Africa", dial: "+27", currency: "USD" },
  { name: "Saudi Arabia", dial: "+966", currency: "USD" },
  { name: "United Arab Emirates", dial: "+971", currency: "USD" },
  { name: "New Zealand", dial: "+64", currency: "USD" },
  { name: "Singapore", dial: "+65", currency: "USD" },
  { name: "Other", dial: "+1", currency: "USD" },
];

/** Unique dial codes for the WhatsApp country-code selector. */
export const DIAL_CODES: Array<{ dial: string; label: string }> = [
  { dial: "+1", label: "US / CA +1" },
  { dial: "+44", label: "UK +44" },
  { dial: "+61", label: "AU +61" },
  { dial: "+353", label: "IE +353" },
  { dial: "+49", label: "DE +49" },
  { dial: "+33", label: "FR +33" },
  { dial: "+31", label: "NL +31" },
  { dial: "+34", label: "ES +34" },
  { dial: "+39", label: "IT +39" },
  { dial: "+41", label: "CH +41" },
  { dial: "+46", label: "SE +46" },
  { dial: "+27", label: "ZA +27" },
  { dial: "+966", label: "SA +966" },
  { dial: "+971", label: "AE +971" },
  { dial: "+64", label: "NZ +64" },
  { dial: "+65", label: "SG +65" },
  { dial: "+91", label: "IN +91" },
];

export function formatMoney(amount: number, currency: CurrencyCode): string {
  return `${CURRENCIES[currency].symbol}${amount.toLocaleString("en-US")}`;
}

/** The next 18 months as { value: "2027-02", label: "February 2027" }. */
export function upcomingMonths(count = 18): Array<{ value: string; label: string }> {
  const now = new Date();
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() + index + 1, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    return { value, label };
  });
}
