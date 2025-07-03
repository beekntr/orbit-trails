import { useState } from "react";
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

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showAddTour, setShowAddTour] = useState(false);

  // Mock data for demonstration
  const [tours, setTours] = useState([
    {
      id: 1,
      name: "Golden Triangle Classic",
      category: "Golden Triangle",
      price: 599,
      duration: "7 Days",
      status: "active",
    },
    {
      id: 2,
      name: "Royal Rajasthan",
      category: "Rajasthan",
      price: 899,
      duration: "12 Days",
      status: "active",
    },
  ]);

  const [contactSubmissions] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      phone: "+1 234 567 8901",
      message: "Interested in Golden Triangle tour",
      date: "2024-03-15",
      status: "new",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1 234 567 8902",
      message: "Planning a family trip to Rajasthan",
      date: "2024-03-14",
      status: "replied",
    },
  ]);

  const [customTourRequests] = useState([
    {
      id: 1,
      name: "Michael Chen",
      email: "michael@example.com",
      destinations: ["Golden Triangle & Rajasthan", "Kerala & South"],
      budget: "$2000-3000",
      travelers: 4,
      duration: 14,
      date: "2024-03-16",
      status: "pending",
    },
  ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple authentication check (in production, this would be proper auth)
    if (
      credentials.username === "admin" &&
      credentials.password === "admin123"
    ) {
      setIsAuthenticated(true);
    } else {
      alert("Invalid credentials. Use admin/admin123 for demo.");
    }
  };

  const handleAddTour = (e: React.FormEvent) => {
    e.preventDefault();
    // Add tour logic would go here
    setShowAddTour(false);
    alert("Tour added successfully!");
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
          onClick={() => setIsAuthenticated(false)}
          variant="outline"
          className="text-red-600 border-red-600 hover:bg-red-50"
        >
          Logout
        </Button>
      </div>

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
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Category
                          </label>
                          <select
                            className="w-full p-2 border rounded-md"
                            required
                          >
                            <option value="">Select Category</option>
                            <option value="Golden Triangle">
                              Golden Triangle
                            </option>
                            <option value="Extended">Extended Tours</option>
                            <option value="Rajasthan">Rajasthan Tours</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Price ($)
                          </label>
                          <Input type="number" placeholder="599" required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Duration
                          </label>
                          <Input placeholder="7 Days" required />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Description
                        </label>
                        <Textarea
                          placeholder="Tour description..."
                          rows={4}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Image URL
                        </label>
                        <Input placeholder="https://..." required />
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
                  {tours.map((tour) => (
                    <TableRow key={tour.id}>
                      <TableCell className="font-medium">{tour.name}</TableCell>
                      <TableCell>{tour.category}</TableCell>
                      <TableCell>${tour.price}</TableCell>
                      <TableCell>{tour.duration}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          {tour.status}
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
                  ))}
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
                  {contactSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">
                        {submission.name}
                      </TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell>{submission.phone}</TableCell>
                      <TableCell>{submission.date}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            submission.status === "new"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {submission.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
                  {customTourRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.name}
                      </TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>
                        <div className="max-w-32 truncate">
                          {request.destinations.join(", ")}
                        </div>
                      </TableCell>
                      <TableCell>{request.budget}</TableCell>
                      <TableCell>{request.travelers}</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
