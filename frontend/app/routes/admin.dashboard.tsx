import { useState } from "react";
import ProtectedRoute from "~/components/ProtectedRoute";
import { useLogout } from "~/components/ProtectedRoute";

// SVG Icons as React Components
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8 7 4-4 4 4"/>
  </svg>
);

const ProductsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
  </svg>
);

const CustomersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
  </svg>
);

const OrdersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
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

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
  </svg>
);

const EyeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
  </svg>
);

const ShoppingBagIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
  </svg>
);

const DollarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
  </svg>
);

const CheckIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

// Chart Component
const BarChart = () => {
  const data = [
    { month: "Jan", height: 120 },
    { month: "Feb", height: 90 },
    { month: "Mar", height: 150 },
    { month: "Apr", height: 110 },
    { month: "May", height: 180 },
    { month: "Jun", height: 140 },
    { month: "Jul", height: 200 },
    { month: "Aug", height: 160 },
    { month: "Sep", height: 190 },
    { month: "Oct", height: 170 },
    { month: "Nov", height: 130 },
    { month: "Dec", height: 210 },
  ];

  return (
    <div className="h-64 flex items-end justify-between space-x-2">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center space-y-2">
          <div
            className="w-8 rounded-t"
            style={{
              height: `${item.height}px`,
              background: "linear-gradient(to top, #00A86B, #1FD6A6)",
            }}
          />
          <span className="text-xs text-gray-500">{item.month}</span>
        </div>
      ))}
    </div>
  );
};

// Circular Progress Component
const CircularProgress = ({ percentage, color }: { percentage: number; color: string }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-20 h-20 mx-auto mb-2">
      <svg className="transform -rotate-90 w-20 h-20">
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="7"
          fill="transparent"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke={color}
          strokeWidth="7"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-gray-900">{percentage}%</span>
      </div>
    </div>
  );
};

function AdminDashboardContent() {
  const handleLogout = useLogout();

  const topProducts = [
    {
      name: "Samsung S20 128 GB",
      description: "Pink - 50 orders",
      inventory: 700,
      sale: "$1,000.60",
      price: "$1,300.92",
      today: "$17,000.92",
      gradient: "linear-gradient(135deg, #FFB6C1, #FFC0CB)",
      icon: "📱",
    },
    {
      name: "Samsung S21 256 GB",
      description: "Black - 25 orders",
      inventory: 200,
      sale: "$1,200.60",
      price: "$1,500.92",
      today: "$12,000.82",
      gradient: "linear-gradient(135deg, #374151, #4B5563)",
      icon: "📱",
    },
  ];

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
            <h1 className="text-lg font-semibold text-gray-800">Inventory Management</h1>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            <a href="#" className="flex items-center space-x-3 px-4 py-3 font-medium rounded-lg" style={{ backgroundColor: "#E6F7F1", color: "#00A86B" }}>
              <DashboardIcon />
              <span>Dashboard</span>
            </a>
            
            <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <ProductsIcon />
              <span>Products</span>
            </a>
            
            <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <CustomersIcon />
              <span>Customers</span>
            </a>
            
            <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <OrdersIcon />
              <span>Orders</span>
            </a>
            
            <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <SettingsIcon />
              <span>Settings</span>
            </a>
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
                <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
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
                      <span className="text-white text-sm font-medium">A</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Revenue Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Total Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Revenue</h3>
                <div className="flex items-end space-x-4">
                  <span className="text-3xl font-bold text-gray-900">$980,273.845</span>
                  <div className="mb-1">
                    <span className="inline-flex items-center px-3 py-1 rounded text-sm font-medium text-white cursor-pointer" style={{ backgroundColor: "#00A86B" }}>
                      THIS YEAR
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>
              </div>
              
              <BarChart />
            </div>

            {/* Customer Metrics */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Customers</h3>
              <div className="grid grid-cols-2 gap-6">
                {/* Active Customers */}
                <div className="text-center">
                  <CircularProgress percentage={85} color="#00A86B" />
                  <p className="text-xs text-gray-600 text-center">Active Customers</p>
                </div>

                {/* Repeat Customers */}
                <div className="text-center">
                  <CircularProgress percentage={66} color="#14B8A6" />
                  <p className="text-xs text-gray-600 text-center">Repeat Customers</p>
                </div>

                {/* Customer Growth */}
                <div className="text-center">
                  <CircularProgress percentage={90} color="#0D9488" />
                  <p className="text-xs text-gray-600 text-center">Customer Growth</p>
                </div>

                {/* Revenue Top Customer */}
                <div className="text-center">
                  <CircularProgress percentage={30} color="#134E4A" />
                  <p className="text-xs text-gray-600 text-center">Revenue Top Customer</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Visits</p>
                  <p className="text-2xl font-bold text-gray-900">10.8m</p>
                </div>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#E6F7F1" }}>
                  <EyeIcon />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900">100,345</p>
                </div>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#E6F7F1" }}>
                  <ShoppingBagIcon />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Made</p>
                  <p className="text-2xl font-bold text-gray-900">$200k</p>
                </div>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#E6F7F1" }}>
                  <DollarIcon />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Orders Completed</p>
                  <p className="text-2xl font-bold text-gray-900">98,771</p>
                </div>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#E6F7F1" }}>
                  <CheckIcon />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Products */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Products</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Product</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Inventory</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Sale</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Price</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Today</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {topProducts.map((product, index) => (
                      <tr key={index}>
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg flex-shrink-0" style={{ background: product.gradient }}>
                              <div className="w-full h-full rounded-lg flex items-center justify-center">
                                <div className="w-6 h-8 bg-gray-800 rounded-sm"></div>
                              </div>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-gray-900 font-medium">{product.inventory}</td>
                        <td className="py-4 text-gray-900 font-medium">{product.sale}</td>
                        <td className="py-4 text-gray-900 font-medium">{product.price}</td>
                        <td className="py-4 font-semibold" style={{ color: "#00A86B" }}>{product.today}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Stats Overview</h3>
              <p className="text-sm text-gray-500 mb-6">Information about site visits</p>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Women</span>
                    <span className="text-sm font-semibold text-gray-900">63%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full" style={{ width: "63%", backgroundColor: "#134E4A" }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Men</span>
                    <span className="text-sm font-semibold text-gray-900">88%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full" style={{ width: "88%", backgroundColor: "#0D9488" }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Kids</span>
                    <span className="text-sm font-semibold text-gray-900">38%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full" style={{ width: "38%", backgroundColor: "#00A86B" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
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
