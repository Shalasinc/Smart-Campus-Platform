# الگوی Saga Pattern - مستندات پیاده‌سازی

## 📖 مقدمه

الگوی Saga برای مدیریت تراکنش‌های توزیع‌شده در معماری میکروسرویس استفاده می‌شود. در این پروژه، Saga Pattern برای فرآیند خرید پیاده‌سازی شده است.

## 🎯 مشکل

در یک سیستم توزیع‌شده، نمی‌توان از ACID transactions استفاده کرد چون هر سرویس دیتابیس جداگانه دارد. اگر در میانه یک فرآیند چندمرحله‌ای خطا رخ دهد، باید تمام تغییرات قبلی برگردانده شوند (Compensation).

## 🔄 راه‌حل: Saga Pattern

Saga Pattern دو نوع دارد:
1. **Choreography**: هر سرویس خودش رویداد بعدی را publish می‌کند
2. **Orchestration**: یک Orchestrator مرکزی تمام مراحل را مدیریت می‌کند

در این پروژه از **Orchestration** استفاده شده است.

## 🏗️ معماری پیاده‌سازی

### Saga Orchestrator

سرویس `saga-orchestrator` مسئول مدیریت فرآیند خرید است:

```typescript
class OrderSaga {
  async execute(orderData) {
    // 1. Reserve Inventory
    // 2. Process Payment
    // 3. Confirm Order
  }
}
```

### مراحل Saga

1. **Reserve Inventory**
   - کاهش موجودی محصولات
   - در صورت خطا: برگرداندن موجودی

2. **Process Payment**
   - پردازش پرداخت
   - در صورت خطا: بازگشت وجه

3. **Confirm Order**
   - تایید نهایی سفارش
   - در صورت خطا: لغو سفارش

### Compensation

در صورت خطا در هر مرحله، Compensation برای مراحل قبلی اجرا می‌شود:

```typescript
catch (error) {
  // Execute compensation in reverse order
  for (let i = executedSteps.length - 1; i >= 0; i--) {
    await this.executedSteps[i].compensate();
  }
}
```

## 📊 Flow Diagram

```
Order Created
    ↓
Reserve Inventory → Success → Process Payment → Success → Confirm Order
    ↓                    ↓                        ↓
    Fail                 Fail                     Fail
    ↓                    ↓                        ↓
  (Compensation)    (Compensation)          (Compensation)
```

## 🔍 مثال عملی

### سناریو موفق

1. کاربر سفارش ایجاد می‌کند
2. Inventory Service موجودی را رزرو می‌کند ✅
3. Payment Service پرداخت را انجام می‌دهد ✅
4. Order تایید می‌شود ✅

### سناریو خطا

1. کاربر سفارش ایجاد می‌کند
2. Inventory Service موجودی را رزرو می‌کند ✅
3. Payment Service خطا می‌دهد ❌
4. Compensation اجرا می‌شود:
   - موجودی برگردانده می‌شود
   - سفارش لغو می‌شود

## 🎓 یادگیری

### چرا Saga Pattern؟

- **مشکل**: در میکروسرویس‌ها نمی‌توان از Distributed Transactions استفاده کرد
- **راه‌حل**: Saga Pattern با Compensation
- **مزایا**: 
  - Loosely Coupled Services
  - Scalability
  - Fault Tolerance

### چالش‌ها

1. **Idempotency**: هر عملیات باید idempotent باشد
2. **Eventual Consistency**: داده‌ها در نهایت consistent می‌شوند
3. **Compensation Logic**: باید برای هر مرحله compensation نوشته شود

## 📝 نکات پیاده‌سازی

1. استفاده از RabbitMQ برای Event-Driven Communication
2. هر مرحله باید idempotent باشد
3. Compensation باید در reverse order اجرا شود
4. Logging کامل برای debugging

## 🔗 منابع

- [Saga Pattern - Microservices.io](https://microservices.io/patterns/data/saga.html)
- [Distributed Transactions - Martin Kleppmann](https://martin.kleppmann.com/2015/09/26/transactions-at-scale.html)

