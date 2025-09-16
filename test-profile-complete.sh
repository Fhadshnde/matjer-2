#!/bin/bash

# Profile Complete Test Script
# اختبار شامل لصفحة الملف الشخصي

echo "=========================================="
echo "اختبار شامل لصفحة الملف الشخصي"
echo "Profile Complete Test"
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

echo -e "\n${YELLOW}1. اختبار جلب بيانات الملف الشخصي${NC}"
run_test "جلب بيانات الملف الشخصي" \
    "curl -s -X GET '$BASE_URL/supplier/profile' -H 'Authorization: Bearer $TOKEN'" \
    "200"

echo -e "\n${YELLOW}2. اختبار تحديث بيانات الملف الشخصي${NC}"
run_test "تحديث بيانات الملف الشخصي" \
    "curl -s -X PATCH '$BASE_URL/supplier/profile' -H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json' -d '{
        \"name\": \"محمد صالح نايكي\",
        \"contactInfo\": \"mohammed@nike.sa\",
        \"address\": \"بغداد - الكرادة - شارع 62\",
        \"phone\": \"07901234567\"
    }'" \
    "200"

echo -e "\n${YELLOW}3. اختبار تغيير كلمة المرور${NC}"
run_test "تغيير كلمة المرور" \
    "curl -s -X PATCH '$BASE_URL/supplier/change-password' -H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json' -d '{
        \"currentPassword\": \"password123\",
        \"newPassword\": \"newpassword123\"
    }'" \
    "200"

echo -e "\n${YELLOW}4. اختبار رفع صورة الملف الشخصي${NC}"
run_test "رفع صورة الملف الشخصي" \
    "curl -s -X POST '$BASE_URL/supplier/upload/image' -H 'Authorization: Bearer $TOKEN' -F 'image=@/Users/mac/development/nestjs/matjer/test_image.png'" \
    "200"

echo -e "\n${YELLOW}5. اختبار تحديث إعدادات الإشعارات${NC}"
run_test "تحديث إعدادات الإشعارات" \
    "curl -s -X PATCH '$BASE_URL/supplier/notifications/settings' -H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json' -d '{
        \"orders\": true,
        \"system\": true,
        \"email\": false,
        \"sms\": false,
        \"push\": true
    }'" \
    "200"

echo -e "\n${YELLOW}6. اختبار جلب الجلسات النشطة${NC}"
run_test "جلب الجلسات النشطة" \
    "curl -s -X GET '$BASE_URL/supplier/sessions' -H 'Authorization: Bearer $TOKEN'" \
    "200"

echo -e "\n${YELLOW}7. اختبار إنهاء جلسة${NC}"
run_test "إنهاء جلسة" \
    "curl -s -X DELETE '$BASE_URL/supplier/sessions/1' -H 'Authorization: Bearer $TOKEN'" \
    "200"

echo -e "\n${YELLOW}8. اختبار تحديث بيانات الملف الشخصي - بيانات غير صحيحة${NC}"
run_test "تحديث بيانات الملف الشخصي - بيانات غير صحيحة" \
    "curl -s -X PATCH '$BASE_URL/supplier/profile' -H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json' -d '{
        \"name\": \"\",
        \"contactInfo\": \"invalid-email\",
        \"phone\": \"invalid-phone\"
    }'" \
    "400"

echo -e "\n${YELLOW}9. اختبار تغيير كلمة المرور - كلمات مرور غير متطابقة${NC}"
run_test "تغيير كلمة المرور - كلمات مرور غير متطابقة" \
    "curl -s -X PATCH '$BASE_URL/supplier/change-password' -H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json' -d '{
        \"currentPassword\": \"password123\",
        \"newPassword\": \"newpassword123\",
        \"confirmPassword\": \"differentpassword\"
    }'" \
    "400"

echo -e "\n${YELLOW}10. اختبار جلب بيانات الملف الشخصي - بدون توكن${NC}"
run_test "جلب بيانات الملف الشخصي - بدون توكن" \
    "curl -s -X GET '$BASE_URL/supplier/profile'" \
    "401"

