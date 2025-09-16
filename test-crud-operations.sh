#!/bin/bash

# Comprehensive CRUD Operations Testing Script
BASE_URL="http://localhost:4500"

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
    echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASSED++))
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    ((FAILED++))
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Test endpoint function
test_endpoint() {
    local name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    local expected_status="$5"
    
    ((TOTAL++))
    
    if [ "$method" = "GET" ]; then
        RESPONSE=$(curl -s -w "%{http_code}" -X GET "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $TOKEN")
    elif [ "$method" = "POST" ]; then
        RESPONSE=$(curl -s -w "%{http_code}" -X POST "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data")
    elif [ "$method" = "PATCH" ]; then
        RESPONSE=$(curl -s -w "%{http_code}" -X PATCH "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data")
    elif [ "$method" = "DELETE" ]; then
        RESPONSE=$(curl -s -w "%{http_code}" -X DELETE "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $TOKEN")
    fi
    
    HTTP_CODE="${RESPONSE: -3}"
    BODY="${RESPONSE%???}"

    if [ "$HTTP_CODE" = "$expected_status" ]; then
        log_success "$name: PASSED ($HTTP_CODE)"
        return 0
    else
        log_error "$name: FAILED ($HTTP_CODE)"
        echo "Response: $BODY"
        return 1
    fi
}

# Authenticate
log "🔐 Authenticating..."
AUTH_RESPONSE=$(curl -s -X POST "$BASE_URL/supplier/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"phone":"07901234567","password":"password123"}')

TOKEN=$(echo "$AUTH_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    log_error "Authentication failed!"
    exit 1
fi

log_success "Authentication successful!"

echo ""
log "🧪 Testing CRUD Operations..."

# ========================================
# 1. PRODUCTS CRUD OPERATIONS
# ========================================
echo ""
log "=========================================="
log "Testing Products CRUD Operations"
log "=========================================="

# GET Products List
test_endpoint "GET Products List" "GET" "/supplier/products" "" "200"

# GET Products with pagination
test_endpoint "GET Products (Paginated)" "GET" "/supplier/products?page=1&limit=10" "" "200"

# POST Create Product
PRODUCT_DATA='{
    "name": "Test Product",
    "description": "Test Product Description",
    "price": 100.00,
    "stock": 50,
    "categoryId": 1
}'
test_endpoint "POST Create Product" "POST" "/supplier/products/new" "$PRODUCT_DATA" "201"

# GET Product Details (using existing product ID 3)
test_endpoint "GET Product Details" "GET" "/supplier/products/3" "" "200"

# PATCH Update Product
UPDATE_PRODUCT_DATA='{
    "name": "Updated Test Product",
    "price": 150.00
}'
test_endpoint "PATCH Update Product" "PATCH" "/supplier/products/3" "$UPDATE_PRODUCT_DATA" "200"

# PATCH Update Product Stock
STOCK_DATA='{
    "stock": 75,
    "reason": "Stock update test"
}'
test_endpoint "PATCH Update Product Stock" "PATCH" "/supplier/products/3/stock" "$STOCK_DATA" "200"

# DELETE Product (using existing product ID 3)
test_endpoint "DELETE Product" "DELETE" "/supplier/products/3" "" "200"

# ========================================
# 2. OFFERS CRUD OPERATIONS
# ========================================
echo ""
log "=========================================="
log "Testing Offers CRUD Operations"
log "=========================================="

# GET Offers List
test_endpoint "GET Offers List" "GET" "/supplier/offers" "" "200"

# POST Create Offer
OFFER_DATA='{
    "title": "Test Offer",
    "description": "Test Offer Description",
    "discountType": "percentage",
    "discountValue": 20,
    "startDate": "2025-01-01T00:00:00Z",
    "endDate": "2025-12-31T23:59:59Z",
    "productIds": [3]
}'
test_endpoint "POST Create Offer" "POST" "/supplier/offers" "$OFFER_DATA" "201"

# GET Offer Details (using existing offer ID 12)
test_endpoint "GET Offer Details" "GET" "/supplier/offers/12" "" "200"

# PATCH Update Offer
UPDATE_OFFER_DATA='{
    "title": "Updated Test Offer",
    "discountValue": 25
}'
test_endpoint "PATCH Update Offer" "PATCH" "/supplier/offers/12" "$UPDATE_OFFER_DATA" "200"

# PATCH Toggle Offer Status
test_endpoint "PATCH Toggle Offer Status" "PATCH" "/supplier/offers/12/toggle" "" "200"

# GET Offer Performance
test_endpoint "GET Offer Performance" "GET" "/supplier/offers/12/performance" "" "200"

# DELETE Offer
test_endpoint "DELETE Offer" "DELETE" "/supplier/offers/12" "" "200"

# ========================================
# 3. CUSTOMERS CRUD OPERATIONS
# ========================================
echo ""
log "=========================================="
log "Testing Customers CRUD Operations"
log "=========================================="

# GET Customers List
test_endpoint "GET Customers List" "GET" "/supplier/customers" "" "200"

