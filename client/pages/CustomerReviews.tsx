import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Heart, Quote, Users } from "lucide-react";
import { OrbitTrailsAPI, Review } from "@shared/api";
import { useSEO } from "@/hooks/useSEO";
import AnimatedSection from "@/components/AnimatedSection";

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // SEO for Customer Reviews page
  useSEO({
    title: 'Customer Reviews | Orbit Trails India Travel Experiences',
    description: 'Read authentic reviews from travelers who experienced India with Orbit Trails. Discover why our Golden Triangle and Rajasthan tours receive 5-star ratings from customers worldwide.',
    keywords: 'Orbit Trails reviews, India travel testimonials, Golden Triangle tour reviews, Rajasthan tour feedback, customer experiences, travel reviews India',
    canonicalUrl: 'https://www.orbittrails.com/customer-reviews'
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await OrbitTrailsAPI.getApprovedReviews(50); // Get up to 50 reviews
        if (response.success && response.data) {
          setReviews(response.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customer reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-secondary to-secondary/90 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Customer Reviews</h1>
            <p className="text-xl text-gray-200">
              Authentic experiences shared by our travelers
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Reviews Coming Soon
                </h2>
                <p className="text-gray-600 mb-6">
                  We're gathering amazing stories from our travelers. Check back soon to read their experiences!
                </p>
                <Button 
                  onClick={() => window.location.href = '/review-us'}
                  className="bg-primary hover:bg-primary/90"
                >
                  Be the First to Review
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-secondary to-secondary/90 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Customer Reviews</h1>
          <p className="text-xl text-gray-200">
            Authentic experiences shared by our travelers
          </p>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">{reviews.length}</div>
                <div className="text-gray-600">Total Reviews</div>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-3xl font-bold text-primary">{getAverageRating()}</span>
                </div>
                <div className="text-gray-600">Average Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {Math.round((ratingDistribution[5] / reviews.length) * 100)}%
                </div>
                <div className="text-gray-600">5-Star Reviews</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">98%</div>
                <div className="text-gray-600">Would Recommend</div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Rating Distribution */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Rating Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = ratingDistribution[rating as keyof typeof ratingDistribution];
                    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                    
                    return (
                      <div key={rating} className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1 w-12">
                          <span className="text-sm">{rating}</span>
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {reviews.length === 0 ? (
            <div className="text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                No Reviews Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Be the first to share your amazing India travel experience!
              </p>
              <Button 
                onClick={() => window.location.href = '/review-us'}
                className="bg-primary hover:bg-primary/90"
              >
                Write First Review
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reviews.map((review, index) => (
                  <AnimatedSection key={review._id} delay={index * 0.1} direction="up">
                    <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="pt-6 h-full flex flex-col">
                        {/* Quote Icon */}
                        <Quote className="w-8 h-8 text-primary opacity-20 mb-4" />
                        
                        {/* Rating */}
                        <div className="flex items-center mb-4">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-5 h-5 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                          {[...Array(5 - review.rating)].map((_, i) => (
                            <Star
                              key={i + review.rating}
                              className="w-5 h-5 text-gray-300"
                            />
                          ))}
                        </div>

                        {/* Review Text */}
                        <p className="text-gray-600 mb-6 italic flex-grow leading-relaxed">
                          "{review.description}"
                        </p>

                        {/* Reviewer Info */}
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                          <div>
                            <p className="font-semibold text-secondary">
                              {review.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(review.createdAt)}
                            </p>
                          </div>
                          <Heart className="w-5 h-5 text-red-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>

              {/* Call to Action */}
              <AnimatedSection className="text-center mt-16">
                <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-secondary mb-4">
                      Share Your Experience
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Have you traveled with Orbit Trails? We'd love to hear about your experience! 
                      Your review helps other travelers discover the magic of India.
                    </p>
                    <Button 
                      onClick={() => window.location.href = '/review-us'}
                      size="lg"
                      className="bg-primary hover:bg-primary/90 px-8"
                    >
                      Write a Review
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
