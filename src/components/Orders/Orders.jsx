import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaStore, FaChartBar, FaUser, FaBox, FaTruck } from 'react-icons/fa';
import { RiCloseFill } from 'react-icons/ri';
import { BsEye } from 'react-icons/bs';
import axios from 'axios';

const baseURL = 'https://products-api.cbc-apps.net';

const getStatusClass = (status) => {
  switch (status) {
    case 'COMPLETED':
    case 'DELIVERED':
    case 'PAID':
      return 'bg-green-100 text-green-800';
    case 'PENDING_PAYMENT':
    case 'PROCESSING':
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'CANCELED':
    case 'RETURNED':
    case 'OVERDUE':
      return 'bg-red-100 text-red-800';
    case 'SHIPPED':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const StatCard = ({ title, value, icon, growth, onClick }) => {
  const icons = {
    'invoices': <div className="bg-gray-100 p-3 rounded-xl"><FaChartBar className="text-red-500 text-2xl" /></div>,
    'sales': <div className="bg-gray-100 p-3 rounded-xl"><FaChartBar className="text-red-500 text-2xl" /></div>,
    'pending': <div className="bg-gray-100 p-3 rounded-xl"><FaBox className="text-red-500 text-2xl" /></div>,
    'overdue': <div className="bg-gray-100 p-3 rounded-xl"><RiCloseFill className="text-red-500 text-2xl" /></div>,
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

const OrderDetailsModal = ({ isOpen, onClose, invoice, updateInvoiceStatus }) => {
  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl mx-auto text-right mt-20" dir="rtl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            تفاصيل الفاتورة #{invoice.id}
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
              <p className="font-bold text-gray-800">{invoice.customer.name}</p>
              <p className="text-gray-500">{invoice.customer.phone}</p>
            </div>
            <div>
              <span className="text-gray-500 flex items-center">
                <FaTruck className="ml-2" />
                عنوان التوصيل
              </span>
              <p className="font-bold text-gray-800">{invoice.deliveryAddress}</p>
            </div>
          </div>

          <hr />

          <div>
            <span className="text-gray-500 flex items-center">
                <FaBox className="ml-2" />
                المنتجات
            </span>
            <ul className="list-none mt-2 space-y-2 max-h-48 overflow-y-auto pr-2">
              {invoice.items.map((item, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <div className="w-6 h-6 bg-gray-200 rounded-md flex-shrink-0 ml-2"></div>
                  <span>{item.product.name} ×{item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>

          <hr />
          
          <div className="space-y-4 ml-10">
            <h4 className="text-base font-bold text-gray-800 mb-2">خط سير الفاتورة</h4>
            <div className="relative border-r-2 border-gray-200 pr-4 space-y-4 max-h-64 overflow-y-auto">
              {invoice.statusHistory?.map((step, index) => (
                <div key={index} className="relative">
                  <span
                    className="absolute top-0 right-[-25px] h-4 w-4 rounded-full bg-red-500 border-2 border-white"
                  ></span>
                  <p className="font-semibold text-gray-800">{step.status}</p>
                  <p className="text-xs text-gray-500">{new Date(step.createdAt).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}</p>
                </div>
              ))}
            </div>
          </div>

          <hr />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="text-gray-500">ملاحظات</label>
              <p className="font-bold text-gray-800">{invoice.notes || 'لا يوجد ملاحظات'}</p>
            </div>
            <div>
              <label className="text-gray-500">الإجمالي</label>
              <p className="font-bold text-gray-800">{invoice.totalAmount} د.ع</p>
            </div>
            <div>
              <label className="text-gray-500">الحالة</label>
              <p className="font-bold text-gray-800">{invoice.status}</p>
            </div>
          </div>

          <hr />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-500">تاريخ الفاتورة</label>
              <p className="font-bold text-gray-800">{new Date(invoice.createdAt).toLocaleDateString('ar-EG')}</p>
            </div>
            <div>
              <label className="text-gray-500">تاريخ التحديث</label>
              <p className="font-bold text-gray-800">{new Date(invoice.updatedAt).toLocaleDateString('ar-EG')}</p>
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2 rtl:space-x-reverse">
            {invoice.status === 'PENDING' && (
              <button
                onClick={() => updateInvoiceStatus(invoice.id, 'PAID', 'تم الدفع')}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                تغيير إلى تم الدفع
              </button>
            )}
            <button
              onClick={() => updateInvoiceStatus(invoice.id, 'CANCELED', 'تم إلغاء الفاتورة')}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              إلغاء الفاتورة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TotalOrdersByMerchantModal = ({ isOpen, onClose, title, data }) => {
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
                  <Td>{status}</Td>
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
  const [invoices, setInvoices] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('الكل');
  const [selectedPayment, setSelectedPayment] = useState('الكل');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('token');

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${baseURL}/supplier/invoices/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = response.data;
      setAnalytics({
        totalInvoices: data.totalInvoices,
        totalAmount: data.totalAmount,
        paidAmount: data.paidAmount,
        pendingAmount: data.pendingAmount,
        overdueAmount: data.overdueAmount,
        invoicesByStatus: data.invoicesByStatus,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const statusQuery = selectedStatus === 'الكل' ? '' : `&status=${selectedStatus.toUpperCase()}`;
      // The search term is not supported in the provided API for invoices,
      // so we will filter on the client side.
      const response = await axios.get(`${baseURL}/supplier/invoices?page=${currentPage}&limit=20${statusQuery}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = response.data;
      setInvoices(data.invoices);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const fetchInvoiceDetails = async (invoiceId) => {
    try {
      const response = await axios.get(`${baseURL}/supplier/invoices/${invoiceId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = response.data;
      setSelectedInvoice(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching invoice details:', error);
    }
  };

  const updateInvoiceStatus = async (invoiceId, newStatus, notes) => {
    try {
      const response = await axios.patch(`${baseURL}/supplier/invoices/${invoiceId}/status`, {
        status: newStatus,
        notes: notes,
        paidDate: newStatus === 'PAID' ? new Date().toISOString() : undefined,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        alert('تم تحديث حالة الفاتورة بنجاح!');
        fetchInvoices();
        fetchInvoiceDetails(invoiceId);
      } else {
        alert('فشل في تحديث حالة الفاتورة.');
      }
    } catch (error) {
      console.error('Error updating invoice status:', error);
      alert('حدث خطأ أثناء تحديث حالة الفاتورة.');
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [selectedStatus, currentPage, searchTerm]);

  const openModal = (invoice) => {
    fetchInvoiceDetails(invoice.id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null);
    setModalData([]);
  };

  const openStatModal = (cardIcon) => {
    if (!analytics) return;
    let title = '';
    let data = [];
    switch (cardIcon) {
      case 'invoices':
        title = 'إجمالي الفواتير حسب الحالة';
        data = analytics.invoicesByStatus;
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
    if (selectedInvoice) {
      return <OrderDetailsModal isOpen={isModalOpen} onClose={closeModal} invoice={selectedInvoice} updateInvoiceStatus={updateInvoiceStatus} />;
    }
    if (modalData && Object.keys(modalData).length > 0) {
      if (modalTitle.includes('حسب الحالة')) {
        return <TotalOrdersByMerchantModal isOpen={isModalOpen} onClose={closeModal} title={modalTitle} data={modalData} />;
      }
      return null;
    }
    return null;
  };
  
  const statusOptions = ['الكل', 'PENDING', 'PAID', 'OVERDUE'];
  const paymentOptions = ['مدفوع', 'غير مدفوع'];

  const statsCards = analytics ? [
    { title: 'إجمالي الفواتير', value: analytics.totalInvoices, icon: 'invoices', growth: null },
    { title: 'المبلغ الإجمالي', value: `${analytics.totalAmount.toLocaleString()} د.ع`, icon: 'sales', growth: null },
    { title: 'المبلغ المعلق', value: `${analytics.pendingAmount.toLocaleString()} د.ع`, icon: 'pending', growth: null },
    { title: 'مبالغ متأخرة', value: `${analytics.overdueAmount.toLocaleString()} د.ع`, icon: 'overdue', growth: null },
  ] : [];

  const filteredInvoices = searchTerm
    ? invoices.filter(invoice => 
        invoice.id.toString().includes(searchTerm) || 
        invoice.customer.name.includes(searchTerm) ||
        invoice.items.some(item => item.product.name.includes(searchTerm))
      )
    : invoices;

  return (
    <div dir="rtl" className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-right">إدارة الفواتير</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsCards.map((card, index) => (
          <StatCard key={index} {...card} onClick={() => openStatModal(card.icon)} />
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <h3 className="text-lg font-bold">إدارة الفواتير</h3>
            <Dropdown
              options={statusOptions}
              selected={selectedStatus}
              onSelect={setSelectedStatus}
              placeholder="الكل"
            />
            {/* Payment filter is not supported by the provided API */}
            {/* <Dropdown
              options={paymentOptions}
              selected={selectedPayment}
              onSelect={setSelectedPayment}
              placeholder="الكل"
            /> */}
          </div>
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="ابحث برقم الفاتورة / العميل / المنتج"
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
                <Th>رقم الفاتورة</Th>
                <Th>العميل</Th>
                <Th>المنتجات</Th>
                <Th>الإجمالي</Th>
                <Th>الحالة</Th>
                <Th>تاريخ الفاتورة</Th>
                <Th>الإجراءات</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-right">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <Td>#{invoice.invoiceNumber}</Td>
                  <Td>{invoice.customer.name}</Td>
                  <Td>
                    <ul className="list-none space-y-1">
                      {invoice.items.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-4 h-4 bg-gray-200 rounded-md flex-shrink-0 ml-1"></div>
                          <span className="text-gray-700">{item.product.name} ×{item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </Td>
                  <Td>{invoice.totalAmount} د.ع</Td>
                  <Td>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </Td>
                  <Td>{new Date(invoice.createdAt).toLocaleDateString('ar-EG')}</Td>
                  <Td>
                    <button onClick={() => openModal(invoice)} className="text-gray-500 hover:text-gray-700">
                      <BsEye className="text-xl" />
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center text-sm">
          <span className="text-gray-700">إجمالي الفواتير: {analytics?.totalInvoices || 0}</span>
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