import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, User, Clock, ArrowRight } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "react-router-dom";

export default function Blog() {
  // SEO optimization for blog page
  useSEO({
    title: 'India Travel Blog | Tips, Guides & Stories - Orbit Trails',
    description: 'Discover India through our travel blog. Expert tips for Golden Triangle tours, Rajasthan travel guides, cultural insights, and inspiring stories from fellow travelers.',
    keywords: 'India travel blog, Golden Triangle travel tips, Rajasthan travel guide, India cultural experiences, travel stories India, India tourism blog',
    canonicalUrl: 'https://www.orbittrails.com/blog',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Orbit Trails Travel Blog",
      "description": "Expert travel insights and guides for exploring India",
      "url": "https://www.orbittrails.com/blog",
      "publisher": {
        "@type": "Organization",
        "name": "Orbit Trails",
        "logo": "https://www.orbittrails.com/logo.ico"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://www.orbittrails.com/blog"
      }
    }
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-secondary to-secondary/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">India Travel Blog</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Discover expert travel tips, destination guides, and inspiring stories from
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

      {/* Featured Articles Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-4">Featured Travel Articles</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Expert insights and practical guides to help you plan the perfect India journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Blog Article 1 - You can change the title and content */}
            <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Travel blog article about India tourism"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <Badge className="absolute top-4 left-4 bg-primary">
                  Travel Guide
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg hover:text-primary transition-colors group-hover:text-primary">
                  Coming Soon: Expert Travel Article
                </CardTitle>
                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                  We're working on bringing you comprehensive travel guides and expert insights. Check back soon for detailed articles about India's best destinations and travel tips.
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Coming Soon</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>5 min read</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardContent>
            </Card>

            {/* Blog Article 2 */}
            <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/6440428/pexels-photo-6440428.jpeg?cs=srgb&dl=pexels-ankurbagai-6440428.jpg&fm=jpg"
                  alt="India heritage and culture blog article"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <Badge className="absolute top-4 left-4 bg-secondary">
                  Heritage
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg hover:text-primary transition-colors group-hover:text-primary">
                  Coming Soon: Heritage & Culture Guide
                </CardTitle>
                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                  Discover India's rich cultural heritage through our upcoming detailed guides. We'll share insights about traditions, festivals, and authentic experiences.
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Coming Soon</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>7 min read</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardContent>
            </Card>

            {/* Blog Article 3 */}
            <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="India travel tips and planning guide blog"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <Badge className="absolute top-4 left-4 bg-accent">
                  Travel Tips
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg hover:text-primary transition-colors group-hover:text-primary">
                  Coming Soon: Travel Planning Tips
                </CardTitle>
                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                  Get ready for expert travel planning advice, packing tips, and insider knowledge to make your India journey unforgettable.
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Coming Soon</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>6 min read</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardContent>
            </Card>

            {/* Blog Article 4 */}
            <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="India festivals and cultural experiences blog"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <Badge className="absolute top-4 left-4 bg-orange-500">
                  Culture
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg hover:text-primary transition-colors group-hover:text-primary">
                  Coming Soon: Festivals & Experiences
                </CardTitle>
                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                  Learn about India's vibrant festivals, cultural celebrations, and authentic local experiences you shouldn't miss.
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Coming Soon</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>8 min read</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardContent>
            </Card>

            {/* Blog Article 5 */}
            <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Indian cuisine and food travel blog"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <Badge className="absolute top-4 left-4 bg-green-500">
                  Food & Cuisine
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg hover:text-primary transition-colors group-hover:text-primary">
                  Coming Soon: Culinary Journey Guide
                </CardTitle>
                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                  Explore India's incredible culinary diversity, from street food adventures to fine dining experiences across different regions.
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Coming Soon</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>10 min read</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardContent>
            </Card>

            {/* Blog Article 6 */}
            <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="India travel safety and preparation blog"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <Badge className="absolute top-4 left-4 bg-blue-500">
                  Safety & Prep
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg hover:text-primary transition-colors group-hover:text-primary">
                  Coming Soon: Travel Safety Guide
                </CardTitle>
                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                  Essential safety tips, health preparations, and practical advice for a safe and enjoyable India travel experience.
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Coming Soon</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>9 min read</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Newsletter Signup */}
          <div className="text-center mt-16 p-8 bg-white rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-secondary mb-4">Stay Updated with Travel Tips</h3>
            <p className="text-gray-600 mb-6">
              Get the latest travel guides, destination insights, and exclusive offers delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                placeholder="Enter your email" 
                type="email"
                className="flex-1"
              />
              <Button className="bg-primary hover:bg-primary/90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
