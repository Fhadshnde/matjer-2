import React, { useState, useEffect } from 'react';
import { FaBox, FaClock, FaExclamationTriangle, FaTimes, FaTags, FaBoxOpen, FaChevronRight, FaChevronLeft } from 'react-icons/fa';

const AbandonedPage = () => {
  const [abandonedProducts, setAbandonedProducts] = useState([]);
  const [delayedOrders, setDelayedOrders] = useState([]);
  const [productsPagination, setProductsPagination] = useState({});
  const [ordersPagination, setOrdersPagination] = useState({});
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [ordersError, setOrdersError] = useState(null);
  const [productsCurrentPage, setProductsCurrentPage] = useState(1);
  const [ordersCurrentPage, setOrdersCurrentPage] = useState(1);
  const [productsItemsPerPage] = useState(20);
  const [ordersItemsPerPage] = useState(20);
  const [productsSummary, setProductsSummary] = useState({});
  const [ordersSummary, setOrdersSummary] = useState({});

  // API Endpoints
  const API_ENDPOINTS = {
    ABANDONED_PRODUCTS: "https://products-api.cbc-apps.net/supplier/products/abandoned",
    DELAYED_ORDERS: "https://products-api.cbc-apps.net/supplier/orders/delayed"
  };

  const apiCall = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found.');
    }
    
    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    return response.json();
  };

  // Fetch abandoned products data
  const fetchAbandonedProducts = async () => {
    setIsLoadingProducts(true);
    setProductsError(null);
    try {
      const params = new URLSearchParams();
      params.append('page', productsCurrentPage.toString());
      params.append('limit', productsItemsPerPage.toString());

      const url = `${API_ENDPOINTS.ABANDONED_PRODUCTS}?${params.toString()}`;
      
      const data = await apiCall(url, { method: 'GET' });
      
      setAbandonedProducts(data.products || []);
      setProductsPagination(data.pagination || {});
      setProductsSummary(data.summary || {});
    } catch (error) {
      console.error('Error fetching abandoned products:', error);
      setProductsError('فشل في تحميل بيانات المنتجات المهجورة');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Fetch delayed orders data
  const fetchDelayedOrders = async () => {
    setIsLoadingOrders(true);
    setOrdersError(null);
    try {
      const params = new URLSearchParams();
      params.append('page', ordersCurrentPage.toString());
      params.append('limit', ordersItemsPerPage.toString());

      const url = `${API_ENDPOINTS.DELAYED_ORDERS}?${params.toString()}`;
      
      const data = await apiCall(url, { method: 'GET' });
      
      setDelayedOrders(data.orders || []);
      setOrdersPagination(data.pagination || {});
      setOrdersSummary(data.summary || {});
    } catch (error) {
      console.error('Error fetching delayed orders:', error);
      setOrdersError('فشل في تحميل بيانات الطلبات المتأخرة');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchAbandonedProducts();
  }, [productsCurrentPage, productsItemsPerPage]);

  useEffect(() => {
    fetchDelayedOrders();
  }, [ordersCurrentPage, ordersItemsPerPage]);

  const handleProductsPageChange = (newPage) => {
    setProductsCurrentPage(newPage);
  };

  const handleOrdersPageChange = (newPage) => {
    setOrdersCurrentPage(newPage);
  };

  const productStatsCards = [
    {
      title: 'إجمالي المهجورة',
      value: productsSummary.totalAbandoned || 0,
      icon: <FaBoxOpen className="text-white text-xl" />,
      color: 'bg-red-500'
    },
    {
      title: 'لم تُباع أبداً',
      value: productsSummary.neverSold || 0,
      icon: <FaTimes className="text-white text-xl" />,
      color: 'bg-blue-500'
    },
    {
      title: 'نفد المخزون',
      value: productsSummary.outOfStock || 0,
      icon: <FaTags className="text-white text-xl" />,
      color: 'bg-yellow-500'
    },
    {
      title: 'قديمة',
      value: productsSummary.oldProducts || 0,
      icon: <FaClock className="text-white text-xl" />,
      color: 'bg-gray-500'
    }
  ];

  const orderStatsCards = [
    {
      title: 'إجمالي الطلبات المتأخرة',
      value: ordersSummary.totalDelayed || 0,
      icon: <FaExclamationTriangle className="text-white text-xl" />,
      color: 'bg-red-500'
    },
    {
      title: 'طلبات عاجلة',
      value: ordersSummary.urgent || 0,
      icon: <FaClock className="text-white text-xl" />,
      color: 'bg-yellow-500'
    },
    {
      title: 'طلبات حرجة',
      value: ordersSummary.critical || 0,
      icon: <FaExclamationTriangle className="text-white text-xl" />,
      color: 'bg-orange-500'
    }
  ];

  const renderPagination = (pagination, currentPage, handlePageChange) => {
    if (pagination.totalPages <= 1) return null;
    
    const pages = [];
    const maxVisiblePages = 5; // يمكنك تغيير هذا العدد
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="bg-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200">
        <div className="text-sm text-gray-700 mb-4 sm:mb-0">
          عرض <span className="font-medium">{((currentPage - 1) * 20) + 1}</span> إلى{' '}
          <span className="font-medium">
            {Math.min(currentPage * 20, pagination.totalItems)}
          </span>{' '}
          من <span className="font-medium">{pagination.totalItems}</span> نتيجة
        </div>
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronRight className="h-4 w-4" />
          </button>
          
          {startPage > 1 && (
            <button
              onClick={() => handlePageChange(1)}
              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              1
            </button>
          )}
          {startPage > 2 && (
            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              ...
            </span>
          )}

          {pages.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                page === currentPage
                  ? 'z-10 bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          {endPage < pagination.totalPages - 1 && (
            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              ...
            </span>
          )}
          {endPage < pagination.totalPages && (
            <button
              onClick={() => handlePageChange(pagination.totalPages)}
              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              {pagination.totalPages}
            </button>
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronLeft className="h-4 w-4" />
          </button>
        </nav>
      </div>
    );
  };

  return (
    <div dir="rtl" className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-right">المنتجات والطلبات المهجورة</h1>

      {/* Abandoned Products Section */}
      <h2 className="text-xl font-semibold mb-4 text-right">المنتجات المهجورة</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {productStatsCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`${card.color} rounded-full p-3`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        {isLoadingProducts ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="mr-4 text-gray-600">جاري تحميل المنتجات...</span>
          </div>
        ) : productsError ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
            {productsError}
          </div>
        ) : abandonedProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>لا توجد منتجات مهجورة حالياً</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المنتج
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    السعر
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المخزون
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    سبب الهجر
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الأيام منذ آخر بيع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاريخ الإنشاء
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {abandonedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">ID: {product.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.price.toLocaleString()} د.ع
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-red-600">
                        {product.reason}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.daysSinceLastSale || 'لم يُباع أبداً'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {renderPagination(productsPagination, productsCurrentPage, handleProductsPageChange)}
      </div>

      ---

      {/* Delayed Orders Section */}
      <h2 className="text-xl font-semibold mb-4 text-right">الطلبات المتأخرة</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {orderStatsCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`${card.color} rounded-full p-3`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoadingOrders ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="mr-4 text-gray-600">جاري تحميل الطلبات...</span>
          </div>
        ) : ordersError ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
            {ordersError}
          </div>
        ) : delayedOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>لا توجد طلبات متأخرة حالياً</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الطلب
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التاريخ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {delayedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ID: {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        متأخر
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {renderPagination(ordersPagination, ordersCurrentPage, handleOrdersPageChange)}
      </div>
    </div>
  );
};

export default AbandonedPage;