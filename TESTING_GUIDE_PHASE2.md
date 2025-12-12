# راهنمای تست فاز 2 - لاگین و مشاهده منابع

این راهنما به شما کمک می‌کند که تست‌های فاز 2 را به درستی انجام دهید.

---

## 📋 پیش‌نیازها

1. ✅ Docker Desktop نصب و در حال اجرا باشد
2. ✅ پورت‌های 8080, 8081, 8085, 5432 آزاد باشند
3. ✅ دسترسی به Terminal/Command Prompt

---

## 🚀 گام 1: اجرای سیستم

### 1.1. باز کردن Terminal
در مسیر پروژه، ترمینال را باز کنید:

```bash
cd "C:\Users\reygh\Downloads\Telegram Desktop\FULL-SCP\Smart-Campus-Platform\deployment"
```

### 1.2. اجرای Docker Compose
```bash
docker compose up --build
```

**⏱️ صبر کنید:** این کار ممکن است 3-5 دقیقه طول بکشد. باید ببینید که:
- ✅ همه سرویس‌ها `Started` شوند
- ✅ پیام‌های خطا نداشته باشید

**نکته:** اگر خطا دیدید، لطفاً پیام خطا را ذخیره کنید.

### 1.3. بررسی وضعیت سرویس‌ها
در یک ترمینال جدید:
```bash
docker compose ps
```

باید سرویس‌های زیر `Up` باشند:
- ✅ `api-gateway` (پورت 8080)
- ✅ `auth-service` (پورت 8081)
- ✅ `booking-service` (پورت 8085)
- ✅ `postgres-auth`
- ✅ `postgres-booking`

---

## 🧪 گام 2: تست با curl (Windows PowerShell)

### 2.1. ثبت‌نام کاربر جدید

**در PowerShell:**
```powershell
$body = @{
    username = "testuser"
    password = "test123"
    role = "STUDENT"
    tenantId = "faculty_eng"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

$response | ConvertTo-Json
```

**یا با curl (اگر نصب دارید):**
```bash
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"testuser\",\"password\":\"test123\",\"role\":\"STUDENT\",\"tenantId\":\"faculty_eng\"}"
```

