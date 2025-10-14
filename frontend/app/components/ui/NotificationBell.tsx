import { useEffect, useState } from "react";
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

  // Initial load can be empty; socket will push new notifications
  useEffect(() => {
    setNotifications([]);
  }, [user?.user_id]);

  // Subscribe to real-time socket events
  useEffect(() => {
    if (!socket || !user?.user_id) return;

    const handleOrderPlaced = (payload: any) => {
      // Optionally react to newly placed orders (global announcements)
    };

    const handleOrderUpdate = (payload: any) => {
      // Only show if the update belongs to this user (payload.user_id expected)
      if (payload?.user_id && payload.user_id !== user.user_id) return;
      const incoming: Notification = {
        notification_id: Date.now(), // temp id for UI
        user_id: user.user_id,
        type: 'order_update',
        title: payload?.title || 'Order Update',
        message: payload?.message || `Your order #${payload?.order_id} was updated`,
        order_id: payload?.order_id,
        is_read: false,
        created_at: new Date().toISOString(),
      };
      setNotifications((prev) => [incoming, ...prev]);
    };

    const handleNotification = (payload: any) => {
      if (payload?.user_id && payload.user_id !== user.user_id) return;
      const incoming: Notification = {
        notification_id: Date.now(),
        user_id: user.user_id,
        type: payload?.type || 'general',
        title: payload?.title || 'Notification',
        message: payload?.message || '',
        order_id: payload?.order_id,
        is_read: false,
        created_at: new Date().toISOString(),
      };
      setNotifications((prev) => [incoming, ...prev]);
    };

    socket.on('order_placed', handleOrderPlaced);
    socket.on('order_update', handleOrderUpdate);
    socket.on('notification', handleNotification);

    return () => {
      socket.off('order_placed', handleOrderPlaced);
      socket.off('order_update', handleOrderUpdate);
      socket.off('notification', handleNotification);
    };
  }, [socket, user?.user_id]);

  const markAsRead = async (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.notification_id === notificationId 
          ? { ...notif, is_read: true }
          : notif
      )
    );
  };

  const markAllAsRead = async () => {
    if (!user?.user_id) return;
    setLoading(true);
    setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })));
    setLoading(false);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-lg"
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
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium disabled:opacity-50"
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
                  onClick={() => !notification.is_read && markAsRead(notification.notification_id)}
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
