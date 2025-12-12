## Testing Checklist

- Auth/JWT
  - Admin creates professor and student; login returns JWT with `roles` + `tenant_id`.
  - Refresh token rotates access token; revoked token rejected.
- Gateway/RBAC
  - Calls without Authorization header are blocked except `/auth/login`.
  - Professor cannot access admin-only endpoints; tenant header is propagated.
- Course/Exam
  - Professor creates course (FR-01) and exam (FR-07) in tenant.
  - Student can fetch exam only inside scheduled window; outside window returns 403.
  - Exam start publishes `exam.started`; Notification consumer receives.
- Marketplace Saga
  - Create product -> add to cart -> create order triggers `order.created`.
  - Inventory reserves; simulate payment success -> `order.confirmed`.
  - Force payment failure -> `order.cancelled` and `inventory.released`.
- Booking Concurrency
  - Two concurrent bookings for same resource/time: second rejected by unique constraint or optimistic lock.
  - Retry with jitter succeeds when window free.
- Circuit Breaker
  - Stop Notification Service; Exam call trips circuit after threshold; subsequent calls return fallback quickly; recovery after service returns.
- Caching/Redis
  - Course list cached; cache invalidated on create/update.
- Health/Monitoring
  - `/actuator/health` returns UP for services; Prometheus endpoints scrape.
- Frontend Mock
  - Shared login page stores JWT and forwards with Authorization header; role-based redirect works.

