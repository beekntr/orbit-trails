import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Star,
  Users,
  Calendar,
  MapPin,
  Camera,
  Mountain,
  Compass,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import CustomizeTourModal from "@/components/CustomizeTourModal";
import AnimatedSection from "@/components/AnimatedSection";
import { motion } from "framer-motion";
import { OrbitTrailsAPI, Tour } from "@shared/api";
import { useNavigate } from "react-router-dom";
import { useSEO, SEOConfigs } from "@/hooks/useSEO";

export default function Index() {
  // SEO optimization for homepage
  useSEO({
    ...SEOConfigs.home,
    canonicalUrl: 'https://www.orbittrails.com/'
  });

  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [toursLoading, setToursLoading] = useState(true);
  const [toursError, setToursError] = useState(false);

  const heroImages = [
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80", // Taj Mahal
    "https://images.pexels.com/photos/6440428/pexels-photo-6440428.jpeg?cs=srgb&dl=pexels-ankurbagai-6440428.jpg&fm=jpg", // Rajasthan Palace
    "https://images.unsplash.com/photo-1587474260584-136574528ed5?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kaWElMjBnYXRlfGVufDB8fDB8fHww", // Red Fort Delhi
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch featured tours from database
  useEffect(() => {
    const fetchFeaturedTours = async () => {
      try {
        setToursLoading(true);
        const response = await OrbitTrailsAPI.getTours();
        
        if (response.success && response.data?.tours) {
          // Get 3 random tours from the database
          const allTours = response.data.tours;
          const shuffled = [...allTours].sort(() => 0.5 - Math.random());
          const randomTours = shuffled.slice(0, 3);
          setFeaturedTours(randomTours);
          setToursError(false);
        } else {
          setToursError(true);
        }
      } catch (err) {
        setToursError(true);
      } finally {
        setToursLoading(false);
      }
    };

    fetchFeaturedTours();
  }, []);

  const services = [
    {
      icon: <Calendar className="w-8 h-8 text-primary" />,
      title: "Customized Itineraries",
      description:
        "Tailor-made tour packages designed according to your preferences, budget, and time frame.",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Expert Local Guides",
      description:
        "Experienced guides who know the hidden gems and cultural insights of each destination.",
    },
    {
      icon: <Camera className="w-8 h-8 text-primary" />,
      title: "Cultural Experiences",
      description:
        "Immerse yourself in authentic Indian culture, traditions, and local cuisines.",
    },
    {
      icon: <Compass className="w-8 h-8 text-primary" />,
      title: "24/7 Support",
      description:
        "Round-the-clock assistance during your journey for a worry-free travel experience.",
    },
  ];

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

  const getBadgeForTour = (tour: Tour, index: number) => {
    if (tour.rating >= 4.8) return "Best Seller";
    if (tour.category === "Golden Triangle") return "Popular";
    if (index === 0) return "Featured";
    return "Special";
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      country: "USA",
      rating: 5,
      comment:
        "An absolutely incredible experience! The Golden Triangle tour exceeded all our expectations. Our guide was knowledgeable and the arrangements were perfect.",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b5e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Michael Chen",
      country: "Australia",
      rating: 5,
      comment:
        "Orbit Trails made our dream trip to Rajasthan come true. Every detail was perfectly planned, and we felt safe and well-cared for throughout our journey.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Emma Thompson",
      country: "UK",
      rating: 5,
      comment:
        "The cultural immersion and authentic experiences were beyond what we imagined. Highly recommend Orbit Trails for anyone wanting to explore the real India.",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={image}
                alt={
                  index === 0 
                    ? "Iconic Taj Mahal at sunrise - Golden Triangle tour highlight in Agra, India" 
                    : index === 1 
                    ? "Magnificent Rajasthan palace architecture showcasing royal heritage and luxury travel experiences"
                    : "Historic Red Fort Delhi - Gateway to India's rich Mughal heritage and cultural tourism"
                }
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Discover the Magic of
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="text-primary block"
            >
              India
            </motion.span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto"
          >
            Experience India's Golden Triangle, royal Rajasthan, and authentic cultural heritage 
            with our expertly crafted luxury tour packages and personalized travel experiences
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg"
              onClick={() => navigate('/tours')}
              aria-label="Explore our India tour packages"
            >
              Explore Tours
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <CustomizeTourModal
              trigger={
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-secondary hover:border-white px-8 py-3 text-lg font-semibold transition-all duration-300"
                  aria-label="Create a custom India travel itinerary"
                >
                  Customize Your Trip
                </Button>
              }
            />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce" aria-hidden="true">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary mb-4">
              Why Choose Orbit Trails?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are passionate about creating unforgettable travel experiences
              that showcase the authentic beauty and culture of India
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <AnimatedSection key={index} delay={index * 0.1} direction="up">
                <Card className="text-center border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <CardHeader>
                    <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl text-secondary">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{service.description}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary mb-4">
              Featured Tours
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most popular destinations and create memories that
              will last a lifetime
            </p>
          </AnimatedSection>

          {toursLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading featured tours...</p>
            </div>
          ) : toursError || featuredTours.length === 0 ? (
            // Fallback when tours can't be fetched
            <div className="text-center py-12">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Explore Our Tour Collection
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  We're currently updating our featured tours. Discover our complete collection of carefully crafted tour packages covering India's most incredible destinations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/tours">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 px-8">
                      View All Tours
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <CustomizeTourModal
                    trigger={
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary hover:text-white px-8"
                      >
                        Create Custom Tour
                      </Button>
                    }
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredTours.map((tour, index) => (
                  <AnimatedSection key={tour._id} delay={index * 0.1} direction="up">
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                      <div className="relative">
                        <img
                          src={tour.images?.[0] || "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"}
                          alt={tour.name}
                          className="w-full h-64 object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
                          }}
                        />
                        <Badge className="absolute top-4 left-4 bg-primary hover:bg-accent">
                          {getBadgeForTour(tour, index)}
                        </Badge>
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl text-secondary line-clamp-2">
                            {tour.name}
                          </CardTitle>
                          <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium text-yellow-700">
                              {tour.rating}
                            </span>
                          </div>
                        </div>
                        <CardDescription className="text-gray-600 line-clamp-3">
                          {tour.overview || tour.description}
                        </CardDescription>
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
                            className="flex-1 bg-primary hover:bg-primary/90"
                            onClick={() => handleViewDetails(tour)}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 border-accent text-accent hover:bg-accent hover:text-white"
                            onClick={() => handleBookNow(tour)}
                          >
                            <Mail className="w-4 h-4 mr-1" />
                            Book Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link to="/tours">
                  <Button size="lg" variant="outline" className="px-8">
                    View All Tours
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary mb-4">
              What Our Travelers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it - hear from travelers who have
              experienced the magic of India with Orbit Trails
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <AnimatedSection key={index} delay={index * 0.1} direction="up">
                <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic">
                      "{testimonial.comment}"
                    </p>
                    <div className="flex items-center space-x-3">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-secondary">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {testimonial.country}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about planning your India trip with Orbit Trails
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="bg-white rounded-lg shadow-sm border border-gray-200 px-6">
                <AccordionTrigger className="text-left text-lg font-semibold text-secondary hover:text-primary hover:no-underline">
                  What makes the Golden Triangle tour so popular?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base">
                  The Golden Triangle (Delhi-Agra-Jaipur) is India's most iconic tourist circuit, featuring three UNESCO World Heritage sites including the Taj Mahal, Red Fort, and Amber Fort. It offers the perfect introduction to India's rich history, Mughal architecture, and royal heritage in just 3-7 days.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-white rounded-lg shadow-sm border border-gray-200 px-6">
                <AccordionTrigger className="text-left text-lg font-semibold text-secondary hover:text-primary hover:no-underline">
                  When is the best time to visit Rajasthan?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base">
                  October to March is ideal for Rajasthan tours, with pleasant weather perfect for exploring palaces and forts. Winter months (December-February) offer the most comfortable temperatures for sightseeing, while avoiding the intense summer heat.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-white rounded-lg shadow-sm border border-gray-200 px-6">
                <AccordionTrigger className="text-left text-lg font-semibold text-secondary hover:text-primary hover:no-underline">
                  Do you offer customized India tour packages?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base">
                  Yes! We specialize in creating personalized itineraries based on your interests, budget, and travel dates. Whether you want luxury heritage hotels, adventure activities, cultural experiences, or spiritual journeys, we'll design the perfect India tour for you.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-white rounded-lg shadow-sm border border-gray-200 px-6">
                <AccordionTrigger className="text-left text-lg font-semibold text-secondary hover:text-primary hover:no-underline">
                  What's included in your tour packages?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base">
                  Our comprehensive packages typically include accommodation, transportation, expert local guides, entrance fees to monuments, some meals, and 24/7 support. We carefully select quality hotels and ensure seamless experiences throughout your journey.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-white rounded-lg shadow-sm border border-gray-200 px-6">
                <AccordionTrigger className="text-left text-lg font-semibold text-secondary hover:text-primary hover:no-underline">
                  How far in advance should I book my India tour?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base">
                  We recommend booking 2-3 months in advance for the best availability and rates, especially during peak season (October-March). However, we can also arrange last-minute tours based on availability. Contact us for urgent bookings.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="bg-white rounded-lg shadow-sm border border-gray-200 px-6">
                <AccordionTrigger className="text-left text-lg font-semibold text-secondary hover:text-primary hover:no-underline">
                  Are your tours suitable for solo travelers?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base">
                  Absolutely! We welcome solo travelers and can arrange both group tours and private experiences. Our expert guides ensure your safety and help you connect with local culture. Many of our guests are solo adventurers discovering India's incredible diversity.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="bg-white rounded-lg shadow-sm border border-gray-200 px-6">
                <AccordionTrigger className="text-left text-lg font-semibold text-secondary hover:text-primary hover:no-underline">
                  What should I pack for my India tour?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base">
                  Pack lightweight, breathable clothing for most seasons, with warmer layers for winter months. Essential items include comfortable walking shoes, sunscreen, hat, modest clothing for religious sites, and any required medications. We'll provide a detailed packing checklist upon booking.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-4xl font-bold mb-6">
              Ready to Start Your Indian Adventure?
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Let us create a personalized itinerary that matches your
              interests, budget, and travel style
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CustomizeTourModal
                trigger={
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-white hover:text-white px-8 py-3 text-lg font-semibold shadow-lg"
                  >
                    Customize Your Tour
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                }
              />
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-secondary hover:border-white px-8 py-3 text-lg font-semibold transition-all duration-300 shadow-lg"
                onClick={() => navigate('/contact')}
              >
                Contact Us
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
