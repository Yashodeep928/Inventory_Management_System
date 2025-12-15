import CheckIcon from "~/Icons/userIcons/CheckIcon";
import TruckIcon from "~/Icons/userIcons/TruckIcon";
import ClockIcon from "~/Icons/userIcons/ClockIcon";
import { useEffect, useState } from "react";
import { useAppSelector } from "src/store/hooks";
import { io, Socket } from "socket.io-client";

interface OrderRow {
  order_id: number;
  order_status: string;
  order_date: string;
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "delivered":
      return { bg: "#ECFDF5", text: "#059669", icon: CheckIcon };
    case "shipped":
      return { bg: "#DBEAFE", text: "#2563EB", icon: TruckIcon };
    case "pending":
      return { bg: "#FEF3C7", text: "#D97706", icon: ClockIcon };
    default:
      return { bg: "#F3F4F6", text: "#6B7280", icon: ClockIcon };
  }
}

export default function Orders() {
  const user = useAppSelector((s) => s.auth.user);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (userId?: number) => {
    if (!userId && !user?.user_id) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/orders/get/${userId ?? user!.user_id}`
      );
      const data = await res.json();
      const formatted = (data.orders ?? []).map((o: OrderRow) => ({
        ...o,
        order_status: (o.order_status ?? "").toLowerCase(),
      }));
      setOrders(formatted);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.user_id) {
      setLoading(false);
      return;
    }

    fetchOrders();

    const socket: Socket = io("http://localhost:3000");

    const onOrderUpdated = () => fetchOrders(user.user_id);
    const onNotification = () => fetchOrders(user.user_id);

    socket.on("orderUpdated", onOrderUpdated);
    socket.on("notification", onNotification);

    return () => {
      socket.off("orderUpdated", onOrderUpdated);
      socket.off("notification", onNotification);
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user_id]);

  if (loading)
    return (
      <div className="p-6 text-gray-600 dark:text-gray-300">
        Loading orders...
      </div>
    );

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Order History
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                  Order ID
                </th>
                <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                  Date
                </th>
                <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {orders.map((order) => {
                const statusInfo = getStatusColor(order.order_status);
                const StatusIcon = statusInfo.icon;

                return (
                  <tr key={order.order_id}>
                    <td className="py-4 font-medium text-gray-900 dark:text-gray-100">
                      #{order.order_id}
                    </td>

                    <td className="py-4 text-gray-900 dark:text-gray-100">
                      {new Date(order.order_date).toLocaleDateString()}
                    </td>

                    <td className="py-4">
                      <div className="flex items-center space-x-1">
                        <StatusIcon />
                        <span
                          className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: statusInfo.bg,
                            color: statusInfo.text,
                          }}
                        >
                          {order.order_status.charAt(0).toUpperCase() +
                            order.order_status.slice(1)}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {orders.length === 0 && (
                <tr>
                  <td
                    className="py-4 text-sm text-gray-500 dark:text-gray-400"
                    colSpan={3}
                  >
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
