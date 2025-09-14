import React, { useState } from 'react';
import { BsThreeDots, BsPerson } from 'react-icons/bs';
import { RiCloseFill } from 'react-icons/ri';
import { MdOutlineDateRange } from 'react-icons/md';
import { PiNotePencil } from 'react-icons/pi';
import { FaMagnifyingGlass, FaPrint, FaRegBell, FaRegClock, FaRegStar, FaRegCalendarDays } from 'react-icons/fa6';
import { LuPhone } from 'react-icons/lu';
import { FiShoppingBag } from 'react-icons/fi';
import { CiUser } from 'react-icons/ci';
import { IoLocationOutline } from 'react-icons/io5';
import { TbPackage } from 'react-icons/tb';
import { BiBlock } from 'react-icons/bi';
import { MdInfoOutline } from 'react-icons/md';
import { FaArrowRight } from 'react-icons/fa';

const dummyUser = {
  name: 'أحمد عبد الله',
  mobile: '+964770000000',
  email: 'ahmad@nike.com',
  city: 'بغداد',
  registrationDate: '2024-11-10',
  status: 'نشط',
  profilePicture: 'http://googleusercontent.com/file_content/0',
};

const userOrders = [
  {
    orderId: 'A-10255',
    products: 'هاتف A1S 128GB، سماعات بلوتوث',
    total: '154.90د.ع',
    status: 'بانتظار الشحن',
    paymentStatus: 'مدفوع',
    shippingCompany: 'ارامكس',
  },
  {
    orderId: 'A-10254',
    products: 'هاتف A1S 128GB، سماعات بلوتوث',
    total: '154.90د.ع',
    status: 'بانتظار الشحن',
    paymentStatus: 'مدفوع',
    shippingCompany: 'ارامكس',
  },
  {
    orderId: 'A-10253',
    products: 'هاتف A1S 128GB، سماعات بلوتوث',
    total: '154.90د.ع',
    status: 'بانتظار الشحن',
    paymentStatus: 'مدفوع',
    shippingCompany: 'aramex',
  },
  {
    orderId: 'A-10252',
    products: 'هاتف A1S 128GB، سماعات بلوتوث',
    total: '154.90د.ع',
    status: 'بانتظار الشحن',
    paymentStatus: 'مدفوع',
    shippingCompany: 'aramex',
  },
  {
    orderId: 'A-10251',
    products: 'هاتف A1S 128GB، سماعات بلوتوث',
    total: '154.90د.ع',
    status: 'بانتظار الشحن',
    paymentStatus: 'مدفوع',
    shippingCompany: 'aramex',
  },
];

const userReviews = [
  {
    date: '2025-07-30',
    comment: 'الخدمة ممتازة ولكن التغليف متوسط',
    rating: 4,
    product: 'هاتف A1S، سماعات بلوتوث 1x',
  },
  {
    date: '2025-07-30',
    comment: 'الخدمة ممتازة ولكن التغليف متوسط',
    rating: 4,
    product: 'هاتف A1S، سماعات بلوتوث 1x',
  },
  {
    date: '2025-07-30',
    comment: 'الخدمة ممتازة ولكن التغليف متوسط',
    rating: 4,
    product: 'هاتف A1S، سماعات بلوتوث 1x',
  },
  {
    date: '2025-07-30',
    comment: 'الخدمة ممتازة ولكن التغليف متوسط',
    rating: 4,
    product: 'هاتف A1S، سماعات بلوتوث 1x',
  },
  {
    date: '2025-07-30',
    comment: 'الخدمة ممتازة ولكن التغليف متوسط',
    rating: 4,
    product: 'هاتف A1S، سماعات بلوتوث 1x',
  },
];

