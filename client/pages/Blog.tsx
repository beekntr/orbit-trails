import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, User } from "lucide-react";

export default function Blog() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-secondary to-secondary/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">Travel Blog</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Discover travel tips, destination guides, and inspiring stories from
            the incredible land of India
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input placeholder="Search articles..." className="pl-10" />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                All
              </Button>
              <Button variant="outline" size="sm">
                Travel Tips
              </Button>
              <Button variant="outline" size="sm">
                Destinations
              </Button>
              <Button variant="outline" size="sm">
                Culture
              </Button>
              <Button variant="outline" size="sm">
                Food
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sample blog posts - these would be populated from CMS or API */}
            {[1, 2, 3, 4, 5, 6].map((post) => (
              <Card
                key={post}
                className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={`https://images.unsplash.com/photo-15${post}4507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`}
                    alt={`Blog post ${post}`}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary">
                    Travel Tips
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg hover:text-primary transition-colors">
                    Best Time to Visit India: A Complete Guide
                  </CardTitle>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    Planning your trip to India? Learn about the best seasons,
                    weather patterns, and regional differences to make the most
                    of your Indian adventure.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Mar 15, 2024</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>Travel Team</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
