import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star, MapPin, Mail, AlertCircle, RefreshCcw } from "lucide-react";
import CustomizeTourModal from "@/components/CustomizeTourModal";
import { OrbitTrailsAPI, Tour } from "@shared/api";
import { useNavigate } from "react-router-dom";
import { useSEO, SEOConfigs } from "@/hooks/useSEO";

export default function Tours() {
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // SEO optimization
  useSEO({
    ...SEOConfigs.tours,
    canonicalUrl: 'https://www.orbittrails.com/tours'
  });

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await OrbitTrailsAPI.getTours();
        if (response.success && response.data) {
          setTours(response.data.tours);
          setFilteredTours(response.data.tours);
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

  const handleCategoryFilter = (category: string) => {
    if (selectedCategory === category) {
      // If clicking the same category, show all tours
      setSelectedCategory(null);
      setFilteredTours(tours);
    } else {
      // Filter tours by selected category
      setSelectedCategory(category);
      const filtered = tours.filter(tour => tour.category === category);
      setFilteredTours(filtered);
    }
  };

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
    setSelectedCategory(null); // Reset filter
    // Re-run the fetch
    const fetchTours = async () => {
      try {
        const response = await OrbitTrailsAPI.getTours();
        if (response.success && response.data) {
          setTours(response.data.tours);
          setFilteredTours(response.data.tours);
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
                    Our tour booking system is temporarily unavailable. We apologize for any inconvenience.
                    Please try refreshing the page or contact us directly for assistance.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={handleRefresh} className="bg-primary hover:bg-primary/90">
                      <RefreshCcw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => window.open('mailto:info@orbittrails.com', '_blank')}
                      className="border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Us
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Customize Tour Option */}
            <div className="text-center mt-12 p-8 bg-white rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-secondary mb-4">
                Need a Custom Tour?
              </h3>
              <p className="text-gray-600 mb-6">
                Let us create a personalized travel experience just for you
              </p>
              <CustomizeTourModal
                trigger={
                  <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                    Plan Custom Tour
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
    <main>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-secondary to-secondary/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            India Tour Packages | Golden Triangle & Rajasthan Tours
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Discover India's incredible destinations with our carefully crafted
            tour packages. From iconic Golden Triangle to royal Rajasthan adventures.
          </p>
        </div>
      </section>

      {/* Tour Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-8">
            <h2 className="text-3xl font-bold text-secondary mb-4">Browse Tours by Category</h2>
            <p className="text-gray-600">Choose from our curated India tour categories or view all available packages</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {/* Show All Button */}
            <Card 
              className={`text-center border-2 transition-colors cursor-pointer ${
                selectedCategory === null 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 hover:border-primary'
              }`}
              onClick={() => {
                setSelectedCategory(null);
                setFilteredTours(tours);
              }}
            >
              <CardHeader>
                <CardTitle className="text-lg text-secondary">
                  All Tours
                </CardTitle>
                <Badge className="mx-auto bg-gray-600">Show All</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{tours.length} packages</p>
              </CardContent>
            </Card>

            <Card 
              className={`text-center border-2 transition-colors cursor-pointer ${
                selectedCategory === 'Golden Triangle' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-primary/20 hover:border-primary'
              }`}
              onClick={() => handleCategoryFilter('Golden Triangle')}
            >
              <CardHeader>
                <CardTitle className="text-lg text-secondary">
                  Golden Triangle
                </CardTitle>
                <Badge className="mx-auto bg-primary">Best Seller</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Delhi, Agra & Jaipur</p>
              </CardContent>
            </Card>

            <Card 
              className={`text-center border-2 transition-colors cursor-pointer ${
                selectedCategory === 'Extended Tours' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-primary/20 hover:border-primary'
              }`}
              onClick={() => handleCategoryFilter('Extended Tours')}
            >
              <CardHeader>
                <CardTitle className="text-lg text-secondary">
                  Extended Tours
                </CardTitle>
                <Badge className="mx-auto bg-secondary">Popular</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Multi-destination</p>
              </CardContent>
            </Card>

            <Card 
              className={`text-center border-2 transition-colors cursor-pointer ${
                selectedCategory === 'Rajasthan Tours' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-primary/20 hover:border-primary'
              }`}
              onClick={() => handleCategoryFilter('Rajasthan Tours')}
            >
              <CardHeader>
                <CardTitle className="text-lg text-secondary">
                  Rajasthan Tours
                </CardTitle>
                <Badge className="mx-auto bg-accent">Heritage</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Royal palaces</p>
              </CardContent>
            </Card>
          </div>

          {/* Filter Status */}
          {selectedCategory && (
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                <span className="text-sm font-medium">Showing: {selectedCategory}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 text-primary hover:text-primary/80"
                  onClick={() => {
                    setSelectedCategory(null);
                    setFilteredTours(tours);
                  }}
                >
                  ×
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {filteredTours.length} tour{filteredTours.length !== 1 ? 's' : ''} found
              </p>
            </div>
          )}

          {/* Tours Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.length > 0 ? (
              filteredTours.map((tour) => (
                <Card
                  key={tour._id}
                  className="overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={tour.images?.[0] || `https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`}
                      alt={`${tour.name} - ${tour.category} tour package covering ${tour.destinations?.join(', ') || 'multiple destinations'} in India`}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
                        target.alt = `${tour.name} - Premium India tour package`;
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
            ) : selectedCategory && tours.length > 0 ? (
              // No tours found for selected category
              <div className="col-span-full text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-20 h-20 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No tours found in {selectedCategory}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    We don't have any tours in this category at the moment.
                  </p>
                  <Button 
                    onClick={() => {
                      setSelectedCategory(null);
                      setFilteredTours(tours);
                    }}
                    className="bg-primary hover:bg-primary/90"
                  >
                    View All Tours
                  </Button>
                </div>
              </div>
            ) : tours.length === 0 ? (
              // Clean message when no tours are available (for when you're adding real tours)
              <div className="col-span-full text-center py-20">
                <div className="max-w-2xl mx-auto">
                  <div className="text-gray-400 mb-6">
                    <svg className="w-24 h-24 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    Our Tour Collection is Coming Soon
                  </h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    We're carefully curating our tour packages to bring you the most authentic and memorable India experiences. 
                    In the meantime, let us create a custom tour just for you.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <CustomizeTourModal
                      trigger={
                        <Button size="lg" className="bg-primary hover:bg-primary/90 px-8">
                          Plan Custom Tour
                        </Button>
                      }
                    />
                    <Button 
                      size="lg"
                      variant="outline" 
                      className="border-primary text-primary hover:bg-primary hover:text-white px-8"
                      onClick={() => window.open('mailto:info@orbittrails.com?subject=Tour Inquiry', '_blank')}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Us
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
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
    </main>
  );
}
