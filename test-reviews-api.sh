#!/bin/bash

# Test Review API Endpoints
echo "🧪 Testing Orbit Trails Review API Endpoints"
echo "=============================================="

API_BASE="http://localhost:3000/api"

# Test 1: Submit a new review
echo -e "\n📝 Test 1: Submitting a new review..."
curl -X POST "${API_BASE}/reviews" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "rating": 5,
    "description": "This is a test review from API testing script. Great service!"
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.'

# Test 2: Get all approved reviews
echo -e "\n📋 Test 2: Getting all approved reviews..."
curl -X GET "${API_BASE}/reviews" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.'

# Test 3: Get random approved reviews
echo -e "\n🎲 Test 3: Getting random approved reviews (limit 3)..."
curl -X GET "${API_BASE}/reviews/random?limit=3" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.'

# Test 4: Health check
echo -e "\n💓 Test 4: API Health check..."
curl -X GET "${API_BASE}/health" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  -s | jq '.'

echo -e "\n✅ API testing complete!"
echo "Note: Admin endpoints require authentication and are not included in this basic test."
