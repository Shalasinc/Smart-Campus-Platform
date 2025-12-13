import { Router } from 'express';
import { createOrderHandler } from '../controllers/order.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateToken, createOrderHandler);

export default router;


