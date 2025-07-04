#!/bin/bash

# Orbit Trails API Test Script
echo "🧪 Testing Orbit Trails API..."

API_URL="http://localhost:3001"

echo "1. Testing Health Check..."
curl -s "$API_URL/api/health" | jq '.' || echo "❌ Health check failed"

echo -e "\n2. Testing Tours API..."
curl -s "$API_URL/api/tours" | jq '.data.tours | length' || echo "❌ Tours API failed"

echo -e "\n3. Testing Contact API..."
curl -s -X POST "$API_URL/api/contact" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"Test message"}' \
  | jq '.success' || echo "❌ Contact API failed"

echo -e "\n4. Testing Custom Tour API..."
curl -s -X POST "$API_URL/api/customize-tour" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2025-08-01",
    "duration": 7,
    "numberOfTravelers": 2,
    "accommodationType": "Luxury",
    "destinations": ["Delhi", "Agra"],
    "budgetRange": "$1000-$2000",
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890"
  }' | jq '.success' || echo "❌ Custom Tour API failed"

echo -e "\n✅ API Tests Complete!"
