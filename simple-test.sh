#!/bin/bash

# Simple endpoint testing script
BASE_URL="http://localhost:4500"

echo "🔐 Authenticating..."
AUTH_RESPONSE=$(curl -s -X POST "$BASE_URL/supplier/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"phone":"07901234567","password":"password123"}')

echo "Auth response: $AUTH_RESPONSE"

TOKEN=$(echo "$AUTH_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
echo "Extracted token: ${TOKEN:0:50}..."

if [ -z "$TOKEN" ]; then
    echo "❌ Authentication failed!"
    exit 1
fi

echo "✅ Authentication successful!"

# Test a few endpoints
echo ""
echo "🧪 Testing endpoints..."

# Dashboard Overview
echo "Testing Dashboard Overview..."
RESPONSE=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/supplier/dashboard/overview" \
    -H "Authorization: Bearer $TOKEN")
HTTP_CODE="${RESPONSE: -3}"
BODY="${RESPONSE%???}"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Dashboard Overview: PASSED ($HTTP_CODE)"
else
    echo "❌ Dashboard Overview: FAILED ($HTTP_CODE)"
    echo "Response: $BODY"
fi

# Products List
echo "Testing Products List..."
RESPONSE=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/supplier/products" \
    -H "Authorization: Bearer $TOKEN")
HTTP_CODE="${RESPONSE: -3}"
BODY="${RESPONSE%???}"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Products List: PASSED ($HTTP_CODE)"
else
    echo "❌ Products List: FAILED ($HTTP_CODE)"
    echo "Response: $BODY"
fi

# Shipping Settings
echo "Testing Shipping Settings..."
RESPONSE=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/supplier/shipping/settings" \
    -H "Authorization: Bearer $TOKEN")
HTTP_CODE="${RESPONSE: -3}"
BODY="${RESPONSE%???}"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Shipping Settings: PASSED ($HTTP_CODE)"
else
    echo "❌ Shipping Settings: FAILED ($HTTP_CODE)"
    echo "Response: $BODY"
fi

# Customers List
echo "Testing Customers List..."
RESPONSE=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/supplier/customers" \
    -H "Authorization: Bearer $TOKEN")
HTTP_CODE="${RESPONSE: -3}"
BODY="${RESPONSE%???}"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Customers List: PASSED ($HTTP_CODE)"
else
    echo "❌ Customers List: FAILED ($HTTP_CODE)"
    echo "Response: $BODY"
fi

# Merchants List
echo "Testing Merchants List..."
RESPONSE=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/supplier/merchants" \
    -H "Authorization: Bearer $TOKEN")
HTTP_CODE="${RESPONSE: -3}"
BODY="${RESPONSE%???}"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Merchants List: PASSED ($HTTP_CODE)"
else
    echo "❌ Merchants List: FAILED ($HTTP_CODE)"
    echo "Response: $BODY"
fi

echo ""
echo "🎉 Testing completed!"
