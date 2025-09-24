// API Configuration
const API_CONFIG = {
  // Use local backend for development
  // BASE_URL: 'http://localhost:4500',
  
  // Production URL (uncomment for production)
  BASE_URL: 'https://products-api.cbc-apps.net',
  
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/supplier/auth/login'
    },
    DASHBOARD: {
      OVERVIEW: '/supplier/dashboard/overview',
      CHARTS: '/supplier/dashboard/charts',
      TOP_PRODUCTS: '/supplier/dashboard/top-products'
    },
    ANALYTICS: {
      ENHANCED: '/supplier/analytics/enhanced',
      TABLES_CHARTS: '/supplier/analytics/tables-charts',
      SALES_OVER_TIME: '/supplier/sales/over-time'
    },
    PRODUCTS: {
      LIST: '/supplier/products',
      CREATE: '/supplier/products',
      UPDATE: (id) => `/supplier/products/${id}`,
      DELETE: (id) => `/supplier/products/${id}`,
      UPDATE_STOCK: (id) => `/supplier/products/${id}/stock`,
      DETAILS: (id) => `/supplier/products/${id}`,
      BULK_STOCK_UPDATE: '/supplier/products/bulk-stock-update',
      TOP_PERFORMING: '/supplier/products/top-performing',
      MOST_SELLING: '/supplier/products/most-selling',
      MOST_VISITED: '/supplier/products/most-visited'
    },
    ORDERS: {
      STATS: '/supplier/orders/analytics',
      LIST: '/supplier/orders',
      DETAILS: (id) => `/supplier/orders/${id}`,
      UPDATE_STATUS: (id) => `/supplier/orders/${id}/status`,
      CANCEL: (id) => `/supplier/orders/${id}/cancel`
    },
    INVOICES: {
      STATS: '/supplier/invoices/stats',
      LIST: '/supplier/invoices',
      DETAILS: (id) => `/supplier/invoices/${id}`,
      UPDATE_STATUS: (id) => `/supplier/invoices/${id}/status`
    },
    OFFERS: {
      LIST: '/supplier/offers',
      ADD: '/supplier/offers',
      EDIT: (id) => `/supplier/offers/${id}`,
      DELETE: (id) => `/supplier/offers/${id}`,
      TOGGLE_STATUS: (id) => `/supplier/offers/${id}/toggle-status`,
      PERFORMANCE: (id) => `/supplier/offers/${id}/performance`
    },
    SHIPPING: {
      SETTINGS: '/supplier/shipping/settings',
      AREAS: '/supplier/shipping/areas',
      AREAS_UPDATE: (id) => `/supplier/shipping/areas/${id}`,
      AREAS_DELETE: (id) => `/supplier/shipping/areas/${id}`,
      FREE_DELIVERY_OFFERS: '/supplier/shipping/free-delivery-offers',
      FREE_DELIVERY_OFFERS_UPDATE: (id) => `/supplier/shipping/free-delivery-offers/${id}`,
      FREE_DELIVERY_OFFERS_DELETE: (id) => `/supplier/shipping/free-delivery-offers/${id}`
    },
    PROFITS: {
      OVERVIEW: '/supplier/profits/overview',
      MONTHLY: '/supplier/profits/monthly',
      DAILY: '/supplier/profits/daily'
    },
    DUES: {
      ENHANCED: '/supplier/dues/enhanced'
    },
    CUSTOMERS: {
      LIST: '/supplier/customers',
      DETAILS: '/supplier/customers',
      ORDERS: '/supplier/customers',
      REVIEWS: '/supplier/customers',
      NOTES: '/supplier/customers',
      NOTIFICATIONS: '/supplier/customers',
      BLOCK: '/supplier/customers'
    },
    MERCHANTS: {
      LIST: '/supplier/merchants',
      DETAILS: '/supplier/merchants',
      NOTES: '/supplier/merchants'
    },
    SUPPORT: {
      TICKETS: '/supplier/support/tickets'
    },
    EMPLOYEES: {
      LIST: '/supplier/employees'
    },
    NOTIFICATIONS: {
      LIST: '/supplier/notifications',
      ALERTS: '/supplier/alerts'
    },
        SECTIONS: {
          LIST: '/supplier/sections',
          ADD: '/supplier/sections',
          EDIT: (id) => `/supplier/sections/${id}`,
          DELETE: (id) => `/supplier/sections/${id}`,
          UPLOAD_IMAGE: (id) => `/supplier/sections/${id}/upload-image`
        },
        CATEGORIES: {
          LIST: '/supplier/categories',
          ADD: '/supplier/categories',
          EDIT: (id) => `/supplier/categories/${id}`,
          DELETE: (id) => `/supplier/categories/${id}`,
          UPLOAD_IMAGE: (id) => `/supplier/categories/${id}/upload-image`
        },
    TICKETS: {
      LIST: '/supplier/tickets'
    },
    UPLOAD: {
      IMAGE: '/supplier/upload/image'
    },
    STORE: {
      INFO: '/supplier/store-info',
      BANKING: '/supplier/store-info/banking',
      PROFILE: '/supplier/profile'
    }
  }
};

// Helper function to get full URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export { API_CONFIG };
export default API_CONFIG;
