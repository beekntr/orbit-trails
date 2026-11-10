import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Camera,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  RefreshCcw,
  Share2,
  Star,
  Users,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Breadcrumbs from "@/components/Breadcrumbs";
import Seo from "@/components/seo/Seo";
import SmartImage from "@/components/SmartImage";
import TourCard from "@/components/TourCard";
import TrustBanner from "@/components/trust/TrustBanner";
import { ApiError, useTour, useTours } from "@/hooks/useTours";
import { useToast } from "@/hooks/use-toast";
import { breadcrumbSchema, tourSchema } from "@/lib/schema";
import { SITE, truncate, whatsappLink } from "@/lib/site";
import { cleanTourName, tourPageTitle, tourTagline } from "@/lib/tourSeo";
import { cn } from "@/lib/utils";

export default function TourDetails() {
  const { slug } = useParams();
  const { toast } = useToast();
  const { data: tour, isLoading, error, refetch, isFetching, isPlaceholderData } = useTour(slug);
  const { data: allTours = [] } = useTours();

  const handleShare = () => {
    if (!tour) return;
    if (navigator.share) {
      navigator.share({ title: tour.name, text: tour.overview, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied! 📋",
        description: "Tour link has been copied to your clipboard successfully.",
        duration: 3000,
      });
    }
  };

  if (!tour && isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <title>Loading tour… | Orbit Trails</title>
        <div className="py-20 text-center" role="status">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-gray-600">Loading tour details...</p>
        </div>
      </div>
    );
  }

  if (!tour) {
    const notFound = error instanceof ApiError && error.kind === "not-found";

    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {notFound ? (
          // A tour that does not exist must not be indexed as a real page.
          <Seo
            title="Tour Not Found | Orbit Trails"
            description="This tour is no longer available. Browse our current private tours of India."
            path={`/tour-details/${slug}`}
            noindex
          />
        ) : (
          <title>Tour temporarily unavailable | Orbit Trails</title>
        )}
        <div className="py-20 text-center">
          <Card
            className={cn(
              "mx-auto max-w-2xl",
              notFound ? "border-gray-200" : "border-orange-200 bg-orange-50",
            )}
          >
            <CardContent className="p-8">
              {notFound ? (
                <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" aria-hidden="true" />
              ) : (
                <AlertCircle className="mx-auto mb-4 h-16 w-16 text-orange-500" aria-hidden="true" />
              )}
              <h1 className="mb-4 text-2xl font-bold text-gray-800">
                {notFound ? "Tour Not Found" : "We're experiencing technical difficulties"}
              </h1>
              <p className="mb-6 leading-relaxed text-gray-600">
                {notFound
                  ? "The requested tour could not be found. It may have been renamed or retired."
                  : "Sorry for the inconvenience! We're having trouble loading this tour's details. Our team is working to resolve this quickly."}
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                {!notFound && (
                  <Button onClick={() => refetch()} disabled={isFetching} className="bg-primary hover:bg-primary/90">
                    <RefreshCcw className={cn("mr-2 h-4 w-4", isFetching && "animate-spin")} aria-hidden="true" />
                    Try Again
                  </Button>
                )}
                <Button asChild variant="outline">
                  <Link to="/tours">Browse all tours</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-gray-600">
                Need immediate assistance? Email us at{" "}
                <a href={`mailto:${SITE.email}`} className="font-medium text-primary hover:underline">
                  {SITE.email}
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const path = `/tour-details/${tour.slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "India Tours", path: "/tours" },
    { name: tour.name, path },
  ];
  const images = tour.images ?? [];
  const highlights = tour.highlights ?? [];
  const itinerary = tour.itinerary ?? [];
  const included = tour.included ?? [];
  const notIncluded = tour.notIncluded ?? [];
  const destinations = tour.destinations ?? [];
  const plannerHref = `/plan-my-trip?tour=${encodeURIComponent(tour.slug)}`;
  const whatsappHref = whatsappLink(
    `Hello Orbit Trails, I'm interested in the "${tour.name}" tour (${tour.duration}). Could you send me details and a quote?`,
  );
  const relatedTours = allTours
    .filter((other) => other.slug !== tour.slug)
    .sort((a, b) => Number(b.category === tour.category) - Number(a.category === tour.category))
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Seo
        title={tourPageTitle(tour)}
        description={truncate(
          `${tour.overview || tour.description} Private ${tour.duration} tour with your own driver and guides, fully customisable.`,
        )}
        path={path}
        image={images[0]}
        imageAlt={`${tour.name} private tour of India`}
        jsonLd={[tourSchema(tour), breadcrumbSchema(crumbs)]}
      />

      <Breadcrumbs crumbs={crumbs} className="mb-6" />

      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Gallery */}
          <div className="mb-6 space-y-4">
            <SmartImage
              src={images[0]}
              alt={`${tour.name}: ${destinations.slice(0, 3).join(", ") || "India"} private tour`}
              priority
              sizes="(min-width: 1024px) 66vw, 100vw"
              width={1200}
              height={600}
              className="h-64 w-full rounded-lg object-cover md:h-96"
            />
            {images.length > 1 && (
              <div className="grid grid-cols-2 gap-4">
                {images.slice(1, 3).map((image, index) => (
                  <SmartImage
                    key={image}
                    src={image}
                    alt={`${tour.name} - photo ${index + 2}`}
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    widths={[320, 480, 640]}
                    width={600}
                    height={300}
                    fallbackSrc={null}
                    className="h-32 w-full rounded-lg object-cover md:h-48"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <Badge className="bg-primary text-white">{tour.category}</Badge>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" aria-hidden="true" />
                  Share
                </Button>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-secondary">
                {cleanTourName(tour.name)}
                {/* Part of the heading for search engines and screen readers: what and how long. */}
                {tourTagline(tour) && (
                  <>
                    <span className="sr-only">: </span>
                    <span className="mt-1 block text-lg font-medium text-gray-600">{tourTagline(tour)}</span>
                  </>
                )}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600">
                {tour.rating > 0 && (
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    <span className="font-medium">{tour.rating}</span>
                    {tour.reviews > 0 && <span>({tour.reviews} reviews)</span>}
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  <span>{tour.duration}</span>
                </div>
                {tour.maxGuests > 0 && (
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" aria-hidden="true" />
                    <span>Max {tour.maxGuests} guests</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-semibold text-secondary">About This Tour</h2>
              <p className="leading-relaxed text-gray-600">{tour.description || tour.overview}</p>
            </div>

            {highlights.length > 0 && (
              <div>
                <h2 className="mb-3 text-xl font-semibold text-secondary">Tour Highlights</h2>
                <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Camera className="mt-1 h-4 w-4 flex-shrink-0 text-primary" aria-hidden="true" />
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Enquiry sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <p className="text-center text-sm font-semibold uppercase tracking-wide text-accent">
                Private tour · fully customisable
              </p>
              <CardTitle className="text-center text-xl text-secondary">
                Get this trip planned around you
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>{tour.duration}</span>
                </div>
                {destinations.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span>{destinations.length} Places</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                <Button asChild className="w-full bg-accent py-3 font-medium text-white hover:bg-accent/90">
                  <Link to={plannerHref}>
                    Get a Free Quote
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full border-green-600 py-3 font-medium text-green-700 hover:bg-green-600 hover:text-white">
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                    Ask on WhatsApp
                  </a>
                </Button>
                <a
                  href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Enquiry: ${tour.name}`)}`}
                  className="flex items-center justify-center text-sm text-gray-600 hover:text-primary"
                >
                  <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                  {SITE.email}
                </a>
              </div>

              <Separator />
              <TrustBanner variant="compact" />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div>
            <h2 className="mb-6 text-2xl font-bold text-secondary">Day-wise Itinerary</h2>
            {itinerary.length > 0 ? (
              <ol className="space-y-4">
                {itinerary.map((day) => (
                  <li key={day.day}>
                    <Card className="border-l-4 border-l-primary">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">
                          Day {day.day}: {day.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-3 text-gray-600">{day.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {(day.highlights ?? []).map((highlight, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              <MapPin className="mr-1 h-3 w-3" aria-hidden="true" />
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-gray-600" role="status">
                {isPlaceholderData ? "Loading the day-by-day itinerary…" : "Ask us for the full day-by-day itinerary."}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6 lg:col-span-1">
          {included.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {included.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="mt-1 text-green-500" aria-hidden="true">✓</span>
                      <span className="text-sm text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {notIncluded.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's Not Included</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {notIncluded.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="mt-1 text-red-500" aria-hidden="true">✗</span>
                      <span className="text-sm text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {relatedTours.length > 0 && (
        <section className="mt-16" aria-labelledby="related-tours">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 id="related-tours" className="text-2xl font-bold text-secondary">
              More private tours of India
            </h2>
            <Link to="/tours" className="inline-flex items-center font-semibold text-primary hover:underline">
              All India tours
              <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {relatedTours.map((related) => (
              <TourCard key={related._id} tour={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
