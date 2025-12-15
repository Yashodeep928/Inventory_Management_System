import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../src/store/store";
import { type Order, updateOrderStatusAsync } from "../../../src/store/orderSlice";

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function OrdersTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, search, filterStatus, currentPage, loading } = useSelector(
    (state: RootState) => state.orders
  );

  const pageSize = 10;

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "all" || order.order_status === filterStatus;

    const matchesSearch =
      order.name.toLowerCase().includes(search.toLowerCase()) ||
      order.email.toLowerCase().includes(search.toLowerCase()) ||
      order.order_id.toString().includes(search);

    return matchesStatus && matchesSearch;
  });

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-700";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700";
    }
  };

  const handleStatusChange = (orderId: number, newStatus: string) => {
    dispatch(updateOrderStatusAsync({ orderId, status: newStatus }));
  };

  if (paginatedOrders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-300 text-lg">
        No orders found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <table className="w-full table-auto border-collapse">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-200">
              Order ID
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-200">
              Customer
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-200">
              Email
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-200">
              Date
            </th>
            <th className="py-3 px-4 text-center text-sm font-medium text-gray-600 dark:text-gray-200">
              Status
            </th>
            <th className="py-3 px-4 text-center text-sm font-medium text-gray-600 dark:text-gray-200">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {paginatedOrders.map((order: Order) => (
            <tr
              key={order.order_id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="py-4 px-4 font-medium text-gray-800 dark:text-gray-100">
                #{order.order_id}
              </td>

              <td className="py-4 px-4 text-gray-800 dark:text-gray-100">
                {order.name}
              </td>

              <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-300">
                {order.email}
              </td>

              <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-300">
                {new Date(order.order_date).toLocaleDateString()}
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(order.order_date).toLocaleTimeString()}
                </div>
              </td>

              <td className="py-4 px-4 text-center">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                    order.order_status
                  )}`}
                >
                  {order.order_status.charAt(0).toUpperCase() +
                    order.order_status.slice(1)}
                </span>
              </td>

              <td className="py-4 px-4 text-center">
                <select
                  value={order.order_status}
                  disabled={loading}
                  onChange={(e) =>
                    handleStatusChange(order.order_id, e.target.value)
                  }
                  className={`text-sm border rounded-lg px-3 py-1.5 bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-200 ${getStatusColor(
                    order.order_status
                  )}`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