# GET Customers with pagination
test_endpoint "GET Customers (Paginated)" "GET" "/supplier/customers?page=1&limit=10" "" "200"

# GET Customer Details (assuming customer ID 1 exists)
test_endpoint "GET Customer Details" "GET" "/supplier/customers/1" "" "200"

# GET Customer Orders
test_endpoint "GET Customer Orders" "GET" "/supplier/customers/1/orders" "" "200"

# GET Customer Reviews
test_endpoint "GET Customer Reviews" "GET" "/supplier/customers/1/reviews" "" "200"

# POST Add Customer Note
NOTE_DATA='{
    "note": "Test customer note"
}'
test_endpoint "POST Add Customer Note" "POST" "/supplier/customers/1/notes" "$NOTE_DATA" "201"

# POST Send Customer Notification
NOTIFICATION_DATA='{
    "title": "Test Notification",
    "message": "Test notification message",
    "type": "info"
}'
test_endpoint "POST Send Customer Notification" "POST" "/supplier/customers/1/notifications" "$NOTIFICATION_DATA" "201"

# PATCH Block Customer
BLOCK_DATA='{
    "reason": "Test block reason"
}'
test_endpoint "PATCH Block Customer" "PATCH" "/supplier/customers/1/block" "$BLOCK_DATA" "200"

# ========================================
# 4. MERCHANTS CRUD OPERATIONS
# ========================================
echo ""
log "=========================================="
log "Testing Merchants CRUD Operations"
log "=========================================="

# GET Merchants List
test_endpoint "GET Merchants List" "GET" "/supplier/merchants" "" "200"

# GET Merchants with pagination
test_endpoint "GET Merchants (Paginated)" "GET" "/supplier/merchants?page=1&limit=10" "" "200"

# GET Merchant Details (assuming merchant ID 1 exists)
test_endpoint "GET Merchant Details" "GET" "/supplier/merchants/1" "" "200"

# POST Add Merchant Note
MERCHANT_NOTE_DATA='{
    "note": "Test merchant note"
}'
test_endpoint "POST Add Merchant Note" "POST" "/supplier/merchants/1/notes" "$MERCHANT_NOTE_DATA" "201"

# ========================================
# 5. EMPLOYEES CRUD OPERATIONS
# ========================================
echo ""
log "=========================================="
log "Testing Employees CRUD Operations"
log "=========================================="

# GET Employees List
test_endpoint "GET Employees List" "GET" "/supplier/employees" "" "200"

# POST Create Employee
EMPLOYEE_DATA='{
    "name": "Test Employee",
    "position": "manager",
    "email": "test@example.com",
    "phone": "07901234568",
    "salary": 1000
}'
test_endpoint "POST Create Employee" "POST" "/supplier/employees" "$EMPLOYEE_DATA" "201"

# GET Employee Details (using existing employee ID 6)
test_endpoint "GET Employee Details" "GET" "/supplier/employees/6" "" "200"

# PATCH Update Employee
UPDATE_EMPLOYEE_DATA='{
    "name": "Updated Test Employee",
    "position": "admin"
}'
test_endpoint "PATCH Update Employee" "PATCH" "/supplier/employees/6" "$UPDATE_EMPLOYEE_DATA" "200"

# PATCH Change Employee Password
PASSWORD_DATA='{
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
}'
test_endpoint "PATCH Change Employee Password" "PATCH" "/supplier/employees/6/password" "$PASSWORD_DATA" "200"

# PATCH Change Employee Status
STATUS_DATA='{
    "status": "inactive"
}'
test_endpoint "PATCH Change Employee Status" "PATCH" "/supplier/employees/6/status" "$STATUS_DATA" "200"

# DELETE Employee
test_endpoint "DELETE Employee" "DELETE" "/supplier/employees/6" "" "200"

# ========================================
# 6. SECTIONS/CATEGORIES CRUD OPERATIONS
# ========================================
echo ""
log "=========================================="
log "Testing Sections/Categories CRUD Operations"
log "=========================================="

# GET Sections List
test_endpoint "GET Sections List" "GET" "/supplier/sections" "" "200"

# POST Create Section
SECTION_DATA='{
    "name": "Test Section",
    "categoryId": 1
}'
test_endpoint "POST Create Section" "POST" "/supplier/sections" "$SECTION_DATA" "201"

# GET Categories List
test_endpoint "GET Categories List" "GET" "/supplier/categories" "" "200"

# POST Create Category
CATEGORY_DATA='{
    "name": "Test Category",
    "description": "Test Category Description",
    "sectionId": 1
}'
test_endpoint "POST Create Category" "POST" "/supplier/categories" "$CATEGORY_DATA" "201"

# ========================================
# 7. TICKETS CRUD OPERATIONS
# ========================================
echo ""
log "=========================================="
log "Testing Tickets CRUD Operations"
log "=========================================="

# GET Tickets List
test_endpoint "GET Tickets List" "GET" "/supplier/tickets" "" "200"

# POST Create Ticket
TICKET_DATA='{
    "title": "Test Ticket",
    "description": "Test Ticket Description",
    "priority": "medium",
    "category": "technical"
}'
test_endpoint "POST Create Ticket" "POST" "/supplier/tickets" "$TICKET_DATA" "201"

