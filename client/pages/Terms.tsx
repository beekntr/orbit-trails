import { motion } from "framer-motion";
import { FileText, Mail, Phone, Scale, Clock, AlertTriangle, CreditCard, Users, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AnimatedSection from "@/components/AnimatedSection";

export default function Terms() {
  const contactInfo = {
    email: "support@orbittrails.com",
    phone: "+91 9829271900"
  };

  const cancellationFees = [
    {
      notice: "≥ 60 days",
      fee: "10% of total trip cost"
    },
    {
      notice: "31–59 days",
      fee: "25%"
    },
    {
      notice: "16–30 days",
      fee: "50%"
    },
    {
      notice: "≤ 15 days or no-show",
      fee: "100%"
    }
  ];

  const paymentTerms = [
    {
      type: "Standard packages",
      terms: "25% deposit at confirmation; balance due 30 days before departure"
    },
    {
      type: "Peak-season or non-refundable services",
      terms: "100% payment immediately"
    }
  ];

  const keyPoints = [
    {
      icon: <CreditCard className="w-6 h-6 text-primary" />,
      title: "Payment Terms",
      description: "Flexible payment schedules with secure processing"
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-accent" />,
      title: "Cancellation Policy",
      description: "Clear guidelines with tiered fee structure"
    },
    {
      icon: <Shield className="w-6 h-6 text-secondary" />,
      title: "Travel Insurance",
      description: "Comprehensive coverage strongly recommended"
    },
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: "Customer Responsibility",
      description: "Travel documents, behavior, and compliance"
    }
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
                <Scale className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms & Conditions of Service
            </h1>
            <p className="text-xl mb-6 text-gray-200">
              Important terms governing your travel experience with Orbit Trails
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                <FileText className="w-4 h-4 mr-2" />
                Effective Date: 15 June 2025
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                <Clock className="w-4 h-4 mr-2" />
                Last Updated: 15 June 2025
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
                These Terms & Conditions ("Terms") constitute a binding agreement between you and <strong>Orbit Trails</strong>. 
                By booking a tour, purchasing an ancillary product, or simply browsing our website, you accept these Terms in full.
              </p>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Key Points Overview */}
        <AnimatedSection delay={0.1}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {keyPoints.map((point, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {point.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{point.title}</h3>
                  <p className="text-sm text-gray-600">{point.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedSection>

        {/* 1. Making a Booking */}
        <AnimatedSection delay={0.2}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary flex items-center">
                <FileText className="w-6 h-6 mr-3 text-primary" />
                1. Making a Booking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p><strong>1.1</strong> A booking is confirmed only when we issue a written confirmation (voucher, ticket, or invoice) after receiving the required deposit or full payment.</p>
                <p><strong>1.2</strong> Prices quoted are dynamic and may fluctuate until a booking is secured. Currency exchange fees, card-issuer charges, or bank transfer costs are borne by the customer.</p>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* 2. Payment Schedule */}
        <AnimatedSection delay={0.3}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary flex items-center">
                <CreditCard className="w-6 h-6 mr-3 text-primary" />
                2. Payment Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {paymentTerms.map((term, index) => (
                  <div key={index} className="p-4 bg-blue-50 border-l-4 border-blue-400">
                    <p className="font-semibold text-blue-800">{term.type}:</p>
                    <p className="text-blue-700">{term.terms}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
                <p className="text-yellow-800">
                  <strong>Important:</strong> If you miss a payment deadline, we reserve the right to cancel the reservation and retain any non-refundable amounts.
                </p>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* 3. Cancellations & Refunds */}
        <AnimatedSection delay={0.4}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary flex items-center">
                <AlertTriangle className="w-6 h-6 mr-3 text-accent" />
                3. Cancellations & Refunds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Notice period before first service</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Cancellation fee (per traveller)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cancellationFees.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 font-medium">{item.notice}</td>
                        <td className="border border-gray-300 px-4 py-3">{item.fee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-3">
                <div className="p-4 bg-red-50 border-l-4 border-red-400">
                  <p className="text-red-800">
                    <strong>Non-refundable items:</strong> Airline tickets, visa fees, and certain hotel rates are non-refundable once issued.
                  </p>
                </div>
                <p className="text-gray-700">
                  Refunds are processed to the original payment method within 14 business days, minus bank or gateway fees.
                </p>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* 4. Changes & Substitutions */}
        <AnimatedSection delay={0.5}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary">
                4. Changes & Substitutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p><strong>4.1</strong> If you request an itinerary change after confirmation, we will endeavour to accommodate it, subject to supplier availability and any price difference.</p>
                <p><strong>4.2</strong> Orbit Trails may modify arrangements due to force majeure (acts of God, political unrest, public-health emergencies, etc.). Where possible, we will offer an equivalent alternative or a travel credit.</p>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* 5. Travel Documents & Insurance */}
        <AnimatedSection delay={0.6}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary flex items-center">
                <Shield className="w-6 h-6 mr-3 text-primary" />
                5. Travel Documents & Insurance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p><strong>5.1</strong> You are responsible for ensuring passports, visas, vaccinations, and other entry requirements are valid for all destinations.</p>
                <div className="p-4 bg-green-50 border-l-4 border-green-400">
                  <p className="text-green-800">
                    <strong>5.2</strong> Comprehensive travel insurance covering medical, trip cancellation, personal liability, and COVID‑19 contingencies is strongly recommended. Orbit Trails is not liable for losses arising from your failure to purchase adequate cover.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* 6. Responsibility & Liability */}
        <AnimatedSection delay={0.7}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary">
                6. Responsibility & Liability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p><strong>6.1</strong> Orbit Trails acts solely as an intermediary between you and the third-party suppliers. We exercise due diligence in selecting partners but cannot be held responsible for their acts or omissions.</p>
                <div className="p-4 bg-blue-50 border-l-4 border-blue-400">
                  <p className="text-blue-800">
                    <strong>6.2</strong> Our maximum liability for proven direct damages arising out of our own negligence shall not exceed the total amount you paid for the specific service giving rise to the claim. We accept no liability for indirect or consequential losses.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* 7. Behaviour & Compliance */}
        <AnimatedSection delay={0.8}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary flex items-center">
                <Users className="w-6 h-6 mr-3 text-primary" />
                7. Behaviour & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                You agree to follow all local laws, respect fellow travellers, and comply with reasonable instructions from guides or service providers. We may terminate services to any participant who causes disturbance or poses a safety risk—with no refund.
              </p>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* 8. Intellectual Property */}
        <AnimatedSection delay={0.9}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary">
                8. Intellectual Property
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                All content on orbittrails.com—including text, logos, photographs, video, and code—is owned by or licensed to Orbit Trails. No part may be reproduced without prior written consent.
              </p>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* 9. Marketing Materials */}
        <AnimatedSection delay={1.0}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary">
                9. Marketing Materials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                By sharing reviews, photos, or testimonials you grant Orbit Trails a perpetual, royalty-free licence to publish such content in our marketing channels. If you prefer to opt out, notify us in writing.
              </p>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* 10. Dispute Resolution & Governing Law */}
        <AnimatedSection delay={1.1}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary flex items-center">
                <Scale className="w-6 h-6 mr-3 text-secondary" />
                10. Dispute Resolution & Governing Law
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                These Terms are governed by the laws of India. Any dispute that cannot be settled amicably within 30 days shall be subject to the exclusive jurisdiction of the courts in Jaipur, Rajasthan, India.
              </p>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* 11. Severability */}
        <AnimatedSection delay={1.2}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary">
                11. Severability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                If any provision of these Terms is deemed unenforceable, the remainder shall remain in full force.
              </p>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* 12. Contact */}
        <AnimatedSection delay={1.3}>
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary">
                12. Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Orbit Trails Support</h3>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <a href={`mailto:${contactInfo.email}`} className="text-primary hover:underline font-medium">
                      {contactInfo.email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <a href={`tel:${contactInfo.phone}`} className="text-primary hover:underline font-medium">
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    For immediate assistance with bookings, cancellations, or general inquiries, our support team is here to help.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  );
}
