import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star, MapPin, Mail, AlertCircle, RefreshCcw } from "lucide-react";
import CustomizeTourModal from "@/components/CustomizeTourModal";
import { OrbitTrailsAPI, Tour } from "@shared/api";
import { useNavigate } from "react-router-dom";

export default function Tours() {
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await OrbitTrailsAPI.getTours();
        if (response.success && response.data) {
          setTours(response.data.tours);
        } else {
          // Check if it's a network error
          if (response.message === "Network error occurred" || response.error?.includes("fetch")) {
            setError("network");
          } else {
            setError(response.message || "Failed to fetch tours");
          }
        }
      } catch (err) {
        console.error("Error fetching tours:", err);
        // Check if it's a network error
        const errorMessage = err instanceof Error ? err.message : String(err);
        if (errorMessage.toLowerCase().includes("fetch") || errorMessage.toLowerCase().includes("network")) {
          setError("network");
        } else {
          setError("Error loading tours");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const handleBookNow = (tour: Tour) => {
    const subject = `Book ${tour.name}`;
    const body = `Hello Orbit Trails Team,

I would like to book the following tour package:

📍 Tour Package: ${tour.name}
⏰ Duration: ${tour.duration}
🏷️ Category: ${tour.category}

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
    
    const mailtoLink = `mailto:info@orbittrails.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
  };

  const handleViewDetails = (tour: Tour) => {
    navigate(`/tour-details/${tour.slug}`);
  };

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    // Re-run the fetch
    const fetchTours = async () => {
      try {
        const response = await OrbitTrailsAPI.getTours();
        if (response.success && response.data) {
          setTours(response.data.tours);
        } else {
          // Check if it's a network error
          if (response.message === "Network error occurred" || response.error?.includes("fetch")) {
            setError("network");
          } else {
            setError(response.message || "Failed to fetch tours");
          }
        }
      } catch (err) {
        console.error("Error fetching tours:", err);
        // Check if it's a network error
        const errorMessage = err instanceof Error ? err.message : String(err);
        if (errorMessage.toLowerCase().includes("fetch") || errorMessage.toLowerCase().includes("network")) {
          setError("network");
        } else {
          setError("Error loading tours");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tours...</p>
        </div>
      </div>
    );
  }

  if (error === "network") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-secondary to-secondary/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold text-white mb-6">Our Tours</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Discover India's incredible destinations with our carefully crafted tour packages
            </p>
          </div>
        </section>

        {/* Network Error Message */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-8">
                <div className="text-center">
                  <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    We're experiencing technical difficulties
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Sorry for the inconvenience! Our tour catalog is temporarily unavailable. 
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
                      variant="outline" 
                      onClick={() => window.open('mailto:info@orbittrails.com?subject=Tour Inquiry - Website Issue', '_blank')}
                      className="border-orange-300 text-orange-700 hover:bg-orange-100"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Us
                    </Button>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-orange-200">
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Need immediate assistance?</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                      Email us at <a href="mailto:info@orbittrails.com" className="text-primary hover:underline font-medium">info@orbittrails.com</a> or use our custom tour planner below
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customize Tour CTA */}
            <div className="text-center mt-12 p-8 bg-white rounded-lg shadow-sm border">
              <h3 className="text-2xl font-bold text-secondary mb-4">
                Plan Your Perfect Trip
              </h3>
              <p className="text-gray-600 mb-6">
                While we fix the technical issue, you can still create a personalized tour package
              </p>
              <CustomizeTourModal
                trigger={
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Create Custom Tour
                  </Button>
                }
              />
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error && error !== "network") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p>{error}</p>
          <Button onClick={handleRefresh} className="mt-4">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

return (
  <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-secondary to-secondary/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">Our Tours</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Discover India's incredible destinations with our carefully crafted
            tour packages
          </p>
        </div>
      </section>

      {/* Tour Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center border-2 border-primary/20 hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-xl text-secondary">
                  Golden Triangle Tours
                </CardTitle>
                <Badge className="mx-auto bg-primary">Best Seller</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Delhi, Agra & Jaipur</p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-primary/20 hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-xl text-secondary">
                  Extended Tours
                </CardTitle>
                <Badge className="mx-auto bg-secondary">Popular</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Multi-destination experiences</p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-primary/20 hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-xl text-secondary">
                  Rajasthan Tours
                </CardTitle>
                <Badge className="mx-auto bg-accent">Heritage</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Royal palaces & desert</p>
              </CardContent>
            </Card>
          </div>

          {/* Tours Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.length > 0 ? (
              tours.map((tour) => (
                <Card
                  key={tour._id}
                  className="overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={tour.images?.[0] || `https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`}
                      alt={tour.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <Badge className="absolute top-4 left-4 bg-primary">
                      {tour.category}
                    </Badge>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg font-semibold line-clamp-2">{tour.name}</CardTitle>
                      <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-yellow-700">{tour.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                      {tour.overview || tour.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{tour.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{tour.destinations?.length || 0} Places</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        className="flex-1 bg-primary hover:bg-accent text-sm font-medium"
                        onClick={() => handleViewDetails(tour)}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 text-sm font-medium border-primary text-primary hover:bg-primary hover:text-white"
                        onClick={() => handleBookNow(tour)}
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Fallback sample tours if no tours are available
              [1, 2, 3, 4, 5, 6].map((tour) => (
                <Card
                  key={tour}
                  className="overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={`https://images.unsplash.com/photo-156450759${tour}333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`}
                      alt={`Tour ${tour}`}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-primary">
                      {tour <= 2 ? "Best Seller" : tour <= 4 ? "Popular" : "New"}
                    </Badge>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg font-semibold">
                        Sample Tour Package {tour}
                      </CardTitle>
                      <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-yellow-700">{(4.0 + Math.random()).toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Experience the best of India with this carefully curated
                      tour package featuring amazing destinations, cultural experiences, and memorable moments.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{tour + 4} Days</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{tour + 1} Places</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button className="flex-1 bg-primary hover:bg-accent text-sm font-medium">
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 text-sm font-medium border-primary text-primary hover:bg-primary hover:text-white"
                        onClick={() => {
                          const subject = `Book Sample Tour Package ${tour}`;
                          const mailtoLink = `mailto:info@orbittrails.com?subject=${encodeURIComponent(subject)}`;
                          window.open(mailtoLink, '_blank');
                        }}
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Customize Tour CTA */}
          <div className="text-center mt-16 p-8 bg-gray-50 rounded-lg">
            <h3 className="text-2xl font-bold text-secondary mb-4">
              Don't see what you're looking for?
            </h3>
            <p className="text-gray-600 mb-6">
              Let us create a personalized tour package just for you
            </p>
            <CustomizeTourModal
              trigger={
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Customize Your Tour
                </Button>
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
}
