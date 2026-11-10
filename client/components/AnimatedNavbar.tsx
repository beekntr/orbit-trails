import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";
import { motion, AnimatePresence } from "framer-motion";

export default function AnimatedNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Our Tours", href: "/tours" },
    { name: "Private Tours", href: "/luxury-private-tours-india" },
    { name: "Travel Guide", href: "/india-travel-guide-first-time-visitors" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white shadow-sm border-b sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="https://images.orbittrails.com/ORBIT.png"
                alt="Orbit Trails Logo"
                height={32}
                decoding="async"
                className="h-8 w-auto"
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-6">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  to={item.href}
                  className={cn(
                    "text-sm font-medium whitespace-nowrap transition-colors hover:text-primary relative",
                    isActive(item.href)
                      ? "text-primary"
                      : "text-secondary hover:text-primary",
                  )}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                      initial={false}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Social Icons & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <Button asChild size="sm" className="hidden bg-accent hover:bg-accent/90 sm:inline-flex">
              <Link to="/plan-my-trip">Plan My Trip</Link>
            </Button>

            {/* Social Icons - Hidden on mobile */}
            <div className="hidden xl:flex items-center space-x-3">
              {SITE.reviewProfiles.tripadvisor && (
                <a
                  href={SITE.reviewProfiles.tripadvisor}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-secondary hover:text-primary transition-colors"
                >
                  Tripadvisor
                </a>
              )}
              <motion.a
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                href="https://www.instagram.com/orbittrails9/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                href="https://twitter.com/orbittrails"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
            </div>

            {/* Mobile menu button */}
            <div className="xl:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="p-2"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="xl:hidden overflow-hidden"
            >
              <div className="pb-4">
                <div className="flex flex-col space-y-3">
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "text-base font-medium transition-colors hover:text-primary px-3 py-2 rounded-md block",
                          isActive(item.href)
                            ? "text-primary bg-primary/10"
                            : "text-secondary",
                        )}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}

                  <Link
                    to="/plan-my-trip"
                    onClick={() => setIsOpen(false)}
                    className="mx-3 rounded-md bg-accent px-3 py-2 text-center text-base font-semibold text-white sm:hidden"
                  >
                    Plan My Trip
                  </Link>

                  {/* Mobile Social Icons */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="flex items-center space-x-4 px-3 pt-4 border-t"
                  >
                    {SITE.reviewProfiles.tripadvisor && (
                      <a
                        href={SITE.reviewProfiles.tripadvisor}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-secondary hover:text-primary transition-colors"
                      >
                        Tripadvisor
                      </a>
                    )}
                    <a
                      href="https://www.instagram.com/orbittrails9/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:text-primary transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a
                      href="https://twitter.com/orbittrails"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:text-primary transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
