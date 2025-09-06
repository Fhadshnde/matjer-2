import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const offersData = [
    {
        name: 'خصم الصيف 15%',
        type: 'عام',
        value: '15%',
        scope: 'كل المنتجات',
        period: '1/8 - 10 أغسطس',
        status: 'نشط',
    },
    {
        name: 'خصم الشتاء 10%',
        type: 'عام',
        value: '10%',
        scope: 'كل المنتجات',
        period: '1/12 - 15 ديسمبر',
        status: 'نشط',
    },
    {
        name: 'عرض اليوم الوطني',
        type: 'منتج معين',
        value: '20%',
        scope: 'هواتف ذكية',
        period: '23/9 - 25 سبتمبر',
        status: 'منتهي',
    },
    {
        name: 'عرض رأس السنة',
        type: 'عام',
        value: '5%',
        scope: 'كل المنتجات',
        period: '30/12 - 5 يناير',
        status: 'مجدول',
    },
    {
        name: 'تصفية نهاية الموسم',
        type: 'فئة معينة',
        value: '70%',
        scope: 'ملابس شتوية',
        period: '1/2 - 20 فبراير',
        status: 'منتهي',
    },
    {
        name: 'خصم خاص للمشتركين',
        type: 'عام',
        value: '25%',
        scope: 'كل المنتجات',
        period: '1/10 - 31 أكتوبر',
        status: 'نشط',
    },
    {
        name: 'عرض الجمعة البيضاء',
        type: 'عام',
        value: '40%',
        scope: 'كل المنتجات',
        period: '20/11 - 27 نوفمبر',
        status: 'مجدول',
    },
];

const offerPerformanceData = [
    { name: 'الأسبوع الرابع', visits: 8322, conversions: 7432, orders: 6754 },
    { name: 'الأسبوع الثالث', visits: 7000, conversions: 6500, orders: 5800 },
    { name: 'الأسبوع الثاني', visits: 9500, conversions: 8000, orders: 7500 },
    { name: 'الأسبوع الأول', visits: 6000, conversions: 5500, orders: 5000 },
];

const CustomPerformanceTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-lg shadow-lg text-right text-sm border border-gray-200">
                <p className="font-bold mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={`item-${index}`} className="text-gray-600">
                        {entry.name}: <span className="font-semibold text-gray-800">{entry.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const OffersPage = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const openDetailsModal = (offer) => {
        setSelectedOffer(offer);
        setIsDetailsModalOpen(true);
        setActiveDropdown(null);
    };

    const openEditModal = (offer) => {
        setSelectedOffer(offer);
        setIsEditModalOpen(true);
        setActiveDropdown(null);
    };

    const openPauseModal = (offer) => {
        setSelectedOffer(offer);
        setIsPauseModalOpen(true);
        setActiveDropdown(null);
    };

    const openDeleteModal = (offer) => {
        setSelectedOffer(offer);
        setIsDeleteModalOpen(true);
        setActiveDropdown(null);
    };

    const openPerformanceModal = (offer) => {
        setSelectedOffer(offer);
        setIsPerformanceModalOpen(true);
        setActiveDropdown(null);
    };

    const closeModal = () => {
        setIsAddModalOpen(false);
        setIsDetailsModalOpen(false);
        setIsEditModalOpen(false);
        setIsPauseModalOpen(false);
        setIsDeleteModalOpen(false);
        setIsPerformanceModalOpen(false);
        setSelectedOffer(null);
    };

    const toggleDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    return (
        <div className="rtl:text-right font-sans bg-gray-100 min-h-screen w-screen p-6">
            <div className="mx-auto max-w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">العروض النشطة</p>
                            <h3 className="text-3xl font-bold">12</h3>
                            <span className="text-xs text-green-500 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8L11 17" />
                                </svg>
                                8% عن الفترة السابقة
                            </span>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-full text-green-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">المنتجات المخفضة</p>
                            <h3 className="text-3xl font-bold">264</h3>
                            <span className="text-xs text-green-500 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8L11 17" />
                                </svg>
                                8% عن الفترة السابقة
                            </span>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-full text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M17 16l-4-4-4 4" />
                            </svg>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">عروض ستنتهي قريبًا</p>
                            <h3 className="text-3xl font-bold">5</h3>
                            <span className="text-xs text-red-500 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8L11 7" />
                                </svg>
                                3 ساعات 48 دقيقة
                            </span>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-full text-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">العروض الاقل تاثيرا</p>
                            <h3 className="text-3xl font-bold">5</h3>
                            <span className="text-xs text-red-500 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8L11 7" />
                                </svg>
                                8% عن الفترة السابقة
                            </span>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-full text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">العروض والإعلانات</h2>
                        <div className="flex space-x-2 rtl:space-x-reverse items-center">
                            <button onClick={() => setIsAddModalOpen(true)} className="flex items-center bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                إنشاء عرض جديد
                            </button>
                            <div className="relative">
                                <select className="block appearance-none w-full bg-gray-100 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                    <option>الكل</option>
                                    <option>نشط</option>
                                    <option>منتهي</option>
                                    <option>مجدول</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828l-4.243-4.242L4.343 8z"/></svg>
                                </div>
                            </div>
                            <input
                                type="text"
                                placeholder="ابحث عن اسم العرض، نوع العرض..."
                                className="w-full md:w-auto bg-gray-100 border border-gray-200 py-2 px-4 rounded-lg focus:outline-none focus:bg-white focus:border-gray-500 text-sm"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الفترة</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">القيمة</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">النطاق</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">النوع</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم العرض</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {offersData.map((offer, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="relative inline-block text-right">
                                                <button onClick={() => toggleDropdown(index)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
                                                    </svg>
                                                </button>
                                                {activeDropdown === index && (
                                                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                                        <div className="py-1">
                                                            <button onClick={() => openDetailsModal(offer)} className="w-full text-right block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                                عرض التفاصيل
                                                            </button>
                                                            <button onClick={() => openEditModal(offer)} className="w-full text-right block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                                تعديل العرض
                                                            </button>
                                                            <button onClick={() => openPauseModal(offer)} className="w-full text-right block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m-2-6h4m2 0h-4M7 21a9 9 0 1118 0 9 9 0 01-18 0z" /></svg>
                                                                إيقاف العرض مؤقتًا
                                                            </button>
                                                            <button onClick={() => openPerformanceModal(offer)} className="w-full text-right block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-4v4m-4-4v4m-2 4h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2z" /></svg>
                                                                مشاهدة الأداء
                                                            </button>
                                                            <button onClick={() => openDeleteModal(offer)} className="w-full text-right block px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.035 21H7.965a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                                حذف العرض نهائيًا
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                offer.status === 'نشط' ? 'bg-green-100 text-green-800' :
                                                offer.status === 'منتهي' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {offer.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{offer.period}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{offer.value}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{offer.scope}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{offer.type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{offer.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50" onClick={closeModal}>
                    <div className="relative bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-auto transform transition-all" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">إضافة عرض جديد</h3>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">الاسم</label>
                                <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">النسبة</label>
                                <input type="text" placeholder="15%" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">الفترة</label>
                                <div className="flex space-x-2 rtl:space-x-reverse">
                                    <div className="w-1/2 relative">
                                        <input type="text" placeholder="من 1/8/2025" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h.01M16 11h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div className="w-1/2 relative">
                                        <input type="text" placeholder="إلى 10/8/2025" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h.01M16 11h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">نوع العرض</label>
                                <select className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                    <option>عرض عام</option>
                                    <option>عرض منتج معين</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">العرض يشمل</label>
                                <select className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                    <option>كل المنتجات</option>
                                    <option>منتجات محددة</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-4 rtl:space-x-reverse mt-6">
                                <button type="button" onClick={closeModal} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                                    إلغاء
                                </button>
                                <button type="submit" className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">
                                    حفظ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {isEditModalOpen && selectedOffer && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50" onClick={closeModal}>
                    <div className="relative bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-auto transform transition-all" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">تعديل العرض</h3>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">الاسم</label>
                                <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={selectedOffer.name} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">النسبة</label>
                                <input type="text" placeholder="15%" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={selectedOffer.value} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">الفترة</label>
                                <div className="flex space-x-2 rtl:space-x-reverse">
                                    <div className="w-1/2 relative">
                                        <input type="text" placeholder="من 1/8/2025" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={selectedOffer.period.split(' - ')[0]} />
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h.01M16 11h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div className="w-1/2 relative">
                                        <input type="text" placeholder="إلى 10/8/2025" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={selectedOffer.period.split(' - ')[1]} />
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h.01M16 11h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">نوع العرض</label>
                                <select className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={selectedOffer.type}>
                                    <option>عرض عام</option>
                                    <option>عرض منتج معين</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">العرض يشمل</label>
                                <select className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={selectedOffer.scope}>
                                    <option>كل المنتجات</option>
                                    <option>منتجات محددة</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-4 rtl:space-x-reverse mt-6">
                                <button type="button" onClick={closeModal} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                                    إلغاء
                                </button>
                                <button type="submit" className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">
                                    حفظ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {isDetailsModalOpen && selectedOffer && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50" onClick={closeModal}>
                    <div className="relative bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-auto transform transition-all" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">تفاصيل العرض</h3>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-4 text-right">
                            <div className="flex justify-between items-center border-b pb-2">
                                <p className="text-sm text-gray-500">الاسم</p>
                                <p className="text-lg font-semibold">{selectedOffer.name}</p>
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                                <p className="text-sm text-gray-500">النوع</p>
                                <p className="text-lg font-semibold">{selectedOffer.type}</p>
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                                <p className="text-sm text-gray-500">النسبة</p>
                                <p className="text-lg font-semibold">{selectedOffer.value}</p>
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                                <p className="text-sm text-gray-500">العرض يشمل</p>
                                <p className="text-lg font-semibold">{selectedOffer.scope}</p>
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                                <p className="text-sm text-gray-500">التاريخ</p>
                                <p className="text-lg font-semibold">{selectedOffer.period}</p>
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                                <p className="text-sm text-gray-500">الحالة</p>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    selectedOffer.status === 'نشط' ? 'bg-green-100 text-green-800' :
                                    selectedOffer.status === 'منتهي' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {selectedOffer.status}
                                </span>
                            </div>
                            <div className="mt-6">
                                <p className="text-sm text-gray-500 mb-2">ملاحظات إدارية</p>
                                <div className="bg-gray-100 p-4 rounded-lg">
                                    <p className="text-gray-700">عرض ممتاز ولاقى استحسان من الزبائن</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <button onClick={closeModal} className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">
                                تعديل
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isPerformanceModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50" onClick={closeModal}>
                    <div className="relative bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl mx-auto transform transition-all" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">تتبع حالة العرض</h3>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <h4 className="text-lg font-semibold mb-4 text-center">تتبع حالة العرض هذا الشهر</h4>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={offerPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis orientation="right" />
                                    <Tooltip content={<CustomPerformanceTooltip />} />
                                    <Bar dataKey="visits" fill="#000" name="زيارات" />
                                    <Bar dataKey="conversions" fill="#82ca9d" name="تحويلات" />
                                    <Bar dataKey="orders" fill="#ffc658" name="طلبات" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {isPauseModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50" onClick={closeModal}>
                    <div className="relative bg-white p-8 rounded-lg shadow-xl w-full max-w-sm mx-auto text-center transform transition-all" onClick={e => e.stopPropagation()}>
                        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="mb-4">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m-2-6h4m2 0h-4M7 21a9 9 0 1118 0 9 9 0 01-18 0z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold mb-2">هل أنت متأكد أنك تريد إيقاف العرض مؤقتًا؟</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            سوف يتم إيقاف العرض مؤقتًا من قائمة العروض حتى تقوم بتفعيله مرة أخرى. هل أنت متأكد أنك تريد إيقاف العرض مؤقتًا؟
                        </p>
                        <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                            <button onClick={closeModal} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                                إلغاء
                            </button>
                            <button onClick={closeModal} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">
                                إيقاف العرض مؤقتًا
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50" onClick={closeModal}>
                    <div className="relative bg-white p-8 rounded-lg shadow-xl w-full max-w-sm mx-auto text-center transform transition-all" onClick={e => e.stopPropagation()}>
                        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                        </button>
                        <div className="mb-4">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.035 21H7.965a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold mb-2">هل أنت متأكد أنك تريد حذف العرض نهائيًا؟</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            سوف يتم حذف العرض من قائمة العروض بشكل نهائي. هل أنت متأكد؟
                        </p>
                        <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                            <button onClick={closeModal} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                                إلغاء
                            </button>
                            <button onClick={closeModal} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">
                                حذف
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OffersPage;