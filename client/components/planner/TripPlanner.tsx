import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Loader2, Lock, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { OrbitTrailsAPI, type CustomTourRequest } from "@shared/api";
import { track } from "@/lib/analytics";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import {
  COUNTRIES,
  CREWS,
  CURRENCIES,
  DIAL_CODES,
  DURATION,
  VIBES,
  formatMoney,
  upcomingMonths,
  type CrewId,
  type CurrencyCode,
} from "./plannerOptions";

const STEPS = ["Travel vibe", "Travel crew", "Days & budget", "Your details"] as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const selectClass =
  "h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

interface PlannerState {
  vibes: string[];
  crew: CrewId | null;
  travellers: number;
  days: number;
  currency: CurrencyCode;
  budget: number;
  month: string;
  name: string;
  email: string;
  dial: string;
  whatsapp: string;
  country: string;
  notes: string;
  /** Honeypot: real visitors never see or fill this. */
  company: string;
  interestedTour: string;
}

const initialState: PlannerState = {
  vibes: [],
  crew: null,
  travellers: 2,
  days: DURATION.initial,
  currency: "USD",
  budget: CURRENCIES.USD.initial,
  month: "",
  name: "",
  email: "",
  dial: "+1",
  whatsapp: "",
  country: "",
  notes: "",
  company: "",
  interestedTour: "",
};

const titleCase = (slug: string) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

interface TripPlannerProps {
  className?: string;
}

/**
 * Four-step tailor-made trip planner.
 *
 * State is local to the component. On submit the answers are posted to the
 * existing /api/customize-tour endpoint (so leads appear in the admin panel
 * and trigger the usual notification emails) together with richer optional
 * fields that newer versions of the API store as-is.
 *
 * Deep links: /plan-my-trip?tour=<slug>&vibe=<id> pre-select answers.
 */
