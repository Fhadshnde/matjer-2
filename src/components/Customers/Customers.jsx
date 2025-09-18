import React, { useState, useEffect } from 'react';
import { IoChevronUp, IoChevronDown, IoSearchOutline, IoAdd, IoEllipsisHorizontal, IoEye, IoPencil, IoBarChart, IoPause, IoClose, IoTrash, IoCheckmark, IoLocation, IoTime, IoCash, IoRefresh, IoFilter } from 'react-icons/io5';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { getApiUrl, getAuthHeaders } from '../../config/api';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const fetchAPI = async (endpoint) => {
  const response = await fetch(getApiUrl(endpoint), {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  return response.json();
};

const postAPI = async (endpoint, data) => {
  const response = await fetch(getApiUrl(endpoint), {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  return response.json();
};

const patchAPI = async (endpoint, data) => {
  const response = await fetch(getApiUrl(endpoint), {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  return response.json();
};

const deleteAPI = async (endpoint) => {
  const response = await fetch(getApiUrl(endpoint), {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  return response.json();
};

function Card({ title, value, change, icon, trend, details }) {
  const isPositive = typeof change === 'string' && change.startsWith('+');
  const isUp = trend === 'up';

  return (
    <div className="flex-1 p-6 bg-white rounded-lg shadow-md flex justify-between items-center text-right hover:shadow-lg transition-shadow">
      <div className="flex flex-col items-end">
        <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        <div className="text-xs flex items-center" style={{ color: isPositive ? '#22C55E' : '#EF4444' }}>
          {isUp ? <IoChevronUp className="w-3 h-3 ml-1" /> : <IoChevronDown className="w-3 h-3 ml-1" />}
          {change}
        </div>
        {details && <p className="text-xs text-gray-400 mt-1">{details}</p>}
      </div>
      <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center text-red-600">
        {icon}
      </div>
    </div>
  );
}

function DropdownMenu({ options, selected, onSelect, placeholder = "اختر" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-40 text-right">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500"
      >
        <span>{selected || placeholder}</span>
        {isOpen ? <IoChevronUp className="w-4 h-4 text-gray-500" /> : <IoChevronDown className="w-4 h-4 text-gray-500" />}
      </button>
      {isOpen && (
        <div className="absolute right-0 z-10 w-full mt-2 origin-top-right bg-white rounded-md shadow-lg border border-gray-200">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {option}
              </button>
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
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-1 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <IoChevronUp className="rotate-90" />
      </button>
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 ${currentPage === page ? 'bg-red-500 text-white' : 'text-gray-700 hover:bg-gray-100'} rounded-md`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <IoChevronUp className="-rotate-90" />
      </button>
    </div>
  );
}

function MoreMenu({ onAction, item, isShippingTable }) {
  const menuOptions = isShippingTable ? (
    <>
      <button onClick={() => onAction('viewDetails', item)} className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
        <IoEye className="w-4 h-4 ml-3" />
        عرض التفاصيل
      </button>
      <button onClick={() => onAction('editSettings', item)} className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
        <IoPencil className="w-4 h-4 ml-3" />
        تعديل الإعدادات
      </button>
      <button onClick={() => onAction('showStats', item)} className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
        <IoBarChart className="w-4 h-4 ml-3" />
        عرض الإحصائيات
      </button>
      <button
        onClick={() => onAction('toggleStatus', item)}
        className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        {item.deliveryStatus === 'نشط' ? <IoPause className="w-4 h-4 ml-3" /> : <IoCheckmark className="w-4 h-4 ml-3" />}
        {item.deliveryStatus === 'نشط' ? 'إيقاف التوصيل' : 'تفعيل التوصيل'}
      </button>
      <hr className="my-1 border-gray-300" />
      <button onClick={() => onAction('delete', item)} className="flex items-center w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50">
        <IoTrash className="w-4 h-4 ml-3" />
        حذف المنطقة
      </button>
    </>
  ) : (
    <>
      <button onClick={() => onAction('viewDetailsOffer', item)} className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
        <IoEye className="w-4 h-4 ml-3" />
        عرض التفاصيل
      </button>
      <button onClick={() => onAction('editOffer', item)} className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
        <IoPencil className="w-4 h-4 ml-3" />
        تعديل العرض
      </button>
      <button onClick={() => onAction('duplicateOffer', item)} className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
        <IoAdd className="w-4 h-4 ml-3" />
        تكرار العرض
      </button>
      <button
        onClick={() => onAction('toggleOfferStatus', item)}
        className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        {item.status === 'نشط' ? <IoPause className="w-4 h-4 ml-3" /> : <IoCheckmark className="w-4 h-4 ml-3" />}
        {item.status === 'نشط' ? 'إيقاف العرض' : 'تفعيل العرض'}
      </button>
      <hr className="my-1 border-gray-300" />
      <button onClick={() => onAction('deleteOffer', item)} className="flex items-center w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50">
        <IoTrash className="w-4 h-4 ml-3" />
        حذف العرض
      </button>
    </>
  );

  return (
    <div className="absolute right-0 top-6 z-10 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg border border-gray-200">
      <div className="py-1">
        {menuOptions}
      </div>
    </div>
  );
}

function Modal({ isOpen, onClose, children, title }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
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
  const [formData, setFormData] = useState({
    name: '',
    deliveryFee: '',
    estimatedDays: '',
    shippingType: 'توصيل عادي',
    isActive: true
  });
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    try {
      setLoading(true);
      await postAPI('/supplier/shipping/areas', {
        name: formData.name,
        deliveryFee: Number(formData.deliveryFee),
        estimatedDays: Number(formData.estimatedDays),
        shippingType: formData.shippingType,
        isActive: formData.isActive
      });
      onClose();
      onAdd();
      setFormData({ name: '', deliveryFee: '', estimatedDays: '', shippingType: 'توصيل عادي', isActive: true });
    } catch (error) {
      console.error("Failed to add new region:", error);
      alert('فشل في إضافة المنطقة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="إضافة منطقة توصيل جديدة">
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="ادخل اسم المنطقة"
            className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">اسم المنطقة</label>
        </div>
        <div className="flex items-center">
          <input
            type="number"
            value={formData.deliveryFee}
            onChange={(e) => setFormData({...formData, deliveryFee: e.target.value})}
            placeholder="ادخل قيمة التوصيل"
            className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">قيمة التوصيل</label>
        </div>
        <div className="flex items-center">
          <input
            type="number"
            value={formData.estimatedDays}
            onChange={(e) => setFormData({...formData, estimatedDays: e.target.value})}
            placeholder="ادخل عدد الأيام"
            className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">الأيام المتوقعة</label>
        </div>
        <div className="flex items-center">
          <select
            value={formData.shippingType}
            onChange={(e) => setFormData({...formData, shippingType: e.target.value})}
            className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="توصيل عادي">توصيل عادي</option>
            <option value="توصيل سريع">توصيل سريع</option>
            <option value="توصيل مجاني">توصيل مجاني</option>
          </select>
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">نوع التوصيل</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
            className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
          />
          <label className="text-gray-500 text-sm mr-4">تفعيل المنطقة</label>
        </div>
      </div>
      <div className="flex justify-between mt-8 space-x-4">
        <button
          onClick={onClose}
          className="flex-1 py-3 text-red-500 border border-red-500 rounded-md font-semibold hover:bg-red-50 transition-colors"
        >
          إلغاء
        </button>
        <button
          onClick={handleAdd}
          disabled={loading || !formData.name || !formData.deliveryFee}
          className="flex-1 py-3 bg-red-500 text-white rounded-md font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'جاري الإضافة...' : 'إضافة'}
        </button>
      </div>
    </Modal>
  );
}

function AddNewOfferModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'minimum_order',
    value: '',
    period: '',
    condition: 'all'
  });
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    try {
      setLoading(true);
      await postAPI('/supplier/shipping/free-delivery-offers', {
        name: formData.name,
        type: formData.type,
        value: Number(formData.value),
        period: formData.period,
        condition: formData.condition
      });
      onClose();
      onAdd();
      setFormData({ name: '', type: 'minimum_order', value: '', period: '', condition: 'all' });
    } catch (error) {
      console.error("Failed to add new offer:", error);
      alert('فشل في إضافة العرض');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="إضافة عرض توصيل مجاني جديد">
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="اسم العرض"
            className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">اسم العرض</label>
        </div>
        <div className="flex items-center">
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="minimum_order">حد أدنى للطلب</option>
            <option value="percentage">نسبة مئوية</option>
            <option value="fixed_amount">مبلغ ثابت</option>
          </select>
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">نوع العرض</label>
        </div>
        <div className="flex items-center">
          <input
            type="number"
            value={formData.value}
            onChange={(e) => setFormData({...formData, value: e.target.value})}
            placeholder="ادخل القيمة"
            className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">قيمة العرض</label>
        </div>
        <div className="flex items-center">
          <input
            type="text"
            value={formData.period}
            onChange={(e) => setFormData({...formData, period: e.target.value})}
            placeholder="مثال: 30 days"
            className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">المدة</label>
        </div>
        <div className="flex items-center">
          <select
            value={formData.condition}
            onChange={(e) => setFormData({...formData, condition: e.target.value})}
            className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">جميع العملاء</option>
            <option value="new_customers">عملاء جدد فقط</option>
            <option value="existing_customers">عملاء موجودون فقط</option>
          </select>
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">الشرط</label>
        </div>
      </div>
      <div className="flex justify-between mt-8 space-x-4">
        <button
          onClick={onClose}
          className="flex-1 py-3 text-red-500 border border-red-500 rounded-md font-semibold hover:bg-red-50 transition-colors"
        >
          إلغاء
        </button>
        <button
          onClick={handleAdd}
          disabled={loading || !formData.name || !formData.value}
          className="flex-1 py-3 bg-red-500 text-white rounded-md font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'جاري الإضافة...' : 'إضافة'}
        </button>
      </div>
    </Modal>
  );
}

function EditRegionModal({ isOpen, onClose, onSave, item }) {
  const [formData, setFormData] = useState({
    name: item?.area || '',
    deliveryFee: item?.deliveryValue || '',
    estimatedDays: item?.estimatedDays || '',
    shippingType: item?.shippingType || 'توصيل عادي',
    isActive: item?.deliveryStatus === 'نشط'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.area || '',
        deliveryFee: item.deliveryValue || '',
        estimatedDays: item.estimatedDays || '',
        shippingType: item.shippingType || 'توصيل عادي',
        isActive: item.deliveryStatus === 'نشط'
      });
    }
  }, [item]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await patchAPI(`/supplier/shipping/areas/${item.id}`, {
        name: formData.name,
        deliveryFee: Number(formData.deliveryFee),
        estimatedDays: Number(formData.estimatedDays),
        shippingType: formData.shippingType,
        isActive: formData.isActive
      });
      onClose();
      onSave();
    } catch (error) {
      console.error("Failed to update region:", error);
      alert('فشل في تحديث المنطقة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تعديل منطقة التوصيل">
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="ادخل اسم المنطقة"
            className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">اسم المنطقة</label>
        </div>
        <div className="flex items-center">
          <input
            type="number"
            value={formData.deliveryFee}
            onChange={(e) => setFormData({...formData, deliveryFee: e.target.value})}
            placeholder="ادخل قيمة التوصيل"
            className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">قيمة التوصيل</label>
        </div>
        <div className="flex items-center">
          <input
            type="number"
            value={formData.estimatedDays}
            onChange={(e) => setFormData({...formData, estimatedDays: e.target.value})}
            placeholder="ادخل عدد الأيام"
            className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">الأيام المتوقعة</label>
        </div>
        <div className="flex items-center">
          <select
            value={formData.shippingType}
            onChange={(e) => setFormData({...formData, shippingType: e.target.value})}
            className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="توصيل عادي">توصيل عادي</option>
            <option value="توصيل سريع">توصيل سريع</option>
            <option value="توصيل مجاني">توصيل مجاني</option>
          </select>
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">نوع التوصيل</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
            className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
          />
          <label className="text-gray-500 text-sm mr-4">تفعيل المنطقة</label>
        </div>
      </div>
      <div className="flex justify-between mt-8 space-x-4">
        <button
          onClick={onClose}
          className="flex-1 py-3 text-red-500 border border-red-500 rounded-md font-semibold hover:bg-red-50 transition-colors"
        >
          إلغاء
        </button>
        <button
          onClick={handleSave}
          disabled={loading || !formData.name || !formData.deliveryFee}
          className="flex-1 py-3 bg-red-500 text-white rounded-md font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>
    </Modal>
  );
}

function ViewRegionModal({ isOpen, onClose, item }) {
  if (!item) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تفاصيل منطقة التوصيل">
      <div className="space-y-4 text-right">
        <p><strong>اسم المنطقة:</strong> {item.area}</p>
        <p><strong>قيمة التوصيل:</strong> {item.deliveryValue} دينار</p>
        <p><strong>الأيام المتوقعة:</strong> {item.estimatedDays} يوم</p>
        <p><strong>نوع التوصيل:</strong> {item.shippingType}</p>
        <p><strong>الحالة:</strong> {item.deliveryStatus}</p>
      </div>
    </Modal>
  );
}

function ViewOfferModal({ isOpen, onClose, item }) {
  if (!item) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تفاصيل العرض">
      <div className="space-y-4 text-right">
        <p><strong>اسم العرض:</strong> {item.offer}</p>
        <p><strong>المدة:</strong> {item.duration}</p>
        <p><strong>الشرط:</strong> {item.condition}</p>
        <p><strong>الحالة:</strong> {item.status}</p>
      </div>
    </Modal>
  );
}

function ShowStatsModal({ isOpen, onClose, item }) {
  const data = {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
    datasets: [
      {
        label: `إحصائيات ${item?.area || item?.offer}`,
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Tajawal',
          }
        }
      },
      title: {
        display: true,
        text: 'إحصائيات وهمية',
        font: {
          size: 16,
          family: 'Tajawal',
        }
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            family: 'Tajawal',
          }
        },
        grid: {
          display: false,
        }
      },
      y: {
        ticks: {
          font: {
            family: 'Tajawal',
          }
        },
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="إحصائيات المنطقة">
      <Bar data={data} options={options} />
      <div className="text-center mt-4">
        <p className="text-sm text-gray-500">هذه البيانات وهمية لأغراض العرض.</p>
      </div>
    </Modal>
  );
}

function Table({ title, columns, tableData, isShippingTable, onPageChange, pagination, refreshData, onAction }) {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isShowStatsModalOpen, setIsShowStatsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');

  const toggleMoreMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const handleAction = async (action, item) => {
    setOpenMenuIndex(null);
    setSelectedItem(item);

    switch (action) {
      case 'viewDetails':
      case 'viewDetailsOffer':
        setIsViewModalOpen(true);
        break;
      case 'editSettings':
      case 'editOffer':
        setIsEditModalOpen(true);
        break;
      case 'showStats':
        setIsShowStatsModalOpen(true);
        break;
      case 'delete':
      case 'deleteOffer':
        if (window.confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
          try {
            await onAction(action, item);
            refreshData();
          } catch (error) {
            console.error('Failed to delete:', error);
            alert('فشل في حذف العنصر');
          }
        }
        break;
      case 'toggleStatus':
      case 'toggleOfferStatus':
        try {
          await onAction(action, item);
          refreshData();
        } catch (error) {
          console.error('Failed to toggle status:', error);
          alert('فشل في تغيير الحالة');
        }
        break;
      default:
        break;
    }
  };

  const filteredData = tableData.filter(item => {
    const matchesSearch = isShippingTable
      ? (item.area || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.deliveryValue || '').toString().includes(searchTerm)
      : (item.offer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.condition || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'الكل' ||
      (isShippingTable ? item.deliveryStatus === statusFilter : item.status === statusFilter);

    return matchesSearch && matchesStatus;
  });

  const reversedColumns = [...columns].reverse();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center px-4 py-2 text-white text-sm bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
          >
            <IoAdd className="w-5 h-5 ml-2" />
            {isShippingTable ? 'إضافة منطقة جديدة' : 'إضافة عرض جديد'}
          </button>
          <button
            onClick={refreshData}
            className="flex items-center px-4 py-2 text-gray-600 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <IoRefresh className="w-5 h-5 ml-2" />
            تحديث
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder={isShippingTable ? "ابحث في المناطق..." : "ابحث في العروض..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 text-right text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500 w-72"
            />
            <IoSearchOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <DropdownMenu
            options={['الكل', 'نشط', 'معطل']}
            selected={statusFilter}
            onSelect={setStatusFilter}
            placeholder="فلترة"
          />
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
            {filteredData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-200 hover:bg-gray-50 text-gray-800">
                <td className="py-4 px-4 relative">
                  <button onClick={() => toggleMoreMenu(rowIndex)} className="text-gray-500 hover:text-gray-900">
                    <IoEllipsisHorizontal className="w-5 h-5" />
                  </button>
                  {openMenuIndex === rowIndex && (
                    <MoreMenu onAction={handleAction} item={row} isShippingTable={isShippingTable} />
                  )}
                </td>
                {isShippingTable ? (
                  <>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <IoLocation className="w-4 h-4 ml-2 text-gray-400" />
                        {row.localDeliveryAvailable}
                      </div>
                    </td>
                    <td className="py-4 px-4">{row.area}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        {row.deliveryValue} دينار
                      </div>
                    </td>
                    <td className="py-4 px-4">{row.shippingType}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        row.deliveryStatus === 'نشط'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {row.deliveryStatus}
                      </span>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-4 px-4">{row.offer}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <IoTime className="w-4 h-4 ml-2 text-gray-400" />
                        {row.duration}
                      </div>
                    </td>
                    <td className="py-4 px-4">{row.condition}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        row.status === 'نشط'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
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

      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <IoFilter className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>لا توجد نتائج للبحث</p>
        </div>
      )}

      {pagination && (
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <p>اجمالي العناصر: {pagination.totalItems}</p>
          <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={onPageChange} />
          <div className="flex items-center space-x-2">
            <span>عرض في الصفحة</span>
            <select className="bg-gray-100 text-gray-900 rounded-md px-2 py-1 border border-gray-300">
              <option>20</option>
            </select>
          </div>
        </div>
      )}

      {/* Modals */}
      {isShippingTable ? (
        <>
          <AddNewRegionModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={refreshData}
          />
          <EditRegionModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={refreshData}
            item={selectedItem}
          />
          <ViewRegionModal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            item={selectedItem}
          />
          <ShowStatsModal
            isOpen={isShowStatsModalOpen}
            onClose={() => setIsShowStatsModalOpen(false)}
            item={selectedItem}
          />
        </>
      ) : (
        <>
          <AddNewOfferModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={refreshData}
          />
          <EditRegionModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={refreshData}
            item={selectedItem}
          />
          <ViewOfferModal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            item={selectedItem}
          />
        </>
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchShippingData = async (page = 1) => {
    try {
      setLoading(true);
      const [settings, areas, offers] = await Promise.all([
        fetchAPI('/supplier/shipping/settings'),
        fetchAPI(`/supplier/shipping/areas?page=${page}&limit=20`),
        fetchAPI(`/supplier/shipping/free-delivery-offers?page=${page}&limit=20`)
      ]);

      setShippingSettings(settings);
      setShippingAreas(areas.areas || []);
      setShippingPagination(areas.pagination);
      setDeliveryOffers(offers.offers || []);
      setDeliveryPagination(offers.pagination);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError('فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    try {
      if (item.area) {
        await deleteAPI(`/supplier/shipping/areas/${item.id}`);
      } else {
        await deleteAPI(`/supplier/shipping/free-delivery-offers/${item.id}`);
      }
    } catch (error) {
      throw new Error('فشل في حذف العنصر');
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      if (item.area) {
        await patchAPI(`/supplier/shipping/areas/${item.id}`, {
          isActive: item.deliveryStatus !== 'نشط'
        });
      } else {
        await patchAPI(`/supplier/shipping/free-delivery-offers/${item.id}`, {
          isActive: item.status !== 'نشط'
        });
      }
    } catch (error) {
      throw new Error('فشل في تغيير الحالة');
    }
  };

  const handleTableAction = async (action, item) => {
    if (action === 'delete' || action === 'deleteOffer') {
      await handleDelete(item);
    } else if (action === 'toggleStatus' || action === 'toggleOfferStatus') {
      await handleToggleStatus(item);
    }
  };

  useEffect(() => {
    fetchShippingData();
  }, []);

  const shippingColumns = ['حالة التوصيل', 'نوع الشحن', 'قيمة الرسوم', 'المنطقة', 'التوصيل المحلي متاح؟'];
  const deliveryColumns = ['حالة التوصيل', 'الشرط', 'المدة', 'العرض'];

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchShippingData()}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen text-gray-900 p-8 font-['Tajawal']">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">إعدادات التوصيل</h1>
        <p className="text-gray-600">إدارة مناطق التوصيل وعروض التوصيل المجاني</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card
          title={shippingSettings?.cards?.avgDeliveryTime?.title || 'متوسط وقت التوصيل'}
          value={shippingSettings?.cards?.avgDeliveryTime?.value || '0 يوم'}
          change={shippingSettings?.cards?.avgDeliveryTime?.change || '+0%'}
          trend={shippingSettings?.cards?.avgDeliveryTime?.trend || 'up'}
          details={shippingSettings?.cards?.avgDeliveryTime?.details || 'لا توجد بيانات'}
          icon={<IoTime className="w-6 h-6" />}
        />
        <Card
          title={shippingSettings?.cards?.activeOffers?.title || 'العروض النشطة'}
          value={`${shippingSettings?.cards?.activeOffers?.value || 0} عروض`}
          change={shippingSettings?.cards?.activeOffers?.change || '+0%'}
          trend={shippingSettings?.cards?.activeOffers?.trend || 'up'}
          details={shippingSettings?.cards?.activeOffers?.details || 'لا توجد بيانات'}
          icon={<IoCash className="w-6 h-6" />}
        />
        <Card
          title={shippingSettings?.cards?.disabledAreas?.title || 'المناطق المعطلة'}
          value={`${shippingSettings?.cards?.disabledAreas?.value || 0} مناطق`}
          change={shippingSettings?.cards?.disabledAreas?.change || '-0%'}
          trend={shippingSettings?.cards?.disabledAreas?.trend || 'down'}
          details={shippingSettings?.cards?.disabledAreas?.details || 'لا توجد بيانات'}
          icon={<IoLocation className="w-6 h-6" />}
        />
        <Card
          title={shippingSettings?.cards?.activeAreas?.title || 'المناطق النشطة'}
          value={`${shippingSettings?.cards?.activeAreas?.value || 0} منطقة`}
          change={shippingSettings?.cards?.activeAreas?.change || '+0%'}
          trend={shippingSettings?.cards?.activeAreas?.trend || 'up'}
          details={shippingSettings?.cards?.activeAreas?.details || 'لا توجد بيانات'}
          icon={<IoCheckmark className="w-6 h-6" />}
        />
      </div>

      {/* Shipping Areas Table */}
      <Table
        title="إعدادات الشحن"
        columns={shippingColumns}
        tableData={shippingAreas}
        isShippingTable={true}
        onPageChange={(page) => fetchShippingData(page)}
        pagination={shippingPagination}
        refreshData={() => fetchShippingData(shippingPagination?.currentPage || 1)}
        onAction={handleTableAction}
      />

      {/* Delivery Offers Table */}
      <Table
        title="عروض التوصيل المحلي المجاني"
        columns={deliveryColumns}
        tableData={deliveryOffers}
        isShippingTable={false}
        onPageChange={(page) => fetchShippingData(page)}
        pagination={deliveryPagination}
        refreshData={() => fetchShippingData(deliveryPagination?.currentPage || 1)}
        onAction={handleTableAction}
      />
    </div>
  );
}

export default App;