echo -e "\n${YELLOW}11. اختبار تحديث بيانات الملف الشخصي - بدون توكن${NC}"
run_test "تحديث بيانات الملف الشخصي - بدون توكن" \
    "curl -s -X PATCH '$BASE_URL/supplier/profile' -H 'Content-Type: application/json' -d '{
        \"name\": \"محمد صالح\"
    }'" \
    "401"

echo -e "\n${YELLOW}12. اختبار تغيير كلمة المرور - بدون توكن${NC}"
run_test "تغيير كلمة المرور - بدون توكن" \
    "curl -s -X PATCH '$BASE_URL/supplier/change-password' -H 'Content-Type: application/json' -d '{
        \"currentPassword\": \"password123\",
        \"newPassword\": \"newpassword123\"
    }'" \
    "401"

echo -e "\n${YELLOW}13. اختبار رفع صورة الملف الشخصي - بدون توكن${NC}"
run_test "رفع صورة الملف الشخصي - بدون توكن" \
    "curl -s -X POST '$BASE_URL/supplier/upload/image' -F 'image=@/Users/mac/development/nestjs/matjer/test_image.png'" \
    "401"

echo -e "\n${YELLOW}14. اختبار تحديث إعدادات الإشعارات - بدون توكن${NC}"
run_test "تحديث إعدادات الإشعارات - بدون توكن" \
    "curl -s -X PATCH '$BASE_URL/supplier/notifications/settings' -H 'Content-Type: application/json' -d '{
        \"orders\": true
    }'" \
    "401"

echo -e "\n${YELLOW}15. اختبار جلب الجلسات النشطة - بدون توكن${NC}"
run_test "جلب الجلسات النشطة - بدون توكن" \
    "curl -s -X GET '$BASE_URL/supplier/sessions'" \
    "401"

echo -e "\n${YELLOW}16. اختبار إنهاء جلسة - بدون توكن${NC}"
run_test "إنهاء جلسة - بدون توكن" \
    "curl -s -X DELETE '$BASE_URL/supplier/sessions/1'" \
    "401"

echo -e "\n${YELLOW}17. اختبار جلب بيانات الملف الشخصي - توكن غير صحيح${NC}"
run_test "جلب بيانات الملف الشخصي - توكن غير صحيح" \
    "curl -s -X GET '$BASE_URL/supplier/profile' -H 'Authorization: Bearer invalid-token'" \
    "401"

echo -e "\n${YELLOW}18. اختبار تحديث بيانات الملف الشخصي - توكن غير صحيح${NC}"
run_test "تحديث بيانات الملف الشخصي - توكن غير صحيح" \
    "curl -s -X PATCH '$BASE_URL/supplier/profile' -H 'Authorization: Bearer invalid-token' -H 'Content-Type: application/json' -d '{
        \"name\": \"محمد صالح\"
    }'" \
    "401"

echo -e "\n${YELLOW}19. اختبار تغيير كلمة المرور - توكن غير صحيح${NC}"
run_test "تغيير كلمة المرور - توكن غير صحيح" \
    "curl -s -X PATCH '$BASE_URL/supplier/change-password' -H 'Authorization: Bearer invalid-token' -H 'Content-Type: application/json' -d '{
        \"currentPassword\": \"password123\",
        \"newPassword\": \"newpassword123\"
    }'" \
    "401"

echo -e "\n${YELLOW}20. اختبار رفع صورة الملف الشخصي - توكن غير صحيح${NC}"
run_test "رفع صورة الملف الشخصي - توكن غير صحيح" \
    "curl -s -X POST '$BASE_URL/supplier/upload/image' -H 'Authorization: Bearer invalid-token' -F 'image=@/Users/mac/development/nestjs/matjer/test_image.png'" \
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
    echo -e "${GREEN}صفحة الملف الشخصي تعمل بشكل مثالي${NC}"
else
    echo -e "\n${YELLOW}⚠️  بعض الاختبارات فشلت${NC}"
    echo -e "${YELLOW}يرجى مراجعة الأخطاء أعلاه${NC}"
fi

echo -e "\n=========================================="
echo -e "${BLUE}اختبار صفحة الملف الشخصي مكتمل${NC}"
echo "=========================================="
