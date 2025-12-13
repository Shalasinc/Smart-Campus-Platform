import { Router } from 'express';
import { processPaymentHandler, refundPaymentHandler } from '../controllers/payment.controller';

const router = Router();

router.post('/process', processPaymentHandler);
router.post('/refund', refundPaymentHandler);

export default router;

