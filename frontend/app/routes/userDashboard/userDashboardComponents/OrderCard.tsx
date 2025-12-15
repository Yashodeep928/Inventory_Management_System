import type { OrderRow } from "../utils/types";
import { getStatusColor } from "../utils/getStatusColor";

export function OrderCard({ order }: { order: OrderRow }) {
  const { bg, text, icon: StatusIcon } = getStatusColor(order.order_status);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Order #{order.order_id}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(order.order_date).toLocaleDateString()} at{" "}
            {new Date(order.order_date).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <StatusIcon />
          <span
            className="px-3 py-1 rounded-full text-xs font-medium border"
            style={{ backgroundColor: bg, color: text }}
          >
            {order.order_status.charAt(0).toUpperCase() +
              order.order_status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
