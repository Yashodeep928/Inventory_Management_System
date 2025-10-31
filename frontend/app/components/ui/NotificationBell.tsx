import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAppSelector } from "src/store/hooks";
import { useSocket } from "../../context/SocketProvider";

interface Notification {
  notification_id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  order_id?: number;
  is_read: boolean;
  created_at: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useAppSelector((s) => s.auth.user);
  const { socket, connected } = useSocket();
  const navigate = useNavigate();

  // Persist read-state per user in localStorage so refresh doesn't bring back the red dot
  const storageKey = user?.user_id ? `notif_read_keys_${user.user_id}` : undefined;
  const readSetFromStorage = (): Set<string> => {
    if (!storageKey) return new Set();
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return new Set();
      const arr = JSON.parse(raw) as string[];
      return new Set(arr);
    } catch {
      return new Set();
    }
  };
  const saveReadSetToStorage = (set: Set<string>) => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(set)));
    } catch {}
  };
  const makeKey = (n: { type?: string; order_id?: number; title?: string }) =>
    `${n.type ?? 'general'}|${n.order_id ?? 'x'}|${n.title ?? ''}`;

  // Initial load can be empty; socket will push new notifications
  useEffect(() => {
    setNotifications([]);
  }, [user?.user_id]);

  // Seed admin alerts from API (pending orders and low stock) without changing backend
  useEffect(() => {
    const loadAdminAlerts = async () => {
      if (!user || user.role?.toLowerCase() !== 'admin') return;
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch("http://localhost:3000/api/orders/all"),
          fetch("http://localhost:3000/api/products/get"),
        ]);
        const [ordersData, productsData] = await Promise.all([
          ordersRes.json(),
          productsRes.json(),
        ]);
        const orders = ordersData?.orders ?? [];
        const products = productsData?.products ?? [];

        const pendingOrders = orders.filter((o: any) => o.order_status === 'pending').length;
        const lowStockProducts = products.filter((p: any) => p.quantity < 10).length;

        const seeded: Notification[] = [];
        if (pendingOrders > 0) {
          seeded.push({
            notification_id: Date.now() + 1,
            user_id: user.user_id,
            type: 'admin_alert',
            title: 'Pending orders',
            message: `${pendingOrders} order(s) need confirmation`,
            is_read: false,
            created_at: new Date().toISOString(),
          } as Notification);
        }
        if (lowStockProducts > 0) {
          seeded.push({
            notification_id: Date.now() + 2,
            user_id: user.user_id,
            type: 'admin_alert',
            title: 'Low stock',
            message: `${lowStockProducts} product(s) low in stock`,
            is_read: false,
            created_at: new Date().toISOString(),
          } as Notification);
        }

        if (seeded.length > 0) {
          const readSet = readSetFromStorage();
          const withRead = seeded.map(s => ({
            ...s,
            is_read: readSet.has(makeKey(s)) || s.is_read,
          }));
          setNotifications((prev) => {
            // avoid duplicating on re-renders by checking titles
            const titles = new Set(prev.map(p => p.title));
            const toAdd = withRead.filter(s => !titles.has(s.title));
            return [...toAdd, ...prev];
          });
        }
      } catch (e) {
        // fail silently for UI-only feature
      }
    };
    loadAdminAlerts();
  }, [user?.user_id, user?.role]);

  // Seed user order updates from API so bell shows recent history even if socket missed
  useEffect(() => {
    const loadUserOrderNotifs = async () => {
      if (!user || user.role?.toLowerCase() === 'admin') return;
      try {
        const res = await fetch(`http://localhost:3000/api/orders/get/${user.user_id}`);
        const data = await res.json();
        const orders = (data?.orders ?? []) as Array<any>;
        const recent = orders
          .slice() // shallow copy
          .sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime())
          .slice(0, 5);

        const readSet = readSetFromStorage();
        const mapped: Notification[] = recent.map((o, idx) => {
          const status = (o.order_status ?? '').toString().toLowerCase();
          const statusTitle = status
            ? `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`
            : 'Order Update';
          const temp: Notification = {
            notification_id: Date.now() + idx,
            user_id: user.user_id,
            type: 'order_update',
            title: statusTitle,
            message: `Your order #${o.order_id} was ${status || 'updated'}`,
            order_id: o.order_id,
            is_read: false,
            created_at: o.order_date ?? new Date().toISOString(),
          } as Notification;
          return { ...temp, is_read: readSet.has(makeKey(temp)) || temp.is_read };
        });

        if (mapped.length > 0) {
          setNotifications((prev) => {
            // avoid duplicates by order_id + title
            const existingKeys = new Set(prev.map(p => `${p.order_id}-${p.title}`));
            const toAdd = mapped.filter(m => !existingKeys.has(`${m.order_id}-${m.title}`));
            return [...toAdd, ...prev];
          });
        }
      } catch {}
    };
    loadUserOrderNotifs();
  }, [user?.user_id, user?.role]);

  // Subscribe to real-time socket events
  useEffect(() => {
    if (!socket || !user?.user_id) return;

    const handleOrderPlaced = (payload: any) => {
      // Optionally react to newly placed orders (global announcements)
    };

    const handleOrderUpdate = (payload: any) => {
      // Only show if the update belongs to this user (payload.user_id expected)
      if (payload?.user_id && payload.user_id !== user.user_id) return;
      // Derive a friendly title/message if backend sends status
      const status: string | undefined = (payload?.order_status || payload?.status || '').toString().toLowerCase();
      const statusTitle = status
        ? `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`
        : (payload?.title || 'Order Update');
      const defaultMsg = payload?.order_id
        ? `Your order #${payload.order_id} was ${status || 'updated'}`
        : 'Your order was updated';
      const base: Notification = {
        notification_id: Date.now(), // temp id for UI
        user_id: user.user_id,
        type: 'order_update',
        title: statusTitle,
        message: payload?.message || defaultMsg,
        order_id: payload?.order_id,
        is_read: false,
        created_at: new Date().toISOString(),
      };
      const readSet = readSetFromStorage();
      const incoming = { ...base, is_read: readSet.has(makeKey(base)) };
      setNotifications((prev) => [incoming, ...prev]);
    };

    const handleNotification = (payload: any) => {
      if (payload?.user_id && payload.user_id !== user.user_id) return;
      const base: Notification = {
        notification_id: Date.now(),
        user_id: user.user_id,
        type: payload?.type || 'general',
        title: payload?.title || 'Notification',
        message: payload?.message || '',
        order_id: payload?.order_id,
        is_read: false,
        created_at: new Date().toISOString(),
      };
      const readSet = readSetFromStorage();
      const incoming = { ...base, is_read: readSet.has(makeKey(base)) };
      setNotifications((prev) => [incoming, ...prev]);
    };

    // Support both snake_case and camelCase events
    socket.on('order_placed', handleOrderPlaced);
    socket.on('order_update', handleOrderUpdate);
    socket.on('orderUpdated', handleOrderUpdate);
    socket.on('notification', handleNotification);

    return () => {
      socket.off('order_placed', handleOrderPlaced);
      socket.off('order_update', handleOrderUpdate);
      socket.off('orderUpdated', handleOrderUpdate);
      socket.off('notification', handleNotification);
    };
  }, [socket, user?.user_id]);

  const markAsRead = async (notificationId: number) => {
    setNotifications(prev => {
      const next = prev.map(notif =>
        notif.notification_id === notificationId ? { ...notif, is_read: true } : notif
      );
      const readSet = readSetFromStorage();
      const marked = next.find(n => n.notification_id === notificationId);
      if (marked) {
        readSet.add(makeKey(marked));
        saveReadSetToStorage(readSet);
      }
      return next;
    });
  };

  const markAllAsRead = async () => {
    if (!user?.user_id) return;
    setLoading(true);
    setNotifications(prev => {
      const next = prev.map(notif => ({ ...notif, is_read: true }));
      const readSet = readSetFromStorage();
      next.forEach(n => readSet.add(makeKey(n)));
      saveReadSetToStorage(readSet);
      return next;
    });
    setLoading(false);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-lg cursor-pointer"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5V9a6 6 0 10-12 0v3l-5 5h5m5 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={loading}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium disabled:opacity-50 cursor-pointer"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <div className="text-2xl mb-2">🔔</div>
                <div>No notifications yet</div>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.notification_id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.is_read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => {
                    if (!notification.is_read) {
                      markAsRead(notification.notification_id);
                    }
                    // Navigate based on notification content
                    if (notification.type === 'admin_alert') {
                      if (notification.title.toLowerCase().includes('pending')) {
                        navigate(user?.role?.toLowerCase() === 'admin' ? '/dashboard/orders' : '/user/orders');
                        return;
                      }
                      if (notification.title.toLowerCase().includes('low stock') || notification.title.toLowerCase().includes('low')) {
                        navigate(user?.role?.toLowerCase() === 'admin' ? '/dashboard/products' : '/user');
                        return;
                      }
                    }
                    if (notification.order_id) {
                      // Fallback: navigate to orders list (detail route not specified)
                      navigate(user?.role?.toLowerCase() === 'admin' ? '/dashboard/orders' : '/user/orders');
                    }
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                      !notification.is_read ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <span className="text-xs text-gray-500">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      {notification.order_id && (
                        <p className="text-xs text-emerald-600 mt-1">
                          Order #{notification.order_id}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
