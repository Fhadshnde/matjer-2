import React, { useState, useEffect } from 'react';
import { IoChevronUp, IoChevronDown, IoSearchOutline, IoAdd, IoEllipsisHorizontal, IoEye, IoPencil, IoBarChart, IoPause, IoClose, IoTrash } from 'react-icons/io5';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const baseURL = 'https://products-api.cbc-apps.net';
const token = localStorage.getItem('token');

const fetchAPI = async (endpoint) => {
  const response = await fetch(`${baseURL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  return response.json();
};

const postAPI = async (endpoint, data) => {
  const response = await fetch(`${baseURL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  return response.json();
};

function Card({ title, value, change, icon }) {
  const isPositive = typeof change === 'string' && change.startsWith('+');
  return (
    <div className="flex-1 p-4 bg-white rounded-lg shadow-md flex justify-between items-center text-right">
      <div className="flex flex-col items-end">
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-xl font-bold mt-1 text-gray-900">{value}</p>
        <div className="text-xs mt-2" style={{ color: isPositive ? '#22C55E' : '#EF4444' }}>{change}</div>
      </div>
      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">{icon}</div>
    </div>
  );
}

function DropdownMenu({ options, selected, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-32 text-right">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-end w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
      >
        <span>{selected}</span>
        {isOpen ? <IoChevronUp className="w-5 h-5 mr-2 text-gray-500" /> : <IoChevronDown className="w-5 h-5 mr-2 text-gray-500" />}
      </button>
      {isOpen && (
        <div className="absolute right-0 z-10 w-full mt-2 origin-top-right bg-white rounded-md shadow-lg border border-gray-200">
          <div className="py-1">
            {options.map((option) => (
              <a
                key={option}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onSelect(option);
                  setIsOpen(false);
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {option}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center space-x-2 text-gray-500 text-sm">
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="px-3 py-1 text-gray-700 rounded-md"><IoChevronUp className="-rotate-90" /></button>
      {pages.map(page => (
        <button key={page} onClick={() => onPageChange(page)} className={`px-3 py-1 ${currentPage === page ? 'bg-red-500 text-white' : 'text-gray-700'} rounded-md`}>{page}</button>
      ))}
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} className="px-3 py-1 text-gray-700 rounded-md"><IoChevronUp className="rotate-90" /></button>
    </div>
  );
}

function MoreMenu({ onAction }) {
  return (
    <div className="absolute right-0 top-6 z-10 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg border border-gray-200">
      <div className="py-1">
        <button onClick={() => onAction('viewDetails')} className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <IoEye className="w-5 h-5 ml-3" />
          عرض التفاصيل
        </button>
        <button onClick={() => onAction('editSettings')} className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <IoPencil className="w-5 h-5 ml-3" />
          تعديل الإعدادات
        </button>
        <button onClick={() => onAction('showStats')} className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <IoBarChart className="w-5 h-5 ml-3" />
          عرض الإحصائيات
        </button>
        <button onClick={() => onAction('pauseDelivery')} className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <IoPause className="w-5 h-5 ml-3" />
          إيقاف التوصيل مؤقتًا
        </button>
        <hr className="my-1 border-gray-300" />
        <button onClick={() => onAction('close')} className="flex items-center w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50">
          <IoTrash className="w-5 h-5 ml-3" />
          اغلاق
        </button>
      </div>
    </div>
  );
}

function MoreMenuOffers({ onAction }) {
  return (
    <div className="absolute left-[-10px] top-6 z-10 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg border border-gray-200">
      <div className="py-1">
        <button onClick={() => onAction('viewDetailsOffer')} className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <IoEye className="w-5 h-5 ml-3" />
          عرض التفاصيل
        </button>
        <button onClick={() => onAction('editOffer')} className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <IoPencil className="w-5 h-5 ml-3" />
          تعديل العرض
        </button>
        <button onClick={() => onAction('addNote')} className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <IoBarChart className="w-5 h-5 ml-3" />
          اضافة ملاحظة
        </button>
        <hr className="my-1 border-gray-300" />
        <button onClick={() => onAction('deleteOffer')} className="flex items-center w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50">
          <IoTrash className="w-5 h-5 ml-3" />
          حذف العرض
        </button>
        <button onClick={() => onAction('duplicateOffer')} className="flex items-center w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50">
          <IoAdd className="w-5 h-5 ml-3" />
          تكرار العرض
        </button>
      </div>
    </div>
  );
}

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 mx-4">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <IoClose className="w-6 h-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function AddNewRegionModal({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [estimatedDays, setEstimatedDays] = useState('');

  const handleAdd = async () => {
    try {
      await postAPI('/supplier/shipping/areas', { name, deliveryFee: Number(deliveryFee), estimatedDays: Number(estimatedDays) });
      onClose();
      onAdd();
    } catch (error) {
      console.error("Failed to add new region:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">إضافة منطقة توصيل جديدة</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ادخل اسم المنطقة"
            className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300"
          />
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">اسم المنطقة</label>
        </div>
        <div className="flex items-center">
          <input
            type="number"
            value={deliveryFee}
            onChange={(e) => setDeliveryFee(e.target.value)}
            placeholder="ادخل قيمة التوصيل"
            className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300"
          />
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">قيمة التوصيل</label>
        </div>
        <div className="flex items-center">
          <input
            type="number"
            value={estimatedDays}
            onChange={(e) => setEstimatedDays(e.target.value)}
            placeholder="ادخل عدد الأيام"
            className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300"
          />
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">الأيام المتوقعة</label>
        </div>
      </div>
      <div className="flex justify-between mt-8 space-x-4">
        <button onClick={onClose} className="flex-1 py-3 text-red-500 border border-red-500 rounded-md font-semibold">
          إلغاء
        </button>
        <button onClick={handleAdd} className="flex-1 py-3 bg-red-500 text-white rounded-md font-semibold">
          إضافة
        </button>
      </div>
    </Modal>
  );
}

function AddNewOfferModal({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('minimum_order');
  const [value, setValue] = useState('');
  const [period, setPeriod] = useState('');

  const handleAdd = async () => {
    try {
      await postAPI('/supplier/shipping/free-delivery-offers', { name, type, value: Number(value), period });
      onClose();
      onAdd();
    } catch (error) {
      console.error("Failed to add new offer:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">إضافة عرض جديد</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسم العرض"
            className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300"
          />
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">اسم العرض</label>
        </div>
        <div className="flex items-center">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="ادخل القيمة"
            className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300"
          />
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">قيمة العرض</label>
        </div>
        <div className="flex items-center">
          <input
            type="text"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            placeholder="مثال: 30 days"
            className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300"
          />
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">المدة</label>
        </div>
      </div>
      <div className="flex justify-between mt-8 space-x-4">
        <button onClick={onClose} className="flex-1 py-3 text-red-500 border border-red-500 rounded-md font-semibold">
          إلغاء
        </button>
        <button onClick={handleAdd} className="flex-1 py-3 bg-red-500 text-white rounded-md font-semibold">
          إضافة
        </button>
      </div>
    </Modal>
  );
}

function Table({ title, columns, tableData, isShippingTable, onPageChange, pagination, refreshData }) {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [modalStates, setModalStates] = useState({
    viewDetails: false,
    editSettings: false,
    showStats: false,
    pauseDelivery: false,
    addNew: false,
    viewDetailsOffer: false,
    editOffer: false,
    addNote: false,
    deleteOffer: false,
    duplicateOffer: false,
  });

  const toggleMoreMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const handleAction = (action) => {
    setOpenMenuIndex(null);
    setModalStates(prev => ({ ...prev, [action]: true }));
  };

  const closeModal = (modalName) => {
    setModalStates(prev => ({ ...prev, [modalName]: false }));
  };

  const reversedColumns = [...columns].reverse();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <button onClick={() => setModalStates(prev => ({ ...prev, addNew: true }))} className="flex items-center px-4 py-2 text-white text-sm bg-red-500 rounded-lg">
            <IoAdd className="w-5 h-5 ml-2" />
            {isShippingTable ? 'إضافة منطقة جديدة' : 'إضافة عرض جديد'}
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث المنطقة, رسوم التوصيل"
              className="pl-10 pr-4 py-2 text-right text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500 w-72"
            />
            <IoSearchOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <DropdownMenu options={['الكل', 'نشط', 'منتهي', 'مجدول']} selected="الكل" onSelect={() => {}} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-3 px-4 text-gray-500 font-normal">الإجراءات</th>
              {reversedColumns.map((col, index) => (
                <th key={index} className="py-3 px-4 text-gray-500 font-normal">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-200 hover:bg-gray-50 text-gray-800">
                <td className="py-4 px-4 relative">
                  <button onClick={() => toggleMoreMenu(rowIndex)} className="text-gray-500 hover:text-gray-900">
                    <IoEllipsisHorizontal className="w-5 h-5" />
                  </button>
                  {openMenuIndex === rowIndex && (isShippingTable ? <MoreMenu onAction={handleAction} /> : <MoreMenuOffers onAction={handleAction} />)}
                </td>
                {isShippingTable && (
                  <>
                    <td className="py-4 px-4">{row.localDeliveryAvailable}</td>
                    <td className="py-4 px-4">{row.area}</td>
                    <td className="py-4 px-4">{row.deliveryValue}</td>
                    <td className="py-4 px-4">{row.shippingType}</td>
                    <td className="py-4 px-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                        {row.deliveryStatus}
                      </span>
                    </td>
                  </>
                )}
                {!isShippingTable && (
                  <>
                    <td className="py-4 px-4">{row.offer}</td>
                    <td className="py-4 px-4">{row.duration}</td>
                    <td className="py-4 px-4">{row.condition}</td>
                    <td className="py-4 px-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                        {row.status}
                      </span>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <p>اجمالي المناطق: {pagination.totalItems}</p>
          <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={onPageChange} />
          <div className="flex items-center space-x-2">
            <span>عرض في الصفحة</span>
            <select className="bg-gray-100 text-gray-900 rounded-md px-2 py-1 border border-gray-300">
              <option>20</option>
            </select>
          </div>
        </div>
      )}

      {isShippingTable ? (
        <AddNewRegionModal isOpen={modalStates.addNew} onClose={() => closeModal('addNew')} onAdd={refreshData} />
      ) : (
        <AddNewOfferModal isOpen={modalStates.addNew} onClose={() => closeModal('addNew')} onAdd={refreshData} />
      )}
    </div>
  );
}

function App() {
  const [shippingSettings, setShippingSettings] = useState(null);
  const [shippingAreas, setShippingAreas] = useState([]);
  const [shippingPagination, setShippingPagination] = useState(null);
  const [deliveryOffers, setDeliveryOffers] = useState([]);
  const [deliveryPagination, setDeliveryPagination] = useState(null);

  const fetchShippingData = async (page = 1) => {
    try {
      const settings = await fetchAPI('/supplier/shipping/settings');
      setShippingSettings(settings);

      const areas = await fetchAPI(`/supplier/shipping/areas?page=${page}&limit=20`);
      setShippingAreas(areas.areas);
      setShippingPagination(areas.pagination);

      const offers = await fetchAPI(`/supplier/shipping/free-delivery-offers?page=${page}&limit=20`);
      setDeliveryOffers(offers.offers);
      setDeliveryPagination(offers.pagination);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchShippingData();
  }, []);

  const shippingColumns = ['حالة التوصيل', 'نوع الشحن', 'قيمة الرسوم', 'المنطقة', 'التوصيل المحلي متاح؟'];
  const deliveryColumns = ['حالة التوصيل', 'الشرط', 'المدة', 'العرض'];

  if (!shippingSettings) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen text-gray-900 p-8 font-['Tajawal']">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card title={shippingSettings.cards.avgDeliveryTime.title} value={shippingSettings.cards.avgDeliveryTime.value} change={shippingSettings.cards.avgDeliveryTime.change} />
        <Card title={shippingSettings.cards.activeOffers.title} value={`${shippingSettings.cards.activeOffers.value} عروض`} change={shippingSettings.cards.activeOffers.change} />
        <Card title={shippingSettings.cards.disabledAreas.title} value={`${shippingSettings.cards.disabledAreas.value} مناطق`} change={shippingSettings.cards.disabledAreas.change} />
        <Card title={shippingSettings.cards.activeAreas.title} value={`${shippingSettings.cards.activeAreas.value} منطقة`} change={shippingSettings.cards.activeAreas.change} />
      </div>

      <Table
        title="إعدادات الشحن"
        columns={shippingColumns}
        tableData={shippingAreas}
        isShippingTable={true}
        onPageChange={(page) => fetchShippingData(page)}
        pagination={shippingPagination}
        refreshData={() => fetchShippingData(shippingPagination.currentPage)}
      />

      <Table
        title="عروض التوصيل المحلي المجاني"
        columns={deliveryColumns}
        tableData={deliveryOffers}
        isShippingTable={false}
        onPageChange={(page) => fetchShippingData(page)}
        pagination={deliveryPagination}
        refreshData={() => fetchShippingData(deliveryPagination.currentPage)}
      />
    </div>
  );
}

export default App;