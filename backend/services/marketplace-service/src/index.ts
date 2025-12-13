import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import { connectRabbitMQ, publishEvent } from './events/publisher';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'marketplace-service' });
});

// Initialize RabbitMQ connection
connectRabbitMQ().then(() => {
  console.log('✅ RabbitMQ connected');
}).catch((err) => {
  console.error('❌ RabbitMQ connection error:', err);
});

app.listen(PORT, () => {
  console.log(`🚀 Marketplace Service running on port ${PORT}`);
});

export { publishEvent };

