# راهنمای Migration Database

## 📋 Migration Files

Migration files در پوشه `backend/migrations/` قرار دارند و به صورت خودکار هنگام راه‌اندازی PostgreSQL اجرا می‌شوند.

## 🗄️ جداول مورد نیاز

### 1. Users Table (برای Auth Service)

```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  tenant TEXT NOT NULL CHECK (tenant IN ('engineering', 'medical')),
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2. Inventory Reservations Table (برای Inventory Service)

این جدول به صورت خودکار توسط Inventory Service ایجاد می‌شود، اما می‌توانید آن را دستی نیز ایجاد کنید:

```sql
CREATE TABLE IF NOT EXISTS inventory_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  order_id UUID NOT NULL,
  quantity INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('reserved', 'confirmed', 'released')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## 🚀 اجرای Migration

### با Docker Compose

Migration files به صورت خودکار اجرا می‌شوند:

```bash
docker-compose up postgres
```

### دستی

```bash
# اتصال به PostgreSQL
psql -h localhost -U postgres -d smartcampus

# اجرای migration
\i backend/migrations/001_create_users_table.sql
```

## 📝 نکات

1. Migration files باید به ترتیب عددی نام‌گذاری شوند
2. فایل‌های migration در `docker-entrypoint-initdb.d` به صورت خودکار اجرا می‌شوند
3. برای تغییرات بعدی، migration جدید ایجاد کنید


