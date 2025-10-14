import express from 'express';
import { addProduct, updateProduct, deactivateProduct, listProducts, getProductById } from '../controllers/productController.js';
const router = express.Router();

router.post('/add', addProduct);
router.put('/update/:id', updateProduct);
router.delete('/delete/:id', deactivateProduct);
router.get('/get', listProducts);
router.get('/:id', getProductById);

export default router;
