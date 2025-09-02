import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
    { name: 'iPhone 15', views: 80, sales: 1500, color: '#000000' },
    { name: 'iPhone 15', views: 70, sales: 1200, color: '#4CAF50' },
    { name: 'iPhone 15', views: 90, sales: 1800, color: '#FFEB3B' },
    { name: 'iPhone 15', views: 60, sales: 1400, color: '#F44336' },
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

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black text-white p-3 rounded-lg shadow-md text-right font-sans">
                <p className="font-bold">{`المنتج : ${label}`}</p>
                <p className="text-sm">{`80 مبيعات`}</p>
                <p className="text-sm">{`1500 مشاهدة`}</p>
                <p className="text-sm">{`145 سلة`}</p>
            </div>
        );
    }

    return null;
};

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('شهر');
    const navigate = useNavigate();
    
    return (
        <div className="bg-gray-100 p-4 min-h-screen rtl:text-right font-sans">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* Stat Card 1 */}
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
                        <div className="flex flex-col">
                            <h3 className="text-gray-500 text-sm font-medium">متوسط وقت المشاهدة</h3>
                            <p className="text-xl font-bold">2:45</p>
                            <span className="text-sm text-green-500">+5% من الشهر الماضي</span>
                        </div>
                        <div className="bg-white p-3 rounded-full shadow-md text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
                        <div className="flex flex-col">
                            <h3 className="text-gray-500 text-sm font-medium">معدل التحويل</h3>
                            <p className="text-xl font-bold">6.5%</p>
                            <span className="text-sm text-green-500">+0.2% من الشهر الماضي</span>
                        </div>
                        <div className="bg-white p-3 rounded-full shadow-md text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
                        <div className="flex flex-col">
                            <h3 className="text-gray-500 text-sm font-medium">إضافات للسلة</h3>
                            <p className="text-xl font-bold">533</p>
                            <span className="text-sm text-green-500">+8% من الشهر الماضي</span>
                        </div>
                        <div className="bg-white p-3 rounded-full shadow-md text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.182 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Stat Card 4 */}
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
                        <div className="flex flex-col">
                            <h3 className="text-gray-500 text-sm font-medium">إجمالي المشاهدات</h3>
                            <p className="text-xl font-bold">15,420</p>
                            <span className="text-sm text-green-500">+15% من الشهر الماضي</span>
                        </div>
                        <div className="bg-white p-3 rounded-full shadow-md text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                    {/* Top Products Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">المنتجات الأعلى مشاهدة ومبيعات</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data}>
                                <XAxis dataKey="name" />
                                <YAxis yAxisId="left" orientation="left" stroke="#585858" />
                                <YAxis yAxisId="right" orientation="right" stroke="#d32f2f" />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar yAxisId="left" dataKey="views" name="مشاهدات">
                                    {
                                        data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))
                                    }
                                </Bar>
                                <Bar yAxisId="right" dataKey="sales" fill="#d32f2f" name="مبيعات" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    
                    {/* Category Performance Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">أداء الفئات</h2>
                            <div className="flex rounded-full bg-gray-200 p-1">
                                <button className="py-1 px-3 rounded-full text-gray-800 hover:bg-white transition-colors">يوم</button>
                                <button className="py-1 px-3 rounded-full text-gray-800 hover:bg-white transition-colors">أسبوع</button>
                                <button className="py-1 px-3 rounded-full bg-white text-red-600 shadow-sm transition-colors">شهر</button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {categoriesData.map((category, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-center text-sm mb-1">
                                        <span className="text-gray-700">{category.name}</span>
                                        <span className="font-bold text-gray-900">{category.value}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="h-2.5 rounded-full" style={{ width: `${category.value}%`, backgroundColor: category.color }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Most Visited Products Table */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">المنتجات الأكثر زيارة (والتحويل)</h2>
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-200 text-gray-500 text-sm font-medium uppercase">
                                <th className="py-3 px-4 text-right">الكمية</th>
                                <th className="py-3 px-4 text-right">المبيعات</th>
                                <th className="py-3 px-4 text-right">الإضافة للسلة</th>
                                <th className="py-3 px-4 text-right">التحويل %</th>
                                <th className="py-3 px-4 text-right">الزيارات</th>
                                <th className="py-3 px-4 text-right">المنتج</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mostVisitedProducts.map((product, index) => (
                                <tr key={index} className="border-b last:border-b-0 border-gray-100">
                                    <td className="py-3 px-4 text-right">{product.quantity}</td>
                                    <td className="py-3 px-4 text-right">{product.sales}</td>
                                    <td className="py-3 px-4 text-right">{product.addedToCart}</td>
                                    <td className="py-3 px-4 text-right">{product.conversion}</td>
                                    <td className="py-3 px-4 text-right">{product.visits}</td>
                                    <td className="py-3 px-4 flex items-center flex-row-reverse text-right">
                                        <div className="bg-gray-200 flex items-center p-2 rounded-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-right text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M5 22h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2zM7 2h10" />
                                            </svg>
                                        </div>
                                        <span className="mr-3">{product.name}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
