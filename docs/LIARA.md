# 🚀 راهنمای کامل دیپلوی روی Liara

---

## 🎯 مرحله 1: آماده‌سازی سرویس‌های پایه

### 1.1 PostgreSQL

```
پنل Liara → سرویس‌ها → ایجاد سرویس → PostgreSQL

نام: smart-campus-db
پلن: ir-small
منطقه: iran
```

**بعد از ایجاد:**
1. جزئیات اتصال → یادداشت کنید:
   - HOST: `مثلا smart-campus-db.iran.liara.ir`
   - PORT: `5432`
   - USER: `root`
   - PASSWORD: `کپی کنید`

2. Database → اتصال به دیتابیس → اجرای دستورات:

```sql
CREATE DATABASE authdb;
CREATE DATABASE bookingdb;
CREATE DATABASE marketdb;
CREATE DATABASE orderdb;
CREATE DATABASE examdb;
CREATE DATABASE notificationdb;
```

### 1.2 Redis

```
پنل Liara → سرویس‌ها → ایجاد سرویس → Redis

نام: smart-campus-redis
پلن: ir-small
منطقه: iran
```

**بعد از ایجاد:**
- جزئیات اتصال → یادداشت کنید:
  - HOST: `مثلا smart-campus-redis.iran.liara.ir`
  - PORT: `6379`

### 1.3 RabbitMQ (خارجی)

⚠️ Liara RabbitMQ ندارد. باید از CloudAMQP استفاده کنید:

```
1. برو به https://www.cloudamqp.com/
2. Sign Up (رایگان)
3. Create New Instance
4. پلن: Little Lemur (Free)
5. Region: US-East-1
6. Create
```

**بعد از ایجاد:**
- AMQP Details → یادداشت کنید:
  - Server: `مثلا jellyfish.rmq.cloudamqp.com`
  - User & Vhost: `کپی کنید`
  - Password: `کپی کنید`

---

## 🎯 مرحله 2: ایجاد برنامه در Liara

```
پنل Liara → برنامه‌ها → ایجاد برنامه

پلتفرم: Docker
نام: smart-campus
پورت: 8080  ⭐ مهم!
منطقه: iran
```

---

## 🎯 مرحله 3: تنظیم متغیرهای محیطی

**خیلی مهم! ⚠️ قبل از آپلود حتما این کار را انجام دهید**

```
پنل Liara → برنامه smart-campus → تنظیمات → متغیرهای محیطی
```

کپی کنید و مقادیر داخل `[ ]` را با اطلاعات واقعی جایگزین کنید:

```bash
# JWT Secret
JWT_SECRET=TXlfU21hcnRDYW1wdXNfU2VjcmV0X0tleTEyMzQ1Njc4OTAxMjM0NTY3OA==

# PostgreSQL - Auth Service
SPRING_DATASOURCE_URL=jdbc:postgresql://[HOST_از_مرحله_1.1]:[PORT]/authdb
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=[PASSWORD_از_مرحله_1.1]

# PostgreSQL - Booking Service
SPRING_DATASOURCE_URL_BOOKING=jdbc:postgresql://[HOST_از_مرحله_1.1]:[PORT]/bookingdb
SPRING_DATASOURCE_USERNAME_BOOKING=root
SPRING_DATASOURCE_PASSWORD_BOOKING=[PASSWORD_از_مرحله_1.1]

# PostgreSQL - Marketplace Service
SPRING_DATASOURCE_URL_MARKETPLACE=jdbc:postgresql://[HOST_از_مرحله_1.1]:[PORT]/marketdb
SPRING_DATASOURCE_USERNAME_MARKETPLACE=root
SPRING_DATASOURCE_PASSWORD_MARKETPLACE=[PASSWORD_از_مرحله_1.1]

# PostgreSQL - Order Service
SPRING_DATASOURCE_URL_ORDER=jdbc:postgresql://[HOST_از_مرحله_1.1]:[PORT]/orderdb
SPRING_DATASOURCE_USERNAME_ORDER=root
SPRING_DATASOURCE_PASSWORD_ORDER=[PASSWORD_از_مرحله_1.1]

# PostgreSQL - Exam Service
SPRING_DATASOURCE_URL_EXAM=jdbc:postgresql://[HOST_از_مرحله_1.1]:[PORT]/examdb
SPRING_DATASOURCE_USERNAME_EXAM=root
SPRING_DATASOURCE_PASSWORD_EXAM=[PASSWORD_از_مرحله_1.1]

# PostgreSQL - Notification Service
SPRING_DATASOURCE_URL_NOTIFICATION=jdbc:postgresql://[HOST_از_مرحله_1.1]:[PORT]/notificationdb
SPRING_DATASOURCE_USERNAME_NOTIFICATION=root
SPRING_DATASOURCE_PASSWORD_NOTIFICATION=[PASSWORD_از_مرحله_1.1]

# Redis
SPRING_REDIS_HOST=[HOST_از_مرحله_1.2]
SPRING_REDIS_PORT=6379

# RabbitMQ (CloudAMQP)
SPRING_RABBITMQ_HOST=[Server_از_مرحله_1.3]
SPRING_RABBITMQ_PORT=5672
SPRING_RABBITMQ_USERNAME=[User_از_مرحله_1.3]
SPRING_RABBITMQ_PASSWORD=[Password_از_مرحله_1.3]
```

