import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

const baseURL = 'https://products-api.cbc-apps.net';

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
        const visitsPayload = payload.find(p => p.dataKey === 'visits');
        const salesPayload = payload.find(p => p.dataKey === 'sales');
        const purchasesPayload = payload.find(p => p.dataKey === 'purchases');

        const visits = visitsPayload?.value || 0;
        const sales = salesPayload?.value || 0;
        const purchases = purchasesPayload?.value || 0;

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [statsCards, setStatsCards] = useState([]);
    const [productPerformanceData, setProductPerformanceData] = useState([]);
    const [categoriesData, setCategoriesData] = useState([]);
    const [funnelData, setFunnelData] = useState([]);
    const [userRegistrationData, setUserRegistrationData] = useState([]);
    const [sessionsData, setSessionsData] = useState([]);
    const [mostVisitedProducts, setMostVisitedProducts] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found.');
                setLoading(false);
                return;
            }

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            try {
                const [tablesChartsRes, enhancedRes, salesOverTimeRes] = await Promise.all([
                    fetch(`${baseURL}/supplier/analytics/tables-charts`, { headers }),
                    fetch(`${baseURL}/supplier/analytics/enhanced`, { headers }),
                    fetch(`${baseURL}/supplier/sales/over-time`, { headers }),
                ]);

                if (!tablesChartsRes.ok || !enhancedRes.ok || !salesOverTimeRes.ok) {
                    throw new Error('Failed to fetch analytics data.');
                }

                const tablesCharts = await tablesChartsRes.json();
                const enhanced = await enhancedRes.json();
                const salesOverTime = await salesOverTimeRes.json();

                const newStatsCards = [
                    {
                        title: enhanced.cards.totalViews.title,
                        value: enhanced.cards.totalViews.value.toLocaleString(),
                        growth: enhanced.cards.totalViews.change,
                        icon: 'time',
                        trend: enhanced.cards.totalViews.trend,
                    },
                    {
                        title: enhanced.cards.addToCartRate.title,
                        value: enhanced.cards.addToCartRate.value,
                        growth: enhanced.cards.addToCartRate.change,
                        icon: 'conversion',
                        trend: enhanced.cards.addToCartRate.trend,
                    },
                    {
                        title: enhanced.cards.conversionRate.title,
                        value: enhanced.cards.conversionRate.value,
                        growth: enhanced.cards.conversionRate.change,
                        icon: 'visitors',
                        trend: enhanced.cards.conversionRate.trend,
                    },
                    {
                        title: enhanced.cards.avgViewTime.title,
                        value: enhanced.cards.avgViewTime.value,
                        growth: enhanced.cards.avgViewTime.change,
                        icon: 'sales',
                        trend: enhanced.cards.avgViewTime.trend,
                    },
                    {
                        title: enhanced.cards.abandonedProducts.title,
                        value: enhanced.cards.abandonedProducts.value.toLocaleString(),
                        growth: enhanced.cards.abandonedProducts.change,
                        icon: 'daily-visitors',
                        trend: enhanced.cards.abandonedProducts.trend,
                    },
                    {
                        title: enhanced.cards.hesitantCustomers.title,
                        value: enhanced.cards.hesitantCustomers.value.toLocaleString(),
                        growth: enhanced.cards.hesitantCustomers.change,
                        icon: 'new-visitors',
                        trend: enhanced.cards.hesitantCustomers.trend,
                    },
                ];
                setStatsCards(newStatsCards);

                const mappedProductPerformance = tablesCharts.charts.productPerformance.data.map(item => ({
                    name: item.productName,
                    views: item.visits,
                    sales: item.sales,
                }));
                setProductPerformanceData(mappedProductPerformance);

                const mappedCategories = tablesCharts.charts.bestSellingCategories.data.map((item, index) => ({
                    name: item.category,
                    value: item.sales,
                    color: index % 2 === 0 ? '#2B61A4' : '#CC3A32',
                }));
                setCategoriesData(mappedCategories);

                const mappedFunnel = tablesCharts.charts.conversionFunnel.data.map(item => ({
                    stage: item.stage,
                    value: item.value,
                    color: (() => {
                        switch (item.stage) {
                            case 'زيارة المنتج': return '#2b61a4';
                            case 'إضافة للسلة': return '#cc3a32';
                            case 'بدء الدفع': return '#f6ad55';
                            case 'شراء': return '#48bb78';
                            default: return '#ccc';
                        }
                    })(),
                }));
                setFunnelData(mappedFunnel);

                const mappedUserRegistrations = tablesCharts.charts.userRegistrations.data.map(item => ({
                    month: item.month,
                    'المستخدمون المسجلون': item.registrations,
                }));
                setUserRegistrationData(mappedUserRegistrations);

                const mappedSessions = tablesCharts.charts.monthlySessions.data.map(item => ({
                    month: item.month,
                    'عدد الجلسات': item.sessions,
                }));
                setSessionsData(mappedSessions);

                const mappedMostVisited = tablesCharts.mostViewedProductsTable.map(item => ({
                    name: item.name,
                    visits: item.views.toLocaleString(),
                    conversion: item.conversionRate,
                    addedToCart: 'N/A',
                    sales: item.sales,
                    quantity: 'N/A',
                }));
                setMostVisitedProducts(mappedMostVisited);

                const mappedSalesOverTime = salesOverTime.map(item => ({
                    month: item.name,
                    sales: item.value,
                    visits: tablesCharts.charts.monthlySessions.data.find(session => session.month === item.name)?.sessions || 0,
                    purchases: item.value / 1000,
                }));
                setMonthlyData(mappedSalesOverTime);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p>Loading analytics data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

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
                            <span className={`text-sm ${card.trend === 'up' ? 'text-green-500' : card.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>{card.growth}</span>
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
                            <BarChart data={productPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                                        <div className="h-4 rounded-full" style={{ width: `${(item.value / (funnelData[0]?.value || 1)) * 100}%`, backgroundColor: item.color }}></div>
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