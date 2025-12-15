import { useSelector } from "react-redux";
import { type RootState } from "../../../src/store/store";

export default function OrdersStats() {
  const { orders } = useSelector((state: RootState) => state.orders);

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.order_status === "pending").length,
    confirmed: orders.filter((o) => o.order_status === "confirmed").length,
    shipped: orders.filter((o) => o.order_status === "shipped").length,
    delivered: orders.filter((o) => o.order_status === "delivered").length,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {Object.entries(orderStats).map(([key, value]) => (
        <div
          key={key}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border-l-4 border-emerald-500"
        >
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </div>
        </div>
      ))}
    </div>
  );
}
