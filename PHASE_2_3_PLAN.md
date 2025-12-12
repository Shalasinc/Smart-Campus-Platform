# برنامه مرحله‌ای فاز 2 و 3

## 🎯 فاز 2: ساخت هسته اولیه (هفته‌های 3-4)

### مرحله 1: آماده‌سازی محیط (روز 1-2)

#### 1.1 ساختار پروژه Backend
```
backend/
├── services/
│   ├── auth-service/
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── booking-service/
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   └── api-gateway/
│       ├── src/
│       ├── Dockerfile
│       └── package.json
└── docker-compose.yml
```

#### 1.2 انتخاب Stack
- **پیشنهاد:** Node.js + Express (ساده و سریع)
- **گزینه دیگر:** Python + FastAPI
- **Database:** PostgreSQL (می‌توانید از Supabase استفاده کنید)

---

### مرحله 2: Auth Service (روز 3-5)

#### 2.1 ساخت Auth Service
```bash
mkdir -p backend/services/auth-service
cd backend/services/auth-service
npm init -y
npm install express jsonwebtoken bcryptjs dotenv
npm install -D @types/express @types/node typescript ts-node nodemon
```

#### 2.2 ساختار Auth Service
```
auth-service/
├── src/
│   ├── index.ts          # Entry point
│   ├── routes/
│   │   └── auth.routes.ts
│   ├── controllers/
│   │   └── auth.controller.ts
│   ├── middleware/
│   │   └── auth.middleware.ts
│   ├── models/
│   │   └── user.model.ts
│   └── config/
│       └── database.ts
├── Dockerfile
└── package.json
```

#### 2.3 API Endpoints
- `POST /auth/register` - ثبت‌نام
- `POST /auth/login` - ورود
- `POST /auth/refresh` - Refresh Token
- `GET /auth/me` - اطلاعات کاربر فعلی
- `POST /auth/logout` - خروج

#### 2.4 Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

---

### مرحله 3: Booking Service (روز 6-8)

#### 3.1 ساخت Booking Service
```bash
mkdir -p backend/services/booking-service
cd backend/services/booking-service
npm init -y
npm install express pg dotenv
npm install -D @types/express @types/node typescript ts-node nodemon
```

#### 3.2 ساختار Booking Service
```
booking-service/
├── src/
│   ├── index.ts
│   ├── routes/
│   │   └── booking.routes.ts
│   ├── controllers/
│   │   ├── room.controller.ts
│   │   └── booking.controller.ts
│   ├── models/
│   │   ├── room.model.ts
│   │   └── booking.model.ts
│   ├── services/
│   │   └── booking.service.ts  # Logic جلوگیری از Overbooking
│   └── config/
│       └── database.ts
├── Dockerfile
└── package.json
```

#### 3.3 API Endpoints
- `GET /rooms` - لیست اتاق‌ها
- `GET /rooms/:id` - جزئیات اتاق
- `POST /bookings` - ایجاد رزرو
- `GET /bookings` - لیست رزروها
- `GET /bookings/:id` - جزئیات رزرو
- `DELETE /bookings/:id` - لغو رزرو

#### 3.4 Logic جلوگیری از Overbooking
```typescript
// booking.service.ts
async checkAvailability(roomId: string, startTime: Date, endTime: Date) {
  // چک کردن رزروهای موجود در بازه زمانی
  const conflictingBookings = await db.query(
    `SELECT * FROM bookings 
     WHERE room_id = $1 
     AND status = 'confirmed'
     AND (
       (start_time <= $2 AND end_time > $2) OR
       (start_time < $3 AND end_time >= $3) OR
       (start_time >= $2 AND end_time <= $3)
     )`,
    [roomId, startTime, endTime]
  );
  
  return conflictingBookings.length === 0;
}
```

---

### مرحله 4: API Gateway (روز 9-10)

#### 4.1 استفاده از Express Gateway یا Kong

**گزینه 1: Express Gateway (ساده‌تر)**
```bash
npm install -g express-gateway
eg gateway create api-gateway
```

**گزینه 2: Nginx (قدرتمندتر)**
```nginx
upstream auth_service {
    server auth-service:3001;
}

upstream booking_service {
    server booking-service:3002;
}

server {
    listen 80;
    
    location /api/auth {
        proxy_pass http://auth_service;
    }
    
    location /api/bookings {
        proxy_pass http://booking_service;
    }
}
```

**گزینه 3: Express Gateway ساده (پیشنهادی)**
```typescript
// api-gateway/src/index.ts
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// Auth Service Proxy
app.use('/api/auth', createProxyMiddleware({
  target: 'http://auth-service:3001',
  changeOrigin: true,
}));

// Booking Service Proxy
app.use('/api/bookings', createProxyMiddleware({
  target: 'http://booking-service:3002',
  changeOrigin: true,
}));

app.listen(3000);
```

