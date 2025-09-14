import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RiCloseFill } from 'react-icons/ri';
import { FaRegComment, FaRegUser, FaBell, FaCalendarAlt, FaStar, FaStore, FaChartBar } from 'react-icons/fa';
import { BiDollar } from 'react-icons/bi';

// بيانات وهمية
const merchantsData = [
  {
    id: 1,
    name: 'يوسف جاد',
    phone: '+9647700000000',
    email: 'ahmad@nike.com',
    city: 'بغداد',
    registrationDate: '2024-11-10',
    status: 'نشط',
    storeName: 'يوسكو للأدوات المنزلية',
    activity: 'أدوات منزلية',
    products: 120,
    walletBalance: '150,000د.ع',
    totalSales: '250,000د.ع',
    productsData: [
      { name: 'محفظة كهربائية', price: '320د.ع', orders: 300, rating: 4, status: 'متوفر' },
      { name: 'محفظة كهربائية', price: '320د.ع', orders: 300, rating: 4, status: 'متوفر' },
      { name: 'محفظة كهربائية', price: '320د.ع', orders: 300, rating: 4, status: 'متوفر' },
      { name: 'محفظة كهربائية', price: '320د.ع', orders: 300, rating: 4, status: 'متوفر' },
      { name: 'محفظة كهربائية', price: '320د.ع', orders: 300, rating: 4, status: 'متوفر' },
    ],
    ordersData: [
      { id: '#1045', date: '2025-08-03', customer: 'أحمد عبد الله', amount: '340د.ع', status: 'مكتمل' },
      { id: '#1045', date: '2025-08-03', customer: 'أحمد عبد الله', amount: '340د.ع', status: 'مكتمل' },
      { id: '#1045', date: '2025-08-03', customer: 'أحمد عبد الله', amount: '340د.ع', status: 'مكتمل' },
      { id: '#1045', date: '2025-08-03', customer: 'أحمد عبد الله', amount: '340د.ع', status: 'مكتمل' },
      { id: '#1045', date: '2025-08-03', customer: 'أحمد عبد الله', amount: '340د.ع', status: 'مكتمل' },
    ],
    ratingsData: [
      { date: '2025-07-30', user: 'أحمد فؤاد', rating: 4, comment: 'الخدمة ممتازة ولكن التغليف متوسط' },
      { date: '2025-07-30', user: 'أحمد فؤاد', rating: 4, comment: 'الخدمة ممتازة ولكن التغليف متوسط' },
      { date: '2025-07-30', user: 'أحمد فؤاد', rating: 4, comment: 'الخدمة ممتازة ولكن التغليف متوسط' },
      { date: '2025-07-30', user: 'أحمد فؤاد', rating: 4, comment: 'الخدمة ممتازة ولكن التغليف متوسط' },
      { date: '2025-07-30', user: 'أحمد فؤاد', rating: 4, comment: 'الخدمة ممتازة ولكن التغليف متوسط' },
    ],
  },
  {
    id: 2,
    name: 'أحمد علي',
    phone: '0566666666',
    email: 'ahmed.a@gmail.com',
    city: 'جدة',
    registrationDate: '05/01/2024',
    status: 'نشط',
    storeName: 'متجر التكنولوجيا',
    activity: 'أجهزة إلكترونية',
    products: 50,
    walletBalance: '90,000د.ع',
    totalSales: '120,000د.ع',
    productsData: [
      { name: 'هاتف ذكي', price: '1500د.ع', orders: 50, rating: 4.9, status: 'متوفر' },
      { name: 'سماعة بلوتوث', price: '250د.ع', orders: 30, rating: 4.7, status: 'متوفر' },
    ],
    ordersData: [
      { id: '#2001', date: '2025-08-05', customer: 'نورا', amount: '1600.00د.ع', status: 'مكتمل' },
      { id: '#2002', date: '2025-08-06', customer: 'علي', amount: '500.00د.ع', status: 'قيد الشحن' },
    ],
    ratingsData: [
      { date: '2025-08-04', user: 'سعيد', rating: 5, comment: 'أفضل متجر إلكترونيات.' },
    ],
  },
];

const StatusBadge = ({ status }) => {
  const colorMap = {
    'نشط': 'bg-green-100 text-green-700',
    'مكتمل': 'bg-green-100 text-green-700',
    'متوفر': 'bg-green-100 text-green-700',
    'قيد الشحن': 'bg-yellow-100 text-yellow-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorMap[status]}`}>
      {status}
    </span>
  );
};

const Th = ({ children, className = '' }) => (
  <th className={`p-3 font-semibold text-gray-500 ${className}`}>{children}</th>
);

