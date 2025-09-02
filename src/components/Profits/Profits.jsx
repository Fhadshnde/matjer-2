import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// البيانات التجريبية لتقرير الأرباح الشهرية
const profitsData = [
    { name: 'يناير', 'إجمالي المبيعات': 30000, 'صافي الأرباح': 25000, 'عمولة التطبيق': 5000 },
    { name: 'فبراير', 'إجمالي المبيعات': 40000, 'صافي الأرباح': 32000, 'عمولة التطبيق': 8000 },
    { name: 'مارس', 'إجمالي المبيعات': 25000, 'صافي الأرباح': 20000, 'عمولة التطبيق': 5000 },
    { name: 'أبريل', 'إجمالي المبيعات': 50000, 'صافي الأرباح': 40000, 'عمولة التطبيق': 10000 },
    { name: 'مايو', 'إجمالي المبيعات': 60000, 'صافي الأرباح': 48000, 'عمولة التطبيق': 12000 },
    { name: 'يونيو', 'إجمالي المبيعات': 86000, 'صافي الأرباح': 70000, 'عمولة التطبيق': 16000 },
    { name: 'يوليو', 'إجمالي المبيعات': 70000, 'صافي الأرباح': 58000, 'عمولة التطبيق': 12000 },
    { name: 'أغسطس', 'إجمالي المبيعات': 55000, 'صافي الأرباح': 45000, 'عمولة التطبيق': 10000 },
    { name: 'سبتمبر', 'إجمالي المبيعات': 75000, 'صافي الأرباح': 60000, 'عمولة التطبيق': 15000 },
    { name: 'أكتوبر', 'إجمالي المبيعات': 65000, 'صافي الأرباح': 52000, 'عمولة التطبيق': 13000 },
    { name: 'نوفمبر', 'إجمالي المبيعات': 58000, 'صافي الأرباح': 46000, 'عمولة التطبيق': 12000 },
    { name: 'ديسمبر', 'إجمالي المبيعات': 90000, 'صافي الأرباح': 75000, 'عمولة التطبيق': 15000 },
];

// البيانات التجريبية للأرباح اليومية لآخر 30 يوم
const dailyProfitsData = [
    { day: '30', 'صافي الربح': 5000 },
    { day: '29', 'صافي الربح': 22000 },
    { day: '28', 'صافي الربح': 15000 },
    { day: '27', 'صافي الربح': 3500 },
    { day: '26', 'صافي الربح': 18000 },
    { day: '25', 'صافي الربح': 2000 },
    { day: '24', 'صافي الربح': 4000 },
    { day: '23', 'صافي الربح': 8000 },
    { day: '22', 'صافي الربح': 15000 },
    { day: '21', 'صافي الربح': 12000 },
    { day: '20', 'صافي الربح': 20000 },
    { day: '19', 'صافي الربح': 18000 },
    { day: '18', 'صافي الربح': 25000 },
    { day: '17', 'صافي الربح': 10000 },
    { day: '16', 'صافي الربح': 18000 },
    { day: '15', 'صافي الربح': 1000 }, // قيمة منخفضة لإظهار تأثير الخط
    { day: '14', 'صافي الربح': 16000 },
    { day: '13', 'صافي الربح': 10000 },
    { day: '12', 'صافي الربح': 14000 },
    { day: '11', 'صافي الربح': 8000 },
    { day: '10', 'صافي الربح': 12000 },
    { day: '9', 'صافي الربح': 10000 },
    { day: '8', 'صافي الربح': 6000 },
    { day: '7', 'صافي الربح': 25000 },
    { day: '6', 'صافي الربح': 10000 },
    { day: '5', 'صافي الربح': 14000 },
    { day: '4', 'صافي الربح': 12000 },
    { day: '3', 'صافي الربح': 18000 },
    { day: '2', 'صافي الربح': 20000 },
    { day: '1', 'صافي الربح': 12000 },
];

// Custom Tooltip for Line Chart
const CustomLineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-800 text-white p-3 rounded-lg text-right text-sm shadow-lg custom-tooltip">
                <p className="font-bold mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={`item-${index}`} style={{ color: entry.color }}>
                        {entry.name}: {entry.value.toLocaleString()} د.ك
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// Custom Tooltip for Bar Chart
const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-800 text-white p-3 rounded-lg text-right text-sm shadow-lg custom-tooltip">
                <p className="font-bold mb-1">يوم {label}</p>
                <p style={{ color: payload[0].color }}>
                    {payload[0].name}: {payload[0].value.toLocaleString()} د.ك
                </p>
            </div>
        );
    }
    return null;
};

