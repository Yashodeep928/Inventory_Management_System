import React, { useState } from "react";
import ProtectedRoute from "~/components/ProtectedRoute";
import { useLogout } from "~/components/ProtectedRoute";

// SVG Icons as React Components
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8 7 4-4 4 4"/>
  </svg>
);

const OrdersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
  </svg>
);

const ProfileIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
  </svg>
);

const NotificationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5-5h5m-5-5l5 5v5"/>
  </svg>
);

const ShoppingBagIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
  </svg>
);

const HeartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
  </svg>
);

const ReturnIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m5 14v-5a2 2 0 00-2-2H6a2 2 0 00-2 2v5a2 2 0 002 2h12a2 2 0 002-2z"/>
  </svg>
);

const CheckIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

const TruckIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
  </svg>
);

const ClockIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

// User Data
const userData = {
  name: "Nidhi",
  email: "nidhi@example.com",
  stats: {
    orders: 12,
    favorites: 8,
    returns: 2,
  },
  recentOrders: [
    { id: 101, item: "Wireless Headphones", status: "Shipped", date: "2024-01-19", total: 99.99, tracking: "TRK123456789" },
    { id: 102, item: "Bluetooth Speaker", status: "Pending", date: "2024-01-20", total: 79.99, tracking: "TRK987654321" },
    { id: 103, item: "Laptop Stand", status: "Delivered", date: "2024-01-18", total: 49.99, tracking: "TRK456789123" },
  ],
  profile: {
    email: "nidhi@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, City, State 12345",
    memberSince: "2023-06-15"
  }
};

function UserDashboardContent() {
  const handleLogout = useLogout();
  const [activeSection, setActiveSection] = useState("dashboard");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return { bg: "#ECFDF5", text: "#059669", icon: CheckIcon };
      case "Shipped":
        return { bg: "#DBEAFE", text: "#2563EB", icon: TruckIcon };
      case "Pending":
        return { bg: "#FEF3C7", text: "#D97706", icon: ClockIcon };
      default:
        return { bg: "#F3F4F6", text: "#6B7280", icon: ClockIcon };
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">{userData.name.charAt(0)}</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userData.name}!</h1>
                  <p className="text-gray-600">Here's what's happening with your account today.</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{userData.stats.orders}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#E6F7F1" }}>
                    <ShoppingBagIcon />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Favorites</p>
                    <p className="text-2xl font-bold text-gray-900">{userData.stats.favorites}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#E6F7F1" }}>
                    <HeartIcon />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Returns</p>
                    <p className="text-2xl font-bold text-gray-900">{userData.stats.returns}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#E6F7F1" }}>
                    <ReturnIcon />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Orders</h3>
              <div className="space-y-4">
                {userData.recentOrders.map((order) => {
                  const statusInfo = getStatusColor(order.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-600 text-lg">📦</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{order.item}</h4>
                          <p className="text-sm text-gray-500">Order #{order.id} • {order.date}</p>
                          <p className="text-xs text-gray-400">Tracking: {order.tracking}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${order.total}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <StatusIcon />
                            <span className="text-sm px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: statusInfo.bg, color: statusInfo.text }}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case "orders":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order History</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Order ID</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Item</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Date</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Total</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {userData.recentOrders.map((order) => {
                      const statusInfo = getStatusColor(order.status);
                      const StatusIcon = statusInfo.icon;
                      
                      return (
                        <tr key={order.id}>
                          <td className="py-4 font-medium text-gray-900">#{order.id}</td>
                          <td className="py-4 text-gray-900">{order.item}</td>
                          <td className="py-4 text-gray-900">{order.date}</td>
                          <td className="py-4 text-gray-900 font-medium">${order.total}</td>
                          <td className="py-4">
                            <div className="flex items-center space-x-1">
                              <StatusIcon />
                              <span className="text-sm px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: statusInfo.bg, color: statusInfo.text }}>
                                {order.status}
                              </span>
                            </div>
                          </td>
                          <td className="py-4">
                            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                              Track Order
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={userData.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={userData.profile.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={userData.profile.phone}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                  <input
                    type="text"
                    value={userData.profile.memberSince}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    readOnly
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={userData.profile.address}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex space-x-4">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Save Changes
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="font-inter" style={{ backgroundColor: "#F5F5F5" }}>
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-64 shadow-lg z-50" style={{ backgroundColor: "#FAFAFA" }}>
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ backgroundColor: "#00A86B" }}>
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <h1 className="text-lg font-semibold text-gray-800">My Account</h1>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveSection("dashboard")}
              className={`flex items-center space-x-3 px-4 py-3 font-medium rounded-lg w-full transition-colors ${
                activeSection === "dashboard" 
                  ? "text-white" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              style={activeSection === "dashboard" ? { backgroundColor: "#00A86B" } : {}}
            >
              <DashboardIcon />
              <span>Dashboard</span>
            </button>
            
            <button
              onClick={() => setActiveSection("orders")}
              className={`flex items-center space-x-3 px-4 py-3 font-medium rounded-lg w-full transition-colors ${
                activeSection === "orders" 
                  ? "text-white" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              style={activeSection === "orders" ? { backgroundColor: "#00A86B" } : {}}
            >
              <OrdersIcon />
              <span>Orders</span>
            </button>
            
            <button
              onClick={() => setActiveSection("profile")}
              className={`flex items-center space-x-3 px-4 py-3 font-medium rounded-lg w-full transition-colors ${
                activeSection === "profile" 
                  ? "text-white" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              style={activeSection === "profile" ? { backgroundColor: "#00A86B" } : {}}
            >
              <ProfileIcon />
              <span>Profile</span>
            </button>
          </nav>

          {/* Logout Button */}
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
            >
              <LogoutIcon />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen" style={{ backgroundColor: "#F5F5F5" }}>
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {activeSection === "dashboard" && "Dashboard"}
                  {activeSection === "orders" && "Order History"}
                  {activeSection === "profile" && "Profile Settings"}
                </h2>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent focus:ring-green-500"
                  />
                  <SearchIcon />
                </div>
                <div className="flex items-center space-x-3">
                  {/* Notification Icon */}
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 cursor-pointer">
                    <NotificationIcon />
                  </div>
                  {/* User Avatar */}
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{userData.name.charAt(0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default function UserDashboard() {
  return (
    <ProtectedRoute role="user">
      <UserDashboardContent />
    </ProtectedRoute>
  );
}