import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Download, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import FaqList from "@/components/FaqList";
import Seo from "@/components/seo/Seo";
import SmartImage from "@/components/SmartImage";
import TourCard from "@/components/TourCard";
import TrustBanner from "@/components/trust/TrustBanner";
import ReviewsWidget from "@/components/trust/ReviewsWidget";
import { openLeadMagnet } from "@/components/lead/leadMagnet";
import { homeFaqs } from "@/data/faqs";
import { pickFeatured, useTours } from "@/hooks/useTours";
import { faqSchema, tourListSchema } from "@/lib/schema";

const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    alt: "Iconic Taj Mahal at sunrise - Golden Triangle tour highlight in Agra, India",
  },
  {
    src: "https://images.pexels.com/photos/6440428/pexels-photo-6440428.jpeg",
    alt: "Magnificent Rajasthan palace architecture showcasing royal heritage and luxury travel experiences",
  },
  {
    src: "https://images.unsplash.com/photo-1587474260584-136574528ed5?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0",
    alt: "Historic Red Fort Delhi - Gateway to India's rich Mughal heritage and cultural tourism",
  },
];

export default function Index() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Only the first hero photo is part of the initial page load. The other two
  // are fetched a moment later, in time for the first cross-fade.
  const [showAllSlides, setShowAllSlides] = useState(false);
  const { data: tours = [], isLoading, isError } = useTours();
  const featuredTours = pickFeatured(tours, 3);

  useEffect(() => {
    const preload = window.setTimeout(() => setShowAllSlides(true), 2500);
    const interval = window.setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => {
      window.clearTimeout(preload);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Seo
        title="Private India Tours: Golden Triangle & Rajasthan | Orbit Trails"
        description="Private, tailor-made tours of India with your own driver, expert guides and hand-picked heritage hotels. Golden Triangle, Rajasthan and beyond, planned around you."
        path="/"
        jsonLd={[
          faqSchema(homeFaqs),
          ...(featuredTours.length
            ? [tourListSchema("Featured private tours of India", featuredTours)]
            : []),
        ]}
      />

      {/* Hero */}
      <section className="relative flex h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-secondary">
          {heroImages.map((image, index) =>
            index === 0 || showAllSlides ? (
              <div
                key={image.src}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <SmartImage
                  src={image.src}
                  alt={image.alt}
                  priority={index === 0}
                  sizes="100vw"
                  widths={[640, 960, 1280, 1920]}
                  fallbackSrc={null}
                  className="h-full w-full bg-secondary object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>
            ) : null,
          )}
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6 text-5xl font-bold leading-tight md:text-7xl"
          >
            Discover the Magic of{" "}
            <span className="block text-primary">India</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mx-auto mb-8 max-w-2xl text-xl text-gray-200 md:text-2xl"
          >
            Private, tailor-made journeys through the Golden Triangle, royal Rajasthan and
            beyond, with your own driver, expert guides and hand-picked heritage hotels
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Button asChild size="lg" className="bg-accent px-8 py-3 text-lg text-white hover:bg-accent/90">
              <Link to="/plan-my-trip">
                Plan My Trip
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white bg-transparent px-8 py-3 text-lg font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-secondary"
            >
              <Link to="/tours">Explore Tours</Link>
            </Button>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce text-white" aria-hidden="true">
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white">
            <div className="mt-2 h-3 w-1 rounded-full bg-white"></div>
          </div>
        </div>
      </section>

      <TrustBanner heading="Why travellers from abroad choose Orbit Trails" />

      {/* Featured Tours */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-secondary">Featured Tours</h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              Discover our most popular itineraries. Each one is private, and every one can be
              reshaped around your dates and interests.
            </p>
          </AnimatedSection>

          {isLoading ? (
            <div className="py-12 text-center" role="status">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
              <p className="text-gray-600">Loading featured tours...</p>
            </div>
          ) : isError || featuredTours.length === 0 ? (
            <div className="mx-auto max-w-2xl py-12 text-center">
              <h3 className="mb-4 text-2xl font-semibold text-gray-800">
                Explore Our Tour Collection
              </h3>
              <p className="mb-8 leading-relaxed text-gray-600">
                We're currently updating our featured tours. Discover our complete collection of
                carefully crafted tour packages covering India's most incredible destinations.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" className="bg-primary px-8 hover:bg-primary/90">
                  <Link to="/tours">
                    View All Tours
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary px-8 text-primary hover:bg-primary hover:text-white"
                >
                  <Link to="/plan-my-trip">Create Custom Tour</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featuredTours.map((tour, index) => (
                  <AnimatedSection key={tour._id} delay={index * 0.1} direction="up" className="h-full">
                    <TourCard tour={tour} badge={index === 0 ? "Best Seller" : undefined} />
                  </AnimatedSection>
                ))}
              </div>
              <div className="mt-12 text-center">
                <Button asChild size="lg" variant="outline" className="px-8">
                  <Link to="/tours">
                    View All Tours
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Tailor-made + planning resources: links into the deeper landing pages */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <AnimatedSection className="rounded-2xl bg-secondary p-8 text-white lg:col-span-1">
            <Sparkles className="h-8 w-8 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-bold">Luxury private tours, made to measure</h2>
            <p className="mt-3 text-gray-300">
              No fixed departures and no coach groups. See how our tailor-made India itineraries
              work and browse the journeys guests book most.
            </p>
            <Link
              to="/luxury-private-tours-india"
              className="mt-6 inline-flex items-center font-semibold text-primary hover:underline"
            >
              Luxury private tours of India
              <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Link>
          </AnimatedSection>

          <AnimatedSection delay={0.1} className="rounded-2xl border border-gray-200 bg-gray-50 p-8">
            <BookOpen className="h-8 w-8 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-bold text-secondary">First time in India?</h2>
            <p className="mt-3 text-gray-600">
              Visas, safety, health, money and etiquette, answered plainly by the people who
              host overseas travellers every week.
            </p>
            <Link
              to="/india-travel-guide-first-time-visitors"
              className="mt-6 inline-flex items-center font-semibold text-primary hover:underline"
            >
              Read the first-time India travel guide
              <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Link>
          </AnimatedSection>

          <AnimatedSection delay={0.2} className="rounded-2xl border border-gray-200 bg-gray-50 p-8">
            <Download className="h-8 w-8 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-bold text-secondary">Free 14-day route planner</h2>
            <p className="mt-3 text-gray-600">
              Delhi, Agra, Ranthambore, Jaipur, Jodhpur and Udaipur: the route we plan most,
              day by day, as a PDF.
            </p>
            <button
              type="button"
              onClick={() => openLeadMagnet("home-card")}
              className="mt-6 inline-flex items-center font-semibold text-primary hover:underline"
            >
              Download the North India route planner
              <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </button>
          </AnimatedSection>
        </div>
      </section>

      <ReviewsWidget limit={3} />

      {/* FAQ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-secondary">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about planning your India trip with Orbit Trails
            </p>
          </AnimatedSection>
          <FaqList items={homeFaqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="mb-6 text-4xl font-bold">Ready to Start Your Indian Adventure?</h2>
            <p className="mb-8 text-xl text-gray-300">
              Let us create a personalized itinerary that matches your interests, budget, and
              travel style
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-accent px-8 py-3 text-lg font-semibold text-white shadow-lg hover:bg-accent/90 hover:text-white"
              >
                <Link to="/plan-my-trip">
                  Customize Your Tour
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white bg-transparent px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:border-white hover:bg-white hover:text-secondary"
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
