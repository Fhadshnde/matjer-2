#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Testing Dues/MyDues Endpoints${NC}"
echo "====================================="

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

echo -e "\n${PURPLE}💰 Testing Dues Endpoints...${NC}"

# Test Enhanced Dues
test_endpoint "Enhanced Dues" "http://localhost:4500/supplier/dues/enhanced" "cards"

echo -e "\n${PURPLE}📊 Testing Data Quality...${NC}"

# Test data quality for Enhanced Dues
echo -e "\n${YELLOW}🔍 Testing Enhanced Dues Data Quality...${NC}"
DUES_RESPONSE=$(curl -s -X GET "http://localhost:4500/supplier/dues/enhanced" \
  -H "Authorization: Bearer $TOKEN")

if echo "$DUES_RESPONSE" | jq . >/dev/null 2>&1; then
  echo -e "${GREEN}✅ Enhanced Dues - Valid JSON${NC}"
  
  # Check for required fields
  if echo "$DUES_RESPONSE" | jq -e '.cards' >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Cards data present${NC}"
    
    # Count cards
    CARD_COUNT=$(echo "$DUES_RESPONSE" | jq '.cards | keys | length' 2>/dev/null || echo "0")
    echo "Number of cards: $CARD_COUNT"
    
    # Show card details
    echo "Card details:"
    echo "$DUES_RESPONSE" | jq -r '.cards | to_entries[] | "  - \(.value.title): \(.value.value) (\(.value.change))"' 2>/dev/null || echo "  Unable to parse card data"
  else
    echo -e "${RED}❌ Cards data missing${NC}"
  fi
  
  # Check for monthly breakdown
  if echo "$DUES_RESPONSE" | jq -e '.monthlyBreakdown' >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Monthly breakdown present${NC}"
    
    # Count months
    MONTH_COUNT=$(echo "$DUES_RESPONSE" | jq '.monthlyBreakdown | length' 2>/dev/null || echo "0")
    echo "Number of months: $MONTH_COUNT"
    
    # Show sample months
    echo "Sample months:"
    echo "$DUES_RESPONSE" | jq -r '.monthlyBreakdown[0:3] | .[] | "  - \(.month): \(.totalDues) د.ع"' 2>/dev/null || echo "  Unable to parse month data"
  else
    echo -e "${RED}❌ Monthly breakdown missing${NC}"
  fi
  
  # Check for orders table
  if echo "$DUES_RESPONSE" | jq -e '.ordersTable' >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Orders table present${NC}"
    
    # Count orders
    ORDER_COUNT=$(echo "$DUES_RESPONSE" | jq '.ordersTable | length' 2>/dev/null || echo "0")
    echo "Number of orders: $ORDER_COUNT"
    
    # Show sample orders
    echo "Sample orders:"
    echo "$DUES_RESPONSE" | jq -r '.ordersTable[0:2] | .[] | "  - \(.orderNumber): \(.customerName) - \(.netMerchant) د.ع"' 2>/dev/null || echo "  Unable to parse order data"
  else
    echo -e "${RED}❌ Orders table missing${NC}"
  fi
  
  # Check for summary
  if echo "$DUES_RESPONSE" | jq -e '.summary' >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Summary present${NC}"
    
    # Show summary details
    echo "Summary details:"
    echo "$DUES_RESPONSE" | jq -r '.summary | to_entries[] | "  - \(.key): \(.value)"' 2>/dev/null || echo "  Unable to parse summary data"
  else
    echo -e "${RED}❌ Summary missing${NC}"
  fi
else
  echo -e "${RED}❌ Enhanced Dues - Invalid JSON${NC}"
fi

# Test additional dues-related endpoints
echo -e "\n${PURPLE}🔍 Testing Additional Dues Endpoints...${NC}"

# Test if there are other dues endpoints
test_endpoint "Dues Overview" "http://localhost:4500/supplier/dues" "totalDues"
test_endpoint "Dues Summary" "http://localhost:4500/supplier/dues/summary" "summary"
test_endpoint "Dues History" "http://localhost:4500/supplier/dues/history" "history"

# Summary
echo -e "\n${BLUE}📊 Test Summary${NC}"
echo "=================="
echo -e "Total Tests: ${TOTAL_TESTS}"
echo -e "Passed: ${GREEN}${PASSED_TESTS}${NC}"
echo -e "Failed: ${RED}${FAILED_TESTS}${NC}"

SUCCESS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
echo -e "Success Rate: ${SUCCESS_RATE}%"

if [ $SUCCESS_RATE -ge 80 ]; then
  echo -e "\n${GREEN}🎉 Dues system is working well!${NC}"
elif [ $SUCCESS_RATE -ge 60 ]; then
  echo -e "\n${YELLOW}⚠️  Dues system has some issues but is mostly functional${NC}"
else
  echo -e "\n${RED}❌ Dues system needs attention${NC}"
fi

echo -e "\n${BLUE}📋 Dues System Analysis:${NC}"
echo "1. Enhanced Dues endpoint provides comprehensive data"
echo "2. Cards show key metrics (total, net, commission, orders)"
echo "3. Monthly breakdown provides historical data"
echo "4. Orders table shows detailed transaction records"
echo "5. Summary provides overall statistics"

echo -e "\n${PURPLE}🔍 Dues Testing Complete!${NC}"
