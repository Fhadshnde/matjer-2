#!/usr/bin/env node

// ========================================
// COMPREHENSIVE ENDPOINTS TESTING SCRIPT
// ========================================
// اختبار شامل لجميع الـ endpoints في الفرونت إند

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:4500';
const TEST_SUPPLIER = {
  phone: '07901234567',
  password: 'password123'
};

let authToken = null;

// Test results storage
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// Utility functions
const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
};

const testEndpoint = async (name, method, endpoint, data = null, headers = {}) => {
  testResults.total++;
  
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    
    testResults.passed++;
    testResults.details.push({
      name,
      status: 'PASSED',
      statusCode: response.status,
      responseTime: response.headers['x-response-time'] || 'N/A'
    });
    
    log(`${name}: PASSED (${response.status})`, 'success');
    return response.data;
    
  } catch (error) {
    testResults.failed++;
    const statusCode = error.response?.status || 'NO_RESPONSE';
    
    testResults.details.push({
      name,
      status: 'FAILED',
      statusCode,
      error: error.message
    });
    
    log(`${name}: FAILED (${statusCode}) - ${error.message}`, 'error');
    return null;
  }
};

// Authentication test
const authenticate = async () => {
  log('Testing authentication...');
  
  const response = await testEndpoint(
    'Supplier Login',
    'POST',
    '/supplier/auth/login',
    TEST_SUPPLIER
  );
  
  if (response && response.access_token) {
    authToken = response.access_token;
    log('Authentication successful!', 'success');
    return true;
  } else {
    log('Authentication failed!', 'error');
    return false;
  }
};

// Test all endpoints
const runAllTests = async () => {
  log('Starting comprehensive endpoints testing...');
  
  // Authenticate first
  const authSuccess = await authenticate();
  if (!authSuccess) {
    log('Cannot proceed without authentication', 'error');
    return;
  }

  const authHeaders = {
    'Authorization': `Bearer ${authToken}`
  };

  // ========================================
  // 1. DASHBOARD ENDPOINTS
  // ========================================
  log('Testing Dashboard Endpoints...');
  
  await testEndpoint(
    'Dashboard Overview',
    'GET',
    '/supplier/dashboard/overview',
    null,
    authHeaders
  );
  
  await testEndpoint(
    'Dashboard Charts',
    'GET',
    '/supplier/dashboard/charts',
    null,
    authHeaders
  );
  
  await testEndpoint(
    'Top Products',
    'GET',
    '/supplier/dashboard/top-products',
    null,
    authHeaders
  );

  // ========================================
  // 2. ANALYTICS ENDPOINTS
  // ========================================
  log('Testing Analytics Endpoints...');
  
  await testEndpoint(
    'Analytics Enhanced',
    'GET',
    '/supplier/analytics/enhanced',
    null,
    authHeaders
  );
  
  await testEndpoint(
    'Analytics Tables Charts',
    'GET',
    '/supplier/analytics/tables-charts',
    null,
    authHeaders
  );
  
  await testEndpoint(
    'Sales Over Time',
    'GET',
    '/supplier/sales/over-time',
    null,
    authHeaders
  );

  // ========================================
  // 3. PRODUCTS ENDPOINTS
  // ========================================
  log('Testing Products Endpoints...');
  
  await testEndpoint(
    'Products List',
    'GET',
    '/supplier/products',
    null,
    authHeaders
  );
  
  // Test with pagination
  await testEndpoint(
    'Products List (Paginated)',
    'GET',
    '/supplier/products?page=1&limit=10',
    null,
    authHeaders
  );

  // ========================================
  // 4. ORDERS/INVOICES ENDPOINTS
  // ========================================
  log('Testing Orders/Invoices Endpoints...');
  
  await testEndpoint(
    'Invoices Stats',
    'GET',
    '/supplier/invoices/stats',
    null,
    authHeaders
  );
  
  await testEndpoint(
    'Invoices List',
    'GET',
    '/supplier/invoices',
    null,
    authHeaders
  );
  
  await testEndpoint(
    'Invoices List (Paginated)',
    'GET',
    '/supplier/invoices?page=1&limit=10',
    null,
    authHeaders
  );

  // ========================================
  // 5. OFFERS ENDPOINTS
  // ========================================
  log('Testing Offers Endpoints...');
  
  await testEndpoint(
    'Offers List',
    'GET',
    '/supplier/offers',
    null,
    authHeaders
  );

  // ========================================
  // 6. SHIPPING ENDPOINTS
  // ========================================
  log('Testing Shipping Endpoints...');
  
  await testEndpoint(
    'Shipping Settings',
    'GET',
    '/supplier/shipping/settings',
    null,
    authHeaders
  );
  
  await testEndpoint(
    'Shipping Areas',
    'GET',
    '/supplier/shipping/areas',
    null,
    authHeaders
  );
  
  await testEndpoint(
    'Free Delivery Offers',
    'GET',
    '/supplier/shipping/free-delivery-offers',
    null,
    authHeaders
  );

  // ========================================
  // 7. PROFITS/DUES ENDPOINTS
  // ========================================
  log('Testing Profits/Dues Endpoints...');
  
  await testEndpoint(
    'Dues Enhanced',
    'GET',
    '/supplier/dues/enhanced',
    null,
    authHeaders
  );
  
  await testEndpoint(
    'Profits Overview',
    'GET',
    '/supplier/profits/overview',
    null,
    authHeaders
  );
  
  await testEndpoint(
    'Profits Monthly',
    'GET',
    '/supplier/profits/monthly',
    null,
    authHeaders
  );
  
  await testEndpoint(
    'Profits Daily',
    'GET',
    '/supplier/profits/daily',
    null,
    authHeaders
  );

  // ========================================
  // 8. CUSTOMER MANAGEMENT ENDPOINTS
  // ========================================
  log('Testing Customer Management Endpoints...');
  
  await testEndpoint(
    'Customers List',
    'GET',
    '/supplier/customers',
    null,
    authHeaders
  );
  
  await testEndpoint(
    'Customers List (Paginated)',
    'GET',
    '/supplier/customers?page=1&limit=10',
    null,
    authHeaders
  );

  // ========================================
  // 9. MERCHANT MANAGEMENT ENDPOINTS
  // ========================================
  log('Testing Merchant Management Endpoints...');
  
  await testEndpoint(
    'Merchants List',
    'GET',
    '/supplier/merchants',
    null,
    authHeaders
  );
  
  await testEndpoint(
    'Merchants List (Paginated)',
    'GET',
    '/supplier/merchants?page=1&limit=10',
    null,
    authHeaders
  );

  // ========================================
  // 10. SUPPORT/TICKETS ENDPOINTS
  // ========================================
  log('Testing Support/Tickets Endpoints...');
  
  await testEndpoint(
    'Support Tickets',
    'GET',
    '/supplier/support/tickets',
    null,
    authHeaders
  );

  // ========================================
  // 11. EMPLOYEE MANAGEMENT ENDPOINTS
  // ========================================
  log('Testing Employee Management Endpoints...');
  
  await testEndpoint(
    'Employees List',
    'GET',
    '/supplier/employees',
    null,
    authHeaders
  );

  // ========================================
  // 12. NOTIFICATIONS/ALERTS ENDPOINTS
  // ========================================
  log('Testing Notifications/Alerts Endpoints...');
  
  await testEndpoint(
    'Notifications',
    'GET',
    '/supplier/notifications',
    null,
    authHeaders
  );
  
  await testEndpoint(
    'Alerts',
    'GET',
    '/supplier/alerts',
    null,
    authHeaders
  );

  // ========================================
  // 13. SECTIONS/CATEGORIES ENDPOINTS
  // ========================================
  log('Testing Sections/Categories Endpoints...');
  
  await testEndpoint(
    'Sections',
    'GET',
    '/supplier/sections',
    null,
    authHeaders
  );
  
  await testEndpoint(
    'Categories',
    'GET',
    '/supplier/categories',
    null,
    authHeaders
  );

  // ========================================
  // 14. TICKETS ENDPOINTS
  // ========================================
  log('Testing Tickets Endpoints...');
  
  await testEndpoint(
    'Tickets',
    'GET',
    '/supplier/tickets',
    null,
    authHeaders
  );

  // Generate final report
  generateReport();
};

