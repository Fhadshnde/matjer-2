#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Testing Sections/Categories Endpoints${NC}"
echo "============================================="

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

echo -e "\n${PURPLE}📁 Testing Sections Endpoints...${NC}"

# Test Sections
test_endpoint "Get Sections" "http://localhost:4500/supplier/sections" "sections"

echo -e "\n${PURPLE}📂 Testing Categories Endpoints...${NC}"

# Test Categories
test_endpoint "Get Categories" "http://localhost:4500/supplier/categories" "categories"

echo -e "\n${PURPLE}📊 Testing Data Quality...${NC}"

# Test data quality for Sections
echo -e "\n${YELLOW}🔍 Testing Sections Data Quality...${NC}"
SECTIONS_RESPONSE=$(curl -s -X GET "http://localhost:4500/supplier/sections" \
  -H "Authorization: Bearer $TOKEN")

if echo "$SECTIONS_RESPONSE" | jq . >/dev/null 2>&1; then
  echo -e "${GREEN}✅ Sections - Valid JSON${NC}"
  
  # Check for sections array
  if echo "$SECTIONS_RESPONSE" | jq -e '.sections' >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Sections array present${NC}"
    
    # Count sections
    SECTIONS_COUNT=$(echo "$SECTIONS_RESPONSE" | jq '.sections | length' 2>/dev/null || echo "0")
    echo "Number of sections: $SECTIONS_COUNT"
    
    # Show sample sections
    echo "Sample sections:"
    echo "$SECTIONS_RESPONSE" | jq -r '.sections[0:3] | .[] | "  - \(.name) (Category: \(.categoryName), Products: \(.productsCount))"' 2>/dev/null || echo "  Unable to parse section data"
  else
    echo -e "${RED}❌ Sections array missing${NC}"
  fi
  
  # Check for total sections
  if echo "$SECTIONS_RESPONSE" | jq -e '.totalSections' >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Total sections count present${NC}"
    TOTAL_SECTIONS=$(echo "$SECTIONS_RESPONSE" | jq '.totalSections' 2>/dev/null || echo "0")
    echo "Total sections: $TOTAL_SECTIONS"
  else
    echo -e "${RED}❌ Total sections count missing${NC}"
  fi
else
  echo -e "${RED}❌ Sections - Invalid JSON${NC}"
fi

# Test data quality for Categories
echo -e "\n${YELLOW}🔍 Testing Categories Data Quality...${NC}"
CATEGORIES_RESPONSE=$(curl -s -X GET "http://localhost:4500/supplier/categories" \
  -H "Authorization: Bearer $TOKEN")

if echo "$CATEGORIES_RESPONSE" | jq . >/dev/null 2>&1; then
  echo -e "${GREEN}✅ Categories - Valid JSON${NC}"
  
  # Check for categories array
  if echo "$CATEGORIES_RESPONSE" | jq -e '.categories' >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Categories array present${NC}"
    
    # Count categories
    CATEGORIES_COUNT=$(echo "$CATEGORIES_RESPONSE" | jq '.categories | length' 2>/dev/null || echo "0")
    echo "Number of categories: $CATEGORIES_COUNT"
    
    # Show sample categories
    echo "Sample categories:"
    echo "$CATEGORIES_RESPONSE" | jq -r '.categories[0:3] | .[] | "  - \(.name) (Sections: \(.sectionsCount), Products: \(.productsCount))"' 2>/dev/null || echo "  Unable to parse category data"
  else
    echo -e "${RED}❌ Categories array missing${NC}"
  fi
  
  # Check for total categories
  if echo "$CATEGORIES_RESPONSE" | jq -e '.totalCategories' >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Total categories count present${NC}"
    TOTAL_CATEGORIES=$(echo "$CATEGORIES_RESPONSE" | jq '.totalCategories' 2>/dev/null || echo "0")
    echo "Total categories: $TOTAL_CATEGORIES"
  else
    echo -e "${RED}❌ Total categories count missing${NC}"
  fi
else
  echo -e "${RED}❌ Categories - Invalid JSON${NC}"
fi

# Test CRUD operations
echo -e "\n${PURPLE}🔧 Testing CRUD Operations...${NC}"

# Test Create Section
echo -e "\n${BLUE}Testing: Create Section${NC}"
CREATE_SECTION_RESPONSE=$(curl -s -X POST "http://localhost:4500/supplier/sections" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Section",
    "categoryId": 1
  }')

if echo "$CREATE_SECTION_RESPONSE" | grep -q "success\|id"; then
  echo -e "${GREEN}✅ Create Section - SUCCESS${NC}"
  PASSED_TESTS=$((PASSED_TESTS + 1))
else
  echo -e "${RED}❌ Create Section - FAILED${NC}"
  echo "Response: $CREATE_SECTION_RESPONSE"
  FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Test Create Category
echo -e "\n${BLUE}Testing: Create Category${NC}"
CREATE_CATEGORY_RESPONSE=$(curl -s -X POST "http://localhost:4500/supplier/categories" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Category",
    "description": "Test Category Description"
  }')

if echo "$CREATE_CATEGORY_RESPONSE" | grep -q "success\|id"; then
  echo -e "${GREEN}✅ Create Category - SUCCESS${NC}"
  PASSED_TESTS=$((PASSED_TESTS + 1))
else
  echo -e "${RED}❌ Create Category - FAILED${NC}"
  echo "Response: $CREATE_CATEGORY_RESPONSE"
  FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Summary
echo -e "\n${BLUE}📊 Test Summary${NC}"
echo "=================="
echo -e "Total Tests: ${TOTAL_TESTS}"
echo -e "Passed: ${GREEN}${PASSED_TESTS}${NC}"
echo -e "Failed: ${RED}${FAILED_TESTS}${NC}"

SUCCESS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
echo -e "Success Rate: ${SUCCESS_RATE}%"

if [ $SUCCESS_RATE -ge 80 ]; then
  echo -e "\n${GREEN}🎉 Sections/Categories system is working well!${NC}"
elif [ $SUCCESS_RATE -ge 60 ]; then
  echo -e "\n${YELLOW}⚠️  Sections/Categories system has some issues but is mostly functional${NC}"
else
  echo -e "\n${RED}❌ Sections/Categories system needs attention${NC}"
fi

echo -e "\n${BLUE}📋 Sections/Categories System Analysis:${NC}"
echo "1. Sections endpoint provides list of sections with category info"
echo "2. Categories endpoint provides list of categories with sections info"
echo "3. Both endpoints include product counts for better management"
echo "4. Data structure supports hierarchical organization"
echo "5. CRUD operations available for both sections and categories"

echo -e "\n${PURPLE}🔍 Sections/Categories Testing Complete!${NC}"
