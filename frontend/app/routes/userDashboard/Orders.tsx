import CheckIcon from "~/Icons/userIcons/CheckIcon";
import TruckIcon from "~/Icons/userIcons/TruckIcon";
import ClockIcon from "~/Icons/userIcons/ClockIcon";
import { useEffect, useState } from "react";
import { useAppSelector } from "src/store/hooks";
import { io, Socket } from "socket.io-client";

interface OrderRow { order_id: number; order_status: string; order_date: string }

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
      const res = await fetch(`http://localhost:3000/api/orders/get/${userId ?? user!.user_id}`);
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
    if (!user?.user_id) { setLoading(false); return; }
    fetchOrders();

    const socket: Socket = io("http://localhost:3000");

    const onOrderUpdated = (payload: any) => {
      // safe approach: refetch user's orders
      fetchOrders(user.user_id);
    };
    const onNotification = (_payload: any) => {
      fetchOrders(user.user_id);
    };

    socket.on("orderUpdated", onOrderUpdated);
    socket.on("notification", onNotification);

    return () => {
      socket.off("orderUpdated", onOrderUpdated);
      socket.off("notification", onNotification);
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user_id]);

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Order History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-600">Order ID</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Date</th>
                <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => {
                const statusInfo = getStatusColor(order.order_status);
                const StatusIcon = statusInfo.icon;
                return (
                  <tr key={order.order_id}>
                    <td className="py-4 font-medium text-gray-900">#{order.order_id}</td>
                    <td className="py-4 text-gray-900">{new Date(order.order_date).toLocaleDateString()}</td>
                    <td className="py-4">
                      <div className="flex items-center space-x-1">
                        <StatusIcon />
                        <span
                          className="text-sm px-2 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: statusInfo.bg, color: statusInfo.text }}
                        >
                          {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr><td className="py-4 text-sm text-gray-500" colSpan={3}>No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
