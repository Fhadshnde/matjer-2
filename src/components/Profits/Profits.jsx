import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { IoDownloadOutline, IoChevronDown, IoChevronUp, IoInformationCircleOutline, IoRefresh, IoFilter, IoCalendar, IoCash, IoTrendingUp, IoTrendingDown, IoEye, IoPrint, IoShareSocial, IoDocumentText, IoGrid, IoCloudDownload } from 'react-icons/io5';
import { getApiUrl, getAuthHeaders, API_CONFIG } from '../../config/api';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

const fetchAPI = async (endpoint) => {
  const response = await fetch(getApiUrl(endpoint), {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  return response.json();
};

const formatNumber = (num) => {
  return new Intl.NumberFormat({ style: 'currency', currency: 'IQD', minimumFractionDigits: 0 }).format(num);
};

const formatShortNumber = (num) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

// دوال التصدير الاحترافية
const exportToPDF = async (data, chartsRef) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // إضافة العنوان الرئيسي
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('تقرير الأرباح الشامل', pageWidth / 2, 20, { align: 'center' });

    // إضافة التاريخ
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    const currentDate = new Date().toLocaleDateString('ar-SA');
    pdf.text(`تاريخ التقرير: ${currentDate}`, pageWidth / 2, 30, { align: 'center' });

    let yPosition = 40;

    // إضافة ملخص البيانات
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ملخص البيانات', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`إجمالي المبيعات: ${formatNumber(data.overview?.totalSales || 0)}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`إجمالي الطلبات: ${data.overview?.totalOrders || 0}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`صافي الأرباح: ${formatNumber(data.overview?.netProfit || 0)}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`عمولة التطبيق: ${formatNumber(data.overview?.appCommission || 0)}`, 20, yPosition);
    yPosition += 15;

    // إضافة جدول البيانات الشهرية
    if (data.monthly && data.monthly.length > 0) {
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('البيانات الشهرية', 20, yPosition);
      yPosition += 10;

      // رؤوس الجدول
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('الشهر', 20, yPosition);
      pdf.text('إجمالي المبيعات', 60, yPosition);
      pdf.text('صافي الأرباح', 100, yPosition);
      pdf.text('عمولة التطبيق', 140, yPosition);
      pdf.text('الطلبات', 180, yPosition);
      yPosition += 8;

      // خط تحت الرؤوس
      pdf.line(20, yPosition, 200, yPosition);
      yPosition += 5;

      // بيانات الجدول
      pdf.setFont('helvetica', 'normal');
      data.monthly.forEach((item, index) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.text(item.month || `الشهر ${index + 1}`, 20, yPosition);
        pdf.text(formatNumber(item.totalSales || 0), 60, yPosition);
        pdf.text(formatNumber(item.netProfit || 0), 100, yPosition);
        pdf.text(formatNumber(item.appCommission || 0), 140, yPosition);
        pdf.text((item.orders || 0).toString(), 180, yPosition);
        yPosition += 6;
      });
    }

    // إضافة الرسوم البيانية
    if (chartsRef.current) {
      const canvas = await html2canvas(chartsRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (yPosition + imgHeight > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
    }

    // إضافة تذييل
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.text('تم إنشاء هذا التقرير تلقائياً من نظام إدارة الموردين', pageWidth / 2, pageHeight - 10, { align: 'center' });

    pdf.save(`تقرير_الأرباح_${currentDate.replace(/\//g, '_')}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('فشل في إنشاء ملف PDF');
  }
};

const exportToExcel = (data) => {
  try {
    const workbook = XLSX.utils.book_new();

    // ورقة ملخص البيانات
    const summaryData = [
      ['المؤشر', 'القيمة'],
      ['إجمالي المبيعات', data.overview?.totalSales || 0],
      ['إجمالي الطلبات', data.overview?.totalOrders || 0],
      ['صافي الأرباح', data.overview?.netProfit || 0],
      ['عمولة التطبيق', data.overview?.appCommission || 0],
      ['نسبة النمو', `${data.overview?.profitsGrowth || 0}%`],
      ['تاريخ التقرير', new Date().toLocaleDateString('ar-SA')]
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'ملخص البيانات');

    // ورقة البيانات الشهرية
    if (data.monthly && data.monthly.length > 0) {
      const monthlyHeaders = ['الشهر', 'إجمالي المبيعات', 'صافي الأرباح', 'عمولة التطبيق', 'عدد الطلبات'];
      const monthlyData = data.monthly.map(item => [
        item.month || '',
        item.totalSales || 0,
        item.netProfit || 0,
        item.appCommission || 0,
        item.orders || 0
      ]);

      const monthlySheetData = [monthlyHeaders, ...monthlyData];
      const monthlySheet = XLSX.utils.aoa_to_sheet(monthlySheetData);
      XLSX.utils.book_append_sheet(workbook, monthlySheet, 'البيانات الشهرية');
    }

    // ورقة البيانات اليومية
    if (data.daily && data.daily.length > 0) {
      const dailyHeaders = ['التاريخ', 'صافي الربح', 'إجمالي المبيعات', 'عدد الطلبات'];
      const dailyData = data.daily.map(item => [
        item.date || '',
        item.netProfit || 0,
        item.totalSales || 0,
        item.orders || 0
      ]);

      const dailySheetData = [dailyHeaders, ...dailyData];
      const dailySheet = XLSX.utils.aoa_to_sheet(dailySheetData);
      XLSX.utils.book_append_sheet(workbook, dailySheet, 'البيانات اليومية');
    }

    // ورقة سجل المدفوعات
    if (data.payments && data.payments.length > 0) {
      const paymentHeaders = ['التاريخ', 'المبلغ', 'الطريقة', 'الحالة'];
      const paymentData = data.payments.map(item => [
        item.date || '',
        item.amount || 0,
        item.method || '',
        item.status === 'completed' ? 'مكتمل' :
          item.status === 'pending' ? 'معلق' : 'فشل'
      ]);

      const paymentSheetData = [paymentHeaders, ...paymentData];
      const paymentSheet = XLSX.utils.aoa_to_sheet(paymentSheetData);
      XLSX.utils.book_append_sheet(workbook, paymentSheet, 'سجل المدفوعات');
    }

    // حفظ الملف
    const currentDate = new Date().toLocaleDateString('ar-SA').replace(/\//g, '_');
    XLSX.writeFile(workbook, `تقرير_الأرباح_${currentDate}.xlsx`);
  } catch (error) {
    console.error('Error generating Excel:', error);
    throw new Error('فشل في إنشاء ملف Excel');
  }
};

const exportToCSV = (data) => {
  try {
    const currentDate = new Date().toLocaleDateString('ar-SA').replace(/\//g, '_');

    // CSV للملخص
    const summaryCSV = [
      'المؤشر,القيمة',
      `إجمالي المبيعات,${data.overview?.totalSales || 0}`,
      `إجمالي الطلبات,${data.overview?.totalOrders || 0}`,
      `صافي الأرباح,${data.overview?.netProfit || 0}`,
      `عمولة التطبيق,${data.overview?.appCommission || 0}`,
      `نسبة النمو,${data.overview?.profitsGrowth || 0}%`,
      `تاريخ التقرير,${new Date().toLocaleDateString('ar-SA')}`
    ].join('\n');

    // تحميل ملف CSV
    const blob = new Blob([summaryCSV], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ملخص_الأرباح_${currentDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error generating CSV:', error);
    throw new Error('فشل في إنشاء ملف CSV');
  }
};

const printReport = () => {
  try {
    window.print();
  } catch (error) {
    console.error('Error printing:', error);
    throw new Error('فشل في الطباعة');
  }
};

// Custom Tooltip for Area Chart
const CustomLineTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-4 rounded-lg text-right text-sm shadow-lg border border-gray-600">
        <p className="font-bold mb-2 text-lg">{label}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between mb-1">
            <span style={{ color: entry.color }} className="font-semibold">
              {entry.name}:
            </span>
            <span className="text-white font-bold">
              {formatNumber(entry.value)}
            </span>
          </div>
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
      <div className="bg-gray-800 text-white p-4 rounded-lg text-right text-sm shadow-lg border border-gray-600">
        <p className="font-bold mb-2 text-lg">يوم {label}</p>
        <div className="flex items-center justify-between">
          <span style={{ color: payload[0].color }} className="font-semibold">
            {payload[0].name}:
          </span>
          <span className="text-white font-bold">
            {formatNumber(payload[0].value)}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Pie Chart
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-4 rounded-lg text-right text-sm shadow-lg border border-gray-600">
        <p className="font-bold mb-2">{payload[0].name}</p>
        <p className="text-white font-bold">{formatNumber(payload[0].value)}</p>
        <p className="text-gray-300">({payload[0].payload.percentage}%)</p>
      </div>
    );
  }
  return null;
};

// Stat Card Component
const StatCard = ({ title, value, change, icon, color, trend, details }) => {
  const isPositive = change >= 0;
  const trendIcon =
    trend === "up" ? (
      <IoTrendingUp className="h-4 w-4" />
    ) : (
      <IoTrendingDown className="h-4 w-4" />
    );

  return (
    <div className="bg-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 min-h-[110px] flex">
      <div className="flex items-center justify-between w-full">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-1 font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{formatNumber(value)}</h3>
          <div
            className={`flex items-center text-sm ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {trendIcon}
            <span className="mr-1 font-semibold">{Math.abs(change)}%</span>
            <span className="text-gray-500">عن الفترة السابقة</span>
          </div>
          {details && <p className="text-xs text-gray-400 mt-1">{details}</p>}
        </div>
        <div className={`p-3 rounded-full ${color} text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
};


// Filter Component
const FilterComponent = ({ onFilterChange, currentFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const filters = [
    { value: 'monthly', label: 'شهري', icon: <IoCalendar className="w-4 h-4" /> },
    { value: 'yearly', label: 'سنوي', icon: <IoCalendar className="w-4 h-4" /> },
    { value: 'daily', label: 'يومي', icon: <IoCalendar className="w-4 h-4" /> },
    { value: 'weekly', label: 'أسبوعي', icon: <IoCalendar className="w-4 h-4" /> }
  ];

  const currentFilterLabel = filters.find(f => f.value === currentFilter)?.label || 'شهري';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-white text-gray-700 font-semibold py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
      >
        <IoFilter className="h-5 w-5 ml-2" />
        {currentFilterLabel}
        <IoChevronDown className="h-4 w-4 mr-2" />
      </button>
      {isOpen && (
        <div className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="py-1">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => {
                  onFilterChange(filter.value);
                  setIsOpen(false);
                }}
                className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {filter.icon}
                <span className="mr-2">{filter.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Export Component
const ExportComponent = ({ onExport, isExporting }) => {
  const [isOpen, setIsOpen] = useState(false);
  const exportOptions = [
    { value: 'pdf', label: 'PDF', icon: <IoDocumentText className="w-4 h-4" />, description: 'تقرير شامل مع الرسوم البيانية' },
    { value: 'excel', label: 'Excel', icon: <IoGrid className="w-4 h-4" />, description: 'بيانات مفصلة في جداول' },
    { value: 'csv', label: 'CSV', icon: <IoCloudDownload className="w-4 h-4" />, description: 'ملف بيانات بسيط' },
    { value: 'print', label: 'طباعة', icon: <IoPrint className="w-4 h-4" />, description: 'طباعة مباشرة' }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="flex items-center bg-red-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
        ) : (
          <IoDownloadOutline className="h-5 w-5 ml-2" />
        )}
        {isExporting ? 'جاري التصدير...' : 'تصدير'}
        <IoChevronDown className="h-4 w-4 mr-2" />
      </button>
      {isOpen && (
        <div className="absolute right-0 z-10 w-64 mt-2 origin-top-right bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="py-2">
            <div className="px-4 py-2 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">خيارات التصدير</h3>
              <p className="text-xs text-gray-500">اختر نوع التقرير المطلوب</p>
            </div>
            {exportOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onExport(option.value);
                  setIsOpen(false);
                }}
                disabled={isExporting}
                className="flex items-center w-full text-right px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center flex-1">
                  <div className="text-gray-400 ml-3">{option.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Payment History Table Component
const PaymentHistoryTable = ({ payments, loading }) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg text-center">
        <IoCash className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">لا توجد مدفوعات بعد</p>
        <p className="text-gray-400 text-sm">ستظهر المدفوعات هنا عند توفرها</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">سجل المدفوعات</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-gray-500 font-semibold">تاريخ الاستحقاق</th>
              <th className="py-3 px-4 text-gray-500 font-semibold">تاريخ الدفع</th>
              <th className="py-3 px-4 text-gray-500 font-semibold">المبلغ</th>
              {/* <th className="py-3 px-4 text-gray-500 font-semibold">الطريقة</th> */}
              <th className="py-3 px-4 text-gray-500 font-semibold">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-700">{payment.dueDate.split('T')[0]}</td>
                <td className="py-3 px-4 text-gray-700">
                  {payment.paidDate?.split("T")[0] || "—"}
                </td>
                <td className="py-3 px-4 text-gray-900 font-semibold">{formatNumber(payment.amount)}</td>
                {/* <td className="py-3 px-4 text-gray-700">{payment.method}</td> */}
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${payment.status === 'PAID'
                    ? 'bg-green-100 text-green-700'
                    : payment.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-400 '
                    }`}>
                    {payment.status === 'PAID' ? 'مكتمل' :
                      payment.status === 'pending' ? 'معلق' : 'قيد المعالجة'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProfitsPage = () => {
  const [overviewData, setOverviewData] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('monthly');
  const [refreshing, setRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);
  const [exportSuccess, setExportSuccess] = useState(false);
  const chartsRef = useRef(null);

  const fetchAllData = async () => {
    try {
      setRefreshing(true);
      const [overview, monthly, daily, payments] = await Promise.all([
        fetchAPI('/supplier/profits/overview'),
        fetchAPI('/supplier/profits/monthly'),
        fetchAPI('/supplier/profits/daily'),
        fetchAPI('/supplier/payments/reports')
      ]);

      setOverviewData(overview);
      setMonthlyData(monthly.monthlyReports || []);
      setDailyData(daily.dailyReports?.filter(d => d.totalSales > 0) || []);
      setPaymentHistory(payments.paymentHistory || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
    // يمكن إضافة منطق فلترة إضافي هنا
  };

  const handleExport = async (format) => {
    try {
      setIsExporting(true);
      setExportError(null);
      setExportSuccess(false);

      const data = {
        overview: overviewData,
        monthly: monthlyData,
        daily: dailyData,
        payments: paymentHistory
      };

      switch (format) {
        case 'pdf':
          await exportToPDF(data, chartsRef);
          break;
        case 'excel':
          exportToExcel(data);
          break;
        case 'csv':
          exportToCSV(data);
          break;
        case 'print':
          printReport();
          break;
        default:
          throw new Error('نوع التصدير غير مدعوم');
      }

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('Export error:', error);
      setExportError(error.message);
      setTimeout(() => setExportError(null), 5000);
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefresh = () => {
    fetchAllData();
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل بيانات الأرباح...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-xl mb-4">حدث خطأ في تحميل البيانات</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  const commissionRate = overviewData?.commissionRate || 15;

  // إضافة بيانات وهمية للعرض إذا كانت البيانات فارغة
  const hasData = overviewData?.totalSales > 0;

  // إعداد بيانات الرسم البياني
  const chartData = hasData ? monthlyData : [
    { month: 'يناير', totalSales: 0, netProfit: 0, appCommission: 0, orders: 0 },
    { month: 'فبراير', totalSales: 0, netProfit: 0, appCommission: 0, orders: 0 },
    { month: 'مارس', totalSales: 0, netProfit: 0, appCommission: 0, orders: 0 },
    { month: 'أبريل', totalSales: 0, netProfit: 0, appCommission: 0, orders: 0 },
    { month: 'مايو', totalSales: 0, netProfit: 0, appCommission: 0, orders: 0 },
    { month: 'يونيو', totalSales: 0, netProfit: 0, appCommission: 0, orders: 0 },
    { month: 'يوليو', totalSales: 0, netProfit: 0, appCommission: 0, orders: 0 },
    { month: 'أغسطس', totalSales: 0, netProfit: 0, appCommission: 0, orders: 0 },
    { month: 'سبتمبر', totalSales: 0, netProfit: 0, appCommission: 0, orders: 0 },
    { month: 'أكتوبر', totalSales: 0, netProfit: 0, appCommission: 0, orders: 0 },
    { month: 'نوفمبر', totalSales: 0, netProfit: 0, appCommission: 0, orders: 0 },
    { month: 'ديسمبر', totalSales: 0, netProfit: 0, appCommission: 0, orders: 0 }
  ];

  // إعداد بيانات الرسم البياني الدائري
  const pieData = hasData ? [
    { name: 'صافي الأرباح', value: overviewData?.netProfit || 0, color: '#10B981', percentage: 85 },
    { name: 'عمولة التطبيق', value: overviewData?.appCommission || 0, color: '#F59E0B', percentage: 15 }
  ] : [
    { name: 'صافي الأرباح', value: 0, color: '#10B981', percentage: 85 },
    { name: 'عمولة التطبيق', value: 0, color: '#F59E0B', percentage: 15 }
  ];

  return (
    <>
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-break {
            page-break-before: always;
          }
          body {
            background: white !important;
          }
          .bg-gray-100 {
            background: white !important;
          }
          .shadow-lg {
            box-shadow: none !important;
          }
        }
      `}</style>
      <div className="rtl:text-right font-sans bg-gray-100 min-h-screen p-6">
        <div className="container mx-auto max-w-7xl">
          {/* رسائل التصدير */}
          {exportSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              تم تصدير التقرير بنجاح
            </div>
          )}
          {exportError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {exportError}
            </div>
          )}

          {/* Header */}
          <div className="flex justify-end items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">تقرير الأرباح</h1>
              <p className="text-gray-600">مراقبة وتحليل أداء المبيعات والأرباح</p>
            </div>
          </div>

          {/* قسم البطاقات الإحصائية */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">


            <StatCard
              title={`عمولة التطبيق (${commissionRate}%)`}
              value={overviewData?.appCommission || 0}
              change={overviewData?.profitsGrowth || 0}
              icon={<IoTrendingDown className="h-6 w-6" />}
              color="bg-purple-500"
              trend={overviewData?.profitsGrowth >= 0 ? 'up' : 'down'}
              details="من كل عملية بيع"
            />
            <StatCard
              title="صافي الأرباح"
              value={overviewData?.netProfit || 0}
              change={overviewData?.profitsGrowth || 0}
              icon={<IoTrendingUp className="h-6 w-6" />}
              color="bg-emerald-500"
              trend={overviewData?.profitsGrowth >= 0 ? 'up' : 'down'}
              details="بعد خصم العمولة"
            />
            <StatCard
              title="إجمالي المبيعات"
              value={overviewData?.totalSales || 0}
              change={overviewData?.profitsGrowth || 0}
              icon={<IoCash className="h-6 w-6" />}
              color="bg-blue-500"
              trend={overviewData?.profitsGrowth >= 0 ? 'up' : 'down'}
              details="جميع المبيعات المكتملة"
            />
            <StatCard
              title="إجمالي الطلبات"
              value={overviewData?.totalOrders || 0}
              change={-2}
              icon={<IoEye className="h- w-6" />}
              color="bg-green-500"
              trend="down"
              details="الطلبات المستلمة"
            />
          </div>

          {/* تقرير الأرباح (AreaChart)
          <div ref={chartsRef} className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">تقرير الأرباح الشهري</h2>
              <div className="flex items-center space-x-4 space-x-reverse">
                <span className="text-sm text-gray-500">آخر 12 شهر</span>
              </div>
            </div>
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                  />
                  <YAxis
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => formatShortNumber(value)}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                  />
                  <Tooltip content={<CustomLineTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="totalSales"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                    name="إجمالي المبيعات"
                  />
                  <Area
                    type="monotone"
                    dataKey="netProfit"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorProfit)"
                    name="صافي الأرباح"
                  />
                  <Area
                    type="monotone"
                    dataKey="appCommission"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCommission)"
                    name="عمولة التطبيق"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div> */}

          {/* الأرباح اليومية والتحليل */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* الأرباح اليومية */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6">الأرباح اليومية - آخر 30 يوم</h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#6B7280' }}
                    />
                    <YAxis
                      orientation="right"
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => formatShortNumber(value)}
                      tick={{ fontSize: 10, fill: '#6B7280' }}
                    />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Bar dataKey="netProfit" fill="#F59E0B" name="صافي الربح" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* توزيع الأرباح */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6">توزيع الأرباح</h3>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full ml-2" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{formatNumber(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* معلومات العمولة والتحويل */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">معلومات العمولة والتحويل</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg text-center border-l-4 border-blue-500">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">5,000 د.ع</h3>
                <p className="text-sm text-gray-500">الحد الأدنى للتحويل</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg text-center border-l-4 border-green-500">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">مجانية</h3>
                <p className="text-sm text-gray-500">رسوم التحويل</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg text-center border-l-4 border-purple-500">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">كل 30 يوم</h3>
                <p className="text-sm text-gray-500">موعد التحويل</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg text-center border-l-4 border-red-500">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{commissionRate}%</h3>
                <p className="text-sm text-gray-500"> نسبة العمولة (نسبة التطبيق)</p>
              </div>
            </div>
          </div>

          {/* سجل المدفوعات */}
          <PaymentHistoryTable payments={paymentHistory} loading={loading} />

          {/* معلومة مهمة */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 mt-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 text-blue-500 ml-4">
                <IoInformationCircleOutline className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-blue-900 mb-2">معلومة مهمة</h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                  يتم خصم عمولة التطبيق فقط عند إتمام الطلب بنجاح. في حالة إلغاء الطلب، لا يتم خصم أي عمولة.
                  مستحقاتك المتراكمة سيتم تحويلها إلى حسابك البنكي المسجل كل 15 من الشهر تلقائيًا.
                  يمكنك تتبع جميع المعاملات والمدفوعات من خلال هذا التقرير.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfitsPage;