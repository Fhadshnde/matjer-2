#!/bin/bash

# ========================================
# COMPREHENSIVE ENDPOINTS TESTING SCRIPT
# ========================================
# اختبار شامل لجميع الـ endpoints في الفرونت إند

BASE_URL="http://localhost:4500"
TEST_SUPPLIER_PHONE="07901234567"
TEST_SUPPLIER_PASSWORD="password123"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results
PASSED=0
FAILED=0
TOTAL=0

# Logging functions
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASSED++))
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    ((FAILED++))
}

log_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Test endpoint function
test_endpoint() {
    local name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    local headers="$5"
    
    ((TOTAL++))
    
    log "Testing: $name"
    
    local curl_cmd="curl -s -w '%{http_code}' -X $method '$BASE_URL$endpoint'"
    
    if [ ! -z "$headers" ]; then
        curl_cmd="$curl_cmd -H \"$headers\""
    fi
    
    if [ ! -z "$data" ]; then
        curl_cmd="$curl_cmd -d '$data'"
    fi
    
    local response=$(eval $curl_cmd)
    local http_code="${response: -3}"
    local body="${response%???}"
    
    # Debug: show the command and response (commented out for cleaner output)
    # log "Command: $curl_cmd"
    # log "Response: $response"
    # log "HTTP Code: $http_code"
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        log_success "$name: PASSED ($http_code)"
        return 0
    else
        log_error "$name: FAILED ($http_code)"
        echo "Response: $body"
        return 1
    fi
}

