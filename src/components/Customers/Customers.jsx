import React, { useState } from 'react';
import { IoChevronUp, IoChevronDown, IoSearchOutline, IoAdd, IoEllipsisHorizontal, IoEye, IoPencil, IoBarChart, IoPause, IoClose, IoTrash } from 'react-icons/io5';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const data = [
  { status: 'نشط', type: 'ثابت', value: '25 د.ك', region: 'الرياض', available: 'لا' },
  { status: 'نشط', type: '25 د.ك', value: '25 د.ك', region: 'الرياض', available: 'لا' },
  { status: 'نشط', type: 'ثابت', value: '25 د.ك', region: 'الرياض', available: 'لا' },
  { status: 'نشط', type: 'ثابت', value: '25 د.ك', region: 'الرياض', available: 'لا' },
  { status: 'نشط', type: 'ثابت', value: '25 د.ك', region: 'الرياض', available: 'لا' },
];

const deliveryOffers = [
  { status: 'نشط', type: 'شروط', value: 'الطلبات أكثر من 300 د.ك', duration: '1-10 اغسطس', offer: 'توصيل محلي الي الرياض' },
  { status: 'نشط', type: 'شروط', value: 'الطلبات أكثر من 300 د.ك', duration: '1-10 اغسطس', offer: 'توصيل محلي الي الرياض' },
  { status: 'نشط', type: 'شروط', value: 'الطلبات أكثر من 300 د.ك', duration: '1-10 اغسطس', offer: 'توصيل محلي الي الرياض' },
  { status: 'نشط', type: 'شروط', value: 'الطلبات أكثر من 300 د.ك', duration: '1-10 اغسطس', offer: 'توصيل محلي الي الرياض' },
  { status: 'نشط', type: 'شروط', value: 'الطلبات أكثر من 300 د.ك', duration: '1-10 اغسطس', offer: 'توصيل محلي الي الرياض' },
];

function Card({ title, value, change, icon }) {
  return (
    <div className="flex-1 p-4 bg-white rounded-lg shadow-md flex justify-between items-center text-right">
      <div className="flex flex-col items-end">
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-xl font-bold mt-1 text-gray-900">{value}</p>
        <div className="text-xs mt-2" style={{ color: change.startsWith('+') ? '#22C55E' : '#EF4444' }}>{change}</div>
      </div>
      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">{icon}</div>
    </div>
  );
}

