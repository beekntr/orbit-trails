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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Eye, Shield, Star, Check, X, MessageSquare } from "lucide-react";
import { OrbitTrailsAPI, Review } from "@shared/api";
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
  const [showEditTour, setShowEditTour] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingTour, setEditingTour] = useState<any>(null);
  const [deletingTour, setDeletingTour] = useState<{id: string, name: string} | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [tourForm, setTourForm] = useState({
    name: "",
    category: "",
    duration: "",
    description: "",
    overview: "",
    highlights: [""],
    included: [""],
    notIncluded: [""],
    itinerary: [{ day: 1, title: "", description: "", highlights: [""] }],
    images: [""],
    destinations: [""],
  });
  
  // View dialog states
  const [showContactView, setShowContactView] = useState(false);
  const [showCustomTourView, setShowCustomTourView] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [selectedCustomTour, setSelectedCustomTour] = useState<any>(null);
  const [viewLoading, setViewLoading] = useState(false);

  // Review states
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

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
      const [dashboardResponse, reviewsResponse] = await Promise.all([
        OrbitTrailsAPI.getAdminDashboard(),
        OrbitTrailsAPI.getAllReviews()
      ]);
      
      if (dashboardResponse.success) {
        setDashboardData(dashboardResponse.data);
      }
      
      if (reviewsResponse.success && reviewsResponse.data) {
        setReviews(reviewsResponse.data);
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

  // Review Management Functions
  const handleUpdateReviewStatus = async (reviewId: string, status: 'approved' | 'rejected') => {
    setReviewsLoading(true);
    try {
      const response = await OrbitTrailsAPI.updateReviewStatus(reviewId, status);
      
      if (response.success) {
        // Update local state
        setReviews(prevReviews => 
          prevReviews.map(review => 
            review._id === reviewId 
              ? { ...review, status, isApproved: status === 'approved' }
              : review
          )
        );
        
        toast({
          title: `Review ${status === 'approved' ? 'Approved' : 'Rejected'} ✅`,
          description: `The customer review has been ${status === 'approved' ? 'approved and will be visible on your website' : 'rejected'}.`,
          duration: 5000,
        });
      } else {
        toast({
          title: "Failed to Update Review ❌",
          description: response.message || "Unable to update review status. Please try again.",
          variant: "destructive",
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Error updating review status:", error);
      toast({
        title: "Network Error 🌐",
        description: "Failed to update review status. Please check your connection and try again.",
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    setReviewsLoading(true);
    try {
      const response = await OrbitTrailsAPI.deleteReview(reviewId);
      
      if (response.success) {
        // Remove from local state
        setReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId));
        
        toast({
          title: "Review Deleted Successfully! 🗑️",
          description: "The customer review has been permanently removed.",
          duration: 5000,
        });
      } else {
        toast({
          title: "Failed to Delete Review ❌",
          description: response.message || "Unable to delete review. Please try again.",
          variant: "destructive",
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        title: "Network Error 🌐",
        description: "Failed to delete review. Please check your connection and try again.",
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleAddTour = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate random rating between 4.0 and 5.0
      const randomRating = parseFloat((Math.random() * (5.0 - 4.0) + 4.0).toFixed(1));
      
      const tourData = {
        name: tourForm.name,
        description: tourForm.description,
        overview: tourForm.overview,
        category: tourForm.category as 'Golden Triangle' | 'Rajasthan Tours' | 'Extended Tours',
        duration: tourForm.duration,
        maxGuests: 20,
        minAge: 12,
        rating: randomRating,
        reviews: Math.floor(Math.random() * 100) + 20, // Random reviews between 20-120
        highlights: tourForm.highlights.filter(h => h.trim() !== ''),
        included: tourForm.included.filter(i => i.trim() !== ''),
        notIncluded: tourForm.notIncluded.filter(n => n.trim() !== ''),
        itinerary: tourForm.itinerary.map(item => ({
          ...item,
          highlights: item.highlights.filter(h => h.trim() !== '')
        })),
        images: tourForm.images.filter(img => img.trim() !== ''),
        destinations: tourForm.destinations.filter(d => d.trim() !== ''),
        status: 'active' as const,
      };

      const response = await OrbitTrailsAPI.createTour(tourData);
      
      if (response.success) {
        setShowAddTour(false);
        setTourForm({
          name: "",
          category: "",
          duration: "",
          description: "",
          overview: "",
          highlights: [""],
          included: [""],
          notIncluded: [""],
          itinerary: [{ day: 1, title: "", description: "", highlights: [""] }],
          images: [""],
          destinations: [""],
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

  const handleEditTour = (tour: any) => {
    setEditingTour(tour);
    setTourForm({
      name: tour.name,
      category: tour.category,
      duration: tour.duration,
      description: tour.description,
      overview: tour.overview,
      highlights: tour.highlights.length > 0 ? tour.highlights : [""],
      included: tour.included.length > 0 ? tour.included : [""],
      notIncluded: tour.notIncluded.length > 0 ? tour.notIncluded : [""],
      itinerary: tour.itinerary.length > 0 ? tour.itinerary : [{ day: 1, title: "", description: "", highlights: [""] }],
      images: tour.images.length > 0 ? tour.images : [""],
      destinations: tour.destinations.length > 0 ? tour.destinations : [""],
    });
    setShowEditTour(true);
  };

  const handleUpdateTour = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate random rating between 4.0 and 5.0 for new tours, keep existing for updates
      const rating = editingTour?.rating || parseFloat((Math.random() * (5.0 - 4.0) + 4.0).toFixed(1));
      
      const tourData = {
        name: tourForm.name,
        description: tourForm.description,
        overview: tourForm.overview,
        category: tourForm.category as 'Golden Triangle' | 'Rajasthan Tours' | 'Extended Tours',
        duration: tourForm.duration,
        maxGuests: editingTour?.maxGuests || 20,
        minAge: editingTour?.minAge || 12,
        rating: rating,
        reviews: editingTour?.reviews || Math.floor(Math.random() * 100) + 20,
        highlights: tourForm.highlights.filter(h => h.trim() !== ''),
        included: tourForm.included.filter(i => i.trim() !== ''),
        notIncluded: tourForm.notIncluded.filter(n => n.trim() !== ''),
        itinerary: tourForm.itinerary.map(item => ({
          ...item,
          highlights: item.highlights.filter(h => h.trim() !== '')
        })),
        images: tourForm.images.filter(img => img.trim() !== ''),
        destinations: tourForm.destinations.filter(d => d.trim() !== ''),
        status: 'active' as const,
      };

      const response = await OrbitTrailsAPI.updateTour(editingTour._id, tourData);
      
      if (response.success) {
        setShowEditTour(false);
        setEditingTour(null);
        setTourForm({
          name: "",
          category: "",
          duration: "",
          description: "",
          overview: "",
          highlights: [""],
          included: [""],
          notIncluded: [""],
          itinerary: [{ day: 1, title: "", description: "", highlights: [""] }],
          images: [""],
          destinations: [""],
        });
        // Refresh dashboard data
        await fetchDashboardData();
        toast({
          title: "Tour Updated Successfully! ✅",
          description: "The tour package has been updated in your catalog.",
          duration: 5000,
        });
      } else {
        toast({
          title: "Failed to Update Tour ❌",
          description: response.message || "Unable to update tour. Please try again.",
          variant: "destructive",
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Error updating tour:", error);
      toast({
        title: "Network Error 🌐",
        description: "Failed to update tour. Please check your connection and try again.",
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTour = (tourId: string, tourName: string) => {
    setDeletingTour({ id: tourId, name: tourName });
    setShowDeleteDialog(true);
  };

  const confirmDeleteTour = async () => {
    if (!deletingTour) return;

    try {
      setLoading(true);
      const response = await OrbitTrailsAPI.deleteTour(deletingTour.id);
      
      if (response.success) {
        await fetchDashboardData();
        toast({
          title: "Tour Deleted Successfully! 🗑️",
          description: `"${deletingTour.name}" has been removed from your tour catalog.`,
          duration: 5000,
        });
      } else {
        toast({
          title: "Failed to Delete Tour ❌",
          description: response.message || "Unable to delete tour. Please try again.",
          variant: "destructive",
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Error deleting tour:", error);
      toast({
        title: "Network Error 🌐",
        description: "Failed to delete tour. Please check your connection and try again.",
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
      setDeletingTour(null);
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Customer Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reviews.length}
                  </p>
                  <p className="text-xs text-gray-500">
                    {reviews.filter(r => r.status === 'pending').length} pending
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="tours" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tours">Tour Packages</TabsTrigger>
          <TabsTrigger value="contact">Contact Submissions</TabsTrigger>
          <TabsTrigger value="custom">Custom Tour Requests</TabsTrigger>
          <TabsTrigger value="reviews">Customer Reviews</TabsTrigger>
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
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Tour Package</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddTour} className="space-y-6">
                      {/* Basic Information */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Tour Package Name *
                            </label>
                            <Input
                              placeholder="e.g., Golden Triangle Classic Adventure"
                              value={tourForm.name}
                              onChange={(e) => setTourForm({ ...tourForm, name: e.target.value })}
                              required
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Category *
                            </label>
                            <select
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                              value={tourForm.category}
                              onChange={(e) => setTourForm({ ...tourForm, category: e.target.value })}
                              required
                            >
                              <option value="">Select Category</option>
                              <option value="Golden Triangle">Golden Triangle Tours</option>
                              <option value="Extended Tours">Extended Tours</option>
                              <option value="Rajasthan Tours">Rajasthan Tours</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Duration *
                            </label>
                            <Input 
                              placeholder="e.g., 7 Days / 6 Nights" 
                              value={tourForm.duration}
                              onChange={(e) => setTourForm({ ...tourForm, duration: e.target.value })}
                              required 
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Status
                            </label>
                            <select
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                              value="active"
                              disabled
                            >
                              <option value="active">Active</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">New tours are automatically set to active</p>
                          </div>
                        </div>
                      </div>

                      {/* Package Overview & Description */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Package Overview & Description</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Package Overview * 
                              <span className="text-xs text-gray-500">(This appears on tour cards - keep it concise and appealing)</span>
                            </label>
                            <Textarea
                              placeholder="A captivating brief overview that entices travelers... (e.g., 'Experience the magical Golden Triangle circuit covering Delhi, Agra, and Jaipur with iconic monuments, rich culture, and heritage hotels.')"
                              rows={3}
                              value={tourForm.overview}
                              onChange={(e) => setTourForm({ ...tourForm, overview: e.target.value })}
                              required
                              className="w-full"
                            />
                            <p className="text-xs text-gray-500 mt-1">Recommended: 100-200 characters</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Detailed Description *
                              <span className="text-xs text-gray-500">(This appears on the tour details page)</span>
                            </label>
                            <Textarea
                              placeholder="Provide a comprehensive description of the tour package including what makes it special, key experiences, cultural highlights, and what travelers can expect..."
                              rows={6}
                              value={tourForm.description}
                              onChange={(e) => setTourForm({ ...tourForm, description: e.target.value })}
                              required
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Tour Highlights */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Tour Highlights</h3>
                        <p className="text-sm text-gray-600">Add the main attractions and experiences that make this tour special</p>
                        {tourForm.highlights.map((highlight, index) => (
                          <div key={index} className="flex gap-3 items-center">
                            <div className="flex-1">
                              <Input
                                placeholder="e.g., Visit the iconic Taj Mahal at sunrise"
                                value={highlight}
                                onChange={(e) => {
                                  const newHighlights = [...tourForm.highlights];
                                  newHighlights[index] = e.target.value;
                                  setTourForm({ ...tourForm, highlights: newHighlights });
                                }}
                                className="w-full"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newHighlights = tourForm.highlights.filter((_, i) => i !== index);
                                setTourForm({ ...tourForm, highlights: newHighlights });
                              }}
                              className="px-3"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setTourForm({ ...tourForm, highlights: [...tourForm.highlights, ""] })}
                          className="w-full"
                        >
                          + Add Tour Highlight
                        </Button>
                      </div>

                      {/* What's Included */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">What's Included</h3>
                        {tourForm.included.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="Enter included item..."
                              value={item}
                              onChange={(e) => {
                                const newIncluded = [...tourForm.included];
                                newIncluded[index] = e.target.value;
                                setTourForm({ ...tourForm, included: newIncluded });
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const newIncluded = tourForm.included.filter((_, i) => i !== index);
                                setTourForm({ ...tourForm, included: newIncluded });
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setTourForm({ ...tourForm, included: [...tourForm.included, ""] })}
                        >
                          Add Included Item
                        </Button>
                      </div>

                      {/* What's Not Included */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">What's Not Included</h3>
                        {tourForm.notIncluded.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="Enter not included item..."
                              value={item}
                              onChange={(e) => {
                                const newNotIncluded = [...tourForm.notIncluded];
                                newNotIncluded[index] = e.target.value;
                                setTourForm({ ...tourForm, notIncluded: newNotIncluded });
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const newNotIncluded = tourForm.notIncluded.filter((_, i) => i !== index);
                                setTourForm({ ...tourForm, notIncluded: newNotIncluded });
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setTourForm({ ...tourForm, notIncluded: [...tourForm.notIncluded, ""] })}
                        >
                          Add Not Included Item
                        </Button>
                      </div>

                      {/* Day-wise Itinerary */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Day-wise Itinerary</h3>
                        <p className="text-sm text-gray-600">Create a detailed day-by-day plan for the tour package</p>
                        {tourForm.itinerary.map((day, index) => (
                          <div key={index} className="border border-gray-200 p-6 rounded-lg bg-gray-50 space-y-4">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-semibold text-lg text-primary">Day {day.day}</h4>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newItinerary = tourForm.itinerary.filter((_, i) => i !== index);
                                  // Reorder day numbers
                                  const reorderedItinerary = newItinerary.map((item, idx) => ({
                                    ...item,
                                    day: idx + 1
                                  }));
                                  setTourForm({ ...tourForm, itinerary: reorderedItinerary });
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                Remove Day
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Day Title *</label>
                                <Input
                                  placeholder="e.g., Arrival in Delhi - Welcome to India"
                                  value={day.title}
                                  onChange={(e) => {
                                    const newItinerary = [...tourForm.itinerary];
                                    newItinerary[index].title = e.target.value;
                                    setTourForm({ ...tourForm, itinerary: newItinerary });
                                  }}
                                  className="w-full"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Day Description *</label>
                                <Textarea
                                  placeholder="Describe what happens on this day, activities, places visited, meals, accommodation details..."
                                  rows={4}
                                  value={day.description}
                                  onChange={(e) => {
                                    const newItinerary = [...tourForm.itinerary];
                                    newItinerary[index].description = e.target.value;
                                    setTourForm({ ...tourForm, itinerary: newItinerary });
                                  }}
                                  className="w-full"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Day Highlights</label>
                                <p className="text-xs text-gray-500">Add specific highlights for this day</p>
                                {day.highlights.map((highlight, hIndex) => (
                                  <div key={hIndex} className="flex gap-2">
                                    <Input
                                      placeholder="e.g., Visit Red Fort, Jama Masjid"
                                      value={highlight}
                                      onChange={(e) => {
                                        const newItinerary = [...tourForm.itinerary];
                                        newItinerary[index].highlights[hIndex] = e.target.value;
                                        setTourForm({ ...tourForm, itinerary: newItinerary });
                                      }}
                                      className="flex-1"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const newItinerary = [...tourForm.itinerary];
                                        newItinerary[index].highlights = newItinerary[index].highlights.filter((_, hi) => hi !== hIndex);
                                        setTourForm({ ...tourForm, itinerary: newItinerary });
                                      }}
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newItinerary = [...tourForm.itinerary];
                                    newItinerary[index].highlights.push("");
                                    setTourForm({ ...tourForm, itinerary: newItinerary });
                                  }}
                                  className="w-full"
                                >
                                  + Add Day Highlight
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const newDay = {
                              day: tourForm.itinerary.length + 1,
                              title: "",
                              description: "",
                              highlights: [""]
                            };
                            setTourForm({ ...tourForm, itinerary: [...tourForm.itinerary, newDay] });
                          }}
                          className="w-full bg-primary text-white hover:bg-primary/90"
                        >
                          + Add New Day
                        </Button>
                      </div>

                      {/* Tour Images & Media */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Tour Images & Media</h3>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-blue-800 mb-2">📸 <strong>Image Guidelines:</strong></p>
                          <ul className="text-xs text-blue-700 space-y-1">
                            <li>• Use high-quality images (minimum 1200x800px)</li>
                            <li>• First image will be the main featured image on tour cards</li>
                            <li>• Add 3-5 images showcasing different aspects of the tour</li>
                            <li>• Use CDN URLs (Unsplash, Cloudinary) or upload to your image hosting service</li>
                          </ul>
                        </div>
                        {tourForm.images.map((image, index) => (
                          <div key={index} className="flex gap-3 items-start">
                            <div className="flex-1">
                              <label className="block text-sm font-medium mb-1 text-gray-700">
                                Image {index + 1} {index === 0 && "(Featured Image)"}
                              </label>
                              <Input
                                placeholder="https://images.unsplash.com/photo-... or your CDN image URL"
                                value={image}
                                onChange={(e) => {
                                  const newImages = [...tourForm.images];
                                  newImages[index] = e.target.value;
                                  setTourForm({ ...tourForm, images: newImages });
                                }}
                                className="w-full"
                              />
                              {image && (
                                <img 
                                  src={image} 
                                  alt={`Preview ${index + 1}`}
                                  className="mt-2 w-24 h-16 object-cover rounded border"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const newImages = tourForm.images.filter((_, i) => i !== index);
                                setTourForm({ ...tourForm, images: newImages });
                              }}
                              className="mt-6"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setTourForm({ ...tourForm, images: [...tourForm.images, ""] })}
                          className="w-full"
                        >
                          + Add Tour Image
                        </Button>
                      </div>

                      {/* Destinations */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Destinations</h3>
                        {tourForm.destinations.map((destination, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="Enter destination..."
                              value={destination}
                              onChange={(e) => {
                                const newDestinations = [...tourForm.destinations];
                                newDestinations[index] = e.target.value;
                                setTourForm({ ...tourForm, destinations: newDestinations });
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const newDestinations = tourForm.destinations.filter((_, i) => i !== index);
                                setTourForm({ ...tourForm, destinations: newDestinations });
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setTourForm({ ...tourForm, destinations: [...tourForm.destinations, ""] })}
                        >
                          Add Destination
                        </Button>
                      </div>

                      <div className="flex justify-end space-x-2 pt-6 border-t">
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
                          disabled={loading}
                        >
                          {loading ? "Adding..." : "Add Tour"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Edit Tour Dialog */}
                <Dialog open={showEditTour} onOpenChange={setShowEditTour}>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Tour Package</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateTour} className="space-y-6">
                      {/* Basic Information */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Tour Package Name *
                            </label>
                            <Input
                              placeholder="e.g., Golden Triangle Classic Adventure"
                              value={tourForm.name}
                              onChange={(e) => setTourForm({ ...tourForm, name: e.target.value })}
                              required
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Category *
                            </label>
                            <select
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                              value={tourForm.category}
                              onChange={(e) => setTourForm({ ...tourForm, category: e.target.value })}
                              required
                            >
                              <option value="">Select Category</option>
                              <option value="Golden Triangle">Golden Triangle Tours</option>
                              <option value="Extended Tours">Extended Tours</option>
                              <option value="Rajasthan Tours">Rajasthan Tours</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Duration *
                            </label>
                            <Input 
                              placeholder="e.g., 7 Days / 6 Nights" 
                              value={tourForm.duration}
                              onChange={(e) => setTourForm({ ...tourForm, duration: e.target.value })}
                              required 
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Status
                            </label>
                            <select
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                              value="active"
                              disabled
                            >
                              <option value="active">Active</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Tours remain active when edited</p>
                          </div>
                        </div>
                      </div>

                      {/* Package Overview & Description */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Package Overview & Description</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Package Overview * 
                              <span className="text-xs text-gray-500">(This appears on tour cards - keep it concise and appealing)</span>
                            </label>
                            <Textarea
                              placeholder="A captivating brief overview that entices travelers..."
                              rows={3}
                              value={tourForm.overview}
                              onChange={(e) => setTourForm({ ...tourForm, overview: e.target.value })}
                              required
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                              Detailed Description *
                            </label>
                            <Textarea
                              placeholder="Provide a comprehensive description of the tour package..."
                              rows={6}
                              value={tourForm.description}
                              onChange={(e) => setTourForm({ ...tourForm, description: e.target.value })}
                              required
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Tour Highlights */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Tour Highlights</h3>
                        <p className="text-sm text-gray-600">Add the main attractions and experiences that make this tour special</p>
                        {tourForm.highlights.map((highlight, index) => (
                          <div key={index} className="flex gap-3 items-center">
                            <div className="flex-1">
                              <Input
                                placeholder="e.g., Visit the iconic Taj Mahal at sunrise"
                                value={highlight}
                                onChange={(e) => {
                                  const newHighlights = [...tourForm.highlights];
                                  newHighlights[index] = e.target.value;
                                  setTourForm({ ...tourForm, highlights: newHighlights });
                                }}
                                className="w-full"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newHighlights = tourForm.highlights.filter((_, i) => i !== index);
                                setTourForm({ ...tourForm, highlights: newHighlights });
                              }}
                              className="px-3"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setTourForm({ ...tourForm, highlights: [...tourForm.highlights, ""] })}
                          className="w-full"
                        >
                          + Add Tour Highlight
                        </Button>
                      </div>

                      {/* What's Included */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">What's Included</h3>
                        {tourForm.included.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="Enter included item..."
                              value={item}
                              onChange={(e) => {
                                const newIncluded = [...tourForm.included];
                                newIncluded[index] = e.target.value;
                                setTourForm({ ...tourForm, included: newIncluded });
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const newIncluded = tourForm.included.filter((_, i) => i !== index);
                                setTourForm({ ...tourForm, included: newIncluded });
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setTourForm({ ...tourForm, included: [...tourForm.included, ""] })}
                        >
                          Add Included Item
                        </Button>
                      </div>

                      {/* What's Not Included */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">What's Not Included</h3>
                        {tourForm.notIncluded.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="Enter not included item..."
                              value={item}
                              onChange={(e) => {
                                const newNotIncluded = [...tourForm.notIncluded];
                                newNotIncluded[index] = e.target.value;
                                setTourForm({ ...tourForm, notIncluded: newNotIncluded });
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const newNotIncluded = tourForm.notIncluded.filter((_, i) => i !== index);
                                setTourForm({ ...tourForm, notIncluded: newNotIncluded });
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setTourForm({ ...tourForm, notIncluded: [...tourForm.notIncluded, ""] })}
                        >
                          Add Not Included Item
                        </Button>
                      </div>

                      {/* Day-wise Itinerary */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Day-wise Itinerary</h3>
                        <p className="text-sm text-gray-600">Edit the detailed day-by-day plan for the tour package</p>
                        {tourForm.itinerary.map((day, index) => (
                          <div key={index} className="border border-gray-200 p-6 rounded-lg bg-gray-50 space-y-4">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-semibold text-lg text-primary">Day {day.day}</h4>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newItinerary = tourForm.itinerary.filter((_, i) => i !== index);
                                  // Reorder day numbers
                                  const reorderedItinerary = newItinerary.map((item, idx) => ({
                                    ...item,
                                    day: idx + 1
                                  }));
                                  setTourForm({ ...tourForm, itinerary: reorderedItinerary });
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                Remove Day
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Day Title *</label>
                                <Input
                                  placeholder="e.g., Arrival in Delhi - Welcome to India"
                                  value={day.title}
                                  onChange={(e) => {
                                    const newItinerary = [...tourForm.itinerary];
                                    newItinerary[index].title = e.target.value;
                                    setTourForm({ ...tourForm, itinerary: newItinerary });
                                  }}
                                  className="w-full"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Day Description *</label>
                                <Textarea
                                  placeholder="Describe what happens on this day, activities, places visited, meals, accommodation details..."
                                  rows={4}
                                  value={day.description}
                                  onChange={(e) => {
                                    const newItinerary = [...tourForm.itinerary];
                                    newItinerary[index].description = e.target.value;
                                    setTourForm({ ...tourForm, itinerary: newItinerary });
                                  }}
                                  className="w-full"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Day Highlights</label>
                                <p className="text-xs text-gray-500">Add specific highlights for this day</p>
                                {day.highlights.map((highlight, hIndex) => (
                                  <div key={hIndex} className="flex gap-2">
                                    <Input
                                      placeholder="e.g., Visit Red Fort, Jama Masjid"
                                      value={highlight}
                                      onChange={(e) => {
                                        const newItinerary = [...tourForm.itinerary];
                                        newItinerary[index].highlights[hIndex] = e.target.value;
                                        setTourForm({ ...tourForm, itinerary: newItinerary });
                                      }}
                                      className="flex-1"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const newItinerary = [...tourForm.itinerary];
                                        newItinerary[index].highlights = newItinerary[index].highlights.filter((_, hi) => hi !== hIndex);
                                        setTourForm({ ...tourForm, itinerary: newItinerary });
                                      }}
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newItinerary = [...tourForm.itinerary];
                                    newItinerary[index].highlights.push("");
                                    setTourForm({ ...tourForm, itinerary: newItinerary });
                                  }}
                                  className="w-full"
                                >
                                  + Add Day Highlight
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const newDay = {
                              day: tourForm.itinerary.length + 1,
                              title: "",
                              description: "",
                              highlights: [""]
                            };
                            setTourForm({ ...tourForm, itinerary: [...tourForm.itinerary, newDay] });
                          }}
                          className="w-full bg-primary text-white hover:bg-primary/90"
                        >
                          + Add New Day
                        </Button>
                      </div>

                      {/* Tour Images & Media */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Tour Images & Media</h3>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-blue-800 mb-2">📸 <strong>Image Guidelines:</strong></p>
                          <ul className="text-xs text-blue-700 space-y-1">
                            <li>• Use high-quality images (minimum 1200x800px)</li>
                            <li>• First image will be the main featured image on tour cards</li>
                            <li>• Add 3-5 images showcasing different aspects of the tour</li>
                            <li>• Use CDN URLs (Unsplash, Cloudinary) or upload to your image hosting service</li>
                          </ul>
                        </div>
                        {tourForm.images.map((image, index) => (
                          <div key={index} className="flex gap-3 items-start">
                            <div className="flex-1">
                              <label className="block text-sm font-medium mb-1 text-gray-700">
                                Image {index + 1} {index === 0 && "(Featured Image)"}
                              </label>
                              <Input
                                placeholder="https://images.unsplash.com/photo-... or your CDN image URL"
                                value={image}
                                onChange={(e) => {
                                  const newImages = [...tourForm.images];
                                  newImages[index] = e.target.value;
                                  setTourForm({ ...tourForm, images: newImages });
                                }}
                                className="w-full"
                              />
                              {image && (
                                <img 
                                  src={image} 
                                  alt={`Preview ${index + 1}`}
                                  className="mt-2 w-24 h-16 object-cover rounded border"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const newImages = tourForm.images.filter((_, i) => i !== index);
                                setTourForm({ ...tourForm, images: newImages });
                              }}
                              className="mt-6"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setTourForm({ ...tourForm, images: [...tourForm.images, ""] })}
                          className="w-full"
                        >
                          + Add Tour Image
                        </Button>
                      </div>

                      {/* Destinations */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Destinations</h3>
                        {tourForm.destinations.map((destination, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="Enter destination..."
                              value={destination}
                              onChange={(e) => {
                                const newDestinations = [...tourForm.destinations];
                                newDestinations[index] = e.target.value;
                                setTourForm({ ...tourForm, destinations: newDestinations });
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const newDestinations = tourForm.destinations.filter((_, i) => i !== index);
                                setTourForm({ ...tourForm, destinations: newDestinations });
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setTourForm({ ...tourForm, destinations: [...tourForm.destinations, ""] })}
                        >
                          Add Destination
                        </Button>
                      </div>

                      {/* Form actions */}
                      <div className="flex justify-end space-x-2 pt-6 border-t">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowEditTour(false);
                            setEditingTour(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="bg-primary hover:bg-primary/90"
                          disabled={loading}
                        >
                          {loading ? "Updating..." : "Update Tour"}
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
                    <TableHead>Tour Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Rating</TableHead>
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
                        <TableCell>{tour.duration}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{tour.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">
                            {tour.status || 'Active'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleEditTour(tour)}
                              disabled={loading}
                              className="hover:bg-blue-50 hover:border-blue-300"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-800 hover:bg-red-50 hover:border-red-300"
                              onClick={() => handleDeleteTour(tour._id, tour.name)}
                              disabled={loading}
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
                        No tours available. Add your first tour package!
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

        {/* Customer Reviews Management */}
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
              <p className="text-sm text-gray-600">
                Manage customer reviews and testimonials. Approve reviews to display them on your website.
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <TableRow key={review._id}>
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-semibold">{review.name}</p>
                            {review.email && (
                              <p className="text-sm text-gray-500">{review.email}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="ml-1 text-sm">({review.rating})</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-sm text-gray-600 line-clamp-3">
                              {review.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              review.status === 'approved' 
                                ? 'bg-green-100 text-green-800'
                                : review.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {review.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {review.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateReviewStatus(review._id, 'approved')}
                                  disabled={reviewsLoading}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateReviewStatus(review._id, 'rejected')}
                                  disabled={reviewsLoading}
                                  className="text-red-600 hover:text-red-800 hover:bg-red-50 border-red-300"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            {review.status === 'approved' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateReviewStatus(review._id, 'rejected')}
                                disabled={reviewsLoading}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50 border-red-300"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                            {review.status === 'rejected' && (
                              <Button
                                size="sm"
                                onClick={() => handleUpdateReviewStatus(review._id, 'approved')}
                                disabled={reviewsLoading}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteReview(review._id)}
                              disabled={reviewsLoading}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50 border-red-300"
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
                        <div className="flex flex-col items-center">
                          <MessageSquare className="w-12 h-12 text-gray-300 mb-2" />
                          <p>No customer reviews yet</p>
                          <p className="text-sm">Reviews will appear here once customers submit them</p>
                        </div>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Delete Tour Package
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 leading-relaxed">
              Are you sure you want to delete <strong>"{deletingTour?.name}"</strong>?
              <br />
              <br />
              This action cannot be undone and will permanently remove the tour package from your catalog. All associated data including itineraries, images, and tour details will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel 
              className="border-gray-300 hover:bg-gray-50"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeletingTour(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDeleteTour}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Tour
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
