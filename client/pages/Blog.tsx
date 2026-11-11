import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, User, Clock, ArrowRight } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/lib/schema";
import { Link, useNavigate } from "react-router-dom";
import { blogPosts, getFeaturedBlogs, getAllCategories } from "@/data/blogData";
import { useState } from "react";

export default function Blog() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter blogs based on category and search
  const filteredBlogs = blogPosts.filter(blog => {
    const matchesCategory = !selectedCategory || blog.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const featuredBlogs = getFeaturedBlogs();
  const categories = getAllCategories();
  return (
    <div>
      <Seo
        title="India Travel Blog: Guides & Tips | Orbit Trails"
        description="India travel guides from a Jaipur tour operator: Golden Triangle and Rajasthan itineraries, safaris, food, festivals and first-timer tips."
        path="/blog"
        jsonLd={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
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
              <Input 
                placeholder="Search articles..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex space-x-2 flex-wrap">
              <Button 
                variant={selectedCategory === null ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button 
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-4">
              {searchQuery || selectedCategory ? 'Search Results' : 'Expert Travel Articles'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {searchQuery || selectedCategory 
                ? `Found ${filteredBlogs.length} articles matching your criteria`
                : 'Comprehensive guides and insider tips to help you plan the perfect India journey'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <Card 
                key={blog.id}
                className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                onClick={() => navigate(`/blog/${blog.slug}`)}
              >
                <div className="relative">
                  <img
                    src={blog.featuredImage}
                    alt={blog.altText}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary">
                    {blog.category}
                  </Badge>
                  {blog.featured && (
                    <Badge className="absolute top-4 right-4 bg-accent">
                      Featured
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg hover:text-primary transition-colors group-hover:text-primary line-clamp-2">
                    <Link to={`/blog/${blog.slug}`} onClick={(event) => event.stopPropagation()}>
                      {blog.title}
                    </Link>
                  </CardTitle>
                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(blog.publishDate).toLocaleDateString('en-US', { timeZone: 'UTC', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{blog.readTime}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredBlogs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No articles found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          )}

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
