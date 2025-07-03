import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Eye, Shield } from "lucide-react";
import { OrbitTrailsAPI } from "@shared/api";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showAddTour, setShowAddTour] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [tourForm, setTourForm] = useState({
    name: "",
    category: "",
    price: "",
    duration: "",
    description: "",
    image: "",
  });
  
  // View dialog states
  const [showContactView, setShowContactView] = useState(false);
  const [showCustomTourView, setShowCustomTourView] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [selectedCustomTour, setSelectedCustomTour] = useState<any>(null);
  const [viewLoading, setViewLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = OrbitTrailsAPI.getToken();
    if (token) {
      setIsAuthenticated(true);
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await OrbitTrailsAPI.getAdminDashboard();
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await OrbitTrailsAPI.adminLogin(credentials);
      
      if (response.success && response.data?.token) {
        OrbitTrailsAPI.setToken(response.data.token);
        setIsAuthenticated(true);
        await fetchDashboardData();
      } else {
        toast({
          title: "Login Failed 🔒",
          description: response.message || "Invalid credentials. Please try again.",
          variant: "destructive",
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Error 🚫",
        description: "Login failed. Please check your connection and try again.",
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    OrbitTrailsAPI.clearToken();
    setIsAuthenticated(false);
    setDashboardData(null);
    setCredentials({ username: "", password: "" });
  };

  // View handlers
  const handleViewContact = async (contactId: string) => {
    setViewLoading(true);
    try {
      const response = await OrbitTrailsAPI.getContactMessageById(contactId);
      if (response.success) {
        setSelectedContact(response.data);
        setShowContactView(true);
      } else {
        toast({
          title: "Failed to Load Details 📋",
          description: "Unable to load contact details. Please try again.",
          variant: "destructive",
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Error fetching contact details:", error);
      toast({
        title: "Network Error 🌐",
        description: "Error loading contact details. Please check your connection.",
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setViewLoading(false);
    }
  };

  const handleViewCustomTour = async (tourId: string) => {
    setViewLoading(true);
    try {
      const response = await OrbitTrailsAPI.getCustomTourRequestById(tourId);
      if (response.success) {
        setSelectedCustomTour(response.data);
        setShowCustomTourView(true);
      } else {
        toast({
          title: "Failed to Load Tour Details 🎯",
          description: "Unable to load tour request details. Please try again.",
          variant: "destructive",
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Error fetching tour request details:", error);
      toast({
        title: "Network Error 🌐",
        description: "Error loading tour request details. Please check your connection.",
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setViewLoading(false);
    }
  };

  const handleAddTour = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tourData = {
        name: tourForm.name,
        description: tourForm.description,
        category: tourForm.category as 'Golden Triangle' | 'Rajasthan Tours' | 'Extended Tours',
        price: parseFloat(tourForm.price),
        duration: tourForm.duration,
        maxGuests: 20,
        minAge: 12,
        rating: 5.0,
        reviews: 0,
        highlights: ["Cultural Experience", "Expert Guide", "Comfortable Transport"],
        included: ["Accommodation", "Transportation", "Professional Guide"],
        notIncluded: ["Flights", "Personal Expenses", "Tips"],
        itinerary: [],
        images: [tourForm.image],
        destinations: [],
        status: 'active' as const,
      };

      const response = await OrbitTrailsAPI.createTour(tourData);
      
      if (response.success) {
        setShowAddTour(false);
        setTourForm({
          name: "",
          category: "",
          price: "",
          duration: "",
          description: "",
          image: "",
        });
        // Refresh dashboard data
        await fetchDashboardData();
        toast({
          title: "Tour Added Successfully! 🎉",
          description: "The new tour has been added to your tour catalog.",
          duration: 5000,
        });
      } else {
        toast({
          title: "Failed to Add Tour ❌",
          description: response.message || "Unable to add tour. Please try again.",
          variant: "destructive",
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Error adding tour:", error);
      toast({
        title: "Network Error 🌐",
        description: "Failed to add tour. Please check your connection and try again.",
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <p className="text-gray-600">Enter your credentials to continue</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <Input
                  type="text"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
              >
                Sign In
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Demo credentials: admin / admin123
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage tours, bookings, and customer inquiries
          </p>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="text-red-600 border-red-600 hover:bg-red-50"
        >
          Logout
        </Button>
      </div>

      {/* Dashboard Stats Cards */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tours</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData.tours?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Contact Messages</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData.contacts?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Plus className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Custom Requests</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData.customTours?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="tours" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tours">Tour Packages</TabsTrigger>
          <TabsTrigger value="contact">Contact Submissions</TabsTrigger>
          <TabsTrigger value="custom">Custom Tour Requests</TabsTrigger>
        </TabsList>

        {/* Tour Packages Management */}
        <TabsContent value="tours">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Tour Packages</CardTitle>
                <Dialog open={showAddTour} onOpenChange={setShowAddTour}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Tour
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Tour Package</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddTour} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Tour Name
                          </label>
                          <Input
                            placeholder="e.g., Golden Triangle Classic"
                            value={tourForm.name}
                            onChange={(e) => setTourForm({ ...tourForm, name: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Category
                          </label>
                          <select
                            className="w-full p-2 border rounded-md"
                            value={tourForm.category}
                            onChange={(e) => setTourForm({ ...tourForm, category: e.target.value })}
                            required
                          >
                            <option value="">Select Category</option>
                            <option value="Golden Triangle">
                              Golden Triangle
                            </option>
                            <option value="Extended Tours">Extended Tours</option>
                            <option value="Rajasthan Tours">Rajasthan Tours</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Price ($)
                          </label>
                          <Input 
                            type="number" 
                            placeholder="599" 
                            value={tourForm.price}
                            onChange={(e) => setTourForm({ ...tourForm, price: e.target.value })}
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Duration
                          </label>
                          <Input 
                            placeholder="7 Days" 
                            value={tourForm.duration}
                            onChange={(e) => setTourForm({ ...tourForm, duration: e.target.value })}
                            required 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Description
                        </label>
                        <Textarea
                          placeholder="Tour description..."
                          rows={4}
                          value={tourForm.description}
                          onChange={(e) => setTourForm({ ...tourForm, description: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Image URL
                        </label>
                        <Input 
                          placeholder="https://..." 
                          value={tourForm.image}
                          onChange={(e) => setTourForm({ ...tourForm, image: e.target.value })}
                          required 
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowAddTour(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="bg-primary hover:bg-primary/90"
                        >
                          Add Tour
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData?.tours?.length > 0 ? (
                    dashboardData.tours.map((tour: any) => (
                      <TableRow key={tour._id}>
                        <TableCell className="font-medium">{tour.name}</TableCell>
                        <TableCell>{tour.category}</TableCell>
                        <TableCell>${tour.price}</TableCell>
                        <TableCell>{tour.duration}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No tours found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Submissions */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Form Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData?.contacts?.length > 0 ? (
                    dashboardData.contacts.map((submission: any) => (
                      <TableRow key={submission._id}>
                        <TableCell className="font-medium">
                          {submission.name}
                        </TableCell>
                        <TableCell>{submission.email}</TableCell>
                        <TableCell>{submission.phone || 'N/A'}</TableCell>
                        <TableCell>{new Date(submission.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              submission.status === "new"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }
                          >
                            {submission.status || 'new'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewContact(submission._id)}
                            disabled={viewLoading}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No contact submissions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Tour Requests */}
        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Custom Tour Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Destinations</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Travelers</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData?.customTours?.length > 0 ? (
                    dashboardData.customTours.map((request: any) => (
                      <TableRow key={request._id}>
                        <TableCell className="font-medium">
                          {request.name}
                        </TableCell>
                        <TableCell>{request.email}</TableCell>
                        <TableCell>
                          <div className="max-w-32 truncate">
                            {request.destinations?.join(", ") || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>{request.budget}</TableCell>
                        <TableCell>{request.travelers}</TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            {request.status || 'pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewCustomTour(request._id)}
                            disabled={viewLoading}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No custom tour requests found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Contact View Dialog */}
      <Dialog open={showContactView} onOpenChange={setShowContactView}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Submission Details</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-sm">{selectedContact.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm">{selectedContact.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-sm">{selectedContact.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date Submitted</label>
                  <p className="text-sm">
                    {new Date(selectedContact.createdAt).toLocaleDateString()} at{' '}
                    {new Date(selectedContact.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Message</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={() => window.open(`mailto:${selectedContact.email}`, '_blank')}
                  className="mr-2"
                >
                  Reply via Email
                </Button>
                <Button variant="outline" onClick={() => setShowContactView(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Custom Tour View Dialog */}
      <Dialog open={showCustomTourView} onOpenChange={setShowCustomTourView}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Custom Tour Request Details</DialogTitle>
          </DialogHeader>
          {selectedCustomTour && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-sm">{selectedCustomTour.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm">{selectedCustomTour.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-sm">
                      {selectedCustomTour.countryCode} {selectedCustomTour.phone}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date Submitted</label>
                    <p className="text-sm">
                      {new Date(selectedCustomTour.createdAt).toLocaleDateString()} at{' '}
                      {new Date(selectedCustomTour.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Trip Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Start Date</label>
                    <p className="text-sm">
                      {new Date(selectedCustomTour.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Duration</label>
                    <p className="text-sm">{selectedCustomTour.duration} days</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Number of Travelers</label>
                    <p className="text-sm">{selectedCustomTour.numberOfTravelers}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Accommodation Type</label>
                    <p className="text-sm">{selectedCustomTour.accommodationType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Budget Range</label>
                    <p className="text-sm">{selectedCustomTour.budgetRange}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {selectedCustomTour.status || 'pending'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Destinations */}
              <div>
                <label className="text-sm font-medium text-gray-500">Selected Destinations</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedCustomTour.destinations?.map((destination: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {destination}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Comments */}
              {selectedCustomTour.comments && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Comments & Special Requirements</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{selectedCustomTour.comments}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button 
                  onClick={() => window.open(`mailto:${selectedCustomTour.email}?subject=Your Custom Tour Request - Orbit Trails`, '_blank')}
                  className="mr-2"
                >
                  Reply via Email
                </Button>
                <Button variant="outline" onClick={() => setShowCustomTourView(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
