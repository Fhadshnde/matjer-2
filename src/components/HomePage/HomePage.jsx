import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import axios from 'axios';
import { getApiUrl, getAuthHeaders, API_CONFIG } from '../../config/api';

const SalesChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const salesValue = payload[0].value.toLocaleString();
    return (
      <div className="bg-black text-white px-3 py-2 rounded-xl text-center font-sans text-sm" style={{ direction: 'rtl' }}>
        <p className="font-bold">المبيعات: {salesValue}</p>
      </div>
    );
  }
  return null;
};

const OrdersChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const ordersValue = payload.find(item => item.dataKey === 'orders')?.value.toLocaleString() || 'N/A';
    const salesValue = payload.find(item => item.dataKey === 'sales')?.value.toLocaleString() || 'N/A';
    const chartLabel = label;
    return (
      <div className="bg-black text-white px-3 py-2 rounded-xl text-center font-sans text-sm" style={{ direction: 'rtl' }}>
        <p className="font-bold">التاريخ: {chartLabel}</p>
        <p className="font-bold">الطلبات: {ordersValue}</p>
        <p className="font-bold">المبيعات: {salesValue}</p>
      </div>
    );
  }
  return null;
};

const Card = ({ title, value, change, isPositive, icon: Icon }) => (
  <div className="bg-white rounded-2xl shadow-md p-6 flex items-center space-x-4">
    <div className="flex-shrink-0 bg-gray-100 p-4 rounded-xl">
      {Icon}
    </div>
    <div className="flex-grow text-right">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold mt-1" style={{ direction: 'rtl' }}>{value}</div>
      <div className={`text-sm mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`} style={{ direction: 'rtl' }}>
        {isPositive ? '🔺' : '🔻'} {change} عن الفترة السابقة
      </div>
    </div>
  </div>
);

