import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Settings, 
  Shield, 
  Database,
  Zap,
  Globe,
  ArrowRight,
  Upload,
  Search,
  BarChart3
} from "lucide-react";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Database className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">DRMS</h1>
                <p className="text-xs text-gray-600 hidden sm:block">Resource Management</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation("/login")}
                className="text-xs sm:text-sm"
              >
                Sign In
              </Button>
              <Button 
                size="sm"
                onClick={() => setLocation("/login")}
                className="text-xs sm:text-sm"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-4 sm:mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100">
            <Zap className="w-4 h-4 mr-2" />
            Modern Resource Management
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Streamline Your Department's
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 block sm:inline"> Digital Resources</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed px-4">
            A comprehensive platform for managing academic resources, equipment bookings, and departmental workflows. 
            Built for educational institutions to enhance collaboration and efficiency.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => setLocation("/login")}
            >
              Start Managing Resources
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => setLocation("/login")}
            >
              View Demo
              <Globe className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Everything You Need for Resource Management
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Powerful features designed to simplify resource sharing, equipment booking, and departmental administration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Feature Cards */}
          <Card className="hover-lift border-0 shadow-lg bg-white/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg sm:text-xl">Digital Library</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-gray-600">
                Centralized repository for academic materials, lecture notes, and research papers with advanced search capabilities.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift border-0 shadow-lg bg-white/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg sm:text-xl">Equipment Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-gray-600">
                Schedule and manage department equipment with real-time availability tracking and automated notifications.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift border-0 shadow-lg bg-white/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg sm:text-xl">User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-gray-600">
                Role-based access control for students and administrators with customizable permissions and secure authentication.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift border-0 shadow-lg bg-white/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg sm:text-xl">File Upload & Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-gray-600">
                Easy file upload with support for multiple formats, progress tracking, and secure sharing across the department.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift border-0 shadow-lg bg-white/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-lg sm:text-xl">Advanced Search</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-gray-600">
                Powerful search and filtering capabilities to quickly find resources by course, category, file type, or keywords.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift border-0 shadow-lg bg-white/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
              <CardTitle className="text-lg sm:text-xl">Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-gray-600">
                Comprehensive insights into resource usage, user activity, and system performance with detailed reports.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 bg-gray-50/50">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Perfect for Educational Institutions
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Designed specifically for departments that need efficient resource management and collaboration tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">For Students</h3>
                <p className="text-gray-600">Access course materials, upload assignments, book equipment, and collaborate with peers seamlessly.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">For Administrators</h3>
                <p className="text-gray-600">Manage users, approve resources, monitor system usage, and maintain departmental workflows efficiently.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Database className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Centralized Storage</h3>
                <p className="text-gray-600">Keep all departmental resources organized in one secure, accessible location with version control.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Settings className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Configuration</h3>
                <p className="text-gray-600">Simple setup and configuration with customizable settings to match your department's specific needs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to Transform Your Department?
          </h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90 px-4">
            Join educational institutions using DRMS to streamline their resource management operations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => setLocation("/login")}
            >
              Get Started Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-blue-600"
              onClick={() => setLocation("/login")}
            >
              Try Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">DRMS</span>
            </div>
          </div>
          <div className="text-center text-sm">
            <p>&copy; 2024 Department Resource Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}