# 🎓 Smart Campus Platform

**سیستم مدیریت دانشگاهی مبتنی بر معماری Microservices**

یک پلتفرم کامل برای مدیریت دانشگاه با Spring Boot و React که شامل:
- 👥 مدیریت کاربران (Faculty, Teacher, Student)
- 📚 رزرو منابع (کلاس، لابراتوار)
- 🎫 خرید تیکت رویدادها
- 📝 آزمون‌های آنلاین
- 🔔 سیستم اعلان‌ها
- 🔐 امنیت و Multi-tenancy

---

## 🚀 شروع سریع

### با Docker (توصیه می‌شود)

```bash
# بیلد
cd Smart-Campus-Platform
mvn clean package -DskipTests

cd ../Smart-Campus-Platform-UI
npm install && npm run build

# اجرا
cd ..
docker-compose up -d --build
```

**دسترسی:**
- Frontend: http://localhost:4173
- API: http://localhost:8080

**کاربران:**
- Faculty: `admin` / `0000`
- Teacher: `teacher` / `teacher`
- Student: `student` / `student`

---

## 📚 مستندات کامل

### برای دیپلوی Production

📄 **[راهنمای دیپلوی Liara](LIARA.md)**
- دیپلوی از صفر تا صد
- تنظیمات PostgreSQL, Redis, RabbitMQ
- متغیرهای محیطی
- عیب‌یابی

### برای درک معماری

📄 **[معماری سیستم](ARCHITECTURE.md)**
- Architecture Diagram
- الگوی Saga
- الگوی Circuit Breaker
- Event-Driven با RabbitMQ
- امنیت و Multi-tenancy
- مقیاس‌پذیری

### برای راه‌اندازی Local

📄 **[کانفیگ و راه‌اندازی](CONFIGURATION.md)**
- کاربران و پسوردها
- پورت‌ها و سرویس‌ها
- تنظیمات دیتابیس
- راه‌اندازی Local و Docker
- متغیرهای محیطی
- عیب‌یابی

---

## 🏗️ معماری سیستم

```
Frontend (React) → API Gateway (8080) → Microservices
                         ↓
    ┌─────────────────┬─────────────────┬──────────────┐
    │                 │                 │              │
Auth(8081)    Booking(8082)    Order(8084)    Exam(8085)
    │                 │                 │              │
    ↓                 ↓                 ↓              ↓
PostgreSQL      PostgreSQL        PostgreSQL     PostgreSQL
    
                    RabbitMQ (Events)
                    Redis (Rate Limiting)
```

**8 Microservices:**
- Auth, API Gateway, Booking, Marketplace, Order, Exam, Notification, IoT

---

## ✨ ویژگی‌های کلیدی

### الگوهای پیاده‌سازی شده

✅ **Saga Pattern** - Order Checkout با compensating transactions  
✅ **Circuit Breaker** - Exam → Notification با Resilience4j  
✅ **Event-Driven** - RabbitMQ برای ارتباط async  
✅ **API Gateway** - Rate Limiting + Retry + CORS  
✅ **Multi-Tenancy** - ایزوله‌سازی داده‌ها  

### امنیت

✅ JWT Authentication (exp: 10h)  
✅ Role-Based Access Control (RBAC)  
✅ Rate Limiting (10 req/sec)  
✅ BCrypt Password Hashing  
✅ SQL Injection Protection (JPA)  

---

## 🛠️ تکنولوژی

**Backend:** Java 17, Spring Boot 3.3, PostgreSQL, Redis, RabbitMQ  
**Frontend:** React 18, TypeScript, Vite  
**DevOps:** Docker, Docker Compose, Nginx  

---

## 📦 ساختار پروژه

```
.
├── Smart-Campus-Platform/       # Backend (8 Microservices)
│   ├── auth-service/
│   ├── api-gateway/
│   ├── booking-service/
│   ├── marketplace-service/
│   ├── order-service/
│   ├── exam-service/
│   ├── notification-service/
│   ├── iot-service/
│   ├── LIARA.md                 # 🚀 راهنمای دیپلوی Liara
│   ├── ARCHITECTURE.md          # 🏗️ معماری سیستم
│   └── CONFIGURATION.md         # ⚙️ کانفیگ و راه‌اندازی
├── Smart-Campus-Platform-UI/    # Frontend (React)
├── docker-compose.yml
└── README.md
```

---

## 🎯 Use Cases

### Faculty (مدیر دانشکده)
- ایجاد/حذف کاربران
- مدیریت منابع و تیکت‌ها
- مشاهده تمام فعالیت‌ها

### Teacher (استاد)
- مدیریت آزمون‌ها
- مدیریت تیکت‌های خود
- رزرو منابع

### Student (دانشجو)
- خرید تیکت
- رزرو منابع
- شرکت در آزمون‌ها

---

## 🐛 عیب‌یابی

### مشکل اتصال به دیتابیس

```bash
# بررسی containers
docker-compose ps

# Restart دیتابیس
docker-compose restart auth-db
```

### مشکل RabbitMQ

```bash
# دسترسی به Management UI
http://localhost:15672
user: guest, pass: guest
```

### مشکل CORS

مطمئن شوید درخواست‌ها به `http://localhost:8080` (API Gateway) می‌روند، نه مستقیم به سرویس‌ها.

---

## 📊 Performance

- **Rate Limiting**: 10 requests/second per IP
- **Connection Pool**: HikariCP (max: 10)
- **Circuit Breaker**: Resilience4j
- **Retry**: 3 attempts با exponential backoff

---
