import express from 'express';
import {
  getUserOrders,
  createUserOrder,
  listAllOrders,
  listCustomersWithOrders,
  listAllCustomers,
  toggleCustomerStatus,
  getCustomerDetails,
  updateOrderStatus
} from '../controllers/orderController.js';

const router = express.Router();

// -------------------- User-side --------------------
router.get('/get/:id', getUserOrders);
router.post('/create/:id', createUserOrder);

// -------------------- Admin-side --------------------
router.get('/all', listAllOrders);
router.get('/customers', listCustomersWithOrders);

// Admin Customers Features
router.get('/all-customers', listAllCustomers);
router.put('/toggle-customer/:id', toggleCustomerStatus);
router.get('/customer-details/:id', getCustomerDetails);

// Admin Orders Feature
router.put('/update-status/:id', updateOrderStatus);

export default router;
