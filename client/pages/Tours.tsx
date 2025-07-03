import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star, MapPin } from "lucide-react";
import CustomizeTourModal from "@/components/CustomizeTourModal";
import { OrbitTrailsAPI, Tour } from "@shared/api";

export default function Tours() {
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
          setError(response.message || "Failed to fetch tours");
        }
      } catch (err) {
        setError("Error loading tours");
        console.error("Error fetching tours:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
}, []);

if (loading) {
  return <div className="text-center py-20">Loading tours...</div>;
}

if (error) {
  return <div className="text-center py-20 text-red-500">{error}</div>;
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

          {/* Sample Tours Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sample tour cards - these would be populated from API */}
            {[1, 2, 3, 4, 5, 6].map((tour) => (
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
                    Featured
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      Sample Tour Package {tour}
                    </CardTitle>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Experience the best of India with this carefully curated
                    tour package.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">7 Days</span>
                    </div>
                    <div className="text-xl font-bold text-primary">$599</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-primary hover:bg-accent text-sm">
                      View Details
                    </Button>
                    <Button variant="outline" className="flex-1 text-sm">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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
