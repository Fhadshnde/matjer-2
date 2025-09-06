import React, { useState } from 'react';
import { FaChevronDown, FaStore, FaChartBar, FaUserTie, FaUsers, FaUser, FaBox, FaPercent, FaTruck, FaWrench } from 'react-icons/fa';
import { RiCloseFill } from 'react-icons/ri';
import { BsEye, BsThreeDots } from 'react-icons/bs';

const statsCards = [
  { title: 'إجمالي الطلبات', value: '4,753', icon: 'orders' },
  { title: 'إجمالي المبيعات', value: '240.00 د.ك', icon: 'sales' },
  { title: 'طلبات مستلمة', value: '3,500', icon: 'received' },
  { title: 'طلبات مرفوضة', value: '50', icon: 'rejected' },
];

const ordersData = [
  {
    id: 1,
    orderNumber: 'A-10255',
    customerName: 'مها أبو زيد',
    products: ['هاتف ×1 A15 128GB', 'سماعات بلوتوث ×1'],
    total: '154.90 د.ك',
    status: 'بانتظار الشحن',
    payment: 'مدفوع',
    shipping: 'ارامكس',
    notes: 'التغليف هدية',
    merchant: 'سما للهواتف',
    customerPhone: '+965500000',
    shippingCompany: 'ارامكس',
    orderDate: '2025-09-01',
    deliveryDate: null,
    timeline: [
      { status: 'تم الاستلام', desc: 'الطلب تم تسجيله بنجاح وهو في قائمة الطلبات.', completed: true },
      { status: 'جاهز للشحن', desc: 'الطلب تم تجهيزه وتأكيد الفاتورة، في انتظار شركة الشحن', completed: true },
      { status: 'قيد التوصيل', desc: 'الطلب تم تسليمه لشركة الشحن مع إمكانية عرض رقم التتبع', completed: false },
      { status: 'تم التوصيل', desc: 'الطلب وصل إلى العميل بنجاح (مع وقت وتاريخ التسليم)', completed: false },
    ]
  },
  {
    id: 2,
    orderNumber: 'A-10254',
    customerName: 'أحمد علي',
    products: ['هاتف ×1 A15 128GB', 'سماعات بلوتوث ×1'],
    total: '154.90 د.ك',
    status: 'مكتمل',
    payment: 'مدفوع',
    shipping: 'ارامكس',
    notes: 'التغليف هدية',
    merchant: 'سما للهواتف',
    customerPhone: '+965500000',
    shippingCompany: 'ارامكس',
    orderDate: '2025-08-28',
    deliveryDate: '2025-08-30',
    timeline: [
      { status: 'تم الاستلام', desc: 'الطلب تم تسجيله بنجاح وهو في قائمة الطلبات.', completed: true },
      { status: 'قيد المعالجة', desc: 'الطلب تحت المراجعة من قبل التاجر وفريق الدعم', completed: true },
      { status: 'جاهز للشحن', desc: 'الطلب تم تجهيزه وتأكيد الفاتورة، في انتظار شركة الشحن', completed: true },
      { status: 'قيد التوصيل', desc: 'الطلب تم تسليمه لشركة الشحن مع إمكانية عرض رقم التتبع', completed: true },
      { status: 'تم التوصيل', desc: 'الطلب وصل إلى العميل بنجاح (مع وقت وتاريخ التسليم)', completed: true },
    ]
  },
  {
    id: 3,
    orderNumber: 'A-10253',
    customerName: 'محمد صبري',
    products: ['هاتف ×1 A15 128GB', 'سماعات بلوتوث ×1'],
    total: '154.90 د.ك',
    status: 'ملغي',
    payment: 'مسترد',
    shipping: 'ارامكس',
    notes: 'التغليف هدية',
    merchant: 'سما للهواتف',
    customerPhone: '+965500000',
    shippingCompany: 'ارامكس',
    orderDate: '2025-08-25',
    deliveryDate: null,
    timeline: [
      { status: 'تم الاستلام', desc: 'الطلب تم تسجيله بنجاح وهو في قائمة الطلبات.', completed: true },
      { status: 'ملغي', desc: 'تم إلغاء الطلب بناء على طلب العميل.', completed: true },
    ]
  },
];

