import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../src/store/store";
import { fetchDashboardData } from "../../../src/store/dashboardSlice";
import StatCard from "../adminComponents/StatCard";
import QuickActionCard from "../adminComponents/QuickActionCard";
import RevenueChart from "../adminComponents/RevenueChart";
import PerformanceMetrics from "../adminComponents/PerformanceMetrics";
import { useNavigate } from "react-router";

export default function AdminDashboardContent() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { stats, loading } = useSelector((state: RootState) => state.dashboard);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setError(null);
      await dispatch(fetchDashboardData()).unwrap();
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-600 dark:text-red-400">
        <p>{error}</p>
        <button
          onClick={loadData}
          className="mt-4 bg-emerald-600 dark:bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your inventory.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={loadData}
            className="bg-emerald-600 dark:bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors duration-200 cursor-pointer"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Revenue Chart */}
      <RevenueChart />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders?.toString() ?? "0"}
          subtitle="All time orders"
          icon="📦"
          color="blue"
          trend={{ value: "+12%", isPositive: true }}
        />
        <StatCard
          title="Active Customers"
          value={stats?.totalCustomers?.toString() ?? "0"}
          subtitle="Registered users"
          icon="👥"
          color="purple"
          trend={{ value: "+5%", isPositive: true }}
        />
        <StatCard
          title="Total Products"
          value={stats?.totalProducts?.toString() ?? "0"}
          subtitle="In inventory"
          icon="📋"
          color="orange"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats?.totalRevenue?.toLocaleString("en-IN") ?? "0"}`}
          subtitle="Delivered orders"
          icon="💰"
          color="emerald"
          trend={{ value: "+8%", isPositive: true }}
        />
      </div>

      {/* Quick Actions + Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Quick Actions wrapper */}
  <div className="glass-card p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
      <span className="mr-2">⚡</span> Quick Actions
    </h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <QuickActionCard
        title="Add Product"
        description="Add new inventory item"
        icon="➕"
        color="emerald"
        onClick={() => navigate("/dashboard/products")}
      />
      <QuickActionCard
        title="View Orders"
        description="Manage customer orders"
        icon="📦"
        color="blue"
        onClick={() => navigate("/dashboard/orders")}
      />
      <QuickActionCard
        title="Customers"
        description="View customer list"
        icon="👥"
        color="purple"
        onClick={() => navigate("/dashboard/customers")}
      />
      <QuickActionCard
        title="Settings"
        description="System configuration"
        icon="⚙️"
        color="orange"
        onClick={() => navigate("/dashboard/settings")}
      />
    </div>
  </div>

  {/* Performance Metrics wrapper */}
  <div className="glass-card p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
    <PerformanceMetrics />
  </div>
</div>

    </div>
  );
}