const StatusBadge = ({ status }) => {
  const colorMap = {
    'نشط': 'bg-green-100 text-green-700',
    'بانتظار الشحن': 'bg-yellow-100 text-yellow-700',
    'مدفوع': 'bg-green-100 text-green-700',
  };
  return (
    <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${colorMap[status]}`}>
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

const AddNoteModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-xs">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">اضافة ملاحظه</h2>
        <button onClick={onClose}>
          <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
        </button>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5 text-gray-700">اختار التاريخ</label>
          <div className="relative">
            <input
              type="text"
              value="1 / 8 / 2025"
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 focus:outline-none"
            />
            <MdOutlineDateRange className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5 text-gray-700">ادخل نص الملاحظة</label>
          <textarea
            placeholder="ادخل ملاحظاتك..."
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 focus:outline-none resize-none"
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

const SendNotificationModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-xs">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">إرسال إشعار</h2>
        <button onClick={onClose}>
          <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
        </button>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <input type="checkbox" className="w-4 h-4 text-red-500 rounded focus:ring-red-500 border-red-500" defaultChecked />
          <label className="text-gray-700 text-sm">البريد الالكتروني</label>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" className="w-4 h-4 text-red-500 rounded focus:ring-red-500 border-red-500" defaultChecked />
          <label className="text-gray-700 text-sm">رسالة نصية SMS</label>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" className="w-4 h-4 text-red-500 rounded focus:ring-red-500 border-red-500" defaultChecked />
          <label className="text-gray-700 text-sm">اشعار داخل التطبيق</label>
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

const BlockUserModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-xs text-center">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">حظر الزبون</h2>
        <button onClick={onClose}>
          <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
        </button>
      </div>
      <div className="p-4 space-y-3">
        <div className="text-red-500 text-4xl flex justify-center mx-auto w-14 h-14 rounded-full bg-red-100 items-center mb-3">
          <RiCloseFill className="text-red-500 text-3xl"/>
        </div>
        <h2 className="text-lg font-bold text-gray-800">هل انت متأكد أنك تريد حظر الزبون؟</h2>
        <p className="text-gray-500 text-xs">سوف يتم حظر الزبون نهائيا من قائمة الزبائن لديك</p>
        <p className="text-gray-700 font-semibold text-sm">هل انت متأكد انك تريد الحظر؟</p>
      </div>
      <div className="p-4 border-t flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-1.5 text-gray-700 text-sm font-medium">
          الغاء
        </button>
        <button className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium">
          حظر الزبون
        </button>
      </div>
    </div>
  </div>
);

const PrintReceiptModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-xs text-center">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">طباعة الايصال</h2>
        <button onClick={onClose}>
          <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
        </button>
      </div>
      <div className="p-4 space-y-3">
        <div className="text-red-500 text-4xl flex justify-center mx-auto w-14 h-14 rounded-full bg-red-100 items-center mb-3">
          <MdInfoOutline className="text-red-500 text-3xl"/>
        </div>
        <h2 className="text-lg font-bold text-gray-800">هل انت متأكد انك تريد طباعه الايصال؟</h2>
        <p className="text-gray-500 text-xs">سوف يتم طباعة الايصال الان</p>
      </div>
      <div className="p-4 border-t flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-1.5 text-gray-700 text-sm font-medium">
          الغاء
        </button>
        <button className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium">
          طباعه
        </button>
      </div>
    </div>
  </div>
);

const OrderDetailsModal = ({ orderDetails, onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 z-50">
    <div dir="rtl" className="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-y-auto max-h-[85vh]">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">تفاصيل الطلب #{orderDetails.orderNumber}</h2>
        <button onClick={onClose}>
          <RiCloseFill className="text-gray-500 hover:text-gray-800 text-xl" />
        </button>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
              <FiShoppingBag className="text-gray-500" />
            </div>
            <div>
              <span className="text-xs text-gray-500">التاجر</span>
              <p className="font-semibold text-gray-800 text-sm">{orderDetails.vendor.name}</p>
              <p className="text-xs text-gray-500">{orderDetails.vendor.phone}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
              <CiUser className="text-gray-500" />
            </div>
            <div>
              <span className="text-xs text-gray-500">العميل</span>
              <p className="font-semibold text-gray-800 text-sm">{orderDetails.customer.name}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <IoLocationOutline className="text-gray-500" />
                {orderDetails.customer.location}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-base font-semibold mb-3">المنتجات</h3>
        <ul className="space-y-3">
          {orderDetails.products.map((product, idx) => (
            <li key={idx} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-2xl">
                <LuPhone className="text-gray-500" />
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">{product.name}</p>
                <p className="text-xs text-gray-500">x{product.quantity}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-base font-semibold mb-3">شركة الشحن</h3>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-2xl">
            <TbPackage className="text-gray-500" />
          </div>
          <p className="font-medium text-gray-800 text-sm">{orderDetails.shippingCompany}</p>
        </div>
      </div>
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-base font-semibold mb-3">خط سير الطلب</h3>
        <div className="space-y-5">
          {orderDetails.timeline.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-3.5 h-3.5 rounded-full ${item.active ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                {idx < orderDetails.timeline.length - 1 && (
                  <div className={`w-0.5 flex-grow ${item.active ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                )}
              </div>
              <div>
                <h4 className={`font-semibold text-sm ${item.active ? 'text-gray-800' : 'text-gray-500'}`}>{item.step}</h4>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-base font-semibold mb-3">ملاحظات</h3>
        <div className="bg-gray-100 rounded p-3 text-gray-700 text-sm">
          {orderDetails.notes}
        </div>
      </div>
      <div className="p-4 border-t border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-xs text-gray-500">الدفع</span>
            <p className="font-medium text-gray-800 text-sm">{orderDetails.paymentStatus}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">الحالة</span>
            <p className="font-medium text-gray-800 text-sm">{orderDetails.shippingStatus}</p>
          </div>
        </div>
        <button className="bg-red-500 text-white px-5 py-1.5 rounded-lg text-sm font-medium">
          حفظ التغييرات
        </button>
      </div>
    </div>
  </div>
);

