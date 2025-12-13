import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import paymentRoutes from './routes/payment.routes';
import { connectRabbitMQ, consumeEvents } from './events/consumer';
import { processPayment, refundPayment } from './controllers/payment.controller';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/payments', paymentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'payment-service' });
});

// Initialize RabbitMQ and consume events
connectRabbitMQ().then(async () => {
  console.log('✅ RabbitMQ connected');
  
  // Listen for inventory.reserved events
  await consumeEvents('inventory.reserved', async (message) => {
    console.log('💰 Processing payment for order:', message.orderId);
    
    try {
      await processPayment(message.orderId, message.totalAmount || 100);
      console.log(`✅ Payment processed for order ${message.orderId}`);
    } catch (error) {
      console.error(`❌ Error processing payment for order ${message.orderId}:`, error);
    }
  });
}).catch((err) => {
  console.error('❌ RabbitMQ connection error:', err);
});

app.listen(PORT, () => {
  console.log(`🚀 Payment Service running on port ${PORT}`);
});


