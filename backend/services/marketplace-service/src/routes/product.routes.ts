import { Router } from 'express';
import { getProducts, getProduct, createProductHandler } from '../controllers/product.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', authenticateToken, createProductHandler);

export default router;

