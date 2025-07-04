import { Link } from "react-router-dom";
import { MapPin, Instagram, Twitter, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="https://images.orbittrails.com/ORBIT.png"
                alt="Orbit Trails Logo"
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed">
              Experience the magic of India with our expertly crafted tour
              packages. From the Golden Triangle to Royal Rajasthan, create
              memories that last a lifetime.
            </p>
            <div className="flex items-center space-x-3">
              <a
                href="https://tripadvisor.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm6.5 9.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zm-11 0a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/orbittrails9/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/tours"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Our Tours
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Gallery
                </a>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Tours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Tours</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Golden Triangle
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Rajasthan Tours
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Kerala Backwaters
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Mumbai & Goa
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Spiritual India
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p>Orbit Trails</p>
                  <p>68/52, Pratap Nagar</p>
                  <p>Jaipur, Rajasthan, India</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:info@orbittrails.com"
                  className="text-sm text-gray-300 hover:text-primary transition-colors"
                >
                  info@orbittrails.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="tel:+911234567890"
                  className="text-sm text-gray-300 hover:text-primary transition-colors"
                >
                  +91 9829271900
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-600 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2024 Orbit Trails. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link
                to="/terms"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
