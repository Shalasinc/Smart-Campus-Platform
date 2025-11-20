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

فاز ۱)
مسئولیت‌ها:
طراحی C4 diagrams (Context, Container, Component) برای کل سیستم
نوشتن تصمیمات اصلی معماری (ADRs)
طراحی APIهای اصلی سرویس‌ها
هماهنگی بین تیم‌ها این تیم برای تحویل هفته ۱ و ۲ ضروری است.
🟩 تیم 2 — Database & Multi-Tenancy (Schema-per-Tenant)
مسئولیت‌ها:
طراحی مدل داده‌ها + ERD
تصمیم‌گیری درباره multi-tenancy
طراحی ساختار migrationها
نوشتن مستند دیتابیس
🟨 تیم 3 — Backend Microservices (Auth, Resource, Booking, Marketplace)
مسئولیت‌ها:
پیاده‌سازی اسکلت اصلی سرویس‌ها
اتصال به RabbitMQ
پیاده‌سازی Saga برای Marketplace
جلوگیری از Overbooking
🟧 تیم 4 — Infra & Messaging (RabbitMQ, Redis, Docker, Monitoring)
مسئولیت‌ها:
تنظیمات RabbitMQ (Exchanges, Queues)
تنظیمات Redis برای caching
Prometheus، Grafana
Docker-compose کامل پروژه


## Documentation

See the `docs/` directory for detailed documentation.