export default function TripPlanner({ className }: TripPlannerProps) {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  /** False until the visitor changes step, so the first step does not animate on page load. */
  const [hasMoved, setHasMoved] = useState(false);
  const [state, setState] = useState<PlannerState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof PlannerState, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [dialTouched, setDialTouched] = useState(false);
  /** Why the server refused the request (validation or rate limit), when it said so. */
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const months = useMemo(() => upcomingMonths(), []);

  const update = (patch: Partial<PlannerState>) => setState((prev) => ({ ...prev, ...patch }));

  // Apply deep-link answers after mount so the prerendered HTML still hydrates cleanly.
  useEffect(() => {
    const tour = searchParams.get("tour");
    const vibe = searchParams.get("vibe");
    const patch: Partial<PlannerState> = {};
    if (tour) patch.interestedTour = titleCase(tour);
    if (vibe && VIBES.some((option) => option.id === vibe)) patch.vibes = [vibe];
    if (Object.keys(patch).length) update(patch);
  }, [searchParams]);

  const currency = CURRENCIES[state.currency];
  const crew = CREWS.find((option) => option.id === state.crew);
  const budgetLabel = `${formatMoney(state.budget, state.currency)}${state.budget >= currency.max ? "+" : ""}`;

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setHasMoved(true);
    setStep(next);
    track("planner_step", { step: next + 1, step_name: STEPS[next] });
    // Move focus to the new step heading for keyboard and screen-reader users.
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const validate = (target: number): boolean => {
    const next: typeof errors = {};
    if (target === 0 && state.vibes.length === 0) next.vibes = "Pick at least one travel style.";
    if (target === 1 && !state.crew) next.crew = "Tell us who is travelling.";
    if (target === 3) {
      if (state.name.trim().length < 2) next.name = "Please enter your name.";
      if (!EMAIL_PATTERN.test(state.email.trim())) next.email = "Please enter a valid email address.";
      const digits = state.whatsapp.replace(/\D/g, "");
      if (digits.length < 6 || digits.length > 15) next.whatsapp = "Please enter your WhatsApp number.";
      if (!state.country) next.country = "Please choose your country.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleNext = () => {
    if (validate(step)) goTo(step + 1);
  };

  const toggleVibe = (id: string) => {
    update({
      vibes: state.vibes.includes(id)
        ? state.vibes.filter((vibe) => vibe !== id)
        : [...state.vibes, id],
    });
    setErrors((prev) => ({ ...prev, vibes: undefined }));
  };

  const chooseCrew = (id: CrewId) => {
    const option = CREWS.find((item) => item.id === id)!;
    update({ crew: id, travellers: option.travellers });
    setErrors((prev) => ({ ...prev, crew: undefined }));
  };

  const chooseCurrency = (code: CurrencyCode) => {
    if (code === state.currency) return;
    // Keep the slider at the same relative position when switching currency.
    const from = CURRENCIES[state.currency];
    const to = CURRENCIES[code];
    const ratio = (state.budget - from.min) / (from.max - from.min);
    const raw = to.min + ratio * (to.max - to.min);
    update({ currency: code, budget: Math.round(raw / to.step) * to.step });
  };

  const chooseCountry = (name: string) => {
    const option = COUNTRIES.find((item) => item.name === name);
    update({
      country: name,
      ...(option && !dialTouched ? { dial: option.dial } : {}),
    });
    setErrors((prev) => ({ ...prev, country: undefined }));
  };

  const vibeLabels = state.vibes.map((id) => VIBES.find((option) => option.id === id)?.label ?? id);
  const monthLabel = months.find((item) => item.value === state.month)?.label;

  const summaryLines = [
    `Travel style: ${vibeLabels.join(", ")}`,
    `Travelling as: ${state.crew} (${state.travellers} ${state.travellers === 1 ? "traveller" : "travellers"})`,
    `Duration: ${state.days} days`,
    `Budget: ${budgetLabel} per person (${state.currency})`,
    `When: ${monthLabel ?? "Flexible"}`,
    `Country of residence: ${state.country}`,
    ...(state.interestedTour ? [`Interested in: ${state.interestedTour}`] : []),
    ...(state.notes.trim() ? [`Notes: ${state.notes.trim()}`] : []),
  ];

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate(3) || status === "submitting") return;

    // Bots fill hidden fields. Show them a success state and send nothing.
    if (state.company) {
      setStatus("done");
      return;
    }

    setStatus("submitting");

    const payload: CustomTourRequest = {
      // Fields the existing endpoint requires
      startDate: state.month ? `${state.month}-01T00:00:00.000Z` : new Date().toISOString(),
      duration: state.days,
      numberOfTravelers: state.travellers,
      accommodationType: state.budget >= currency.luxuryFrom ? "Luxury" : "Comfort",
      destinations: vibeLabels,
      budgetRange: `${budgetLabel} per person (${state.currency})`,
      comments: ["Trip planner enquiry", ...summaryLines].join(" | ").slice(0, 990),
      name: state.name.trim(),
      email: state.email.trim(),
      phone: state.whatsapp.replace(/[^\d\s-]/g, "").trim(),
      countryCode: state.dial,
      // Structured lead fields
      source: "trip-planner",
      travelCrew: state.crew ?? undefined,
      travelStyles: vibeLabels,
      countryOfResidence: state.country,
      currency: state.currency,
      budgetPerPerson: state.budget,
      preferredMonth: state.month || "flexible",
      interestedTour: state.interestedTour || undefined,
      pageUrl: typeof window !== "undefined" ? window.location.pathname : undefined,
    };

    const response = await OrbitTrailsAPI.submitCustomTour(payload);

    if (response.success) {
      setStatus("done");
      track("generate_lead", {
        method: "trip_planner",
        currency: state.currency,
        value: state.budget * state.travellers,
        travel_crew: state.crew,
      });
    } else {
      const explained = response.message && !/network|invalid response/i.test(response.message);
      setServerMessage(explained ? response.message : null);
      setStatus("error");
      track("planner_submit_failed");
    }
  };

  const whatsappFallback = whatsappLink(
    `Hello Orbit Trails, I'd like a tailor-made India itinerary.\n${summaryLines.join("\n")}\nName: ${state.name}`,
  );

  if (status === "done") {
    return (
      <div className={cn("rounded-2xl border bg-white p-8 text-center shadow-xl md:p-12", className)} role="status">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Check className="h-8 w-8" aria-hidden="true" />
        </span>
        <h2 className="mt-6 text-2xl font-bold text-secondary md:text-3xl">
          Thank you{state.name ? `, ${state.name.trim().split(" ")[0]}` : ""}. Your trip is in good hands.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          An India specialist will send your first tailor-made itinerary and quote to{" "}
          <strong>{state.email}</strong> within 24 hours. No payment or commitment is needed to
          receive it.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
            <a href={whatsappFallback} target="_blank" rel="noopener noreferrer">
              Chat with us on WhatsApp
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/tours">Browse sample itineraries</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn("rounded-2xl border bg-white shadow-xl", className)}
      aria-label="Tailor-made trip planner"
    >
      {/* Progress */}
      <div className="border-b px-6 py-5 md:px-10">
        <ol className="flex items-center gap-2">
          {STEPS.map((label, index) => {
            const done = index < step;
            const current = index === step;
            return (
              <li key={label} className="flex flex-1 items-center gap-2" aria-current={current ? "step" : undefined}>
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                    done && "bg-primary text-white",
                    current && "bg-accent text-white",
                    !done && !current && "bg-gray-100 text-gray-500",
                  )}
                >
                  {done ? <Check className="h-4 w-4" aria-hidden="true" /> : index + 1}
                </span>
                <span className={cn("hidden text-sm font-medium sm:block", current ? "text-secondary" : "text-gray-500")}>
                  {label}
                </span>
                {index < STEPS.length - 1 && (
                  <span className={cn("h-0.5 flex-1 rounded", done ? "bg-primary" : "bg-gray-200")} aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="overflow-hidden px-6 py-8 md:px-10">
        {state.interestedTour && (
          <p className="mb-6 rounded-md bg-primary/10 px-4 py-2 text-sm text-secondary">
            Enquiring about <strong>{state.interestedTour}</strong>. Tell us a little more and
            we'll tailor it to you.
          </p>
        )}

        {/* Each step mounts immediately and slides in with a CSS animation. Nothing
            waits on a JavaScript animation finishing, so the wizard cannot stall in
            a throttled or background tab. */}
        <div
          key={step}
          className={cn(
            hasMoved && "animate-in fade-in-0 duration-300",
            hasMoved && (direction > 0 ? "slide-in-from-right-8" : "slide-in-from-left-8"),
          )}
        >
            {step === 0 && (
              <fieldset>
                <legend className="w-full">
                  <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-secondary outline-none">
                    What kind of India are you dreaming of?
                  </h2>
                  <p className="mt-1 text-gray-600">Choose as many as you like.</p>
                </legend>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {VIBES.map((vibe) => {
                    const selected = state.vibes.includes(vibe.id);
                    const Icon = vibe.icon;
                    return (
                      <button
                        key={vibe.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleVibe(vibe.id)}
                        className={cn(
                          "relative rounded-xl border-2 p-5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          selected
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-gray-200 hover:border-primary/50 hover:shadow-sm",
                        )}
                      >
                        {selected && (
                          <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                            <Check className="h-4 w-4" aria-hidden="true" />
                          </span>
                        )}
                        <Icon className={cn("h-8 w-8", selected ? "text-primary" : "text-secondary")} aria-hidden="true" />
                        <span className="mt-3 block font-semibold text-secondary">{vibe.label}</span>
                        <span className="mt-1 block text-sm text-gray-600">{vibe.blurb}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.vibes && <p className="mt-3 text-sm text-destructive" role="alert">{errors.vibes}</p>}
              </fieldset>
            )}

            {step === 1 && (
              <fieldset>
                <legend className="w-full">
                  <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-secondary outline-none">
                    Who's travelling?
                  </h2>
                  <p className="mt-1 text-gray-600">Every trip is private: just you and your own driver and guides.</p>
                </legend>
                <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {CREWS.map((option) => {
                    const selected = state.crew === option.id;
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => chooseCrew(option.id)}
                        className={cn(
                          "rounded-xl border-2 p-5 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          selected
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-gray-200 hover:border-primary/50",
                        )}
                      >
                        <Icon className={cn("mx-auto h-8 w-8", selected ? "text-primary" : "text-secondary")} aria-hidden="true" />
                        <span className="mt-3 block font-semibold text-secondary">{option.id}</span>
                        <span className="mt-1 block text-sm text-gray-600">{option.blurb}</span>
                      </button>
                    );
                  })}
                </div>
                {crew?.adjustable && (
                  <div className="mt-6 flex items-center justify-between rounded-lg bg-gray-50 px-5 py-4">
                    <span className="font-medium text-secondary" id="travellers-label">How many travellers?</span>
                    <div className="flex items-center gap-4" role="group" aria-labelledby="travellers-label">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label="Fewer travellers"
                        disabled={state.travellers <= 2}
                        onClick={() => update({ travellers: state.travellers - 1 })}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center text-xl font-semibold tabular-nums" aria-live="polite">
                        {state.travellers}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label="More travellers"
                        disabled={state.travellers >= 20}
                        onClick={() => update({ travellers: state.travellers + 1 })}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                {errors.crew && <p className="mt-3 text-sm text-destructive" role="alert">{errors.crew}</p>}
              </fieldset>
            )}

            {step === 2 && (
              <div>
                <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-secondary outline-none">
                  How long, and what budget feels right?
                </h2>
                <p className="mt-1 text-gray-600">Rough numbers are perfect. We'll fine-tune everything with you.</p>

                <div className="mt-8 space-y-10">
                  <div>
                    <div className="flex items-baseline justify-between">
                      <Label id="days-label" className="text-base">Trip length</Label>
                      <span className="text-2xl font-bold text-primary tabular-nums">{state.days} days</span>
                    </div>
                    <Slider
                      aria-labelledby="days-label"
                      className="mt-4"
                      min={DURATION.min}
                      max={DURATION.max}
                      step={1}
                      value={[state.days]}
                      onValueChange={([value]) => update({ days: value })}
                    />
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                      <span>{DURATION.min} days</span>
                      <span>{DURATION.max} days</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <Label id="budget-label" className="text-base">Budget per person, excluding international flights</Label>
                      <span className="text-2xl font-bold text-primary tabular-nums">{budgetLabel}</span>
                    </div>
                    <div className="mt-3 inline-flex rounded-md border p-1" role="radiogroup" aria-label="Currency">
                      {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                        <button
                          key={code}
                          type="button"
                          role="radio"
                          aria-checked={state.currency === code}
                          onClick={() => chooseCurrency(code)}
                          className={cn(
                            "rounded px-4 py-1.5 text-sm font-medium transition-colors",
                            state.currency === code ? "bg-secondary text-white" : "text-gray-600 hover:bg-gray-100",
                          )}
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                    <Slider
                      aria-labelledby="budget-label"
                      className="mt-4"
                      min={currency.min}
                      max={currency.max}
                      step={currency.step}
                      value={[state.budget]}
                      onValueChange={([value]) => update({ budget: value })}
                    />
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                      <span>{formatMoney(currency.min, state.currency)}</span>
                      <span>{formatMoney(currency.max, state.currency)}+</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="planner-month" className="text-base">When would you like to travel?</Label>
                    <select
                      id="planner-month"
                      value={state.month}
                      onChange={(event) => update({ month: event.target.value })}
                      className={cn(selectClass, "mt-2 w-full sm:w-72")}
                    >
                      <option value="">I'm flexible</option>
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>{month.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-secondary outline-none">
                  Where should we send your itinerary?
                </h2>
                <p className="mt-1 text-gray-600">
                  A specialist replies within 24 hours with a first draft and quote. Free, with no obligation.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <Label htmlFor="planner-name">Full name</Label>
                    <Input
                      id="planner-name"
                      autoComplete="name"
                      value={state.name}
                      onChange={(event) => update({ name: event.target.value })}
                      aria-invalid={Boolean(errors.name)}
                      className="mt-2"
                    />
                    {errors.name && <p className="mt-1 text-sm text-destructive" role="alert">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="planner-email">Email</Label>
                    <Input
                      id="planner-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={state.email}
                      onChange={(event) => update({ email: event.target.value })}
                      aria-invalid={Boolean(errors.email)}
                      className="mt-2"
                    />
                    {errors.email && <p className="mt-1 text-sm text-destructive" role="alert">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="planner-country">Country of residence</Label>
                    <select
                      id="planner-country"
                      autoComplete="country-name"
                      value={state.country}
                      onChange={(event) => chooseCountry(event.target.value)}
                      aria-invalid={Boolean(errors.country)}
                      className={cn(selectClass, "mt-2 w-full")}
                    >
                      <option value="" disabled>Select your country</option>
                      {COUNTRIES.map((country) => (
                        <option key={country.name} value={country.name}>{country.name}</option>
                      ))}
                    </select>
                    {errors.country && <p className="mt-1 text-sm text-destructive" role="alert">{errors.country}</p>}
                  </div>
                  <div>
                    <Label htmlFor="planner-whatsapp">WhatsApp number</Label>
                    <div className="mt-2 flex gap-2">
                      <select
                        aria-label="Country calling code"
                        value={state.dial}
                        onChange={(event) => {
                          setDialTouched(true);
                          update({ dial: event.target.value });
                        }}
                        className={cn(selectClass, "w-32 shrink-0")}
                      >
                        {DIAL_CODES.map((item) => (
                          <option key={item.dial} value={item.dial}>{item.label}</option>
                        ))}
                      </select>
                      <Input
                        id="planner-whatsapp"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel-national"
                        value={state.whatsapp}
                        onChange={(event) => update({ whatsapp: event.target.value })}
                        aria-invalid={Boolean(errors.whatsapp)}
                        className="flex-1"
                      />
                    </div>
                    {errors.whatsapp && <p className="mt-1 text-sm text-destructive" role="alert">{errors.whatsapp}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="planner-notes">Anything we should know? <span className="font-normal text-gray-500">(optional)</span></Label>
                    <textarea
                      id="planner-notes"
                      rows={3}
                      maxLength={400}
                      value={state.notes}
                      onChange={(event) => update({ notes: event.target.value })}
                      placeholder="A special occasion, must-see places, dietary or mobility needs…"
                      className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  {/* Honeypot */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="planner-company">Company</label>
                    <input
                      id="planner-company"
                      tabIndex={-1}
                      autoComplete="off"
                      value={state.company}
                      onChange={(event) => update({ company: event.target.value })}
                    />
                  </div>
                </div>

                <p className="mt-5 flex items-start gap-2 text-xs text-gray-500">
                  <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>
                    We only use your details to plan this trip, and never share them. See our{" "}
                    <Link to="/privacy" className="underline hover:text-primary">privacy policy</Link>.
                  </span>
                </p>

                {status === "error" && (
                  <div className="mt-5 rounded-md border border-orange-200 bg-orange-50 p-4 text-sm text-gray-700" role="alert">
                    {serverMessage || "We couldn't send your request just now."} Please try again, or{" "}
                    <a href={whatsappFallback} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">
                      send it to us on WhatsApp
                    </a>{" "}
                    and we'll take it from there.
                  </div>
                )}
              </div>
            )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t bg-gray-50 px-6 py-4 md:px-10">
        {step > 0 ? (
          <Button type="button" variant="ghost" onClick={() => goTo(step - 1)} disabled={status === "submitting"}>
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Back
          </Button>
        ) : (
          <span className="text-sm text-gray-500">Takes about a minute</span>
        )}

        {/* Distinct keys: without them React reuses one <button> for both, and the
            click on "Continue" would also fire as a submit on the last step. */}
        {step < STEPS.length - 1 ? (
          <Button key="next" type="button" size="lg" onClick={handleNext} className="bg-accent hover:bg-accent/90">
            Continue
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        ) : (
          <Button key="submit" type="submit" size="lg" disabled={status === "submitting"} className="bg-accent hover:bg-accent/90">
            {status === "submitting" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Sending…
              </>
            ) : (
              "Get my free itinerary"
            )}
          </Button>
        )}
      </div>
    </form>
  );
}
