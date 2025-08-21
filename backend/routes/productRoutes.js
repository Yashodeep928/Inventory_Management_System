import express from 'express';
import { addProduct, updateProduct, deactivateProduct } from '../controllers/productController.js';
const router = express.Router();

router.post('/add', addProduct);
router.put('/update/:id', updateProduct);
router.delete('/delete/:id', deactivateProduct);

export default router;
