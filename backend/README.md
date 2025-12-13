# Smart Campus Platform - Backend Services

این پروژه شامل پیاده‌سازی فاز 2 و 3 پروژه Smart Campus Platform است.

## 🏗️ معماری

پروژه از معماری میکروسرویس استفاده می‌کند و شامل سرویس‌های زیر است:

### فاز 2 (هفته‌های 3-4)
- **Auth Service** (Port 3001): مدیریت احراز هویت و JWT
- **Booking Service** (Port 3002): مدیریت رزرو اتاق‌ها با جلوگیری از Overbooking
- **API Gateway** (Port 3000): دروازه ورود به تمام سرویس‌ها

### فاز 3 (هفته‌های 5-6)
- **Marketplace Service** (Port 3003): مدیریت محصولات و سفارش‌ها
- **Inventory Service** (Port 3004): مدیریت موجودی محصولات
- **Payment Service** (Port 3005): پردازش پرداخت (Mock)
- **Notification Service** (Port 3006): ارسال اعلان‌ها با Circuit Breaker
- **Saga Orchestrator** (Port 3007): مدیریت فرآیند خرید با الگوی Saga

## 🚀 اجرای پروژه

### پیش‌نیازها
- Docker و Docker Compose
- Node.js 18+ (برای توسعه محلی)

### اجرا با Docker Compose

```bash
# اجرای تمام سرویس‌ها
docker-compose up -d

# مشاهده لاگ‌ها
docker-compose logs -f

# توقف سرویس‌ها
docker-compose down
```

### اجرای محلی (Development)

```bash
# نصب dependencies برای هر سرویس
cd backend/services/auth-service
npm install
npm run dev

# تکرار برای سایر سرویس‌ها
```

## 📋 سرویس‌ها

### Auth Service
- `POST /api/auth/register` - ثبت‌نام
- `POST /api/auth/login` - ورود
- `GET /api/auth/me` - اطلاعات کاربر فعلی

### Booking Service
- `GET /api/rooms` - لیست اتاق‌ها
- `GET /api/rooms/:id` - جزئیات اتاق
- `POST /api/bookings` - ایجاد رزرو
- `GET /api/bookings` - لیست رزروها
- `DELETE /api/bookings/:id` - لغو رزرو

### Marketplace Service
- `GET /api/marketplace/products` - لیست محصولات
- `POST /api/marketplace/products` - ایجاد محصول
- `POST /api/marketplace/orders` - ایجاد سفارش

## 🔄 الگوی Saga

فرآیند خرید با الگوی Saga Orchestration پیاده‌سازی شده است:

1. **Create Order** → Marketplace Service
2. **Reserve Inventory** → Inventory Service
3. **Process Payment** → Payment Service
4. **Confirm Order** → Marketplace Service

در صورت خطا در هر مرحله، Compensation برای مراحل قبلی اجرا می‌شود.

## ⚡ Circuit Breaker

Notification Service از Circuit Breaker برای ارتباط با Auth Service استفاده می‌کند:
- استفاده از کتابخانه `opossum`
- Fallback mechanism در صورت عدم دسترسی به سرویس
- Monitoring و Logging

## 🐰 RabbitMQ

تمام ارتباطات Event-Driven از طریق RabbitMQ انجام می‌شود:
- Exchange: `smartcampus_events`
- Management UI: http://localhost:15672 (admin/admin)

## 🗄️ Database

PostgreSQL برای ذخیره‌سازی داده‌ها:
- Port: 5432
- Database: smartcampus
- User: postgres
- Password: postgres

## 📝 Environment Variables

برای هر سرویس، فایل `.env.example` موجود است.

## 🔧 Troubleshooting

### مشکل اتصال به RabbitMQ
```bash
# بررسی وضعیت RabbitMQ
docker-compose ps rabbitmq
docker-compose logs rabbitmq
```

### مشکل اتصال به Database
```bash
# بررسی وضعیت PostgreSQL
docker-compose ps postgres
docker-compose logs postgres
```

## 📚 مستندات بیشتر

- [PHASE_2_3_PLAN.md](../PHASE_2_3_PLAN.md) - برنامه تفصیلی فاز 2 و 3
- [PROJECT_REVIEW.md](../PROJECT_REVIEW.md) - بررسی کلی پروژه

