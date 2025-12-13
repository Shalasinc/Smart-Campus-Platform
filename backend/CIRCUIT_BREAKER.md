# الگوی Circuit Breaker - مستندات پیاده‌سازی

## 📖 مقدمه

Circuit Breaker Pattern برای افزایش Resilience در سیستم‌های توزیع‌شده استفاده می‌شود. این الگو از Cascading Failures جلوگیری می‌کند.

## 🎯 مشکل

وقتی یک سرویس down می‌شود، سرویس‌های دیگر که به آن وابسته هستند، ممکن است:
1. Timeout شوند
2. منابع سیستم را مصرف کنند
3. باعث Cascading Failure شوند

## ⚡ راه‌حل: Circuit Breaker

Circuit Breaker مانند یک کلید برق عمل می‌کند:
- وقتی خطا زیاد می‌شود، Circuit باز می‌شود (Open)
- درخواست‌ها مستقیماً reject می‌شوند
- بعد از مدتی، Circuit نیمه‌باز می‌شود (Half-Open) برای تست
- اگر موفق بود، Circuit بسته می‌شود (Closed)

## 🏗️ پیاده‌سازی

### استفاده در Notification Service

```typescript
import CircuitBreaker from 'opossum';

const breaker = new CircuitBreaker(async () => {
  return await fetch(authServiceUrl);
}, {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000,
});

breaker.fallback(() => {
  return { error: 'Service temporarily unavailable', fallback: true };
});
```

### حالت‌های Circuit Breaker

1. **Closed (بسته)**: درخواست‌ها عادی پردازش می‌شوند
2. **Open (باز)**: درخواست‌ها مستقیماً reject می‌شوند
3. **Half-Open (نیمه‌باز)**: یک درخواست تست ارسال می‌شود

## 📊 Flow Diagram

```
Request → Circuit Breaker
    ↓
Closed? → Yes → Execute Request → Success? → Yes → Return Result
    ↓              ↓                    ↓
   No            Timeout              No
    ↓              ↓                    ↓
  Open          Increment Error      Increment Error
    ↓              ↓                    ↓
  Fallback      Error Threshold?    Error Threshold?
    ↓              ↓                    ↓
  Return        Yes → Open          Yes → Open
```

## 🔍 مثال عملی

### سناریو عادی

1. Notification Service درخواست به Auth Service می‌فرستد
2. Auth Service پاسخ می‌دهد ✅
3. Circuit در حالت Closed باقی می‌ماند

### سناریو خطا

1. Auth Service down می‌شود
2. چند درخواست timeout می‌شوند
3. Error threshold (50%) رسیده می‌شود
4. Circuit باز می‌شود (Open)
5. درخواست‌های بعدی مستقیماً Fallback می‌شوند
6. بعد از 30 ثانیه، Circuit نیمه‌باز می‌شود
7. یک درخواست تست ارسال می‌شود
8. اگر موفق بود، Circuit بسته می‌شود

## 🎓 یادگیری

### چرا Circuit Breaker؟

- **مشکل**: Cascading Failures در سیستم‌های توزیع‌شده
- **راه‌حل**: Circuit Breaker برای جلوگیری از درخواست‌های بی‌فایده
- **مزایا**:
  - جلوگیری از Cascading Failures
  - کاهش Load روی سرویس‌های مشکل‌دار
  - Fast Failure

### پارامترهای مهم

1. **timeout**: زمان انتظار برای پاسخ
2. **errorThresholdPercentage**: درصد خطا برای باز کردن Circuit
3. **resetTimeout**: زمان قبل از Half-Open شدن
4. **fallback**: پاسخ جایگزین در صورت باز بودن Circuit

## 📝 نکات پیاده‌سازی

1. استفاده از کتابخانه `opossum` برای Node.js
2. Logging برای monitoring
3. Fallback mechanism برای graceful degradation
4. تنظیم پارامترها بر اساس نیاز سیستم

## 🔗 منابع

- [Circuit Breaker Pattern - Martin Fowler](https://martinfowler.com/bliki/CircuitBreaker.html)
- [Resilience4j Documentation](https://resilience4j.readme.io/docs/circuitbreaker)

