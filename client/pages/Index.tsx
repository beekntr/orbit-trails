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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CustomizeTourModal from "@/components/CustomizeTourModal";
import AnimatedSection from "@/components/AnimatedSection";
import { motion } from "framer-motion";


export default function Index() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80", // Taj Mahal
    "https://images.unsplash.com/photo-1539650116574-75c0c6d5d6b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80", // Rajasthan Palace
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80", // Red Fort Delhi
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
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

  const featuredTours = [
    {
      id: 1,
      title: "Golden Triangle Classic",
      description:
        "Delhi, Agra & Jaipur - The most popular circuit covering India's iconic destinations",
      price: "$599",
      duration: "7 Days",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      badge: "Best Seller",
    },
    {
      id: 2,
      title: "Royal Rajasthan",
      description:
        "Experience the grandeur of palaces, forts, and desert landscapes",
      price: "$899",
      duration: "12 Days",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1539650116574-75c0c6d5d6b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      badge: "Popular",
    },
    {
      id: 3,
      title: "Kerala Backwaters",
      description:
        "Serene backwaters, hill stations, and spice plantations of God's Own Country",
      price: "$749",
      duration: "9 Days",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      badge: "Nature",
    },
  ];

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
    <div>

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
                alt={`Hero ${index + 1}`}
                className="w-full h-full object-cover"
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
            Experience the incredible diversity, rich culture, and timeless
            beauty of India with our expertly crafted tour packages
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
            >
              Explore Tours
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <CustomizeTourModal
              trigger={
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-secondary px-8 py-3 text-lg"
                >
                  Customize Your Trip
                </Button>
              }
            />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
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
              <AnimatedSection
                key={index}
                delay={index * 0.1}
                direction="up"
              >
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTours.map((tour, index) => (
              <AnimatedSection
                key={tour.id}
                delay={index * 0.1}
                direction="up"
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-64 object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary hover:bg-accent">
                    {tour.badge}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-secondary">
                      {tour.title}
                    </CardTitle>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{tour.rating}</span>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600">
                    {tour.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{tour.duration}</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {tour.price}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-primary hover:bg-primary/90">
                      View Details
                    </Button>
                    <Button variant="outline" className="flex-1 border-accent text-accent hover:bg-accent hover:text-white">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary mb-4">
              What Our Travelers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it - hear from travelers who have
              experienced the magic of India with Orbit Trails
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-none shadow-lg">
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
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Indian Adventure?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Let us create a personalized itinerary that matches your interests,
            budget, and travel style
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CustomizeTourModal
              trigger={
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 px-8 py-3 text-lg"
                >
                  Customize Your Tour
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              }
            />
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-secondary px-8 py-3 text-lg"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}