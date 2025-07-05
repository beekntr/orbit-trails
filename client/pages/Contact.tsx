import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { OrbitTrailsAPI } from "@shared/api";
import { useToast } from "@/hooks/use-toast";
import { useSEO, SEOConfigs } from "@/hooks/useSEO";

export default function Contact() {
  // SEO optimization for contact page
  useSEO({
    ...SEOConfigs.contact,
    canonicalUrl: 'https://www.orbittrails.com/contact'
  });

  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Frontend validation
      if (formData.message.trim().length < 10) {
        toast({
          title: "Message Too Short ✏️",
          description: "Please write a message with at least 10 characters.",
          variant: "destructive",
          duration: 4000,
        });
        setIsLoading(false);
        return;
      }

      // Clean the form data - remove empty phone field if empty
      const cleanedFormData = {
        ...formData,
        phone: formData.phone.trim() || undefined
      };
      
      console.log('Submitting contact form with data:', cleanedFormData);
      
      const response = await OrbitTrailsAPI.submitContact(cleanedFormData);
      
      if (response.success) {
        toast({
          title: "Message Sent Successfully! ✉️",
          description: response.message || "Thank you! Your message has been sent successfully. We will get back to you soon!",
          duration: 5000,
        });
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        console.error('Contact form submission failed:', response);
        console.error('Validation errors:', response.errors);
        toast({
          title: "Failed to Send Message ❌",
          description: response.errors ? 
            `Validation error: ${response.errors.map((e: any) => e.msg || e.message).join(', ')}` : 
            (response.message || "Please try again later."),
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast({
        title: "Network Error 🌐",
        description: "Unable to send message. Please check your connection and try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

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
            <div>
              <div>
                <h2 className="text-3xl font-bold text-secondary mb-8">
                  Send us a Message
                </h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <Input 
                        name="name"
                        placeholder="Your full name" 
                        value={formData.name}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <Input 
                      name="phone"
                      placeholder="Your phone number" 
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message * (minimum 10 characters)
                    </label>
                    <Textarea
                      name="message"
                      placeholder="Tell us about your travel plans, interests, and any specific requirements... (minimum 10 characters)"
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      minLength={10}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div>
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
                              <p>68/52, Pratap Nagar</p>
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
                            <p className="text-gray-600">+91 9829271900</p>
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
