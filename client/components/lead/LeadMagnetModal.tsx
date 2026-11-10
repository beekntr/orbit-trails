import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { Check, Download, FileText, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrbitTrailsAPI } from "@shared/api";
import { routePlanner } from "@/data/northIndiaRoute";
import { track, trackLead } from "@/lib/analytics";
import { DIAL_CODES } from "@/components/planner/plannerOptions";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const selectClass =
  "h-10 w-32 shrink-0 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/** Region (from the browser's language, e.g. "en-GB") to calling code, so most visitors never touch the selector. */
const REGION_DIAL: Record<string, string> = {
  US: "+1", CA: "+1", GB: "+44", AU: "+61", IE: "+353", DE: "+49", FR: "+33", NL: "+31",
  ES: "+34", IT: "+39", CH: "+41", SE: "+46", ZA: "+27", SA: "+966", AE: "+971", NZ: "+64",
  SG: "+65", IN: "+91",
};

function guessDialCode(): string {
  const languages = typeof navigator !== "undefined" ? navigator.languages ?? [navigator.language] : [];
  for (const language of languages) {
    const region = language?.split("-")[1]?.toUpperCase();
    if (region && REGION_DIAL[region]) return REGION_DIAL[region];
  }
  return "+1";
}

type Field = "name" | "email" | "phone";

