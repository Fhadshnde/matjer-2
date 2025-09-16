import React, { useState, useEffect } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { RiCloseFill } from 'react-icons/ri';
import { FiEdit2 } from 'react-icons/fi';
import { FaTrash, FaRegComment, FaEnvelope, FaClipboardCheck, FaBoxOpen, FaRegPauseCircle, FaChartBar, FaCalendarAlt, FaChevronDown, FaRegUser, FaBell } from 'react-icons/fa';
import { MdInfoOutline } from 'react-icons/md';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { getApiUrl, getAuthHeaders, API_CONFIG } from '../../config/api';
import axios from 'axios';

// Dummy Data
const alertCards = [
  { title: 'شكاوي', value: '8 شكاوي', icon: <FaRegComment />, percentage: '8% ▲' },
  { title: 'حملة ترويجية', value: '2 حملة', icon: <FaEnvelope />, percentage: '8% ▲' },
  { title: 'فشل التوصيل', value: '5 طلبات', icon: <FaClipboardCheck />, percentage: '8% ▲' },
  { title: 'مخزون منخفض', value: '14 منتج', icon: <FaBoxOpen />, percentage: '8% ▲' },
];

const alertsData = [
  { type: 'مخزون منخفض', content: 'المنتج "علبة كهربائية" بقي فيه 2 فقط', date: '2025-08-04', status: 'تم معالج' },
  { type: 'فشل توصيل', content: 'فشل توصيل الطلب 10534# - الخبرة', date: '2025-08-04', status: 'قيد المراجعة' },
  { type: 'حملة جديدة', content: 'تم إطلاق عرض على قسم المطبخ', date: '2025-08-04', status: 'تم الاطلاع' },
  { type: 'مخزون منخفض', content: 'المنتج "علبة كهربائية" بقي فيه 2 فقط', date: '2025-08-04', status: 'تم الاطلاع' },
  { type: 'مخزون منخفض', content: 'المنتج "علبة كهربائية" بقي فيه 2 فقط', date: '2025-08-04', status: 'تم الاطلاع' },
  { type: 'مخزون منخفض', content: 'المنتج "علبة كهربائية" بقي فيه 2 فقط', date: '2025-08-04', status: 'تم الاطلاع' },
  { type: 'مخزون منخفض', content: 'المنتج "علبة كهربائية" بقي فيه 2 فقط', date: '2025-08-04', status: 'تم الاطلاع' },
  { type: 'مخزون منخفض', content: 'المنتج "علبة كهربائية" بقي فيه 2 فقط', date: '2025-08-04', status: 'تم الاطلاع' },
];

// Reusable Components
const StatusBadge = ({ status }) => {
  const colorMap = {
    'تم معالج': 'bg-red-100 text-red-700',
    'قيد المراجعة': 'bg-yellow-100 text-yellow-700',
    'تم الاطلاع': 'bg-green-100 text-green-700',
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

const Td = ({ children }) => (
  <td className="p-3 text-xs text-gray-700">{children}</td>
);

const Card = ({ title, value, icon, percentage }) => (
  <div className="bg-white rounded-lg p-4 flex items-center justify-between text-right shadow-sm">
    <div className="flex flex-col">
      <div className="flex items-center space-x-1.5 rtl:space-x-reverse mb-1">
        <span className="text-gray-400 text-xs">{title}</span>
        <BsThreeDots className="text-gray-400 text-base" />
      </div>
      <p className="text-xl font-semibold mb-1">{value}</p>
      <span className={`text-xs text-green-500`}>
        {percentage}
        <span className="mr-1">▲</span>
        <span className="text-gray-400 mr-1">عن الفترة السابقة</span>
      </span>
    </div>
    <div className="bg-gray-100 p-2.5 rounded-full text-xl text-red-500">
      {icon}
    </div>
  </div>
);

// Modals
const ViewAlertDetailsModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">تفاصيل التنبيه</h2>
        <button onClick={onClose}>
          <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
        </button>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500">نوع التنبيه</label>
          <p className="font-bold text-gray-800">مخزون منخفض</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500">التاريخ</label>
          <p className="font-bold text-gray-800">2025-08-03 - 14:30</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500">النسبة</label>
          <p className="font-bold text-gray-800">15%</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500">تفاصيل التنبيه</label>
          <p className="font-bold text-gray-800">الطلب لم يتم تسليمه بسبب خطأ في العنوان</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500">الحالة</label>
          <StatusBadge status="قيد المراجعة" />
        </div>
        <div className="pt-4">
          <label className="block text-xs font-semibold text-gray-500">ملاحظات إدارية</label>
          <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-700">
            برجاء مراجعة الطلب واختيار العنوان الصحيح
          </div>
        </div>
      </div>
      <div className="p-4 border-t flex justify-end gap-3">
        <button className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium">
          تعديل
        </button>
      </div>
    </div>
  </div>
);

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

const ChangeStatusModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">تغيير الحاله</h2>
        <button onClick={onClose}>
          <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
        </button>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">برجاء اختيار حاله التنبيه</label>
          <div className="relative">
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm appearance-none pr-8">
              <option>غير معالج</option>
              <option>قيد المراجعة</option>
              <option>تم الاطلاع</option>
            </select>
            <FaChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="p-4 border-t flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-1.5 text-gray-700 text-sm font-medium">
          الغاء
        </button>
        <button className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium">
          تعديل
        </button>
      </div>
    </div>
  </div>
);

const DeleteAlertModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-xs text-center">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">حذف التنبيه</h2>
        <button onClick={onClose}>
          <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
        </button>
      </div>
      <div className="p-4 space-y-3">
        <div className="text-red-500 text-4xl flex justify-center mx-auto w-14 h-14 rounded-full bg-red-100 items-center mb-3">
          <RiCloseFill className="text-red-500 text-3xl"/>
        </div>
        <h2 className="text-lg font-bold text-gray-800">هل أنت متأكد أنك تريد حذف التنبيه؟</h2>
        <p className="text-gray-500 text-xs">سوف يتم حذف التنبيه من قائمة التنبيهات والاشعارات ولاكن سوف يتم الاحتفاظ بنسخه في السجلات لاغراض الارشفه هل انت متاكد انك تريد حذف التنبيه ؟</p>
      </div>
      <div className="p-4 border-t flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-1.5 text-gray-700 text-sm font-medium">
          الغاء
        </button>
        <button className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium">
          حذف التنبيه
        </button>
      </div>
    </div>
  </div>
);


const AlertsDashboard = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [notificationsData, setNotificationsData] = useState([]);
  const [alertsData, setAlertsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [notificationsResponse, alertsResponse] = await Promise.all([
          axios.get(getApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATIONS.LIST), { headers: getAuthHeaders() }),
          axios.get(getApiUrl(API_CONFIG.ENDPOINTS.ALERTS.LIST), { headers: getAuthHeaders() })
        ]);

        setNotificationsData(notificationsResponse.data.notifications || []);
        setAlertsData(alertsResponse.data.alerts || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('فشل في تحميل البيانات');
        setNotificationsData([]);
        setAlertsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await axios.patch(getApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_AS_READ(notificationId)), {}, {
        headers: getAuthHeaders()
      });
      
      // Refresh notifications list
      const fetchResponse = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATIONS.LIST), {
        headers: getAuthHeaders()
      });
      
      setNotificationsData(fetchResponse.data.notifications || []);
      return { success: true, message: 'تم تمييز الإشعار كمقروء' };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, message: 'فشل في تمييز الإشعار كمقروء' };
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await axios.patch(getApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_ALL_AS_READ), {}, {
        headers: getAuthHeaders()
      });
      
      // Refresh notifications list
      const fetchResponse = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATIONS.LIST), {
        headers: getAuthHeaders()
      });
      
      setNotificationsData(fetchResponse.data.notifications || []);
      return { success: true, message: 'تم تمييز جميع الإشعارات كمقروءة' };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return { success: false, message: 'فشل في تمييز جميع الإشعارات كمقروءة' };
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const response = await axios.delete(getApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATIONS.DELETE(notificationId)), {
        headers: getAuthHeaders()
      });
      
      // Refresh notifications list
      const fetchResponse = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATIONS.LIST), {
        headers: getAuthHeaders()
      });
      
      setNotificationsData(fetchResponse.data.notifications || []);
      return { success: true, message: 'تم حذف الإشعار بنجاح' };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { success: false, message: 'فشل في حذف الإشعار' };
    }
  };

  const handleOpenModal = (modalName) => {
    setActiveModal(modalName);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen p-6 font-['Tajawal'] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen p-6 font-['Tajawal'] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">إدارة التنبيهات</h1>
      
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {alertCards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>

      {/* Main Table Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4 md:mb-0 w-full md:w-auto">
            <div className="relative">
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm appearance-none pr-8">
                <option>الكل</option>
                <option>شكاوي</option>
                <option>فشل توصيل</option>
                <option>مخزون منخفض</option>
                <option>حملة جديدة</option>
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="ابحث عن نوع التنبيه، الحاله"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
              />
              <FaMagnifyingGlass className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-right">
              <tr>
                <Th>نوع التنبيه</Th>
                <Th>المحتوى</Th>
                <Th>التاريخ</Th>
                <Th>الحالة</Th>
                <Th>الإجراءات</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-right">
              {alertsData.map((alert, index) => (
                <tr key={index}>
                  <Td>{alert.type}</Td>
                  <Td>{alert.content}</Td>
                  <Td>{alert.date}</Td>
                  <Td><StatusBadge status={alert.status} /></Td>
                  <Td>
                    <div className="relative inline-block text-right">
                      <button onClick={() => handleOpenModal(`actions-${index}`)} className="text-gray-500 hover:text-gray-700">
                        <BsThreeDots className="text-xl" />
                      </button>
                      {activeModal === `actions-${index}` && (
                        <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          <a href="#" onClick={() => handleOpenModal('details')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                            <MdInfoOutline className="ml-2" /> عرض التفاصيل
                          </a>
                          <a href="#" onClick={() => handleOpenModal('addNote')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                            <FiEdit2 className="ml-2" /> اضافه ملاحظه
                          </a>
                          <a href="#" onClick={() => handleOpenModal('changeStatus')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                            <FaRegUser className="ml-2" /> تغيير الحالة
                          </a>
                          <a href="#" onClick={() => handleOpenModal('delete')} className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 flex items-center">
                            <FaTrash className="ml-2" /> حذف التنبيه
                          </a>
                        </div>
                      )}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-700">إجمالي التنبيهات 8764</span>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-sm text-gray-500">اعرض في الصفحة 10</span>
            <div className="flex space-x-1 rtl:space-x-reverse">
              {[1, 2, 3, 4, 5].map(page => (
                <button
                  key={page}
                  className={`px-3 py-1 rounded-md text-sm ${page === 1 ? 'bg-red-500 text-white' : 'bg-white text-gray-700'}`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      {activeModal === 'details' && <ViewAlertDetailsModal onClose={handleCloseModal} />}
      {activeModal === 'addNote' && <AddNoteModal onClose={handleCloseModal} />}
      {activeModal === 'changeStatus' && <ChangeStatusModal onClose={handleCloseModal} />}
      {activeModal === 'delete' && <DeleteAlertModal onClose={handleCloseModal} />}

    </div>
  );
};

export default AlertsDashboard;