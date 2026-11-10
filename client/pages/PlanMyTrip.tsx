import { CalendarCheck, FileText, MessagesSquare } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Seo from "@/components/seo/Seo";
import TripPlanner from "@/components/planner/TripPlanner";
import TrustBanner from "@/components/trust/TrustBanner";
import { breadcrumbSchema } from "@/lib/schema";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Plan My Trip", path: "/plan-my-trip" },
];

const nextSteps = [
  {
    icon: MessagesSquare,
    title: "A specialist reads your brief",
    body: "A real person based in India, not an automated quote engine, reviews what you told us.",
  },
  {
    icon: FileText,
    title: "Your first itinerary within 24 hours",
    body: "A day-by-day route with hotels and a clear price, sent by email. It costs nothing to receive.",
  },
  {
    icon: CalendarCheck,
    title: "Refine it until it is right",
    body: "Change the pace, hotels or route as often as you like. You only book when you are happy.",
  },
];

export default function PlanMyTrip() {
  return (
    <>
      <Seo
        title="Plan Your Tailor-Made India Trip | Orbit Trails"
        description="Tell us your travel style, dates and budget in four quick steps and receive a free, tailor-made India itinerary from a local specialist within 24 hours."
        path="/plan-my-trip"
        jsonLd={breadcrumbSchema(crumbs)}
      />

      <section className="bg-gradient-to-r from-secondary to-secondary/90 pb-32 pt-14">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Breadcrumbs crumbs={crumbs} inverted className="mb-6 flex justify-center" />
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            Plan your tailor-made India trip
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-200">
            Four quick questions. Then a specialist in India designs a private itinerary around
            your answers, free and with no obligation.
          </p>
        </div>
      </section>

      <section className="-mt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <TripPlanner />
        </div>
      </section>

      <section className="pb-20" aria-labelledby="next-steps">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 id="next-steps" className="text-center text-2xl font-bold text-secondary md:text-3xl">
            What happens after you send it
          </h2>
          <ol className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {nextSteps.map((step, index) => (
              <li key={step.title} className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <step.icon className="h-7 w-7" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-secondary">
                  {index + 1}. {step.title}
                </h3>
                <p className="mt-2 text-gray-600">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <TrustBanner variant="light" />
    </>
  );
}
