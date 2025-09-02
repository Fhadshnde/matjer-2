import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';

const monthlySalesData = [
  { name: 'يناير', uv: 50000, uv2: 80000 },
  { name: 'فبراير', uv: 100000, uv2: 120000 },
  { name: 'مارس', uv: 250000, uv2: 200000 },
  { name: 'أبريل', uv: 680000, uv2: 500000 },
  { name: 'مايو', uv: 200000, uv2: 300000 },
  { name: 'يونيو', uv: 850000, uv2: 700000 },
  { name: 'يوليو', uv: 200000, uv2: 400000 },
  { name: 'أغسطس', uv: 350000, uv2: 250000 },
  { name: 'سبتمبر', uv: 200000, uv2: 380000 },
  { name: 'أكتوبر', uv: 600000, uv2: 550000 },
  { name: 'نوفمبر', uv: 300000, uv2: 280000 },
  { name: 'ديسمبر', uv: 150000, uv2: 180000 },
];

const weeklyOrdersData = [
  { name: 'الأسبوع الرابع', total: 35000 },
  { name: 'الأسبوع الثالث', total: 23500 },
  { name: 'الأسبوع الثاني', total: 23251 },
  { name: 'الأسبوع الأول', total: 23251 },
];

const popularProducts = [
  {
    name: 'هاتف ذكي 128GB A15',
    visits: '١٢،٠٥٠',
    addToCart: '٠،٢٤٠',
    conversion: '8.6%',
    sales: '١،٠٧٠',
    stock: 45,
    img: 'https://via.placeholder.com/30'
  },
  {
    name: 'هاتف ذكي 128GB A15',
    visits: '١٢،٠٥٠',
    addToCart: '٠،٢٤٠',
    conversion: '8.6%',
    sales: '١،٠٧٠',
    stock: 45,
    img: 'https://via.placeholder.com/30'
  },
  {
    name: 'هاتف ذكي 128GB A15',
    visits: '١٢،٠٥٠',
    addToCart: '٠،٢٤٠',
    conversion: '8.6%',
    sales: '١،٠٧٠',
    stock: 45,
    img: 'https://via.placeholder.com/30'
  },
  {
    name: 'هاتف ذكي 128GB A15',
    visits: '١٢،٠٥٠',
    addToCart: '٠،٢٤٠',
    conversion: '8.6%',
    sales: '١،٠٧٠',
    stock: 45,
    img: 'https://via.placeholder.com/30'
  },
  {
    name: 'هاتف ذكي 128GB A15',
    visits: '١٢،٠٥٠',
    addToCart: '٠،٢٤٠',
    conversion: '8.6%',
    sales: '١،٠٧٠',
    stock: 45,
    img: 'https://via.placeholder.com/30'
  },
];

const barColors = ['#E41B26', '#30B538', '#FFC107', '#000000'];

const TotalOrdersTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const totalOrders = payload[0].value.toLocaleString();
    return (
      <div className="bg-white p-4 shadow-lg rounded-xl text-center font-sans text-sm">
        <p className="font-bold mb-2" style={{ direction: 'rtl' }}>{label}</p>
        <p style={{ direction: 'rtl' }}>إجمالي الطلبات: <span className="font-bold">{totalOrders}</span></p>
      </div>
    );
  }
  return null;
};

const SalesChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const uvValue = payload[0].value.toLocaleString();
    const uv2Value = payload[1]?.value.toLocaleString();
    return (
      <div className="bg-black text-white px-3 py-2 rounded-xl text-center font-sans text-sm" style={{ direction: 'rtl' }}>
        <p className="font-bold">القيمة: {uvValue}k</p>
        {uv2Value && <p className="font-bold">القيمة 2: {uv2Value}k</p>}
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

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8" style={{ direction: 'rtl' }}>
        <Card
          title="متوسط الطلب"
          value="156 د.ك"
          change="6%"
          isPositive={false}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          }
        />
        <Card
          title="عدد الزبائن"
          value="764 د.ك"
          change="5%"
          isPositive={true}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          }
        />
        <Card
          title="المبيعات الشهرية"
          value="8,500,00 د.ك"
          change="9%"
          isPositive={true}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-line-chart"><path d="M3 3v18h18"/><path d="m18 10-6 6-4-4L2 15"/></svg>
          }
        />
        <Card
          title="إجمالي الطلبات"
          value="1,234"
          change="2%"
          isPositive={true}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-days"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8" style={{ direction: 'rtl' }}>
        <div className="bg-white rounded-2xl shadow-md p-6 text-right">
          <h2 className="text-xl font-bold mb-4">حالة طلبات هذا الشهر</h2>
          <div className="flex justify-start items-center mb-4">
            <div className="flex flex-row-reverse space-x-2 space-x-reverse">
              <span className="text-sm font-semibold text-black">المبيعات</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyOrdersData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis type="number" orientation="right" axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'transparent' }} content={<TotalOrdersTooltip />} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Bar dataKey="total" barSize={50}>
                {
                  weeklyOrdersData.map((entry, index) => (
                    <Bar key={`bar-${index}`} fill={barColors[index % barColors.length]} />
                  ))
                }
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 text-right">
          <h2 className="text-xl font-bold mb-4">المبيعات</h2>
          <div className="flex justify-start items-center mb-4">
            <div className="flex space-x-2" dir="rtl">
              <button className="px-4 py-1 rounded-full text-sm font-semibold bg-red-500 text-white">شهر</button>
              <button className="px-4 py-1 rounded-full text-sm font-semibold text-gray-500">أسبوع</button>
              <button className="px-4 py-1 rounded-full text-sm font-semibold text-gray-500">يوم</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlySalesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorUv2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis orientation="right" axisLine={false} tickLine={false} />
              <Tooltip content={<SalesChartTooltip />} />
              <Area type="monotone" dataKey="uv" stroke="#ef4444" fillOpacity={1} fill="url(#colorUv)" />
              <Area type="monotone" dataKey="uv2" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUv2)" />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 text-right" style={{ direction: 'rtl' }}>
        <h2 className="text-xl font-bold mb-4">المنتجات الأكثر مبيعاً</h2>
        <div className="flex justify-start items-center mb-4">
          <div className="flex space-x-2" dir="rtl">
            <button className="px-4 py-1 rounded-full text-sm font-semibold bg-red-500 text-white">شهر</button>
            <button className="px-4 py-1 rounded-full text-sm font-semibold text-gray-500">أسبوع</button>
            <button className="px-4 py-1 rounded-full text-sm font-semibold text-gray-500">يوم</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="border-b">
              <tr>
                <th className="py-2 px-4 font-normal text-gray-500 text-right">
                  <div className="flex items-center justify-start">
                    <span>المنتج</span>
                  </div>
                </th>
                <th className="py-2 px-4 font-normal text-gray-500 text-right">
                  <div className="flex items-center justify-start">
                    <span>الزيارات</span>
                  </div>
                </th>
                <th className="py-2 px-4 font-normal text-gray-500 text-right">
                  <div className="flex items-center justify-start">
                    <span>الإضافة للسلة</span>
                  </div>
                </th>
                <th className="py-2 px-4 font-normal text-gray-500 text-right">
                  <div className="flex items-center justify-start">
                    <span>التحويل %</span>
                  </div>
                </th>
                <th className="py-2 px-4 font-normal text-gray-500 text-right">
                  <div className="flex items-center justify-start">
                    <span>المبيعات</span>
                  </div>
                </th>
                <th className="py-2 px-4 font-normal text-gray-500 text-right">
                  <div className="flex items-center justify-start">
                    <span>المخزون</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {popularProducts.map((product, index) => (
                <tr key={index} className="border-b">
                  <td className="py-4 px-4 flex items-center justify-start">
                    <span className="text-base font-semibold text-gray-800">{product.name}</span>
                    <img src={product.img} alt="product" className="h-8 w-8 ml-2 rounded-md" />
                  </td>
                  <td className="py-4 px-4 text-gray-700">{product.visits}</td>
                  <td className="py-4 px-4 text-gray-700">{product.addToCart}</td>
                  <td className="py-4 px-4 text-gray-700">{product.conversion}</td>
                  <td className="py-4 px-4 text-gray-700">{product.sales}</td>
                  <td className="py-4 px-4 text-gray-700">{product.stock}</td>
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

export default App;
