import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaStore, FaChartBar, FaUser, FaBox, FaTruck } from 'react-icons/fa';
import { RiCloseFill } from 'react-icons/ri';
import { BsEye } from 'react-icons/bs';
import axios from 'axios';
import { getApiUrl, getAuthHeaders, API_CONFIG } from '../../config/api';

const getStatusClass = (status) => {
  switch (status) {
    case 'DELIVERED':
      return 'bg-green-100 text-green-800';
    case 'PROCESSING':
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'CANCELLED':
    case 'CANCELED':
    case 'RETURNED':
      return 'bg-red-100 text-red-800';
    case 'SHIPPED':
    case 'DELIVERING':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status) => {
  const statusMap = {
    'PROCESSING': 'قيد المعالجة',
    'SHIPPED': 'تم الشحن',
    'DELIVERING': 'قيد التوصيل',
    'DELIVERED': 'تم التسليم',
    'CANCELLED': 'ملغي',
    'CANCELED': 'ملغي',
    'RETURNED': 'مرتجع',
    'PENDING': 'معلق'
  };
  return statusMap[status] || status;
};

const StatCard = ({ title, value, icon, growth, onClick }) => {
  const icons = {
    'orders': <div className="bg-gray-100 p-3 rounded-xl"><FaChartBar className="text-red-500 text-2xl" /></div>,
    'sales': <div className="bg-gray-100 p-3 rounded-xl"><FaChartBar className="text-red-500 text-2xl" /></div>,
    'pending': <div className="bg-gray-100 p-3 rounded-xl"><FaBox className="text-red-500 text-2xl" /></div>,
    'late': <div className="bg-gray-100 p-3 rounded-xl"><RiCloseFill className="text-red-500 text-2xl" /></div>,
  };

  const isPositiveGrowth = growth >= 0;

  return (
    <div onClick={onClick} className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between text-right cursor-pointer hover:shadow-lg transition-shadow">
      <div className="flex flex-col">
        <span className="text-gray-400 text-xs mb-1">{title}</span>
        <p className="text-xl font-bold mb-1 text-gray-800" style={{ direction: 'ltr' }}>{value}</p>
        {growth !== undefined && (
          <span className={`text-xs flex items-center ${isPositiveGrowth ? 'text-green-500' : 'text-red-500'}`}>
            <FaChevronDown className={`transform ${isPositiveGrowth ? 'rotate-180' : 'rotate-0'} ${isPositiveGrowth ? 'text-green-500' : 'text-red-500'} ml-1`} />
            {Math.abs(growth)}%
            <span className="text-gray-400 mr-1">عن الفترة السابقة</span>
          </span>
        )}
      </div>
      {icons[icon]}
    </div>
  );
};

const Th = ({ children, className = '' }) => (
  <th className={`p-3 font-semibold text-gray-500 ${className}`}>{children}</th>
);

const Td = ({ children }) => (
  <td className="p-3 text-sm text-gray-700">{children}</td>
);

const Dropdown = ({ options, selected, onSelect, placeholder, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownOptions = options.includes('الكل') ? options : ['الكل', ...options];

  return (
    <div className={`relative ${className}`} dir="rtl">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2 text-sm font-semibold text-gray-700 bg-white border rounded-lg flex items-center justify-between transition ${isOpen ? 'border-red-500' : 'border-gray-300'}`}
      >
        <span>{selected || placeholder}</span>
        <FaChevronDown className={`transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
          {dropdownOptions.map((option) => (
            <button
              key={option}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className={`w-full text-right px-4 py-2 text-sm ${option === selected ? 'bg-red-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const OrderDetailsModal = ({ isOpen, onClose, order, updateOrderStatus }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl mx-auto text-right mt-20" dir="rtl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            تفاصيل الطلب #{order.id}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <RiCloseFill size={24} />
          </button>
        </div>

        <div className="space-y-6 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-gray-500 flex items-center">
                <FaUser className="ml-2" />
                العميل
              </span>
              <p className="font-bold text-gray-800">{order.user.name}</p>
              <p className="text-gray-500">{order.user.phone}</p>
            </div>
            <div>
              <span className="text-gray-500 flex items-center">
                <FaTruck className="ml-2" />
                عنوان التوصيل
              </span>
              <p className="font-bold text-gray-800">{order.shippingAddress}</p>
            </div>
          </div>

          <hr />

          <div>
            <span className="text-gray-500 flex items-center">
                <FaBox className="ml-2" />
                المنتجات
            </span>
            <ul className="list-none mt-2 space-y-2 max-h-48 overflow-y-auto pr-2">
              {order.items.map((item, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <div className="w-6 h-6 bg-gray-200 rounded-md flex-shrink-0 ml-2"></div>
                  <span>{item.product.name} ×{item.quantity} - {item.price} د.ع</span>
                </li>
              ))}
            </ul>
          </div>

          <hr />
          
          <div className="space-y-4 ml-10">
            <h4 className="text-base font-bold text-gray-800 mb-2">خط سير الطلب</h4>
            <div className="relative border-r-2 border-gray-200 pr-4 space-y-4 max-h-64 overflow-y-auto">
              {order.statusHistory?.map((step, index) => (
                <div key={index} className="relative">
                  <span
                    className="absolute top-0 right-[-25px] h-4 w-4 rounded-full bg-red-500 border-2 border-white"
                  ></span>
                  <p className="font-semibold text-gray-800">{getStatusText(step.status)}</p>
                  <p className="text-xs text-gray-500">{new Date(step.createdAt).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}</p>
                </div>
              ))}
            </div>
          </div>

          <hr />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="text-gray-500">ملاحظات</label>
              <p className="font-bold text-gray-800">{order.notes || 'لا يوجد ملاحظات'}</p>
            </div>
            <div>
              <label className="text-gray-500">الإجمالي</label>
              <p className="font-bold text-gray-800">{order.totalAmount.toLocaleString()} د.ع</p>
            </div>
            <div>
              <label className="text-gray-500">الحالة</label>
              <p className="font-bold text-gray-800">{getStatusText(order.status)}</p>
            </div>
          </div>

          <hr />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-500">تاريخ الطلب</label>
              <p className="font-bold text-gray-800">{new Date(order.createdAt).toLocaleDateString('ar-EG')}</p>
            </div>
            <div>
              <label className="text-gray-500">تاريخ التحديث</label>
              <p className="font-bold text-gray-800">{new Date(order.updatedAt).toLocaleDateString('ar-EG')}</p>
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2 rtl:space-x-reverse">
            {order.status === 'PROCESSING' && (
              <button
                onClick={() => updateOrderStatus(order.id, 'SHIPPED')}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                تغيير إلى تم الشحن
              </button>
            )}
            {order.status === 'SHIPPED' && (
              <button
                onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                تغيير إلى تم التسليم
              </button>
            )}
            {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
              <button
                onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                إلغاء الطلب
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const OrdersByStatusModal = ({ isOpen, onClose, title, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl mx-auto text-right mt-20" dir="rtl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <RiCloseFill size={24} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-right">
              <tr>
                <Th>الحالة</Th>
                <Th>العدد</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-right">
              {Object.keys(data).map((status, index) => (
                <tr key={index}>
                  <Td>{getStatusText(status)}</Td>
                  <Td>{data[status]}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('الكل');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.ORDERS.STATS), {
        headers: getAuthHeaders()
      });
      const data = response.data;
      setAnalytics({
        totalOrders: data.totalOrders,
        totalSalesAmount: data.totalSalesAmount,
        lateOrders: data.lateOrders,
        ordersGrowth: data.ordersGrowth,
        salesGrowth: data.salesGrowth,
        ordersByStatus: data.ordersByStatus,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const statusQuery = selectedStatus === 'الكل' ? '' : `&status=${selectedStatus.toUpperCase()}`;
      const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.ORDERS.LIST) + `?page=${currentPage}&limit=20${statusQuery}`, {
        headers: getAuthHeaders()
      });
      const data = response.data;
      setOrders(data.orders);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.ORDERS.DETAILS(orderId)), {
        headers: getAuthHeaders()
      });
      const data = response.data;
      setSelectedOrder(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.patch(getApiUrl(API_CONFIG.ENDPOINTS.ORDERS.UPDATE_STATUS(orderId)), {
        status: newStatus
      }, {
        headers: getAuthHeaders()
      });
      if (response.status === 200) {
        alert('تم تحديث حالة الطلب بنجاح!');
        fetchOrders();
        fetchOrderDetails(orderId);
      } else {
        alert('فشل في تحديث حالة الطلب.');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('حدث خطأ أثناء تحديث حالة الطلب.');
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus, currentPage, searchTerm]);

  const openModal = (order) => {
    fetchOrderDetails(order.id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setModalData([]);
  };

  const openStatModal = (cardIcon) => {
    if (!analytics) return;
    let title = '';
    let data = [];
    switch (cardIcon) {
      case 'orders':
        title = 'إجمالي الطلبات حسب الحالة';
        data = analytics.ordersByStatus;
        setModalTitle(title);
        setModalData(data);
        setIsModalOpen(true);
        break;
      default:
        return;
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  const getModalComponent = () => {
    if (selectedOrder) {
      return <OrderDetailsModal isOpen={isModalOpen} onClose={closeModal} order={selectedOrder} updateOrderStatus={updateOrderStatus} />;
    }
    if (modalData && Object.keys(modalData).length > 0) {
      if (modalTitle.includes('حسب الحالة')) {
        return <OrdersByStatusModal isOpen={isModalOpen} onClose={closeModal} title={modalTitle} data={modalData} />;
      }
      return null;
    }
    return null;
  };
  
  const statusOptions = ['الكل', 'PROCESSING', 'SHIPPED', 'DELIVERING', 'DELIVERED', 'CANCELLED', 'RETURNED'];

  const statsCards = analytics ? [
    { title: 'إجمالي الطلبات', value: analytics.totalOrders, icon: 'orders', growth: analytics.ordersGrowth },
    { title: 'إجمالي المبيعات', value: `${analytics.totalSalesAmount.toLocaleString()} د.ع`, icon: 'sales', growth: analytics.salesGrowth },
    { title: 'الطلبات المتأخرة', value: analytics.lateOrders, icon: 'late', growth: analytics.lateOrdersGrowth },
    { title: 'طلبات قيد المعالجة', value: analytics.ordersByStatus?.processing || 0, icon: 'pending', growth: null },
  ] : [];

  const filteredOrders = searchTerm
    ? orders.filter(order => 
        order.id.toString().includes(searchTerm) || 
        order.user.name.includes(searchTerm) ||
        order.items.some(item => item.product.name.includes(searchTerm))
      )
    : orders;

  if (loading) {
    return (
      <div dir="rtl" className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-right">إدارة الطلبات</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsCards.map((card, index) => (
          <StatCard key={index} {...card} onClick={() => openStatModal(card.icon)} />
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <h3 className="text-lg font-bold">إدارة الطلبات</h3>
            <Dropdown
              options={statusOptions}
              selected={selectedStatus}
              onSelect={setSelectedStatus}
              placeholder="الكل"
            />
          </div>
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="ابحث برقم الطلب / العميل / المنتج"
              className="w-full md:w-80 px-4 py-2 text-sm bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-800 placeholder-gray-400"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-right">
              <tr>
                <Th>رقم الطلب</Th>
                <Th>العميل</Th>
                <Th>المنتجات</Th>
                <Th>الإجمالي</Th>
                <Th>الحالة</Th>
                <Th>تاريخ الطلب</Th>
                <Th>الإجراءات</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-right">
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <Td>#{order.id}</Td>
                  <Td>
                    <div>
                      <p className="font-semibold">{order.user.name}</p>
                      <p className="text-gray-500 text-xs">{order.user.phone}</p>
                    </div>
                  </Td>
                  <Td>
                    <ul className="list-none space-y-1">
                      {order.items.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-4 h-4 bg-gray-200 rounded-md flex-shrink-0 ml-1"></div>
                          <span className="text-gray-700">{item.product.name} ×{item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </Td>
                  <Td>{order.totalAmount.toLocaleString()} د.ع</Td>
                  <Td>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </Td>
                  <Td>{new Date(order.createdAt).toLocaleDateString('ar-EG')}</Td>
                  <Td>
                    <button onClick={() => openModal(order)} className="text-gray-500 hover:text-gray-700">
                      <BsEye className="text-xl" />
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center text-sm">
          <span className="text-gray-700">إجمالي الطلبات: {analytics?.totalOrders || 0}</span>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-gray-500">صفحة {currentPage} من {totalPages}</span>
            <div className="flex space-x-1 rtl:space-x-reverse">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md text-sm bg-white text-gray-700 border disabled:opacity-50"
              >
                السابق
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md text-sm bg-white text-gray-700 border disabled:opacity-50"
              >
                التالي
              </button>
            </div>
          </div>
        </div>
      </div>
      {getModalComponent()}
    </div>
  );
};

export default OrdersPage;