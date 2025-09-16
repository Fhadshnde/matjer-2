#!/bin/bash

# Profits Export Complete Test Script
# اختبار شامل لميزات تصدير صفحة الأرباح

echo "=========================================="
echo "اختبار شامل لميزات تصدير صفحة الأرباح"
echo "Profits Export Complete Test"
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

echo -e "\n${YELLOW}1. اختبار جلب بيانات الأرباح العامة${NC}"
run_test "جلب بيانات الأرباح العامة" \
    "curl -s -X GET '$BASE_URL/supplier/profits/overview' -H 'Authorization: Bearer $TOKEN'" \
    "200"

echo -e "\n${YELLOW}2. اختبار جلب البيانات الشهرية${NC}"
run_test "جلب البيانات الشهرية" \
    "curl -s -X GET '$BASE_URL/supplier/profits/monthly' -H 'Authorization: Bearer $TOKEN'" \
    "200"

echo -e "\n${YELLOW}3. اختبار جلب البيانات اليومية${NC}"
run_test "جلب البيانات اليومية" \
    "curl -s -X GET '$BASE_URL/supplier/profits/daily' -H 'Authorization: Bearer $TOKEN'" \
    "200"

echo -e "\n${YELLOW}4. اختبار جلب سجل المدفوعات${NC}"
run_test "جلب سجل المدفوعات" \
    "curl -s -X GET '$BASE_URL/supplier/payments/reports' -H 'Authorization: Bearer $TOKEN'" \
    "200"

echo -e "\n${YELLOW}5. اختبار جلب إحصائيات الأرباح${NC}"
run_test "جلب إحصائيات الأرباح" \
    "curl -s -X GET '$BASE_URL/supplier/profits/statistics' -H 'Authorization: Bearer $TOKEN'" \
    "200"

echo -e "\n${YELLOW}6. اختبار جلب تحليلات الأرباح${NC}"
run_test "جلب تحليلات الأرباح" \
    "curl -s -X GET '$BASE_URL/supplier/profits/analytics' -H 'Authorization: Bearer $TOKEN'" \
    "200"

echo -e "\n${YELLOW}7. اختبار جلب تقرير الأرباح الشامل${NC}"
run_test "جلب تقرير الأرباح الشامل" \
    "curl -s -X GET '$BASE_URL/supplier/profits/comprehensive-report' -H 'Authorization: Bearer $TOKEN'" \
    "200"

echo -e "\n${YELLOW}8. اختبار تصدير PDF${NC}"
run_test "تصدير PDF" \
    "curl -s -X POST '$BASE_URL/supplier/profits/export/pdf' -H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json' -d '{
        \"startDate\": \"2024-01-01\",
        \"endDate\": \"2024-12-31\",
        \"includeCharts\": true
    }'" \
    "200"

echo -e "\n${YELLOW}9. اختبار تصدير Excel${NC}"
run_test "تصدير Excel" \
    "curl -s -X POST '$BASE_URL/supplier/profits/export/excel' -H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json' -d '{
        \"startDate\": \"2024-01-01\",
        \"endDate\": \"2024-12-31\",
        \"includeCharts\": true
    }'" \
    "200"

echo -e "\n${YELLOW}10. اختبار تصدير CSV${NC}"
run_test "تصدير CSV" \
    "curl -s -X POST '$BASE_URL/supplier/profits/export/csv' -H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json' -d '{
        \"startDate\": \"2024-01-01\",
        \"endDate\": \"2024-12-31\"
    }'" \
    "200"

echo -e "\n${YELLOW}11. اختبار تصدير PDF - بدون توكن${NC}"
run_test "تصدير PDF - بدون توكن" \
    "curl -s -X POST '$BASE_URL/supplier/profits/export/pdf' -H 'Content-Type: application/json' -d '{
        \"startDate\": \"2024-01-01\",
        \"endDate\": \"2024-12-31\"
    }'" \
    "401"

