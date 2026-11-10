import { Link } from "react-router-dom";
import { ArrowRight, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqList from "@/components/FaqList";
import Seo from "@/components/seo/Seo";
import SmartImage from "@/components/SmartImage";
import TourCard from "@/components/TourCard";
import TripPlanner from "@/components/planner/TripPlanner";
import { VIBES } from "@/components/planner/plannerOptions";
import TrustBanner from "@/components/trust/TrustBanner";
import ReviewsWidget from "@/components/trust/ReviewsWidget";
import { openLeadMagnet } from "@/components/lead/leadMagnet";
import { privateTourFaqs } from "@/data/faqs";
import { pickFeatured, useTours } from "@/hooks/useTours";
import { breadcrumbSchema, faqSchema, tourListSchema } from "@/lib/schema";

const PATH = "/luxury-private-tours-india";
const HERO_IMAGE = "https://images.orbittrails.com/regal-palms.jpg";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Luxury Private Tours of India", path: PATH },
];

const planningSteps = [
  {
    title: "Tell us how you like to travel",
    body: "Share your dates, interests, pace and budget in the trip planner. It takes about a minute.",
  },
  {
    title: "Receive a tailor-made itinerary",
    body: "Within 24 hours a specialist sends a day-by-day route with hotels chosen for you and a clear, itemised price.",
  },
  {
    title: "Refine every detail",
    body: "Swap a hotel, add a safari, slow the pace. We revise the itinerary as often as you like, at no cost.",
  },
  {
    title: "Travel with a team behind you",
    body: "Your driver meets you at the airport, and your concierge in India is on call 24/7 until you fly home.",
  },
];

const inclusions = [
  "A private, air-conditioned car and the same English-speaking driver throughout",
  "Hand-picked 4 and 5-star hotels, heritage havelis and palace stays",
  "Expert local guides at every monument, just for your party",
  "Monument entrance fees and the experiences listed in your itinerary",
  "Airport meet-and-greet and all transfers within India",
  "24/7 support from our team on the ground",
];

