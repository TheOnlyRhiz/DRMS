import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

interface SidebarProps {
  user: any;
  items: SidebarItem[];
  userRole: "student" | "admin";
}

const Sidebar = ({ user, items, userRole }: SidebarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const roleColors = {
    student: "from-blue-600 to-blue-700",
    admin: "from-blue-600 to-blue-700"
  };

  const roleIcons = {
    student: "🎓",
    admin: "⚙️"
  };

  const handleLogout = () => {
    // Clear JWT token from localStorage
    localStorage.removeItem("token");
    // Redirect to landing page
    window.location.href = "/";
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavItemClick = (onClick?: () => void) => {
    if (onClick) onClick();
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 bg-gradient-to-br ${roleColors[userRole]} rounded-lg flex items-center justify-center text-sm`}>
            {roleIcons[userRole]}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user?.email?.split('@')[0] || 'User'
              }
            </h2>
            <p className="text-xs text-gray-500 capitalize">{userRole}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMobileMenu}
          className="p-2 hover:bg-gray-100"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={toggleMobileMenu} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 text-gray-900 transform transition-transform duration-300 ease-in-out shadow-xl md:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:h-screen md:flex-shrink-0
      `}>
        <div className="p-6 h-full flex flex-col">
          {/* Desktop User Profile */}
          <div className="hidden md:flex items-center space-x-3 mb-8 p-4 bg-gray-50 rounded-xl">
            <div className={`w-12 h-12 bg-gradient-to-br ${roleColors[userRole]} rounded-xl flex items-center justify-center text-xl`}>
              {roleIcons[userRole]}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-gray-900 text-base truncate">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.email?.split('@')[0] || 'User'
                }
              </h2>
              <p className="text-sm text-gray-600 capitalize">{userRole}</p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {items.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleNavItemClick(item.onClick)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    item.active 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-base truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full text-gray-600 hover:text-red-600 hover:bg-red-50 justify-start p-3"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="text-base">Logout</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