function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('الكل');

  const options = ['الكل', 'نشط', 'منتهي', 'مجدول'];

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
                onClick={() => {
                  setSelected(option);
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

function Pagination() {
  return (
    <div className="flex items-center space-x-2 text-gray-500 text-sm">
      <span className="text-gray-700">...</span>
      <button className="px-3 py-1 bg-red-500 text-white rounded-md">5</button>
      <button className="px-3 py-1 text-gray-700 rounded-md">4</button>
      <button className="px-3 py-1 text-gray-700 rounded-md">3</button>
      <button className="px-3 py-1 text-gray-700 rounded-md">2</button>
      <button className="px-3 py-1 text-gray-700 rounded-md">1</button>
      <span><IoChevronUp className="rotate-90" /></span>
      <span><IoChevronDown className="-rotate-90" /></span>
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

function ViewDetailsModal({ isOpen, onClose }) {
  const details = {
    region: 'الرياض',
    feeType: 'ثابت',
    feeValue: '2.5 د.ك',
    deliveryStatus: 'نشط',
    freeDelivery: 'غير مفعل',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">تفاصيل المنطقة</h2>
      <div className="space-y-4">
        {Object.entries(details).map(([key, value]) => (
          <div key={key} className="flex items-center">
            <input
              type="text"
              value={value}
              readOnly
              className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300"
            />
            <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">
              {key === 'region' && 'المنطقة'}
              {key === 'feeType' && 'نوع الرسوم'}
              {key === 'feeValue' && 'قيمة الرسوم'}
              {key === 'deliveryStatus' && 'حالة التوصيل'}
              {key === 'freeDelivery' && 'حالة التوصيل المجاني'}
            </label>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <button onClick={onClose} className="w-full py-3 bg-red-500 text-white rounded-md font-semibold">
          تعديل
        </button>
      </div>
    </Modal>
  );
}

function EditSettingsModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">تعديل الإعدادات</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="text"
            value="الرياض"
            readOnly
            className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300"
          />
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">اسم المنطقة</label>
        </div>
        <div className="flex items-center">
          <select className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300">
            <option>ثابت</option>
          </select>
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">نوع الرسوم</label>
        </div>
        <div className="flex items-center">
          <select className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300">
            <option>مفعل</option>
          </select>
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">الحالة</label>
        </div>
      </div>
      <div className="flex justify-between mt-8 space-x-4">
        <button onClick={onClose} className="flex-1 py-3 text-red-500 border border-red-500 rounded-md font-semibold">
          إلغاء
        </button>
        <button className="flex-1 py-3 bg-red-500 text-white rounded-md font-semibold">
          تعديل
        </button>
      </div>
    </Modal>
  );
}

function AddNewRegionModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">إضافة منطقة توصيل جديدة</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <select className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300">
            <option>اختر المنطقة</option>
          </select>
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">اسم المنطقة</label>
        </div>
        <div className="flex items-center">
          <select className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300">
            <option>ثابت</option>
          </select>
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">نوع الرسوم</label>
        </div>
        <div className="flex items-center">
          <input type="text" placeholder="ادخل قيمة التوصيل" className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300" />
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">قيمة التوصيل</label>
        </div>
        <div className="flex items-center">
          <textarea placeholder="اكتب شروط التوصيل المجاني..." className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300 h-24"></textarea>
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">شروط التوصيل المجاني</label>
        </div>
        <div className="flex items-center">
          <select className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300">
            <option>اختر الحالة</option>
          </select>
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">الحالة</label>
        </div>
      </div>
      <div className="flex justify-between mt-8 space-x-4">
        <button onClick={onClose} className="flex-1 py-3 text-red-500 border border-red-500 rounded-md font-semibold">
          إلغاء
        </button>
        <button className="flex-1 py-3 bg-red-500 text-white rounded-md font-semibold">
          إضافة
        </button>
      </div>
    </Modal>
  );
}

function PauseDeliveryModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">إيقاف التوصيل مؤقتًا</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <select className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300">
            <option>مفعل</option>
          </select>
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">برجاء اختيار حاله التوصيل</label>
        </div>
      </div>
      <div className="flex justify-between mt-8 space-x-4">
        <button onClick={onClose} className="flex-1 py-3 text-red-500 border border-red-500 rounded-md font-semibold">
          إلغاء
        </button>
        <button className="flex-1 py-3 bg-red-500 text-white rounded-md font-semibold">
          تعديل
        </button>
      </div>
    </Modal>
  );
}

function StatsModal({ isOpen, onClose }) {
  const chartData = {
    labels: ['الأسبوع الرابع', 'الأسبوع الثالث', 'الأسبوع الثاني', 'الأسبوع الأول'],
    datasets: [{
      label: 'عدد الطلبات',
      data: [15000, 10000, 20000, 8000],
      backgroundColor: ['#000', '#22C55E', '#D9C706', '#EF4444'],
      barPercentage: 0.6,
      categoryPercentage: 0.8,
      borderSkipped: false,
      borderRadius: 4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        rtl: true,
        backgroundColor: '#fff',
        titleColor: '#000',
        bodyColor: '#000',
        borderColor: '#ccc',
        borderWidth: 1,
        boxPadding: 4,
        padding: 10,
        callbacks: {
          title: () => 'عدد الطلبات 7432',
          label: () => 'متوسط زمن التوصيل 1.5 يوم'
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#000' }
      },
      y: {
        grid: { color: '#eee' },
        ticks: { color: '#000', stepSize: 5000 }
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">عرض الإحصائيات لمنطقة التوصيل</h2>
      <p className="text-center text-sm mb-6 text-gray-600">تتبع حاله عرض الإحصائيات هذا الشهر</p>
      <div style={{ height: '300px' }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </Modal>
  );
}

function ViewDetailsOfferModal({ isOpen, onClose }) {
  const details = {
    name: 'توصيل مجاني للرياض',
    region: 'الرياض',
    condition: 'الطلبات أكثر من 300 د.ك',
    duration: '1-10 اغسطس',
    status: 'مفعل',
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">تفاصيل العرض</h2>
      <div className="space-y-4">
        {Object.entries(details).map(([key, value]) => (
          <div key={key} className="flex items-center">
            <input
              type="text"
              value={value}
              readOnly
              className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300"
            />
            <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">
              {key === 'name' && 'اسم العرض'}
              {key === 'region' && 'المنطقة'}
              {key === 'condition' && 'الشرط'}
              {key === 'duration' && 'المدة'}
              {key === 'status' && 'الحالة'}
            </label>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <button onClick={onClose} className="w-full py-3 bg-red-500 text-white rounded-md font-semibold">
          تعديل
        </button>
      </div>
    </Modal>
  );
}

function EditOfferModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">تعديل العرض</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="text"
            value="الرياض"
            readOnly
            className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300"
          />
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">اسم المنطقة</label>
        </div>
        <div className="flex items-center">
          <input type="text" value="30 د.ك" className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300" />
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">قيمة العرض</label>
        </div>
        <div className="flex items-center">
          <div className="flex-1 flex justify-between">
            <input type="text" value="الى" className="text-center py-3 px-4 w-1/2 bg-gray-100 text-gray-800 rounded-md border border-gray-300 ml-2" />
            <input type="text" value="من" className="text-center py-3 px-4 w-1/2 bg-gray-100 text-gray-800 rounded-md border border-gray-300" />
          </div>
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">التاريخ</label>
        </div>
      </div>
      <div className="flex justify-between mt-8 space-x-4">
        <button onClick={onClose} className="flex-1 py-3 text-red-500 border border-red-500 rounded-md font-semibold">
          إلغاء
        </button>
        <button className="flex-1 py-3 bg-red-500 text-white rounded-md font-semibold">
          تعديل
        </button>
      </div>
    </Modal>
  );
}

function AddNewOfferModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">إضافة عرض جديد</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <select className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300">
            <option>اختر المنطقة</option>
          </select>
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">المنطقة</label>
        </div>
        <div className="flex items-center">
          <input type="text" placeholder="ادخل الرقم" className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300" />
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">الحد الأدنى للطلب</label>
        </div>
        <div className="flex items-center">
          <div className="flex-1 flex justify-between">
            <input type="text" placeholder="الى" className="text-center py-3 px-4 w-1/2 bg-gray-100 text-gray-800 rounded-md border border-gray-300 ml-2" />
            <input type="text" placeholder="من" className="text-center py-3 px-4 w-1/2 bg-gray-100 text-gray-800 rounded-md border border-gray-300" />
          </div>
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">التاريخ</label>
        </div>
        <div className="flex items-center">
          <select className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300">
            <option>اختر الحالة</option>
          </select>
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">الحالة</label>
        </div>
        <div className="flex items-center">
          <textarea placeholder="اكتب شروط التوصيل المجاني ان وجدت ..." className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300 h-24"></textarea>
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">شروط التوصيل المجاني</label>
        </div>
      </div>
      <div className="flex justify-between mt-8 space-x-4">
        <button onClick={onClose} className="flex-1 py-3 text-red-500 border border-red-500 rounded-md font-semibold">
          إلغاء
        </button>
        <button className="flex-1 py-3 bg-red-500 text-white rounded-md font-semibold">
          اضافة
        </button>
      </div>
    </Modal>
  );
}

function DeleteOfferModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <div className="bg-red-100 rounded-full p-4 mb-4">
          <IoClose className="text-red-500 w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-800">حذف العرض</h2>
        <p className="text-gray-600 mb-6">
          هل أنت متأكد أنك تريد حذف العرض؟
          <br />
          سوف يتم حذف العرض نهائيا من قائمة العروض لديك
          <br />
          هل انت متأكد انك حذف العرض؟
        </p>
      </div>
      <div className="flex justify-between mt-8 space-x-4">
        <button onClick={onClose} className="flex-1 py-3 text-red-500 border border-red-500 rounded-md font-semibold">
          إلغاء
        </button>
        <button className="flex-1 py-3 bg-red-500 text-white rounded-md font-semibold">
          حذف العرض
        </button>
      </div>
    </Modal>
  );
}

function DuplicateOfferModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <div className="bg-red-100 rounded-full p-4 mb-4">
          <IoChevronDown className="text-red-500 w-10 h-10 rotate-180" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-800">تكرار العرض</h2>
        <p className="text-gray-600 mb-6">
          هل انت متاكد انك تريد تكرار العرض؟
          <br />
          سوف يتم تكرار العرض الان؟
        </p>
      </div>
      <div className="flex justify-between mt-8 space-x-4">
        <button onClick={onClose} className="flex-1 py-3 text-red-500 border border-red-500 rounded-md font-semibold">
          إلغاء
        </button>
        <button className="flex-1 py-3 bg-red-500 text-white rounded-md font-semibold">
          تكرار العرض
        </button>
      </div>
    </Modal>
  );
}

function AddNoteModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">اضافة ملاحظه</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <input type="text" value="1/8/2025" className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300" />
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">اختر التاريخ</label>
        </div>
        <div className="flex items-center">
          <textarea placeholder="ادخل ملاحظاتك..." className="flex-1 text-right py-3 px-4 bg-gray-100 text-gray-800 rounded-md border border-gray-300 h-24"></textarea>
          <label className="text-gray-500 text-sm mr-4 min-w-[100px] text-right">ادخل نص الملاحظه</label>
        </div>
      </div>
      <div className="flex justify-between mt-8 space-x-4">
        <button onClick={onClose} className="flex-1 py-3 text-red-500 border border-red-500 rounded-md font-semibold">
          إلغاء
        </button>
        <button className="flex-1 py-3 bg-red-500 text-white rounded-md font-semibold">
          حفظ
        </button>
      </div>
    </Modal>
  );
}

function Table({ title, columns, tableData, isShippingTable }) {
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
          <DropdownMenu />
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
                    <td className="py-4 px-4">{row.available}</td>
                    <td className="py-4 px-4">{row.region}</td>
                    <td className="py-4 px-4">{row.value}</td>
                    <td className="py-4 px-4">{row.type}</td>
                    <td className="py-4 px-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                        {row.status}
                      </span>
                    </td>
                  </>
                )}
                {!isShippingTable && (
                  <>
                    <td className="py-4 px-4">{row.offer}</td>
                    <td className="py-4 px-4">{row.duration}</td>
                    <td className="py-4 px-4">{row.value}</td>
                    <td className="py-4 px-4">{row.type}</td>
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

      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <p>اجمالي المناطق: 8764</p>
        <Pagination />
        <div className="flex items-center space-x-2">
          <span>عرض في الصفحة</span>
          <select className="bg-gray-100 text-gray-900 rounded-md px-2 py-1 border border-gray-300">
            <option>10</option>
          </select>
        </div>
      </div>

      {isShippingTable ? (
        <>
          <ViewDetailsModal isOpen={modalStates.viewDetails} onClose={() => closeModal('viewDetails')} />
          <EditSettingsModal isOpen={modalStates.editSettings} onClose={() => closeModal('editSettings')} />
          <StatsModal isOpen={modalStates.showStats} onClose={() => closeModal('showStats')} />
          <PauseDeliveryModal isOpen={modalStates.pauseDelivery} onClose={() => closeModal('pauseDelivery')} />
          <AddNewRegionModal isOpen={modalStates.addNew} onClose={() => closeModal('addNew')} />
        </>
      ) : (
        <>
          <ViewDetailsOfferModal isOpen={modalStates.viewDetailsOffer} onClose={() => closeModal('viewDetailsOffer')} />
          <EditOfferModal isOpen={modalStates.editOffer} onClose={() => closeModal('editOffer')} />
          <AddNewOfferModal isOpen={modalStates.addNew} onClose={() => closeModal('addNew')} />
          <DeleteOfferModal isOpen={modalStates.deleteOffer} onClose={() => closeModal('deleteOffer')} />
          <DuplicateOfferModal isOpen={modalStates.duplicateOffer} onClose={() => closeModal('duplicateOffer')} />
          <AddNoteModal isOpen={modalStates.addNote} onClose={() => closeModal('addNote')} />
        </>
      )}

    </div>
  );
}

function App() {
  const shippingColumns = ['حالة التوصيل', 'نوع الشحن', 'قيمة الرسوم', 'المنطقة', 'التوصيل المحلي متاح؟'];
  const deliveryColumns = ['حالة التوصيل', 'الشرط', 'المدة', 'العرض'];

  return (
    <div className="bg-gray-100 min-h-screen text-gray-900 p-8 font-['Tajawal']">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card title="متوسط زمن التوصيل" value="1.5يوم" change="-2% عن الفترة السابقة" />
        <Card title="العروض الفعالة" value="5 عروض" change="+8% عن الفترة السابقة" />
        <Card title="المناطق المعطلة" value="5 مناطق" change="-2% عن الفترة السابقة" />
        <Card title="المناطق النشطة" value="28 منطقة" change="+8% عن الفترة السابقة" />
      </div>
      
      <Table
        title="إعدادات الشحن"
        columns={shippingColumns}
        tableData={data}
        isShippingTable={true}
      />
      
      <Table
        title="عروض التوصيل المحلي المجاني"
        columns={deliveryColumns}
        tableData={deliveryOffers}
        isShippingTable={false}
      />
    </div>
  );
}

export default App;