#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Complete Analytics Testing Suite${NC}"
echo "=============================================="

# Get supplier token
echo -e "\n${YELLOW}📝 Authenticating supplier...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "http://localhost:4500/supplier/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "07901234567",
    "password": "password123"
  }')

if echo "$LOGIN_RESPONSE" | grep -q "access_token"; then
  TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
  echo -e "${GREEN}✅ Authentication successful${NC}"
else
  echo -e "${RED}❌ Authentication failed${NC}"
  echo "$LOGIN_RESPONSE"
  exit 1
fi

# Test results tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to test endpoint
test_endpoint() {
  local endpoint_name="$1"
  local endpoint_url="$2"
  local expected_field="$3"
  
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  
  echo -e "\n${BLUE}Testing: $endpoint_name${NC}"
  echo "URL: $endpoint_url"
  
  RESPONSE=$(curl -s -X GET "$endpoint_url" \
    -H "Authorization: Bearer $TOKEN")
  
  if echo "$RESPONSE" | grep -q "$expected_field"; then
    echo -e "${GREEN}✅ $endpoint_name - SUCCESS${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
    
    # Show sample data
    if echo "$RESPONSE" | jq . >/dev/null 2>&1; then
      echo "Sample data: $(echo "$RESPONSE" | jq -r 'keys[0:3] | join(", ")' 2>/dev/null || echo 'Valid JSON')"
    fi
  else
    echo -e "${RED}❌ $endpoint_name - FAILED${NC}"
    echo "Response: $RESPONSE"
    FAILED_TESTS=$((FAILED_TESTS + 1))
  fi
}

echo -e "\n${PURPLE}📊 Testing Core Analytics Endpoints...${NC}"

# Core Analytics
test_endpoint "Enhanced Analytics" "http://localhost:4500/supplier/analytics/enhanced" "cards"
test_endpoint "Tables and Charts" "http://localhost:4500/supplier/analytics/tables-charts" "charts"
test_endpoint "Sales Over Time" "http://localhost:4500/supplier/sales/over-time" "name"

echo -e "\n${PURPLE}📈 Testing Sales Analytics...${NC}"

# Sales Analytics
test_endpoint "Sales KPIs" "http://localhost:4500/supplier/sales/kpis" "totalSales"
test_endpoint "Sales by Department" "http://localhost:4500/supplier/sales/by-department" "name"
test_endpoint "Sales by City" "http://localhost:4500/supplier/sales/by-city" "name"

echo -e "\n${PURPLE}📊 Testing Dashboard Analytics...${NC}"

# Dashboard Analytics
test_endpoint "Dashboard Analytics" "http://localhost:4500/supplier/dashboard/analytics" "monthlySales"
test_endpoint "Product Performance Over Time" "http://localhost:4500/supplier/product-analytics/performance-over-time" "chartData"

echo -e "\n${PURPLE}🔍 Testing Additional Analytics...${NC}"

# Additional Analytics
test_endpoint "Customer Behavior KPIs" "http://localhost:4500/supplier/customer-behavior/kpis" "totalCustomers"
test_endpoint "Customer Behavior Trends" "http://localhost:4500/supplier/customer-behavior/trends" "monthlyData"
test_endpoint "Customer Behavior Funnel" "http://localhost:4500/supplier/customer-behavior/funnel" "stages"

echo -e "\n${PURPLE}📋 Testing Data Quality...${NC}"

# Test data quality for key endpoints
echo -e "\n${YELLOW}🔍 Testing Enhanced Analytics Data Quality...${NC}"
ENHANCED_RESPONSE=$(curl -s -X GET "http://localhost:4500/supplier/analytics/enhanced" \
  -H "Authorization: Bearer $TOKEN")

if echo "$ENHANCED_RESPONSE" | jq . >/dev/null 2>&1; then
  echo -e "${GREEN}✅ Enhanced Analytics - Valid JSON${NC}"
  
  # Check for required fields
  if echo "$ENHANCED_RESPONSE" | jq -e '.cards' >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Cards data present${NC}"
    
    # Count cards
    CARD_COUNT=$(echo "$ENHANCED_RESPONSE" | jq '.cards | keys | length' 2>/dev/null || echo "0")
    echo "Number of cards: $CARD_COUNT"
    
    # Show card titles
    echo "Card titles:"
    echo "$ENHANCED_RESPONSE" | jq -r '.cards | to_entries[] | "  - \(.value.title): \(.value.value)"' 2>/dev/null || echo "  Unable to parse card data"
  else
    echo -e "${RED}❌ Cards data missing${NC}"
  fi
