import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Home, 
  MapPin, 
  Compass, 
  Camera, 
  ArrowLeft,
  Plane,
  Mountain,
  Search
} from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Route tracking for analytics could be added here
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          {/* Animated travel icons */}
          <div className="relative mb-8">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="text-primary/20 mb-4"
            >
              <Compass className="w-32 h-32 mx-auto" />
            </motion.div>
            
            {/* Floating travel icons */}
            <motion.div
              animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-4 right-1/4 text-accent/40"
            >
              <Plane className="w-8 h-8" />
            </motion.div>
            
            <motion.div
              animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-4 left-1/4 text-secondary/40"
            >
              <Mountain className="w-6 h-6" />
            </motion.div>
            
            <motion.div
              animate={{ x: [0, 10, 0], y: [0, -5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-8 left-1/3 text-primary/30"
            >
              <Camera className="w-5 h-5" />
            </motion.div>
          </div>

          {/* 404 Number with travel theme */}
          <motion.h1 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-6"
          >
            404
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Oops! You've wandered off the trail
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Looks like this destination doesn't exist in our travel guides. 
              Don't worry though - there are plenty of amazing places waiting to be explored!
            </p>
          </motion.div>
        </motion.div>

        {/* Action Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Home className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Return Home</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start your journey from our homepage
              </p>
              <Button asChild variant="outline" size="sm">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4" />
                  Go Home
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-accent/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Explore Tours</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Discover our amazing travel packages
              </p>
              <Button asChild variant="outline" size="sm">
                <Link to="/tours">
                  <Search className="w-4 h-4" />
                  Browse Tours
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-secondary/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                <Camera className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">Contact Us</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Let us help plan your perfect trip
              </p>
              <Button asChild variant="outline" size="sm">
                <Link to="/contact">
                  Get Help
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional helpful message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <p className="text-muted-foreground">
            <strong>Lost traveler?</strong> Use the navigation above or contact our travel experts for assistance.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
