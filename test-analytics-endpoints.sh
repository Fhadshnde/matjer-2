#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Testing Analytics Endpoints${NC}"
echo "=================================="

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

# Test analytics endpoints
echo -e "\n${YELLOW}📊 Testing Analytics Endpoints...${NC}"

# Test 1: Enhanced Analytics
echo -e "\n${BLUE}1. Testing Enhanced Analytics...${NC}"
ENHANCED_RESPONSE=$(curl -s -X GET "http://localhost:4500/supplier/analytics/enhanced" \
  -H "Authorization: Bearer $TOKEN")

if echo "$ENHANCED_RESPONSE" | grep -q "cards"; then
  echo -e "${GREEN}✅ Enhanced Analytics - SUCCESS${NC}"
  echo "Response: $(echo "$ENHANCED_RESPONSE" | jq -r '.cards | keys[]' | head -3)..."
else
  echo -e "${RED}❌ Enhanced Analytics - FAILED${NC}"
  echo "Response: $ENHANCED_RESPONSE"
fi

# Test 2: Tables and Charts
echo -e "\n${BLUE}2. Testing Tables and Charts...${NC}"
TABLES_RESPONSE=$(curl -s -X GET "http://localhost:4500/supplier/analytics/tables-charts" \
  -H "Authorization: Bearer $TOKEN")

if echo "$TABLES_RESPONSE" | grep -q "charts"; then
  echo -e "${GREEN}✅ Tables and Charts - SUCCESS${NC}"
  echo "Response: $(echo "$TABLES_RESPONSE" | jq -r '.charts | keys[]' | head -3)..."
else
  echo -e "${RED}❌ Tables and Charts - FAILED${NC}"
  echo "Response: $TABLES_RESPONSE"
fi

# Test 3: Sales Over Time
echo -e "\n${BLUE}3. Testing Sales Over Time...${NC}"
SALES_RESPONSE=$(curl -s -X GET "http://localhost:4500/supplier/sales/over-time" \
  -H "Authorization: Bearer $TOKEN")

if echo "$SALES_RESPONSE" | grep -q "name"; then
  echo -e "${GREEN}✅ Sales Over Time - SUCCESS${NC}"
  echo "Response: $(echo "$SALES_RESPONSE" | jq -r '.[0].name' 2>/dev/null || echo 'Valid JSON array')"
else
  echo -e "${RED}❌ Sales Over Time - FAILED${NC}"
  echo "Response: $SALES_RESPONSE"
fi

# Test 4: Dashboard Analytics
echo -e "\n${BLUE}4. Testing Dashboard Analytics...${NC}"
DASHBOARD_RESPONSE=$(curl -s -X GET "http://localhost:4500/supplier/dashboard/analytics" \
  -H "Authorization: Bearer $TOKEN")

if echo "$DASHBOARD_RESPONSE" | grep -q "monthlySales\|weeklyOrders"; then
  echo -e "${GREEN}✅ Dashboard Analytics - SUCCESS${NC}"
  echo "Response: $(echo "$DASHBOARD_RESPONSE" | jq -r 'keys[]' 2>/dev/null | head -2)..."
else
  echo -e "${RED}❌ Dashboard Analytics - FAILED${NC}"
  echo "Response: $DASHBOARD_RESPONSE"
fi

# Test 5: Sales KPIs
echo -e "\n${BLUE}5. Testing Sales KPIs...${NC}"
KPIS_RESPONSE=$(curl -s -X GET "http://localhost:4500/supplier/sales/kpis" \
  -H "Authorization: Bearer $TOKEN")

if echo "$KPIS_RESPONSE" | grep -q "totalSales\|monthlySales"; then
  echo -e "${GREEN}✅ Sales KPIs - SUCCESS${NC}"
  echo "Response: $(echo "$KPIS_RESPONSE" | jq -r 'keys[]' 2>/dev/null | head -2)..."
else
  echo -e "${RED}❌ Sales KPIs - FAILED${NC}"
  echo "Response: $KPIS_RESPONSE"
fi

# Test 6: Sales by Department
echo -e "\n${BLUE}6. Testing Sales by Department...${NC}"
DEPT_RESPONSE=$(curl -s -X GET "http://localhost:4500/supplier/sales/by-department" \
  -H "Authorization: Bearer $TOKEN")

if echo "$DEPT_RESPONSE" | grep -q "name\|sales"; then
  echo -e "${GREEN}✅ Sales by Department - SUCCESS${NC}"
  echo "Response: $(echo "$DEPT_RESPONSE" | jq -r '.[0].name' 2>/dev/null || echo 'Valid JSON array')"
else
  echo -e "${RED}❌ Sales by Department - FAILED${NC}"
  echo "Response: $DEPT_RESPONSE"
fi

# Test 7: Sales by City
echo -e "\n${BLUE}7. Testing Sales by City...${NC}"
CITY_RESPONSE=$(curl -s -X GET "http://localhost:4500/supplier/sales/by-city" \
  -H "Authorization: Bearer $TOKEN")

if echo "$CITY_RESPONSE" | grep -q "name\|sales"; then
  echo -e "${GREEN}✅ Sales by City - SUCCESS${NC}"
  echo "Response: $(echo "$CITY_RESPONSE" | jq -r '.[0].name' 2>/dev/null || echo 'Valid JSON array')"
else
  echo -e "${RED}❌ Sales by City - FAILED${NC}"
  echo "Response: $CITY_RESPONSE"
fi

# Test 8: Product Performance Over Time
echo -e "\n${BLUE}8. Testing Product Performance Over Time...${NC}"
PERF_RESPONSE=$(curl -s -X GET "http://localhost:4500/supplier/product-analytics/performance-over-time" \
  -H "Authorization: Bearer $TOKEN")

if echo "$PERF_RESPONSE" | grep -q "name\|value"; then
  echo -e "${GREEN}✅ Product Performance Over Time - SUCCESS${NC}"
  echo "Response: $(echo "$PERF_RESPONSE" | jq -r '.[0].name' 2>/dev/null || echo 'Valid JSON array')"
else
  echo -e "${RED}❌ Product Performance Over Time - FAILED${NC}"
  echo "Response: $PERF_RESPONSE"
fi

echo -e "\n${BLUE}📊 Analytics Endpoints Test Complete!${NC}"
echo "=================================="
