import React, { useState } from "react";
import ProtectedRoute from "~/components/ProtectedRoute";
import { Header, Sidebar } from "~/components/layout";
import { Card, Breadcrumb, Button } from "~/components/ui";

const userData = {
  name: "Nidhi",
  profilePic: "",
  stats: {
    orders: 12,
    favorites: 8,
    returns: 2,
  },
  recentOrders: [
    { id: 101, item: "Wireless Headphones", status: "Shipped", date: "2024-01-19", total: 99.99 },
    { id: 102, item: "Bluetooth Speaker", status: "Pending", date: "2024-01-20", total: 79.99 },
    { id: 103, item: "Laptop Stand", status: "Delivered", date: "2024-01-18", total: 49.99 },
  ],
  profile: {
    email: "nidhi@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, City, State 12345",
    memberSince: "2023-06-15"
  }
};

const UserDashboardContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <Breadcrumb 
              items={[
                { label: "User", href: "#" },
                { label: "Dashboard" }
              ]}
              className="mb-4"
            />
            
            {/* Welcome Section */}
            <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                    {userData.name.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Hi, {userData.name} 👋</h1>
                    <p className="text-gray-600">Welcome back to your dashboard</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Member since</p>
                  <p className="font-medium">{new Date(userData.profile.memberSince).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Card hover>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-xl">📦</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{userData.stats.orders}</p>
                  </div>
                </div>
              </Card>
              
              <Card hover>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 text-xl">❤️</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Favorites</p>
                    <p className="text-2xl font-bold text-gray-900">{userData.stats.favorites}</p>
                  </div>
                </div>
              </Card>
              
              <Card hover>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-600 text-xl">🔄</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Returns</p>
                    <p className="text-2xl font-bold text-gray-900">{userData.stats.returns}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 font-medium text-gray-700">Order ID</th>
                      <th className="py-3 px-4 font-medium text-gray-700">Item</th>
                      <th className="py-3 px-4 font-medium text-gray-700">Date</th>
                      <th className="py-3 px-4 font-medium text-gray-700">Total</th>
                      <th className="py-3 px-4 font-medium text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="py-3 px-4 font-medium">#{order.id}</td>
                        <td className="py-3 px-4">{order.item}</td>
                        <td className="py-3 px-4 text-gray-600">{new Date(order.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4 font-medium">${order.total.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        );
      
      case "orders":
        return (
          <div className="space-y-6">
            <Breadcrumb 
              items={[
                { label: "User", href: "#" },
                { label: "My Orders" }
              ]}
              className="mb-4"
            />
            <Card>
              <h2 className="text-xl font-semibold mb-4">All Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 font-medium text-gray-700">Order ID</th>
                      <th className="py-3 px-4 font-medium text-gray-700">Item</th>
                      <th className="py-3 px-4 font-medium text-gray-700">Date</th>
                      <th className="py-3 px-4 font-medium text-gray-700">Total</th>
                      <th className="py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="py-3 px-4 font-medium">#{order.id}</td>
                        <td className="py-3 px-4">{order.item}</td>
                        <td className="py-3 px-4 text-gray-600">{new Date(order.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4 font-medium">${order.total.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm">
                            Track
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        );
      
      case "profile":
        return (
          <div className="space-y-6">
            <Breadcrumb 
              items={[
                { label: "User", href: "#" },
                { label: "Profile" }
              ]}
              className="mb-4"
            />
            <Card>
              <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={userData.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    value={userData.profile.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input 
                    type="tel" 
                    value={userData.profile.phone}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                  <input 
                    type="text" 
                    value={new Date(userData.profile.memberSince).toLocaleDateString()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    readOnly
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea 
                    value={userData.profile.address}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    readOnly
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outline">Edit Profile</Button>
                <Button variant="secondary">Change Password</Button>
              </div>
            </Card>
          </div>
        );
      
      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Inventory Management" userRole="user" userName={userData.name} />
      <div className="flex">
        <Sidebar 
          userRole="user" 
          activeItem={activeSection}
          onItemClick={setActiveSection}
        />
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const UserDashboard: React.FC = () => {
  return (
    <ProtectedRoute role="user">
      <UserDashboardContent />
    </ProtectedRoute>
  );
};

export default UserDashboard;