---

### مرحله 5: docker-compose.yml (روز 11)

#### 5.1 به‌روزرسانی docker-compose.yml
```yaml
version: '3.8'

services:
  # Database
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: smartcampus
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - app-network

  # Auth Service
  auth-service:
    build:
      context: ./backend/services/auth-service
      dockerfile: Dockerfile
    environment:
      PORT: 3001
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/smartcampus
      JWT_SECRET: your-secret-key
    ports:
      - "3001:3001"
    depends_on:
      - postgres
    networks:
      - app-network

  # Booking Service
  booking-service:
    build:
      context: ./backend/services/booking-service
      dockerfile: Dockerfile
    environment:
      PORT: 3002
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/smartcampus
    ports:
      - "3002:3002"
    depends_on:
      - postgres
    networks:
      - app-network

  # API Gateway
  api-gateway:
    build:
      context: ./backend/services/api-gateway
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - auth-service
      - booking-service
    networks:
      - app-network

  # Frontend
  frontend:
    build:
      context: .
      dockerfile: frontend/Dockerfile
    ports:
      - "8080:80"
    depends_on:
      - api-gateway
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

---

### مرحله 6: Integration و Testing (روز 12-14)

#### 6.1 به‌روزرسانی Frontend
- تغییر API calls از Supabase به API Gateway
- استفاده از JWT Token در Header
- Error Handling

#### 6.2 تست End-to-End
- [ ] ثبت‌نام کاربر
- [ ] ورود به سیستم
- [ ] مشاهده لیست اتاق‌ها
- [ ] رزرو اتاق
- [ ] جلوگیری از Overbooking

#### 6.3 ساخت ویدیو 3 دقیقه‌ای
- نمایش ورود
- نمایش لیست اتاق‌ها
- نمایش رزرو موفق

---

## 🚀 فاز 3: الگوهای پیشرفته (هفته‌های 5-6)

### مرحله 1: RabbitMQ Setup (روز 1-2)

#### 1.1 اضافه کردن RabbitMQ به docker-compose.yml
```yaml
rabbitmq:
  image: rabbitmq:3-management-alpine
  ports:
    - "5672:5672"    # AMQP port
    - "15672:15672"  # Management UI
  environment:
    RABBITMQ_DEFAULT_USER: admin
    RABBITMQ_DEFAULT_PASS: admin
  networks:
    - app-network
```

#### 1.2 نصب Client Library
```bash
# در هر سرویس
npm install amqplib
```

#### 1.3 ساختار Event-Driven
```
events/
├── publisher.ts      # ارسال Event
├── consumer.ts       # دریافت Event
└── types.ts          # نوع Eventها
```

---

### مرحله 2: Marketplace Service (روز 3-5)

#### 2.1 ساخت Marketplace Service
```
marketplace-service/
├── src/
│   ├── index.ts
│   ├── routes/
│   │   └── marketplace.routes.ts
│   ├── controllers/
│   │   ├── product.controller.ts
│   │   └── order.controller.ts
│   ├── models/
│   │   ├── product.model.ts
│   │   └── order.model.ts
│   └── events/
│       ├── publisher.ts
│       └── consumer.ts
```

#### 2.2 API Endpoints
- `GET /products` - لیست محصولات
- `POST /products` - ایجاد محصول (فروشنده)
- `POST /orders` - ایجاد سفارش
- `GET /orders` - لیست سفارش‌ها

---

### مرحله 3: Inventory Service (روز 6-7)

#### 3.1 ساخت Inventory Service
```
inventory-service/
├── src/
│   ├── index.ts
│   ├── routes/
│   │   └── inventory.routes.ts
│   ├── controllers/
│   │   └── inventory.controller.ts
│   ├── models/
│   │   └── inventory.model.ts
│   └── events/
│       ├── publisher.ts
│       └── consumer.ts
```

#### 3.2 API Endpoints
- `GET /inventory/:productId` - موجودی محصول
- `POST /inventory/reserve` - رزرو موجودی
- `POST /inventory/release` - آزاد کردن موجودی

---

### مرحله 4: Payment Service (روز 8)

#### 4.1 ساخت Payment Service (Mock)
```
payment-service/
├── src/
│   ├── index.ts
│   ├── routes/
│   │   └── payment.routes.ts
│   ├── controllers/
│   │   └── payment.controller.ts
│   └── events/
│       ├── publisher.ts
│       └── consumer.ts
```

#### 4.2 API Endpoints
- `POST /payments/process` - پردازش پرداخت (Mock)
- `POST /payments/refund` - بازگشت وجه

---

### مرحله 5: Saga Pattern - Orchestration (روز 9-12)

#### 5.1 ساخت Saga Orchestrator
```
saga-orchestrator/
├── src/
│   ├── index.ts
│   ├── orchestrator.ts      # منطق Saga
│   ├── steps/
│   │   ├── create-order.step.ts
│   │   ├── reserve-inventory.step.ts
│   │   ├── process-payment.step.ts
│   │   └── confirm-order.step.ts
│   └── compensation/
│       └── compensation.handler.ts
```

#### 5.2 فرآیند خرید (Saga)
```
1. Create Order (Marketplace Service)
   ↓ Success
