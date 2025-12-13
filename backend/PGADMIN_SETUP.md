# راهنمای استفاده از pgAdmin

## 🔗 دسترسی

- **URL**: http://localhost:5050
- **Email**: admin@smartcampus.com
- **Password**: admin

## 📝 مراحل اتصال به دیتابیس

### 1. ورود به pgAdmin
1. به آدرس http://localhost:5050 بروید
2. با ایمیل و پسورد بالا وارد شوید

### 2. اضافه کردن سرور PostgreSQL
1. روی **"Add New Server"** کلیک کنید
2. در تب **"General"**:
   - **Name**: Smart Campus DB
3. در تب **"Connection"**:
   - **Host name/address**: `postgres` (نام container)
   - **Port**: `5432`
   - **Maintenance database**: `smartcampus`
   - **Username**: `postgres`
   - **Password**: `postgres`
4. روی **"Save"** کلیک کنید

## 🔍 کوئری‌های مفید برای مشاهده Saga

### مشاهده تمام سفارش‌ها
```sql
SELECT 
  o.id,
  o.status,
  o.total_amount,
  o.created_at,
  o.updated_at,
  u.email as user_email
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
ORDER BY o.created_at DESC;
```

### مشاهده مراحل Saga برای یک سفارش
```sql
SELECT 
  o.id as order_id,
  o.status as order_status,
  oi.product_id,
  oi.quantity,
  ir.status as inventory_status,
  ir.created_at as inventory_reserved_at
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN inventory_reservations ir ON o.id = ir.order_id
WHERE o.id = 'YOUR_ORDER_ID';
```

### مشاهده سفارش‌های در حال پردازش (Saga در حال اجرا)
```sql
SELECT 
  o.id,
  o.status,
  o.total_amount,
  COUNT(oi.id) as item_count,
  STRING_AGG(ir.status, ', ') as inventory_statuses
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN inventory_reservations ir ON o.id = ir.order_id
WHERE o.status IN ('pending', 'processing')
GROUP BY o.id, o.status, o.total_amount;
```

### مشاهده سفارش‌های موفق (Saga تکمیل شده)
```sql
SELECT 
  o.id,
  o.status,
  o.total_amount,
  o.created_at,
  o.updated_at,
  COUNT(oi.id) as item_count
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.status = 'confirmed'
GROUP BY o.id, o.status, o.total_amount, o.created_at, o.updated_at;
```

### مشاهده سفارش‌های ناموفق (Compensation اجرا شده)
```sql
SELECT 
  o.id,
  o.status,
  o.total_amount,
  ir.status as inventory_status,
  ir.created_at as inventory_released_at
FROM orders o
LEFT JOIN inventory_reservations ir ON o.id = ir.order_id
WHERE o.status = 'failed'
ORDER BY o.created_at DESC;
```

### مشاهده تمام مراحل Saga برای همه سفارش‌ها
```sql
SELECT 
  o.id as order_id,
  o.status as order_status,
  o.total_amount,
  o.created_at as order_created,
  o.updated_at as order_updated,
  CASE 
    WHEN o.status = 'pending' THEN 'Step 1: Order Created'
    WHEN o.status = 'processing' AND ir.status = 'reserved' THEN 'Step 2: Inventory Reserved'
    WHEN o.status = 'processing' AND ir.status = 'confirmed' THEN 'Step 3: Payment Processing'
    WHEN o.status = 'confirmed' THEN 'Step 4: Order Confirmed'
    WHEN o.status = 'failed' THEN 'Compensation: Rollback'
    ELSE 'Unknown'
  END as saga_step,
  ir.status as inventory_status,
  COUNT(oi.id) as item_count
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN inventory_reservations ir ON o.id = ir.order_id
GROUP BY o.id, o.status, o.total_amount, o.created_at, o.updated_at, ir.status
ORDER BY o.created_at DESC;
```

## 📊 جداول مرتبط با Saga

- **orders**: سفارش‌ها و وضعیت آن‌ها
- **order_items**: آیتم‌های هر سفارش
- **inventory_reservations**: رزروهای موجودی (مرحله Saga)
- **products**: محصولات
- **users**: کاربران

## 🎯 نکات مهم

1. **وضعیت سفارش‌ها**:
   - `pending`: سفارش ایجاد شده
   - `processing`: Saga در حال اجرا
   - `confirmed`: Saga تکمیل شده
   - `failed`: Saga با خطا مواجه شده (Compensation)

2. **وضعیت Inventory**:
   - `reserved`: موجودی رزرو شده
   - `confirmed`: موجودی تایید شده
   - `released`: موجودی آزاد شده (Compensation)

3. برای مشاهده real-time تغییرات، کوئری را هر چند ثانیه اجرا کنید.

