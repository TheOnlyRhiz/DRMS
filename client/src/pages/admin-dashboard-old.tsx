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
  Trash2
} from "lucide-react";
import UploadModal from "@/components/modals/upload-modal";
import ResourceLibraryModal from "@/components/modals/resource-library-modal";
import EquipmentModal from "@/components/modals/equipment-modal";

// Admin Dashboard Pages
const DashboardPage = ({ user, systemStats, setUploadOpen, setResourceLibraryOpen, setActiveTab }: any) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Administration</h1>
        <p className="text-gray-600">Welcome back, {user?.firstName || 'Administrator'}! Monitor system health and manage users</p>
      </div>
      <div className="flex gap-3">
        <Button>
          <Activity className="w-4 h-4 mr-2" />
          System Health
        </Button>
      </div>
    </div>

    {/* Quick Actions Cards */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Resource Management Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
            <div className="p-2 bg-blue-500 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            Resource Management
          </CardTitle>
          <p className="text-gray-600 text-sm">Manage academic resources and content</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            className="w-full justify-start h-12 bg-white/80 hover:bg-white text-gray-700 border-0 shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() => setUploadOpen(true)}
          >
            <Upload className="w-5 h-5 mr-3 text-blue-600" />
            Upload New Resource
          </Button>
          <Button 
            className="w-full justify-start h-12 bg-white/80 hover:bg-white text-gray-700 border-0 shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() => setResourceLibraryOpen(true)}
          >
            <Eye className="w-5 h-5 mr-3 text-blue-600" />
            Review All Resources
          </Button>
          <Button 
            className="w-full justify-start h-12 bg-white/80 hover:bg-white text-gray-700 border-0 shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 className="w-5 h-5 mr-3 text-blue-600" />
            View Analytics
          </Button>
        </CardContent>
      </Card>

      {/* User Management Card */}
      <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            User Management
          </CardTitle>
          <p className="text-gray-600 text-sm">Manage users, roles, and permissions</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            className="w-full justify-start h-12 bg-white/80 hover:bg-white text-gray-700 border-0 shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() => setActiveTab('users')}
          >
            <UserCheck className="w-5 h-5 mr-3 text-emerald-600" />
            Manage All Users
          </Button>
          <Button 
            className="w-full justify-start h-12 bg-white/80 hover:bg-white text-gray-700 border-0 shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() => setActiveTab('settings')}
          >
            <Shield className="w-5 h-5 mr-3 text-emerald-600" />
            System Settings
          </Button>
          <Button 
            className="w-full justify-start h-12 bg-white/80 hover:bg-white text-gray-700 border-0 shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() => setActiveTab('dashboard')}
          >
            <Activity className="w-5 h-5 mr-3 text-emerald-600" />
            View System Activity
          </Button>
        </CardContent>
      </Card>
    </div>

    {/* System Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-emerald-600">{systemStats?.totalUsers || 0}</p>
            </div>
            <Users className="w-8 h-8 text-emerald-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Resources</p>
              <p className="text-2xl font-bold text-blue-600">{systemStats?.totalResources || 0}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Equipment</p>
              <p className="text-2xl font-bold text-purple-600">{systemStats?.totalEquipment || 0}</p>
            </div>
            <Settings className="w-8 h-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Bookings</p>
              <p className="text-2xl font-bold text-orange-600">{systemStats?.activeBookings || 0}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>

    {/* System Activity */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent System Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: "New user registered", user: "student@university.edu", time: "5 min ago", type: "success" },
              { action: "Resource uploaded", user: "faculty@university.edu", time: "12 min ago", type: "info" },
              { action: "Equipment booking", user: "student2@university.edu", time: "1 hour ago", type: "info" },
              { action: "Failed login attempt", user: "unknown@domain.com", time: "2 hours ago", type: "warning" }
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {activity.type === "success" && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {activity.type === "info" && <Activity className="w-5 h-5 text-blue-600" />}
                  {activity.type === "warning" && <AlertTriangle className="w-5 h-5 text-orange-600" />}
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.user} • {activity.time}</p>
                  </div>
                </div>
                <Badge variant={activity.type === "warning" ? "destructive" : "secondary"}>
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Resource Management Actions */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Resource Management
              </h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => setUploadOpen(true)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Resource
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => setResourceLibraryOpen(true)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Review Resources
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('analytics')}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </div>

            {/* User Management Actions */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Users className="w-4 h-4" />
                User Management
              </h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('users')}
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('settings')}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  System Settings
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('dashboard')}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  View Activity
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const UserManagementPage = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
      </div>
      <div className="flex gap-3">
        <Button>
          <UserCheck className="w-4 h-4 mr-2" />
          Add User
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Users
        </Button>
      </div>
    </div>

    {/* User Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-blue-600">156</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Students</p>
              <p className="text-2xl font-bold text-green-600">120</p>
            </div>
            <User className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Faculty</p>
              <p className="text-2xl font-bold text-purple-600">24</p>
            </div>
            <UserCheck className="w-8 h-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-red-600">12</p>
            </div>
            <Shield className="w-8 h-8 text-red-600" />
          </div>
        </CardContent>
      </Card>
    </div>

    {/* User List */}
    <Card>
      <CardHeader>
        <CardTitle>System Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { name: "John Doe", email: "john.doe@university.edu", role: "student", status: "active", lastLogin: "2 hours ago" },
            { name: "Dr. Jane Smith", email: "jane.smith@university.edu", role: "faculty", status: "active", lastLogin: "1 day ago" },
            { name: "Mike Johnson", email: "mike.johnson@university.edu", role: "student", status: "inactive", lastLogin: "1 week ago" },
            { name: "Prof. Robert Brown", email: "robert.brown@university.edu", role: "faculty", status: "active", lastLogin: "3 hours ago" },
            { name: "Admin User", email: "admin@university.edu", role: "admin", status: "active", lastLogin: "30 minutes ago" }
          ].map((user, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">{user.name}</h4>
                  <p className="text-sm text-gray-600">{user.email} • Last login: {user.lastLogin}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant={user.role === "admin" ? "destructive" : user.role === "faculty" ? "default" : "secondary"}>
                      {user.role}
                    </Badge>
                    <Badge variant={user.status === "active" ? "default" : "secondary"}>
                      {user.status}
                    </Badge>
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
                  <UserX className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

const ResourceManagementPage = ({ setUploadOpen, setResourceLibraryOpen }: any) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Resource Administration</h1>
        <p className="text-gray-600">Manage and approve academic resources system-wide</p>
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

    {/* Resource Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Resources</p>
              <p className="text-2xl font-bold text-blue-600">234</p>
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
              <p className="text-2xl font-bold text-orange-600">12</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">210</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">12</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Pending Approvals */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Pending Approvals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium">Machine Learning Fundamentals - Chapter {i}</h4>
                  <p className="text-sm text-gray-600">Uploaded by Dr. Smith • CS401 • 2 days ago</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending Review
                    </Badge>
                    <Badge variant="secondary">PDF • 2.4 MB</Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive">
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

const SystemSettingsPage = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
      <p className="text-gray-600">Configure system-wide settings and preferences</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">System Name</label>
            <Input value="DRMS - Department Resource Management System" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Default Upload Limit (MB)</label>
            <Input value="50" type="number" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Auto-Approval Threshold</label>
            <Input value="Faculty Level" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
            <Input value="60" type="number" />
          </div>
          <Button>Save General Settings</Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Password Policy</label>
            <Input value="Minimum 8 characters, 1 uppercase, 1 number" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Login Attempts Limit</label>
            <Input value="5" type="number" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Account Lockout Duration (minutes)</label>
            <Input value="30" type="number" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Two-Factor Authentication</label>
            <select className="w-full p-2 border rounded-md">
              <option>Optional</option>
              <option>Required for Admin</option>
              <option>Required for All</option>
            </select>
          </div>
          <Button>Save Security Settings</Button>
        </CardContent>
      </Card>

      {/* File Management Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            File Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Allowed File Types</label>
            <Input value="PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Maximum File Size (MB)</label>
            <Input value="50" type="number" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Storage Cleanup Policy</label>
            <select className="w-full p-2 border rounded-md">
              <option>Never</option>
              <option>After 1 year</option>
              <option>After 2 years</option>
              <option>After 5 years</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Virus Scanning</label>
            <select className="w-full p-2 border rounded-md">
              <option>Enabled</option>
              <option>Disabled</option>
            </select>
          </div>
          <Button>Save File Settings</Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email Notifications</label>
            <select className="w-full p-2 border rounded-md">
              <option>Enabled</option>
              <option>Admin Only</option>
              <option>Disabled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">New User Registration</label>
            <select className="w-full p-2 border rounded-md">
              <option>Notify Admin</option>
              <option>Auto Approve</option>
              <option>Manual Approval</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Resource Upload Notifications</label>
            <select className="w-full p-2 border rounded-md">
              <option>Notify Admin</option>
              <option>Notify Department</option>
              <option>Disabled</option>
            </select>
          </div>
          <Button>Save Notification Settings</Button>
        </CardContent>
      </Card>
    </div>
  </div>
);

const ProfilePage = ({ user }: any) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Administrator Profile</h1>
      <p className="text-gray-600">Manage your administrator account and system access</p>
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
            <label className="block text-sm font-medium mb-2">Admin ID</label>
            <Input value="ADM2024001" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Department</label>
            <Input value="Information Technology" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Access Level</label>
            <Input value="Super Administrator" disabled />
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
      label: "Settings",
      active: activeTab === "settings",
      onClick: () => setActiveTab("settings")
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
        />;
      case "users":
        return <UserManagementPage />;
      case "resources":
        return <ResourceManagementPage setUploadOpen={setUploadOpen} setResourceLibraryOpen={setResourceLibraryOpen} />;
      case "settings":
        return <SystemSettingsPage />;
      case "profile":
        return <ProfilePage user={user} />;
      default:
        return <DashboardPage user={user} systemStats={systemStats} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar user={user} items={sidebarItems} userRole="admin" />
      
      <main className="flex-1 p-4 md:p-6 lg:p-8 min-w-0">
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