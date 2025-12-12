# راهنمای رفع مشکل Docker Registry

## مشکل: `failed to resolve reference` یا `EOF` در pull images

این مشکل معمولاً به دلیل مشکل اتصال به Docker Hub است.

---

## 🔧 راه حل‌ها (به ترتیب اولویت)

### راه حل 1: بررسی اتصال اینترنت

```bash
# تست اتصال به Docker Hub
ping registry-1.docker.io

# یا
curl -I https://registry-1.docker.io/v2/
```

اگر ping کار نکرد، مشکل اتصال اینترنت دارید.

---

### راه حل 2: استفاده از DNS بهتر

در WSL، DNS ممکن است مشکل داشته باشد. این را امتحان کنید:

```bash
# بررسی DNS فعلی
cat /etc/resolv.conf

# اگر مشکل دارید، DNS را تغییر دهید
sudo bash -c 'echo "nameserver 8.8.8.8" > /etc/resolv.conf'
sudo bash -c 'echo "nameserver 8.8.4.4" >> /etc/resolv.conf'
```

سپس دوباره امتحان کنید:
```bash
docker compose up --build
```

---

### راه حل 3: Pull کردن images به صورت جداگانه

گاهی pull کردن همه images با هم مشکل ایجاد می‌کند. این را امتحان کنید:

```bash
# Pull کردن images یکی یکی
docker pull postgres:15
docker pull rabbitmq:3-management
docker pull redis:7
docker pull nginx:1.27
docker pull prom/prometheus:v2.54.1
docker pull grafana/grafana:11.1.0

# سپس docker compose را اجرا کنید
docker compose up --build
```

---

### راه حل 4: استفاده از Docker Hub Mirror (اگر در ایران هستید)

اگر در ایران هستید و مشکل دسترسی دارید، می‌توانید از mirror استفاده کنید:

1. فایل Docker daemon config را ویرایش کنید:
```bash
sudo nano /etc/docker/daemon.json
```

2. این محتوا را اضافه کنید:
```json
{
  "registry-mirrors": [
    "https://docker.arvancloud.ir",
    "https://docker.iranrepo.ir"
  ]
}
```

3. Docker را restart کنید:
```bash
sudo service docker restart
```

---

### راه حل 5: اجرای فقط سرویس‌های ضروری برای تست فاز 2

برای تست فاز 2، فقط به این سرویس‌ها نیاز دارید:

```bash
# فقط سرویس‌های ضروری را اجرا کنید
docker compose up postgres-auth postgres-booking rabbitmq redis auth-service booking-service api-gateway
```

یا یک docker-compose ساده‌تر بسازید (فایل بعدی).

---

### راه حل 6: استفاده از VPN یا Proxy

اگر VPN دارید، آن را فعال کنید و دوباره امتحان کنید.

---

### راه حل 7: Retry با timeout بیشتر

```bash
# با retry بیشتر
docker compose pull --parallel
docker compose up --build
```

---

## 🚀 راه حل سریع برای تست فاز 2

اگر فقط می‌خواهید تست فاز 2 را انجام دهید، این docker-compose ساده را استفاده کنید:

```yaml
# docker-compose.minimal.yml
services:
  postgres-auth:
    image: postgres:15
    environment:
      POSTGRES_DB: authdb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports: ["5432:5432"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  postgres-booking:
    image: postgres:15
    environment:
      POSTGRES_DB: bookingdb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports: ["5433:5432"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"

  redis:
    image: redis:7
    ports: ["6379:6379"]

  auth-service:
    build:
      context: ..
      dockerfile: services/auth-service/Dockerfile
    environment:
      DB_USERNAME: postgres
      DB_PASSWORD: postgres
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres-auth:5432/authdb
      JWT_SECRET: changeme-smart-campus-secret
    ports: ["8081:8081"]
    depends_on:
      postgres-auth:
        condition: service_healthy

  booking-service:
    build:
      context: ..
      dockerfile: services/resource-booking-service/Dockerfile
    environment:
      DB_USERNAME: postgres
      DB_PASSWORD: postgres
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres-booking:5432/bookingdb
      RABBITMQ_HOST: rabbitmq
      RABBITMQ_PORT: 5672
      RABBITMQ_USERNAME: guest
      RABBITMQ_PASSWORD: guest
    ports: ["8085:8085"]
    depends_on:
      - postgres-booking
      - rabbitmq

  api-gateway:
    build:
      context: ..
      dockerfile: api-gateway/Dockerfile
    environment:
      JWT_SECRET: changeme-smart-campus-secret-key-2024-minimum-32-chars
      REDIS_HOST: redis
    ports: ["8080:8080"]
    depends_on:
      - auth-service
      - booking-service
```

اجرا:
```bash
docker compose -f docker-compose.minimal.yml up --build
```

---

## ✅ بررسی وضعیت

بعد از اجرا، بررسی کنید:

```bash
# بررسی containers
docker ps

# بررسی logs
docker compose logs auth-service
docker compose logs booking-service
docker compose logs api-gateway
```

---

## 📝 نکات مهم

1. **صبر کنید:** Pull کردن images ممکن است چند دقیقه طول بکشد
2. **اینترنت پایدار:** مطمئن شوید اتصال اینترنت پایدار است
3. **فضای دیسک:** مطمئن شوید فضای کافی دارید (حداقل 5GB)

---

## 🆘 اگر هنوز مشکل دارید

1. لاگ‌های کامل را ببینید:
```bash
docker compose logs > docker-logs.txt 2>&1
```

2. وضعیت Docker را بررسی کنید:
```bash
docker info
docker version
```

3. مشکل را در GitHub Issues یا Stack Overflow جستجو کنید

