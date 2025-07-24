import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OrbitTrailsAPI, ReviewSubmission } from "@shared/api";
import { useSEO } from "@/hooks/useSEO";

export default function ReviewUs() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ReviewSubmission>({
    name: "",
    email: "",
    rating: 0,
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // SEO for Review Us page
  useSEO({
    title: 'Review Orbit Trails | Share Your India Travel Experience',
    description: 'Share your amazing India travel experience with Orbit Trails. Leave a review about your Golden Triangle or Rajasthan tour and help other travelers discover the magic of India.',
    keywords: 'Orbit Trails reviews, India travel reviews, Golden Triangle tour feedback, Rajasthan tour reviews, travel testimonials',
    canonicalUrl: 'https://www.orbittrails.com/review-us'
  });

  const handleStarClick = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      toast({
        title: "Rating Required ⭐",
        description: "Please select a star rating for your experience.",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    if (!formData.name.trim() || !formData.description.trim()) {
      toast({
        title: "Required Fields Missing 📝",
        description: "Please fill in your name and review description.",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await OrbitTrailsAPI.submitReview(formData);
      
      if (response.success) {
        setSubmitted(true);
        toast({
          title: "Review Submitted Successfully! 🎉",
          description: "Thank you for your feedback! Your review will be published after approval.",
          duration: 5000,
        });
      } else {
        toast({
          title: "Submission Failed ❌",
          description: response.message || "Unable to submit review. Please try again.",
          variant: "destructive",
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Network Error 🌐",
        description: "Failed to submit review. Please check your connection and try again.",
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gradient-to-r from-secondary to-secondary/90 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Thank You!</h1>
            <p className="text-xl text-gray-200">
              Your review has been submitted successfully
            </p>
          </div>
        </section>

        {/* Success Message */}
        <section className="py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-8">
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Review Submitted Successfully!
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Thank you for taking the time to share your experience with Orbit Trails. 
                    Your review is valuable to us and will help other travelers discover the magic of India.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-green-200 mb-6">
                    <p className="text-sm text-gray-600">
                      <strong>What happens next?</strong><br />
                      Our team will review your submission and publish it within 24-48 hours. 
                      Once approved, your review will appear on our customer reviews page and may be featured on our homepage.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={() => window.location.href = '/'}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Back to Homepage
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.href = '/customer-reviews'}
                      className="border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      View Customer Reviews
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-secondary to-secondary/90 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Share Your Experience</h1>
          <p className="text-xl text-gray-200">
            Tell us about your amazing journey with Orbit Trails
          </p>
        </div>
      </section>

      {/* Review Form */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-secondary">
                Leave a Review
              </CardTitle>
              <p className="text-center text-gray-600">
                Your feedback helps us improve and helps other travelers choose their perfect India adventure
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Your Name *
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full"
                  />
                </div>

                {/* Email Field (Optional) */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Email Address <span className="text-gray-500">(Optional)</span>
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll only use this to contact you if we need clarification on your review
                  </p>
                </div>

                {/* Star Rating */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Your Rating *
                  </label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 cursor-pointer transition-colors ${
                            star <= formData.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300 hover:text-yellow-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-3 text-sm text-gray-600">
                      {formData.rating > 0 ? `${formData.rating} out of 5 stars` : "Click to rate"}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Your Review *
                  </label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell us about your experience with Orbit Trails. What did you love most about your tour? How was the service? Would you recommend us to others?"
                    rows={6}
                    maxLength={1000}
                    required
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.description.length}/1000 characters
                  </p>
                </div>

                {/* Submit Button */}
                <div className="text-center pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-primary hover:bg-primary/90 px-8 py-3 text-lg"
                  >
                    {loading ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <div className="mt-8 text-center">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Why Your Review Matters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
                  <div>
                    <strong>Help Fellow Travelers</strong><br />
                    Your insights help others choose the perfect India adventure
                  </div>
                  <div>
                    <strong>Improve Our Service</strong><br />
                    Your feedback helps us enhance our tours and customer experience
                  </div>
                  <div>
                    <strong>Share the Magic</strong><br />
                    Inspire others to discover the incredible beauty of India
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
