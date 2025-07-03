import { motion } from "framer-motion";
import { Shield, Mail, Phone, MapPin, Clock, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AnimatedSection from "@/components/AnimatedSection";

export default function Privacy() {
  const contactInfo = {
    dpo: "Data Protection Officer (DPO)",
    company: "Orbit Trails Private Limited",
    address: "68/52 Pratap Nagar, Jaipur",
    phone: "+91 98292 71900",
    email: "privacy@orbittrails.com",
    hours: "9:00 AM – 9:00 PM IST, Monday – Sunday"
  };

  const dataCategories = [
    {
      category: "Identity & Contact",
      examples: "Name, gender, address, email, phone"
    },
    {
      category: "Transaction & Payment",
      examples: "Bookings, travel dates, card or UPI details"
    },
    {
      category: "Technical",
      examples: "IP, browser/device info, cookies"
    },
    {
      category: "Profile & Preferences",
      examples: "Saved itineraries, meal/seat choices"
    },
    {
      category: "Sensitive / Special",
      examples: "Nationality, disability info, passport scan"
    },
    {
      category: "User-Generated",
      examples: "Photos, reviews, shared documents"
    },
    {
      category: "Third-Party Data",
      examples: "Info from partners like airlines or insurers"
    }
  ];

  const sharingInfo = [
    {
      recipient: "Travel suppliers",
      purpose: "Booking fulfilment",
      safeguards: "Confidentiality agreements"
    },
    {
      recipient: "Payment processors",
      purpose: "Transaction handling",
      safeguards: "PCI-DSS compliant"
    },
    {
      recipient: "Govt / regulators",
      purpose: "Legal compliance",
      safeguards: "Required by law"
    },
    {
      recipient: "Group companies",
      purpose: "Support, IT, analytics",
      safeguards: "Access controlled"
    },
    {
      recipient: "Buyers / investors",
      purpose: "Company transitions",
      safeguards: "Anonymised data where possible"
    }
  ];

  const userRights = [
    "Access your personal data",
    "Request corrections or deletion",
    "Withdraw consent any time",
    "Opt out of promotional emails",
    "Request data transfer (portability)"
  ];

  const securityMeasures = [
    "Encrypted data via TLS/SSL",
    "Firewall & access control protections",
    "Limited, role-based employee access",
    "Staff training and audits",
    "Retention period: 5 years or legal minimum"
  ];

  const cookieUses = [
    "Save your login sessions",
    "Track usage and analytics",
    "Store travel preferences",
    "Deliver personalized content and offers"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-secondary via-primary to-accent text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full">
                <Shield className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl mb-6 text-gray-200">
              Your privacy matters to us. Learn how we protect and use your data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                <FileText className="w-4 h-4 mr-2" />
                Effective Date: 15 June 2025
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                <Clock className="w-4 h-4 mr-2" />
                Last Updated: 15-06-2025
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <AnimatedSection>
          <Card className="mb-8">
            <CardContent className="p-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                <strong>Orbit Trails Private Limited</strong> respects your privacy and is committed to safeguarding your personal data.
              </p>
              <p className="text-gray-600 mt-4">
                By accessing or using any Sales Channel—including our website <strong>orbittrails.com</strong> or mobile/app platforms—you agree to this Privacy Policy.
              </p>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Definitions */}
        <AnimatedSection delay={0.1}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary flex items-center">
                <FileText className="w-6 h-6 mr-3 text-primary" />
                1. Definitions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <strong>User:</strong> Anyone who browses, enquires, or buys from us.
                </div>
                <div>
                  <strong>Personal Information:</strong> Data that identifies you (see Section 2).
                </div>
                <div>
                  <strong>Applicable Law:</strong> Indian DPDP Act 2023, GDPR, and others.
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* What We Collect */}
        <AnimatedSection delay={0.2}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary flex items-center">
                <Shield className="w-6 h-6 mr-3 text-primary" />
                2. What We Collect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-6">
                Depending on how you interact with Orbit Trails, we may collect:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Category</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Typical Examples</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataCategories.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 font-medium">{item.category}</td>
                        <td className="border border-gray-300 px-4 py-3">{item.examples}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> We don't knowingly collect data from anyone under 18 without guardian consent.
                </p>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* How We Use Your Information */}
        <AnimatedSection delay={0.3}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary">
                3. How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">We process personal data based on:</p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <div><strong>Contractual need</strong> – bookings, support, notifications</div>
                  <div><strong>Legal obligations</strong> – compliance, taxes, verifications</div>
                </div>
                <div className="space-y-2">
                  <div><strong>Legitimate interest</strong> – service improvements, security</div>
                  <div><strong>Consent</strong> – marketing, promotions, surveys</div>
                </div>
              </div>
              <p className="text-gray-700 mb-3">Typical uses include:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Booking processing and itinerary updates</li>
                <li>Trip alerts via SMS, WhatsApp, email</li>
                <li>User authentication and fraud prevention</li>
                <li>Customer support and feedback</li>
                <li>Analytics and anonymous statistics</li>
              </ul>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Sharing & Disclosure */}
        <AnimatedSection delay={0.4}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary">
                4. Sharing & Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-6">
                <strong>We do not sell your data.</strong> Data is shared only when required:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Recipient</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Purpose</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Safeguards</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sharingInfo.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 font-medium">{item.recipient}</td>
                        <td className="border border-gray-300 px-4 py-3">{item.purpose}</td>
                        <td className="border border-gray-300 px-4 py-3">{item.safeguards}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* International Transfers */}
        <AnimatedSection delay={0.5}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary">
                5. International Transfers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Data may be stored or transferred internationally with lawful safeguards such as EU SCCs or adequacy decisions.
              </p>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Security Measures */}
        <AnimatedSection delay={0.6}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary">
                6. Security Measures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {securityMeasures.map((measure, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-gray-700">{measure}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Your Rights */}
        <AnimatedSection delay={0.7}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary">
                7. Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">You can:</p>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {userRights.map((right, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-gray-700">{right}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-green-50 border-l-4 border-green-400">
                <p className="text-green-800">
                  Reach us at <strong>privacy@orbittrails.com</strong> to exercise your rights.
                </p>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Cookies */}
        <AnimatedSection delay={0.8}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary">
                8. Cookies & Similar Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">We use cookies to:</p>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {cookieUses.map((use, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <span className="text-gray-700">{use}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-600">
                You may disable cookies anytime via your browser settings.
              </p>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Policy Updates */}
        <AnimatedSection delay={0.9}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary">
                9. Policy Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                We may update this Privacy Policy. Material changes will be notified via email or site notice.
              </p>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Contact Information */}
        <AnimatedSection delay={1.0}>
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary">
                10. Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold text-gray-800">{contactInfo.dpo}</p>
                      <p className="text-gray-600">{contactInfo.company}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <p className="text-gray-700">{contactInfo.address}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <a href={`tel:${contactInfo.phone}`} className="text-primary hover:underline">
                      {contactInfo.phone}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <a href={`mailto:${contactInfo.email}`} className="text-primary hover:underline">
                      {contactInfo.email}
                    </a>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-primary mt-1" />
                    <p className="text-gray-700">{contactInfo.hours}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  );
}
