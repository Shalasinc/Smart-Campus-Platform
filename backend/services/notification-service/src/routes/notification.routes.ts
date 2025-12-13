import { Router } from 'express';
import { createNotificationHandler, getNotificationsHandler } from '../controllers/notification.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/', createNotificationHandler);
router.get('/', authenticateToken, getNotificationsHandler);

export default router;