// Generate test report
const generateReport = () => {
  log('Generating test report...');
  
  const successRate = ((testResults.passed / testResults.total) * 100).toFixed(2);
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 COMPREHENSIVE ENDPOINTS TEST REPORT');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`Passed: ${testResults.passed} ✅`);
  console.log(`Failed: ${testResults.failed} ❌`);
  console.log(`Success Rate: ${successRate}%`);
  console.log('='.repeat(60));
  
  if (testResults.failed > 0) {
    console.log('\n❌ FAILED TESTS:');
    console.log('-'.repeat(40));
    testResults.details
      .filter(test => test.status === 'FAILED')
      .forEach(test => {
        console.log(`• ${test.name}: ${test.statusCode} - ${test.error}`);
      });
  }
  
  console.log('\n✅ PASSED TESTS:');
  console.log('-'.repeat(40));
  testResults.details
    .filter(test => test.status === 'PASSED')
    .forEach(test => {
      console.log(`• ${test.name}: ${test.statusCode}`);
    });
  
  console.log('\n' + '='.repeat(60));
  
  // Save report to file
  const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
      total: testResults.total,
      passed: testResults.passed,
      failed: testResults.failed,
      successRate: parseFloat(successRate)
    },
    details: testResults.details
  };
  
  require('fs').writeFileSync(
    'matjer-2/endpoints-test-report.json',
    JSON.stringify(reportData, null, 2)
  );
  
  log(`Test report saved to: matjer-2/endpoints-test-report.json`);
  
  if (testResults.failed === 0) {
    log('🎉 All tests passed! System is fully functional.', 'success');
  } else {
    log(`⚠️  ${testResults.failed} tests failed. Please review and fix issues.`, 'error');
  }
};

// Run tests
if (require.main === module) {
  runAllTests().catch(error => {
    log(`Test execution failed: ${error.message}`, 'error');
    process.exit(1);
  });
}

module.exports = { runAllTests, testEndpoint, authenticate };
