import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CustomizeTourModalProps {
  trigger: React.ReactNode;
}

export default function CustomizeTourModal({
  trigger,
}: CustomizeTourModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    startDate: undefined as Date | undefined,
    duration: "",
    travelers: "",
    accommodation: "",
    destinations: [] as string[],
    budget: "",
    details: "",
    name: "",
    email: "",
    phone: "",
    countryCode: "+1",
  });

  const destinations = [
    "Golden Triangle & Rajasthan",
    "Kerala & South",
    "Mumbai Goa & Central India",
    "Varanasi & Amritsar",
  ];

  const budgetOptions = ["$500–1000", "$1000–2000", "$2000–3000", "$3000+"];

  const handleDestinationChange = (destination: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      destinations: checked
        ? [...prev.destinations, destination]
        : prev.destinations.filter((d) => d !== destination),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Custom tour request:", formData);
    alert(
      "Thank you! Your custom tour request has been submitted. We'll contact you within 24 hours.",
    );
    setIsOpen(false);
    // Reset form
    setFormData({
      startDate: undefined,
      duration: "",
      travelers: "",
      accommodation: "",
      destinations: [],
      budget: "",
      details: "",
      name: "",
      email: "",
      phone: "",
      countryCode: "+1",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Customize Your Perfect India Tour
          </DialogTitle>
          <p className="text-center text-gray-600">
            Tell us your preferences and we'll create a personalized itinerary
            just for you
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary border-b pb-2">
              Trip Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Start Date */}
              <div>
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate
                        ? format(formData.startDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) =>
                        setFormData((prev) => ({ ...prev, startDate: date }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Duration */}
              <div>
                <Label htmlFor="duration">Duration (days) *</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="e.g., 7"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      duration: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              {/* Number of Travelers */}
              <div>
                <Label htmlFor="travelers">No. of Travelers *</Label>
                <Input
                  id="travelers"
                  type="number"
                  placeholder="e.g., 2"
                  value={formData.travelers}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      travelers: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            {/* Accommodation Type */}
            <div>
              <Label>Accommodation Type *</Label>
              <RadioGroup
                value={formData.accommodation}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, accommodation: value }))
                }
                className="flex space-x-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="luxury" id="luxury" />
                  <Label htmlFor="luxury">Luxury</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comfort" id="comfort" />
                  <Label htmlFor="comfort">Comfort</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Destinations */}
            <div>
              <Label>Destinations (Select all that interest you) *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {destinations.map((destination) => (
                  <div
                    key={destination}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={destination}
                      checked={formData.destinations.includes(destination)}
                      onCheckedChange={(checked) =>
                        handleDestinationChange(destination, checked as boolean)
                      }
                    />
                    <Label htmlFor={destination} className="text-sm">
                      <MapPin className="w-4 h-4 inline mr-1 text-primary" />
                      {destination}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <Label>Budget per person *</Label>
              <Select
                value={formData.budget}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, budget: value }))
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select your budget range" />
                </SelectTrigger>
                <SelectContent>
                  {budgetOptions.map((budget) => (
                    <SelectItem key={budget} value={budget}>
                      {budget}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Additional Details */}
            <div>
              <Label htmlFor="details">Additional Details/Comments</Label>
              <Textarea
                id="details"
                placeholder="Tell us about your interests, special requirements, dietary restrictions, mobility concerns, or any specific experiences you'd like to include..."
                rows={4}
                value={formData.details}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, details: e.target.value }))
                }
                className="mt-2"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary border-b pb-2">
              Contact Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number (with country code) *</Label>
              <div className="flex space-x-2 mt-2">
                <Select
                  value={formData.countryCode}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, countryCode: value }))
                  }
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+1">+1</SelectItem>
                    <SelectItem value="+44">+44</SelectItem>
                    <SelectItem value="+91">+91</SelectItem>
                    <SelectItem value="+61">+61</SelectItem>
                    <SelectItem value="+33">+33</SelectItem>
                    <SelectItem value="+49">+49</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="phone"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="flex-1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-accent hover:bg-accent/90 px-8">
              Submit Custom Tour Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
