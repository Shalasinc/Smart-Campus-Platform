# Testing Guide

## 🧪 Test Suite

Test files are located in `backend/tests/` directory.

### Running Tests

```bash
cd backend/tests
npm install
npm test
```

### Individual Test Suites

```bash
# Auth Service Tests
npm run test:auth

# Booking Service Tests
npm run test:booking

# Marketplace Service Tests
npm run test:marketplace

# Saga Pattern Tests
npm run test:saga

# Circuit Breaker Tests
npm run test:circuit-breaker
```

## 📋 Test Credentials

After running seed script, you can use these credentials:

- **Student**: `student@example.com` / `password123`
- **Teacher**: `teacher@example.com` / `password123`
- **Admin**: `admin@example.com` / `password123`
- **Seller**: `seller@example.com` / `password123`

## 🌱 Seed Data

To populate the database with test data:

```bash
# Using SQL migration
docker-compose exec postgres psql -U postgres -d smartcampus -f /tmp/seed_data.sql

# Or using Node.js script
cd backend/scripts
npm install
npm run seed
```

## 🎯 Demo Page

Access the demo page at `/demo` route in the frontend to:
- Test Saga Pattern flow
- Test Circuit Breaker
- Check service health
- Visualize service interactions

## 📝 Test Coverage

- ✅ Auth Service (Registration, Login, JWT)
- ✅ Booking Service (Rooms, Bookings, Overbooking Prevention)
- ✅ Marketplace Service (Products, Orders)
- ✅ Saga Pattern (Success Flow, Failure Compensation)
- ✅ Circuit Breaker (Service Resilience)