# Authenticate and get token
authenticate() {
    log "Authenticating..."
    
    local auth_response=$(curl -s -X POST "$BASE_URL/supplier/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"phone\":\"$TEST_SUPPLIER_PHONE\",\"password\":\"$TEST_SUPPLIER_PASSWORD\"}")
    
    # Debug: show full response (commented out for cleaner output)
    # log "Auth response: $auth_response"
    
    local token=$(echo "$auth_response" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
    
    # Alternative method if first one fails
    if [ -z "$token" ]; then
        token=$(echo "$auth_response" | sed -n 's/.*"access_token":"\([^"]*\)".*/\1/p')
    fi
    
    if [ ! -z "$token" ]; then
        log_success "Authentication successful!"
        echo "$token"
        return 0
    else
        log_error "Authentication failed!"
        echo "Response: $auth_response"
        return 1
    fi
}

# Main test function
run_tests() {
    log "Starting comprehensive endpoints testing..."
    
    # Authenticate once
    local token=$(authenticate)
    if [ -z "$token" ]; then
        log_error "Cannot proceed without authentication"
        exit 1
    fi
    
    local auth_header="Authorization: Bearer $token"
    log "Using token: ${token:0:20}..."
    
    echo ""
    log "=========================================="
    log "Testing Dashboard Endpoints"
    log "=========================================="
    
    test_endpoint "Dashboard Overview" "GET" "/supplier/dashboard/overview" "" "$auth_header"
    test_endpoint "Dashboard Charts" "GET" "/supplier/dashboard/charts" "" "$auth_header"
    test_endpoint "Top Products" "GET" "/supplier/dashboard/top-products" "" "$auth_header"
    
    echo ""
    log "=========================================="
    log "Testing Analytics Endpoints"
    log "=========================================="
    
    test_endpoint "Analytics Enhanced" "GET" "/supplier/analytics/enhanced" "" "$auth_header"
    test_endpoint "Analytics Tables Charts" "GET" "/supplier/analytics/tables-charts" "" "$auth_header"
    test_endpoint "Sales Over Time" "GET" "/supplier/sales/over-time" "" "$auth_header"
    
    echo ""
    log "=========================================="
    log "Testing Products Endpoints"
    log "=========================================="
    
    test_endpoint "Products List" "GET" "/supplier/products" "" "$auth_header"
    test_endpoint "Products List (Paginated)" "GET" "/supplier/products?page=1&limit=10" "" "$auth_header"
    
    echo ""
    log "=========================================="
    log "Testing Orders/Invoices Endpoints"
    log "=========================================="
    
    test_endpoint "Invoices Stats" "GET" "/supplier/invoices/stats" "" "$auth_header"
    test_endpoint "Invoices List" "GET" "/supplier/invoices" "" "$auth_header"
    test_endpoint "Invoices List (Paginated)" "GET" "/supplier/invoices?page=1&limit=10" "" "$auth_header"
    
    echo ""
    log "=========================================="
    log "Testing Offers Endpoints"
    log "=========================================="
    
    test_endpoint "Offers List" "GET" "/supplier/offers" "" "$auth_header"
    
    echo ""
    log "=========================================="
    log "Testing Shipping Endpoints"
    log "=========================================="
    
    test_endpoint "Shipping Settings" "GET" "/supplier/shipping/settings" "" "$auth_header"
    test_endpoint "Shipping Areas" "GET" "/supplier/shipping/areas" "" "$auth_header"
    test_endpoint "Free Delivery Offers" "GET" "/supplier/shipping/free-delivery-offers" "" "$auth_header"
    
    echo ""
    log "=========================================="
    log "Testing Profits/Dues Endpoints"
    log "=========================================="
    
    test_endpoint "Dues Enhanced" "GET" "/supplier/dues/enhanced" "" "$auth_header"
    test_endpoint "Profits Overview" "GET" "/supplier/profits/overview" "" "$auth_header"
    test_endpoint "Profits Monthly" "GET" "/supplier/profits/monthly" "" "$auth_header"
    test_endpoint "Profits Daily" "GET" "/supplier/profits/daily" "" "$auth_header"
    
    echo ""
    log "=========================================="
    log "Testing Customer Management Endpoints"
    log "=========================================="
    
    test_endpoint "Customers List" "GET" "/supplier/customers" "" "$auth_header"
    test_endpoint "Customers List (Paginated)" "GET" "/supplier/customers?page=1&limit=10" "" "$auth_header"
    
    echo ""
    log "=========================================="
    log "Testing Merchant Management Endpoints"
    log "=========================================="
    
    test_endpoint "Merchants List" "GET" "/supplier/merchants" "" "$auth_header"
    test_endpoint "Merchants List (Paginated)" "GET" "/supplier/merchants?page=1&limit=10" "" "$auth_header"
    
    echo ""
    log "=========================================="
    log "Testing Support/Tickets Endpoints"
    log "=========================================="
    
    test_endpoint "Support Tickets" "GET" "/supplier/support/tickets" "" "$auth_header"
    
    echo ""
    log "=========================================="
    log "Testing Employee Management Endpoints"
    log "=========================================="
    
    test_endpoint "Employees List" "GET" "/supplier/employees" "" "$auth_header"
    
    echo ""
    log "=========================================="
    log "Testing Notifications/Alerts Endpoints"
    log "=========================================="
    
    test_endpoint "Notifications" "GET" "/supplier/notifications" "" "$auth_header"
    test_endpoint "Alerts" "GET" "/supplier/alerts" "" "$auth_header"
    
    echo ""
    log "=========================================="
    log "Testing Sections/Categories Endpoints"
    log "=========================================="
    
    test_endpoint "Sections" "GET" "/supplier/sections" "" "$auth_header"
    test_endpoint "Categories" "GET" "/supplier/categories" "" "$auth_header"
    
    echo ""
    log "=========================================="
    log "Testing Tickets Endpoints"
    log "=========================================="
    
    test_endpoint "Tickets" "GET" "/supplier/tickets" "" "$auth_header"
    
    # Generate final report
    generate_report
}

# Generate test report
generate_report() {
    echo ""
    echo "============================================================"
    echo "📊 COMPREHENSIVE ENDPOINTS TEST REPORT"
    echo "============================================================"
    echo "Total Tests: $TOTAL"
    echo "Passed: $PASSED ✅"
    echo "Failed: $FAILED ❌"
    
    if [ $TOTAL -gt 0 ]; then
        local success_rate=$((PASSED * 100 / TOTAL))
        echo "Success Rate: $success_rate%"
    fi
    
    echo "============================================================"
    
    if [ $FAILED -eq 0 ]; then
        log_success "🎉 All tests passed! System is fully functional."
    else
        log_error "⚠️  $FAILED tests failed. Please review and fix issues."
    fi
    
    # Save report to file
    cat > "endpoints-test-report.txt" << EOF
COMPREHENSIVE ENDPOINTS TEST REPORT
Generated: $(date)
====================================
Total Tests: $TOTAL
Passed: $PASSED
Failed: $FAILED
Success Rate: $((PASSED * 100 / TOTAL))%
====================================
EOF
    
    log_info "Test report saved to: endpoints-test-report.txt"
}

# Run tests
run_tests
