import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

// API definitions
const API_BASE_URL = 'https://products-api.cbc-apps.net';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

const API_CONFIG = {
    ENDPOINTS: {
        TICKETS: {
            LIST: `${API_BASE_URL}/supplier/tickets`,
            ADD: `${API_BASE_URL}/supplier/tickets`,
            UPDATE: (ticketNumber) => `${API_BASE_URL}/supplier/tickets/${ticketNumber}`,
            DETAILS: (ticketNumber) => `${API_BASE_URL}/supplier/tickets/${ticketNumber}`
        }
    }
};

// Helper functions for colors
const getStatusColor = (status) => {
    switch (status) {
        case 'open':
            return 'bg-green-100 text-green-700';
        case 'in_progress':
            return 'bg-blue-100 text-blue-700';
        case 'resolved':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const getPriorityColor = (priority) => {
    switch (priority) {
        case 'high':
            return 'bg-red-100 text-red-700';
        case 'medium':
            return 'bg-orange-100 text-orange-700';
        case 'low':
            return 'bg-gray-100 text-gray-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const tabs = [
    { name: 'الدعم الفني', path: '/tickets' },
    { name: 'إدارة الفريق', path: '/employees-page' },
    { name: 'بيانات المتجر', path: '/store-info' },
];

const NewTicketModal = ({ show, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('low');
    const [category, setCategory] = useState('technical');

    if (!show) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSave({
            title,
            description,
            category,
            priority,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-lg mx-auto rtl:text-right">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
                    <h3 className="text-xl font-bold">تذكرة جديدة</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">موضوع التذكرة</label>
                            <input
                                type="text"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="ادخل موضوع التذكرة هنا..."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">الأولوية</label>
                            <select
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                required
                            >
                                <option value="high">عالية</option>
                                <option value="medium">متوسطة</option>
                                <option value="low">منخفضة</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                            <textarea
                                rows="4"
                                placeholder="ادخل الوصف هنا..."
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">إلغاء</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md shadow-sm hover:bg-red-600">ارسال</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const TicketDetailsModal = ({ show, onClose, ticket }) => {
    if (!show || !ticket) return null;

    const getStatusText = (status) => {
        switch (status) {
            case 'open':
                return 'مفتوحة';
            case 'in_progress':
                return 'قيد التنفيذ';
            case 'resolved':
                return 'محلولة';
            default:
                return 'غير معروف';
        }
    };

    const getPriorityText = (priority) => {
        switch (priority) {
            case 'high':
                return 'عالية';
            case 'medium':
                return 'متوسطة';
            case 'low':
                return 'منخفضة';
            default:
                return 'غير معروف';
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl mx-auto rtl:text-right">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
                    <div className="flex items-center">
                        <h3 className="text-xl font-bold">تفاصيل التذكرة - {ticket.number || ticket.id}</h3>
                        <span className={`mr-4 py-1 px-3 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                            {getStatusText(ticket.status)}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div className="space-y-4 text-sm">
                    <p><strong>الموضوع:</strong> {ticket.subject}</p>
                    <p><strong>الوصف:</strong> {ticket.description}</p>
                    <p><strong>الأولوية:</strong> {getPriorityText(ticket.priority)}</p>
                    <p><strong>الحالة:</strong> {getStatusText(ticket.status)}</p>
                    <p><strong>الفئة:</strong> {ticket.category}</p>
                    <p><strong>رقم التذكرة:</strong> {ticket.number || ticket.id}</p>
                    <p><strong>تم الإنشاء في:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
                    <p><strong>آخر تحديث:</strong> {new Date(ticket.updatedAt).toLocaleString()}</p>
                    {ticket.resolvedAt && (
                        <p><strong>تم الحل في:</strong> {new Date(ticket.resolvedAt).toLocaleString()}</p>
                    )}
                </div>
                <div className="mt-4 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">إغلاق</button>
                </div>
            </div>
        </div>
    );
};

const TicketEditModal = ({ show, onClose, ticket, onUpdate }) => {
    const [status, setStatus] = useState(ticket?.status || '');
    const [priority, setPriority] = useState(ticket?.priority || '');

    useEffect(() => {
        if (ticket) {
            setStatus(ticket.status);
            setPriority(ticket.priority);
        }
    }, [ticket]);

    if (!show || !ticket) return null;

    const handleUpdate = async () => {
        const ticketNumber = ticket.number || ticket.id;
        if (!ticketNumber) {
            console.error("رقم التذكرة غير موجود!");
            return;
        }
        await onUpdate(ticketNumber, { status, priority });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto rtl:text-right">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
                    <h3 className="text-xl font-bold">تعديل التذكرة - {ticket.number || ticket.id}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="open">مفتوحة</option>
                            <option value="in_progress">قيد التقدم</option>
                            <option value="resolved">تم الحل</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الأولوية</label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="high">عالية</option>
                            <option value="medium">متوسطة</option>
                            <option value="low">منخفضة</option>
                        </select>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">إلغاء</button>
                    <button onClick={handleUpdate} className="px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md shadow-sm hover:bg-red-600">تحديث</button>
                </div>
            </div>
        </div>
    );
};

const TicketsPage = () => {
    const location = useLocation();
    const [showNewTicketModal, setShowNewTicketModal] = useState(false);
    const [showTicketDetailsModal, setShowTicketDetailsModal] = useState(false);
    const [showTicketEditModal, setShowTicketEditModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [ticketsData, setTicketsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const [limit, setLimit] = useState(10);

    const getStatusText = (status) => {
        switch (status) {
            case 'open':
                return 'مفتوحة';
            case 'in_progress':
                return 'قيد التنفيذ';
            case 'resolved':
                return 'محلولة';
            default:
                return 'غير معروف';
        }
    };

    const getPriorityText = (priority) => {
        switch (priority) {
            case 'high':
                return 'عالية';
            case 'medium':
                return 'متوسطة';
            case 'low':
                return 'منخفضة';
            default:
                return 'غير معروف';
        }
    };

    const fetchTicketsData = async (page = 1, currentLimit = limit) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_CONFIG.ENDPOINTS.TICKETS.LIST}?page=${page}&limit=${currentLimit}`, {
                headers: getAuthHeaders()
            });
            const data = response.data;
            const formattedTickets = (data.tickets || []).map(ticket => ({
                number: ticket.number,
                subject: ticket.subject,
                priority: ticket.priority,
                creationDate: ticket.creationDate,
                lastUpdate: ticket.lastUpdate,
                status: ticket.status,
            }));
            setTicketsData(formattedTickets);
            setPagination(data.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 });
        } catch (err) {
            console.error('Error fetching tickets:', err);
            setError('فشل في تحميل بيانات التذاكر. يرجى المحاولة مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    const fetchTicketDetails = async (ticketNumber) => {
        try {
            const response = await axios.get(API_CONFIG.ENDPOINTS.TICKETS.DETAILS(ticketNumber), {
                headers: getAuthHeaders()
            });
            const ticket = response.data;
            const detailedTicket = {
                id: ticket.id,
                number: ticket.number,
                subject: ticket.title,
                description: ticket.description,
                status: ticket.status,
                priority: ticket.priority,
                category: ticket.category,
                createdAt: ticket.createdAt,
                updatedAt: ticket.updatedAt,
                resolvedAt: ticket.resolvedAt,
            };
            setSelectedTicket(detailedTicket);
            setShowTicketDetailsModal(true);
        } catch (err) {
            console.error('Error fetching ticket details:', err);
        }
    };

    const fetchTicketForEdit = async (ticketNumber) => {
        try {
            const response = await axios.get(API_CONFIG.ENDPOINTS.TICKETS.DETAILS(ticketNumber), {
                headers: getAuthHeaders()
            });
            setSelectedTicket(response.data);
            setShowTicketEditModal(true);
        } catch (err) {
            console.error('Error fetching ticket for edit:', err);
        }
    };

    useEffect(() => {
        fetchTicketsData(pagination.currentPage, limit);
    }, [pagination.currentPage, limit]);

    const handleCreateTicket = async (ticketData) => {
        try {
            await axios.post(API_CONFIG.ENDPOINTS.TICKETS.ADD, ticketData, {
                headers: getAuthHeaders()
            });
            await fetchTicketsData(pagination.currentPage, limit);
        } catch (error) {
            console.error('Error creating ticket:', error);
        }
    };

    const handleUpdateTicket = async (ticketNumber, ticketData) => {
        try {
            await axios.patch(API_CONFIG.ENDPOINTS.TICKETS.UPDATE(ticketNumber), ticketData, {
                headers: getAuthHeaders()
            });
            await fetchTicketsData(pagination.currentPage, limit);
            await fetchTicketDetails(ticketNumber);
        } catch (error) {
            console.error('Error updating ticket:', error);
        }
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
                        onClick={() => fetchTicketsData(pagination.currentPage, limit)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    const pages = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);

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
                                <h3 className="text-3xl font-bold">{ticketsData.filter(t => t.status === 'resolved').length}</h3>
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
                                <h3 className="text-3xl font-bold">{ticketsData.filter(t => t.status === 'open').length}</h3>
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
                                <h3 className="text-3xl font-bold">{pagination.totalItems}</h3>
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
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">اخر تحديث</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الإنشاء</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">الأولوية</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">الموضوع</th>
                                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">رقم التذكرة</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {ticketsData.length > 0 ? (
                                    ticketsData.map((ticket, index) => (
                                        <tr key={index}>
                                            <td className="py-4 px-4 whitespace-nowrap">
                                                <div className="flex space-x-2 justify-end">
                                                    <button onClick={() => fetchTicketDetails(ticket.number)} className="text-gray-500 hover:text-red-500" title="عرض التفاصيل">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.577 3.01 9.964 7.822.08.361.08.736 0 1.097C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.577-3.01-9.964-7.822z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => fetchTicketForEdit(ticket.number)} className="text-gray-500 hover:text-blue-500" title="تعديل">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.75" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap">
                                                <span className={`py-1 px-3 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                                                    {getStatusText(ticket.status)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap">{new Date(ticket.lastUpdate).toLocaleDateString()}</td>
                                            <td className="py-4 px-4 whitespace-nowrap">{new Date(ticket.creationDate).toLocaleDateString()}</td>
                                            <td className="py-4 px-4 whitespace-nowrap">
                                                <span className={`py-1 px-3 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                                                    {getPriorityText(ticket.priority)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap">{ticket.subject}</td>
                                            <td className="py-4 px-4 whitespace-nowrap">{ticket.number}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-8 text-center text-gray-500">
                                            لا توجد تذاكر حاليًا.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                            <div className="flex items-center">
                                <span>عرض في الصفحة</span>
                                <select
                                    className="mx-2 bg-white border border-gray-300 rounded-lg p-1 text-sm"
                                    value={limit}
                                    onChange={(e) => {
                                        setLimit(Number(e.target.value));
                                        setPagination(prev => ({ ...prev, currentPage: 1 }));
                                    }}
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                </select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => fetchTicketsData(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage <= 1}
                                    className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                {pages.map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => fetchTicketsData(page)}
                                        className={`py-1 px-3 rounded-full ${pagination.currentPage === page ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => fetchTicketsData(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage >= pagination.totalPages}
                                    className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                            <span>إجمالي التذاكر: {pagination.totalItems}</span>
                        </div>
                    </div>
                </div>
            </div>
            <NewTicketModal show={showNewTicketModal} onClose={() => setShowNewTicketModal(false)} onSave={handleCreateTicket} />
            <TicketDetailsModal show={showTicketDetailsModal} onClose={() => setShowTicketDetailsModal(false)} ticket={selectedTicket} />
            <TicketEditModal show={showTicketEditModal} onClose={() => setShowTicketEditModal(false)} ticket={selectedTicket} onUpdate={handleUpdateTicket} />
        </div>
    );
};

export default TicketsPage;