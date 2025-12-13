# راهنمای مشاهده Saga Pattern

## 🎯 دسترسی‌ها

### 1. صفحه Saga Viewer در Frontend
- **URL**: http://localhost:8080/saga
- **یا از منو**: "Saga Viewer"
- نمایش بصری وضعیت Saga برای تمام سفارش‌ها

### 2. pgAdmin - مدیریت دیتابیس
- **URL**: http://localhost:5050
- **Email**: admin@smartcampus.com
- **Password**: admin
- برای کوئری زدن و مشاهده جزئیات

## 📊 داده‌های نمونه ایجاد شده

### Rooms (8 اتاق)
- Conference Room A, B (Engineering)
- Lab 101 (Engineering)
- Study Room 1, 2 (Engineering)
- Medical Lab A, B (Medical)
- Examination Room 1 (Medical)

### Bookings (4 رزرو)
- 1 رزرو گذشته (completed)
- 2 رزرو آینده (confirmed)
- 1 رزرو در انتظار (pending)

### Orders (4 سفارش برای Saga)
1. **Order 1**: `confirmed` - Saga تکمیل شده ✅
   - Status: confirmed
   - Inventory: confirmed
   - تمام مراحل انجام شده

2. **Order 2**: `processing` - Saga در حال اجرا ⏳
   - Status: processing
   - Inventory: reserved
   - در انتظار پرداخت

3. **Order 3**: `pending` - Saga شروع شده 🟡
   - Status: pending
   - Inventory: pending
   - تازه ایجاد شده

4. **Order 4**: `failed` - Compensation اجرا شده ❌
   - Status: failed
   - Inventory: released
   - Rollback انجام شده

## 🔍 مشاهده Saga در Frontend

1. وارد سایت شوید: http://localhost:8080
2. از منوی سایدبار "Saga Viewer" را انتخاب کنید
3. می‌توانید:
   - تمام سفارش‌ها را ببینید
   - وضعیت هر مرحله Saga را مشاهده کنید
   - سفارش‌ها را بر اساس status فیلتر کنید
   - جزئیات هر سفارش را ببینید

## 🗄️ مشاهده Saga در pgAdmin

### اتصال به دیتابیس
1. به http://localhost:5050 بروید
2. وارد شوید
3. سرور جدید اضافه کنید:
   - Host: `postgres`
   - Port: `5432`
   - Database: `smartcampus`
   - User: `postgres`
   - Password: `postgres`

### کوئری‌های مفید

#### مشاهده تمام سفارش‌ها با وضعیت Saga
```sql
SELECT 
  o.id,
  o.status,
  o.total_amount,
  o.created_at,
  CASE 
    WHEN o.status = 'pending' THEN 'Step 1: Order Created'
    WHEN o.status = 'processing' THEN 'Step 2-3: Inventory Reserved / Payment Processing'
    WHEN o.status = 'confirmed' THEN 'Step 4: Order Confirmed ✅'
    WHEN o.status = 'failed' THEN 'Compensation: Rollback ❌'
  END as saga_step,
  ir.status as inventory_status
FROM orders o
LEFT JOIN inventory_reservations ir ON o.id = ir.order_id
ORDER BY o.created_at DESC;
```

#### مشاهده جزئیات کامل یک سفارش
```sql
SELECT 
  o.id as order_id,
  o.status as order_status,
  o.total_amount,
  o.created_at as order_created,
  oi.product_id,
  oi.quantity,
  oi.price_at_time,
  p.name as product_name,
  ir.status as inventory_status,
  ir.created_at as inventory_reserved_at
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.id
LEFT JOIN inventory_reservations ir ON o.id = ir.order_id
WHERE o.id = 'YOUR_ORDER_ID';
```

## 🧪 تست Saga Pattern

### ایجاد سفارش جدید (Saga شروع می‌شود)
1. وارد Marketplace شوید
2. یک محصول انتخاب کنید
3. سفارش ایجاد کنید
4. در Saga Viewer می‌توانید مراحل را ببینید:
   - Create Order ✅
   - Reserve Inventory ⏳
   - Process Payment ⏳
   - Confirm Order ⏳

### مشاهده Real-time
- Saga Viewer هر 5 ثانیه به‌روزرسانی می‌شود
- یا در pgAdmin کوئری را چند بار اجرا کنید

## 📝 وضعیت‌های Saga

| Status | معنی | مراحل انجام شده |
|--------|------|-----------------|
| `pending` | سفارش ایجاد شده | ✅ Create Order |
| `processing` | Saga در حال اجرا | ✅ Create Order<br>✅ Reserve Inventory<br>⏳ Process Payment |
| `confirmed` | Saga تکمیل شده | ✅ همه مراحل |
| `failed` | خطا و Compensation | ❌ Rollback انجام شده |

## 🎨 ویژگی‌های Saga Viewer

- ✅ نمایش بصری مراحل Saga
- ✅ فیلتر بر اساس status
- ✅ نمایش جزئیات هر سفارش
- ✅ Auto-refresh هر 5 ثانیه
- ✅ نمایش Inventory Status
- ✅ نمایش Order Items

## 🔗 لینک‌های مفید

- Frontend: http://localhost:8080
- Saga Viewer: http://localhost:8080/saga
- pgAdmin: http://localhost:5050
- API Gateway: http://localhost:3000
- RabbitMQ Management: http://localhost:15672

