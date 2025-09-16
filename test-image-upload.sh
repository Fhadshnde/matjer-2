#!/bin/bash

# Test Image Upload Functionality
# اختبار وظيفة رفع الصور

echo "=== اختبار وظيفة رفع الصور ==="
echo "=== Testing Image Upload Functionality ==="
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# API Configuration
BASE_URL="http://localhost:4500"
LOGIN_URL="$BASE_URL/supplier/auth/login"
UPLOAD_URL="$BASE_URL/supplier/upload/image"

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

# Function to create a test image file
create_test_image() {
    echo "🖼️ إنشاء صورة اختبار..."
    echo "🖼️ Creating test image..."
    
    # Create a simple 1x1 pixel PNG image using base64
    local png_data="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
    echo "$png_data" | base64 -d > test_image.png
    
    if [ -f "test_image.png" ]; then
        echo "✅ تم إنشاء صورة الاختبار بنجاح"
        echo "✅ Test image created successfully"
        return 0
    else
        echo "❌ فشل في إنشاء صورة الاختبار"
        echo "❌ Failed to create test image"
        return 1
    fi
}

# Function to test image upload
test_image_upload() {
    local token="$1"
    local image_file="$2"
    
    echo "📤 جاري رفع الصورة..."
    echo "📤 Uploading image..."
    
    local response=$(curl -s -X POST "$UPLOAD_URL" \
        -H "Authorization: Bearer $token" \
        -F "file=@$image_file")
    
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$UPLOAD_URL" \
        -H "Authorization: Bearer $token" \
        -F "file=@$image_file")
    
    if [ "$status_code" = "201" ]; then
        local url=$(echo "$response" | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
        if [ -n "$url" ]; then
            print_test_result "رفع الصورة" "PASS" "تم رفع الصورة بنجاح: $url"
            return 0
        else
            print_test_result "رفع الصورة" "FAIL" "فشل في استخراج رابط الصورة"
            return 1
        fi
    else
        print_test_result "رفع الصورة" "FAIL" "خطأ HTTP: $status_code - $response"
        return 1
    fi
}

# Function to test image upload without authentication
test_upload_without_auth() {
    echo "🔒 اختبار رفع الصورة بدون مصادقة..."
    echo "🔒 Testing upload without authentication..."
    
    local response=$(curl -s -X POST "$UPLOAD_URL" \
        -F "file=@test_image.png")
    
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$UPLOAD_URL" \
        -F "file=@test_image.png")
    
    if [ "$status_code" = "401" ]; then
        print_test_result "رفع بدون مصادقة" "PASS" "تم رفض الطلب كما هو متوقع"
        return 0
    else
        print_test_result "رفع بدون مصادقة" "FAIL" "لم يتم رفض الطلب: $status_code"
        return 1
    fi
}

# Function to test invalid file type
test_invalid_file_type() {
    echo "📄 اختبار رفع ملف غير صورة..."
    echo "📄 Testing upload of non-image file..."
    
    # Create a text file
    echo "This is not an image" > test_file.txt
    
    local token="$1"
    local response=$(curl -s -X POST "$UPLOAD_URL" \
        -H "Authorization: Bearer $token" \
        -F "file=@test_file.txt")
    
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$UPLOAD_URL" \
        -H "Authorization: Bearer $token" \
        -F "file=@test_file.txt")
    
    if [ "$status_code" = "400" ]; then
        print_test_result "رفع ملف غير صورة" "PASS" "تم رفض الملف غير الصورة كما هو متوقع"
        return 0
    else
        print_test_result "رفع ملف غير صورة" "FAIL" "لم يتم رفض الملف: $status_code"
        return 1
    fi
}

# Function to test large file upload
test_large_file_upload() {
    echo "📏 اختبار رفع ملف كبير..."
    echo "📏 Testing large file upload..."
    
    # Create a large file (6MB)
    dd if=/dev/zero of=large_file.png bs=1M count=6 2>/dev/null
    
    local token="$1"
    local response=$(curl -s -X POST "$UPLOAD_URL" \
        -H "Authorization: Bearer $token" \
        -F "file=@large_file.png")
    
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$UPLOAD_URL" \
        -H "Authorization: Bearer $token" \
        -F "file=@large_file.png")
    
    if [ "$status_code" = "413" ]; then
        print_test_result "رفع ملف كبير" "PASS" "تم رفض الملف الكبير كما هو متوقع"
        return 0
    else
        print_test_result "رفع ملف كبير" "FAIL" "لم يتم رفض الملف الكبير: $status_code"
        return 1
    fi
}

# Main execution
echo "🚀 بدء اختبار وظيفة رفع الصور"
echo "🚀 Starting Image Upload Functionality Test"
echo "================================================"
echo

# Step 1: Create test image
if create_test_image; then
    print_test_result "إنشاء صورة الاختبار" "PASS" "تم إنشاء صورة الاختبار بنجاح"
else
    print_test_result "إنشاء صورة الاختبار" "FAIL" "فشل في إنشاء صورة الاختبار"
    exit 1
fi

# Step 2: Authenticate
if authenticate; then
    TOKEN=$(echo "$response" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
    print_test_result "المصادقة" "PASS" "تم المصادقة بنجاح"
else
    print_test_result "المصادقة" "FAIL" "فشل في المصادقة"
    exit 1
fi

# Step 3: Test image upload
if test_image_upload "$TOKEN" "test_image.png"; then
    echo "✅ تم رفع الصورة بنجاح"
else
    echo "❌ فشل في رفع الصورة"
fi

# Step 4: Test upload without authentication
test_upload_without_auth

# Step 5: Test invalid file type
test_invalid_file_type "$TOKEN"

# Step 6: Test large file upload
test_large_file_upload "$TOKEN"

# Cleanup
echo "🧹 تنظيف الملفات المؤقتة..."
echo "🧹 Cleaning up temporary files..."
rm -f test_image.png test_file.txt large_file.png

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
    echo -e "\n🎉 ${GREEN}تم اختبار وظيفة رفع الصور بنجاح!${NC}"
    echo -e "🎉 ${GREEN}Image Upload Functionality Test Passed!${NC}"
else
    echo -e "\n⚠️ ${YELLOW}يحتاج إلى تحسين${NC}"
    echo -e "⚠️ ${YELLOW}Needs Improvement${NC}"
fi

echo
echo "================================================"
