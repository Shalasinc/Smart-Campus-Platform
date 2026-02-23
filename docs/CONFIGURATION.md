# ⚙️ راهنمای کانفیگ و راه‌اندازی

**تمام تنظیمات، پسوردها، و روش‌های اجرا**

---

## 📋 فهرست

1. [کاربران پیش‌فرض](#1-کاربران-پیشفرض)
2. [پورت‌ها و سرویس‌ها](#2-پورتها-و-سرویسها)
3. [تنظیمات دیتابیس](#3-تنظیمات-دیتابیس)
4. [راه‌اندازی Local](#4-راهاندازی-local)
5. [راه‌اندازی Docker](#5-راهاندازی-docker)
6. [تغییر بین حالت‌ها](#6-تغییر-بین-حالتها)
7. [متغیرهای محیطی](#7-متغیرهای-محیطی)

---

## 1. کاربران پیش‌فرض

### 1.1 Seed Users

این کاربران به صورت خودکار در اولین اجرا ساخته می‌شوند:

| Username | Password | Role | tenantId | توضیحات |
|----------|----------|------|----------|---------|
| `admin` | `0000` | FACULTY | default | مدیر اصلی دانشکده |
| `teacher` | `teacher` | TEACHER | default | استاد نمونه |
| `student` | `student` | STUDENT | default | دانشجو نمونه |

### 1.2 دسترسی‌ها

**FACULTY (مدیر دانشکده):**
```
✅ ایجاد/حذف کاربران (Teacher, Student)
✅ ایجاد/حذف منابع (کلاس‌ها، لابراتوار)
✅ ایجاد/حذف تیکت‌ها
✅ ایجاد/حذف آزمون‌ها
✅ مشاهده تمام رزروها
✅ مشاهده تمام سفارشات
✅ مشاهده تمام notification ها
```

**TEACHER (استاد):**
```
✅ ایجاد/حذف آزمون‌های خودش
✅ مدیریت تیکت‌های محول شده
✅ رزرو منابع
✅ مشاهده رزروهای خودش
✅ مشاهده notification های خودش
```

**STUDENT (دانشجو):**
```
✅ خرید تیکت
✅ رزرو منابع
✅ کنسل رزروهای خودش
✅ شرکت در آزمون‌ها
✅ مشاهده سفارشات خودش
✅ مشاهده notification های خودش
```

---

## 2. پورت‌ها و سرویس‌ها

### 2.1 Backend Services

| سرویس | پورت | URL | Health Check |
|-------|------|-----|--------------|
| API Gateway | 8080 | http://localhost:8080 | /actuator/health |
| Auth Service | 8081 | http://localhost:8081 | /actuator/health |
| Booking Service | 8082 | http://localhost:8082 | /actuator/health |
| Marketplace Service | 8083 | http://localhost:8083 | /actuator/health |
| Order Service | 8084 | http://localhost:8084 | /actuator/health |
| Exam Service | 8085 | http://localhost:8085 | /actuator/health |
| Notification Service | 8086 | http://localhost:8086 | /actuator/health |
| IoT Service | 8087 | http://localhost:8087 | /actuator/health |

### 2.2 Infrastructure

| سرویس | پورت | URL | Credentials |
|-------|------|-----|-------------|
| PostgreSQL (auth-db) | 5433 | localhost:5433/authdb | auth/auth |
| PostgreSQL (booking-db) | 5434 | localhost:5434/bookingdb | booking/booking |
| PostgreSQL (marketplace-db) | 5435 | localhost:5435/marketdb | market/market |
| PostgreSQL (order-db) | 5436 | localhost:5436/orderdb | orders/orders |
| PostgreSQL (exam-db) | 5437 | localhost:5437/examdb | exam/exam |
| PostgreSQL (notification-db) | 5438 | localhost:5438/notificationdb | note/note |
| RabbitMQ | 5672 | localhost:5672 | guest/guest |
| RabbitMQ Management | 15672 | http://localhost:15672 | guest/guest |
| Redis | 6379 | localhost:6379 | (no password) |

### 2.3 Frontend

| آیتم | مقدار |
|------|-------|
| پورت | 4173 |
| URL | http://localhost:4173 |
| API URL | http://localhost:8080 |

---

## 3. تنظیمات دیتابیس

### 3.1 ساخت دیتابیس‌ها (Local)

```sql
-- Auth Database
CREATE DATABASE authdb;
CREATE USER auth WITH PASSWORD 'auth';
GRANT ALL PRIVILEGES ON DATABASE authdb TO auth;
ALTER DATABASE authdb OWNER TO auth;

-- Booking Database
CREATE DATABASE bookingdb;
CREATE USER booking WITH PASSWORD 'booking';
GRANT ALL PRIVILEGES ON DATABASE bookingdb TO booking;
ALTER DATABASE bookingdb OWNER TO booking;

-- Marketplace Database
CREATE DATABASE marketdb;
CREATE USER market WITH PASSWORD 'market';
GRANT ALL PRIVILEGES ON DATABASE marketdb TO market;
ALTER DATABASE marketdb OWNER TO market;

-- Order Database
CREATE DATABASE orderdb;
CREATE USER orders WITH PASSWORD 'orders';
GRANT ALL PRIVILEGES ON DATABASE orderdb TO orders;
ALTER DATABASE orderdb OWNER TO orders;

-- Exam Database
CREATE DATABASE examdb;
CREATE USER exam WITH PASSWORD 'exam';
GRANT ALL PRIVILEGES ON DATABASE examdb TO exam;
ALTER DATABASE examdb OWNER TO exam;

-- Notification Database
CREATE DATABASE notificationdb;
CREATE USER note WITH PASSWORD 'note';
GRANT ALL PRIVILEGES ON DATABASE notificationdb TO note;
ALTER DATABASE notificationdb OWNER TO note;
```

### 3.2 Connection Strings

**Local Development:**
```yaml
# auth-service
spring.datasource.url=jdbc:postgresql://localhost:5433/authdb
spring.datasource.username=auth
spring.datasource.password=auth
```

**Docker:**
```yaml
# auth-service
spring.datasource.url=jdbc:postgresql://auth-db:5432/authdb
spring.datasource.username=auth
spring.datasource.password=auth
```

**Cloud (Liara):**
```yaml
# auth-service
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
```

---

## 4. راه‌اندازی Local

### 4.1 پیش‌نیازها

```bash
# بررسی نصب Java
java -version
# باید Java 17 یا بالاتر باشد

# بررسی نصب Maven
mvn -version

# بررسی نصب PostgreSQL
psql --version

# بررسی نصب Docker (برای RabbitMQ و Redis)
docker --version
```

### 4.2 راه‌اندازی Infrastructure

```bash
# فقط دیتابیس‌ها، RabbitMQ و Redis
cd Smart-Campus-Platform
docker-compose up -d postgres-auth postgres-booking rabbitmq redis

# یا همه دیتابیس‌ها با یک دستور
docker-compose up -d
```

### 4.3 تنظیم application.yml

برای هر سرویس، فایل `src/main/resources/application.yml` را باز کنید:

**مثال: auth-service**

```yaml
spring:
  datasource:
    # ============ LOCAL DEVELOPMENT ============
    url: jdbc:postgresql://localhost:5433/authdb  # ✅ UNCOMMENT
    username: auth
    password: auth
    
    # ============ DOCKER DEPLOYMENT ============
#    url: jdbc:postgresql://auth-db:5432/authdb   # ❌ COMMENT
#    username: auth
#    password: auth
    
    # ============ CLOUD DEPLOYMENT ============
#    url: ${SPRING_DATASOURCE_URL:...}            # ❌ COMMENT
#    username: ${SPRING_DATASOURCE_USERNAME:...}
#    password: ${SPRING_DATASOURCE_PASSWORD:...}

  rabbitmq:
    # LOCAL
    host: localhost  # ✅ UNCOMMENT
    port: 5672
    
    # DOCKER
#    host: rabbitmq  # ❌ COMMENT
#    port: 5672
```

این کار را برای تمام سرویس‌ها تکرار کنید:
- auth-service
- api-gateway
- booking-service
- marketplace-service
- order-service
- exam-service
- notification-service

### 4.4 اجرای سرویس‌ها (IntelliJ IDEA)

**ترتیب اجرا:**

1. **Auth Service** (8081)
   ```
   Run → Run 'AuthServiceApplication'
   ```

2. **API Gateway** (8080)
   ```
   Run → Run 'ApiGatewayApplication'
   ```

3. سایر سرویس‌ها (هر ترتیبی):
   - Booking Service (8082)
   - Marketplace Service (8083)
   - Order Service (8084)
   - Exam Service (8085)
   - Notification Service (8086)
   - IoT Service (8087)

**بررسی:**
```bash
# هر سرویس باید این پیام را نمایش دهد:
Started [ServiceName]Application in X seconds
```

### 4.5 اجرای Frontend

```bash
cd Smart-Campus-Platform-UI

# نصب dependencies
npm install

# اجرای development server
npm run dev

# دسترسی:
# http://localhost:4173
```

---

## 5. راه‌اندازی Docker

### 5.1 تنظیم application.yml

برای Docker، باید تنظیمات Docker را فعال کنید:

```yaml
spring:
  datasource:
    # LOCAL
#    url: jdbc:postgresql://localhost:5433/authdb  # ❌ COMMENT
    
    # DOCKER ✅
    url: jdbc:postgresql://auth-db:5432/authdb     # ✅ UNCOMMENT
    username: auth
    password: auth
    
  rabbitmq:
    # DOCKER ✅
    host: rabbitmq  # ✅ UNCOMMENT
    port: 5672
```

### 5.2 بیلد پروژه

```bash
cd Smart-Campus-Platform

# بیلد backend
mvn clean package -DskipTests

# بیلد frontend
cd ../Smart-Campus-Platform-UI
npm install
npm run build
```

### 5.3 اجرای Docker Compose

```bash
# از روت پروژه
docker-compose up -d --build

# بررسی وضعیت
docker-compose ps

# مشاهده لاگ‌ها
docker-compose logs -f

# توقف
docker-compose down

# توقف + حذف volumes
docker-compose down -v
```

### 5.4 دسترسی

- Frontend: http://localhost:4173
- API Gateway: http://localhost:8080
- RabbitMQ Management: http://localhost:15672

---

## 6. تغییر بین حالت‌ها

### 6.1 Local → Docker

1. باز کردن همه `application.yml` ها
2. کامنت کردن خطوط `localhost`
3. Uncomment کردن خطوط Docker (`auth-db`, `rabbitmq`, `redis`)
4. بیلد: `mvn clean package -DskipTests`
5. اجرا: `docker-compose up -d --build`

### 6.2 Docker → Local

1. باز کردن همه `application.yml` ها
2. Uncomment کردن خطوط `localhost`
3. کامنت کردن خطوط Docker
4. راه‌اندازی PostgreSQL, RabbitMQ, Redis (local یا Docker)
5. اجرای سرویس‌ها در IntelliJ

### 6.3 Local/Docker → Cloud (Liara)

1. باز کردن همه `application.yml` ها
2. کامنت کردن خطوط Local و Docker
3. Uncomment کردن خطوط Cloud (متغیرهای محیطی)
4. تنظیم متغیرهای محیطی در Liara
5. دیپلوی

---

## 7. متغیرهای محیطی

### 7.1 JWT Secret

**تولید:**
```bash
echo -n "YourSecretKey123456789" | base64
# نتیجه: WW91clNlY3JldEtleTEyMzQ1Njc4OQ==
```

**استفاده:**

**Local/Docker:**
```yaml
# application.yml
app:
  jwt:
    secret: ${JWT_SECRET:TXlfU21hcnRDYW1wdXNfU2VjcmV0X0tleTEyMzQ1Njc4OTAxMjM0NTY3OA==}
```

**Cloud:**
```bash
# متغیر محیطی در Liara
JWT_SECRET=TXlfU21hcnRDYW1wdXNfU2VjcmV0X0tleTEyMzQ1Njc4OTAxMjM0NTY3OA==
```

### 7.2 Database URLs

**Format:**
```
jdbc:postgresql://HOST:PORT/DATABASE
```

**مثال‌ها:**
```bash
# Local
jdbc:postgresql://localhost:5433/authdb

# Docker
jdbc:postgresql://auth-db:5432/authdb

# Liara
jdbc:postgresql://smart-campus-db.iran.liara.ir:5432/authdb
```

### 7.3 تمام متغیرهای مورد نیاز (Cloud)

```bash
# JWT
JWT_SECRET=...

# Auth Service
SPRING_DATASOURCE_URL=jdbc:postgresql://HOST:PORT/authdb
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=...

# Booking Service
SPRING_DATASOURCE_URL_BOOKING=jdbc:postgresql://HOST:PORT/bookingdb
SPRING_DATASOURCE_USERNAME_BOOKING=root
SPRING_DATASOURCE_PASSWORD_BOOKING=...

# Marketplace Service
SPRING_DATASOURCE_URL_MARKETPLACE=jdbc:postgresql://HOST:PORT/marketdb
SPRING_DATASOURCE_USERNAME_MARKETPLACE=root
SPRING_DATASOURCE_PASSWORD_MARKETPLACE=...

# Order Service
SPRING_DATASOURCE_URL_ORDER=jdbc:postgresql://HOST:PORT/orderdb
SPRING_DATASOURCE_USERNAME_ORDER=root
SPRING_DATASOURCE_PASSWORD_ORDER=...

# Exam Service
SPRING_DATASOURCE_URL_EXAM=jdbc:postgresql://HOST:PORT/examdb
SPRING_DATASOURCE_USERNAME_EXAM=root
SPRING_DATASOURCE_PASSWORD_EXAM=...

# Notification Service
SPRING_DATASOURCE_URL_NOTIFICATION=jdbc:postgresql://HOST:PORT/notificationdb
SPRING_DATASOURCE_USERNAME_NOTIFICATION=root
SPRING_DATASOURCE_PASSWORD_NOTIFICATION=...

# Redis
SPRING_REDIS_HOST=...
SPRING_REDIS_PORT=6379

# RabbitMQ
SPRING_RABBITMQ_HOST=...
SPRING_RABBITMQ_PORT=5672
SPRING_RABBITMQ_USERNAME=...
SPRING_RABBITMQ_PASSWORD=...
```

---

## 8. API Endpoints

### 8.1 Authentication

```bash
# لاگین
POST http://localhost:8080/auth/login
Content-Type: application/json

{
  "username": "amin",
  "password": "13831383",
  "tenantId": "default"
}

# پاسخ:
{
  "token": "eyJhbGci...",
  "role": "FACULTY",
  "username": "amin"
}
```

### 8.2 استفاده از Token

```bash
# همه درخواست‌های بعدی
Authorization: Bearer eyJhbGci...
```

### 8.3 نمونه Endpoints

```bash
# دریافت منابع
GET http://localhost:8080/booking/resources
Authorization: Bearer TOKEN

# رزرو منبع
POST http://localhost:8080/booking/reservations
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "resourceId": 1,
  "startTime": "2024-12-30T10:00:00",
  "endTime": "2024-12-30T12:00:00"
}

# خرید تیکت
POST http://localhost:8080/orders/checkout
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "items": [
    {"ticketId": 1, "quantity": 2}
  ]
}
```

---

## 9. عیب‌یابی

### 9.1 مشکلات رایج

#### "Connection refused" به دیتابیس

```bash
# بررسی PostgreSQL
docker ps | grep postgres

# یا
psql -h localhost -p 5433 -U auth -d authdb

# اگر connect نشد:
docker-compose restart postgres-auth
```

#### "RabbitMQ queue not found"

```bash
# بررسی RabbitMQ
docker ps | grep rabbitmq

# دسترسی به Management UI
http://localhost:15672
user: guest, pass: guest

# restart
docker-compose restart rabbitmq
```

#### "Port already in use"

```bash
# پیدا کردن process روی پورت 8080
netstat -ano | findstr :8080

# kill کردن process
taskkill /PID [PID_NUMBER] /F
```

#### "CORS Error"

```
مشکل: درخواست مستقیم به سرویس (نه از طریق API Gateway)

راه‌حل: همیشه از http://localhost:8080 استفاده کنید
```

### 9.2 Reset کامل

```bash
# حذف همه containers و volumes
docker-compose down -v

# حذف images
docker rmi $(docker images -q smart-campus*)

# شروع از نو
docker-compose up -d --build
```

---

## 10. Development Tips

### 10.1 Hot Reload (Backend)

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>
</dependency>
```

### 10.2 Debug در IntelliJ

```
1. Run → Debug 'ServiceApplication'
2. Breakpoint گذاری
3. درخواست ارسال
4. مشاهده variables
```

### 10.3 مشاهده لاگ‌ها

**IntelliJ:**
```
Console tab → فیلتر با Ctrl+F
```

**Docker:**
```bash
# یک سرویس
docker-compose logs -f auth-service

# همه سرویس‌ها
docker-compose logs -f

# 100 خط آخر
docker-compose logs --tail=100
```

---

## 11. تست API

### 11.1 با cURL

```bash
# Health check
curl http://localhost:8080/actuator/health

# لاگین
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"amin","password":"13831383","tenantId":"default"}'

# با token
TOKEN="eyJhbGci..."
curl http://localhost:8080/booking/resources \
  -H "Authorization: Bearer $TOKEN"
```

### 11.2 با Postman

1. Import collection (اگر هست)
2. Environment variables:
   - `baseUrl`: http://localhost:8080
   - `token`: [از لاگین]
3. Authorization: Bearer Token → {{token}}

---

## 12. Backup & Restore

### 12.1 Backup دیتابیس

```bash
# یک دیتابیس
docker exec postgres-auth pg_dump -U auth authdb > backup-authdb.sql

# همه دیتابیس‌ها
./backup-all-dbs.sh
```

### 12.2 Restore

```bash
# یک دیتابیس
docker exec -i postgres-auth psql -U auth authdb < backup-authdb.sql
```

---

## ✅ چک‌لیست راه‌اندازی

### Local Development

- [ ] Java 17+ نصب شده
- [ ] Maven نصب شده
- [ ] Docker Desktop نصب شده
- [ ] PostgreSQL راه‌اندازی شده (یا Docker)
- [ ] RabbitMQ راه‌اندازی شده (Docker)
- [ ] Redis راه‌اندازی شده (Docker)
- [ ] دیتابیس‌ها ساخته شده‌اند
- [ ] application.yml ها برای Local تنظیم شده‌اند
- [ ] همه سرویس‌ها start شده‌اند
- [ ] Frontend اجرا شده
- [ ] لاگین موفق بوده

### Docker Deployment

- [ ] application.yml ها برای Docker تنظیم شده‌اند
- [ ] Backend بیلد شده (`mvn clean package`)
- [ ] Frontend بیلد شده (`npm run build`)
- [ ] `docker-compose up -d --build` اجرا شده
- [ ] همه containers در حال اجرا هستند
- [ ] Health check موفق است
- [ ] لاگین موفق بوده