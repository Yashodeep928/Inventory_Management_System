import { BarChart } from "~/components/ui";
import CircularProgress from "~/components/ui/CircularProgress";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface DashboardStats {
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
}

function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = "emerald",
  trend 
}: { 
  title: string; 
  value: string; 
  subtitle: string; 
  icon?: string;
  color?: string;
  trend?: { value: string; isPositive: boolean };
}) {
  const colorClasses = {
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    orange: "bg-orange-50 border-orange-200 text-orange-700",
    red: "bg-red-50 border-red-200 text-red-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700"
  };

  return (
    <div className={`glass-card hover-lift p-6 border-l-4 border-l-${color}-500`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-600 mb-1">{title}</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
          <div className="text-sm text-gray-500">{subtitle}</div>
          {trend && (
            <div className={`text-xs mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↗' : '↘'} {trend.value}
            </div>
          )}
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center`}>
            <span className="text-2xl">{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickActionCard({ title, description, onClick, icon, color = "emerald" }: {
  title: string;
  description: string;
  onClick: () => void;
  icon: string;
  color?: string;
}) {
  return (
    <div 
      className="glass-card hover-lift p-4 cursor-pointer border border-gray-200 hover:border-emerald-300 transition-all duration-200"
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-lg bg-${color}-100 flex items-center justify-center`}>
          <span className={`text-${color}-600 text-lg`}>{icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}

function AdminDashboardContent() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [ordersRes, customersRes, productsRes] = await Promise.all([
        fetch("http://localhost:3000/api/orders/all"),
        fetch("http://localhost:3000/api/orders/all-customers"),
        fetch("http://localhost:3000/api/products/get")
      ]);

      const [ordersData, customersData, productsData] = await Promise.all([
        ordersRes.json(),
        customersRes.json(),
        productsRes.json()
      ]);

      const orders = ordersData.orders || [];
      const customers = customersData.customers || [];
      const products = productsData.products || [];

      const totalRevenue = orders.reduce((sum: number, order: any) => {
        if (order.order_status === 'delivered') return sum + 100;
        return sum;
      }, 0);

      setStats({
        totalOrders: orders.length,
        totalCustomers: customers.length,
        totalProducts: products.length,
        totalRevenue,
        pendingOrders: orders.filter((o: any) => o.order_status === 'pending').length,
        lowStockProducts: products.filter((p: any) => p.quantity < 10).length
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your inventory.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            onClick={fetchDashboardStats}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Orders" value={stats.totalOrders.toString()} subtitle="All time orders" icon="📦" color="blue" trend={{ value: "+12%", isPositive: true }} />
        <StatCard title="Active Customers" value={stats.totalCustomers.toString()} subtitle="Registered users" icon="👥" color="purple" trend={{ value: "+5%", isPositive: true }} />
        <StatCard title="Total Products" value={stats.totalProducts.toString()} subtitle="In inventory" icon="📋" color="orange" />
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} subtitle="This month" icon="💰" color="emerald" trend={{ value: "+8%", isPositive: true }} />
      </div>

      {/* Alerts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">⚠️</span>
            Alerts & Notifications
          </h3>
          <div className="space-y-3">
            {stats.pendingOrders > 0 && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div>
                  <div className="font-medium text-yellow-800">{stats.pendingOrders} pending orders</div>
                  <div className="text-sm text-yellow-600">Need admin confirmation</div>
                </div>
                <button 
                  onClick={() => navigate("/dashboard/orders")}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  View →
                </button>
              </div>
            )}
            {stats.lowStockProducts > 0 && (
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div>
                  <div className="font-medium text-red-800">{stats.lowStockProducts} products low in stock</div>
                  <div className="text-sm text-red-600">Consider restocking</div>
                </div>
                <button 
                  onClick={() => navigate("/dashboard/products")}
                  className="text-red-600 hover:text-red-800"
                >
                  View →
                </button>
              </div>
            )}
            {stats.pendingOrders === 0 && stats.lowStockProducts === 0 && (
              <div className="text-center py-4 text-gray-500">
                <div className="text-2xl mb-2">✅</div>
                <div>All good! No alerts at the moment.</div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">⚡</span>
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <QuickActionCard title="Add Product" description="Add new inventory item" icon="➕" color="emerald" onClick={() => navigate("/dashboard/products")} />
            <QuickActionCard title="View Orders" description="Manage customer orders" icon="📦" color="blue" onClick={() => navigate("/dashboard/orders")} />
            <QuickActionCard title="Customers" description="View customer list" icon="👥" color="purple" onClick={() => navigate("/dashboard/customers")} />
            <QuickActionCard title="Settings" description="System configuration" icon="⚙️" color="orange" onClick={() => navigate("/dashboard/settings")} />
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <BarChart />
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
          <div className="grid grid-cols-2 gap-6">
            <CircularProgress percentage={85} color="#00A86B" />
            <CircularProgress percentage={66} color="#14B8A6" />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <div className="flex justify-between mb-2">
              <span>Order Completion Rate</span>
              <span className="font-medium">85%</span>
            </div>
            <div className="flex justify-between">
              <span>Customer Satisfaction</span>
              <span className="font-medium">66%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return <AdminDashboardContent />;
}
