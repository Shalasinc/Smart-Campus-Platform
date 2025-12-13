# وضعیت سرویس‌ها - Services Status

## ✅ سرویس‌های فعال

### 1. API Gateway (Port 3000)
- ✅ Status: Running
- ✅ Health: `/health` - OK
- ✅ Routes:
  - `/api/marketplace/products` ✅ کار می‌کند (7 محصول)
  - `/api/rooms` ✅ کار می‌کند (لیست خالی - نیاز به seed)
  - `/api/auth/login` ⚠️ Timeout (نیاز به بررسی)
  - `/api/bookings` ✅ Route تنظیم شده
  - `/api/inventory` ✅ Route تنظیم شده
  - `/api/payments` ✅ Route تنظیم شده
  - `/api/notifications` ✅ Route تنظیم شده

### 2. Auth Service (Port 3001)
- ✅ Status: Running
- ✅ Health: `/health` - OK
- ⚠️ Login: Timeout (مشکل احتمالی در اتصال به دیتابیس)

### 3. Booking Service (Port 3002)
- ✅ Status: Running
- ✅ Health: `/health` - OK
- ✅ Routes: `/rooms`, `/bookings`

### 4. Marketplace Service (Port 3003)
- ✅ Status: Running
- ✅ Health: `/health` - OK
- ✅ Products: 7 محصول در دیتابیس
- ✅ Routes: `/products`, `/orders`

### 5. Inventory Service (Port 3004)
- ✅ Status: Running
- ✅ Health: `/health` - OK
- ✅ RabbitMQ: Connected

### 6. Payment Service (Port 3005)
- ✅ Status: Running
- ✅ Health: `/health` - OK
- ✅ RabbitMQ: Connected

### 7. Notification Service (Port 3006)
- ✅ Status: Running
- ✅ Health: `/health` - OK
- ✅ RabbitMQ: Connected

### 8. Saga Orchestrator (Port 3007)
- ✅ Status: Running
- ✅ Health: `/health` - OK
- ✅ RabbitMQ: Connected

## 🗄️ Database (PostgreSQL)
- ✅ Status: Running & Healthy
- ✅ Port: 5432
- ✅ Database: smartcampus
- ✅ Tables:
  - `users`: 6 کاربر
  - `products`: 7 محصول
  - `notifications`: 3 اعلان
  - `rooms`: 0 (نیاز به seed)
  - `bookings`: 0
  - `orders`: 0

## 🐰 RabbitMQ
- ✅ Status: Running & Healthy
- ✅ AMQP Port: 5672
- ✅ Management UI: http://localhost:15672
- ✅ Exchange: `smartcampus_events`

## 🔧 مشکلات شناسایی شده

### 1. Auth Service Timeout
- **مشکل**: Login endpoint timeout می‌دهد
- **احتمال**: مشکل در اتصال به دیتابیس یا query طولانی
- **راه‌حل**: بررسی connection pool و query ها

### 2. Rooms خالی است
- **مشکل**: جدول rooms خالی است
- **راه‌حل**: نیاز به seed data برای rooms

## 📊 خلاصه

- ✅ **8 سرویس** در حال اجرا
- ✅ **2 سرویس زیرساخت** (PostgreSQL, RabbitMQ) سالم
- ✅ **API Gateway** routing درست کار می‌کند
- ✅ **Marketplace** و **Products** درست کار می‌کنند
- ⚠️ **Auth Service** نیاز به بررسی دارد
- ⚠️ **Rooms** نیاز به seed data دارد

## 🚀 دستورات مفید

### مشاهده لاگ‌ها
```bash
docker-compose logs -f [service-name]
```

### Restart یک سرویس
```bash
docker-compose restart [service-name]
```

### بررسی وضعیت
```bash
docker-compose ps
```

### تست Health Check
```bash
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
# ... و غیره
```