const UserDetailsPage = ({ user, onClose }) => {
  const [showAddNote, setShowAddNote] = useState(false);
  const [showSendNotification, setShowSendNotification] = useState(false);
  const [showBlockUser, setShowBlockUser] = useState(false);
  const [showPrintReceipt, setShowPrintReceipt] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(null);

  const MoreOrderOptions = ({ onClose }) => {
    return (
      <div className="bg-white rounded-lg shadow-lg py-1.5 w-40 text-right absolute mt-1.5 left-0 border border-gray-200 z-10">
        <button onClick={() => { setShowPrintReceipt(true); onClose(); }} className="flex items-center gap-1.5 w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">
          <FaPrint className="text-base text-gray-400" />
          طباعة الايصال
        </button>
        <div className="border-t border-gray-200 my-1.5"></div>
        <button onClick={() => { setShowAddNote(true); onClose(); }} className="flex items-center gap-1.5 w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">
          <PiNotePencil className="text-base text-gray-400" />
          اضافة ملاحظة
        </button>
        <button onClick={() => { setShowSendNotification(true); onClose(); }} className="flex items-center gap-1.5 w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">
          <FaRegBell className="text-base text-gray-400" />
          ارسال اشعار
        </button>
        <div className="border-t border-gray-200 my-1.5"></div>
        <button onClick={() => { setShowBlockUser(true); onClose(); }} className="flex items-center gap-1.5 w-full px-3 py-1.5 text-xs text-red-500 hover:bg-red-50">
          <BiBlock className="text-base" />
          حظر الزبون
        </button>
      </div>
    );
  };

  const dummyOrderDetails = {
    orderNumber: 'A-10254',
    customer: {
      name: 'أحمد علي',
      location: 'بغداد',
    },
    vendor: {
      name: 'سما للهواتف',
      phone: '+96550000',
    },
    products: [
      { name: 'هاتف A1S 128GB، سماعات بلوتوث', quantity: 1 },
    ],
    shippingCompany: 'ارامكس',
    status: 'جاهز للشحن',
    timeline: [
      { step: 'تم الاستلام', active: true, desc: 'الطلب تم تسجيله بنجاح وهو في قائمة الطلبات.' },
      { step: 'قيد المعالجة', active: true, desc: 'الطلب تحت المراجعة من قبل التاجر وفريق الدعم.' },
      { step: 'جاهز للشحن', active: true, desc: 'الطلب تم تجهيزه وتأكيد الفاتورة، في انتظار شركة الشحن.' },
      { step: 'قيد التوصيل', active: false, desc: 'الطلب تم تسليمه لشركة الشحن مع إمكانية عرض رقم التتبع.' },
      { step: 'تم التوصيل', active: false, desc: 'الطلب وصل إلى العميل بنجاح (مع وقت وتاريخ التسليم).' },
    ],
    notes: 'التغليف هدية',
    paymentStatus: 'مدفوع',
    shippingStatus: 'بانتظار الشحن',
  };

  return (
    <div dir="rtl" className="bg-gray-100 min-h-screen p-7 font-sans w-full">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onClose} className="p-2.5 rounded-full bg-white text-gray-600 hover:bg-gray-200 transition-colors">
          <FaArrowRight className="text-xl" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">تفاصيل العميل</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-5">
        <div className="md:w-2/5 flex-shrink-0 order-2 md:order-1">
          <div className="bg-white rounded-lg shadow-sm p-5 text-center">
            <div className="flex flex-col items-center gap-3.5 mb-5">
              <div className="w-20 h-20 rounded-full overflow-hidden border-1.5 border-gray-200 flex-shrink-0">
                <img src={dummyUser.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{dummyUser.name}</h2>
            </div>
            <div className="text-right border-b border-gray-200 pb-3.5 mb-3.5">
              <p className="text-gray-500 text-xs">الجوال</p>
              <p className="font-semibold text-gray-800 text-sm">{dummyUser.mobile}</p>
            </div>
            <div className="text-right border-b border-gray-200 pb-3.5 mb-3.5">
              <p className="text-gray-500 text-xs">البريد الإلكتروني</p>
              <p className="font-semibold text-gray-800 text-sm">{dummyUser.email}</p>
            </div>
            <div className="text-right border-b border-gray-200 pb-3.5 mb-3.5">
              <p className="text-gray-500 text-xs">المدينة</p>
              <p className="font-semibold text-gray-800 text-sm">{dummyUser.city}</p>
            </div>
            <div className="text-right border-b border-gray-200 pb-3.5 mb-3.5">
              <p className="text-gray-500 text-xs">تاريخ التسجيل</p>
              <p className="font-semibold text-gray-800 text-sm">{dummyUser.registrationDate}</p>
            </div>
            <div className="text-right border-b border-gray-200 pb-3.5 mb-3.5">
              <p className="text-gray-500 text-xs">الحالة</p>
              <StatusBadge status={dummyUser.status} />
            </div>
            <div className="flex flex-col gap-3.5 mt-5">
              <button onClick={() => setShowAddNote(true)} className="bg-white text-red-500 px-3.5 py-2 rounded-lg text-sm font-medium border border-gray-300 flex items-center justify-center gap-1.5">
                <PiNotePencil className="text-base" />
                إضافة ملاحظة
              </button>
              <button onClick={() => setShowBlockUser(true)} className="bg-white text-red-500 px-3.5 py-2 rounded-lg text-sm font-medium border border-gray-300 flex items-center justify-center gap-1.5">
                <BiBlock className="text-base" />
                حظر
              </button>
              <button onClick={() => setShowSendNotification(true)} className="bg-white text-red-500 px-3.5 py-2 rounded-lg text-sm font-medium border border-gray-300 flex items-center justify-center gap-1.5">
                <FaRegBell className="text-base" />
                إرسال إشعار
              </button>
            </div>
          </div>
        </div>
        <div className="md:w-3/5 flex flex-col gap-5 order-1 md:order-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-lg p-4 flex items-center justify-between text-right shadow-sm">
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5 rtl:space-x-reverse mb-1">
                  <span className="text-gray-400 text-xs">متوسط التقييمات</span>
                  <BsThreeDots className="text-gray-400 text-base" />
                </div>
                <p className="text-xl font-semibold mb-1">4.3 من 5</p>
              </div>
              <div className="bg-gray-100 p-2.5 rounded-full text-xl text-red-500">
                <FaRegStar />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 flex items-center justify-between text-right shadow-sm">
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5 rtl:space-x-reverse mb-1">
                  <span className="text-gray-400 text-xs">آخر طلب</span>
                  <BsThreeDots className="text-gray-400 text-base" />
                </div>
                <p className="text-xl font-semibold mb-1">320د.ع</p>
              </div>
              <div className="bg-gray-100 p-2.5 rounded-full text-xl text-red-500">
                <FaRegClock />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 flex items-center justify-between text-right shadow-sm">
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5 rtl:space-x-reverse mb-1">
                  <span className="text-gray-400 text-xs">عدد الطلبات</span>
                  <BsThreeDots className="text-gray-400 text-base" />
                </div>
                <p className="text-xl font-semibold mb-1">12 طلب</p>
              </div>
              <div className="bg-gray-100 p-2.5 rounded-full text-xl text-red-500">
                <FaRegCalendarDays />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 flex items-center justify-between text-right shadow-sm">
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5 rtl:space-x-reverse mb-1">
                  <span className="text-gray-400 text-xs">أحمد عبد الله</span>
                  <BsThreeDots className="text-gray-400 text-base" />
                </div>
                <p className="text-xl font-semibold mb-1">+964770000000</p>
              </div>
              <div className="bg-gray-100 p-2.5 rounded-full text-xl text-red-500">
                <BsPerson />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-5 flex items-center justify-between border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">سجل الطلبات</h2>
              <BsThreeDots className="text-gray-400 text-xl" />
            </div>
            <div className="p-5 flex flex-col md:flex-row items-center justify-between gap-3.5">
              <div className="relative w-full md:w-auto flex-grow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="ابحث..."
                  className="w-full pl-9 pr-3.5 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
              <div className="flex items-center gap-1.5 w-full md:w-auto">
                <select className="px-3.5 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 appearance-none bg-white">
                  <option>الكل</option>
                  <option>نشط</option>
                  <option>غير نشط</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead className="bg-[#F5F6FA] text-gray-600">
                  <tr>
                    <Th className="rounded-tr-lg">رقم الطلب</Th>
                    <Th>المنتجات</Th>
                    <Th>الإجمالي</Th>
                    <Th>الحالة</Th>
                    <Th>الدفع</Th>
                    <Th>الشحن</Th>
                    <Th className="rounded-tl-lg">الإجراءات</Th>
                  </tr>
                </thead>
                <tbody>
                  {userOrders.map((order, idx) => (
                    <tr key={idx} className="border-b border-gray-200">
                      <Td>
                        <button onClick={() => setShowOrderDetails(true)} className="text-gray-700 font-semibold hover:underline">
                          {order.orderId}
                        </button>
                      </Td>
                      <Td className="flex items-center gap-1.5">
                        <LuPhone className="text-gray-500 text-base" /> {order.products}
                      </Td>
                      <Td>{order.total}</Td>
                      <Td>
                        <StatusBadge status={order.status} />
                      </Td>
                      <Td>
                        <StatusBadge status={order.paymentStatus} />
                      </Td>
                      <Td>{order.shippingCompany}</Td>
                      <Td>
                        <div className="relative inline-block">
                          <button onClick={() => setShowMoreOptions(showMoreOptions === idx ? null : idx)} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                            <BsThreeDots className="text-base" />
                          </button>
                          {showMoreOptions === idx && (
                            <div className="bg-white rounded-lg shadow-lg py-1.5 w-40 text-right absolute mt-1.5 left-0 border border-gray-200 z-10">
                              <button onClick={() => { setShowOrderDetails(true); setShowMoreOptions(null); }} className="flex items-center gap-1.5 w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">
                                <FaMagnifyingGlass className="text-base text-gray-400" />
                                عرض التفاصيل
                              </button>
                              <div className="border-t border-gray-200 my-1.5"></div>
                              <button onClick={() => { setShowAddNote(true); setShowMoreOptions(null); }} className="flex items-center gap-1.5 w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">
                                <PiNotePencil className="text-base text-gray-400" />
                                اضافه ملاحظه
                              </button>
                            </div>
                          )}
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-5 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">اعرض في الصفحة</span>
                <select className="px-2 py-1 border border-gray-300 rounded text-xs text-gray-700">
                  <option>5</option>
                  <option>10</option>
                  <option>20</option>
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400">اجمالي المنتجات: {userOrders.length}</span>
                <button className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full">
                  &lt;
                </button>
                <button className="w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full">
                  1
                </button>
                <button className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full">
                  2
                </button>
                <button className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full">
                  3
                </button>
                <button className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full">
                  4
                </button>
                <button className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full">
                  5
                </button>
                <button className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full">
                  &gt;
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-5 flex items-center justify-between border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">التقييمات المكتوبة</h2>
              <BsThreeDots className="text-gray-400 text-xl" />
            </div>
            <div className="p-5 flex flex-col md:flex-row items-center justify-between gap-3.5">
              <div className="relative w-full md:w-auto flex-grow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="ابحث..."
                  className="w-full pl-9 pr-3.5 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
              <div className="flex items-center gap-1.5 w-full md:w-auto">
                <select className="px-3.5 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 appearance-none bg-white">
                  <option>الكل</option>
                  <option>نشط</option>
                  <option>غير نشط</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs text-right">
                <thead className="bg-[#F5F6FA] text-gray-600">
                  <tr>
                    <Th className="rounded-tr-lg">التاريخ</Th>
                    <Th>التعليق</Th>
                    <Th>التقييم</Th>
                    <Th className="rounded-tl-lg">المنتجات</Th>
                  </tr>
                </thead>
                <tbody>
                  {userReviews.map((review, idx) => (
                    <tr key={idx} className="border-b border-gray-200">
                      <Td>{review.date}</Td>
                      <Td>{review.comment}</Td>
                      <Td>
                        <div className="flex items-center gap-1.5">
                          {Array.from({ length: 5 }, (_, i) => (
                            <FaRegStar key={i} className={`text-base ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`} />
                          ))}
                        </div>
                      </Td>
                      <Td className="flex items-center gap-1.5">
                        <LuPhone className="text-gray-500 text-base" />
                        {review.product}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-5 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">اعرض في الصفحة</span>
                <select className="px-2 py-1 border border-gray-300 rounded text-xs text-gray-700">
                  <option>5</option>
                  <option>10</option>
                  <option>20</option>
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400">اجمالي المنتجات: {userReviews.length}</span>
                <button className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full">
                  &lt;
                </button>
                <button className="w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full">
                  1
                </button>
                <button className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full">
                  2
                </button>
                <button className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full">
                  3
                </button>
                <button className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full">
                  4
                </button>
                <button className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full">
                  5
                </button>
                <button className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-full">
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showAddNote && <AddNoteModal onClose={() => setShowAddNote(false)} />}
      {showSendNotification && <SendNotificationModal onClose={() => setShowSendNotification(false)} />}
      {showBlockUser && <BlockUserModal onClose={() => setShowBlockUser(false)} />}
      {showPrintReceipt && <PrintReceiptModal onClose={() => setShowPrintReceipt(false)} />}
      {showOrderDetails && <OrderDetailsModal orderDetails={dummyOrderDetails} onClose={() => setShowOrderDetails(false)} />}
    </div>
  );
};

export default UserDetailsPage;