#!/bin/bash

# Store Info Complete Test Script
# اختبار شامل لصفحة معلومات المتجر

echo "=========================================="
echo "اختبار شامل لصفحة معلومات المتجر"
echo "Store Info Complete Test"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test configuration
BASE_URL="http://localhost:4500"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdXBwbGllcklkIjoxLCJwaG9uZSI6IjA3OTAxMjM0NTY3IiwibmFtZSI6IlRlc3QgU3VwcGxpZXIiLCJ0eXBlIjoic3VwcGxpZXIiLCJpYXQiOjE3NTgwNTk4NzQsImV4cCI6MTc1ODE0NjI3NH0.4uZ2LPwUn6EOdY1cLuuyW52FRwLUrDJHS8gY2cU8eFk"

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Function to run test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_status="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -e "\n${BLUE}اختبار: $test_name${NC}"
    echo "Command: $test_command"
    
    response=$(eval "$test_command" 2>/dev/null)
    status_code=$(eval "$test_command" -w "%{http_code}" -o /dev/null -s 2>/dev/null)
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ نجح: $test_name${NC}"
        echo "Response: $response" | jq . 2>/dev/null || echo "Response: $response"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ فشل: $test_name${NC}"
        echo "Expected status: $expected_status, Got: $status_code"
        echo "Response: $response" | jq . 2>/dev/null || echo "Response: $response"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

echo -e "\n${YELLOW}1. اختبار جلب معلومات المتجر${NC}"
run_test "جلب معلومات المتجر" \
    "curl -s -X GET '$BASE_URL/supplier/store-info' -H 'Authorization: Bearer $TOKEN'" \
    "200"

echo -e "\n${YELLOW}2. اختبار جلب الملف الشخصي${NC}"
run_test "جلب الملف الشخصي" \
    "curl -s -X GET '$BASE_URL/supplier/profile' -H 'Authorization: Bearer $TOKEN'" \
    "200"

echo -e "\n${YELLOW}3. اختبار تحديث معلومات المتجر${NC}"
run_test "تحديث معلومات المتجر" \
    "curl -s -X PATCH '$BASE_URL/supplier/store-info' -H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json' -d '{
        \"storeName\": \"متجر نايكي المحدث\",
        \"storeDescription\": \"متجر إلكتروني متخصص في المنتجات الرياضية عالية الجودة\",
        \"storeAddress\": \"بغداد - الكرادة - شارع 62 - مجمع الأعمال\",
        \"storeEmail\": \"admin@nike.sa\",
        \"storePhone\": \"07901234567\",
        \"storeSector\": \"ملابس رياضية\"
    }'" \
    "200"

echo -e "\n${YELLOW}4. اختبار تحديث المعلومات البنكية${NC}"
run_test "تحديث المعلومات البنكية" \
    "curl -s -X PATCH '$BASE_URL/supplier/store-info' -H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json' -d '{
        \"bankingInfo\": {
            \"bankName\": \"البنك الأهلي السعودي\",
            \"accountNumber\": \"544200000001234567890000\",
            \"iban\": \"NCBKSAJE\",
            \"accountHolderName\": \"شركة نايكي التجارية\"
        }
    }'" \
    "200"

echo -e "\n${YELLOW}5. اختبار تحديث وسائل التواصل الاجتماعي${NC}"
run_test "تحديث وسائل التواصل الاجتماعي" \
    "curl -s -X PATCH '$BASE_URL/supplier/store-info' -H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json' -d '{
        \"socialMedia\": {
            \"facebook\": \"https://facebook.com/nike\",
            \"instagram\": \"https://instagram.com/nike\",
            \"twitter\": \"https://twitter.com/nike\"
        }
    }'" \
    "200"

echo -e "\n${YELLOW}6. اختبار تحديث معلومات العمل${NC}"
run_test "تحديث معلومات العمل" \
    "curl -s -X PATCH '$BASE_URL/supplier/store-info' -H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json' -d '{
        \"businessInfo\": {
            \"commercialRegistration\": \"1234567890\",
            \"taxNumber\": \"TAX123456789\",
            \"businessType\": \"شركة محدودة المسؤولية\",
            \"establishedYear\": 2020
        }
    }'" \
    "200"

