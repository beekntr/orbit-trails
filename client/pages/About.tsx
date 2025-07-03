import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Award, MapPin, Clock } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen">
      <Navbar />

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
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
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

      {/* Content will be expanded in next iteration */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-secondary mb-8">
            More Content Coming Soon
          </h2>
          <p className="text-lg text-gray-600">
            We're working on bringing you our complete story, team information,
            and company values. Check back soon!
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
