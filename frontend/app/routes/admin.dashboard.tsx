import React, { useState } from "react";
import ProtectedRoute from "~/components/ProtectedRoute";
import { Header, Sidebar } from "~/components/layout";
import { Card, Breadcrumb } from "~/components/ui";
import { UserTable, InventoryTable, OrdersTable } from "~/components/admin";

// Mock data
const mockUsers = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "user" as const, status: "active" as const, joinDate: "2024-01-15", lastLogin: "2024-01-20" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "user" as const, status: "active" as const, joinDate: "2024-01-10", lastLogin: "2024-01-19" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", role: "admin" as const, status: "active" as const, joinDate: "2024-01-05", lastLogin: "2024-01-20" },
  { id: "4", name: "Diana Prince", email: "diana@example.com", role: "user" as const, status: "inactive" as const, joinDate: "2024-01-12", lastLogin: "2024-01-15" },
];

const mockInventory = [
  { id: "1", name: "Wireless Headphones", category: "Electronics", sku: "WH-001", price: 99.99, stock: 25, status: "in-stock" as const, lastUpdated: "2024-01-20" },
  { id: "2", name: "Bluetooth Speaker", category: "Electronics", sku: "BS-002", price: 79.99, stock: 8, status: "low-stock" as const, lastUpdated: "2024-01-19" },
  { id: "3", name: "Laptop Stand", category: "Accessories", sku: "LS-003", price: 49.99, stock: 0, status: "out-of-stock" as const, lastUpdated: "2024-01-18" },
  { id: "4", name: "USB Cable", category: "Accessories", sku: "UC-004", price: 12.99, stock: 50, status: "in-stock" as const, lastUpdated: "2024-01-20" },
];

const mockOrders = [
  { 
    id: "1001", 
    customerName: "Alice Johnson", 
    customerEmail: "alice@example.com", 
    items: [{ name: "Wireless Headphones", quantity: 1, price: 99.99 }], 
    total: 99.99, 
    status: "shipped" as const, 
    orderDate: "2024-01-19", 
    shippingAddress: "123 Main St, City, State" 
  },
  { 
    id: "1002", 
    customerName: "Bob Smith", 
    customerEmail: "bob@example.com", 
    items: [{ name: "Bluetooth Speaker", quantity: 2, price: 79.99 }], 
    total: 159.98, 
    status: "pending" as const, 
    orderDate: "2024-01-20", 
    shippingAddress: "456 Oak Ave, City, State" 
  },
];

function AdminDashboardContent() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleUserEdit = (user: any) => {
    console.log("Edit user:", user);
    // Implement user editing logic
  };

  const handleUserDelete = (userId: string) => {
    console.log("Delete user:", userId);
    // Implement user deletion logic
  };

  const handleUserToggleStatus = (userId: string) => {
    console.log("Toggle user status:", userId);
    // Implement user status toggle logic
  };

  const handleInventoryEdit = (item: any) => {
    console.log("Edit inventory item:", item);
    // Implement inventory editing logic
  };

  const handleInventoryDelete = (itemId: string) => {
    console.log("Delete inventory item:", itemId);
    // Implement inventory deletion logic
  };

  const handleInventoryRestock = (itemId: string) => {
    console.log("Restock inventory item:", itemId);
    // Implement inventory restocking logic
  };

  const handleOrderUpdateStatus = (orderId: string, status: any) => {
    console.log("Update order status:", orderId, status);
    // Implement order status update logic
  };

  const handleOrderViewDetails = (order: any) => {
    console.log("View order details:", order);
    // Implement order details view logic
  };

  const handleOrderCancel = (orderId: string) => {
    console.log("Cancel order:", orderId);
    // Implement order cancellation logic
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <Breadcrumb 
              items={[
                { label: "Admin", href: "#" },
                { label: "Dashboard" }
              ]}
              className="mb-4"
            />
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card hover>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-xl">👥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{mockUsers.length}</p>
                  </div>
                </div>
              </Card>
              
              <Card hover>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">📦</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Inventory Items</p>
                    <p className="text-2xl font-bold text-gray-900">{mockInventory.length}</p>
                  </div>
                </div>
              </Card>
              
              <Card hover>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-600 text-xl">📋</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{mockOrders.length}</p>
                  </div>
                </div>
              </Card>
              
              <Card hover>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-xl">💰</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${mockOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">📦</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New order #1002 received</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">👤</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New user registered</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-sm">⚠️</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Low stock alert for Bluetooth Speaker</p>
                    <p className="text-xs text-gray-500">3 hours ago</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );
      
      case "users":
        return (
          <div className="space-y-6">
            <Breadcrumb 
              items={[
                { label: "Admin", href: "#" },
                { label: "User Management" }
              ]}
              className="mb-4"
            />
            <UserTable 
              users={mockUsers}
              onEdit={handleUserEdit}
              onDelete={handleUserDelete}
              onToggleStatus={handleUserToggleStatus}
            />
          </div>
        );
      
      case "inventory":
        return (
          <div className="space-y-6">
            <Breadcrumb 
              items={[
                { label: "Admin", href: "#" },
                { label: "Inventory Management" }
              ]}
              className="mb-4"
            />
            <InventoryTable 
              items={mockInventory}
              onEdit={handleInventoryEdit}
              onDelete={handleInventoryDelete}
              onRestock={handleInventoryRestock}
            />
          </div>
        );
      
      case "orders":
        return (
          <div className="space-y-6">
            <Breadcrumb 
              items={[
                { label: "Admin", href: "#" },
                { label: "Order Management" }
              ]}
              className="mb-4"
            />
            <OrdersTable 
              orders={mockOrders}
              onUpdateStatus={handleOrderUpdateStatus}
              onViewDetails={handleOrderViewDetails}
              onCancel={handleOrderCancel}
            />
          </div>
        );
      
      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Inventory Management" userRole="admin" userName="Admin" />
      <div className="flex">
        <Sidebar 
          userRole="admin" 
          activeItem={activeSection}
          onItemClick={setActiveSection}
        />
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute role="admin">
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
