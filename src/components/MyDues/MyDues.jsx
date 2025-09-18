import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getApiUrl, getAuthHeaders, API_CONFIG } from '../../config/api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-md text-right font-sans border-t-4 border-red-500">
                <p className="font-bold text-gray-800 text-lg mb-2">{label}</p>
                <div className="flex flex-col space-y-1">
                    {payload.map((entry, index) => (
                        <div key={index} className="flex justify-between items-center text-gray-700">
                            <span style={{ color: entry.color }}>{entry.name}</span>
                            <span className="font-semibold text-right">{entry.value.toLocaleString('ar-EG')} د.ع</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

const PaymentsAndCashbackDashboard = () => {
    const [isMoreModalOpen, setIsMoreModalOpen] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statsCards, setStatsCards] = useState([]);
    const [ordersData, setOrdersData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [summary, setSummary] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('الكل');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const handleMoreClick = (orderIndex) => {
        setIsMoreModalOpen(orderIndex);
    };

    const handleCloseMoreModal = () => {
        setIsMoreModalOpen(null);
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        handleCloseMoreModal();
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedOrder(null);
    };

    const getStatusColors = (status) => {
        switch (status) {
            case 'قيد التوصيل':
                return 'bg-blue-100 text-blue-700';
            case 'مشحون':
                return 'bg-green-100 text-green-700';
            case 'ملغي':
                return 'bg-red-100 text-red-700';
            case 'قيد المعالجة':
                return 'bg-yellow-100 text-yellow-700';
            case 'مستلم':
                return 'bg-green-100 text-green-700';
            case 'معلق':
                return 'bg-yellow-100 text-yellow-700';
            case 'CANCELLED':
                return 'bg-red-100 text-red-700';
            case 'DELIVERED':
                return 'bg-green-100 text-green-700';
            case 'PROCESSING':
                return 'bg-yellow-100 text-yellow-700';
            case 'SHIPPED':
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            'CANCELLED': 'ملغي',
            'DELIVERED': 'مستلم',
            'PROCESSING': 'قيد المعالجة',
            'SHIPPED': 'مشحون',
            'PENDING': 'معلق'
        };
        return statusMap[status] || status;
    };

    const handleExportToExcel = () => {
        const dataForExport = filteredOrders.map(order => ({
            'رقم الطلب': order.orderNumber,
            'تاريخ الطلب': order.orderDate,
            'اسم الزبون': order.customerName,
            'الكمية': order.quantity,
            'السعر المفرد': order.retailPrice,
            'سعر الجملة': order.wholesalePrice,
            'عمولة التطبيق': order.appCommission,
            'صافي التاجر': order.netMerchant,
            'الحالة': order.status
        }));

        const ws = XLSX.utils.json_to_sheet(dataForExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'سجل المدفوعات');
        
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        
        saveAs(dataBlob, 'سجل المدفوعات.xlsx');
    };

    useEffect(() => {
        const fetchDuesData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.DUES.ENHANCED), { 
                    headers: getAuthHeaders() 
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch dues data.');
                }
                
                const data = await response.json();

                // Process stats cards
                const newStatsCards = [
                    {
                        title: data.cards.totalDues.title,
                        value: data.cards.totalDues.value.toLocaleString('ar-EG') + ' د.ع',
                        growth: data.cards.totalDues.change,
                        icon: 'total-dues',
                        trend: data.cards.totalDues.trend,
                        description: data.cards.totalDues.description
                    },
                    {
                        title: data.cards.netDues.title,
                        value: data.cards.netDues.value.toLocaleString('ar-EG') + ' د.ع',
                        growth: data.cards.netDues.change,
                        icon: 'net-dues',
                        trend: data.cards.netDues.trend,
                        description: data.cards.netDues.description
                    },
                    {
                        title: data.cards.appCommission.title,
                        value: data.cards.appCommission.value.toLocaleString('ar-EG') + ' د.ع',
                        growth: data.cards.appCommission.change,
                        icon: 'app-commission',
                        trend: data.cards.appCommission.trend,
                        description: data.cards.appCommission.description
                    },
                    {
                        title: data.cards.numberOfOrders.title,
                        value: data.cards.numberOfOrders.value.toLocaleString('ar-EG') + ' طلب',
                        growth: data.cards.numberOfOrders.change,
                        icon: 'number-of-orders',
                        trend: data.cards.numberOfOrders.trend,
                        description: data.cards.numberOfOrders.description
                    },
                ];
                setStatsCards(newStatsCards);

                // Process chart data
                const mappedChartData = data.monthlyBreakdown.map(item => ({
                    name: item.month,
                    'اجمالي المستحقات': item.totalDues,
                    'صافي المستحق': item.netDues,
                    'عمولة التطبيق': item.appCommission,
                    'عدد الطلبات': item.ordersCount
                }));
                setChartData(mappedChartData);

                // Process orders data
                const mappedOrdersData = data.ordersTable.map(order => ({
                    ...order,
                    status: getStatusText(order.status),
                    orderDate: new Date(order.orderDate).toLocaleDateString('ar-EG')
                }));
                setOrdersData(mappedOrdersData);

                // Set summary
                setSummary(data.summary);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDuesData();
    }, []);

    // Filter orders based on search and status
    const filteredOrders = ordersData.filter(order => {
        const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'الكل' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">جاري تحميل بيانات المستحقات...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-red-500">خطأ: {error}</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 p-4 min-h-screen rtl:text-right font-sans">
            <div className="container mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">مستحقاتي</h1>
                    <p className="text-gray-600">إدارة وتتبع المستحقات والعمولات</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
  {statsCards.map((card, index) => (
    <div
      key={index}
      className="bg-white p-8 h-[140px] rounded-lg shadow-md flex flex-row items-center justify-between gap-3 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="bg-gray-100 p-5 rounded-lg text-red-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      </div>

      <div className="flex flex-col text-right">
        <h3 className="text-gray-500 text-xs font-medium mb-0.5">
          {card.title}
        </h3>
        <p className="text-lg font-bold text-gray-800 mb-0.5">
          {card.value}
        </p>
        <span
          className={`text-xs flex items-center ${
            card.trend === "up"
              ? "text-green-500"
              : card.trend === "down"
              ? "text-red-500"
              : "text-gray-500"
          }`}
        >
          {card.trend === "up" && <span className="mr-1">▲</span>}
          {card.trend === "down" && <span className="mr-1">▼</span>}
          {card.growth}
        </span>
        <p className="text-[10px] text-gray-400 mt-1">{card.description}</p>
      </div>
    </div>
  ))}
</div>


                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Monthly Breakdown Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">تقرير المدفوعات الشهري</h2>
                            <div className="flex space-x-2">
                                {/* <button onClick={handleExportToExcel} className="bg-white text-gray-700 border border-gray-300 rounded-lg py-2 px-4 flex items-center hover:bg-gray-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 ml-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                    تصدير
                                </button> */}
                                <select className="bg-gray-100 rounded-lg py-2 px-4 text-gray-700">
                                    <option>شهري</option>
                                    <option>أسبوعي</option>
                                    <option>يومي</option>
                                </select>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={400}>
                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="اجمالي المستحقات" stackId="1" stroke="#EF4444" fill="#FEE2E2" />
                                <Area type="monotone" dataKey="صافي المستحق" stackId="1" stroke="#8884d8" fill="#E0E7FF" />
                                <Area type="monotone" dataKey="عمولة التطبيق" stackId="1" stroke="#F59E0B" fill="#FEF3C7" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Orders Count Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">عدد الطلبات الشهري</h2>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="عدد الطلبات" fill="#10B981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">سجل المدفوعات</h2>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                placeholder="بحث بالمنتج/الحالة/رقم الطلب"
                                className="border border-gray-300 rounded-lg py-2 px-4 text-right w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <select 
                                className="bg-gray-100 rounded-lg py-2 px-4 text-gray-700"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option>الكل</option>
                                <option>قيد المعالجة</option>
                                <option>مشحون</option>
                                <option>مستلم</option>
                                <option>ملغي</option>
                                <option>معلق</option>
                            </select>
                            {/* <button onClick={handleExportToExcel} className="bg-white text-gray-700 border border-gray-300 rounded-lg py-2 px-4 flex items-center hover:bg-gray-50">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 ml-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                تصدير
                            </button> */}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200 text-gray-500 text-sm font-medium uppercase">
                                    <th className="py-3 px-4 text-right">الإجراءات</th>
                                    <th className="py-3 px-4 text-right">الحالة</th>
                                    <th className="py-3 px-4 text-right">صافي التاجر</th>
                                    <th className="py-3 px-4 text-right">عمولة التطبيق</th>
                                    <th className="py-3 px-4 text-right">سعر الجملة</th>
                                    <th className="py-3 px-4 text-right">السعر المفرد</th>
                                    <th className="py-3 px-4 text-right">الكمية</th>
                                    <th className="py-3 px-4 text-right">اسم الزبون</th>
                                    <th className="py-3 px-4 text-right">تاريخ الطلب</th>
                                    <th className="py-3 px-4 text-right">رقم الطلب</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedOrders.map((order, index) => (
                                    <tr key={index} className="border-b last:border-b-0 border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-right relative">
                                            <button onClick={() => handleMoreClick(index)} className="text-gray-500 hover:text-gray-700">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                                </svg>
                                            </button>
                                            {isMoreModalOpen === index && (
                                                <div className="absolute bg-white shadow-lg rounded-lg mt-2 p-2 z-10 -mr-20 border">
                                                    <button onClick={() => handleViewDetails(order)} className="w-full text-right p-2 hover:bg-gray-100 rounded flex items-center justify-end">
                                                        عرض التفاصيل
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.577 3.01 9.964 7.822.08.361.08.736 0 1.097C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.577-3.01-9.964-7.822z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={handleExportToExcel} className="w-full text-right p-2 hover:bg-gray-100 rounded flex items-center justify-end">
                                                        تحميل التقرير
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={handleCloseMoreModal} className="w-full text-right p-2 hover:bg-gray-100 rounded text-red-500 flex items-center justify-end">
                                                        اغلاق
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <span className={`py-1 px-3 rounded-full text-xs font-semibold ${getStatusColors(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right font-bold text-green-600">{order.netMerchant.toLocaleString('ar-EG')} د.ع</td>
                                        <td className="py-3 px-4 text-right font-bold text-red-600">{order.appCommission.toLocaleString('ar-EG')} د.ع</td>
                                        <td className="py-3 px-4 text-right">{order.wholesalePrice.toLocaleString('ar-EG')} د.ع</td>
                                        <td className="py-3 px-4 text-right">{order.retailPrice.toLocaleString('ar-EG')} د.ع</td>
                                        <td className="py-3 px-4 text-right">{order.quantity.toLocaleString('ar-EG')}</td>
                                        <td className="py-3 px-4 text-right">{order.customerName}</td>
                                        <td className="py-3 px-4 text-right">{order.orderDate}</td>
                                        <td className="py-3 px-4 text-right font-bold">{order.orderNumber}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
                        <div className="flex items-center">
                            <span>عرض في الصفحة</span>
                            <select 
                                className="mx-2 bg-white border border-gray-300 rounded-lg p-1 text-sm"
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                            <span className="bg-red-500 text-white py-1 px-3 rounded-full">{currentPage}</span>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const pageNum = i + 1;
                                if (pageNum === currentPage) return null;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className="py-1 px-3 hover:bg-gray-200 rounded"
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                        <span>إجمالي الطلبات: {filteredOrders.length}</span>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {isDetailsModalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96 rtl:text-right max-h-96 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">تفاصيل الطلب</h3>
                            <button onClick={handleCloseDetailsModal} className="text-gray-400 hover:text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-500">رقم الطلب</span>
                                <span className="font-bold">{selectedOrder.orderNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">تاريخ الطلب</span>
                                <span className="font-bold">{selectedOrder.orderDate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">اسم الزبون</span>
                                <span className="font-bold">{selectedOrder.customerName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">حالة العملية</span>
                                <span className={`font-bold px-2 py-1 rounded-full text-xs ${getStatusColors(selectedOrder.status)}`}>
                                    {selectedOrder.status}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">سعر الجملة</span>
                                <span className="font-bold">{selectedOrder.wholesalePrice.toLocaleString('ar-EG')} د.ع</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">السعر المفرد</span>
                                <span className="font-bold">{selectedOrder.retailPrice.toLocaleString('ar-EG')} د.ع</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">الكمية</span>
                                <span className="font-bold">{selectedOrder.quantity.toLocaleString('ar-EG')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">نسبة عمولة التطبيق</span>
                                <span className="font-bold text-red-600">5%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">قيمة عمولة التطبيق</span>
                                <span className="font-bold text-red-600">{selectedOrder.appCommission.toLocaleString('ar-EG')} د.ع</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">صافي التاجر</span>
                                <span className="font-bold text-green-600">{selectedOrder.netMerchant.toLocaleString('ar-EG')} د.ع</span>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <button className="bg-white text-red-500 border border-red-500 py-2 px-4 rounded-lg w-full hover:bg-red-50">
                                تحميل إيصال العملية
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentsAndCashbackDashboard;