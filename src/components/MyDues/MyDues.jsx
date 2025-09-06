import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const data = [
    {
        name: 'يناير',
        'اجمالي المدفوعات': 200000,
        'اجمالي الكاش باك': 50000,
    },
    {
        name: 'فبراير',
        'اجمالي المدفوعات': 180000,
        'اجمالي الكاش باك': 45000,
    },
    {
        name: 'مارس',
        'اجمالي المدفوعات': 220000,
        'اجمالي الكاش باك': 55000,
    },
    {
        name: 'ابريل',
        'اجمالي المدفوعات': 190000,
        'اجمالي الكاش باك': 48000,
    },
    {
        name: 'مايو',
        'اجمالي المدفوعات': 250000,
        'اجمالي الكاش باك': 60000,
    },
    {
        name: 'يونيو',
        'اجمالي المدفوعات': 210000,
        'اجمالي الكاش باك': 52000,
    },
    {
        name: 'يوليو',
        'اجمالي المدفوعات': 230000,
        'اجمالي الكاش باك': 58000,
    },
];

const PaymentsAndCashbackDashboard = () => {
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isMoreModalOpen, setIsMoreModalOpen] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const handleExportClick = () => {
        setIsExportModalOpen(true);
    };

    const handleCloseExportModal = () => {
        setIsExportModalOpen(false);
    };

    const handleMoreClick = (orderIndex) => {
        setIsMoreModalOpen(orderIndex);
    };

    const handleCloseMoreModal = () => {
        setIsMoreModalOpen(null);
    };

    const handleViewDetails = () => {
        handleCloseMoreModal();
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
    };

    const ordersData = [
        {
            orderNumber: '#ORD-0321',
            orderDate: '2025-08-25',
            customerName: 'حسين عدنان',
            wholesalePrice: '10,000 د.ك',
            retailPrice: '12,000 د.ك',
            discount: '10',
            appCommission: '1,200 د.ك',
            netMerchant: '9,600 د.ك',
            status: 'محسوبة',
        },
        {
            orderNumber: '#ORD-0322',
            orderDate: '2025-08-26',
            customerName: 'علي كمال',
            wholesalePrice: '8,000 د.ك',
            retailPrice: '10,000 د.ك',
            discount: '5',
            appCommission: '800 د.ك',
            netMerchant: '7,200 د.ك',
            status: 'قيد الانتظار',
        },
        {
            orderNumber: '#ORD-0323',
            orderDate: '2025-08-27',
            customerName: 'فاطمة الزهراء',
            wholesalePrice: '15,000 د.ك',
            retailPrice: '18,000 د.ك',
            discount: '15',
            appCommission: '1,500 د.ك',
            netMerchant: '13,500 د.ك',
            status: 'مكتملة',
        },
        {
            orderNumber: '#ORD-0324',
            orderDate: '2025-08-28',
            customerName: 'محمد احمد',
            wholesalePrice: '6,000 د.ك',
            retailPrice: '7,500 د.ك',
            discount: '0',
            appCommission: '600 د.ك',
            netMerchant: '5,400 د.ك',
            status: 'ملغاة',
        },
        {
            orderNumber: '#ORD-0325',
            orderDate: '2025-08-29',
            customerName: 'زينب قاسم',
            wholesalePrice: '11,000 د.ك',
            retailPrice: '13,000 د.ك',
            discount: '12',
            appCommission: '1,100 د.ك',
            netMerchant: '9,900 د.ك',
            status: 'محسوبة',
        },
        {
            orderNumber: '#ORD-0326',
            orderDate: '2025-08-30',
            customerName: 'سارة خالد',
            wholesalePrice: '9,500 د.ك',
            retailPrice: '11,500 د.ك',
            discount: '8',
            appCommission: '950 د.ك',
            netMerchant: '8,550 د.ك',
            status: 'قيد الانتظار',
        },
        {
            orderNumber: '#ORD-0327',
            orderDate: '2025-08-31',
            customerName: 'احمد سالم',
            wholesalePrice: '14,000 د.ك',
            retailPrice: '16,500 د.ك',
            discount: '10',
            appCommission: '1,400 د.ك',
            netMerchant: '12,600 د.ك',
            status: 'مكتملة',
        },
    ];

    const getStatusColors = (status) => {
        switch (status) {
            case 'محسوبة':
                return 'bg-green-100 text-green-700';
            case 'قيد الانتظار':
                return 'bg-yellow-100 text-yellow-700';
            case 'مكتملة':
                return 'bg-blue-100 text-blue-700';
            case 'ملغاة':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="bg-gray-100 p-4 min-h-screen rtl:text-right font-sans">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-end">
                        <div className="bg-gray-100 p-3 rounded-full text-red-600 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">إجمالي المستحقات</h3>
                        <p className="text-xl font-bold">150,000 د.ك</p>
                        <span className="text-sm text-green-500">+8% من الفترة السابقة</span>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-end">
                        <div className="bg-gray-100 p-3 rounded-full text-red-600 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium"> صافي الارباح </h3>
                        <p className="text-xl font-bold">45,000 د.ك</p>
                        <span className="text-sm text-green-500">+8% من الفترة السابقة</span>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-end">
                        <div className="bg-gray-100 p-3 rounded-full text-red-600 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m-4.5-6H15m-4.5 0v3.75m-4.5-3.75V15M3 12h18M3 6h18M3 18h18" />
                            </svg>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">عدد الطلبات </h3>
                        <p className="text-xl font-bold">80 طلب</p>
                        <span className="text-sm text-green-500">+8% من الفترة السابقة</span>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-end">
                        <div className="bg-gray-100 p-3 rounded-full text-red-600 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" />
                            </svg>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium"> اعلى طلب</h3>
                        <p className="text-xl font-bold">12,000 د.ك</p>
                        <span className="text-sm text-green-500">+8% من الفترة السابقة</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">تقرير المدفوعات</h2>
                        <div className="flex space-x-2">
                            <button onClick={handleExportClick} className="bg-white text-gray-700 border border-gray-300 rounded-lg py-2 px-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 ml-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                تصدير
                            </button>
                            <select className="bg-gray-100 rounded-lg py-2 px-4 text-gray-700">
                                <option>شهري</option>
                                <option>أسبوعي</option>
                                <option>يومي</option>
                            </select>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart
                            data={data}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="اجمالي المدفوعات" stackId="1" stroke="#EF4444" fill="#FEE2E2" />
                            <Area type="monotone" dataKey="اجمالي الكاش باك" stackId="1" stroke="#8884d8" fill="#E0E7FF" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">سجل المدفوعات</h2>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                placeholder="بحث بالمنتج/الحالة"
                                className="border border-gray-300 rounded-lg py-2 px-4 text-right"
                            />
                            <select className="bg-gray-100 rounded-lg py-2 px-4 text-gray-700">
                                <option>الكل</option>
                            </select>
                            <button onClick={handleExportClick} className="bg-white text-gray-700 border border-gray-300 rounded-lg py-2 px-4 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 ml-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                تصدير
                            </button>
                        </div>
                    </div>

                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-200 text-gray-500 text-sm font-medium uppercase">
                                <th className="py-3 px-4 text-right">الإجراءات</th>
                                <th className="py-3 px-4 text-right">الحالة</th>
                                <th className="py-3 px-4 text-right">صافي التاجر</th>
                                <th className="py-3 px-4 text-right">عمولة التطبيق</th>
                                <th className="py-3 px-4 text-right">سعر الجملة</th>
                                <th className="py-3 px-4 text-right">السعر المفرد</th>
                                <th className="py-3 px-4 text-right">سعر الجملة</th>
                                <th className="py-3 px-4 text-right">اسم الزبون</th>
                                <th className="py-3 px-4 text-right">تاريخ الطلب</th>
                                <th className="py-3 px-4 text-right">رقم الطلب</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordersData.map((order, index) => (
                                <tr key={index} className="border-b last:border-b-0 border-gray-100">
                                    <td className="py-3 px-4 text-right">
                                        <button onClick={() => handleMoreClick(index)} className="text-gray-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                            </svg>
                                        </button>
                                        {isMoreModalOpen === index && (
                                            <div className="absolute bg-white shadow-lg rounded-lg mt-2 p-2 z-10 -mr-20">
                                                <button onClick={handleViewDetails} className="w-full text-right p-2 hover:bg-gray-100 rounded flex items-center justify-end">
                                                    عرض التفاصيل
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.577 3.01 9.964 7.822.08.361.08.736 0 1.097C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.577-3.01-9.964-7.822z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </button>
                                                <button onClick={handleExportClick} className="w-full text-right p-2 hover:bg-gray-100 rounded flex items-center justify-end">
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
                                    <td className="py-3 px-4 text-right">{order.netMerchant}</td>
                                    <td className="py-3 px-4 text-right">{order.appCommission}</td>
                                    <td className="py-3 px-4 text-right">{order.discount}</td>
                                    <td className="py-3 px-4 text-right">{order.retailPrice}</td>
                                    <td className="py-3 px-4 text-right">{order.wholesalePrice}</td>
                                    <td className="py-3 px-4 text-right">{order.customerName}</td>
                                    <td className="py-3 px-4 text-right">{order.orderDate}</td>
                                    <td className="py-3 px-4 text-right">{order.orderNumber}</td>
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
                        <span>إجمالي المنتجات: 8764</span>
                    </div>
                </div>
            </div>

            {isExportModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96 rtl:text-right">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">تصدير التقرير</h3>
                            <button onClick={handleCloseExportModal} className="text-gray-400 hover:text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">نوع التقرير</label>
                            <div className="flex items-center border border-gray-300 rounded-lg p-2">
                                <select className="block w-full bg-white pr-8">
                                    <option>pdf</option>
                                    <option>csv</option>
                                </select>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 transform rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button onClick={handleCloseExportModal} className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg">
                                الغاء
                            </button>
                            <button className="bg-red-500 text-white py-2 px-4 rounded-lg">
                                تصدير التقرير
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isDetailsModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96 rtl:text-right">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">بيانات العملية</h3>
                            <button onClick={handleCloseDetailsModal} className="text-gray-400 hover:text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-500">رقم الطلب</span>
                                <span className="font-bold">ORD-0321</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">تاريخ الطلب</span>
                                <span className="font-bold">2025-08-25، الساعة 10:45 صباحًا</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">اسم الزبون</span>
                                <span className="font-bold">حسين عدنان</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">وسيلة الدفع</span>
                                <span className="font-bold">visa</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">حالة العملية</span>
                                <span className="font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">محسوبة</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">سعر الجملة</span>
                                <span className="font-bold">10,000 د.ك</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">السعر المفرد</span>
                                <span className="font-bold">12,000 د.ك</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">الخصم</span>
                                <span className="font-bold">10%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">المبلغ بعد الخصم</span>
                                <span className="font-bold">10,800 د.ك</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">نسبة حصة التطبيق</span>
                                <span className="font-bold">2.5%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">قيمة عمولة التطبيق</span>
                                <span className="font-bold">1,080 د.ك</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">حصة التاجر</span>
                                <span className="font-bold">3,400 د.ك</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">صافي التاجر</span>
                                <span className="font-bold">9,720 د.ك</span>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <button className="bg-white text-red-500 border border-red-500 py-2 px-4 rounded-lg w-full">
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