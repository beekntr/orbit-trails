import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Calendar,
  Users,
  MapPin,
  Share2,
  Clock,
  Camera,
  Utensils,
  Bed,
} from "lucide-react";

export default function TourDetails() {
  const { slug } = useParams();

  // Mock tour data - in real app, this would be fetched based on slug
  const tour = {
    id: 1,
    slug: "golden-triangle-classic",
    name: "Golden Triangle Classic",
    category: "Golden Triangle Tours",
    price: 599,
    originalPrice: 699,
    duration: "7 Days / 6 Nights",
    rating: 4.8,
    reviews: 124,
    maxGuests: 12,
    minAge: 0,
    description:
      "Experience the magical Golden Triangle circuit covering Delhi, Agra, and Jaipur. This carefully crafted journey takes you through India's most iconic destinations, including the magnificent Taj Mahal, the bustling streets of Old Delhi, and the royal palaces of Jaipur.",
    highlights: [
      "Visit the iconic Taj Mahal at sunrise and sunset",
      "Explore the majestic Red Fort and Jama Masjid in Delhi",
      "Discover the Pink City of Jaipur and Amber Fort",
      "Experience local culture and traditional cuisine",
      "Stay in heritage hotels with modern amenities",
      "Professional English-speaking guide throughout",
    ],
    included: [
      "6 nights accommodation in 4-star hotels",
      "Daily breakfast and 3 dinners",
      "Private air-conditioned vehicle",
      "Professional English-speaking guide",
      "All monument entrance fees",
      "Airport transfers",
    ],
    notIncluded: [
      "International flights",
      "Visa fees",
      "Personal expenses",
      "Tips and gratuities",
      "Travel insurance",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Delhi",
        description:
          "Arrive at Delhi airport and transfer to your hotel. Evening at leisure to explore Connaught Place.",
        highlights: ["Airport pickup", "Hotel check-in", "Welcome briefing"],
      },
      {
        day: 2,
        title: "Delhi Sightseeing",
        description:
          "Full day exploring Old and New Delhi including Red Fort, Jama Masjid, India Gate, and President's House.",
        highlights: ["Red Fort", "Jama Masjid", "India Gate", "Raj Ghat"],
      },
      {
        day: 3,
        title: "Delhi to Agra",
        description:
          "Drive to Agra (3-4 hours). Visit Agra Fort and enjoy sunset views of Taj Mahal from Mehtab Bagh.",
        highlights: ["Agra Fort", "Mehtab Bagh", "Taj Mahal sunset view"],
      },
      {
        day: 4,
        title: "Taj Mahal & Agra to Jaipur",
        description:
          "Early morning visit to Taj Mahal at sunrise. Drive to Jaipur via Fatehpur Sikri.",
        highlights: ["Taj Mahal sunrise", "Fatehpur Sikri", "Drive to Jaipur"],
      },
      {
        day: 5,
        title: "Jaipur Sightseeing",
        description:
          "Explore the Pink City including Amber Fort, City Palace, Hawa Mahal, and local markets.",
        highlights: [
          "Amber Fort",
          "City Palace",
          "Hawa Mahal",
          "Local markets",
        ],
      },
      {
        day: 6,
        title: "Jaipur to Delhi",
        description:
          "Morning at leisure for shopping. Drive back to Delhi and check into hotel near airport.",
        highlights: ["Shopping time", "Return to Delhi", "Airport hotel"],
      },
      {
        day: 7,
        title: "Departure",
        description: "Transfer to airport for onward journey.",
        highlights: ["Airport transfer", "Tour ends"],
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1539650116574-75c0c6d5d6b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
  };

  const handleBookNow = () => {
    const subject = `Booking Inquiry - ${tour.name}`;
    const body = `Hi,\n\nI'm interested in booking the ${tour.name} tour.\n\nPlease send me more details about availability and booking process.\n\nThank you!`;
    window.open(
      `mailto:info@orbittrails.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tour.name,
        text: tour.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <img
              src={tour.images[0]}
              alt={tour.name}
              className="col-span-2 w-full h-64 object-cover rounded-lg"
            />
            <img
              src={tour.images[1]}
              alt={tour.name}
              className="w-full h-32 object-cover rounded-lg"
            />
            <img
              src={tour.images[2]}
              alt={tour.name}
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>

          {/* Tour Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-primary text-white">{tour.category}</Badge>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
              <h1 className="text-3xl font-bold text-secondary mb-2">
                {tour.name}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{tour.rating}</span>
                  <span>({tour.reviews} reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>Max {tour.maxGuests} guests</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                About This Tour
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {tour.description}
              </p>
            </div>

            {/* Tour Highlights */}
            <div>
              <h2 className="text-xl font-semibold text-secondary mb-3">
                Tour Highlights
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {tour.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Camera className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-600">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold text-primary">
                      ${tour.price}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ${tour.originalPrice}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">per person</p>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  Best Seller
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>Max {tour.maxGuests}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bed className="w-4 h-4 text-primary" />
                  <span>4-star hotels</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Utensils className="w-4 h-4 text-primary" />
                  <span>Meals included</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Button
                  onClick={handleBookNow}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Book Now
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-accent text-accent hover:bg-accent hover:text-white"
                >
                  Customize This Tour
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                <p>✓ Free cancellation up to 48 hours</p>
                <p>✓ No hidden fees</p>
                <p>✓ 24/7 customer support</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Day-wise Itinerary */}
          <div>
            <h2 className="text-2xl font-bold text-secondary mb-6">
              Day-wise Itinerary
            </h2>
            <div className="space-y-4">
              {tour.itinerary.map((day, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      Day {day.day}: {day.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-3">{day.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {day.highlights.map((highlight, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          <MapPin className="w-3 h-3 mr-1" />
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Side Content */}
        <div className="lg:col-span-1 space-y-6">
          {/* What's Included */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What's Included</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tour.included.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-sm text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* What's Not Included */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What's Not Included</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tour.notIncluded.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span className="text-sm text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