const salesData = [
  {
    id: 1,
    orderNumber: 'S-201',
    customerName: 'فاطمة خالد',
    products: ['لابتوب ×1 Z-Series'],
    total: '350.50 د.ك',
    date: '2025-09-04',
    status: 'مكتمل'
  },
  {
    id: 2,
    orderNumber: 'S-202',
    customerName: 'يوسف أحمد',
    products: ['ساعة ذكية ×1 S3'],
    total: '99.00 د.ك',
    date: '2025-09-03',
    status: 'مكتمل'
  },
  {
    id: 3,
    orderNumber: 'S-203',
    customerName: 'ليلى سالم',
    products: ['سماعات بلوتوث ×2 X9'],
    total: '80.00 د.ك',
    date: '2025-09-02',
    status: 'مكتمل'
  },
  {
    id: 4,
    orderNumber: 'S-204',
    customerName: 'سارة علي',
    products: ['شاحن لاسلكي ×1 5W'],
    total: '25.00 د.ك',
    date: '2025-09-01',
    status: 'مكتمل'
  }
];

const merchantDetailsData = [
  { merchant: 'متجر مهند', totalSales: 'د.ك 500,000', orders: 1500, profit: 'د.ك 150,000' },
  { merchant: 'متجر حازم عبود', totalSales: 'د.ك 350,000', orders: 900, profit: 'د.ك 100,000' },
  { merchant: 'متجر بيداء', totalSales: 'د.ك 250,000', orders: 750, profit: 'د.ك 75,000' },
  { merchant: 'متجر محمد', totalSales: 'د.ك 150,000', orders: 500, profit: 'د.ك 40,000' },
];

const ordersByMerchantData = [
  { merchant: 'متجر مهند', receivedOrders: 1200, rejectedOrders: 50, awaitingShipment: 250 },
  { merchant: 'متجر حازم عبود', receivedOrders: 750, rejectedOrders: 20, awaitingShipment: 130 },
  { merchant: 'متجر بيداء', receivedOrders: 600, rejectedOrders: 15, awaitingShipment: 135 },
  { merchant: 'متجر محمد', receivedOrders: 400, rejectedOrders: 10, awaitingShipment: 90 },
];

const statusOptions = ['الكل', 'جديد', 'قيد المعالجة', 'بانتظار الشحن', 'تم الشحن', 'مكتمل', 'ملغي'];
const paymentOptions = ['مدفوع', 'قيد الدفع', 'مسترد'];

