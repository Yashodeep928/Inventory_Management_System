import express from 'express';

import {getUserOrders,createUserOrder } from '../controllers/orderController.js';

const router = express.Router();

router.get('/get/:id', getUserOrders);
router.post('/create/:id', createUserOrder);

export default router;
