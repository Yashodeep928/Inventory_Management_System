import { type Customer } from "../../../src/store/customerSlice";

interface Props {
  customers: Customer[];
}

export default function CustomerStats({ customers }: Props) {
  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === "active").length,
    inactive: customers.filter(c => c.status === "inactive").length,
    totalOrders: customers.reduce(
      (sum, c) => sum + Number(c.orders_count ?? 0),
      0
    ),
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="glass-card p-4 border-l-4 border-l-blue-500 bg-white dark:bg-gray-800">
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {stats.total}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Total Customers
        </div>
      </div>

      <div className="glass-card p-4 border-l-4 border-l-green-500 bg-white dark:bg-gray-800">
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {stats.active}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Active Customers
        </div>
      </div>

      <div className="glass-card p-4 border-l-4 border-l-red-500 bg-white dark:bg-gray-800">
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {stats.inactive}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Inactive Customers
        </div>
      </div>

      <div className="glass-card p-4 border-l-4 border-l-purple-500 bg-white dark:bg-gray-800">
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {stats.totalOrders}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Total Orders
        </div>
      </div>
    </div>
  );
}