const ReportsPage = () => {
    return (
        <div className="rtl:text-right font-sans bg-gray-100 min-h-screen p-6">
            <div className="container mx-auto">
                {/* قسم البطاقات الإحصائية */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">إجمالي المبيعات</p>
                            <h3 className="text-3xl font-bold">240.00 د.ك</h3>
                            <span className="text-xs text-green-500 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8L11 17" />
                                </svg>
                                8% عن الفترة السابقة
                            </span>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-full text-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">إجمالي الطلبات</p>
                            <h3 className="text-3xl font-bold">4,753</h3>
                            <span className="text-xs text-red-500 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8L11 7" />
                                </svg>
                                2% عن الفترة السابقة
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
                            <p className="text-sm text-gray-500 mb-1">صافي أرباحك</p>
                            <h3 className="text-3xl font-bold">180.00 د.ك</h3>
                            <span className="text-xs text-green-500 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8L11 17" />
                                </svg>
                                8% عن الفترة السابقة
                            </span>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-full text-green-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 14V9m0 0H7m2 0h2m0 0h2m-2 0V9m0 0h2m0 0h2m0 0V9M12 2a10 10 0 100 20 10 10 0 000-20z" />
                            </svg>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">عمولة تطبيق (25%)</p>
                            <h3 className="text-3xl font-bold">40.000 د.ك</h3>
                            <span className="text-xs text-green-500 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8L11 17" />
                                </svg>
                                8% عن الفترة السابقة
                            </span>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-full text-purple-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* تقرير الأرباح (AreaChart) */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">تقرير الأرباح</h2>
                        <div className="flex space-x-2">
                            <button className="flex items-center bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                تصدير
                            </button>
                            <div className="relative">
                                <select className="block appearance-none w-full bg-gray-100 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                                    <option>شهري</option>
                                    <option>سنوي</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828l-4.243-4.242L4.343 8z"/></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart data={profitsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#5EC3B0" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#5EC3B0" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#A0D8D8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#A0D8D8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis orientation="right" axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                                <Tooltip content={<CustomLineTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="إجمالي المبيعات"
                                    stroke="#FF6B6B"
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                    name="إجمالي المبيعات"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="صافي الأرباح"
                                    stroke="#5EC3B0"
                                    fillOpacity={1}
                                    fill="url(#colorProfit)"
                                    name="صافي الأرباح"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="عمولة التطبيق"
                                    stroke="#A0D8D8"
                                    fillOpacity={1}
                                    fill="url(#colorCommission)"
                                    name="عمولة التطبيق"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* الأرباح اليومية - آخر 30 يوم (Bar Chart) */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-bold mb-4">الأرباح اليومية - آخر 30 يوم</h2>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={dailyProfitsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                <YAxis orientation="right" axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                                <Tooltip content={<CustomBarTooltip />} />
                                <Bar dataKey="صافي الربح" fill="#FCA56E" name="صافي الربح" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* معلومات العمولة والتحويل */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-4">معلومات العمولة والتحويل</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h3 className="text-2xl font-bold mb-2">5,000 د.ك</h3>
                            <p className="text-sm text-gray-500">الحد الأدنى للتحويل والحسب</p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-lg shadow-md text-center">
                            <h3 className="text-2xl font-bold mb-2">مجانية</h3>
                            <p className="text-sm text-gray-500">رسوم التحويل</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg shadow-md text-center">
                            <h3 className="text-2xl font-bold mb-2">كل 15 يوم</h3>
                            <p className="text-sm text-gray-500">موعد التحويل</p>
                        </div>
                        <div className="bg-red-50 p-6 rounded-lg shadow-md text-center">
                            <h3 className="text-2xl font-bold mb-2">25%</h3>
                            <p className="text-sm text-gray-500">نسبة العمولة من كل عملية بيع</p>
                        </div>
                    </div>
                </div>

                {/* معلومة مهمة */}
                <div className="bg-blue-50 p-4 rounded-lg flex items-start space-x-3 rtl:space-x-reverse">
                    <div className="flex-shrink-0 text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-sm text-blue-700">
                        <span className="font-bold">معلومة مهمة</span><br />
                        يتم خصم عمولة التطبيق فقط عند إتمام الطلب بنجاح في حالة إلغاء الطلب، لا يتم خصم أي عمولة. مستحقاتك المتراكمة سيتم تحويلها إلى حسابك البنكي المسجل كل 15 من الشهر تلقائيًا.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;