# Smart Campus Platform

A microservices-based platform for managing campus resources, bookings, marketplace, exams, and more.

## Project Structure

This project follows a microservices architecture with the following services:
- Auth Service
- User Service
- Resource Booking Service
- Marketplace Service
- Exam Service
- Notification Service
- Dashboard Service
- Shuttle Tracking Service

## Getting Started
# فاز ۱ — وظایف تیم‌ها

## 🟦 تیم 1 — Architecture & API
**مسئولیت‌ها:**
- طراحی C4 diagrams (Context, Container, Component) برای کل سیستم
- نوشتن تصمیمات اصلی معماری (ADRs)
- طراحی APIهای اصلی سرویس‌ها
- هماهنگی بین تیم‌ها  
> این تیم برای تحویل هفته ۱ و ۲ ضروری است.

## 🟩 تیم 2 — Database & Multi-Tenancy (Schema-per-Tenant)
**مسئولیت‌ها:**
- طراحی مدل داده‌ها و ERD
- تصمیم‌گیری درباره multi-tenancy
- طراحی ساختار migrationها
- نوشتن مستند دیتابیس

## 🟨 تیم 3 — Backend Microservices (Auth, Resource, Booking, Marketplace)
**مسئولیت‌ها:**
- پیاده‌سازی اسکلت اصلی سرویس‌ها
- اتصال به RabbitMQ
- پیاده‌سازی Saga برای Marketplace
- جلوگیری از Overbooking

## 🟧 تیم 4 — Infra & Messaging (RabbitMQ, Redis, Docker, Monitoring)
**مسئولیت‌ها:**
- تنظیمات RabbitMQ (Exchanges, Queues)
- تنظیمات Redis برای caching
- Prometheus و Grafana
- Docker-compose کامل پروژه

## Run the full prototype

```bash
cd deployment
docker compose up --build
```
Services included: API Gateway, NGINX course load balancer, Auth, User, Course (2 replicas), Booking, Marketplace/Order, Exam, Notification, RabbitMQ, Redis, Postgres instances, Prometheus, Grafana.

## Demo script (happy path)
1) **Admin login** via gateway `/api/auth/login`.
2) **Admin creates professor and student** via User Service endpoints (JWT roles include `ADMIN`, tenant claim).
3) **Professor creates course** `POST /api/courses` (FR-03) → cached in Redis.
4) **Professor creates exam** `POST /api/exams` (FR-07).
5) **Student login** and **takes exam** `POST /api/exams/submit` within time window; `exam.started` event hits Notification Service (circuit breaker guards downtime).
6) **Admin adds marketplace product** `POST /api/products`; **student purchases** `POST /api/orders` → Saga emits `order.created` → `inventory.reserved` → `payment.succeeded` → `order.confirmed` (or compensation on failure).
7) **Admin books room** `POST /api/bookings`; concurrent booking attempt rejected by DB constraint.

For a minimal frontend mock, open `Smart-Campus-Platform-UI/login-mock.html` and use the gateway URL; JWT is stored in `localStorage` for demo only.

## JWT payload example
```json
{
  "sub": "user-123",
  "email": "student@eng.edu",
  "roles": ["STUDENT"],
  "tenant_id": "faculty_eng",
  "iat": 1710000000,
  "exp": 1710003600
}
```

## Documentation

See `docs/architecture.md`, `docs/c4`, `docs/api-specs`, and `docs/adr` for architecture, diagrams, APIs, and decision records. Testing checklist: `docs/testing-checklist.md`.