echo -e "\n${YELLOW}7. اختبار تحديث الملف الشخصي${NC}"
run_test "تحديث الملف الشخصي" \
    "curl -s -X PATCH '$BASE_URL/supplier/profile' -H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json' -d '{
        \"name\": \"محمد صالح نايكي\",
        \"contactInfo\": \"mohammed@nike.sa\",
        \"address\": \"بغداد - الكرادة - شارع 62\",
        \"phone\": \"07901234567\"
    }'" \
    "200"

echo -e "\n${YELLOW}8. اختبار جلب معلومات المتجر المحدثة${NC}"
run_test "جلب معلومات المتجر المحدثة" \
    "curl -s -X GET '$BASE_URL/supplier/store-info' -H 'Authorization: Bearer $TOKEN'" \
    "200"

echo -e "\n${YELLOW}9. اختبار جلب الملف الشخصي المحدث${NC}"
run_test "جلب الملف الشخصي المحدث" \
    "curl -s -X GET '$BASE_URL/supplier/profile' -H 'Authorization: Bearer $TOKEN'" \
    "200"

echo -e "\n${YELLOW}10. اختبار تحديث صورة المتجر${NC}"
run_test "تحديث صورة المتجر" \
    "curl -s -X POST '$BASE_URL/supplier/upload/image' -H 'Authorization: Bearer $TOKEN' -F 'image=@/Users/mac/development/nestjs/matjer/test_image.png'" \
    "200"

echo -e "\n${YELLOW}11. اختبار تحديث معلومات المتجر مع صورة${NC}"
run_test "تحديث معلومات المتجر مع صورة" \
    "curl -s -X PATCH '$BASE_URL/supplier/store-info' -H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json' -d '{
        \"storeLogo\": \"https://example.com/logo.png\",
        \"storeBanner\": \"https://example.com/banner.png\"
    }'" \
    "200"

echo -e "\n${YELLOW}12. اختبار تحديث معلومات المتجر - بيانات غير صحيحة${NC}"
run_test "تحديث معلومات المتجر - بيانات غير صحيحة" \
    "curl -s -X PATCH '$BASE_URL/supplier/store-info' -H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json' -d '{
        \"storeEmail\": \"invalid-email\",
        \"storePhone\": \"invalid-phone\"
    }'" \
    "400"

echo -e "\n${YELLOW}13. اختبار تحديث معلومات المتجر - بدون توكن${NC}"
run_test "تحديث معلومات المتجر - بدون توكن" \
    "curl -s -X PATCH '$BASE_URL/supplier/store-info' -H 'Content-Type: application/json' -d '{
        \"storeName\": \"متجر تجريبي\"
    }'" \
    "401"

echo -e "\n${YELLOW}14. اختبار جلب معلومات المتجر - بدون توكن${NC}"
run_test "جلب معلومات المتجر - بدون توكن" \
    "curl -s -X GET '$BASE_URL/supplier/store-info'" \
    "401"

echo -e "\n${YELLOW}15. اختبار تحديث معلومات المتجر - توكن غير صحيح${NC}"
run_test "تحديث معلومات المتجر - توكن غير صحيح" \
    "curl -s -X PATCH '$BASE_URL/supplier/store-info' -H 'Authorization: Bearer invalid-token' -H 'Content-Type: application/json' -d '{
        \"storeName\": \"متجر تجريبي\"
    }'" \
    "401"

# Summary
echo -e "\n=========================================="
echo -e "${BLUE}ملخص النتائج${NC}"
echo "=========================================="
echo -e "إجمالي الاختبارات: $TOTAL_TESTS"
echo -e "${GREEN}نجح: $TESTS_PASSED${NC}"
echo -e "${RED}فشل: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 جميع الاختبارات نجحت!${NC}"
    echo -e "${GREEN}صفحة معلومات المتجر تعمل بشكل مثالي${NC}"
else
    echo -e "\n${YELLOW}⚠️  بعض الاختبارات فشلت${NC}"
    echo -e "${YELLOW}يرجى مراجعة الأخطاء أعلاه${NC}"
fi

echo -e "\n=========================================="
echo -e "${BLUE}اختبار صفحة معلومات المتجر مكتمل${NC}"
echo "=========================================="
