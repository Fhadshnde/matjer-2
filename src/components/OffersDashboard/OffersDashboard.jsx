import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const baseURL = 'https://products-api.cbc-apps.net';

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
    const [offersData, setOffersData] = useState([]);
    const [dashboardStats, setDashboardStats] = useState({ totalOffers: 0, activeOffers: 0, expiredOffers: 0, upcomingOffers: 0 });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [performanceData, setPerformanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addForm, setAddForm] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        categoryId: 1, // Default value as per API body
        productIds: [],
        discountType: 'percentage', // Default value as per API body
        discountValue: 0
    });
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        isActive: false
    });

    const token = localStorage.getItem('token');
    
    // Default headers including Content-Type for other requests
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const fetchOffers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${baseURL}/supplier/offers`, { headers: defaultHeaders });
            const { offers, totalOffers, activeOffers, expiredOffers, upcomingOffers } = response.data;

            setOffersData(offers.map(offer => ({
                ...offer,
                status: offer.isActive ? 'نشط' : (new Date(offer.endDate) < new Date() ? 'منتهي' : 'مجدول'),
                period: `${new Date(offer.startDate).toLocaleDateString()} - ${new Date(offer.endDate).toLocaleDateString()}`,
                name: offer.title,
                type: 'عام', // API data doesn't provide this, so defaulting.
                scope: 'كل المنتجات', // API data doesn't provide this, so defaulting.
                value: 'غير محدد' // API data doesn't provide this, so defaulting.
            })));
            setDashboardStats({ totalOffers, activeOffers, expiredOffers, upcomingOffers });
            setError(null);
        } catch (err) {
            setError('فشل في جلب العروض.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOfferPerformance = async (offerId) => {
        try {
            const response = await axios.get(`${baseURL}/supplier/offers/${offerId}/performance`, { headers: defaultHeaders });
            const { performance } = response.data;
            setPerformanceData([
                { name: 'الأداء العام', visits: performance.totalViews, conversions: performance.conversionRate, orders: performance.totalSales }
            ]);
            setIsPerformanceModalOpen(true);
        } catch (err) {
            setError('فشل في جلب أداء العرض.');
            console.error(err);
        }
    };

    const handleAddOffer = async (e) => {
        e.preventDefault();
        try {
            const newOfferBody = {
                ...addForm,
                productIds: addForm.productIds.map(id => parseInt(id, 10)),
                discountValue: parseFloat(addForm.discountValue)
            };
            await axios.post(`${baseURL}/supplier/offers`, newOfferBody, { headers: defaultHeaders });
            closeModal();
            fetchOffers(); // Refresh offers list
        } catch (err) {
            setError('فشل في إنشاء العرض.');
            console.error(err);
        }
    };

    const handleEditOffer = async (e) => {
        e.preventDefault();
        if (!selectedOffer) return;
        try {
            const updatedOfferBody = {
                title: editForm.title,
                description: editForm.description,
                isActive: editForm.isActive
            };
            await axios.patch(`${baseURL}/supplier/offers/${selectedOffer.id}`, updatedOfferBody, { headers: defaultHeaders });
            closeModal();
            fetchOffers(); // Refresh offers list
        } catch (err) {
            setError('فشل في تعديل العرض.');
            console.error(err);
        }
    };

    const handleDeleteOffer = async () => {
        if (!selectedOffer) return;
        try {
            await axios.delete(`${baseURL}/supplier/offers/${selectedOffer.id}`, { headers: defaultHeaders });
            closeModal();
            fetchOffers(); // Refresh offers list
        } catch (err) {
            setError('فشل في حذف العرض.');
            console.error(err);
        }
    };
    
    // Corrected function to toggle offer status by removing Content-Type header
    const handleToggleOfferStatus = async () => {
        if (!selectedOffer) return;
        try {
            // Headers for a body-less PATCH request
            const headersWithoutContentType = {
                'Authorization': `Bearer ${token}`
            };

            await axios.patch(`${baseURL}/supplier/offers/${selectedOffer.id}/toggle`, null, { headers: headersWithoutContentType });
            closeModal();
            fetchOffers(); // Refresh offers list
        } catch (err) {
            setError('فشل في تغيير حالة العرض.');
            console.error(err);
        }
    };


    const openDetailsModal = (offer) => {
        setSelectedOffer(offer);
        setIsDetailsModalOpen(true);
        setActiveDropdown(null);
    };

    const openEditModal = (offer) => {
        setSelectedOffer(offer);
        setEditForm({
            title: offer.title,
            description: offer.description,
            isActive: offer.isActive
        });
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
        fetchOfferPerformance(offer.id);
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
        setPerformanceData([]);
        setAddForm({
            title: '',
            description: '',
            startDate: '',
            endDate: '',
            categoryId: 1,
            productIds: [],
            discountType: 'percentage',
            discountValue: 0
        });
        setEditForm({
            title: '',
            description: '',
            isActive: false
        });
    };

    const toggleDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    if (loading) return <div className="rtl:text-right p-6 text-center">جاري تحميل البيانات...</div>;
    if (error) return <div className="rtl:text-right p-6 text-center text-red-500">حدث خطأ: {error}</div>;

    return (
        <div className="rtl:text-right font-sans bg-gray-100 min-h-screen w-screen p-6">
            <div className="mx-auto max-w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">إجمالي العروض</p>
                            <h3 className="text-3xl font-bold">{dashboardStats.totalOffers}</h3>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-full text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M17 16l-4-4-4 4" />
                            </svg>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">العروض النشطة</p>
                            <h3 className="text-3xl font-bold">{dashboardStats.activeOffers}</h3>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-full text-green-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">عروض منتهية</p>
                            <h3 className="text-3xl font-bold">{dashboardStats.expiredOffers}</h3>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-full text-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">عروض مجدولة</p>
                            <h3 className="text-3xl font-bold">{dashboardStats.upcomingOffers}</h3>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-full text-yellow-500">
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
                                    <tr key={offer.id}>
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

            {/* Add Modal */}
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
                        <form onSubmit={handleAddOffer}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">اسم العرض</label>
                                <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={addForm.title} onChange={(e) => setAddForm({...addForm, title: e.target.value})} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">الوصف</label>
                                <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={addForm.description} onChange={(e) => setAddForm({...addForm, description: e.target.value})}></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">نوع الخصم</label>
                                <select className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={addForm.discountType} onChange={(e) => setAddForm({...addForm, discountType: e.target.value})}>
                                    <option value="percentage">نسبة مئوية</option>
                                    <option value="fixed">قيمة ثابتة</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">قيمة الخصم</label>
                                <input type="number" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={addForm.discountValue} onChange={(e) => setAddForm({...addForm, discountValue: e.target.value})} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">الفترة</label>
                                <div className="flex space-x-2 rtl:space-x-reverse">
                                    <div className="w-1/2 relative">
                                        <input type="date" placeholder="تاريخ البدء" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            value={addForm.startDate} onChange={(e) => setAddForm({...addForm, startDate: e.target.value})} />
                                    </div>
                                    <div className="w-1/2 relative">
                                        <input type="date" placeholder="تاريخ الانتهاء" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            value={addForm.endDate} onChange={(e) => setAddForm({...addForm, endDate: e.target.value})} />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">الفئة</label>
                                <input type="number" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={addForm.categoryId} onChange={(e) => setAddForm({...addForm, categoryId: e.target.value})} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">معرفات المنتجات (IDs) (مفصولة بفاصلة)</label>
                                <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={addForm.productIds.join(',')} onChange={(e) => setAddForm({...addForm, productIds: e.target.value.split(',')})} />
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
            
            {/* Edit Modal */}
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
                        <form onSubmit={handleEditOffer}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">اسم العرض</label>
                                <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">الوصف</label>
                                <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})}></textarea>
                            </div>
                            <div className="mb-4 flex items-center">
                                <input type="checkbox" className="form-checkbox h-5 w-5 text-red-600"
                                    checked={editForm.isActive} onChange={(e) => setEditForm({...editForm, isActive: e.target.checked})} />
                                <label className="mr-2 text-gray-700 text-sm font-bold">نشط</label>
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


            {/* Details Modal */}
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
                                <p className="text-lg font-semibold">{selectedOffer.title}</p>
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                                <p className="text-sm text-gray-500">الوصف</p>
                                <p className="text-lg font-semibold">{selectedOffer.description}</p>
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
                        </div>
                        <div className="mt-6">
                            <button onClick={closeModal} className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Performance Modal */}
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
                        <h4 className="text-lg font-semibold mb-4 text-center">أداء العرض: {selectedOffer?.title}</h4>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis orientation="right" />
                                    <Tooltip content={<CustomPerformanceTooltip />} />
                                    <Bar dataKey="visits" fill="#000" name="الزيارات" />
                                    <Bar dataKey="conversions" fill="#82ca9d" name="التحويلات" />
                                    <Bar dataKey="orders" fill="#ffc658" name="الطلبات" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Pause Modal */}
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
                            <button onClick={handleToggleOfferStatus} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">
                                إيقاف العرض مؤقتًا
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Delete Modal */}
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
                            <button onClick={handleDeleteOffer} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">
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