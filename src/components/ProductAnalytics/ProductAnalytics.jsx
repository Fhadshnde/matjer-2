import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

const statsCards = [
    { title: 'اجمالي المشاهدات', value: '2:45', growth: '+5% من الشهر الماضي', icon: 'time' },
    { title: 'اضافة للسلة', value: '6.5%', growth: '+0.2% من الشهر الماضي', icon: 'conversion' },
    { title: 'معدل التحويل ', value: '25,000', growth: '+3% من الشهر الماضي', icon: 'visitors' },
    { title: ' متوسط وقت المشاهدة', value: '7,500 د.ك', growth: '+10% من الشهر الماضي', icon: 'sales' },
    { title: ' المنتجات المهجورة', value: '1,500', growth: '+15% من الشهر الماضي', icon: 'daily-visitors' },
    { title: 'الزبائن المتتردون', value: '8,200', growth: '+10% من الشهر الماضي', icon: 'new-visitors' },
    // { title: 'متوسط الجلسة', value: '2:30', growth: '-2% من الشهر الماضي', icon: 'session-duration' },
    // { title: 'الزوار العائدون', value: '3,100', growth: '+7% من الشهر الماضي', icon: 'returning-visitors' },
];

const data = [
    { name: 'هاتف A15', views: 80, sales: 1500, color: '#000000' },
    { name: 'سماعة رأس', views: 70, sales: 1200, color: '#4CAF50' },
    { name: 'جهاز لوحي', views: 90, sales: 1800, color: '#FFEB3B' },
    { name: 'ساعة ذكية', views: 60, sales: 1400, color: '#F44336' },
];

const categoriesData = [
    { name: 'إلكترونيات', value: 65, color: '#2B61A4' },
    { name: 'منزل', value: 54, color: '#CC3A32' },
    { name: 'أزياء', value: 45, color: '#2B61A4' },
    { name: 'رياضة', value: 38, color: '#CC3A32' },
    { name: 'ملابس', value: 33, color: '#2B61A4' },
];

const mostVisitedProducts = [
    { name: 'هاتف ذكي A15 128GB', visits: '12,500', conversion: '4.2%', addedToCart: '200', sales: '15', quantity: '100' },
    { name: 'هاتف ذكي A15 128GB', visits: '12,500', conversion: '4.2%', addedToCart: '200', sales: '15', quantity: '100' },
    { name: 'هاتف ذكي A15 128GB', visits: '12,500', conversion: '4.2%', addedToCart: '200', sales: '15', quantity: '100' },
    { name: 'هاتف ذكي A15 128GB', visits: '12,500', conversion: '4.2%', addedToCart: '200', sales: '15', quantity: '100' },
    { name: 'هاتف ذكي A15 128GB', visits: '12,500', conversion: '4.2%', addedToCart: '200', sales: '15', quantity: '100' },
    { name: 'هاتف ذكي A15 128GB', visits: '12,500', conversion: '4.2%', addedToCart: '200', sales: '15', quantity: '100' },
    { name: 'هاتف ذكي A15 128GB', visits: '12,500', conversion: '4.2%', addedToCart: '200', sales: '15', quantity: '100' },
    { name: 'هاتف ذكي A15 128GB', visits: '12,500', conversion: '4.2%', addedToCart: '200', sales: '15', quantity: '100' },
    { name: 'هاتف ذكي A15 128GB', visits: '12,500', conversion: '4.2%', addedToCart: '200', sales: '15', quantity: '100' },
    { name: 'هاتف ذكي A15 128GB', visits: '12,500', conversion: '4.2%', addedToCart: '200', sales: '15', quantity: '100' },
];

