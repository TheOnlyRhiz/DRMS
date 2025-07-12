import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequestJson } from "@/lib/queryClient";
import Sidebar from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  BookOpen, 
  Calendar, 
  Download, 
  Search, 
  FileText, 
  Clock,
  Star,
  Eye,
  Filter,
  Settings,
  User,
  BarChart3,
  Upload,
  Lock,
  Shield,
  Plus,
  Edit
} from "lucide-react";
import ResourceLibraryModal from "@/components/modals/resource-library-modal";
import BookingModal from "@/components/modals/booking-modal";
import UploadModal from "@/components/modals/upload-modal";

// Equipment Interface Component for booking and management
const EquipmentInterface = ({ userRole }: { userRole: string }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: equipment = [], isLoading } = useQuery({
    queryKey: ["/api/equipment"],
    retry: false,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["/api/bookings"],
    retry: false,
  });

  // Book equipment mutation
  const bookMutation = useMutation({
    mutationFn: async ({ equipmentId, purpose }: { equipmentId: number; purpose: string }) => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ equipmentId, purpose }),
      });
      if (!response.ok) throw new Error('Failed to book equipment');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Equipment booked successfully! Pending admin approval.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      setSelectedEquipment(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to book equipment. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (!response.ok) throw new Error('Failed to cancel booking');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Booking cancelled successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Admin: Add equipment mutation
  const addEquipmentMutation = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      const response = await fetch('/api/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to add equipment');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Equipment added successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      setShowAddModal(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add equipment. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Admin: Update equipment mutation
  const updateEquipmentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await fetch(`/api/equipment/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update equipment');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Equipment updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      setEditingEquipment(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update equipment. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Admin: Approve booking mutation
  const approveBookingMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/bookings/${bookingId}/approve`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (!response.ok) throw new Error('Failed to approve booking');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Booking approved successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'booked': return 'bg-orange-100 text-orange-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserBooking = (equipmentId: number) => {
    return bookings.find((booking: any) => 
      booking.equipmentId === equipmentId && 
      booking.status !== 'cancelled' && 
      booking.status !== 'completed'
    );
  };

  // Filter equipment based on search query and status
  const filteredEquipment = useMemo(() => {
    if (!Array.isArray(equipment)) return [];
    
    return equipment.filter((item: any) => {
      const matchesSearch = searchQuery === "" || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [equipment, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Equipment Management</h2>
          <p className="text-gray-600">
            {userRole === 'admin' 
              ? 'Manage equipment and approve bookings' 
              : 'Book available equipment for your projects'
            }
          </p>
        </div>
        {userRole === 'admin' && (
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Equipment
          </Button>
        )}
      </div>

      {/* Pending Bookings (Admin only) */}
      {userRole === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.filter((booking: any) => booking.status === 'pending').map((booking: any) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{equipment.find((eq: any) => eq.id === booking.equipmentId)?.name}</h4>
                    <p className="text-sm text-gray-600">{booking.purpose}</p>
                    <p className="text-xs text-gray-500">Requested by: User #{booking.userId}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => approveBookingMutation.mutate(booking.id)}
                      disabled={approveBookingMutation.isPending}
                    >
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => cancelBookingMutation.mutate(booking.id)}
                      disabled={cancelBookingMutation.isPending}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
              {bookings.filter((booking: any) => booking.status === 'pending').length === 0 && (
                <p className="text-gray-500 text-center py-4">No pending bookings</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search equipment by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
            {(searchQuery || statusFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="whitespace-nowrap"
              >
                Clear Filters
              </Button>
            )}
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Showing {filteredEquipment.length} of {Array.isArray(equipment) ? equipment.length : 0} equipment items
          </div>
        </CardContent>
      </Card>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse h-48 rounded-xl"></div>
          ))
        ) : filteredEquipment.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">
              {searchQuery || statusFilter !== "all" 
                ? "No equipment found matching your filters" 
                : "No equipment available"}
            </p>
          </div>
        ) : (
          filteredEquipment.map((item: any) => {
            const userBooking = getUserBooking(item.id);
            return (
              <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Settings className="w-6 h-6 text-purple-600" />
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{item.description}</p>
                  
                  <div className="flex gap-2">
                    {userRole === 'admin' ? (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setEditingEquipment(item)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateEquipmentMutation.mutate({
                            id: item.id,
                            data: { status: item.status === 'available' ? 'unavailable' : 'available' }
                          })}
                        >
                          {item.status === 'available' ? 'Disable' : 'Enable'}
                        </Button>
                      </>
                    ) : (
                      <>
                        {userBooking ? (
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="flex-1"
                            onClick={() => cancelBookingMutation.mutate(userBooking.id)}
                            disabled={cancelBookingMutation.isPending}
                          >
                            Cancel Booking
                          </Button>
                        ) : item.status === 'available' ? (
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setSelectedEquipment(item)}
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Book Now
                          </Button>
                        ) : (
                          <Button size="sm" className="flex-1" disabled>
                            {item.status === 'booked' ? 'Currently Booked' : 'Unavailable'}
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Booking Modal */}
      {selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Book Equipment</h3>
            <div className="mb-4">
              <h4 className="font-medium">{selectedEquipment.name}</h4>
              <p className="text-sm text-gray-600">{selectedEquipment.description}</p>
            </div>
            <div className="mb-4">
              <Label htmlFor="purpose">Purpose of Use</Label>
              <Input
                id="purpose"
                placeholder="Describe why you need this equipment..."
                onChange={(e) => setSelectedEquipment({...selectedEquipment, purpose: e.target.value})}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                className="flex-1"
                onClick={() => bookMutation.mutate({
                  equipmentId: selectedEquipment.id,
                  purpose: selectedEquipment.purpose || 'No purpose specified'
                })}
                disabled={bookMutation.isPending}
              >
                {bookMutation.isPending ? 'Booking...' : 'Book Equipment'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => setSelectedEquipment(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Equipment Modal (Admin only) */}
      {showAddModal && userRole === 'admin' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Equipment</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="equipmentName">Equipment Name</Label>
                <Input
                  id="equipmentName"
                  placeholder="Enter equipment name..."
                  onChange={(e) => setShowAddModal({...showAddModal, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="equipmentDesc">Description</Label>
                <Input
                  id="equipmentDesc"
                  placeholder="Enter description..."
                  onChange={(e) => setShowAddModal({...showAddModal, description: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button 
                className="flex-1"
                onClick={() => addEquipmentMutation.mutate({
                  name: showAddModal.name || '',
                  description: showAddModal.description || ''
                })}
                disabled={addEquipmentMutation.isPending}
              >
                {addEquipmentMutation.isPending ? 'Adding...' : 'Add Equipment'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Equipment Modal (Admin only) */}
      {editingEquipment && userRole === 'admin' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Equipment</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editName">Equipment Name</Label>
                <Input
                  id="editName"
                  defaultValue={editingEquipment.name}
                  onChange={(e) => setEditingEquipment({...editingEquipment, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editDesc">Description</Label>
                <Input
                  id="editDesc"
                  defaultValue={editingEquipment.description}
                  onChange={(e) => setEditingEquipment({...editingEquipment, description: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editStatus">Status</Label>
                <select
                  id="editStatus"
                  value={editingEquipment.status}
                  onChange={(e) => setEditingEquipment({...editingEquipment, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button 
                className="flex-1"
                onClick={() => updateEquipmentMutation.mutate({
                  id: editingEquipment.id,
                  data: {
                    name: editingEquipment.name,
                    description: editingEquipment.description,
                    status: editingEquipment.status
                  }
                })}
                disabled={updateEquipmentMutation.isPending}
              >
                {updateEquipmentMutation.isPending ? 'Updating...' : 'Update Equipment'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => setEditingEquipment(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Resource Library Interface Component (same as admin dashboard)
const ResourceLibraryInterface = () => {
  const [filters, setFilters] = useState({
    category: "",
    course: "",
    search: "",
    sortBy: "title",
    sortOrder: "asc" as "asc" | "desc",
    academicYear: "",
    fileType: "",
    sizeRange: [0, 50] as [number, number],
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const { toast } = useToast();

  const { data: allResources = [], isLoading } = useQuery({
    queryKey: ["/api/resources"],
    retry: false,
  });

  // Download mutation
  const downloadMutation = useMutation({
    mutationFn: async (resourceId: number) => {
      const response = await fetch(`/api/resources/${resourceId}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to record download');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Resource downloaded successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to download resource. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDownload = async (resource: any) => {
    try {
      await downloadMutation.mutateAsync(resource.id);
      
      // Create download link
      const link = document.createElement('a');
      link.href = resource.fileUrl;
      link.download = resource.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      // Error handled by mutation
    }
  };

  // Filter and sort resources
  const filteredAndSortedResources = useMemo(() => {
    let filtered = Array.isArray(allResources) ? [...allResources] : [];

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter((resource: any) => 
        resource.title?.toLowerCase().includes(searchLower) ||
        resource.description?.toLowerCase().includes(searchLower) ||
        resource.course?.toLowerCase().includes(searchLower) ||
        resource.category?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category) {
      filtered = filtered.filter((resource: any) => resource.category === filters.category);
    }

    if (filters.course) {
      filtered = filtered.filter((resource: any) => resource.course === filters.course);
    }

    if (filters.fileType && filters.fileType !== "all") {
      filtered = filtered.filter((resource: any) => 
        resource.fileType?.includes(filters.fileType)
      );
    }

    if (filters.academicYear && filters.academicYear !== "all") {
      filtered = filtered.filter((resource: any) => 
        new Date(resource.createdAt).getFullYear().toString() === filters.academicYear
      );
    }

    // Filter by file size (convert bytes to MB)
    filtered = filtered.filter((resource: any) => {
      const sizeMB = resource.fileSize ? resource.fileSize / (1024 * 1024) : 0;
      return sizeMB >= filters.sizeRange[0] && sizeMB <= filters.sizeRange[1];
    });

    // Sort
    filtered.sort((a: any, b: any) => {
      let aValue, bValue;

      switch (filters.sortBy) {
        case "title":
          aValue = a.title?.toLowerCase() || "";
          bValue = b.title?.toLowerCase() || "";
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "fileSize":
          aValue = a.fileSize || 0;
          bValue = b.fileSize || 0;
          break;
        case "course":
          aValue = a.course?.toLowerCase() || "";
          bValue = b.course?.toLowerCase() || "";
          break;
        default:
          aValue = a.title?.toLowerCase() || "";
          bValue = b.title?.toLowerCase() || "";
      }

      if (filters.sortOrder === "desc") {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });

    return filtered;
  }, [allResources, filters]);

  const getFileTypeColor = (fileType: string) => {
    if (fileType?.includes('pdf')) return 'bg-red-100 text-red-800';
    if (fileType?.includes('word') || fileType?.includes('document')) return 'bg-blue-100 text-blue-800';
    if (fileType?.includes('presentation') || fileType?.includes('powerpoint')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Get unique categories and courses for filters
  const categories = Array.from(new Set(allResources?.map((r: any) => r.category).filter(Boolean))) as string[];
  const courses = Array.from(new Set(allResources?.map((r: any) => r.course).filter(Boolean))) as string[];

  return (
    <Card>
      <CardContent className="p-6">
        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          {/* Basic Search Row */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by title, description, course, or category..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>
            
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={filters.course}
              onChange={(e) => setFilters({ ...filters, course: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>

            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {showAdvancedFilters ? "Hide Filters" : "More Filters"}
            </Button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              {/* Sort Options */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sort By</label>
                <div className="flex gap-2">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="title">Title</option>
                    <option value="createdAt">Date Added</option>
                    <option value="fileSize">File Size</option>
                    <option value="course">Course</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters({ 
                      ...filters, 
                      sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" 
                    })}
                  >
                    {filters.sortOrder === "asc" ? "↑" : "↓"}
                  </Button>
                </div>
              </div>

              {/* Academic Year */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Academic Year</label>
                <select
                  value={filters.academicYear}
                  onChange={(e) => setFilters({ ...filters, academicYear: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Years</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                </select>
              </div>

              {/* File Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">File Type</label>
                <select
                  value={filters.fileType}
                  onChange={(e) => setFilters({ ...filters, fileType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="pdf">PDF</option>
                  <option value="msword">Word</option>
                  <option value="mspowerpoint">PowerPoint</option>
                  <option value="excel">Excel</option>
                  <option value="plain">Text</option>
                </select>
              </div>

              {/* File Size Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  File Size: {filters.sizeRange[0]}MB - {filters.sizeRange[1]}MB
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={filters.sizeRange[1]}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    sizeRange: [filters.sizeRange[0], parseInt(e.target.value)] 
                  })}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {filteredAndSortedResources.length} of {Array.isArray(allResources) ? allResources.length : 0} resources found
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({
                category: "",
                course: "",
                search: "",
                sortBy: "title",
                sortOrder: "asc",
                academicYear: "",
                fileType: "",
                sizeRange: [0, 50],
              })}
            >
              Clear All Filters
            </Button>
          </div>
        </div>

        {/* Resource Grid */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse h-48 rounded-xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedResources.length > 0 ? (
                filteredAndSortedResources.map((resource: any) => (
                  <Card key={resource.id} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={getFileTypeColor(resource.fileType)}
                        >
                          {resource.fileType?.split('/')[1]?.toUpperCase() || 'FILE'}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {resource.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {resource.description || "No description available"}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span>{resource.course}</span>
                        <span>{formatFileSize(resource.fileSize)}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleDownload(resource)}
                          disabled={downloadMutation.isPending}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {downloadMutation.isPending ? "..." : "Download"}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(resource.fileUrl, '_blank')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
                  <p className="text-gray-500">Try adjusting your search filters</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Student Dashboard Pages
const DashboardPage = ({ user, stats, onUploadClick }: any) => (
  <div className="space-y-4 md:space-y-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, {user?.firstName || 'Student'}!</h1>
        <p className="text-gray-600">Here's your learning overview</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
        <Button onClick={onUploadClick} className="w-full sm:w-auto">
          <Upload className="w-4 h-4 mr-2" />
          Upload Resource
        </Button>
        <Button variant="outline" className="w-full sm:w-auto">
          <Download className="w-4 h-4 mr-2" />
          Quick Download
        </Button>
      </div>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <Card className="hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resources Downloaded</p>
              <p className="text-2xl font-bold text-blue-600">{stats?.resourcesDownloaded || 0}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Bookings</p>
              <p className="text-2xl font-bold text-green-600">{stats?.activeBookings || 0}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Study Hours</p>
              <p className="text-2xl font-bold text-purple-600">24</p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Favorite Resources</p>
              <p className="text-2xl font-bold text-orange-600">12</p>
            </div>
            <Star className="w-8 h-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Recent Activity */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Downloads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Database Systems Notes</p>
                    <p className="text-sm text-gray-600">2 hours ago</p>
                  </div>
                </div>
                <Badge variant="secondary">PDF</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Upcoming Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Lab Computer #{i}</p>
                    <p className="text-sm text-gray-600">Tomorrow 2:00 PM</p>
                  </div>
                </div>
                <Badge variant="outline">Confirmed</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const ResourcesPage = ({ setResourceLibraryOpen, onUploadClick }: any) => (
  <div className="space-y-4 md:space-y-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Study Resources</h1>
        <p className="text-gray-600">Access course materials and academic resources</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
        <Button onClick={onUploadClick} className="w-full sm:w-auto">
          <Upload className="w-4 h-4 mr-2" />
          Upload Resource
        </Button>
      </div>
    </div>

    {/* Unified Resource Library Interface */}
    <ResourceLibraryInterface />
  </div>
);

const EquipmentPage = ({ user }: { user: any }) => (
  <div className="space-y-4 md:space-y-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Equipment Management</h1>
        <p className="text-gray-600">Book available equipment for your projects</p>
      </div>
    </div>

    {/* Equipment Interface */}
    <EquipmentInterface userRole={user?.role || 'student'} />
  </div>
);

const ProfilePage = ({ user }: any) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordResetMutation = useMutation({
    mutationFn: async (passwordData: { currentPassword: string; newPassword: string }) => {
      const token = localStorage.getItem("token");
      return await apiRequestJson("/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });
      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Password Change Failed",
        description: error.message || "Failed to change password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePasswordReset = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Validation Error",
        description: "New password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    passwordResetMutation.mutate({
      currentPassword,
      newPassword,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={user?.firstName || ''} readOnly className="bg-gray-50" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={user?.lastName || ''} readOnly className="bg-gray-50" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email || ''} readOnly className="bg-gray-50" />
            </div>
            <div>
              <Label htmlFor="matricNumber">Student ID</Label>
              <Input id="matricNumber" value={user?.matricNumber || ''} readOnly className="bg-gray-50" />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input id="department" value={user?.department || ''} readOnly className="bg-gray-50" />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={user?.role || ''} readOnly className="bg-gray-50" />
            </div>
          </CardContent>
        </Card>

        {/* Activity Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Resources Downloaded</span>
              <span className="font-semibold">24</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Equipment Bookings</span>
              <span className="font-semibold">8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Study Hours</span>
              <span className="font-semibold">45</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Account Created</span>
              <span className="font-semibold">Jan 2024</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Password Requirements</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• At least 6 characters long</li>
                  <li>• Include both letters and numbers</li>
                  <li>• Avoid common passwords</li>
                  <li>• Don't reuse recent passwords</li>
                </ul>
              </div>
              <Button 
                onClick={handlePasswordReset}
                disabled={passwordResetMutation.isPending}
                className="w-full"
              >
                <Lock className="w-4 h-4 mr-2" />
                {passwordResetMutation.isPending ? "Changing Password..." : "Change Password"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function StudentDashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [resourceLibraryOpen, setResourceLibraryOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch user stats
  const { data: stats } = useQuery({
    queryKey: ["/api/analytics/user"],
    enabled: !!user,
    retry: false,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const sidebarItems = [
    {
      icon: BarChart3,
      label: "Dashboard",
      active: activeTab === "dashboard",
      onClick: () => setActiveTab("dashboard")
    },
    {
      icon: Search,
      label: "Resources",
      active: activeTab === "resources",
      onClick: () => setActiveTab("resources")
    },
    {
      icon: Settings,
      label: "Equipment",
      active: activeTab === "equipment",
      onClick: () => setActiveTab("equipment")
    },
    {
      icon: User,
      label: "Profile",
      active: activeTab === "profile",
      onClick: () => setActiveTab("profile")
    }
  ];

  const renderActivePage = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPage user={user} stats={stats} onUploadClick={() => setUploadOpen(true)} />;
      case "resources":
        return <ResourcesPage setResourceLibraryOpen={setResourceLibraryOpen} onUploadClick={() => setUploadOpen(true)} />;
      case "equipment":
        return <EquipmentPage user={user} />;
      case "profile":
        return <ProfilePage user={user} />;
      default:
        return <DashboardPage user={user} stats={stats} onUploadClick={() => setUploadOpen(true)} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar user={user} items={sidebarItems} userRole="student" />
      
      <main className="flex-1 p-4 md:p-6 lg:p-8 min-w-0">
        {renderActivePage()}
      </main>

      {/* Modals */}
      <ResourceLibraryModal 
        open={resourceLibraryOpen} 
        onOpenChange={setResourceLibraryOpen} 
      />
      <BookingModal 
        open={bookingOpen} 
        onOpenChange={setBookingOpen} 
      />
      <UploadModal 
        open={uploadOpen} 
        onOpenChange={setUploadOpen} 
      />
    </div>
  );
}