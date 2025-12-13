import { Router } from 'express';
import {
  createBookingHandler,
  getBookingsHandler,
  getBooking,
  cancelBookingHandler,
  validateCreateBooking,
} from '../controllers/booking.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateToken, validateCreateBooking, createBookingHandler);
router.get('/', authenticateToken, getBookingsHandler);
router.get('/:id', authenticateToken, getBooking);
router.delete('/:id', authenticateToken, cancelBookingHandler);

export default router;

