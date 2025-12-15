import { useAppSelector } from "src/store/hooks";
import { OrderCard } from "./OrderCard";
import { Link } from "react-router";

export function RecentOrders() {
  const { list: orders, loading } = useAppSelector((s) => s.userOrders);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <span className="mr-2">📋</span>
        Recent Orders
      </h3>

      {loading ? (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          Loading orders...
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-3">
          {orders.slice(0, 5).map((order) => (
            <OrderCard key={order.order_id} order={order} />
          ))}

          {orders.length > 5 && (
            <div className="text-center pt-3">
              <Link
                to="/user/orders"
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium"
              >
                View All Orders →
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-500 dark:text-gray-400 text-lg">No orders yet</div>
          <div className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Your orders will appear here.
          </div>
        </div>
      )}
    </div>
  );
}