function startDownload() {
  const link = document.createElement("a");
  link.href = routePlanner.file;
  link.download = "";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

interface LeadMagnetModalProps {
  /** What opened the modal: "exit-intent", "timer" or "cta". Sent with the lead. */
  trigger: string;
  /** `converted` is true once the email was captured. */
  onClose: (converted: boolean) => void;
}

/**
 * "Download the Ultimate 14-Day North India Route Planner" offer.
 * The email is saved through the existing /api/contact endpoint first; the
 * PDF download only starts once the server has accepted it.
 */
export default function LeadMagnetModal({ trigger, onClose }: LeadMagnetModalProps) {
  const { pathname } = useLocation();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [dial, setDial] = useState(guessDialCode);
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  /** A problem with the request as a whole (server refused it, or could not be reached). */
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  useEffect(() => {
    track("lead_magnet_view", { trigger, page: pathname });
    // Only when the modal first opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (status === "submitting") return;

    const nextErrors: Partial<Record<Field, string>> = {};
    if (firstName.trim().length < 2) nextErrors.name = "Please enter your first name.";
    if (!EMAIL_PATTERN.test(email.trim())) nextErrors.email = "Please enter a valid email address.";
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 6 || digits.length > 15) nextErrors.phone = "Please enter your phone number.";
    setErrors(nextErrors);
    setError(null);
    if (Object.keys(nextErrors).length) {
      document.getElementById(`lead-${Object.keys(nextErrors)[0]}`)?.focus();
      return;
    }

    if (company) {
      setStatus("done");
      return;
    }

    setStatus("submitting");
    const response = await OrbitTrailsAPI.submitContact({
      name: firstName.trim(),
      email: email.trim(),
      phone: `${dial} ${phone.replace(/[^\d\s-]/g, "").trim()}`,
      message: `Lead magnet: requested "${routePlanner.title}" (PDF). Page: ${pathname}. Opened by: ${trigger}.`,
      source: "lead-magnet",
    });

    if (!response.success) {
      setStatus("idle");
      // The server explains validation and rate-limit refusals; anything else is a connection problem.
      const serverMessage = response.message && !/network|invalid response/i.test(response.message);
      setError(serverMessage ? response.message : "We couldn't reach our server. Please try again in a moment.");
      return;
    }

    setStatus("done");
    trackLead("lead_magnet", { trigger });
    startDownload();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose(status === "done")}>
      <DialogContent className="max-w-3xl gap-0 overflow-hidden p-0">
        <div className="grid md:grid-cols-5">
          {/* Cover */}
          <div className="hidden flex-col justify-between bg-secondary p-8 text-white md:col-span-2 md:flex">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                Free PDF guide
              </span>
              <p className="mt-6 text-2xl font-bold leading-tight">{routePlanner.shortTitle}</p>
              <p className="mt-3 text-sm text-gray-300">{routePlanner.route}</p>
            </div>
            <ol className="mt-8 space-y-2 text-sm text-gray-200">
              {routePlanner.stops.map((stop) => (
                <li key={stop.place} className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="font-medium">{stop.place}</span>
                  <span className="text-gray-400">
                    {stop.nights} {stop.nights === 1 ? "night" : "nights"}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Form */}
          <div className="max-h-[90vh] overflow-y-auto p-6 sm:p-8 md:col-span-3">
            {status === "done" ? (
              <div role="status">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-6 w-6" aria-hidden="true" />
                </span>
                <DialogTitle className="mt-4 text-2xl text-secondary">Your planner is downloading</DialogTitle>
                <DialogDescription className="mt-2 text-base text-gray-600">
                  If it didn't start,{" "}
                  <a href={routePlanner.file} download className="font-semibold text-primary underline">
                    download the PDF here
                  </a>
                  . Want this route shaped around your dates and budget?
                </DialogDescription>
                <Button asChild size="lg" className="mt-6 w-full bg-accent hover:bg-accent/90">
                  <Link to="/plan-my-trip" onClick={() => onClose(true)}>
                    Plan my tailor-made trip
                  </Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <DialogTitle className="text-2xl leading-tight text-secondary">
                  Download the Ultimate 14-Day North India Route Planner
                </DialogTitle>
                <DialogDescription className="mt-2 text-base text-gray-600">
                  The exact route our specialists plan for first-time visitors. Free, as a PDF.
                </DialogDescription>

                <ul className="mt-5 space-y-2 text-sm text-gray-700">
                  {routePlanner.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      {bullet}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="lead-name">First name</Label>
                    <Input
                      id="lead-name"
                      autoComplete="given-name"
                      required
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "lead-name-error" : undefined}
                      className="mt-1.5"
                    />
                    {errors.name && (
                      <p id="lead-name-error" className="mt-1 text-sm text-destructive" role="alert">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lead-email">Email</Label>
                    <Input
                      id="lead-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "lead-email-error" : undefined}
                      className="mt-1.5"
                    />
                    {errors.email && (
                      <p id="lead-email-error" className="mt-1 text-sm text-destructive" role="alert">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lead-phone">
                      Phone number <span className="font-normal text-gray-500">(WhatsApp if you have it)</span>
                    </Label>
                    <div className="mt-1.5 flex gap-2">
                      <select
                        aria-label="Country calling code"
                        value={dial}
                        onChange={(event) => setDial(event.target.value)}
                        className={selectClass}
                      >
                        {DIAL_CODES.map((item) => (
                          <option key={item.dial} value={item.dial}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                      <Input
                        id="lead-phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel-national"
                        required
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? "lead-phone-error" : undefined}
                        className="flex-1"
                      />
                    </div>
                    {errors.phone && (
                      <p id="lead-phone-error" className="mt-1 text-sm text-destructive" role="alert">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  {error && (
                    <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-destructive" role="alert">
                      {error}
                    </p>
                  )}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="lead-company">Company</label>
                    <input
                      id="lead-company"
                      tabIndex={-1}
                      autoComplete="off"
                      value={company}
                      onChange={(event) => setCompany(event.target.value)}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={status === "submitting"}
                  className="mt-6 w-full bg-accent hover:bg-accent/90"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Preparing your download…
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                      Send me the free planner
                    </>
                  )}
                </Button>
                <p className="mt-3 text-xs text-gray-500">
                  We use your email and phone number to follow up about your India trip. No spam,
                  and you can ask us to stop at any time. See our{" "}
                  <Link to="/privacy" className="underline" onClick={() => onClose(false)}>
                    privacy policy
                  </Link>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