else
  echo -e "${RED}❌ Enhanced Analytics - Invalid JSON${NC}"
fi

echo -e "\n${YELLOW}🔍 Testing Tables and Charts Data Quality...${NC}"
TABLES_RESPONSE=$(curl -s -X GET "http://localhost:4500/supplier/analytics/tables-charts" \
  -H "Authorization: Bearer $TOKEN")

if echo "$TABLES_RESPONSE" | jq . >/dev/null 2>&1; then
  echo -e "${GREEN}✅ Tables and Charts - Valid JSON${NC}"
  
  # Check for charts
  if echo "$TABLES_RESPONSE" | jq -e '.charts' >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Charts data present${NC}"
    
    # Count charts
    CHART_COUNT=$(echo "$TABLES_RESPONSE" | jq '.charts | keys | length' 2>/dev/null || echo "0")
    echo "Number of charts: $CHART_COUNT"
    
    # Show chart types
    echo "Chart types:"
    echo "$TABLES_RESPONSE" | jq -r '.charts | keys[]' 2>/dev/null | sed 's/^/  - /'
  else
    echo -e "${RED}❌ Charts data missing${NC}"
  fi
  
  # Check for most viewed products table
  if echo "$TABLES_RESPONSE" | jq -e '.mostViewedProductsTable' >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Most viewed products table present${NC}"
    
    # Count products
    PRODUCT_COUNT=$(echo "$TABLES_RESPONSE" | jq '.mostViewedProductsTable | length' 2>/dev/null || echo "0")
    echo "Number of products: $PRODUCT_COUNT"
  else
    echo -e "${RED}❌ Most viewed products table missing${NC}"
  fi
else
  echo -e "${RED}❌ Tables and Charts - Invalid JSON${NC}"
fi

echo -e "\n${YELLOW}🔍 Testing Sales Over Time Data Quality...${NC}"
SALES_RESPONSE=$(curl -s -X GET "http://localhost:4500/supplier/sales/over-time" \
  -H "Authorization: Bearer $TOKEN")

if echo "$SALES_RESPONSE" | jq . >/dev/null 2>&1; then
  echo -e "${GREEN}✅ Sales Over Time - Valid JSON${NC}"
  
  # Check if it's an array
  if echo "$SALES_RESPONSE" | jq 'type' 2>/dev/null | grep -q "array"; then
    echo -e "${GREEN}✅ Sales data is an array${NC}"
    
    # Count months
    MONTH_COUNT=$(echo "$SALES_RESPONSE" | jq 'length' 2>/dev/null || echo "0")
    echo "Number of months: $MONTH_COUNT"
    
    # Show sample months
    echo "Sample months:"
    echo "$SALES_RESPONSE" | jq -r '.[0:3] | .[] | "  - \(.name): \(.value) د.ع"' 2>/dev/null || echo "  Unable to parse month data"
  else
    echo -e "${RED}❌ Sales data is not an array${NC}"
  fi
else
  echo -e "${RED}❌ Sales Over Time - Invalid JSON${NC}"
fi

# Summary
echo -e "\n${BLUE}📊 Test Summary${NC}"
echo "=================="
echo -e "Total Tests: ${TOTAL_TESTS}"
echo -e "Passed: ${GREEN}${PASSED_TESTS}${NC}"
echo -e "Failed: ${RED}${FAILED_TESTS}${NC}"

SUCCESS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
echo -e "Success Rate: ${SUCCESS_RATE}%"

if [ $SUCCESS_RATE -ge 80 ]; then
  echo -e "\n${GREEN}🎉 Analytics system is working well!${NC}"
elif [ $SUCCESS_RATE -ge 60 ]; then
  echo -e "\n${YELLOW}⚠️  Analytics system has some issues but is mostly functional${NC}"
else
  echo -e "\n${RED}❌ Analytics system needs attention${NC}"
fi

echo -e "\n${BLUE}📋 Recommendations:${NC}"
echo "1. Check failed endpoints for implementation issues"
echo "2. Verify data quality for successful endpoints"
echo "3. Test frontend integration with these endpoints"
echo "4. Consider adding more comprehensive error handling"

echo -e "\n${PURPLE}🔍 Analytics Testing Complete!${NC}"
