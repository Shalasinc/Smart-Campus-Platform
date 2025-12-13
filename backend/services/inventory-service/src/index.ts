import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import inventoryRoutes from './routes/inventory.routes';
import { connectRabbitMQ, consumeEvents } from './events/consumer';
import { reserveInventory, releaseInventoryHandler } from './controllers/inventory.controller';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/inventory', inventoryRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'inventory-service' });
});

// Initialize RabbitMQ and consume events
connectRabbitMQ().then(async () => {
  console.log('✅ RabbitMQ connected');
  
  // Listen for order.created events
  await consumeEvents('order.created', async (message) => {
    console.log('📦 Order created event received:', message);
    const { orderId, items } = message;
    
    try {
      // Reserve inventory for each item
      for (const item of items) {
        await reserveInventory(item.productId, item.quantity, orderId);
      }
      
      console.log(`✅ Inventory reserved for order ${orderId}`);
    } catch (error) {
      console.error(`❌ Error reserving inventory for order ${orderId}:`, error);
      // Publish compensation event
    }
  });
}).catch((err) => {
  console.error('❌ RabbitMQ connection error:', err);
});

app.listen(PORT, () => {
  console.log(`🚀 Inventory Service running on port ${PORT}`);
});

