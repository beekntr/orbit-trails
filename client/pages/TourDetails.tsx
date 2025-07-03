import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Star, 
  MapPin, 
  Users, 
  Clock, 
  Share2, 
  Mail,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Camera,
  AlertCircle,
  RefreshCcw
} from "lucide-react";
import { OrbitTrailsAPI, Tour } from "@shared/api";
import { useToast } from "@/hooks/use-toast";
import CustomizeTourModal from "@/components/CustomizeTourModal";

export default function TourDetails() {
  const { slug } = useParams();
  const { toast } = useToast();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTour = async () => {
      if (!slug) {
        setError("Tour not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await OrbitTrailsAPI.getTourBySlug(slug);
        
        if (response.success && response.data) {
          setTour(response.data);
        } else {
          // Check if it's a network error
          if (response.message === "Network error occurred" || response.error?.includes("fetch")) {
            setError("network");
          } else {
            setError(response.message || "Tour not found");
          }
        }
      } catch (err) {
        console.error("Error fetching tour:", err);
        // Check if it's a network error  
        const errorMessage = err instanceof Error ? err.message : String(err);
        if (errorMessage.toLowerCase().includes("fetch") || errorMessage.toLowerCase().includes("network")) {
          setError("network");
        } else {
          setError("Failed to load tour details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [slug]);

  const handleBookNow = () => {
    if (!tour) return;
    
    const subject = `Book ${tour.name}`;
    const body = `Hello Orbit Trails Team,

I would like to book the following tour package:

📍 Tour Package: ${tour.name}
⏰ Duration: ${tour.duration}
🏷️ Category: ${tour.category}
🌟 Rating: ${tour.rating}/5.0 (${tour.reviews} reviews)

Please provide me with:
- Available dates and departure schedules
- Detailed pricing information 
- Booking process and requirements
- Payment options and terms
- What's included in the package
- Any special offers or group discounts

My details:
- Name: [Your Name]
- Contact Number: [Your Phone]
- Preferred Travel Dates: [Your Preferred Dates]
- Number of Travelers: [Number of People]

Thank you for your time. I look forward to hearing from you soon!

Best regards`;
    
    window.open(
      `mailto:info@orbittrails.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    );
  };

  const handleShare = () => {
    if (!tour) return;
    
    if (navigator.share) {
      navigator.share({
        title: tour.name,
        text: tour.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied! 📋",
        description: "Tour link has been copied to your clipboard successfully.",
        duration: 3000,
      });
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    // Re-run the fetch
    const fetchTour = async () => {
      if (!slug) {
        setError("Tour not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await OrbitTrailsAPI.getTourBySlug(slug);
        
        if (response.success && response.data) {
          setTour(response.data);
        } else {
          // Check if it's a network error
          if (response.message === "Network error occurred" || response.error?.includes("fetch")) {
            setError("network");
          } else {
            setError(response.message || "Tour not found");
          }
        }
      } catch (err) {
        console.error("Error fetching tour:", err);
        // Check if it's a network error  
        const errorMessage = err instanceof Error ? err.message : String(err);
        if (errorMessage.toLowerCase().includes("fetch") || errorMessage.toLowerCase().includes("network")) {
          setError("network");
        } else {
          setError("Failed to load tour details");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tour details...</p>
        </div>
      </div>
    );
  }

  if (error === "network") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <Card className="max-w-2xl mx-auto border-orange-200 bg-orange-50">
            <CardContent className="p-8">
              <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                We're experiencing technical difficulties
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Sorry for the inconvenience! We're having trouble loading this tour's details. 
                Our team is working to resolve this quickly.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                <Button 
                  onClick={handleRefresh}
                  className="bg-primary hover:bg-primary/90"
                >
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                
                <Button 
                  onClick={() => window.history.back()}
                  variant="outline"
                  className="border-gray-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </div>

              <div className="bg-white p-4 rounded-lg border border-orange-200">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Need immediate assistance?</strong>
                </p>
                <p className="text-sm text-gray-600">
                  Email us at <a href="mailto:info@orbittrails.com" className="text-primary hover:underline font-medium">info@orbittrails.com</a> for tour information
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <div className="text-red-500 mb-4">
            <XCircle className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Tour Not Found</h2>
            <p className="text-gray-600">{error || "The requested tour could not be found."}</p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={handleRefresh}
              className="bg-primary hover:bg-primary/90"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <img
              src={tour.images[0] || "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
              alt={tour.name}
              className="col-span-2 w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
              }}
            />
            <img
              src={tour.images[1] || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
              alt={tour.name}
              className="w-full h-32 object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
              }}
            />
            <img
              src={tour.images[2] || "https://images.unsplash.com/photo-1539650116574-75c0c6d5d6b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
              alt={tour.name}
              className="w-full h-32 object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1539650116574-75c0c6d5d6b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
              }}
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
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-lg">{tour.rating}</span>
                    <span className="text-gray-500">({tour.reviews} reviews)</span>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 text-sm px-3 py-1">
                  Best Seller Package
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
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{tour.destinations?.length || 0} Places</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-primary" />
                  <span>Premium Experience</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Button
                  onClick={handleBookNow}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Book This Tour
                </Button>
                <CustomizeTourModal
                  trigger={
                    <Button
                      variant="outline"
                      className="w-full border-accent text-accent hover:bg-accent hover:text-white font-medium py-3"
                    >
                      Customize This Tour
                    </Button>
                  }
                />
              </div>

              <div className="text-xs text-gray-500 text-center space-y-1 pt-3 border-t">
                <p>✓ Free consultation & quote</p>
                <p>✓ Flexible customization</p>
                <p>✓ 24/7 customer support</p>
                <p>✓ Best price guarantee</p>
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
