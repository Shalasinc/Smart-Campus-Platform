import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectRabbitMQ, consumeEvents } from './events/consumer';
import { OrderSaga } from './saga/orchestrator';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3007;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'saga-orchestrator' });
});

// Initialize RabbitMQ and start saga orchestration
connectRabbitMQ().then(async () => {
  console.log('✅ RabbitMQ connected');
  
  const saga = new OrderSaga();
  
  // Listen for order.created events
  await consumeEvents('order.created', async (message) => {
    console.log('🎭 Starting Saga for order:', message.orderId);
    
    try {
      await saga.execute(message);
      console.log(`✅ Saga completed successfully for order ${message.orderId}`);
    } catch (error) {
      console.error(`❌ Saga failed for order ${message.orderId}:`, error);
    }
  });
}).catch((err) => {
  console.error('❌ RabbitMQ connection error:', err);
});

app.listen(PORT, () => {
  console.log(`🚀 Saga Orchestrator running on port ${PORT}`);
});


