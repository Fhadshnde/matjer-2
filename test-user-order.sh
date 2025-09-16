#!/bin/bash

# Test User Order Creation
# اختبار إنشاء طلب من المستخدم

echo "=== اختبار إنشاء طلب من المستخدم ==="
echo "=== Testing User Order Creation ==="
echo

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# API Configuration
BASE_URL="http://localhost:4500"
AUTH_URL="$BASE_URL/auth/login"
CART_URL="$BASE_URL/cart"
ORDERS_URL="$BASE_URL/orders"

# Test credentials
PHONE="07901234568"
PASSWORD="password123"

echo "🔐 تسجيل دخول المستخدم..."
echo "🔐 Logging in user..."

# Login user
LOGIN_RESPONSE=$(curl -s -X POST "$AUTH_URL" \
    -H "Content-Type: application/json" \
    -d "{\"phone\":\"$PHONE\",\"password\":\"$PASSWORD\"}")

if [ $? -eq 0 ]; then
    USER_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
    if [ -n "$USER_TOKEN" ]; then
        echo -e "${GREEN}✅ تم تسجيل الدخول بنجاح${NC}"
        echo "TOKEN: $USER_TOKEN"
    else
        echo -e "${RED}❌ فشل في استخراج التوكن${NC}"
        echo "Response: $LOGIN_RESPONSE"
        exit 1
    fi
else
    echo -e "${RED}❌ فشل في تسجيل الدخول${NC}"
    exit 1
fi

echo
echo "🛒 إضافة منتج إلى السلة..."
echo "🛒 Adding product to cart..."

# Add product to cart
CART_RESPONSE=$(curl -s -X POST "$CART_URL/add" \
    -H "Authorization: Bearer $USER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "productId": 12,
        "quantity": 70,
        "price": 300
    }')

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ تم إضافة المنتج إلى السلة${NC}"
    echo "Cart Response: $CART_RESPONSE" | head -c 200
    echo "..."
else
    echo -e "${RED}❌ فشل في إضافة المنتج إلى السلة${NC}"
    exit 1
fi

echo
echo "📦 إنشاء الطلب..."
echo "📦 Creating order..."

# Create order
ORDER_RESPONSE=$(curl -s -X POST "$ORDERS_URL" \
    -H "Authorization: Bearer $USER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "shippingAddress": "بغداد، الكرادة، شارع الرشيد، مبنى 123، شقة 45",
        "phoneNumber": "07901234568",
        "notes": "طلب اختبار من المستخدم"
    }')

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ تم إنشاء الطلب بنجاح${NC}"
    echo "Order Response: $ORDER_RESPONSE"
    
    # Extract order ID
    ORDER_ID=$(echo "$ORDER_RESPONSE" | grep -o '"id":[0-9]*' | cut -d':' -f2)
    if [ -n "$ORDER_ID" ]; then
        echo "Order ID: $ORDER_ID"
        echo "$ORDER_ID" > order_id.txt
    fi
else
    echo -e "${RED}❌ فشل في إنشاء الطلب${NC}"
    echo "Error: $ORDER_RESPONSE"
    exit 1
fi

echo
echo "✅ تم اختبار إنشاء الطلب بنجاح!"
echo "✅ Order creation test completed successfully!"