const getStatusClass = (status) => {
  switch (status) {
    case 'مدفوع':
    case 'مكتمل':
      return 'bg-green-100 text-green-800';
    case 'بانتظار الشحن':
      return 'bg-yellow-100 text-yellow-800';
    case 'ملغي':
    case 'مسترد':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const StatCard = ({ title, value, icon, onClick }) => {
  const icons = {
    'orders': <div className="bg-gray-100 p-3 rounded-xl"><FaChartBar className="text-red-500 text-2xl" /></div>,
    'sales': <div className="bg-gray-100 p-3 rounded-xl"><FaChartBar className="text-red-500 text-2xl" /></div>,
    'received': <div className="bg-gray-100 p-3 rounded-xl"><FaBox className="text-red-500 text-2xl" /></div>,
    'rejected': <div className="bg-gray-100 p-3 rounded-xl"><RiCloseFill className="text-red-500 text-2xl" /></div>,
  };

  return (
    <div onClick={onClick} className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between text-right cursor-pointer hover:shadow-lg transition-shadow">
      <div className="flex flex-col">
        <span className="text-gray-400 text-xs mb-1">{title}</span>
        <p className="text-xl font-bold mb-1 text-gray-800">{value}</p>
        <span className="text-xs text-green-500 flex items-center">
          <FaChevronDown className="transform rotate-180 text-green-500 ml-1" />
          8%
          <span className="text-gray-400 mr-1">عن الفترة السابقة</span>
        </span>
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
        className={`w-ful l px-4 py-2 text-sm font-semibold text-gray-700 bg-white border rounded-lg flex items-center justify-between transition ${isOpen ? 'border-red-500' : 'border-gray-300'}`}
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

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl mx-auto text-right mt-20" dir="rtl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            تفاصيل الطلب #{order.orderNumber}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <RiCloseFill size={24} />
          </button>
        </div>

        <div className="space-y-6 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-gray-500 flex items-center">
                <FaStore className="ml-2" />
                التاجر
              </span>
              <p className="font-bold text-gray-800">{order.merchant}</p>
              <p className="text-gray-500">{order.customerPhone}</p>
            </div>
            <div>
              <span className="text-gray-500 flex items-center">
                <FaUser className="ml-2" />
                العميل
              </span>
              <p className="font-bold text-gray-800">{order.customerName}</p>
              <p className="text-gray-500">بغداد</p>
            </div>
          </div>

          <hr />

          <div>
            <span className="text-gray-500 flex items-center">
                <FaBox className="ml-2" />
                المنتجات
            </span>
            <ul className="list-none mt-2 space-y-2 max-h-48 overflow-y-auto pr-2">
              {order.products.map((product, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <div className="w-6 h-6 bg-gray-200 rounded-md flex-shrink-0 ml-2"></div>
                  <span>{product}</span>
                </li>
              ))}
            </ul>
          </div>

          <hr />

          <div>
            <span className="text-gray-500 flex items-center">
                <FaTruck className="ml-2" />
                شركة الشحن
            </span>
            <p className="font-bold text-gray-800 mt-2">{order.shippingCompany}</p>
          </div>

          <hr />

          <div className="space-y-4 ml-10">
            <h4 className="text-base font-bold text-gray-800 mb-2">خط سير الطلب</h4>
            <div className="relative border-r-2 border-gray-200 pr-4 space-y-4 max-h-64 overflow-y-auto">
              {order.timeline.map((step, index) => (
                <div key={index} className="relative">
                  <span
                    className={`absolute top-0 right-[-25px] h-4 w-4 rounded-full ${
                      step.completed ? "bg-red-500" : "bg-gray-300"
                    } border-2 border-white`}
                  ></span>
                  <p className="font-semibold text-gray-800">{step.status}</p>
                  <p className="text-xs text-gray-500">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <hr />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="text-gray-500">ملاحظات</label>
              <p className="font-bold text-gray-800">{order.notes}</p>
            </div>
            <div>
              <label className="text-gray-500">الدفع</label>
              <p className="font-bold text-gray-800">{order.payment}</p>
            </div>
            <div>
              <label className="text-gray-500">الحالة</label>
              <p className="font-bold text-gray-800">{order.status}</p>
            </div>
          </div>

          <hr />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-500">تاريخ الطلب</label>
              <p className="font-bold text-gray-800">{order.orderDate}</p>
            </div>
            {order.deliveryDate && (
              <div>
                <label className="text-gray-500">تاريخ الاستلام</label>
                <p className="font-bold text-gray-800">{order.deliveryDate}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const GenericModal = ({ isOpen, onClose, title, data }) => {
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
                <Th>رقم الطلب</Th>
                <Th>العميل</Th>
                <Th>المنتجات</Th>
                <Th>الإجمالي</Th>
                <Th>التاريخ</Th>
                <Th>الحالة</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-right">
              {data.map((item, index) => (
                <tr key={index}>
                  <Td>#{item.orderNumber}</Td>
                  <Td>{item.customerName}</Td>
                  <Td>
                    <ul className="list-none space-y-1">
                      {item.products.map((product, pIndex) => (
                        <li key={pIndex} className="flex items-center">
                          <div className="w-4 h-4 bg-gray-200 rounded-md flex-shrink-0 ml-1"></div>
                          <span className="text-gray-700">{product}</span>
                        </li>
                      ))}
                    </ul>
                  </Td>
                  <Td>{item.total}</Td>
                  <Td>{item.date}</Td>
                  <Td>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
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
                <Th>التاجر</Th>
                <Th>الطلبات المستلمة</Th>
                <Th>الطلبات المرفوضة</Th>
                <Th>بانتظار الشحن</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-right">
              {data.map((item, index) => (
                <tr key={index}>
                  <Td>{item.merchant}</Td>
                  <Td>{item.receivedOrders}</Td>
                  <Td>{item.rejectedOrders}</Td>
                  <Td>{item.awaitingShipment}</Td>
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
  const [selectedStatus, setSelectedStatus] = useState('الكل');
  const [selectedPayment, setSelectedPayment] = useState('الكل');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState([]);

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setModalData([]);
  };

  const openStatModal = (cardIcon) => {
    let title = '';
    let data = [];
    switch (cardIcon) {
      case 'orders':
        title = 'إجمالي الطلبات حسب التاجر';
        data = ordersByMerchantData;
        break;
      case 'received':
        title = 'طلبات مستلمة';
        data = ordersData.filter(order => order.status === 'مكتمل');
        break;
      case 'rejected':
        title = 'طلبات مرفوضة';
        data = ordersData.filter(order => order.status === 'ملغي');
        break;
      case 'sales':
        title = 'إجمالي المبيعات';
        data = merchantDetailsData;
        break;
      default:
        return;
    }
    setModalTitle(title);
    setModalData(data);
    setIsModalOpen(true);
  };

  const filteredOrders = ordersData.filter(order => {
    const statusMatch = selectedStatus === 'الكل' || order.status === selectedStatus;
    const paymentMatch = selectedPayment === 'الكل' || order.payment === selectedPayment;
    return statusMatch && paymentMatch;
  });

  const getModalComponent = () => {
    if (selectedOrder) {
      return <OrderDetailsModal isOpen={isModalOpen} onClose={closeModal} order={selectedOrder} />;
    }
    if (modalData.length > 0) {
      if (modalTitle.includes('إجمالي الطلبات')) {
        return <TotalOrdersByMerchantModal isOpen={isModalOpen} onClose={closeModal} title={modalTitle} data={modalData} />;
      }
      return <GenericModal isOpen={isModalOpen} onClose={closeModal} title={modalTitle} data={modalData} />;
    }
    return null;
  };
  
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
            <Dropdown
              options={paymentOptions}
              selected={selectedPayment}
              onSelect={setSelectedPayment}
              placeholder="الكل"
            />
          </div>
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="ابحث برقم الطلب / العميل / المنتج"
              className="w-full md:w-80 px-4 py-2 text-sm bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-800 placeholder-gray-400"
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
                <Th>الدفع</Th>
                <Th>تاريخ الطلب</Th>
                <Th>تاريخ الاستلام</Th>
                <Th>الإجراءات</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-right">
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <Td>#{order.orderNumber}</Td>
                  <Td>{order.customerName}</Td>
                  <Td>
                    <ul className="list-none space-y-1">
                      {order.products.map((product, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-4 h-4 bg-gray-200 rounded-md flex-shrink-0 ml-1"></div>
                          <span className="text-gray-700">{product}</span>
                        </li>
                      ))}
                    </ul>
                  </Td>
                  <Td>{order.total}</Td>
                  <Td>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </Td>
                  <Td>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.payment)}`}>
                      {order.payment}
                    </span>
                  </Td>
                  <Td>{order.orderDate}</Td>
                  <Td>{order.deliveryDate || 'لم يتم الاستلام'}</Td>
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
          <span className="text-gray-700">إجمالي المنتجات: 8764</span>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-gray-500">أعرض في الصفحة 10</span>
            <div className="flex space-x-1 rtl:space-x-reverse">
              {[1, 2, 3, 4, 5].map(page => (
                <button
                  key={page}
                  className={`px-3 py-1 rounded-md text-sm ${page === 1 ? 'bg-red-500 text-white' : 'bg-white text-gray-700 border'}`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {getModalComponent()}
    </div>
  );
};

export default OrdersPage;