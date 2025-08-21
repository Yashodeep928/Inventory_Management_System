import express from 'express';
import { registeruser,login } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registeruser);
router.post('/login', login);

export default router;
