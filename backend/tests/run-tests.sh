#!/bin/bash

# Test Runner Script
echo "🧪 Running Smart Campus Platform Tests"
echo "========================================"

API_GATEWAY_URL=${API_GATEWAY_URL:-http://localhost:3000}

# Check if services are running
echo "Checking services..."
curl -s $API_GATEWAY_URL/api/auth/health > /dev/null
if [ $? -ne 0 ]; then
  echo "❌ Services are not running. Please start with: docker-compose up"
  exit 1
fi

echo "✅ Services are running"
echo ""

# Run tests
echo "Running Auth Service Tests..."
npm run test:auth

echo ""
echo "Running Booking Service Tests..."
npm run test:booking

echo ""
echo "Running Marketplace Service Tests..."
npm run test:marketplace

echo ""
echo "Running Saga Pattern Tests..."
npm run test:saga

echo ""
echo "Running Circuit Breaker Tests..."
npm run test:circuit-breaker

echo ""
echo "✅ All tests completed!"


