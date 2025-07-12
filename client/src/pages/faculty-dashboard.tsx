import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Calendar, 
  Upload, 
  Users, 
  FileText, 
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Settings,
  User,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye
} from "lucide-react";
import UploadModal from "@/components/modals/upload-modal";
import ResourceLibraryModal from "@/components/modals/resource-library-modal";
import EquipmentModal from "@/components/modals/equipment-modal";

// Faculty Dashboard Pages
const DashboardPage = ({ user, stats }: any) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Faculty Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.firstName || 'Professor'}! Here's your teaching overview</p>
      </div>
      <div className="flex gap-3">
        <Button>
          <TrendingUp className="w-4 h-4 mr-2" />
          View Analytics
        </Button>
      </div>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resources Uploaded</p>
              <p className="text-2xl font-bold text-purple-600">{stats?.resourcesUploaded || 0}</p>
            </div>
            <BookOpen className="w-8 h-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Downloads</p>
              <p className="text-2xl font-bold text-blue-600">156</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Students</p>
              <p className="text-2xl font-bold text-green-600">42</p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-orange-600">3</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Recent Activity */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Uploads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Machine Learning Lecture #{i}</p>
                    <p className="text-sm text-gray-600">2 days ago</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">Approved</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Popular Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Data Structures Notes</p>
                    <p className="text-sm text-gray-600">24 downloads this week</p>
                  </div>
                </div>
                <Badge variant="outline">Trending</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const ResourceManagementPage = ({ setUploadOpen, setResourceLibraryOpen }: any) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Resource Management</h1>
        <p className="text-gray-600">Upload, manage, and approve academic resources</p>
      </div>
      <div className="flex gap-3">
        <Button onClick={() => setUploadOpen(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Resource
        </Button>
        <Button variant="outline" onClick={() => setResourceLibraryOpen(true)}>
          <Eye className="w-4 h-4 mr-2" />
          Browse All
        </Button>
      </div>
    </div>

    {/* Quick Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">My Resources</p>
              <p className="text-2xl font-bold text-blue-600">12</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-orange-600">3</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Downloads</p>
              <p className="text-2xl font-bold text-green-600">156</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Resource Management Table */}
    <Card>
      <CardHeader>
        <CardTitle>Your Resources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium">Advanced Database Concepts - Lecture {i}</h4>
                  <p className="text-sm text-gray-600">CS401 • Uploaded 2 days ago • 24 downloads</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approved
                    </Badge>
                    <Badge variant="secondary">PDF</Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

const EquipmentManagementPage = ({ setEquipmentOpen }: any) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Equipment Management</h1>
        <p className="text-gray-600">Manage lab equipment and bookings</p>
      </div>
      <Button onClick={() => setEquipmentOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Add Equipment
      </Button>
    </div>

    {/* Equipment Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Equipment</p>
              <p className="text-2xl font-bold text-blue-600">24</p>
            </div>
            <Settings className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Now</p>
              <p className="text-2xl font-bold text-green-600">18</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Use</p>
              <p className="text-2xl font-bold text-orange-600">6</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Maintenance</p>
              <p className="text-2xl font-bold text-red-600">2</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Equipment List */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">Available</Badge>
            </div>
            <h3 className="font-semibold mb-2">Microscope #{i}</h3>
            <p className="text-sm text-gray-600 mb-4">High-resolution research microscope with digital imaging capabilities</p>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <span>Biology Lab</span>
              <span>Last used: 2h ago</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <Calendar className="w-4 h-4 mr-2" />
                View Schedule
              </Button>
              <Button size="sm" variant="outline">
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const StudentsPage = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
        <p className="text-gray-600">Monitor student activity and engagement</p>
      </div>
      <div className="flex gap-3">
        <Button>
          <Users className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>
    </div>

    {/* Student Activity Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Students</p>
              <p className="text-2xl font-bold text-blue-600">42</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Weekly Engagement</p>
              <p className="text-2xl font-bold text-green-600">89%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resource Access</p>
              <p className="text-2xl font-bold text-purple-600">234</p>
            </div>
            <BookOpen className="w-8 h-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Student List */}
    <Card>
      <CardHeader>
        <CardTitle>Student Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Student {i}</h4>
                  <p className="text-sm text-gray-600">student{i}@university.edu • Last active: 2 hours ago</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">CS301</Badge>
                    <Badge variant="secondary">CS401</Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">{Math.floor(Math.random() * 20) + 5} downloads</p>
                <p className="text-sm text-gray-600">{Math.floor(Math.random() * 10) + 1} bookings</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

const ProfilePage = ({ user }: any) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Faculty Profile</h1>
      <p className="text-gray-600">Manage your account and teaching preferences</p>
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
              <label className="block text-sm font-medium mb-2">First Name</label>
              <Input value={user?.firstName || ''} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Last Name</label>
              <Input value={user?.lastName || ''} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input value={user?.email || ''} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Faculty ID</label>
            <Input value="FAC2024001" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Department</label>
            <Input value="Computer Science" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Office Hours</label>
            <Input value="Mon-Wed 2:00 PM - 4:00 PM" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Teaching Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Teaching Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Resources Uploaded</span>
            <span className="font-semibold">12</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Downloads</span>
            <span className="font-semibold">156</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Active Students</span>
            <span className="font-semibold">42</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Equipment Managed</span>
            <span className="font-semibold">8</span>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default function FacultyDashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [resourceLibraryOpen, setResourceLibraryOpen] = useState(false);
  const [equipmentOpen, setEquipmentOpen] = useState(false);

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
      icon: Upload,
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
      icon: Users,
      label: "Students",
      active: activeTab === "students",
      onClick: () => setActiveTab("students")
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
        return <DashboardPage user={user} stats={stats} />;
      case "resources":
        return <ResourceManagementPage setUploadOpen={setUploadOpen} setResourceLibraryOpen={setResourceLibraryOpen} />;
      case "equipment":
        return <EquipmentManagementPage setEquipmentOpen={setEquipmentOpen} />;
      case "students":
        return <StudentsPage />;
      case "profile":
        return <ProfilePage user={user} />;
      default:
        return <DashboardPage user={user} stats={stats} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} items={sidebarItems} userRole="admin" />
      
      <main className="flex-1 p-8">
        {renderActivePage()}
      </main>

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