echo -e "\n${YELLOW}12. اختبار تصدير Excel - بدون توكن${NC}"
run_test "تصدير Excel - بدون توكن" \
    "curl -s -X POST '$BASE_URL/supplier/profits/export/excel' -H 'Content-Type: application/json' -d '{
        \"startDate\": \"2024-01-01\",
        \"endDate\": \"2024-12-31\"
    }'" \
    "401"

echo -e "\n${YELLOW}13. اختبار تصدير CSV - بدون توكن${NC}"
run_test "تصدير CSV - بدون توكن" \
    "curl -s -X POST '$BASE_URL/supplier/profits/export/csv' -H 'Content-Type: application/json' -d '{
        \"startDate\": \"2024-01-01\",
        \"endDate\": \"2024-12-31\"
    }'" \
    "401"

echo -e "\n${YELLOW}14. اختبار تصدير PDF - توكن غير صحيح${NC}"
run_test "تصدير PDF - توكن غير صحيح" \
    "curl -s -X POST '$BASE_URL/supplier/profits/export/pdf' -H 'Authorization: Bearer invalid-token' -H 'Content-Type: application/json' -d '{
        \"startDate\": \"2024-01-01\",
        \"endDate\": \"2024-12-31\"
    }'" \
    "401"

echo -e "\n${YELLOW}15. اختبار تصدير Excel - توكن غير صحيح${NC}"
run_test "تصدير Excel - توكن غير صحيح" \
    "curl -s -X POST '$BASE_URL/supplier/profits/export/excel' -H 'Authorization: Bearer invalid-token' -H 'Content-Type: application/json' -d '{
        \"startDate\": \"2024-01-01\",
        \"endDate\": \"2024-12-31\"
    }'" \
    "401"

echo -e "\n${YELLOW}16. اختبار تصدير CSV - توكن غير صحيح${NC}"
run_test "تصدير CSV - توكن غير صحيح" \
    "curl -s -X POST '$BASE_URL/supplier/profits/export/csv' -H 'Authorization: Bearer invalid-token' -H 'Content-Type: application/json' -d '{
        \"startDate\": \"2024-01-01\",
        \"endDate\": \"2024-12-31\"
    }'" \
    "401"

echo -e "\n${YELLOW}17. اختبار تصدير PDF - بيانات غير صحيحة${NC}"
run_test "تصدير PDF - بيانات غير صحيحة" \
    "curl -s -X POST '$BASE_URL/supplier/profits/export/pdf' -H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json' -d '{
        \"startDate\": \"invalid-date\",
        \"endDate\": \"invalid-date\"
    }'" \
    "400"

echo -e "\n${YELLOW}18. اختبار تصدير Excel - بيانات غير صحيحة${NC}"
run_test "تصدير Excel - بيانات غير صحيحة" \
    "curl -s -X POST '$BASE_URL/supplier/profits/export/excel' -H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json' -d '{
        \"startDate\": \"invalid-date\",
        \"endDate\": \"invalid-date\"
    }'" \
    "400"

echo -e "\n${YELLOW}19. اختبار تصدير CSV - بيانات غير صحيحة${NC}"
run_test "تصدير CSV - بيانات غير صحيحة" \
    "curl -s -X POST '$BASE_URL/supplier/profits/export/csv' -H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json' -d '{
        \"startDate\": \"invalid-date\",
        \"endDate\": \"invalid-date\"
    }'" \
    "400"

echo -e "\n${YELLOW}20. اختبار جلب بيانات الأرباح - بدون توكن${NC}"
run_test "جلب بيانات الأرباح - بدون توكن" \
    "curl -s -X GET '$BASE_URL/supplier/profits/overview'" \
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
    echo -e "${GREEN}ميزات تصدير صفحة الأرباح تعمل بشكل مثالي${NC}"
else
    echo -e "\n${YELLOW}⚠️  بعض الاختبارات فشلت${NC}"
    echo -e "${YELLOW}يرجى مراجعة الأخطاء أعلاه${NC}"
fi

echo -e "\n=========================================="
echo -e "${BLUE}اختبار ميزات تصدير صفحة الأرباح مكتمل${NC}"
echo "=========================================="
