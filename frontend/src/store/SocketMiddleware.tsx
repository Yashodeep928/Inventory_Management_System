import { io, Socket } from "socket.io-client";
import { fetchOrders } from "./userOrderThunks";

let socket: Socket | null = null;

export const socketMiddleware = (store: { dispatch: any }) => (next: any) => (action: any) => {
  const result = next(action);

  // Start socket connection when user logs in
  if (action.type === "auth/setUser") {
    const userId = action.payload?.user_id;
    if (userId && !socket) {
      socket = io("http://localhost:3000");

      socket.on("orderUpdated", () => {
        store.dispatch(fetchOrders(userId));
      });

      socket.on("notification", () => {
        store.dispatch(fetchOrders(userId));
      });
    }
  }

  // Clean up socket on logout
  if (action.type === "auth/logout" && socket) {
    socket.disconnect();
    socket = null;
  }

  return result;
};