# GET Ticket Details (assuming ticket ID 1 exists)
test_endpoint "GET Ticket Details" "GET" "/supplier/tickets/1" "" "200"

# PATCH Update Ticket
UPDATE_TICKET_DATA='{
    "status": "in_progress",
    "priority": "high"
}'
test_endpoint "PATCH Update Ticket" "PATCH" "/supplier/tickets/1" "$UPDATE_TICKET_DATA" "200"

# ========================================
# 8. SUPPORT TICKETS CRUD OPERATIONS
# ========================================
echo ""
log "=========================================="
log "Testing Support Tickets CRUD Operations"
log "=========================================="

# GET Support Tickets List
test_endpoint "GET Support Tickets List" "GET" "/supplier/support/tickets" "" "200"

# POST Create Support Ticket
SUPPORT_TICKET_DATA='{
    "title": "Test Support Ticket",
    "description": "Test Support Ticket Description",
    "priority": "high",
    "category": "billing"
}'
test_endpoint "POST Create Support Ticket" "POST" "/supplier/support/tickets" "$SUPPORT_TICKET_DATA" "201"

# GET Support Ticket Details (assuming ticket ID 1 exists)
test_endpoint "GET Support Ticket Details" "GET" "/supplier/support/tickets/1" "" "200"

# POST Reply to Support Ticket
REPLY_DATA='{
    "message": "Test reply message"
}'
test_endpoint "POST Reply to Support Ticket" "POST" "/supplier/support/tickets/1/reply" "$REPLY_DATA" "201"

# PATCH Close Support Ticket
test_endpoint "PATCH Close Support Ticket" "PATCH" "/supplier/support/tickets/1/close" "" "200"

# ========================================
# 9. SHIPPING CRUD OPERATIONS
# ========================================
echo ""
log "=========================================="
log "Testing Shipping CRUD Operations"
log "=========================================="

# GET Shipping Settings
test_endpoint "GET Shipping Settings" "GET" "/supplier/shipping/settings" "" "200"

# GET Shipping Areas
test_endpoint "GET Shipping Areas" "GET" "/supplier/shipping/areas" "" "200"

# POST Create Shipping Area
SHIPPING_AREA_DATA='{
    "name": "Test Area",
    "deliveryFee": 5.00,
    "freeDeliveryThreshold": 50.00,
    "estimatedDeliveryDays": 2
}'
test_endpoint "POST Create Shipping Area" "POST" "/supplier/shipping/areas" "$SHIPPING_AREA_DATA" "201"

# GET Free Delivery Offers
test_endpoint "GET Free Delivery Offers" "GET" "/supplier/shipping/free-delivery-offers" "" "200"

# POST Create Free Delivery Offer
FREE_DELIVERY_DATA='{
    "name": "Test Free Delivery",
    "type": "percentage",
    "value": "10",
    "scope": "all",
    "period": "30 days"
}'
test_endpoint "POST Create Free Delivery Offer" "POST" "/supplier/shipping/free-delivery-offers" "$FREE_DELIVERY_DATA" "201"

# ========================================
# 10. INVOICES/ORDERS CRUD OPERATIONS
# ========================================
echo ""
log "=========================================="
log "Testing Invoices/Orders CRUD Operations"
log "=========================================="

# GET Invoices List
test_endpoint "GET Invoices List" "GET" "/supplier/invoices" "" "200"

# GET Invoices with pagination
test_endpoint "GET Invoices (Paginated)" "GET" "/supplier/invoices?page=1&limit=10" "" "200"

# GET Invoice Details (assuming invoice ID 1 exists)
test_endpoint "GET Invoice Details" "GET" "/supplier/invoices/1" "" "200"

# PATCH Update Invoice Status
INVOICE_STATUS_DATA='{
    "status": "PAID",
    "notes": "Payment received",
    "paidDate": "2025-01-16T10:00:00Z"
}'
test_endpoint "PATCH Update Invoice Status" "PATCH" "/supplier/invoices/1/status" "$INVOICE_STATUS_DATA" "200"

# Generate final report
echo ""
echo "============================================================"
echo "📊 CRUD OPERATIONS TEST REPORT"
echo "============================================================"
echo "Total Tests: $TOTAL"
echo "Passed: $PASSED ✅"
echo "Failed: $FAILED ❌"

if [ $TOTAL -gt 0 ]; then
    success_rate=$((PASSED * 100 / TOTAL))
    echo "Success Rate: $success_rate%"
fi

echo "============================================================"

if [ $FAILED -eq 0 ]; then
    log_success "🎉 All CRUD operations tests passed! System is fully functional."
else
    log_error "⚠️  $FAILED tests failed. Please review and fix issues."
fi

# Save report to file
cat > "crud-test-report.txt" << EOF
CRUD OPERATIONS TEST REPORT
Generated: $(date)
====================================
Total Tests: $TOTAL
Passed: $PASSED
Failed: $FAILED
Success Rate: $((PASSED * 100 / TOTAL))%
====================================
EOF

log "Test report saved to: crud-test-report.txt"
