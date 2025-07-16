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
                title="Follow us on TripAdvisor"
              >
                <i className="fa fa-tripadvisor" aria-hidden="true"></i>
              </a>
              <a
                href="https://www.instagram.com/orbittrails9/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-colors"
                title="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/orbittrails"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-colors"
                title="Follow us on Twitter"
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
            <div className="space-y-6">
              {/* India Office */}
              <div>
                <div className="font-semibold text-primary mb-1">India Office</div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-300">
                    <p>Orbit Trails</p>
                    <p>68/52, Pratap Nagar</p>
                    <p>Jaipur, Rajasthan, India</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                  <a
                    href="mailto:info@orbittrails.com"
                    className="text-sm text-gray-300 hover:text-primary transition-colors"
                  >
                    info@orbittrails.com
                  </a>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <a
                    href="tel:+919829271900"
                    className="text-sm text-gray-300 hover:text-primary transition-colors"
                  >
                    +91 86199 74762
                  </a>
                  <a
                    href="https://wa.me/919829271900"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-green-400 hover:text-green-600"
                    title="Chat on WhatsApp"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20" height="20" fill="currentColor">
                      <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.832 4.584 2.236 6.393L4 29l7.824-2.205C13.41 27.597 14.686 28 16 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.18 0-2.332-.205-3.418-.607l-.244-.09-4.646 1.31 1.32-4.527-.158-.234C7.205 19.332 7 18.18 7 17c0-4.963 4.037-9 9-9s9 4.037 9 9-4.037 9-9 9zm5.09-6.26c-.278-.139-1.646-.812-1.9-.904-.254-.093-.439-.139-.625.139-.186.278-.719.904-.881 1.09-.163.186-.325.209-.603.07-.278-.139-1.175-.433-2.24-1.38-.828-.738-1.387-1.65-1.55-1.928-.163-.278-.017-.428.123-.567.127-.126.278-.326.417-.489.139-.163.186-.278.278-.463.093-.186.047-.349-.023-.488-.07-.139-.625-1.508-.857-2.064-.226-.543-.456-.47-.625-.479l-.53-.009c-.163 0-.428.06-.653.279-.225.22-.86.84-.86 2.048 0 1.208.88 2.377 1.002 2.543.123.163 1.73 2.646 4.19 3.604.586.202 1.043.322 1.4.412.588.15 1.124.129 1.548.078.472-.056 1.446-.591 1.65-1.162.204-.57.204-1.058.143-1.162-.06-.104-.225-.163-.472-.278z"/>
                    </svg>
                  </a>
                </div>
              </div>
              {/* London Office */}
              <div>
                <div className="font-semibold text-primary mb-1">London Office</div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-300">
                    <p>68, New Road,</p>
                    <p>London, TW14 8HT,</p>
                    <p>United Kingdom</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <a
                    href="tel:+447450164575"
                    className="text-sm text-gray-300 hover:text-primary transition-colors"
                  >
                    +44 7450 164575
                  </a>
                </div>
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
