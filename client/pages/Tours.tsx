import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Breadcrumbs from "@/components/Breadcrumbs";
import Seo from "@/components/seo/Seo";
import TourCard from "@/components/TourCard";
import { useTours } from "@/hooks/useTours";
import { breadcrumbSchema, tourListSchema } from "@/lib/schema";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "Golden Triangle", blurb: "Delhi, Agra & Jaipur" },
  { id: "Rajasthan Tours", blurb: "Royal palaces" },
  { id: "Extended Tours", blurb: "Multi-destination" },
] as const;

const crumbs = [
  { name: "Home", path: "/" },
  { name: "India Tours", path: "/tours" },
];

export default function Tours() {
  const { data: tours = [], isLoading, isError, refetch, isFetching } = useTours();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTours = selectedCategory
    ? tours.filter((tour) => tour.category === selectedCategory)
    : tours;

  return (
    <>
      <Seo
        title="India Tour Packages: Golden Triangle & Rajasthan | Orbit Trails"
        description="Browse private India tour itineraries: Golden Triangle classics, royal Rajasthan journeys and extended trips. Every itinerary can be tailored to your dates and budget."
        path="/tours"
        jsonLd={[
          breadcrumbSchema(crumbs),
          ...(tours.length ? [tourListSchema("India tour packages by Orbit Trails", tours)] : []),
        ]}
      />

      <section className="relative bg-gradient-to-r from-secondary to-secondary/90 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <Breadcrumbs crumbs={crumbs} inverted className="mb-6 flex justify-center" />
          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            India Tour Packages: Golden Triangle & Rajasthan Tours
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-200">
            Discover India's incredible destinations with our carefully crafted private
            itineraries, from the iconic Golden Triangle to royal Rajasthan. Each one is a
            starting point you can{" "}
            <Link to="/plan-my-trip" className="underline hover:text-primary">
              tailor to your own trip
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="py-20 text-center" role="status">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
              <p className="text-gray-600">Loading tours...</p>
            </div>
          ) : isError ? (
            <Card className="mx-auto max-w-3xl border-orange-200 bg-orange-50">
              <CardContent className="p-8 text-center">
                <AlertCircle className="mx-auto mb-4 h-16 w-16 text-orange-500" aria-hidden="true" />
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                  We're experiencing technical difficulties
                </h2>
                <p className="mb-6 leading-relaxed text-gray-600">
                  Our tour list is temporarily unavailable. We apologize for the inconvenience.
                  Please try again, or tell us what you're looking for and we'll send
                  itineraries to you directly.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <Button onClick={() => refetch()} disabled={isFetching} className="bg-primary hover:bg-primary/90">
                    <RefreshCcw className={cn("mr-2 h-4 w-4", isFetching && "animate-spin")} aria-hidden="true" />
                    Try Again
                  </Button>
                  <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                    <Link to="/plan-my-trip">Plan a Custom Tour</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <a href={`mailto:${SITE.email}`}>Email Us</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : tours.length === 0 ? (
            <div className="mx-auto max-w-2xl py-20 text-center">
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                Our Tour Collection is Coming Soon
              </h2>
              <p className="mb-8 leading-relaxed text-gray-600">
                We're carefully curating our tour packages to bring you the most authentic and
                memorable India experiences. In the meantime, let us create a custom tour just
                for you.
              </p>
              <Button asChild size="lg" className="bg-primary px-8 hover:bg-primary/90">
                <Link to="/plan-my-trip">Plan Custom Tour</Link>
              </Button>
            </div>
          ) : (
            <>
              <header className="mb-8 text-center">
                <h2 className="mb-4 text-3xl font-bold text-secondary">Browse Tours by Category</h2>
                <p className="text-gray-600">
                  Choose from our curated India tour categories or view all available packages
                </p>
              </header>

              <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6" role="group" aria-label="Filter tours by category">
                <button
                  type="button"
                  aria-pressed={selectedCategory === null}
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "rounded-lg border-2 p-5 text-center transition-colors",
                    selectedCategory === null
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-primary",
                  )}
                >
                  <span className="block text-lg font-semibold text-secondary">All Tours</span>
                  <span className="mt-1 block text-sm text-gray-600">{tours.length} packages</span>
                </button>
                {CATEGORIES.map((category) => {
                  const count = tours.filter((tour) => tour.category === category.id).length;
                  const selected = selectedCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setSelectedCategory(selected ? null : category.id)}
                      className={cn(
                        "rounded-lg border-2 p-5 text-center transition-colors",
                        selected ? "border-primary bg-primary/5" : "border-primary/20 hover:border-primary",
                      )}
                    >
                      <span className="block text-lg font-semibold text-secondary">{category.id}</span>
                      <span className="mt-1 block text-sm text-gray-600">
                        {category.blurb} · {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {filteredTours.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {filteredTours.map((tour, index) => (
                    <TourCard key={tour._id} tour={tour} priority={index < 3} />
                  ))}
                </div>
              ) : (
                <div className="mx-auto max-w-md py-12 text-center">
                  <h3 className="mb-2 text-xl font-semibold text-gray-600">
                    No tours found in {selectedCategory}
                  </h3>
                  <p className="mb-4 text-gray-500">
                    We don't have any tours in this category at the moment.
                  </p>
                  <Button onClick={() => setSelectedCategory(null)} className="bg-primary hover:bg-primary/90">
                    View All Tours
                  </Button>
                </div>
              )}
            </>
          )}

          <div className="mt-16 rounded-lg bg-gray-50 p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-secondary">
              Don't see what you're looking for?
            </h2>
            <p className="mb-6 text-gray-600">
              Every Orbit Trails journey is private, so any itinerary can be reshaped, or we can
              design one from scratch. See how our{" "}
              <Link to="/luxury-private-tours-india" className="font-medium text-primary hover:underline">
                luxury private tours of India
              </Link>{" "}
              work.
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
              <Link to="/plan-my-trip">Customize Your Tour</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
