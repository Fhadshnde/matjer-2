// ConnectionSettings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaDollarSign,
  FaTruck,
  FaChartLine,
  FaArrowUp,
  FaUndo,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

const baseUrl = "https://products-api.cbc-apps.net";

// دالة لتنسيق الأرقام
const formatNumber = (v) =>
  typeof v === "number" ? v.toLocaleString("en-US") : v ?? "-";

export default function ConnectionSettings() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // نطاق التواريخ: آخر 7 أيام
  const today = new Date();
  const prior = new Date();
  prior.setDate(today.getDate() - 7);

  const [startDate, setStartDate] = useState(prior.toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(today.toISOString().slice(0, 10));

  // جلب البيانات من API
  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    setStats(null);

    try {
      const token = localStorage.getItem("token") || "";
      const res = await axios.get(`${baseUrl}/orders/supplier/statistics`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate, endDate },
        timeout: 15000,
      });
      setStats(res.data);
    } catch (err) {
      if (err.response) {
        setError(`خطأ من السيرفر: ${err.response.status}`);
      } else if (err.request) {
        setError("لا يوجد استجابة من الخادم.");
      } else {
        setError(`حدث خطأ: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        جاري تحميل البيانات...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  if (!stats)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        لا توجد بيانات
      </div>
    );

  // الكروت
  const cards = [
    {
      key: "totalAmount",
      title: "إجمالي المبلغ لكل الطلبات",
      value: stats.totalAmount,
      icon: <FaDollarSign />,
      color: "green",
    },
    {
      key: "totalDelivered",
      title: "إجمالي المبالغ للطلبات المستلمة",
      value: stats.totalDelivered,
      icon: <FaCheckCircle />,
      color: "teal",
    },
    {
      key: "totalReceived",
      title: "إجمالي صافي أرباح التاجر والمنصة",
      value: stats.totalReceived,
      icon: <FaDollarSign />,
      color: "cyan",
    },
    {
      key: "totalDelivery",
      title: "إجمالي التوصيل",
      value: stats.totalDelivery,
      icon: <FaTruck />,
      color: "blue",
    },
    {
      key: "platformNet",
      title: "صافي المنصة",
      value: stats.platformNet,
      icon: <FaChartLine />,
      color: "purple",
    },
    {
      key: "supplierNet",
      title: "صافي المورد",
      value: stats.supplierNet,
      icon: <FaArrowUp />,
      color: "orange",
    },
    {
      key: "totalReturns",
      title: "إجمالي المرتجعات",
      value: stats.totalReturns,
      icon: <FaUndo />,
      color: "red",
    },
    {
      key: "returnsCount",
      title: "عدد المرتجعات",
      value: stats.returnsCount,
      icon: <FaUndo />,
      color: "red",
    },
    {
      key: "deliveredCount",
      title: "عدد المسلّمات",
      value: stats.deliveredCount,
      icon: <FaCheckCircle />,
      color: "teal",
    },
    {
      key: "totalOutstanding",
      title: "إجمالي المستحق",
      value: stats.totalOutstanding,
      icon: <FaArrowUp />,
      color: "pink",
    },
    {
      key: "platformPercentage",
      title: "نسبة المنصة",
      value: (stats.platformPercentage * 100).toFixed(1) + "%",
      icon: <FaChartLine />,
      color: "indigo",
    },
    {
      key: "hasWholesalePrice",
      title: "البيع بالجملة",
      value: stats.hasWholesalePrice ? "نعم" : "لا",
      icon: <FaCheckCircle />,
      color: "gray",
    },
    {
      key: "lastUpdated",
      title: "آخر تحديث",
      value: new Date(stats.lastUpdated).toLocaleString(),
      icon: <FaClock />,
      color: "gray",
    },
  ];

  // بيانات PieChart
  const pieData = cards
    .filter((c) => typeof c.value === "number" && c.value > 0)
    .map((c) => ({ name: c.title, value: c.value }));

  const colors = [
    "#10B981",
    "#3B82F6",
    "#F59E0B",
    "#8B5CF6",
    "#EF4444",
    "#F87171",
    "#EC4899",
    "#0EA5E9",
    "#9333EA",
    "#F97316",
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6 font-['Tajawal']">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
          <h1 className="text-2xl font-semibold">لوحة إحصائيات المورد</h1>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1 border rounded"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1 border rounded"
            />
            <button
              onClick={fetchStats}
              className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
            >
              تحديث
            </button>
          </div>
        </header>

        {/* Cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {cards.map((c) => (
            <div
              key={c.key}
              className="bg-white p-4 rounded-xl shadow flex flex-col items-start gap-2 hover:scale-105 transition"
            >
              <div
                className={`text-white p-2 rounded-full`}
                style={{ backgroundColor: colors[cards.indexOf(c) % colors.length] }}
              >
                {c.icon}
              </div>
              <div className="text-gray-500 text-sm">{c.title}</div>
              <div className="text-lg font-semibold">{formatNumber(c.value)}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-2">توزيع القيم</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-2">تطور القيم</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={pieData.map((d) => ({ name: d.name, value: d.value }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#4F46E5"
                  fill="#C7D2FE"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