function HomePage() {
  const [products, setProducts] = useState([]);
  const [topCartProducts, setTopCartProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    averageOrder: 0,
    averageOrderChange: 0,
    totalCustomers: 0,
    customersChange: 0,
    monthlySales: 0,
    monthlySalesChange: 0,
    totalOrders: 0,
    ordersChange: 0,
    currentPeriod: 'جار التحميل...',
    previousPeriod: ''
  });
  const [salesChartData, setSalesChartData] = useState([]);
  const [ordersChartData, setOrdersChartData] = useState([]);
  const [chartPeriod, setChartPeriod] = useState('monthly');
  const [ordersChartPeriod, setOrdersChartPeriod] = useState('weekly');

  useEffect(()=> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage. Please log in.');
      return;
    }
    
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          getApiUrl(API_CONFIG.ENDPOINTS.DASHBOARD.TOP_PRODUCTS),
          { headers: getAuthHeaders() }
        );
        setProducts(response.data.topSellingProducts);
        setTopCartProducts(response.data.topCartProducts);
        setLowStockProducts(response.data.lowStockProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    fetchProducts();
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage. Please log in.');
      return;
    }

    const fetchChartsData = async () => {
      try {
        const response = await axios.get(
          getApiUrl(API_CONFIG.ENDPOINTS.DASHBOARD.CHARTS), 
          { headers: getAuthHeaders() }
        );

        let salesData = [];
        if (chartPeriod === 'monthly') {
          salesData = response.data.monthlySales.map(item => ({
            name: item.month,
            sales: item.sales
          }));
        } else if (chartPeriod === 'weekly') {
          salesData = response.data.weeklySales.map(item => ({
            name: item.week,
            sales: item.sales
          }));
        } else if (chartPeriod === 'daily') {
          salesData = response.data.dailySales.map(item => ({
            name: item.date,
            sales: item.sales
          }));
        }
        setSalesChartData(salesData);

        let ordersData = [];
        if (ordersChartPeriod === 'weekly') {
          ordersData = response.data.weeklySales.map(item => ({
            name: item.week,
            orders: item.orders,
            sales: item.sales
          }));
        } else if (ordersChartPeriod === 'daily') {
          ordersData = response.data.dailySales.map(item => ({
            name: item.date,
            orders: item.orders,
            sales: item.sales
          }));
        }
        setOrdersChartData(ordersData);

      } catch (error) {
        console.error('Error fetching charts data:', error);
      }
    };
    
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          getApiUrl(API_CONFIG.ENDPOINTS.DASHBOARD.OVERVIEW), 
          { headers: getAuthHeaders() }
        );
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchChartsData();
    fetchDashboardData();
  }, [chartPeriod, ordersChartPeriod]);

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8" style={{ direction: 'rtl' }}>
        <Card
          title="متوسط الطلب"
          value={`${dashboardData.averageOrder.toLocaleString()}د.ع`}
          change={`${Math.abs(dashboardData.averageOrderChange)}%`}
          isPositive={dashboardData.averageOrderChange >= 0}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          }
        />
        <Card
          title="عدد الزبائن"
          value={dashboardData.totalCustomers.toLocaleString()}
          change={`${Math.abs(dashboardData.customersChange)}%`}
          isPositive={dashboardData.customersChange >= 0}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucude-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          }
        />
        <Card
          title="المبيعات الشهرية"
          value={`${dashboardData.monthlySales.toLocaleString()}د.ع`}
          change={`${Math.abs(dashboardData.monthlySalesChange)}%`}
          isPositive={dashboardData.monthlySalesChange >= 0}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-line-chart"><path d="M3 3v18h18"/><path d="m18 10-6 6-4-4L2 15"/></svg>
          }
        />
        <Card
          title="إجمالي الطلبات"
          value={dashboardData.totalOrders.toLocaleString()}
          change={`${Math.abs(dashboardData.ordersChange)}%`}
          isPositive={dashboardData.ordersChange >= 0}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-days"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8" style={{ direction: 'rtl' }}>
        <div className="bg-white rounded-2xl shadow-md p-6 text-right">
          <h2 className="text-xl font-bold mb-4">المبيعات</h2>
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2" dir="rtl">
              <button onClick={() => setChartPeriod('monthly')} className={`px-4 py-1 rounded-full text-sm font-semibold ${chartPeriod === 'monthly' ? 'bg-red-500 text-white' : 'text-gray-500'}`}>شهر</button>
              <button onClick={() => setChartPeriod('weekly')} className={`px-4 py-1 rounded-full text-sm font-semibold ${chartPeriod === 'weekly' ? 'bg-red-500 text-white' : 'text-gray-500'}`}>أسبوع</button>
              <button onClick={() => setChartPeriod('daily')} className={`px-4 py-1 rounded-full text-sm font-semibold ${chartPeriod === 'daily' ? 'bg-red-500 text-white' : 'text-gray-500'}`}>يوم</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis orientation="right" axisLine={false} tickLine={false} />
              <Tooltip content={<SalesChartTooltip />} />
              <Area type="monotone" dataKey="sales" stroke="#ef4444" fillOpacity={1} fill="url(#colorSales)" />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 text-right">
          <h2 className="text-xl font-bold mb-4">حالة طلبات هذا الشهر</h2>
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2" dir="rtl">
              <button onClick={() => setOrdersChartPeriod('weekly')} className={`px-4 py-1 rounded-full text-sm font-semibold ${ordersChartPeriod === 'weekly' ? 'bg-red-500 text-white' : 'text-gray-500'}`}>أسبوعي</button>
              <button onClick={() => setOrdersChartPeriod('daily')} className={`px-4 py-1 rounded-full text-sm font-semibold ${ordersChartPeriod === 'daily' ? 'bg-red-500 text-white' : 'text-gray-500'}`}>يومي</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barCategoryGap="15%">
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis type="number" orientation="right" axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'transparent' }} content={<OrdersChartTooltip />} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Bar dataKey="orders" barSize={25} fill="#E41B26" />
              <Bar dataKey="sales" barSize={25} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 text-right mb-8" style={{ direction: 'rtl' }}>
        <h2 className="text-xl font-bold mb-4">المنتجات الأكثر مبيعاً</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="border-b">
              <tr>
                <th className="py-2 px-4 font-normal text-gray-500 text-right">المنتج</th>
                <th className="py-2 px-4 font-normal text-gray-500 text-right">الكمية المباعة</th>
                <th className="py-2 px-4 font-normal text-gray-500 text-right">الإيرادات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="py-4 px-4 flex items-center justify-start">
                    <span className="text-base font-semibold text-gray-800">{product.name}</span>
                    <img src={product.image || "https://via.placeholder.com/30"} alt="product" className="h-8 w-8 ml-2 rounded-md" />
                  </td>
                  <td className="py-4 px-4 text-gray-700">{product.soldQuantity}</td>
                  <td className="py-4 px-4 text-gray-700">{product.revenue.toLocaleString()} د.ع</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 text-right mb-8" style={{ direction: 'rtl' }}>
        <h2 className="text-xl font-bold mb-4">المنتجات الأكثر إضافةً إلى العربة</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="border-b">
              <tr>
                <th className="py-2 px-4 font-normal text-gray-500 text-right">المنتج</th>
                <th className="py-2 px-4 font-normal text-gray-500 text-right">عدد مرات الإضافة</th>
              </tr>
            </thead>
            <tbody>
              {topCartProducts.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="py-4 px-4 flex items-center justify-start">
                    <span className="text-base font-semibold text-gray-800">{product.name}</span>
                    <img src={product.image || "https://via.placeholder.com/30"} alt="product" className="h-8 w-8 ml-2 rounded-md" />
                  </td>
                  <td className="py-4 px-4 text-gray-700">{product.cartAdditions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 text-right" style={{ direction: 'rtl' }}>
        <h2 className="text-xl font-bold mb-4">المنتجات ذات المخزون المنخفض</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="border-b">
              <tr>
                <th className="py-2 px-4 font-normal text-gray-500 text-right">المنتج</th>
                <th className="py-2 px-4 font-normal text-gray-500 text-right">الكمية المتبقية</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="py-4 px-4 flex items-center justify-start">
                    <span className="text-base font-semibold text-gray-800">{product.name}</span>
                    <img src={product.image || "https://via.placeholder.com/30"} alt="product" className="h-8 w-8 ml-2 rounded-md" />
                  </td>
                  <td className="py-4 px-4 text-gray-700">{product.stockQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="text-gray-500 text-sm">إجمالي المنتجات: ٨٧٦٤</div>
          <div className="flex items-center space-x-1" dir="rtl">
            <button className="p-2 border rounded-md text-gray-500 hover:bg-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 6-6 6 6 6"/></svg>
            </button>
            <button className="p-2 border rounded-md text-white bg-red-500">1</button>
            <button className="p-2 border rounded-md text-gray-500 hover:bg-gray-200">2</button>
            <button className="p-2 border rounded-md text-gray-500 hover:bg-gray-200">3</button>
            <button className="p-2 border rounded-md text-gray-500 hover:bg-gray-200">4</button>
            <button className="p-2 border rounded-md text-gray-500 hover:bg-gray-200">5</button>
            <button className="p-2 border rounded-md text-gray-500 hover:bg-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
          <div className="text-gray-500 text-sm flex items-center">
            عرض في الصفحة 5
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down mr-1"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;