import { Users, Award, MapPin, Clock } from "lucide-react";
import { useSEO, SEOConfigs } from "@/hooks/useSEO";

export default function About() {
  // SEO optimization for about page
  useSEO({
    ...SEOConfigs.about,
    canonicalUrl: 'https://www.orbittrails.com/about'
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-secondary to-secondary/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            About Orbit Trails
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Your trusted travel partner for discovering the incredible beauty
            and rich cultural heritage of India
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-gray-600">Happy Travelers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">8+</div>
              <p className="text-gray-600">Tour Packages</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">15+</div>
              <p className="text-gray-600">Destinations</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">5</div>
              <p className="text-gray-600">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary mb-6">Our Story</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Founded in 2020, Orbit Trails emerged from a passion for showcasing India's incredible diversity and rich cultural heritage to travelers from around the world.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-secondary mb-4">Why Choose Orbit Trails for Your India Adventure?</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                As a leading travel agency specializing in India tours, we understand that every traveler has unique desires and expectations. Our expertise in crafting personalized Golden Triangle tour packages, royal Rajasthan experiences, and custom India itineraries sets us apart.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <Award className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span>Award-winning customer service with 98% satisfaction rate</span>
                </li>
                <li className="flex items-start">
                  <Users className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span>Expert local guides with deep cultural knowledge</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span>Carefully selected accommodations and authentic experiences</span>
                </li>
                <li className="flex items-start">
                  <Clock className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <span>24/7 support throughout your journey</span>
                </li>
              </ul>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Orbit Trails team planning authentic India travel experiences"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Specializations */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary mb-6">Our Travel Specializations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We specialize in creating unforgettable journeys across India's most iconic destinations, with expertise in cultural heritage, luxury travel, and authentic local experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3">Golden Triangle Tours</h3>
              <p className="text-gray-600 leading-relaxed">
                Our signature Delhi-Agra-Jaipur packages showcase India's most iconic monuments including the Taj Mahal, Red Fort, and Amber Fort with expert storytelling.
              </p>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3">Royal Rajasthan Experiences</h3>
              <p className="text-gray-600 leading-relaxed">
                Explore the land of kings with our heritage tours covering magnificent palaces, desert safaris, and authentic Rajasthani culture in Jaipur, Udaipur, and Jodhpur.
              </p>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3">Custom India Itineraries</h3>
              <p className="text-gray-600 leading-relaxed">
                Personalized travel plans tailored to your interests, budget, and time frame. From spiritual journeys to adventure tours and luxury experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-secondary mb-8">Our Commitment to Excellence</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-12">
            At Orbit Trails, we believe that travel should be transformative, authentic, and worry-free. Our commitment goes beyond just showing you destinations – we create connections, memories, and understanding between cultures.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div>
              <h3 className="text-xl font-bold text-secondary mb-3">Sustainable Tourism</h3>
              <p className="text-gray-600 mb-6">We promote responsible travel that benefits local communities while preserving India's natural and cultural heritage for future generations.</p>
              
              <h3 className="text-xl font-bold text-secondary mb-3">Quality Assurance</h3>
              <p className="text-gray-600">Every aspect of your journey is carefully planned and quality-checked, from accommodation standards to transportation safety and guide expertise.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-secondary mb-3">Cultural Authenticity</h3>
              <p className="text-gray-600 mb-6">We provide genuine cultural experiences through partnerships with local artisans, families, and communities, ensuring authentic interactions.</p>
              
              <h3 className="text-xl font-bold text-secondary mb-3">Customer-Centric Service</h3>
              <p className="text-gray-600">Your satisfaction is our priority. From the initial consultation to your return home, we provide personalized attention and support.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
