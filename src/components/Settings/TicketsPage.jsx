import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getApiUrl, getAuthHeaders, API_CONFIG } from '../../config/api';
import axios from 'axios';

const tabs = [
    { name: 'بيانات المتجر', path: '/store-info' },
    { name: 'إدارة الفريق', path: '/employees-page' },
    { name: 'الدعم الفني', path: '/tickets' },
];

const ticketsData = [
    { number: 'TKT-001', subject: 'مشكلة في معالجة الدفع', priority: 'عالية', creationDate: '2025-08-28', lastUpdate: '2025-08-30', status: 'مفتوحة' },
    { number: 'TKT-001', subject: 'مشكلة في معالجة الدفع', priority: 'عالية', creationDate: '2025-08-28', lastUpdate: '2025-08-30', status: 'مفتوحة' },
    { number: 'TKT-002', subject: 'تحديث في النظام', priority: 'متوسطة', creationDate: '2025-09-12', lastUpdate: '2025-09-15', status: 'مغلقة' },
    { number: 'TKT-003', subject: 'استفسار حول الحساب', priority: 'منخفضة', creationDate: '2025-10-02', lastUpdate: '2025-10-05', status: 'مفتوحة' },
    { number: 'TKT-004', subject: 'خطأ في الفواتير', priority: 'عالية', creationDate: '2025-07-18', lastUpdate: '2025-07-20', status: 'مغلقة' },
];