**✅ پاسخ موفق باید شبیه این باشد:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "STUDENT",
  "username": "testuser",
  "userId": 1
}
```

**💾 Token را ذخیره کنید:**
```powershell
$token = $response.token
Write-Host "Token saved: $token"
```

---

### 2.2. لاگین (اگر قبلاً ثبت‌نام کرده‌اید)

```powershell
$loginBody = @{
    username = "testuser"
    password = "test123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginBody

$token = $loginResponse.token
Write-Host "Login successful! Token: $token"
```

---

### 2.3. مشاهده منابع (با Token)

```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

$resources = Invoke-RestMethod -Uri "http://localhost:8080/api/resources" `
    -Method GET `
    -Headers $headers

$resources | ConvertTo-Json
```

**✅ پاسخ موفق:**
- اگر منابع وجود داشته باشد: لیست منابع
- اگر منابع وجود نداشته باشد: آرایه خالی `[]`

---

## 🧪 گام 3: تست با Postman (راهنمای تصویری)

### 3.1. ثبت‌نام

1. **New Request** بسازید
2. **Method:** `POST`
3. **URL:** `http://localhost:8080/api/auth/register`
4. **Headers:**
   - `Content-Type: application/json`
5. **Body (raw JSON):**
```json
{
  "username": "testuser",
  "password": "test123",
  "role": "STUDENT",
  "tenantId": "faculty_eng"
}
```
6. **Send** بزنید
7. **Token را کپی کنید** از response

---

### 3.2. لاگین

1. **New Request** بسازید
2. **Method:** `POST`
3. **URL:** `http://localhost:8080/api/auth/login`
4. **Headers:**
   - `Content-Type: application/json`
5. **Body (raw JSON):**
```json
{
  "username": "testuser",
  "password": "test123"
}
```
6. **Send** بزنید
7. **Token را کپی کنید**

---

### 3.3. مشاهده منابع

1. **New Request** بسازید
2. **Method:** `GET`
3. **URL:** `http://localhost:8080/api/resources`
4. **Headers:**
   - `Authorization: Bearer <TOKEN_YOU_COPIED>`
5. **Send** بزنید

**✅ باید لیست منابع (یا آرایه خالی) را ببینید**

---

## 🧪 گام 4: تست با Browser (برای مشاهده منابع)

اگر می‌خواهید در مرورگر تست کنید:

1. **Token را از Postman/curl بگیرید**
2. یک Extension مثل **ModHeader** یا **Requestly** نصب کنید
3. Header اضافه کنید: `Authorization: Bearer <TOKEN>`
4. به آدرس بروید: `http://localhost:8080/api/resources`

---

## 🔍 گام 5: بررسی لاگ‌ها

اگر مشکلی پیش آمد، لاگ‌ها را بررسی کنید:

```bash
# لاگ API Gateway
docker compose logs api-gateway

# لاگ Auth Service
docker compose logs auth-service

# لاگ Booking Service
docker compose logs booking-service

# لاگ همه سرویس‌ها
docker compose logs
```

---

## ❌ مشکلات رایج و راه حل

### مشکل 1: "Connection refused" یا "Cannot connect"

**علت:** سرویس‌ها هنوز بالا نیامده‌اند

**راه حل:**
```bash
# بررسی وضعیت
docker compose ps

# اگر سرویسی down است، دوباره بالا بیاورید
docker compose up -d
```

---

### مشکل 2: "401 Unauthorized" در مشاهده منابع

**علت:** Token اشتباه است یا expire شده

**راه حل:**
1. دوباره لاگین کنید و token جدید بگیرید
2. مطمئن شوید که header به این صورت است: `Bearer <TOKEN>` (با فاصله)

---

### مشکل 3: "500 Internal Server Error"

**علت:** مشکل در دیتابیس یا سرویس

**راه حل:**
```bash
# بررسی لاگ‌ها
docker compose logs auth-service
docker compose logs booking-service

# بررسی دیتابیس
docker compose logs postgres-auth
docker compose logs postgres-booking
```

---

### مشکل 4: "User already exists"

**علت:** کاربر قبلاً ثبت‌نام کرده

**راه حل:**
- از username دیگری استفاده کنید
- یا از endpoint `/api/auth/login` استفاده کنید

---

### مشکل 5: لیست منابع خالی است

**این مشکل نیست!** اگر دیتابیس خالی باشد، لیست خالی طبیعی است.

**برای تست کامل‌تر، یک منبع اضافه کنید:**
```powershell
$createResourceBody = @{
    name = "Room 101"
    capacity = 30
    typeId = 1
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/resources" `
    -Method POST `
    -ContentType "application/json" `
    -Headers @{"Authorization" = "Bearer $token"} `
    -Body $createResourceBody
```

**نکته:** برای این کار باید `typeId` معتبر داشته باشید. ابتدا `/api/resource-types` را چک کنید.

---

## ✅ چک‌لیست تست موفق

- [ ] Docker Compose بدون خطا اجرا شد
- [ ] ثبت‌نام کاربر موفق بود و token دریافت شد
- [ ] لاگین موفق بود و token دریافت شد
- [ ] مشاهده منابع با token موفق بود (حتی اگر لیست خالی باشد)
- [ ] بدون token، مشاهده منابع خطای 401 داد

---

## 📝 ثبت نتایج تست

نتایج را در یک فایل ذخیره کنید:

```markdown
# نتایج تست فاز 2

**تاریخ:** [تاریخ تست]
**تست‌کننده:** [نام شما]

## تست 1: ثبت‌نام
- ✅ موفق / ❌ ناموفق
- Response: [کپی response]

## تست 2: لاگین
- ✅ موفق / ❌ ناموفق
- Token: [اول 20 کاراکتر token]

## تست 3: مشاهده منابع
- ✅ موفق / ❌ ناموفق
- تعداد منابع: [عدد]

## مشکلات:
[اگر مشکلی بود، اینجا بنویسید]
```

---

## 🎥 ضبط ویدیو (برای تحویل)

برای تحویل فاز 2، باید یک ویدیوی 3 دقیقه‌ای ضبط کنید:

1. **دقیقه 1:** اجرای `docker compose up`
2. **دقیقه 2:** ثبت‌نام و لاگین در Postman/curl
3. **دقیقه 3:** مشاهده منابع و توضیح کوتاه

**نکات:**
- از OBS یا Windows Game Bar برای ضبط استفاده کنید
- صدا واضح باشد
- صفحه واضح باشد

---

## 🆘 اگر هنوز مشکل دارید

1. لاگ‌ها را بررسی کنید
2. مطمئن شوید همه سرویس‌ها `Up` هستند
3. پورت‌ها را چک کنید که اشغال نباشند
4. دوباره `docker compose down` و `docker compose up --build` کنید

---

**موفق باشید! 🚀**