**ذخیره کنید!**

---

## 🎯 مرحله 4: آپلود پروژه

### روش A: آپلود دستی (ساده‌تر)

#### 4.1 آماده‌سازی
1. پوشه `Smart-Campus-Platform` را باز کنید
2. **تمام محتویات** را انتخاب کنید (نه خود پوشه!):
   ```
   ✅ api-gateway/
   ✅ auth-service/
   ✅ booking-service/
   ✅ marketplace-service/
   ✅ order-service/
   ✅ exam-service/
   ✅ notification-service/
   ✅ iot-service/
   ✅ docker-compose.yml
   ✅ liara.json
   ✅ pom.xml (اگر هست)
   ```

3. کلیک راست → **Send to** → **Compressed (zipped) folder**
4. نام فایل: `smart-campus.zip`

#### 4.2 آپلود
```
پنل Liara → برنامه smart-campus → استقرار → آپلود فایل

1. فایل smart-campus.zip را انتخاب کنید
2. شروع استقرار
3. صبر کنید (5-10 دقیقه)
```

### روش B: با Liara CLI (سریع‌تر)

```bash
# نصب
npm install -g @liara/cli

# لاگین
liara login

# دیپلوی
cd Smart-Campus-Platform
liara deploy --app smart-campus --port 8080
```

---

## 🎯 مرحله 5: بررسی و تست

### 5.1 چک کردن لاگ‌ها

```
پنل Liara → برنامه smart-campus → لاگ‌ها
```

**باید این پیام‌ها را ببینید:**
```
Started AuthServiceApplication in X seconds
Started ApiGatewayApplication in X seconds
Started BookingServiceApplication in X seconds
...
```

**اگر خطا دیدید:**
- Connection refused → متغیرهای محیطی را چک کنید
- Port in use → پورت باید 8080 باشد
- RabbitMQ timeout → CloudAMQP credentials را بررسی کنید

### 5.2 تست API

#### Health Check
```bash
curl https://smart-campus.liara.run/actuator/health
```

**پاسخ موفق:**
```json
{
  "status": "UP"
}
```

#### تست لاگین
```bash
curl -X POST https://smart-campus.liara.run/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "amin",
    "password": "13831383",
    "tenantId": "default"
  }'
```

**پاسخ موفق:**
```json
{
  "token": "eyJhbGciOiJ...",
  "role": "FACULTY",
  "username": "amin"
}
```

---

## 🎯 مرحله 6: دیپلوی Frontend

### 6.1 ایجاد برنامه Static

```
پنل Liara → برنامه‌ها → ایجاد برنامه

پلتفرم: Static
نام: smart-campus-ui
منطقه: iran
```

### 6.2 تغییر API URL

فایل `Smart-Campus-Platform-UI/src/App.tsx` را باز کنید:

```typescript
// تغییر این خط:
const API_URL = 'http://localhost:8080';

// به:
const API_URL = 'https://smart-campus.liara.run';
```

### 6.3 بیلد و آپلود

```bash
cd Smart-Campus-Platform-UI

# بیلد
npm install
npm run build

# آپلود (دستی)
# پوشه dist را zip کنید و در پنل Liara آپلود کنید

# یا با CLI
liara deploy --app smart-campus-ui --path dist
```

---

## 🎯 دسترسی به برنامه

بعد از دیپلوی موفق:

- **Backend**: https://smart-campus.liara.run
- **Frontend**: https://smart-campus-ui.liara.run
- **RabbitMQ Management**: https://[your-instance].cloudamqp.com

