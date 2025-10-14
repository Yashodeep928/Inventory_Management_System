// backend/config/socketConfig.js
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io;
const connectedUsers = new Map(); // 🧠 To track users by their ID

const setupSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', (socket) => {
    console.log('🟢 A user connected:', socket.id);

    // Authenticate via JWT
    const token = socket.handshake.query.token;
    if (!token) {
      console.log('❌ No token, disconnecting:', socket.id);
      socket.disconnect();
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;

      // Save connected user
      connectedUsers.set(decoded.user_id, socket.id);
      console.log(`✅ User ${decoded.user_id} connected (socket: ${socket.id})`);
    } catch (err) {
      console.log('❌ Invalid token, disconnecting:', socket.id);
      socket.disconnect();
      return;
    }

    // Listen for client events
    socket.on('new_order', (data) => {
      console.log('🛒 New order placed:', data);
      io.emit('order_placed', data); // broadcast to all admins
    });

    socket.on('disconnect', () => {
      console.log('🔴 User disconnected:', socket.id);
      for (let [userId, sockId] of connectedUsers.entries()) {
        if (sockId === socket.id) {
          connectedUsers.delete(userId);
          break;
        }
      }
    });
  });

  return io;
};

export { setupSocket, io, connectedUsers };
