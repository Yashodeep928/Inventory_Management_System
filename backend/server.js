import express from 'express';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import endpoints from './config/endpoints.js';
import cors from 'cors';
import { setupSocket } from './config/socketConfig.js';

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register API routes
app.use(endpoints.users, userRoutes);
app.use(endpoints.products, productRoutes);
app.use(endpoints.orders, orderRoutes);
app.use(endpoints.payments, paymentRoutes);

// Start server first
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// Initialize Socket.io **after** server is created
const io = setupSocket(server);
export { io };
