import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/ui/sidebar";
import StatsCard from "@/components/ui/stats-card";
import { 
  Users, 
  Database, 
  Monitor, 
  Activity, 
  Shield,
  UserCheck,
  BarChart3,
  Settings,
  TrendingUp,
  Server
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboard = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [user, isLoading, toast]);

  const { data: systemStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/analytics/system"],
    retry: false,
  });

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const sidebarItems = [
    { icon: BarChart3, label: "Dashboard", active: true },
    { icon: Users, label: "User Management" },
    { icon: Server, label: "System Resources" },
    { icon: BarChart3, label: "Analytics" },
    { icon: Shield, label: "Security" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        user={user} 
        items={sidebarItems}
        userRole="admin"
      />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Administration</h1>
          <p className="text-gray-600">Monitor and manage the entire departmental resource system</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <StatsCard
                title="Total Users"
                value={systemStats?.totalUsers || 0}
                icon={Users}
                color="blue"
                loading={statsLoading}
              />
              <StatsCard
                title="Active Sessions"
                value="342"
                icon={UserCheck}
                color="emerald"
              />
              <StatsCard
                title="Total Resources"
                value={systemStats?.totalResources || 0}
                icon={Database}
                color="purple"
                loading={statsLoading}
              />
              <StatsCard
                title="Equipment Items"
                value={systemStats?.totalEquipment || 0}
                icon={Monitor}
                color="cyan"
                loading={statsLoading}
              />
              <StatsCard
                title="System Health"
                value="99.8%"
                icon={Activity}
                color="green"
              />
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid lg:grid-cols-3 gap-8 mb-8">
              {/* Recent Activity */}
              <Card className="hover-lift">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent User Activity</CardTitle>
                  <Button variant="outline" size="sm">Manage Users</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "John Doe", role: "Student", action: "Logged in 5 min ago", status: "active" },
                      { name: "Dr. Sarah Johnson", role: "Faculty", action: "Uploaded resource 1 hour ago", status: "faculty" },
                      { name: "Emily Chen", role: "Student", action: "Downloaded 3 files today", status: "active" }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.status === 'faculty' ? 'bg-purple-500' : 'bg-blue-600'
                        }`}>
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{activity.name}</h4>
                          <p className="text-sm text-gray-600">{activity.role} • {activity.action}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          activity.status === 'faculty' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {activity.status === 'faculty' ? 'Faculty' : 'Active'}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Performance */}
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle>System Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "CPU Usage", value: 45, color: "bg-blue-500" },
                      { label: "Memory Usage", value: 67, color: "bg-yellow-500" },
                      { label: "Storage Usage", value: 45, color: "bg-blue-500" },
                      { label: "Database Load", value: 23, color: "bg-green-500" }
                    ].map((metric, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                          <span className="text-sm text-gray-900">{metric.value}%</span>
                        </div>
                        <Progress value={metric.value} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Comprehensive Analytics Dashboard */}
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle>System Analytics Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-1 gap-8">
                    {/* Usage Trends */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-4">Daily Active Users</h4>
                      <div className="flex items-end space-x-1 h-32">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                          const heights = [40, 65, 80, 70, 90, 35, 25];
                          return (
                            <div key={day} className="flex flex-col items-center space-y-1 flex-1">
                              <div 
                                className="w-full bg-blue-600 rounded-t hover:bg-blue-700 transition-colors cursor-pointer"
                                style={{ height: `${heights[index]}px` }}
                              ></div>
                              <span className="text-xs text-gray-600">{day}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatsCard
                      title="Total Students"
                      value="1,247"
                      icon={Users}
                      color="blue"
                    />
                    <StatsCard
                      title="Faculty Members"
                      value="89"
                      icon={UserCheck}
                      color="purple"
                    />
                    <StatsCard
                      title="Admin Users"
                      value="12"
                      icon={Shield}
                      color="emerald"
                    />
                  </div>
                  <div className="mt-6">
                    <p className="text-gray-600">Advanced user management features including role assignments, permissions, and user activity monitoring.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Resource Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatsCard
                      title="Total Resources"
                      value={systemStats?.totalResources || 0}
                      icon={Database}
                      color="purple"
                      loading={statsLoading}
                    />
                    <StatsCard
                      title="Pending Approval"
                      value="23"
                      icon={Monitor}
                      color="yellow"
                    />
                    <StatsCard
                      title="Downloads Today"
                      value="456"
                      icon={TrendingUp}
                      color="green"
                    />
                  </div>
                  <div className="mt-6">
                    <p className="text-gray-600">Manage academic resources, approve submissions, and monitor download statistics.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatsCard
                      title="Page Views"
                      value="12,567"
                      icon={BarChart3}
                      color="blue"
                    />
                    <StatsCard
                      title="Active Sessions"
                      value="342"
                      icon={Activity}
                      color="emerald"
                    />
                    <StatsCard
                      title="System Uptime"
                      value="99.8%"
                      icon={Server}
                      color="green"
                    />
                  </div>
                  <div className="mt-6">
                    <p className="text-gray-600">Comprehensive analytics including user behavior, system performance, and usage patterns.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>System Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatsCard
                      title="Server Load"
                      value="45%"
                      icon={Server}
                      color="blue"
                    />
                    <StatsCard
                      title="Database Size"
                      value="2.4 GB"
                      icon={Database}
                      color="purple"
                    />
                    <StatsCard
                      title="Security Score"
                      value="98%"
                      icon={Shield}
                      color="green"
                    />
                  </div>
                  <div className="mt-6">
                    <p className="text-gray-600">System configuration, security settings, backup management, and performance optimization.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;