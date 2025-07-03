import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

export default function Contact() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-secondary to-secondary/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Ready to plan your dream trip to India? Contact our travel experts
            and let us create an unforgettable experience for you
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <AnimatedSection direction="left">
              <div>
                <h2 className="text-3xl font-bold text-secondary mb-8">
                  Send us a Message
                </h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <Input placeholder="Your full name" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <Input placeholder="Your phone number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      placeholder="Tell us about your travel plans, interests, and any specific requirements..."
                      rows={6}
                      required
                    />
                  </div>
                  <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Send Message
                  </Button>
                </form>
              </div>
            </AnimatedSection>

            {/* Contact Information */}
            <AnimatedSection direction="right">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-secondary mb-8">
                    Contact Information
                  </h2>
                  <div className="space-y-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <MapPin className="w-6 h-6 text-primary mt-1" />
                          <div>
                            <h3 className="font-semibold text-secondary mb-1">
                              Office Address
                            </h3>
                            <p className="text-gray-600">
                              Orbit Trails
                              <br />
                              Jaipur, Rajasthan, India
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Mail className="w-6 h-6 text-primary mt-1" />
                          <div>
                            <h3 className="font-semibold text-secondary mb-1">
                              Email
                            </h3>
                            <p className="text-gray-600">
                              info@orbittrails.com
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Phone className="w-6 h-6 text-primary mt-1" />
                          <div>
                            <h3 className="font-semibold text-secondary mb-1">
                              Phone
                            </h3>
                            <p className="text-gray-600">+91 123 456 7890</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Clock className="w-6 h-6 text-primary mt-1" />
                          <div>
                            <h3 className="font-semibold text-secondary mb-1">
                              Business Hours
                            </h3>
                            <p className="text-gray-600">
                              Monday - Saturday: 9:00 AM - 6:00 PM
                              <br />
                              Sunday: 10:00 AM - 4:00 PM
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
