import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Service URLs
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';
const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL || 'http://booking-service:3002';
const MARKETPLACE_SERVICE_URL = process.env.MARKETPLACE_SERVICE_URL || 'http://marketplace-service:3003';
const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || 'http://inventory-service:3004';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3005';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3006';

// Proxy Middleware Options
const proxyOptions = {
  changeOrigin: true,
  onError: (err: any, req: any, res: any) => {
    console.error('Proxy error:', err);
    res.status(503).json({ error: 'Service unavailable' });
  },
  onProxyReq: (proxyReq: any, req: any) => {
    // Forward authorization header
    if (req.headers.authorization) {
      proxyReq.setHeader('authorization', req.headers.authorization);
    }
  },
};

// Routes
app.use('/api/auth', createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  ...proxyOptions,
}));

app.use('/api/bookings', createProxyMiddleware({
  target: BOOKING_SERVICE_URL,
  ...proxyOptions,
}));

app.use('/api/rooms', createProxyMiddleware({
  target: BOOKING_SERVICE_URL,
  ...proxyOptions,
}));

app.use('/api/marketplace', createProxyMiddleware({
  target: MARKETPLACE_SERVICE_URL,
  ...proxyOptions,
}));

app.use('/api/inventory', createProxyMiddleware({
  target: INVENTORY_SERVICE_URL,
  ...proxyOptions,
}));

app.use('/api/payments', createProxyMiddleware({
  target: PAYMENT_SERVICE_URL,
  ...proxyOptions,
}));

app.use('/api/notifications', createProxyMiddleware({
  target: NOTIFICATION_SERVICE_URL,
  ...proxyOptions,
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});

