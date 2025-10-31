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
  } as const;

  const borderLeftClasses = {
    emerald: "border-l-emerald-500",
    blue: "border-l-blue-500",
    purple: "border-l-purple-500",
    orange: "border-l-orange-500",
    red: "border-l-red-500",
    yellow: "border-l-yellow-500",
  } as const;

  return (
    <div className={`glass-card hover-lift p-6 border-l-4 ${borderLeftClasses[color as keyof typeof borderLeftClasses]}`}>
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
  const bgClasses = {
    emerald: "bg-emerald-100",
    blue: "bg-blue-100",
    purple: "bg-purple-100",
    orange: "bg-orange-100",
    red: "bg-red-100",
    yellow: "bg-yellow-100",
  } as const;

  const textClasses = {
    emerald: "text-emerald-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
    red: "text-red-600",
    yellow: "text-yellow-600",
  } as const;

  return (
    <div 
      className="glass-card hover-lift p-4 cursor-pointer border border-gray-200 hover:border-emerald-300 transition-all duration-200"
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-lg ${bgClasses[color as keyof typeof bgClasses]} flex items-center justify-center`}>
          <span className={`${textClasses[color as keyof typeof textClasses]} text-lg`}>{icon}</span>
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
  const [monthlyRevenue, setMonthlyRevenue] = useState<Array<{ label: string; value: number }>>([]);
  const [completionPct, setCompletionPct] = useState<number>(0);
  const [satisfactionPct, setSatisfactionPct] = useState<number>(0);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
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

      // Compute revenue from delivered orders using price*quantity if available
      const totalRevenue = orders.reduce((sum: number, order: any) => {
        if ((order.order_status ?? '').toLowerCase() !== 'delivered') return sum;
        const price = Number(order.price ?? 0);
        const qty = Number(order.quantity ?? 1);
        return sum + price * qty;
      }, 0);

      // Build past-12-month revenue buckets
      const now = new Date();
      const buckets: Record<string, number> = {};
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        buckets[key] = 0;
      }
      orders.forEach((o: any) => {
        if ((o.order_status ?? '').toLowerCase() !== 'delivered') return;
        const d = new Date(o.order_date ?? o.created_at ?? Date.now());
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (key in buckets) {
          const price = Number(o.price ?? 0);
          const qty = Number(o.quantity ?? 1);
          buckets[key] += price * qty;
        }
      });
      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const monthly: Array<{ label: string; value: number }> = Object.keys(buckets)
        .sort((a,b) => {
          const [ay, am] = a.split('-').map(Number);
          const [by, bm] = b.split('-').map(Number);
          return ay === by ? am - bm : ay - by;
        })
        .map(k => {
          const [y, m] = k.split('-').map(Number);
          return { label: monthNames[m], value: Math.round(buckets[k]) };
        });

      // Performance metrics
      const totalCount = orders.length || 1;
      const deliveredCount = orders.filter((o: any) => (o.order_status ?? '').toLowerCase() === 'delivered').length;
      const cancelledCount = orders.filter((o: any) => (o.order_status ?? '').toLowerCase() === 'cancelled').length;
      const completion = Math.round((deliveredCount / totalCount) * 100);
      const satisfaction = Math.max(0, Math.min(100, Math.round((deliveredCount / (deliveredCount + cancelledCount || 1)) * 100)));

      setStats({
        totalOrders: orders.length,
        totalCustomers: customers.length,
        totalProducts: products.length,
        totalRevenue,
        pendingOrders: orders.filter((o: any) => o.order_status === 'pending').length,
        lowStockProducts: products.filter((p: any) => p.quantity < 10).length
      });
      setMonthlyRevenue(monthly);
      setCompletionPct(completion);
      setSatisfactionPct(satisfaction);
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
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 cursor-pointer"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Revenue Overview (dynamic) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <BarChart data={monthlyRevenue} />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Orders" value={stats.totalOrders.toString()} subtitle="All time orders" icon="📦" color="blue" trend={{ value: "+12%", isPositive: true }} />
        <StatCard title="Active Customers" value={stats.totalCustomers.toString()} subtitle="Registered users" icon="👥" color="purple" trend={{ value: "+5%", isPositive: true }} />
        <StatCard title="Total Products" value={stats.totalProducts.toString()} subtitle="In inventory" icon="📋" color="orange" />
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`} subtitle="Delivered orders" icon="💰" color="emerald" trend={{ value: "+8%", isPositive: true }} />
      </div>

      {/* Charts and Analytics (Quick Actions moved here, swapping places) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
          <div className="grid grid-cols-2 gap-6">
            <CircularProgress percentage={completionPct} color="#00A86B" />
            <CircularProgress percentage={satisfactionPct} color="#14B8A6" />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <div className="flex justify-between mb-2">
              <span>Order Completion Rate</span>
              <span className="font-medium">{completionPct}%</span>
            </div>
            <div className="flex justify-between">
              <span>Customer Satisfaction</span>
              <span className="font-medium">{satisfactionPct}%</span>
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