export default function LuxuryPrivateTours() {
  const { data: tours = [], isLoading } = useTours();
  // Best-rated first, so the strongest itineraries lead the page.
  const itineraries = pickFeatured(tours, tours.length);

  return (
    <>
      <Seo
        title="Luxury Private Tours of India | Tailor-Made | Orbit Trails"
        description="Luxury private tours of India designed around you: tailor-made itineraries, palace hotels, your own driver and expert guides, with 24/7 local support. Free quote in 24 hours."
        path={PATH}
        image={HERO_IMAGE}
        jsonLd={[
          breadcrumbSchema(crumbs),
          faqSchema(privateTourFaqs),
          ...(itineraries.length
            ? [tourListSchema("Luxury private tours of India", itineraries)]
            : []),
        ]}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-secondary">
        <SmartImage
          src={HERO_IMAGE}
          alt="Palm-lined backwaters in Kerala at dusk, on a private tour of India"
          priority
          sizes="100vw"
          fallbackSrc={null}
          className="absolute inset-0 -z-10 h-full w-full bg-secondary object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/40" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <Breadcrumbs crumbs={crumbs} inverted className="mb-6" />
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Tailor-made India itineraries
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-white md:text-6xl">
              Luxury Private Tours of India
            </h1>
            <p className="mt-6 text-lg text-gray-200 md:text-xl">
              Your own car and driver, expert guides who are there only for you, and palace
              hotels chosen in person. Every journey is designed from scratch around your dates,
              your pace and the India you want to see.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-accent px-8 text-lg hover:bg-accent/90">
                <a href="#plan">
                  Design My Trip
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white bg-transparent px-8 text-lg text-white hover:bg-white hover:text-secondary"
              >
                <a href="#itineraries">See Sample Itineraries</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What it is */}
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-bold text-secondary">
              What is a luxury private tour of India?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              A luxury private tour of India is a journey arranged for you alone. There is no
              coach, no group and no fixed departure date: you travel in your own car with your
              own driver, meet a private guide at each sight, and stay in hotels selected for
              their character and service.
            </p>
            <p className="mt-4 leading-relaxed text-gray-600">
              It is also the most comfortable way to see a country that can feel overwhelming on
              a first visit. Someone meets you at the airport, the logistics are handled before
              you arrive, and if you want to linger over lunch in Jaipur or leave for the Taj
              Mahal before dawn, the day simply bends around you.
            </p>
            <p className="mt-4 leading-relaxed text-gray-600">
              New to India? Start with our{" "}
              <Link to="/india-travel-guide-first-time-visitors" className="font-medium text-primary hover:underline">
                first-time India travel guide
              </Link>{" "}
              for visas, safety, health and etiquette.
            </p>
          </div>
          <div className="rounded-2xl bg-gray-50 p-8">
            <h2 className="text-xl font-bold text-secondary">Included in every private tour</h2>
            <ul className="mt-5 space-y-3">
              {inclusions.map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-700">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <TrustBanner />

      {/* Featured itineraries */}
      <section id="itineraries" className="scroll-mt-20 bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-secondary md:text-4xl">
              Private India itineraries to start from
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              These are the journeys our guests book most. Treat each as a first draft: add
              days, change hotels or combine two routes and we will re-plan it for you.
            </p>
          </div>

          {isLoading ? (
            <div className="py-16 text-center" role="status">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
              <p className="text-gray-600">Loading itineraries...</p>
            </div>
          ) : itineraries.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {itineraries.map((tour) => (
                <TourCard key={tour._id} tour={tour} />
              ))}
            </div>
          ) : (
            <p className="mt-12 text-center text-gray-600">
              Our sample itineraries are being updated.{" "}
              <a href="#plan" className="font-medium text-primary hover:underline">
                Tell us what you have in mind
              </a>{" "}
              and we will design one for you.
            </p>
          )}

          <div className="mt-12 text-center">
            <Link to="/tours" className="inline-flex items-center font-semibold text-primary hover:underline">
              Browse all India tour packages
              <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Travel styles */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-secondary md:text-4xl">
              Tailor-made around the way you travel
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Pick a starting point. Most guests combine two or three in one journey.
            </p>
          </div>
          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VIBES.map((vibe) => (
              <li key={vibe.id}>
                <Link
                  to={`/plan-my-trip?vibe=${vibe.id}`}
                  className="group flex h-full items-start gap-4 rounded-xl border border-gray-200 p-6 transition-all hover:border-primary hover:shadow-md"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <vibe.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-lg font-semibold text-secondary group-hover:text-primary">
                      {vibe.label}
                    </span>
                    <span className="mt-1 block text-sm text-gray-600">{vibe.blurb}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-secondary md:text-4xl">
            How a tailor-made India itinerary comes together
          </h2>
          <ol className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {planningSteps.map((step, index) => (
              <li key={step.title} className="rounded-xl bg-white p-6 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-secondary">{step.title}</h3>
                <p className="mt-2 text-gray-600">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ReviewsWidget limit={3} className="bg-white" />

      {/* Planner */}
      <section id="plan" className="scroll-mt-20 bg-secondary py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center text-white">
            <h2 className="text-3xl font-bold md:text-4xl">Start designing your private tour</h2>
            <p className="mt-4 text-lg text-gray-300">
              Answer four quick questions and receive a tailor-made itinerary and quote within
              24 hours. It is free, and there is no obligation to book.
            </p>
          </div>
          <TripPlanner />
          <p className="mt-8 text-center text-gray-300">
            Still researching?{" "}
            <button
              type="button"
              onClick={() => openLeadMagnet("hub-inline")}
              className="inline-flex items-center font-semibold text-primary hover:underline"
            >
              <Download className="mr-1 h-4 w-4" aria-hidden="true" />
              Download our free 14-day North India route planner
            </button>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-3xl font-bold text-secondary md:text-4xl">
            Private tours of India: your questions answered
          </h2>
          <FaqList items={privateTourFaqs} />
        </div>
      </section>
    </>
  );
}
