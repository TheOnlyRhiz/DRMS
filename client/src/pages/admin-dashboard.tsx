import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  Users, 
  Settings, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Database,
  Activity,
  UserCheck,
  UserX,
  Download,
  Upload,
  BarChart3,
  User,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Plus,
  Calendar
} from "lucide-react";
import UploadModal from "@/components/modals/upload-modal";
import ResourceLibraryModal from "@/components/modals/resource-library-modal";
import EquipmentModal from "@/components/modals/equipment-modal";

// Admin Dashboard Pages
const DashboardPage = ({ user, systemStats, setUploadOpen, setResourceLibraryOpen, setActiveTab, userCount }: any) => (
  <div className="space-y-8">
    {/* Header */}
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 md:p-8 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">Welcome back, {user?.firstName || 'Administrator'}!</h1>
          <p className="text-blue-100 text-sm md:text-lg">Manage your department resources and users from your central dashboard</p>
        </div>
        <div className="hidden md:block">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <Activity className="w-12 h-12 text-white" />
          </div>
        </div>
      </div>
    </div>

    {/* Quick Actions & Stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Quick Actions - Resource Management */}
      <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-500 rounded-xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Resources</h3>
              <p className="text-gray-500 text-sm">Manage academic content</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Resources</span>
              <span className="text-2xl font-bold text-blue-600">{systemStats?.totalResources || 0}</span>
            </div>
            <div className="space-y-3">
              <Button 
                onClick={() => setUploadOpen(true)}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border-0 justify-start h-12"
              >
                <Upload className="w-5 h-5 mr-3" />
                Upload Resource
              </Button>
              <Button 
                onClick={() => setResourceLibraryOpen(true)}
                variant="outline"
                className="w-full justify-start h-12 border-gray-200 hover:bg-gray-50"
              >
                <Eye className="w-5 h-5 mr-3" />
                View Library
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions - User Management */}
      <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-emerald-500 rounded-xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Users</h3>
              <p className="text-gray-500 text-sm">Manage system users</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Users</span>
              <span className="text-2xl font-bold text-emerald-600">{userCount || systemStats?.totalUsers || 0}</span>
            </div>
            <div className="space-y-3">
              <Button 
                onClick={() => setActiveTab('users')}
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-0 justify-start h-12"
              >
                <UserCheck className="w-5 h-5 mr-3" />
                Manage Users
              </Button>
              <Button 
                onClick={() => setActiveTab('settings')}
                variant="outline"
                className="w-full justify-start h-12 border-gray-200 hover:bg-gray-50"
              >
                <Shield className="w-5 h-5 mr-3" />
                Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Overview */}
      <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-500 rounded-xl">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Analytics</h3>
              <p className="text-gray-500 text-sm">System performance</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{systemStats?.totalEquipment || 0}</div>
                <div className="text-xs text-gray-500">Equipment</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{systemStats?.activeBookings || 0}</div>
                <div className="text-xs text-gray-500">Bookings</div>
              </div>
            </div>
            <Button 
              onClick={() => setActiveTab('analytics')}
              className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 border-0 justify-start h-12"
            >
              <TrendingUp className="w-5 h-5 mr-3" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Recent Activity */}
    <Card className="bg-white border-0 shadow-xl">
      <CardHeader className="border-b border-gray-100 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-900">Recent System Activity</CardTitle>
              <p className="text-gray-500 text-sm">Latest user interactions and system events</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {[
            { action: "New user registered", user: "student@university.edu", time: "5 min ago", type: "success", icon: UserCheck },
            { action: "Resource uploaded", user: "faculty@university.edu", time: "12 min ago", type: "info", icon: Upload },
            { action: "Equipment booking", user: "student2@university.edu", time: "1 hour ago", type: "info", icon: Clock },
            { action: "Failed login attempt", user: "unknown@domain.com", time: "2 hours ago", type: "warning", icon: AlertTriangle }
          ].map((activity, i) => {
            const IconComponent = activity.icon;
            return (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className={`p-2 rounded-lg ${
                  activity.type === "success" ? "bg-green-100" :
                  activity.type === "warning" ? "bg-orange-100" : "bg-blue-100"
                }`}>
                  <IconComponent className={`w-5 h-5 ${
                    activity.type === "success" ? "text-green-600" :
                    activity.type === "warning" ? "text-orange-600" : "text-blue-600"
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.user} • {activity.time}</p>
                </div>
                <Badge 
                  variant={activity.type === "warning" ? "destructive" : "secondary"}
                  className="capitalize"
                >
                  {activity.type}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  </div>
);

const UserForm = ({ initialData = null, onSubmit, onCancel }: any) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    role: initialData?.role || "Student",
    status: initialData?.status || "Active"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter full name"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="Enter email address"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role
        </label>
        <select
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Student">Student</option>
          <option value="Admin">Admin</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Active">Active</option>
          <option value="Disabled">Disabled</option>
        </select>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {initialData ? 'Update User' : 'Add User'}
        </Button>
      </div>
    </form>
  );
};

const UserManagementPage = ({ onUserCountChange }: { onUserCountChange?: (count: number) => void }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const { toast } = useToast();

  // Fetch users from API
  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/users"],
    retry: false,
  });

  // Update user count when users change
  useEffect(() => {
    if (users.length > 0) {
      onUserCountChange?.(users.length);
    }
  }, [users.length, onUserCountChange]);

  // Add user mutation
  const addUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: userData.name.split(' ')[0],
          lastName: userData.name.split(' ').slice(1).join(' '),
          email: userData.email,
          role: userData.role.toLowerCase(),
          status: userData.status,
          password: 'defaultPassword123'
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add user');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User added successfully",
      });
      refetch();
      setIsAddModalOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Edit user mutation
  const editUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: userData.name.split(' ')[0],
          lastName: userData.name.split(' ').slice(1).join(' '),
          email: userData.email,
          role: userData.role.toLowerCase(),
          status: userData.status,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update user');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      refetch();
      setIsEditModalOpen(false);
      setEditingUser(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddUser = (newUserData: any) => {
    addUserMutation.mutate(newUserData);
  };

  const handleEditUser = (updatedUserData: any) => {
    editUserMutation.mutate(updatedUserData);
  };

  const openEditModal = (user: any) => {
    // Transform database user format to form format
    const formattedUser = {
      ...user,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      role: user.role === 'admin' ? 'Admin' : 'Student',
      status: user.status || 'Active'
    };
    setEditingUser(formattedUser);
    setIsEditModalOpen(true);
  };

  const filteredUsers = users.filter((user: any) => {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === "all" || user.role.toLowerCase() === filterRole.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleExportUsers = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Email,Role,Status,Created At\n"
      + filteredUsers.map(user => `${user.name},${user.email},${user.role},${user.status},${user.createdAt}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Add, edit, filter, and export user accounts</p>
        </div>
        <div className="flex gap-3">
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsAddModalOpen(true)}
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Add User
          </Button>
          <Button variant="outline" onClick={handleExportUsers}>
            <Download className="w-4 h-4 mr-2" />
            Export Users
          </Button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input 
                placeholder="Search users by name or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-3">
              <select 
                value={filterRole} 
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
              <Button variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
            <Badge variant="secondary">{filteredUsers.length} of {users.length} users</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-medium text-gray-900">Name</th>
                  <th className="text-left p-4 font-medium text-gray-900">Email</th>
                  <th className="text-left p-4 font-medium text-gray-900">Role</th>
                  <th className="text-left p-4 font-medium text-gray-900">Status</th>
                  <th className="text-left p-4 font-medium text-gray-900">Created</th>
                  <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user: any) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">
                        {`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'No Name'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-600">{user.email}</div>
                    </td>
                    <td className="p-4">
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role === "admin" ? "Admin" : "Student"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={user.status === "Active" ? "default" : "destructive"}>
                        {user.status || "Active"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-600">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="hover:bg-blue-50"
                          onClick={() => openEditModal(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading users...</p>
            </div>
          )}
          
          {!isLoading && filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No users found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add New User</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)}>
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
            <UserForm onSubmit={handleAddUser} onCancel={() => setIsAddModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit User</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsEditModalOpen(false)}>
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
            <UserForm 
              initialData={editingUser} 
              onSubmit={handleEditUser} 
              onCancel={() => setIsEditModalOpen(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ResourceListWithFilters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Mathematics");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingResource, setEditingResource] = useState<any>(null);
  const { toast } = useToast();

  // Fetch user's resources from API
  const { data: resources = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/resources/my"],
    retry: false,
  });

  // Update resource status mutation
  const updateResourceMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await fetch(`/api/resources/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update resource');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Resource status updated successfully",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update resource status",
        variant: "destructive",
      });
    },
  });

  // Download resource mutation
  const downloadResourceMutation = useMutation({
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
        title: "Download Started",
        description: "File download has been initiated",
      });
    },
    onError: () => {
      toast({
        title: "Download Failed",
        description: "Unable to download the file",
        variant: "destructive",
      });
    },
  });

  // Handle resource download
  const handleDownload = async (resource: any) => {
    try {
      // Record the download
      await downloadResourceMutation.mutateAsync(resource.id);
      
      // Trigger the actual file download
      const link = document.createElement('a');
      link.href = resource.fileUrl;
      link.download = resource.fileName || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  // Filter resources based on search and filters
  const filteredResources = resources.filter((resource: any) => {
    const matchesSearch = resource.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = resource.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || resource.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleStatusChange = (resourceId: number, newStatus: string) => {
    updateResourceMutation.mutate({ id: resourceId, status: newStatus });
  };

  const handleEditResource = (resource: any) => {
    setEditingResource(resource);
  };

  // Edit resource mutation
  const editResourceMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      const response = await fetch(`/api/resources/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update resource');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Resource updated successfully",
      });
      setEditingResource(null);
      refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update resource",
        variant: "destructive",
      });
    },
  });

  const handleSaveEdit = (id: number, updates: any) => {
    editResourceMutation.mutate({ id, updates });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading resources...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            All Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search resources by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Resource List */}
          <div className="space-y-3">
            {filteredResources.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No resources found matching your criteria
              </div>
            ) : (
              filteredResources.map((resource: any, i: number) => (
                <div key={resource.id || i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{resource.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Category: {resource.category}</span>
                      <span>•</span>
                      <span>Course: {resource.course || "General"}</span>
                      <span>•</span>
                      <span>Uploaded: {new Date(resource.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Status Dropdown */}
                    <select
                      value={resource.status || "pending"}
                      onChange={(e) => handleStatusChange(resource.id, e.target.value)}
                      className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={updateResourceMutation.isPending}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownload(resource)}
                        disabled={!resource.fileUrl}
                        title="Download Resource"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditResource(resource)}
                        title="Edit Resource"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Results Summary */}
          {filteredResources.length > 0 && (
            <div className="mt-4 text-sm text-gray-600 text-center">
              Showing {filteredResources.length} of {resources.length} resources
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Resource Modal */}
      <EditResourceModal
        resource={editingResource}
        isOpen={!!editingResource}
        onClose={() => setEditingResource(null)}
        onSave={handleSaveEdit}
      />
    </>
  );
};

// Edit Resource Modal Component
const EditResourceModal = ({ resource, isOpen, onClose, onSave }: any) => {
  const [title, setTitle] = useState(resource?.title || '');
  const [description, setDescription] = useState(resource?.description || '');
  const [category, setCategory] = useState(resource?.category || '');
  const [course, setCourse] = useState(resource?.course || '');

  useEffect(() => {
    if (resource) {
      setTitle(resource.title || '');
      setDescription(resource.description || '');
      setCategory(resource.category || '');
      setCourse(resource.course || '');
    }
  }, [resource]);

  const handleSave = () => {
    onSave(resource.id, {
      title,
      description,
      category,
      course,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Resource</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <XCircle className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resource title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Resource description"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Course</label>
            <Input
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="Course name (optional)"
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <Button onClick={handleSave} className="flex-1">
            Save Changes
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

// All Resources Library Component (shows all resources, not just user's)
const AllResourcesLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Mathematics");
  const [statusFilter, setStatusFilter] = useState("approved");
  const { toast } = useToast();

  // Fetch all resources from API
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["/api/resources"],
    retry: false,
  });

  // Download resource mutation
  const downloadResourceMutation = useMutation({
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
        title: "Download Started",
        description: "File download has been initiated",
      });
    },
    onError: () => {
      toast({
        title: "Download Failed",
        description: "Unable to download the file",
        variant: "destructive",
      });
    },
  });

  // Handle resource download
  const handleDownload = async (resource: any) => {
    try {
      // Record the download
      await downloadResourceMutation.mutateAsync(resource.id);
      
      // Trigger the actual file download
      const link = document.createElement('a');
      link.href = resource.fileUrl;
      link.download = resource.fileName || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  // Filter resources based on search and filters
  const filteredResources = resources.filter((resource: any) => {
    const matchesSearch = resource.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = resource.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || resource.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ["Mathematics", "Physics", "Chemistry", "Computer Science", "Engineering"];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No resources found matching your criteria
          </div>
        ) : (
          filteredResources.map((resource: any) => (
            <div key={resource.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">{resource.title}</h4>
                  <p className="text-sm text-gray-600">
                    {resource.category} • {resource.course} • 
                    {resource.fileSize ? ` ${Math.round(resource.fileSize / 1024)} KB` : ''} •
                    Uploaded {new Date(resource.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{resource.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge 
                      variant="secondary" 
                      className={
                        resource.status === 'approved' ? 'bg-green-100 text-green-700' :
                        resource.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }
                    >
                      {resource.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {resource.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                      {resource.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                      {resource.status || 'pending'}
                    </Badge>
                    <Badge variant="secondary">{resource.fileType?.split('/')[1]?.toUpperCase() || 'FILE'}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDownload(resource)}
                  disabled={!resource.fileUrl || resource.status !== 'approved'}
                  title="Download Resource"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Results Summary */}
      {filteredResources.length > 0 && (
        <div className="text-sm text-gray-600 text-center">
          Showing {filteredResources.length} of {resources.length} resources
        </div>
      )}
    </div>
  );
};

// Resource Library Interface Component (replicates View Library functionality)
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

const ResourceManagementPage = ({ setUploadOpen, setResourceLibraryOpen }: any) => {
  // Fetch real data for resource counts
  const { data: resources = [] } = useQuery({
    queryKey: ["/api/resources"],
    retry: false,
  });

  const { data: downloads = [] } = useQuery({
    queryKey: ["/api/downloads"],
    retry: false,
  });

  // Calculate today's downloads
  const today = new Date().toDateString();
  const downloadsToday = downloads.filter((download: any) => 
    new Date(download.downloadedAt).toDateString() === today
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resource Management</h1>
          <p className="text-gray-600">Manage academic resources and content</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setUploadOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Resource
          </Button>
          <Button variant="outline" onClick={() => setResourceLibraryOpen(true)}>
            <Eye className="w-4 h-4 mr-2" />
            View Library
          </Button>
        </div>
      </div>

      {/* Resource Library Interface */}
      <ResourceLibraryInterface />
    </div>
  );
};

const SystemSettingsPage = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600">Configure system preferences and security</p>
      </div>
      <Button>
        <Settings className="w-4 h-4 mr-2" />
        Save Changes
      </Button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">System Name</label>
            <Input value="DRMS - Department Resource Management System" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Upload Limit (MB)</label>
            <Input value="50" type="number" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
            <Input value="60" type="number" readOnly />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Password Policy</label>
            <Input value="Minimum 8 characters, mixed case" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Login Attempts</label>
            <Input value="5" type="number" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Account Lockout (minutes)</label>
            <Input value="30" type="number" readOnly />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const EquipmentPage = ({ user }: { user: any }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: equipment = [], isLoading: equipmentLoading } = useQuery({
    queryKey: ["/api/equipment"],
    retry: false,
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/bookings"],
    retry: false,
  });

  const { mutate: addEquipment } = useMutation({
    mutationFn: async (data: any) => {
      const token = localStorage.getItem('token');
      const response = await fetch("/api/equipment", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to add equipment");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Equipment added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add equipment",
        variant: "destructive",
      });
    },
  });

  const { mutate: updateEquipment } = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/equipment/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update equipment");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Equipment updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update equipment",
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteEquipment } = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/equipment/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });
      if (!response.ok) throw new Error("Failed to delete equipment");
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Equipment deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete equipment",
        variant: "destructive",
      });
    },
  });

  const { mutate: approveBooking } = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/bookings/${id}/approve`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });
      if (!response.ok) throw new Error("Failed to approve booking");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Booking approved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve booking",
        variant: "destructive",
      });
    },
  });

  const [editingEquipment, setEditingEquipment] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEquipment, setNewEquipment] = useState({ name: "", description: "", status: "available" });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  if (equipmentLoading || bookingsLoading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipment Management</h1>
          <p className="text-gray-600">Manage equipment and bookings</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      {/* Add Equipment Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Equipment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Equipment Name"
                value={newEquipment.name}
                onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
              />
              <Input
                placeholder="Description"
                value={newEquipment.description}
                onChange={(e) => setNewEquipment({ ...newEquipment, description: e.target.value })}
              />
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    addEquipment(newEquipment);
                    setShowAddForm(false);
                    setNewEquipment({ name: "", description: "", status: "available" });
                  }}
                  disabled={!newEquipment.name}
                >
                  Add
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    setNewEquipment({ name: "", description: "", status: "available" });
                  }}
                >
                  Cancel
                </Button>
              </div>
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

      {/* Equipment List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEquipment.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">
              {searchQuery || statusFilter !== "all" 
                ? "No equipment found matching your filters" 
                : "No equipment available"}
            </p>
          </div>
        ) : (
          filteredEquipment.map((item: any) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              {editingEquipment?.id === item.id ? (
                <div className="space-y-4">
                  <Input
                    value={editingEquipment.name}
                    onChange={(e) => setEditingEquipment({ ...editingEquipment, name: e.target.value })}
                  />
                  <Input
                    value={editingEquipment.description}
                    onChange={(e) => setEditingEquipment({ ...editingEquipment, description: e.target.value })}
                  />
                  <select
                    value={editingEquipment.status}
                    onChange={(e) => setEditingEquipment({ ...editingEquipment, status: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        updateEquipment(editingEquipment);
                        setEditingEquipment(null);
                      }}
                    >
                      Save
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingEquipment(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingEquipment(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteEquipment(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant={item.status === 'available' ? 'default' : item.status === 'booked' ? 'secondary' : 'destructive'}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
        )}
      </div>

      {/* Pending Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {Array.isArray(bookings) && bookings.filter((booking: any) => booking.status === 'pending').length === 0 ? (
            <p className="text-gray-500 text-center py-4">No pending bookings</p>
          ) : (
            <div className="space-y-4">
              {Array.isArray(bookings) && bookings
                .filter((booking: any) => booking.status === 'pending')
                .map((booking: any) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{booking.equipmentName}</h4>
                      <p className="text-sm text-gray-600">
                        Requested by: {booking.userEmail} | Purpose: {booking.purpose}
                      </p>
                    </div>
                    <Button onClick={() => approveBooking(booking.id)}>
                      Approve
                    </Button>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const AnalyticsPage = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">System usage and performance metrics</p>
      </div>
      <Button variant="outline">
        <Download className="w-4 h-4 mr-2" />
        Export Report
      </Button>
    </div>

    {/* Analytics Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Downloads</p>
              <p className="text-2xl font-bold text-blue-600">1,234</p>
            </div>
            <Download className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Sessions</p>
              <p className="text-2xl font-bold text-green-600">42</p>
            </div>
            <Activity className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Storage Usage</p>
              <p className="text-2xl font-bold text-purple-600">67%</p>
            </div>
            <Database className="w-8 h-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">User Growth</p>
              <p className="text-2xl font-bold text-emerald-600">+12%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-600" />
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Charts placeholder */}
    <Card>
      <CardHeader>
        <CardTitle>Usage Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Analytics charts will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

const ProfilePage = ({ user }: any) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
        <p className="text-gray-600">Manage your administrator account</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">First Name</label>
              <Input value={user?.firstName || ''} readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Last Name</label>
              <Input value={user?.lastName || ''} readOnly />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input value={user?.email || ''} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Admin ID</label>
            <Input value="ADM2024001" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Department</label>
            <Input value="Information Technology" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Access Level</label>
            <Input value="Super Administrator" readOnly />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Admin Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Admin Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Users Managed</span>
            <span className="font-semibold">156</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Resources Approved</span>
            <span className="font-semibold">89</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">System Changes</span>
            <span className="font-semibold">23</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Login Sessions</span>
            <span className="font-semibold">145</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Last Login</span>
            <span className="font-semibold">Today</span>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default function AdminDashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [resourceLibraryOpen, setResourceLibraryOpen] = useState(false);
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [userCount, setUserCount] = useState(5); // Initialize with current count

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

  // Fetch system stats
  const { data: systemStats } = useQuery({
    queryKey: ["/api/analytics/system"],
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
      icon: Users,
      label: "Users",
      active: activeTab === "users",
      onClick: () => setActiveTab("users")
    },
    {
      icon: FileText,
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
      icon: Settings,
      label: "Settings",
      active: activeTab === "settings",
      onClick: () => setActiveTab("settings")
    },
    {
      icon: TrendingUp,
      label: "Analytics",
      active: activeTab === "analytics",
      onClick: () => setActiveTab("analytics")
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
        return <DashboardPage 
          user={user} 
          systemStats={systemStats} 
          setUploadOpen={setUploadOpen}
          setResourceLibraryOpen={setResourceLibraryOpen}
          setActiveTab={setActiveTab}
          userCount={userCount}
        />;
      case "users":
        return <UserManagementPage onUserCountChange={setUserCount} />;
      case "resources":
        return <ResourceManagementPage setUploadOpen={setUploadOpen} setResourceLibraryOpen={setResourceLibraryOpen} />;
      case "equipment":
        return <EquipmentPage user={user} />;
      case "settings":
        return <SystemSettingsPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "profile":
        return <ProfilePage user={user} />;
      default:
        return <DashboardPage user={user} systemStats={systemStats} userCount={userCount} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="flex h-screen">
        <Sidebar items={sidebarItems} user={user} userRole="admin" />
        
        <div className="flex-1 overflow-auto">
          <div className="p-6 pt-20 md:pt-6">
            {renderActivePage()}
          </div>
        </div>
      </div>

      {/* Modals */}
      <UploadModal 
        open={uploadOpen} 
        onOpenChange={setUploadOpen} 
      />
      <ResourceLibraryModal 
        open={resourceLibraryOpen} 
        onOpenChange={setResourceLibraryOpen} 
      />
      <EquipmentModal 
        open={equipmentOpen} 
        onOpenChange={setEquipmentOpen} 
      />
    </div>
  );
}