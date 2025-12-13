import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import notificationRoutes from './routes/notification.routes';
import { connectRabbitMQ, consumeEvents } from './events/consumer';
import { createNotification } from './controllers/notification.controller';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3006;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/notifications', notificationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'notification-service' });
});

// Initialize RabbitMQ and consume events
connectRabbitMQ().then(async () => {
  console.log('✅ RabbitMQ connected');
  
  // Listen for order completion events
  await consumeEvents('order.confirmed', async (message) => {
    console.log('📧 Sending notification for order:', message.orderId);
    
    try {
      await createNotification(
        message.userId,
        'Order Confirmed',
        `Your order ${message.orderId} has been confirmed and is being processed.`,
        'success'
      );
    } catch (error) {
      console.error('❌ Error creating notification:', error);
    }
  });
}).catch((err) => {
  console.error('❌ RabbitMQ connection error:', err);
});

app.listen(PORT, () => {
  console.log(`🚀 Notification Service running on port ${PORT}`);
});

