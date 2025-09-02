import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Cell } from 'recharts';

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

const cityData = [
    { name: 'اسم المحافظة', value: 80, color: '#000000' },
    { name: 'اسم المحافظة', value: 70, color: '#4CAF50' },
    { name: 'اسم المحافظة', value: 90, color: '#FFEB3B' },
    { name: 'اسم المحافظة', value: 60, color: '#F44336' },
];

const categoryData = [
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

const funnelData = [
    { stage: 'زيارات المنتج', value: 250000, color: '#2b61a4' },
    { stage: 'الإضافة للسلة', value: 8200, color: '#cc3a32' },
    { stage: 'بدء الدفع', value: 2500, color: '#f6ad55' },
    { stage: 'شراء', value: 9540, color: '#48bb78' },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const valuePayload = payload.find(p => p.dataKey === 'value');
        return (
            <div className="bg-black text-white p-3 rounded-lg shadow-md text-right font-sans">
                <p className="font-bold">{`القيمة ${valuePayload.value}`}</p>
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
                        <span>زيارات</span>
                        <span className="font-semibold text-right">{visits.toLocaleString('ar-EG')}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-700">
                        <span>السلة</span>
                        <span className="font-semibold text-right">{sales.toLocaleString('ar-EG')}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-700">
                        <span>مشتريات</span>
                        <span className="font-semibold text-right">{purchases.toLocaleString('ar-EG')}</span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

const PaymentsAndCashbackDashboard = () => {
    const [activeTab, setActiveTab] = useState('شهر');
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
                        <h3 className="text-gray-500 text-sm font-medium">متوسط وقت المشاهدة</h3>
                        <p className="text-xl font-bold">2:45</p>
                        <span className="text-sm text-green-500">+5% من الشهر الماضي</span>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-end">
                        <div className="bg-gray-100 p-3 rounded-full text-red-600 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15.75M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15.75" />
                            </svg>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">معدل التحويل</h3>
                        <p className="text-xl font-bold">6.5%</p>
                        <span className="text-sm text-green-500">+0.2% من الشهر الماضي</span>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-end">
                        <div className="bg-gray-100 p-3 rounded-full text-red-600 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.155-4.7 3.197-7.168.204-.487.01-1.05-.51-1.243L11.21 2.446A1.125 1.125 0 009.976 2.25H7.5a3 3 0 00-3 3v1.5M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-2.25m-14.25 1.5v4.5m7.5-4.5v4.5m-6-13.5l8.657 5.25L10.5 21l-8.657-5.25" />
                            </svg>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">الإضافات للسلة</h3>
                        <p className="text-xl font-bold">533</p>
                        <span className="text-sm text-green-500">+4% من الشهر الماضي</span>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-end">
                        <div className="bg-gray-100 p-3 rounded-full text-red-600 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.577 3.01 9.964 7.822.08.361.08.736 0 1.097C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.577-3.01-9.964-7.822z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">إجمالي المشاهدات</h3>
                        <p className="text-xl font-bold">15,420</p>
                        <span className="text-sm text-green-500">+15% من الشهر الماضي</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">نشاط الزبائن حسب المحافظات</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={cityData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis scale="log" domain={[1, 'auto']} ticks={[500, 1500, 5000, 15000, 50000]} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="value" name="القيمة" fill="#8884d8">
                                    {cityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">اتجاه التفاعل عبر الزمن</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart
                                data={monthlyData.reverse()}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid horizontal={false} vertical={false} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} ticks={[0, 2500, 5000, 7500, 10000]} />
                                <Tooltip content={<TimelineTooltip />} />
                                <defs>
                                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#ec4899" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="visits"
                                    stroke="#ec4899"
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={{ r: 8, fill: '#ec4899', stroke: 'white', strokeWidth: 2 }}
                                    fill="url(#colorVisits)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">المنتجات الأكثر زيارة (والتحويل)</h2>
                            <div className="flex rounded-full bg-gray-200 p-1">
                                <button className="py-1 px-3 rounded-full text-gray-800 hover:bg-white transition-colors">يوم</button>
                                <button className="py-1 px-3 rounded-full text-gray-800 hover:bg-white transition-colors">أسبوع</button>
                                <button className="py-1 px-3 rounded-full bg-white text-red-600 shadow-sm transition-colors">شهر</button>
                            </div>
                        </div>
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
                                        <td className="py-3 px-4 flex items-center justify-end">
                                            <div className="bg-gray-200 flex items-center p-2 rounded-lg ml-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M5 22h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2zM7 2h10" />
                                                </svg>
                                            </div>
                                            <span className="text-sm font-medium">{product.name}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                            <div className="flex items-center">
                                <span>عرض في الصفحة</span>
                                <select className="mx-2 bg-white border border-gray-300 rounded-lg p-1 text-sm">
                                    <option>5</option>
                                    <option>10</option>
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
{/* 
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">أداء الفئات</h2>
                        <div className="space-y-4">
                            {categoryData.map((item, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                                        <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
                                    </div>
                                    <div className="bg-gray-200 rounded-full h-2.5">
                                        <div className="h-2.5 rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div> */}

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-8">قمع التحويل (فتح المنتج + شراء)</h2>
                    <div className="space-y-4">
                        {funnelData.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <span className="w-1/4 text-sm text-gray-700">{item.stage}</span>
                                <div className="w-3/4 bg-gray-200 rounded-full h-4">
                                    <div className="h-4 rounded-full" style={{ width: `${item.value / 2500}%`, backgroundColor: item.color }}></div>
                                </div>
                                <span className="ml-4 font-bold text-gray-900">{item.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentsAndCashbackDashboard;