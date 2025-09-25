import React from "react";
import { useLogout } from "~/components/ProtectedRoute";
import { Button } from "~/components/ui";

interface HeaderProps {
  title: string;
  userRole: "user" | "admin";
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ title, userRole, userName }) => {
  const handleLogout = useLogout();

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IM</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            </div>
          </div>

          {/* Center - Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
              Dashboard
            </a>
            {userRole === "admin" && (
              <>
                <a href="#users" className="text-gray-600 hover:text-green-600 transition-colors">
                  Users
                </a>
                <a href="#inventory" className="text-gray-600 hover:text-green-600 transition-colors">
                  Inventory
                </a>
                <a href="#orders" className="text-gray-600 hover:text-green-600 transition-colors">
                  Orders
                </a>
                <a href="#reports" className="text-gray-600 hover:text-green-600 transition-colors">
                  Reports
                </a>
              </>
            )}
            {userRole === "user" && (
              <>
                <a href="#orders" className="text-gray-600 hover:text-green-600 transition-colors">
                  My Orders
                </a>
                <a href="#profile" className="text-gray-600 hover:text-green-600 transition-colors">
                  Profile
                </a>
              </>
            )}
          </nav>

          {/* Right side - User info and Logout */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-medium text-sm">
                  {userName ? userName.charAt(0).toUpperCase() : userRole.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{userName || userRole}</p>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