**کاربران پیش‌فرض:**

| Username | Password | نقش |
|----------|----------|-----|
| amin | 13831383 | مدیر دانشکده |
| teacher | teacher | استاد |
| student | student | دانشجو |

---

## 🐛 عیب‌یابی

### ❌ برنامه start نمی‌شود

**علت 1: متغیرهای محیطی نادرست**
```
راه‌حل: پنل Liara → تنظیمات → متغیرهای محیطی → بررسی دقیق
```

**علت 2: به دیتابیس متصل نمی‌شود**
```
راه‌حل:
1. HOST و PORT را بررسی کنید
2. شبکه خصوصی در Liara را فعال کنید
3. مطمئن شوید دیتابیس و برنامه در یک منطقه هستند
```

**علت 3: RabbitMQ timeout**
```
راه‌حل:
1. CloudAMQP را باز کنید
2. AMQP URL را کپی کنید
3. از آن host, user, password را استخراج کنید
4. در متغیرهای محیطی قرار دهید
```

### ❌ CORS Error

```
مشکل: فرانت به بک‌اند دسترسی ندارد

راه‌حل:
1. مطمئن شوید API_URL در فرانت صحیح است
2. باید به https://smart-campus.liara.run باشد
3. بدون slash در انتها
```

### ❌ 502 Bad Gateway

```
مشکل: یکی از سرویس‌ها کار نمی‌کند

راه‌حل:
1. لاگ‌ها را بررسی کنید
2. به دنبال "Started ...Application" بگردید
3. سرویسی که start نشده را پیدا کنید
4. خطای آن را رفع کنید
```

---

## 💰 هزینه‌ها (ماهانه)

| آیتم | پلن | هزینه |
|------|-----|-------|
| PostgreSQL | ir-small | 50,000 تومان |
| Redis | ir-small | 30,000 تومان |
| برنامه Docker | ir-small | 50,000 تومان |
| برنامه Static | رایگان | 0 تومان |
| CloudAMQP | Free | 0 تومان |
| **جمع کل** | | **130,000 تومان** |

---

## 📊 مانیتورینگ

### لاگ‌ها
```bash
liara logs --app smart-campus --since 1h
```

### Restart
```bash
liara restart --app smart-campus
```

### Shell
```bash
liara shell --app smart-campus
```

### Health Check مداوم
```bash
# هر 30 ثانیه چک کن
watch -n 30 curl https://smart-campus.liara.run/actuator/health
```

---

## 🔐 امنیت در Production

بعد از دیپلوی اولیه:

### 1. تغییر JWT Secret
```bash
# تولید secret جدید
echo -n "YourVerySecureSecretKey123" | base64

# در متغیرهای محیطی قرار دهید
JWT_SECRET=[نتیجه_بالا]
```

### 2. تغییر پسوردهای پیش‌فرض

در Dashboard Faculty، پسورد کاربران را تغییر دهید.

### 3. فعال‌سازی HTTPS

Liara به صورت خودکار HTTPS فعال است. ✅

### 4. Backup دیتابیس

```
پنل Liara → سرویس PostgreSQL → پشتیبان‌گیری → فعال‌سازی
```

### 5. محدود کردن دسترسی

```
پنل Liara → برنامه → شبکه خصوصی → تنظیم IP مجاز
```

---

## 📈 بهینه‌سازی Performance

### 1. افزایش منابع

اگر ترافیک زیاد شد:

```
پنل Liara → برنامه → تنظیمات → تغییر پلن

ir-small → ir-medium (منابع 2x)
ir-medium → ir-large (منابع 4x)
```

### 2. Scale Out

اگر نیاز به چندین instance دارید:

```
پنل Liara → برنامه → مقیاس → تعداد نمونه‌ها
```

### 3. CDN برای Frontend

```
پنل Liara → برنامه Static → CDN → فعال‌سازی
```

---

## ✅ چک‌لیست نهایی

قبل از رفتن به production:

- [ ] تمام متغیرهای محیطی تنظیم شده‌اند
- [ ] JWT Secret تغییر کرده
- [ ] پسوردهای پیش‌فرض تغییر کرده‌اند
- [ ] HTTPS فعال است
- [ ] Backup فعال است
- [ ] Health check موفق است
- [ ] لاگین کار می‌کند
- [ ] رزرو منابع کار می‌کند
- [ ] خرید تیکت کار می‌کند
- [ ] Notification ها ارسال می‌شوند
- [ ] Frontend به backend متصل است

---