2. Reserve Inventory (Inventory Service)
   ↓ Success
3. Process Payment (Payment Service)
   ↓ Success
4. Confirm Order (Marketplace Service)
   
اگر هر مرحله Fail شود:
   → Compensation برای مراحل قبلی
```

#### 5.3 پیاده‌سازی Saga
```typescript
// saga-orchestrator.ts
class OrderSaga {
  async execute(orderData) {
    const steps = [
      { name: 'createOrder', service: 'marketplace', compensate: 'cancelOrder' },
      { name: 'reserveInventory', service: 'inventory', compensate: 'releaseInventory' },
      { name: 'processPayment', service: 'payment', compensate: 'refundPayment' },
      { name: 'confirmOrder', service: 'marketplace', compensate: null }
    ];
    
    const executedSteps = [];
    
    try {
      for (const step of steps) {
        const result = await this.executeStep(step, orderData);
        executedSteps.push({ step, result });
      }
      return { success: true };
    } catch (error) {
      // Compensation
      for (let i = executedSteps.length - 1; i >= 0; i--) {
        await this.compensate(executedSteps[i].step);
      }
      throw error;
    }
  }
}
```

---

### مرحله 6: Circuit Breaker (روز 13-14)

#### 6.1 نصب Library
```bash
npm install opossum  # برای Node.js
```

#### 6.2 پیاده‌سازی Circuit Breaker
```typescript
// circuit-breaker.ts
import CircuitBreaker from 'opossum';

const options = {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000
};

const breaker = new CircuitBreaker(async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Service unavailable');
  return response.json();
}, options);

breaker.on('open', () => {
  console.log('Circuit breaker opened - service unavailable');
});

breaker.on('halfOpen', () => {
  console.log('Circuit breaker half-open - testing service');
});

breaker.fallback(() => {
  return { error: 'Service temporarily unavailable', fallback: true };
});

export default breaker;
```

#### 6.3 استفاده در Notification Service
```typescript
// notification-service/src/index.ts
import circuitBreaker from './circuit-breaker';

app.post('/notifications/send', async (req, res) => {
  try {
    // استفاده از Circuit Breaker برای ارتباط با سایر سرویس‌ها
    const userData = await circuitBreaker.fire('http://auth-service:3001/api/users/me');
    // ...
  } catch (error) {
    // Fallback
    res.json({ message: 'Notification queued', fallback: true });
  }
});
```

---

### مرحله 7: Integration و Testing (روز 15-16)

#### 7.1 به‌روزرسانی docker-compose.yml
```yaml
services:
  # ... سرویس‌های قبلی
  
  rabbitmq:
    # ...
  
  marketplace-service:
    # ...
  
  inventory-service:
    # ...
  
  payment-service:
    # ...
  
  saga-orchestrator:
    # ...
  
  notification-service:
    # ...
```

#### 7.2 تست End-to-End
- [ ] ایجاد سفارش
- [ ] رزرو موجودی
- [ ] پردازش پرداخت
- [ ] تایید سفارش
- [ ] تست Failure و Compensation
- [ ] تست Circuit Breaker

---

## 📝 Checklist فاز 2

- [ ] ساختار پروژه Backend
- [ ] Auth Service
- [ ] Booking Service
- [ ] API Gateway
- [ ] docker-compose.yml
- [ ] Integration Frontend
- [ ] تست End-to-End
- [ ] ویدیو 3 دقیقه‌ای

## 📝 Checklist فاز 3

- [ ] RabbitMQ Setup
- [ ] Marketplace Service
- [ ] Inventory Service
- [ ] Payment Service
- [ ] Saga Pattern
- [ ] Circuit Breaker
- [ ] Notification Service
- [ ] Integration
- [ ] تست کامل
- [ ] Learning_Report.md

---

## 🎓 نکات مهم

1. **اولویت:** ابتدا فاز 2 را کامل کنید، سپس فاز 3
2. **تست:** بعد از هر مرحله تست کنید
3. **مستندات:** حین کار مستندات را بنویسید
4. **Git:** Commit های منظم داشته باشید
5. **AI Log:** تمام تعاملات با AI را ثبت کنید

---

**موفق باشید! 🚀**

