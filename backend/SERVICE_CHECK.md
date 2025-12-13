# بررسی سلامت سرویس‌ها

## ✅ وضعیت سرویس‌ها

### 1. API Gateway (Port 3000)
- ✅ Health Check: `/health`
- ✅ Routes:
  - `/api/auth` → Auth Service
  - `/api/bookings` → Booking Service
  - `/api/rooms` → Booking Service
  - `/api/marketplace` → Marketplace Service
  - `/api/inventory` → Inventory Service
  - `/api/payments` → Payment Service
  - `/api/notifications` → Notification Service

### 2. Auth Service (Port 3001)
- ✅ Health Check: `/health`
- ✅ Endpoints:
  - `POST /auth/register` - ثبت‌نام کاربر
  - `POST /auth/login` - ورود کاربر
  - `GET /auth/me` - اطلاعات کاربر (نیاز به JWT)

### 3. Booking Service (Port 3002)
- ✅ Health Check: `/health`
- ✅ Endpoints:
  - `GET /rooms` - لیست اتاق‌ها
  - `GET /rooms/:id` - اطلاعات یک اتاق
  - `GET /bookings` - لیست رزروها
  - `POST /bookings` - ایجاد رزرو
  - `DELETE /bookings/:id` - لغو رزرو

### 4. Marketplace Service (Port 3003)
- ✅ Health Check: `/health`
- ✅ Endpoints:
  - `GET /products` - لیست محصولات
  - `GET /products/:id` - اطلاعات یک محصول
  - `POST /products` - ایجاد محصول (نیاز به JWT)
  - `POST /orders` - ایجاد سفارش (Saga Pattern)

### 5. Inventory Service (Port 3004)
- ✅ Health Check: `/health`
- ✅ RabbitMQ Events:
  - `order.created` - رزرو موجودی
  - `order.cancelled` - آزادسازی موجودی

### 6. Payment Service (Port 3005)
- ✅ Health Check: `/health`
- ✅ RabbitMQ Events:
  - `inventory.reserved` - پردازش پرداخت

### 7. Notification Service (Port 3006)
- ✅ Health Check: `/health`
- ✅ Endpoints:
  - `GET /notifications` - لیست اعلان‌ها
  - `POST /notifications` - ایجاد اعلان
- ✅ RabbitMQ Events:
  - `order.confirmed` - ارسال اعلان

### 8. Saga Orchestrator (Port 3007)
- ✅ Health Check: `/health`
- ✅ RabbitMQ Events:
  - `order.created` - شروع Saga
  - `inventory.reserved` - مرحله بعدی
  - `payment.processed` - مرحله بعدی
  - `order.confirmed` - تکمیل Saga

## 🔍 بررسی اتصالات

### Database (PostgreSQL)
- ✅ Port: 5432
- ✅ Database: smartcampus
- ✅ Tables: users, products, orders, notifications, rooms, bookings

### Message Broker (RabbitMQ)
- ✅ AMQP Port: 5672
- ✅ Management UI: http://localhost:15672
- ✅ Exchange: smartcampus_events

## 🧪 تست دستی

### 1. تست Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"password123"}'
```

### 2. تست دریافت Rooms
```bash
curl http://localhost:3000/api/rooms
```

### 3. تست دریافت Products
```bash
curl http://localhost:3000/api/marketplace/products
```

### 4. تست ایجاد Order (Saga)
```bash
curl -X POST http://localhost:3000/api/marketplace/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"items":[{"productId":"...","quantity":1,"priceAtTime":29.99}]}'
```

## 📊 Logs

برای مشاهده لاگ‌های هر سرویس:
```bash
docker-compose logs -f [service-name]
```

مثال:
```bash
docker-compose logs -f api-gateway
docker-compose logs -f auth-service
docker-compose logs -f saga-orchestrator
```

