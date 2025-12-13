import { Request, Response } from 'express';
import pool from '../config/database';
import { createCircuitBreaker } from '../utils/circuit-breaker';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';

// Circuit breaker for auth service
const authServiceBreaker = createCircuitBreaker(`${AUTH_SERVICE_URL}/auth/me`);

export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
) => {
  // Use circuit breaker to get user info (optional)
  try {
    await authServiceBreaker.fire();
  } catch (error) {
    console.warn('Auth service unavailable, continuing without user validation');
  }

  const result = await pool.query(
    `INSERT INTO notifications (user_id, title, message, type, read, created_at)
     VALUES ($1, $2, $3, $4, false, NOW())
     RETURNING *`,
    [userId, title, message, type]
  );

  return result.rows[0];
};

export const getNotifications = async (userId: string) => {
  const result = await pool.query(
    `SELECT * FROM notifications 
     WHERE user_id = $1 
     ORDER BY created_at DESC 
     LIMIT 50`,
    [userId]
  );

  return result.rows;
};

export const markAsRead = async (notificationId: string, userId: string) => {
  const result = await pool.query(
    `UPDATE notifications 
     SET read = true 
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [notificationId, userId]
  );

  return result.rows[0];
};

export const createNotificationHandler = async (req: Request, res: Response) => {
  try {
    const { userId, title, message, type } = req.body;

    const notification = await createNotification(userId, title, message, type);

    res.status(201).json({
      message: 'Notification created successfully',
      notification,
    });
  } catch (error: any) {
    console.error('Create notification error:', error);
    res.status(500).json({ error: error.message || 'Failed to create notification' });
  }
};

export const getNotificationsHandler = async (req: Request, res: Response) => {
  try {
    const authReq = req as any;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const notifications = await getNotifications(userId);

    res.json(notifications);
  } catch (error: any) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: error.message || 'Failed to get notifications' });
  }
};


