## Smart University Management Platform – Architecture Overview

This prototype uses Spring Boot microservices with RabbitMQ for events, PostgreSQL for persistence, Redis for cache/session data, and NGINX + Spring Cloud Gateway for ingress and RBAC. All external traffic goes through the API Gateway, which validates JWTs issued by the Auth Service and forwards tenant/role context to downstream services.

### C4 Maps
- Context: `docs/c4/context.mmd`
- Container: `docs/c4/container.mmd`
- Exam/Marketplace components: `docs/c4/component-academic.mmd`

### Core Services & Responsibilities
- **API Gateway**: JWT validation, RBAC path filters, rate limiting, routing, tenant propagation. Connects to NGINX load balancer upstream pool for horizontal scaling.
- **Auth Service**: Admin-driven user provisioning (no self-signup), password hashing, JWT issue/refresh/revoke (tenant + roles claims), public health/ping.
- **User Service**: Profile + role catalog, tenant isolation on every query, admin-only registration endpoints, exposes user lookup for other services via service token.
- **Course Service**: CRUD courses scoped to tenant and professor ownership; horizontally scalable replicas behind NGINX.
- **Exam Service**: Create/schedule exams, enforce exam window checks, publish `exam.started` event, call Notification Service via circuit breaker, accept submissions.
- **Marketplace Service**: Order façade + orchestrator for purchase Saga (reserve inventory → charge payment → confirm order; compensation releases inventory and cancels order). Publishes `order.created`, `payment.succeeded`, `order.confirmed`; listens for `inventory.reserved`, `inventory.released`.
- **Inventory Service**: Reserve/decrement stock per tenant/product; compensating `inventory.released` event on failure.
- **Resource & Booking Service**: Room/resource catalog, booking with optimistic locking and unique time-window constraints; emits booking events.
- **Notification Service**: Email/push mock; subscribes to `exam.started` and order events; circuit-breaker protected when called synchronously.
- **Dashboard Service**: Aggregated read models for UI dashboards (prom metrics, status, counts).
- **Redis**: Short-lived session cache, rate limiting buckets, distributed locks for booking guards.
- **RabbitMQ**: Event bus and Saga choreography (topic exchanges). Exchange examples in `docs/adr/ADR-003-rabbitmq-topology.md`.
- **PostgreSQL**: Primary store (schema-per-tenant strategy) with sample DDL in `docs/adr/ADR-002-multitenancy.md`.

### Event & Saga Flows
- **Exam start notification**: Exam Service publishes `exam.started` → Notification Service consumes and dispatches; synchronous fallback uses Resilience4j circuit breaker to avoid cascading failures.
- **Marketplace purchase Saga (choreography)**:
  1) `order.created` (Marketplace)  
  2) Inventory reserves → emits `inventory.reserved` or `inventory.rejected`  
  3) Marketplace (or Payment mock) charges → emits `payment.succeeded` or `payment.failed`  
  4) Marketplace confirms and emits `order.confirmed`; on any failure emits `order.cancelled` + `inventory.released`.

### Security
- JWT payload example: `{ "sub":"user-123", "email":"a@uni.edu", "roles":["STUDENT"], "tenant_id":"eng", "iat":..., "exp":... }`.
- Gateway enforces Bearer token, extracts roles/tenant, injects headers `X-User-Id`, `X-Tenant-Id`, `X-Roles`.
- RBAC: ADMIN (user provisioning, products, bookings), PROFESSOR (courses, exams, grading), STUDENT (enroll, attempt exams, purchases). Service-level checks guard ownership and tenant scope.
- Exam endpoints enforce time-window + per-request JWT validation; submissions rejected outside schedule.
- HTTPS recommended in production; secrets supplied via env vars/Compose (no hardcoded keys).

### Multi-Tenancy
- Strategy: **schema-per-tenant** per faculty. Tenant ID travels in JWT; gateway forwards `X-Tenant-Id`. Services resolve schema with a tenant-aware DataSource or schema prefix in queries. Sample DDL and resolver code in ADR-002.
- Strong consistency inside a tenant; cross-tenant actions prohibited.

### Non-Functional Concerns
- **Scalability**: Course Service horizontally scaled (`docker-compose.yml` shows replicas + NGINX upstream). Autoscaling in production via K8s HPA on CPU/RPS.
- **Performance**: Redis caches course lists/exam metadata; 95p latency target <400ms for typical reads. HTTP clients use retry+backoff.
- **Reliability**: Resilience4j circuit breaker on Notification calls; retries with jitter on idempotent operations; RabbitMQ durable queues for Saga events.
- **Observability**: Spring Actuator health/metrics, Prometheus scrape config (`deployment/monitoring/prometheus.yml`), Grafana dashboards. Centralized JSON logging suggested via Fluent Bit/ELK.
- **Health & Readiness**: `/actuator/health`, `/actuator/ready` exposed on every service; Gateway route for readiness.

### Data Consistency
- Strong: Auth/User credentials, bookings (enforced by DB constraints + optimistic locking), inventory reservations within a transaction.
- Eventual: Marketplace order status while Saga in-flight; notifications delivery.

### Threat Model (OWASP highlights)
- AuthN/AuthZ: JWT signature verification, role/tenant checks, short expiry, refresh tokens with rotation, logout token revocation list in Redis.
- Input validation: Bean validation, SQL parameters (JPA), size limits on uploads.
- Transport: HTTPS termination at NGINX; HSTS recommended.
- Secrets: Env vars + Compose; recommend Vault/K8s Secrets for prod.
- Auditing: Action logs per tenant for admin-sensitive operations.

### How to Extend to Production
- Orchestrate with Kubernetes (Helm/Kustomize); use StatefulSets for Postgres/RabbitMQ, Deployments for stateless services.
- Externalize secrets (Vault/External Secrets), managed DB/broker services, autoscaling (HPA/KEDA), service mesh (mTLS, traffic policy), centralized tracing (OpenTelemetry).