const Td = ({ children, className = '' }) => (
  <td className={`p-3 text-xs text-gray-700 ${className}`}>{children}</td>
);

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <FaStar
        key={i}
        className={`w-3 h-3 ${i < fullStars ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    );
  }
  return <div className="flex items-center space-x-0.5 rtl:space-x-reverse">{stars}</div>;
};

// Modal Components
const AddNoteModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">اضافه ملاحظه</h2>
        <button onClick={onClose}>
          <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
        </button>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">اختار التاريخ</label>
          <div className="relative">
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm pl-10" value="1 / 8 / 2025" readOnly />
            <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">ادخل نص الملاحظه</label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
            rows="4"
            placeholder="ادخل ملاحظاتك..."
          ></textarea>
        </div>
      </div>
      <div className="p-4 border-t flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-1.5 text-gray-700 text-sm font-medium">
          الغاء
        </button>
        <button className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium">
          حفظ
        </button>
      </div>
    </div>
  </div>
);

const SendNotificationModal = ({ onClose }) => {
  const [channels, setChannels] = useState({
    email: true,
    sms: true,
    inApp: true,
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setChannels(prevChannels => ({
      ...prevChannels,
      [name]: checked,
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
      <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">إرسال إشعار</h2>
          <button onClick={onClose}>
            <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <input
              type="checkbox"
              name="email"
              checked={channels.email}
              onChange={handleCheckboxChange}
              className="form-checkbox h-4 w-4 text-red-600 rounded"
            />
            <label className="text-gray-700 font-semibold">البريد الالكتروني</label>
          </div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <input
              type="checkbox"
              name="sms"
              checked={channels.sms}
              onChange={handleCheckboxChange}
              className="form-checkbox h-4 w-4 text-red-600 rounded"
            />
            <label className="text-gray-700 font-semibold">رسالة نصية SMS</label>
          </div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <input
              type="checkbox"
              name="inApp"
              checked={channels.inApp}
              onChange={handleCheckboxChange}
              className="form-checkbox h-4 w-4 text-red-600 rounded"
            />
            <label className="text-gray-700 font-semibold">اشعار داخل التطبيق</label>
          </div>
        </div>
        <div className="p-4 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-1.5 text-gray-700 text-sm font-medium">
            الغاء
          </button>
          <button className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium">
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
};

const BlockMerchantModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-sm text-center">
      <div className="p-4 flex justify-end">
        <button onClick={onClose}>
          <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
        </button>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex justify-center text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold">هل أنت متأكد أنك تريد حظر التاجر؟</h2>
        <p className="text-gray-500 text-sm">
          سوف يتم حظر التاجر نهائياً من قائمة التجار لديك
        </p>
        <p className="text-gray-500 text-sm font-bold">
          هل أنت متأكد أنك تريد الحظر؟
        </p>
      </div>
      <div className="p-4 border-t flex justify-center gap-3">
        <button onClick={onClose} className="px-6 py-2 text-gray-700 font-medium">
          الغاء
        </button>
        <button className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium">
          حظر التاجر
        </button>
      </div>
    </div>
  </div>
);

const MerchantDetails = () => {
  const [activeModal, setActiveModal] = useState(null);
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const merchant = merchantsData.find(m => m.id === parseInt(id));
    setData(merchant);
  }, [id]);

  const handleOpenModal = (modalName) => {
    setActiveModal(modalName);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  if (!data) {
    return (
      <div dir="rtl" className="p-6 text-center text-gray-500">
        <h1 className="text-2xl font-bold">جارٍ تحميل بيانات التاجر...</h1>
      </div>
    );
  }

  const sections = [
    { title: 'الطلبات المكتملة', value: '94%', icon: <FaChartBar /> },
    { title: 'عدد الشكاوي', value: '3 شكاوي', icon: <FaRegComment /> },
    { title: 'عدد الطلبات', value: '450 طلب', icon: <FaChartBar /> },
    { title: 'عدد المنتجات', value: '120 منتج', icon: <FaChartBar /> },
  ];

  const renderTable = (type) => {
    let tableData, columns, total;
  
    switch (type) {
      case 'products':
        tableData = data.productsData;
        columns = [
          { key: 'name', header: 'اسم المنتج' },
          { key: 'price', header: 'السعر' },
          { key: 'orders', header: 'عدد الطلبات' },
          { key: 'rating', header: 'التقييم', isRating: true },
          { key: 'status', header: 'الحالة', isStatus: true },
        ];
        total = data.productsData.length;
        break;
      case 'orders':
        tableData = data.ordersData;
        columns = [
          { key: 'id', header: 'رقم الطلب' },
          { key: 'date', header: 'التاريخ' },
          { key: 'customer', header: 'الزبون' },
          { key: 'amount', header: 'المبلغ' },
          { key: 'status', header: 'الحالة', isStatus: true },
        ];
        total = data.ordersData.length;
        break;
      case 'ratings':
        tableData = data.ratingsData;
        columns = [
          { key: 'user', header: 'الزبون' },
          { key: 'date', header: 'التاريخ' },
          { key: 'comment', header: 'التعليق' },
          { key: 'rating', header: 'التقييم', isRating: true },
        ];
        total = data.ratingsData.length;
        break;
      default:
        return null;
    }
  
    return (
      <div className="bg-white rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-right">
              <tr>
                {columns.map((col, index) => (
                  <Th key={index}>{col.header}</Th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-right">
              {tableData.map((item, index) => (
                <tr key={index}>
                  {columns.map((col, colIndex) => (
                    <Td key={colIndex}>
                      {col.isStatus ? (
                        <StatusBadge status={item[col.key]} />
                      ) : col.isRating ? (
                        <StarRating rating={item[col.key]} />
                      ) : (
                        item[col.key]
                      )}
                    </Td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="text-gray-500 text-sm flex items-center">
            أعرض في الصفحة
            <select className="mx-2 border border-gray-300 rounded-md py-1 px-2">
              <option>10</option>
              <option>20</option>
            </select>
          </div>
          <div className="flex items-center space-x-1 rtl:space-x-reverse text-gray-500">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-red-500">&gt;</button>
            <span className="px-3 py-1 border border-gray-300 rounded-md text-red-500 font-bold">1</span>
            <span className="px-3 py-1 border border-gray-300 rounded-md">2</span>
            <span className="px-3 py-1 border border-gray-300 rounded-md">3</span>
            <span className="px-3 py-1 border border-gray-300 rounded-md">4</span>
            <span className="px-3 py-1 border border-gray-300 rounded-md">5</span>
            <button className="px-3 py-1 border border-gray-300 rounded-md">&lt;</button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div dir="rtl" className="p-3 bg-gray-50 min-h-screen font-sans flex flex-col lg:flex-row gap-4">
      
      {/* Right Column (User Info & Action Buttons) */}
      <div className="lg:w-1/3 space-y-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <img src="https://via.placeholder.com/80" alt="User Profile" className="w-20 h-20 rounded-full" />
            <div className="text-right">
              <h2 className="text-lg font-bold">{data.name}</h2>
              <p className="text-sm text-gray-500">{data.phone}</p>
              <p className="text-sm text-gray-500">{data.email}</p>
              <p className="text-sm text-gray-500">تاريخ التسجيل: {data.registrationDate}</p>
              <StatusBadge status={data.status} />
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button onClick={() => handleOpenModal('block')} className="bg-red-500 text-white py-2 px-4 rounded-lg flex-1 mx-1 flex items-center justify-center">
              <FaRegComment className="ml-2" /> حظر
            </button>
            <button onClick={() => handleOpenModal('addNote')} className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg flex-1 mx-1 flex items-center justify-center">
              <FaRegComment className="ml-2" /> اضافه ملاحظه
            </button>
          </div>
          <button onClick={() => handleOpenModal('sendNotification')} className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg mt-2 flex items-center justify-center">
            <FaBell className="ml-2" /> إرسال إشعار
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">بيانات المتجر</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between items-center">
              <span>اسم المتجر</span>
              <span className="font-medium">{data.storeName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>نوع النشاط</span>
              <span className="font-medium">{data.activity}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>المحافظة</span>
              <span className="font-medium">{data.city}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Left Column (Stats & Tables) */}
      <div className="lg:w-2/3 space-y-4">
        {/* Top Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="flex justify-center mb-2 text-xl text-gray-500">{section.icon}</div>
              <p className="text-sm text-gray-500 mb-1">{section.title}</p>
              <p className="text-lg font-bold">{section.value}</p>
            </div>
          ))}
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md">
          <h3 className="p-4 text-lg font-bold border-b">المنتجات التابعة له</h3>
          {renderTable('products')}
          <div className="p-4 text-right text-sm text-gray-500">
            إجمالي المنتجات: {data.productsData.length}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-md">
          <h3 className="p-4 text-lg font-bold border-b">الطلبات الخاصة به</h3>
          {renderTable('orders')}
          <div className="p-4 text-right text-sm text-gray-500">
            إجمالي الطلبات: {data.ordersData.length}
          </div>
        </div>

        {/* Ratings Table */}
        <div className="bg-white rounded-lg shadow-md">
          <h3 className="p-4 text-lg font-bold border-b">التقييمات</h3>
          {renderTable('ratings')}
          <div className="p-4 text-right text-sm text-gray-500">
            إجمالي التقييمات: {data.ratingsData.length}
          </div>
        </div>
      </div>
      
      {/* Modals */}
      {activeModal === 'addNote' && <AddNoteModal onClose={handleCloseModal} />}
      {activeModal === 'sendNotification' && <SendNotificationModal onClose={handleCloseModal} />}
      {activeModal === 'block' && <BlockMerchantModal onClose={handleCloseModal} />}
    </div>
  );
};

export default MerchantDetails;