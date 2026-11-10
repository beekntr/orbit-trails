import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import Seo from "@/components/seo/Seo";
import PhotoGrid from "@/components/gallery/PhotoGrid";
import ReviewsWidget from "@/components/trust/ReviewsWidget";
import { guestPhotos, photoUrl, placePhotos } from "@/data/gallery";
import { breadcrumbSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";

const PATH = "/gallery";
const crumbs = [
  { name: "Home", path: "/" },
  { name: "Guest Gallery", path: PATH },
];

export default function Gallery() {
  return (
    <>
      <Seo
        title="Guest Gallery: Photos from Our Private India Tours | Orbit Trails"
        description="Photos from Orbit Trails guests on private tours of Jaipur and Rajasthan: garland welcomes, Amber Fort, street food and the sights along the way."
        path={PATH}
        image={photoUrl(guestPhotos[0])}
        jsonLd={[
          breadcrumbSchema(crumbs),
          {
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            name: "Orbit Trails guest gallery",
            url: absoluteUrl(PATH),
            image: [...guestPhotos, ...placePhotos].map((photo) => ({
              "@type": "ImageObject",
              contentUrl: photoUrl(photo),
              caption: photo.caption,
            })),
          },
        ]}
      />

      <section className="bg-gradient-to-r from-secondary to-secondary/90 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Breadcrumbs crumbs={crumbs} inverted className="mb-6 flex justify-center" />
          <h1 className="text-4xl font-bold text-white md:text-5xl">Guest Gallery</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-200">
            Moments from our guests' private journeys through India, from the first garland
            welcome to the forts, markets and meals along the way.
          </p>
        </div>
      </section>

      <section className="bg-white py-16" aria-labelledby="guests-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="guests-heading" className="text-2xl font-bold text-secondary md:text-3xl">
            Our travellers
          </h2>
          <p className="mt-2 text-gray-600">Tap any photo to see it larger.</p>
          <PhotoGrid photos={guestPhotos} className="mt-8" />
        </div>
      </section>

      <section className="bg-gray-50 py-16" aria-labelledby="places-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="places-heading" className="text-2xl font-bold text-secondary md:text-3xl">
            Along the way
          </h2>
          <p className="mt-2 text-gray-600">
            A few of the places our Jaipur and Rajasthan tours visit.
          </p>
          <PhotoGrid photos={placePhotos} className="mt-8" />
        </div>
      </section>

      <ReviewsWidget limit={3} className="bg-white" />

      <section className="bg-secondary py-16 text-center text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Your photos could be next</h2>
          <p className="mt-4 text-lg text-gray-300">
            Tell us how you like to travel, and we'll design a private journey around you.
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent hover:bg-accent/90">
            <Link to="/plan-my-trip">
              Plan My Trip
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
