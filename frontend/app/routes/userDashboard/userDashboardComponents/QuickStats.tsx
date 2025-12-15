import { useAppSelector } from "src/store/hooks";

export function QuickStats() {
  const orders = useAppSelector((s) => s.userOrders.list);

  const total = orders.length;
  const pending = orders.filter(o => o.order_status === "pending").length;
  const delivered = orders.filter(o => o.order_status === "delivered").length;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <span className="mr-2">📊</span>
        Quick Stats
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Total Orders</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">{total}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Pending</span>
          <span className="font-semibold text-yellow-600 dark:text-yellow-400">{pending}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Delivered</span>
          <span className="font-semibold text-green-600 dark:text-green-400">{delivered}</span>
        </div>
      </div>
    </div>
  );
}
