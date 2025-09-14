import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { IoDownloadOutline, IoChevronDown, IoChevronUp, IoInformationCircleOutline } from 'react-icons/io5';

const baseURL = 'https://products-api.cbc-apps.net';
const token = localStorage.getItem('token');

const fetchAPI = async (endpoint) => {
  const response = await fetch(`${baseURL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  return response.json();
};

const formatNumber = (num) => {
  return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'IQD', minimumFractionDigits: 0 }).format(num);
};

// Custom Tooltip for Area Chart
const CustomLineTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-3 rounded-lg text-right text-sm shadow-lg custom-tooltip">
        <p className="font-bold mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {entry.name}: {formatNumber(entry.value)}
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
          {payload[0].name}: {formatNumber(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const ReportsPage = () => {
  const [overviewData, setOverviewData] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [overview, monthly, daily, payments] = await Promise.all([
          fetchAPI('/supplier/profits/overview'),
          fetchAPI('/supplier/profits/monthly'),
          fetchAPI('/supplier/profits/daily'),
          fetchAPI('/supplier/payments/reports')
        ]);
        setOverviewData(overview);
        setMonthlyData(monthly.monthlyReports);
        setDailyData(daily.dailyReports.filter(d => d.totalSales > 0));
        setPaymentHistory(payments.paymentHistory);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const commissionRate = overviewData.commissionRate || 25; // Use API value or default to 25% if not provided

  return (
    <div className="rtl:text-right font-sans bg-gray-100 min-h-screen p-6">
      <div className="container mx-auto">
        {/* قسم البطاقات الإحصائية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">إجمالي المبيعات</p>
              <h3 className="text-3xl font-bold">{formatNumber(overviewData.totalSales)}</h3>
              <span className={`text-xs flex items-center ${overviewData.profitsGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {overviewData.profitsGrowth >= 0 ? <IoChevronUp className="h-4 w-4 ml-1" /> : <IoChevronDown className="h-4 w-4 ml-1" />}
                {Math.abs(overviewData.profitsGrowth)}% عن الفترة السابقة
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
              <p className="text-sm text-gray-500 mb-1">إجمالي الطلبات المستلمة</p>
              <h3 className="text-3xl font-bold">{overviewData.totalOrders}</h3>
              <span className="text-xs text-red-500 flex items-center">
                <IoChevronDown className="h-4 w-4 ml-1" />
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
              <h3 className="text-3xl font-bold">{formatNumber(overviewData.netProfit)}</h3>
              <span className={`text-xs flex items-center ${overviewData.profitsGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {overviewData.profitsGrowth >= 0 ? <IoChevronUp className="h-4 w-4 ml-1" /> : <IoChevronDown className="h-4 w-4 ml-1" />}
                {Math.abs(overviewData.profitsGrowth)}% عن الفترة السابقة
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
              <p className="text-sm text-gray-500 mb-1">عمولة تطبيق ({commissionRate}%)</p>
              <h3 className="text-3xl font-bold">{formatNumber(overviewData.appCommission)}</h3>
              <span className={`text-xs flex items-center ${overviewData.profitsGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {overviewData.profitsGrowth >= 0 ? <IoChevronUp className="h-4 w-4 ml-1" /> : <IoChevronDown className="h-4 w-4 ml-1" />}
                {Math.abs(overviewData.profitsGrowth)}% عن الفترة السابقة
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
                <IoDownloadOutline className="h-5 w-5 ml-2" />
                تصدير
              </button>
              <div className="relative">
                <select className="block appearance-none w-full bg-gray-100 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                  <option>شهري</option>
                  <option>سنوي</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700">
                  <IoChevronDown className="fill-current h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis orientation="right" axisLine={false} tickLine={false} tickFormatter={(value) => `${(value / 1000).toLocaleString('ar-SA')}k`} />
                <Tooltip content={<CustomLineTooltip />} />
                <Area
                  type="monotone"
                  dataKey="totalSales"
                  stroke="#FF6B6B"
                  fillOpacity={1}
                  fill="url(#colorSales)"
                  name="إجمالي المبيعات"
                />
                <Area
                  type="monotone"
                  dataKey="netProfit"
                  stroke="#5EC3B0"
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                  name="صافي الأرباح"
                />
                <Area
                  type="monotone"
                  dataKey="appCommission"
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
              <BarChart data={dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis orientation="right" axisLine={false} tickLine={false} tickFormatter={(value) => `${(value / 1000).toLocaleString('ar-SA')}k`} />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="netProfit" fill="#FCA56E" name="صافي الربح" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* معلومات العمولة والتحويل */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">معلومات العمولة والتحويل</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-2xl font-bold mb-2">5,000د.ع</h3>
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
              <h3 className="text-2xl font-bold mb-2">{commissionRate}%</h3>
              <p className="text-sm text-gray-500">نسبة العمولة من كل عملية بيع</p>
            </div>
          </div>
        </div>

        {/* معلومة مهمة */}
        <div className="bg-blue-50 p-4 rounded-lg flex items-start space-x-3 rtl:space-x-reverse">
          <div className="flex-shrink-0 text-blue-500">
            <IoInformationCircleOutline className="h-6 w-6" />
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