const monthlyData = [
    { month: 'يناير', visits: 8500, sales: 500, purchases: 300, color: '#f56565' },
    { month: 'فبراير', visits: 7200, sales: 450, purchases: 280, color: '#48bb78' },
    { month: 'مارس', visits: 9100, sales: 600, purchases: 400, color: '#4299e1' },
    { month: 'أبريل', visits: 8322, sales: 550, purchases: 350, color: '#f6ad55' },
    { month: 'مايو', visits: 9500, sales: 620, purchases: 420, color: '#f56565' },
    { month: 'يونيو', visits: 8900, sales: 580, purchases: 380, color: '#48bb78' },
    { month: 'يوليو', visits: 7800, sales: 500, purchases: 320, color: '#4299e1' },
    { month: 'أغسطس', visits: 10200, sales: 700, purchases: 450, color: '#f6ad55' },
    { month: 'سبتمبر', visits: 9800, sales: 650, purchases: 410, color: '#f56565' },
    { month: 'أكتوبر', visits: 8700, sales: 580, purchases: 370, color: '#48bb78' },
    { month: 'نوفمبر', visits: 9300, sales: 610, purchases: 400, color: '#4299e1' },
    { month: 'ديسمبر', visits: 10500, sales: 720, purchases: 480, color: '#f6ad55' },
];

const funnelData = [
    { stage: 'زيارات المنتج', value: 250000, color: '#2b61a4' },
    { stage: 'الإضافة للسلة', value: 8200, color: '#cc3a32' },
    { stage: 'بدء الدفع', value: 2500, color: '#f6ad55' },
    { stage: 'شراء', value: 9540, color: '#48bb78' },
];

const userRegistrationData = [
    { month: 'يناير', 'المستخدمون المسجلون': 4000 },
    { month: 'فبراير', 'المستخدمون المسجلون': 3000 },
    { month: 'مارس', 'المستخدمون المسجلون': 5000 },
    { month: 'أبريل', 'المستخدمون المسجلون': 4500 },
    { month: 'مايو', 'المستخدمون المسجلون': 6000 },
    { month: 'يونيو', 'المستخدمون المسجلون': 5500 },
];

