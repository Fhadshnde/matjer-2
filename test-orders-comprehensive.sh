#!/bin/bash

# Comprehensive Orders Testing Script
# اختبار شامل لصفحة الطلبات

echo "=== اختبار شامل لصفحة الطلبات ==="
echo "=== Comprehensive Orders Testing ==="
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# API Configuration
BASE_URL="http://localhost:4500"
LOGIN_URL="$BASE_URL/supplier/auth/login"
ORDERS_URL="$BASE_URL/supplier/orders"
PRODUCTS_URL="$BASE_URL/supplier/products"
CUSTOMERS_URL="$BASE_URL/supplier/customers"

# Test credentials
PHONE="07901234567"
PASSWORD="password123"

# Counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to print test results
print_test_result() {
    local test_name="$1"
    local status="$2"
    local message="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [ "$status" = "PASS" ]; then
        echo -e "${GREEN}✅ $test_name: PASSED${NC}"
        if [ -n "$message" ]; then
            echo -e "   $message"
        fi
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ $test_name: FAILED${NC}"
        if [ -n "$message" ]; then
            echo -e "   $message"
        fi
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    echo
}

# Function to authenticate and get token
authenticate() {
    echo "🔐 جاري المصادقة..."
    echo "🔐 Authenticating..."
    
    local response=$(curl -s -X POST "$LOGIN_URL" \
        -H "Content-Type: application/json" \
        -d "{\"phone\":\"$PHONE\",\"password\":\"$PASSWORD\"}")
    
    if [ $? -eq 0 ]; then
        local token=$(echo "$response" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
        if [ -n "$token" ]; then
            echo "✅ تم الحصول على التوكن بنجاح"
            echo "✅ Token obtained successfully"
            echo "TOKEN: $token"
            return 0
        else
            echo "❌ فشل في استخراج التوكن"
            echo "❌ Failed to extract token"
            echo "Response: $response"
            return 1
        fi
    else
        echo "❌ فشل في الاتصال بالخادم"
        echo "❌ Failed to connect to server"
        return 1
    fi
}

# Function to get auth headers
get_auth_headers() {
    echo "Authorization: Bearer $TOKEN"
}

# Function to test orders list
test_orders_list() {
    echo "📋 اختبار قائمة الطلبات..."
    echo "📋 Testing orders list..."
    
    local response=$(curl -s -X GET "$ORDERS_URL" \
        -H "Authorization: Bearer $TOKEN")
    
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$ORDERS_URL" \
        -H "Authorization: Bearer $TOKEN")
    
    if [ "$status_code" = "200" ]; then
        local orders_count=$(echo "$response" | grep -o '"id"' | wc -l)
        print_test_result "قائمة الطلبات" "PASS" "تم جلب $orders_count طلب بنجاح"
        return 0
    else
        print_test_result "قائمة الطلبات" "FAIL" "خطأ HTTP: $status_code - $response"
        return 1
    fi
}

# Function to test orders statistics
test_orders_statistics() {
    echo "📊 اختبار إحصائيات الطلبات..."
    echo "📊 Testing orders statistics..."
    
    local response=$(curl -s -X GET "$ORDERS_URL/statistics" \
        -H "Authorization: Bearer $TOKEN")
    
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$ORDERS_URL/statistics" \
        -H "Authorization: Bearer $TOKEN")
    
    if [ "$status_code" = "200" ]; then
        print_test_result "إحصائيات الطلبات" "PASS" "تم جلب الإحصائيات بنجاح"
        return 0
    else
        print_test_result "إحصائيات الطلبات" "FAIL" "خطأ HTTP: $status_code - $response"
        return 1
    fi
}

# Function to test orders with filters
test_orders_filters() {
    echo "🔍 اختبار فلترة الطلبات..."
    echo "🔍 Testing orders filters..."
    
    # Test status filter
    local response=$(curl -s -X GET "$ORDERS_URL?status=pending" \
        -H "Authorization: Bearer $TOKEN")
    
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$ORDERS_URL?status=pending" \
        -H "Authorization: Bearer $TOKEN")
    
    if [ "$status_code" = "200" ]; then
        print_test_result "فلترة الطلبات" "PASS" "تم فلترة الطلبات بنجاح"
        return 0
    else
        print_test_result "فلترة الطلبات" "FAIL" "خطأ HTTP: $status_code - $response"
        return 1
    fi
}

# Function to create test order
create_test_order() {
    echo "🛒 إنشاء طلب اختبار..."
    echo "🛒 Creating test order..."
    
    # First, get a product ID
    local products_response=$(curl -s -X GET "$PRODUCTS_URL" \
        -H "Authorization: Bearer $TOKEN")
    
    local product_id=$(echo "$products_response" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
    
    if [ -z "$product_id" ]; then
        print_test_result "إنشاء طلب اختبار" "FAIL" "لم يتم العثور على منتج"
        return 1
    fi
    
    # Create order data
    local order_data="{
        \"customerId\": 1,
        \"items\": [
            {
                \"productId\": $product_id,
                \"quantity\": 2,
                \"price\": 100
            }
        ],
        \"shippingAddress\": {
            \"city\": \"بغداد\",
            \"district\": \"الكرادة\",
            \"street\": \"شارع الرشيد\",
            \"buildingNumber\": \"123\",
            \"apartmentNumber\": \"45\",
            \"landmark\": \"قرب جامع الكرادة\"
        },
        \"paymentMethod\": \"cash\",
        \"notes\": \"طلب اختبار\"
    }"
    
    local response=$(curl -s -X POST "$ORDERS_URL" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "$order_data")
    
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$ORDERS_URL" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "$order_data")
    
    if [ "$status_code" = "201" ]; then
        local order_id=$(echo "$response" | grep -o '"id":[0-9]*' | cut -d':' -f2)
        print_test_result "إنشاء طلب اختبار" "PASS" "تم إنشاء الطلب رقم $order_id بنجاح"
        echo "$order_id" > test_order_id.txt
        return 0
    else
        print_test_result "إنشاء طلب اختبار" "FAIL" "خطأ HTTP: $status_code - $response"
        return 1
    fi
}

# Function to test order details
test_order_details() {
    echo "📄 اختبار تفاصيل الطلب..."
    echo "📄 Testing order details..."
    
    if [ ! -f "test_order_id.txt" ]; then
        print_test_result "تفاصيل الطلب" "FAIL" "لم يتم العثور على معرف الطلب"
        return 1
    fi
    
    local order_id=$(cat test_order_id.txt)
    local response=$(curl -s -X GET "$ORDERS_URL/$order_id" \
        -H "Authorization: Bearer $TOKEN")
    
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$ORDERS_URL/$order_id" \
        -H "Authorization: Bearer $TOKEN")
    
    if [ "$status_code" = "200" ]; then
        print_test_result "تفاصيل الطلب" "PASS" "تم جلب تفاصيل الطلب بنجاح"
        return 0
    else
        print_test_result "تفاصيل الطلب" "FAIL" "خطأ HTTP: $status_code - $response"
        return 1
    fi
}

# Function to test update order status
test_update_order_status() {
    echo "🔄 اختبار تحديث حالة الطلب..."
    echo "🔄 Testing update order status..."
    
    if [ ! -f "test_order_id.txt" ]; then
        print_test_result "تحديث حالة الطلب" "FAIL" "لم يتم العثور على معرف الطلب"
        return 1
    fi
    
    local order_id=$(cat test_order_id.txt)
    local update_data='{"status": "confirmed"}'
    
    local response=$(curl -s -X PATCH "$ORDERS_URL/$order_id/status" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "$update_data")
    
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" -X PATCH "$ORDERS_URL/$order_id/status" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "$update_data")
    
    if [ "$status_code" = "200" ]; then
        print_test_result "تحديث حالة الطلب" "PASS" "تم تحديث حالة الطلب بنجاح"
        return 0
    else
        print_test_result "تحديث حالة الطلب" "FAIL" "خطأ HTTP: $status_code - $response"
        return 1
    fi
}

# Function to test order analytics
test_order_analytics() {
    echo "📈 اختبار تحليلات الطلبات..."
    echo "📈 Testing order analytics..."
    
    local response=$(curl -s -X GET "$ORDERS_URL/analytics" \
        -H "Authorization: Bearer $TOKEN")
    
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$ORDERS_URL/analytics" \
        -H "Authorization: Bearer $TOKEN")
    
    if [ "$status_code" = "200" ]; then
        print_test_result "تحليلات الطلبات" "PASS" "تم جلب التحليلات بنجاح"
        return 0
    else
        print_test_result "تحليلات الطلبات" "FAIL" "خطأ HTTP: $status_code - $response"
        return 1
    fi
}

# Function to test order search
test_order_search() {
    echo "🔍 اختبار البحث في الطلبات..."
    echo "🔍 Testing order search..."
    
    local response=$(curl -s -X GET "$ORDERS_URL?search=test" \
        -H "Authorization: Bearer $TOKEN")
    
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$ORDERS_URL?search=test" \
        -H "Authorization: Bearer $TOKEN")
    
    if [ "$status_code" = "200" ]; then
        print_test_result "البحث في الطلبات" "PASS" "تم البحث في الطلبات بنجاح"
        return 0
    else
        print_test_result "البحث في الطلبات" "FAIL" "خطأ HTTP: $status_code - $response"
        return 1
    fi
}

# Function to test order export
test_order_export() {
    echo "📤 اختبار تصدير الطلبات..."
    echo "📤 Testing order export..."
    
    local response=$(curl -s -X GET "$ORDERS_URL/export" \
        -H "Authorization: Bearer $TOKEN")
    
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$ORDERS_URL/export" \
        -H "Authorization: Bearer $TOKEN")
    
    if [ "$status_code" = "200" ]; then
        print_test_result "تصدير الطلبات" "PASS" "تم تصدير الطلبات بنجاح"
        return 0
    else
        print_test_result "تصدير الطلبات" "FAIL" "خطأ HTTP: $status_code - $response"
        return 1
    fi
}

# Function to test order cancellation
test_order_cancellation() {
    echo "❌ اختبار إلغاء الطلب..."
    echo "❌ Testing order cancellation..."
    
    if [ ! -f "test_order_id.txt" ]; then
        print_test_result "إلغاء الطلب" "FAIL" "لم يتم العثور على معرف الطلب"
        return 1
    fi
    
    local order_id=$(cat test_order_id.txt)
    local response=$(curl -s -X PATCH "$ORDERS_URL/$order_id/cancel" \
        -H "Authorization: Bearer $TOKEN")
    
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" -X PATCH "$ORDERS_URL/$order_id/cancel" \
        -H "Authorization: Bearer $TOKEN")
    
    if [ "$status_code" = "200" ]; then
        print_test_result "إلغاء الطلب" "PASS" "تم إلغاء الطلب بنجاح"
        return 0
    else
        print_test_result "إلغاء الطلب" "FAIL" "خطأ HTTP: $status_code - $response"
        return 1
    fi
}

# Main execution
echo "🚀 بدء الاختبار الشامل لصفحة الطلبات"
echo "🚀 Starting Comprehensive Orders Testing"
echo "================================================"
echo

# Step 1: Authenticate
if authenticate; then
    TOKEN=$(echo "$response" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
    print_test_result "المصادقة" "PASS" "تم المصادقة بنجاح"
else
    print_test_result "المصادقة" "FAIL" "فشل في المصادقة"
    exit 1
fi

# Step 2: Test orders list
test_orders_list

# Step 3: Test orders statistics
test_orders_statistics

# Step 4: Test orders filters
test_orders_filters

# Step 5: Create test order
if create_test_order; then
    echo "✅ تم إنشاء طلب اختبار بنجاح"
else
    echo "❌ فشل في إنشاء طلب اختبار"
fi

# Step 6: Test order details
test_order_details

# Step 7: Test update order status
test_update_order_status

# Step 8: Test order analytics
test_order_analytics

# Step 9: Test order search
test_order_search

# Step 10: Test order export
test_order_export

# Step 11: Test order cancellation
test_order_cancellation

# Cleanup
echo "🧹 تنظيف الملفات المؤقتة..."
echo "🧹 Cleaning up temporary files..."
rm -f test_order_id.txt

# Final results
echo "================================================"
echo "📊 نتائج الاختبار النهائية"
echo "📊 Final Test Results"
echo "================================================"
echo -e "إجمالي الاختبارات: ${YELLOW}$TOTAL_TESTS${NC}"
echo -e "Total Tests: ${YELLOW}$TOTAL_TESTS${NC}"
echo -e "نجح: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "فشل: ${RED}$FAILED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    success_rate=100
else
    success_rate=$((PASSED_TESTS * 100 / TOTAL_TESTS))
fi

echo -e "معدل النجاح: ${GREEN}$success_rate%${NC}"
echo -e "Success Rate: ${GREEN}$success_rate%${NC}"

if [ $success_rate -ge 80 ]; then
    echo -e "\n🎉 ${GREEN}تم اختبار صفحة الطلبات بنجاح!${NC}"
    echo -e "🎉 ${GREEN}Orders Page Testing Passed!${NC}"
else
    echo -e "\n⚠️ ${YELLOW}يحتاج إلى تحسين${NC}"
    echo -e "⚠️ ${YELLOW}Needs Improvement${NC}"
fi

echo
echo "================================================"