const getStatusColor = (status) => {
    switch (status) {
        case 'مفتوحة':
            return 'bg-green-100 text-green-700';
        case 'مغلقة':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const getPriorityColor = (priority) => {
    switch (priority) {
        case 'عالية':
            return 'bg-red-100 text-red-700';
        case 'متوسطة':
            return 'bg-orange-100 text-orange-700';
        case 'منخفضة':
            return 'bg-gray-100 text-gray-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const NewTicketModal = ({ show, onClose }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-lg mx-auto rtl:text-right">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
                    <h3 className="text-xl font-bold">تذكرة جديدة</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">موضوع التذكرة</label>
                        <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500">
                            <option>مالي</option>
                            <option>مشكلة فنية</option>
                            <option>استفسار عام</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الأولوية</label>
                        <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500">
                            <option>عالي</option>
                            <option>متوسط</option>
                            <option>منخفض</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                        <textarea rows="4" placeholder="ادخل الوصف هنا..." className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"></textarea>
                    </div>
                    <div className="border border-dashed border-red-300 rounded-lg p-6 text-center">
                        <input type="file" className="hidden" id="file-upload" />
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <p className="mt-2 text-sm text-gray-600">
                                اضغط لرفع ملف او سحبة
                            </p>
                            <p className="text-xs text-gray-500">(MBالحد الأقصى 10 JPG, PNG,)</p>
                        </label>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">إلغاء</button>
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md shadow-sm hover:bg-red-600">ارسال</button>
                </div>
            </div>
        </div>
    );
};

const TicketDetailsModal = ({ show, onClose, ticket }) => {
    if (!show || !ticket) return null;
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl mx-auto rtl:text-right">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
                    <div className="flex items-center">
                        <h3 className="text-xl font-bold">تفاصيل التذكرة - {ticket.number}</h3>
                        <span className={`mr-4 py-1 px-3 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                    {ticket.subject}
                </p>

                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                                <span className="font-bold text-sm">متجر نايك</span>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png" alt="Nike Logo" className="w-6 h-6 mr-2" />
                            </div>
                            <span className="text-xs text-gray-500">2025-08-28 - 10:20م</span>
                        </div>
                        <p className="text-sm text-gray-800">
                            "السلام عليكم، عند محاولة أحد الزبائن الدفع باستخدام بطاقة
                            ماستر كارد ظهر له خطأ (Transaction Failed) رغم أن الرصيد
                            متوفر. المشكلة تتكرر مع أكثر من زبون منذ يومين."
                        </p>
                        <div className="mt-4 flex justify-end">
                            <img src="https://i.imgur.com/uTjA2Fz.png" alt="Credit Card" className="w-24 rounded" />
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                                <span className="font-bold text-sm">CBC Admin - Sara</span>
                                <img src="https://i.imgur.com/vHqJ9Uv.png" alt="CBC Admin Logo" className="w-6 h-6 mr-2" />
                            </div>
                            <span className="text-xs text-gray-500">2025-08-29 - 09:05ص</span>
                        </div>
                        <p className="text-sm text-gray-800">
                            شكراً على التوضيح. تم رفع البلاغ إلى قسم الدفع. يرجى المحاولة مرة
                            أخرى خلال 24 ساعة
                        </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                                <span className="font-bold text-sm">CBC Admin - Sara</span>
                                <img src="https://i.imgur.com/vHqJ9Uv.png" alt="CBC Admin Logo" className="w-6 h-6 mr-2" />
                            </div>
                            <span className="text-xs text-gray-500">2025-08-30 - 11:10ص</span>
                        </div>
                        <p className="text-sm text-gray-800">
                            تم إصلاح الخلل في بوابة الدفع. يرجى التحقق الآن.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                                <span className="font-bold text-sm">متجر نايك</span>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png" alt="Nike Logo" className="w-6 h-6 mr-2" />
                            </div>
                            <span className="text-xs text-gray-500">2025-08-30 - 11:25ص</span>
                        </div>
                        <p className="text-sm text-gray-800">
                            تمت التجربة والعملية نجحت. شكرا لكم.
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex items-end space-x-2">
                    <button className="bg-red-500 text-white rounded-lg p-3">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l.681-.293a1 1 0 00.126-.264l1.37-3.917a1 1 0 00-.012-.047l1.7-4.25a1 1 0 011.536-.36l3.344 1.858a1 1 0 001.077-.184l3.784-3.027a1 1 0 00-.785-1.636z"></path></svg>
                    </button>
                    <button className="bg-gray-200 text-gray-600 rounded-lg p-3">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd"></path></svg>
                    </button>
                    <input type="text" placeholder="اكتب رسالتك" className="flex-grow bg-gray-100 rounded-lg py-2 px-4 text-right" />
                </div>
            </div>
        </div>
    );
};

const TicketsPage = () => {
    const location = useLocation();
    const [showNewTicketModal, setShowNewTicketModal] = useState(false);
    const [showTicketDetailsModal, setShowTicketDetailsModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [ticketsData, setTicketsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTicketsData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.TICKETS.LIST), {
                    headers: getAuthHeaders()
                });
                
                const data = response.data;
                setTicketsData(data.tickets || []);
                setError(null);
            } catch (err) {
                console.error('Error fetching tickets:', err);
                setError('فشل في تحميل بيانات التذاكر');
                setTicketsData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTicketsData();
    }, []);

    const handleCreateTicket = async (ticketData) => {
        try {
            const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.TICKETS.ADD), ticketData, {
                headers: getAuthHeaders()
            });
            
            // Refresh tickets list
            const fetchResponse = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.TICKETS.LIST), {
                headers: getAuthHeaders()
            });
            
            setTicketsData(fetchResponse.data.tickets || []);
            setShowNewTicketModal(false);
            return { success: true, message: 'تم إنشاء التذكرة بنجاح' };
        } catch (error) {
            console.error('Error creating ticket:', error);
            return { success: false, message: 'فشل في إنشاء التذكرة' };
        }
    };

    const handleUpdateTicket = async (ticketId, ticketData) => {
        try {
            const response = await axios.patch(getApiUrl(API_CONFIG.ENDPOINTS.TICKETS.EDIT(ticketId)), ticketData, {
                headers: getAuthHeaders()
            });
            
            // Refresh tickets list
            const fetchResponse = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.TICKETS.LIST), {
                headers: getAuthHeaders()
            });
            
            setTicketsData(fetchResponse.data.tickets || []);
            setShowTicketDetailsModal(false);
            return { success: true, message: 'تم تحديث التذكرة بنجاح' };
        } catch (error) {
            console.error('Error updating ticket:', error);
            return { success: false, message: 'فشل في تحديث التذكرة' };
        }
    };

    const handleReplyToTicket = async (ticketId, replyData) => {
        try {
            const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.TICKETS.REPLY(ticketId)), replyData, {
                headers: getAuthHeaders()
            });
            
            // Refresh tickets list
            const fetchResponse = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.TICKETS.LIST), {
                headers: getAuthHeaders()
            });
            
            setTicketsData(fetchResponse.data.tickets || []);
            return { success: true, message: 'تم إرسال الرد بنجاح' };
        } catch (error) {
            console.error('Error replying to ticket:', error);
            return { success: false, message: 'فشل في إرسال الرد' };
        }
    };

    const openTicketDetails = (ticket) => {
        setSelectedTicket(ticket);
        setShowTicketDetailsModal(true);
    };

    if (loading) {
        return (
            <div className="bg-gray-100 min-h-screen p-6 font-['Tajawal'] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">جاري تحميل بيانات التذاكر...</p>
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
        <div className="rtl:text-right font-sans">
            <div className="flex justify-end bg-white py-4 px-6 border-b border-gray-200 shadow-sm">
                <nav className="flex space-x-4">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.name}
                            to={tab.path}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                                location.pathname === tab.path
                                    ? 'border-red-500 text-red-500'
                                    : 'border-transparent text-gray-500 hover:border-gray-300'
                            }`}
                        >
                            {tab.name}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="p-6 bg-gray-100 min-h-screen">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">التذاكر المحلولة</p>
                                <h3 className="text-3xl font-bold">1</h3>
                                <span className="text-xs text-green-500">+8% عن الفترة السابقة</span>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-full text-green-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">التذاكر المفتوحة</p>
                                <h3 className="text-3xl font-bold">4</h3>
                                <span className="text-xs text-green-500">+8% عن الفترة السابقة</span>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-full text-blue-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">إجمالي التذاكر</p>
                                <h3 className="text-3xl font-bold">6</h3>
                                <span className="text-xs text-green-500">+8% عن الفترة السابقة</span>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-full text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4 text-right">
                            <h2 className="text-xl font-bold">التذاكر</h2>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => setShowNewTicketModal(true)} className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    تذكرة جديدة
                                </button>
                                <div className="relative">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input type="text" placeholder="ابحث..." className="border border-gray-300 rounded-lg py-2 pl-10 pr-4 text-right" />
                                </div>
                            </div>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200 text-right">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">عرض</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">اخر تحديث</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الإنشاء</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">الأولوية</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">الموضوع</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">رقم التذكرة</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {ticketsData.map((ticket, index) => (
                                    <tr key={index}>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <button onClick={() => openTicketDetails(ticket)} className="text-gray-500 hover:text-red-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.577 3.01 9.964 7.822.08.361.08.736 0 1.097C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.577-3.01-9.964-7.822z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </button>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <span className={`py-1 px-3 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">{ticket.lastUpdate}</td>
                                        <td className="py-4 px-4 whitespace-nowrap">{ticket.creationDate}</td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <span className={`py-1 px-3 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">{ticket.subject}</td>
                                        <td className="py-4 px-4 whitespace-nowrap">{ticket.number}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                            <div className="flex items-center">
                                <span>عرض في الصفحة</span>
                                <select className="mx-2 bg-white border border-gray-300 rounded-lg p-1 text-sm">
                                    <option>10</option>
                                    <option>5</option>
                                    <option>20</option>
                                </select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="p-2 rounded-full hover:bg-gray-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <span className="bg-red-500 text-white py-1 px-3 rounded-full">1</span>
                                <span className="py-1 px-3">2</span>
                                <span className="py-1 px-3">3</span>
                                <span className="py-1 px-3">4</span>
                                <span className="py-1 px-3">5</span>
                                <button className="p-2 rounded-full hover:bg-gray-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                            <span>إجمالي التذاكر: 5</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <NewTicketModal show={showNewTicketModal} onClose={() => setShowNewTicketModal(false)} />
            <TicketDetailsModal show={showTicketDetailsModal} onClose={() => setShowTicketDetailsModal(false)} ticket={selectedTicket} />
        </div>
    );
};

export default TicketsPage;