const sessionsData = [
    { month: 'يناير', 'عدد الجلسات': 100000 },
    { month: 'فبراير', 'عدد الجلسات': 120000 },
    { month: 'مارس', 'عدد الجلسات': 110000 },
    { month: 'أبريل', 'عدد الجلسات': 140000 },
    { month: 'مايو', 'عدد الجلسات': 130000 },
    { month: 'يونيو', 'عدد الجلسات': 150000 },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black text-white p-3 rounded-lg shadow-md text-right font-sans">
                <p className="font-bold">{`المنتج : ${label}`}</p>
                <p className="text-sm">{`مبيعات: ${payload[1].value}`}</p>
                <p className="text-sm">{`مشاهدة: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const TimelineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const visits = payload.find(p => p.dataKey === 'visits')?.value || 0;
        const sales = payload.find(p => p.dataKey === 'sales')?.value || 0;
        const purchases = payload.find(p => p.dataKey === 'purchases')?.value || 0;
        return (
            <div className="bg-white p-4 rounded-lg shadow-md text-right font-sans border-t-4 border-red-500">
                <p className="font-bold text-gray-800 text-lg mb-2">{label}</p>
                <div className="flex flex-col space-y-1">
                    <div className="flex justify-between items-center text-gray-700">
                        <span>الزيارات</span>
                        <span className="font-semibold text-right">{visits.toLocaleString('ar-EG')}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-700">
                        <span>السلة</span>
                        <span className="font-semibold text-right">{sales.toLocaleString('ar-EG')}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-700">
                        <span>المشتريات</span>
                        <span className="font-semibold text-right">{purchases.toLocaleString('ar-EG')}</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

const ProductAnalytics = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('شهر');

    return (
        <div className="bg-gray-100 p-4 min-h-screen rtl:text-right font-sans">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {statsCards.map((card, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-end">
                            <div className="bg-gray-100 p-3 rounded-full text-red-600 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
                            <p className="text-xl font-bold">{card.value}</p>
                            <span className="text-sm text-green-500">{card.growth}</span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">أداء المنتجات (الزيارات والمبيعات)</h2>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <span className="text-sm text-gray-500">من</span>
                                <input type="date" className="p-1 border rounded text-sm" />
                                <span className="text-sm text-gray-500">إلى</span>
                                <input type="date" className="p-1 border rounded text-sm" />
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar yAxisId="left" dataKey="views" fill="#8884d8" />
                                <Bar yAxisId="right" dataKey="sales" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">المبيعات والزيارات الشهرية</h2>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <span className="text-sm text-gray-500">من</span>
                                <input type="date" className="p-1 border rounded text-sm" />
                                <span className="text-sm text-gray-500">إلى</span>
                                <input type="date" className="p-1 border rounded text-sm" />
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip content={<TimelineTooltip />} />
                                <Area type="monotone" dataKey="visits" stroke="#8884d8" fill="#8884d8" />
                                <Area type="monotone" dataKey="sales" stroke="#82ca9d" fill="#82ca9d" />
                                <Area type="monotone" dataKey="purchases" stroke="#ffc658" fill="#ffc658" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">أفضل الفئات مبيعاً</h2>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <span className="text-sm text-gray-500">من</span>
                                <input type="date" className="p-1 border rounded text-sm" />
                                <span className="text-sm text-gray-500">إلى</span>
                                <input type="date" className="p-1 border rounded text-sm" />
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={categoriesData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" />
                                <Tooltip />
                                <Bar dataKey="value" barSize={20}>
                                    {categoriesData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-8">قمع التحويل (فتح المنتج + شراء)</h2>
                        <div className="space-y-4">
                            {funnelData.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="w-1/4 text-sm text-gray-700">{item.stage}</span>
                                    <div className="w-3/4 bg-gray-200 rounded-full h-4">
                                        <div className="h-4 rounded-full" style={{ width: `${(item.value / 250000) * 100}%`, backgroundColor: item.color }}></div>
                                    </div>
                                    <span className="ml-4 font-bold text-gray-900">{item.value.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">تسجيل المستخدمين</h2>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <span className="text-sm text-gray-500">من</span>
                                <input type="date" className="p-1 border rounded text-sm" />
                                <span className="text-sm text-gray-500">إلى</span>
                                <input type="date" className="p-1 border rounded text-sm" />
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={userRegistrationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="المستخدمون المسجلون" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">الجلسات الشهرية</h2>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <span className="text-sm text-gray-500">من</span>
                                <input type="date" className="p-1 border rounded text-sm" />
                                <span className="text-sm text-gray-500">إلى</span>
                                <input type="date" className="p-1 border rounded text-sm" />
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={sessionsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="عدد الجلسات" stroke="#82ca9d" fill="#82ca9d" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">المنتجات الأكثر مشاهدة</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 text-right">
                                <tr>
                                    <th className="py-3 px-4 font-semibold text-gray-500">المنتج</th>
                                    <th className="py-3 px-4 font-semibold text-gray-500">الزيارات</th>
                                    <th className="py-3 px-4 font-semibold text-gray-500">معدل التحويل</th>
                                    <th className="py-3 px-4 font-semibold text-gray-500">تمت الإضافة للسلة</th>
                                    <th className="py-3 px-4 font-semibold text-gray-500">المبيعات</th>
                                    <th className="py-3 px-4 font-semibold text-gray-500">الكمية</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-right">
                                {mostVisitedProducts.map((product, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="py-3 px-4 flex items-center flex-row-reverse text-right">
                                            <div className="bg-gray-200 flex items-center p-2 rounded-lg">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-right text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M5 22h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2zM7 2h10" />
                                                </svg>
                                            </div>
                                            <span className="mr-3">{product.name}</span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-700">{product.visits}</td>
                                        <td className="py-3 px-4 text-gray-700">{product.conversion}</td>
                                        <td className="py-3 px-4 text-gray-700">{product.addedToCart}</td>
                                        <td className="py-3 px-4 text-gray-700">{product.sales}</td>
                                        <td className="py-3 px-4 text-gray-700">{product.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductAnalytics;