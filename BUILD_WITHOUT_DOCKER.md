# راهنمای Build بدون Docker (برای تست سریع)

اگر Docker build مشکل دارد، می‌توانید سرویس‌ها را خارج از Docker build کنید و فقط infrastructure را با Docker اجرا کنید.

---

## گام 1: Build کردن سرویس‌ها با Maven

### پیش‌نیازها
- Java 17 JDK نصب شده
- Maven 3.9+ نصب شده

### Build کردن

```bash
# در PowerShell یا WSL
cd Smart-Campus-Platform

# Build کردن همه سرویس‌ها
mvn clean package -DskipTests
```

یا یکی یکی:

```bash
# Auth Service
cd services/auth-service
mvn clean package -DskipTests
cd ../..

# Booking Service
cd services/resource-booking-service
mvn clean package -DskipTests
cd ../..

# API Gateway
cd api-gateway
mvn clean package -DskipTests
cd ..
```

---

## گام 2: اجرای Infrastructure با Docker

```bash
cd deployment

# فقط infrastructure را اجرا کنید
docker compose -f docker-compose.minimal.yml up postgres-auth postgres-booking rabbitmq redis
```

---

## گام 3: اجرای سرویس‌ها به صورت Local

در ترمینال‌های جداگانه:

### Terminal 1 - Auth Service
```bash
cd Smart-Campus-Platform/services/auth-service
java -jar target/auth-service-1.0.0.jar
```

### Terminal 2 - Booking Service
```bash
cd Smart-Campus-Platform/services/resource-booking-service
java -jar target/resource-booking-service-1.0.0.jar
```

### Terminal 3 - API Gateway
```bash
cd Smart-Campus-Platform/api-gateway
java -jar target/api-gateway-1.0.0.jar
```

---

## تنظیمات Environment Variables

اگر نیاز به تنظیمات خاص دارید:

### Auth Service
```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/authdb
export DB_USERNAME=postgres
export DB_PASSWORD=postgres
export JWT_SECRET=changeme-smart-campus-secret
```

### Booking Service
```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5433/bookingdb
export DB_USERNAME=postgres
export DB_PASSWORD=postgres
export RABBITMQ_HOST=localhost
export RABBITMQ_PORT=5672
```

### API Gateway
```bash
export JWT_SECRET=changeme-smart-campus-secret-key-2024-minimum-32-chars
export REDIS_HOST=localhost
```

---

## تست

بعد از اجرای همه سرویس‌ها:

```bash
# تست لاگین
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123","role":"STUDENT","tenantId":"faculty_eng"}'
```

---

## مزایا

- ✅ سریع‌تر از Docker build
- ✅ راحت‌تر برای debug
- ✅ نیاز به Docker فقط برای infrastructure

## معایب

- ⚠️ باید Java و Maven نصب داشته باشید
- ⚠️ باید چند ترمینال باز کنید

