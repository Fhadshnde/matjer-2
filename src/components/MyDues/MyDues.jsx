import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Percent, 
  Calendar,
  FileText,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  PlusCircle
} from 'lucide-react';
import { getApiUrl, getAuthHeaders, API_CONFIG } from '../../config/api';

const MyDues = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  const [duesData, setDuesData] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    fetchDuesData();
  }, []);

        const fetchDuesData = async () => {
    try {
      setLoading(true);
            const token = localStorage.getItem('token');
      
      // جلب بيانات المستحقات
      const duesResponse = await fetch(`${API_CONFIG.BASE_URL}/supplier/my-dues`, {
        headers: getAuthHeaders()
      });

      if (!duesResponse.ok) {
        throw new Error('Failed to fetch dues data');
      }

      const dues = await duesResponse.json();
      setDuesData(dues);

      // جلب فواتير صرف المستحقات
      const invoicesResponse = await fetch(`${API_CONFIG.BASE_URL}/supplier/my-invoices/dues`, {
                    headers: getAuthHeaders() 
                });
                
      if (invoicesResponse.ok) {
        const invoicesData = await invoicesResponse.json();
        setInvoices(invoicesData);
      }

    } catch (error) {
      console.error('Error fetching dues data:', error);
      setError(error.message);
            } finally {
                setLoading(false);
            }
        };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-IQ', {
      style: 'currency',
      currency: 'IQD',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'قيد الانتظار', icon: Clock },
      'PAID': { bg: 'bg-green-100', text: 'text-green-800', label: 'مدفوعة', icon: CheckCircle },
      'OVERDUE': { bg: 'bg-red-100', text: 'text-red-800', label: 'متأخرة', icon: AlertCircle }
    };

    const config = statusConfig[status] || statusConfig['PENDING'];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  // إعداد بيانات الرسم البياني
  const chartData = duesData ? [
    { name: 'إجمالي المكتسب', amount: duesData.totalEarned, color: '#10B981' },
    { name: 'المدفوع', amount: duesData.totalPaid, color: '#3B82F6' },
    { name: 'المستحقات المعلقة', amount: duesData.pendingDues, color: '#F59E0B' }
  ] : [];

  const pieData = duesData ? [
    { name: 'نسبة المورد', value: duesData.commissionRate, color: '#10B981' },
    { name: 'نسبة المنصة', value: duesData.platformCommissionRate, color: '#EF4444' }
  ] : [];

    if (loading) {
        return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">جاري تحميل بيانات المستحقات...</div>
            </div>
        );
    }

    if (error) {
        return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">خطأ في تحميل البيانات: {error}</div>
            </div>
        );
    }

    return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* العنوان الرئيسي */}
                <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">مستحقاتي</h1>
        <p className="text-gray-600">عرض تفصيلي للمستحقات وفواتير الصرف الخاصة بك</p>
      </div>

      {/* بطاقات الإحصائيات */}
      {duesData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <TrendingUp size={24} />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي المكتسب</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(duesData.totalEarned)}</p>
      </div>
    </div>
</div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <DollarSign size={24} />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">المدفوع سابقاً</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(duesData.totalPaid)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                <Clock size={24} />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">المستحقات المعلقة</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(duesData.pendingDues)}</p>
                            </div>
                        </div>
                    </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <Percent size={24} />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">نسبتك</p>
                <p className="text-2xl font-bold text-purple-600">{duesData.commissionRate}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* الرسم البياني الشريطي */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">توزيع المستحقات</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), 'المبلغ']}
                labelStyle={{ textAlign: 'right' }}
              />
              <Bar dataKey="amount" fill="#10B981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

        {/* الرسم البياني الدائري */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">توزيع النسب</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'النسبة']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm text-gray-600">{entry.name}: {entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
                </div>

      {/* معلومات إضافية */}
      {duesData && (
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات إضافية</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-blue-500" size={20} />
              <div>
                <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
                <p className="text-lg font-semibold">{formatCurrency(duesData.totalRevenue)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-500" size={20} />
              <div>
                <p className="text-sm text-gray-600">الطلبات المكتملة</p>
                <p className="text-lg font-semibold">{duesData.completedOrders}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="text-purple-500" size={20} />
              <div>
                <p className="text-sm text-gray-600">متوسط الربح لكل طلب</p>
                <p className="text-lg font-semibold">{formatCurrency(duesData.avgProfitPerOrder)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* فواتير صرف المستحقات */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">فواتير صرف المستحقات</h3>
            <button
              onClick={fetchDuesData}
              className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
            >
              تحديث البيانات
            </button>
                        </div>
                    </div>

        {invoices.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FileText size={48} className="mx-auto mb-4 text-gray-300" />
            <p>لا توجد فواتير صرف مستحقات حتى الآن</p>
            <p className="text-sm">ستظهر هنا فواتير صرف المستحقات عند إنشائها من قبل الإدارة</p>
          </div>
        ) : (
                    <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    رقم الفاتورة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    المبلغ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    تاريخ الإنشاء
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    تاريخ الاستحقاق
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الإجراءات
                  </th>
                                </tr>
                            </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      {formatCurrency(invoice.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(invoice.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewInvoice(invoice)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-100"
                        title="عرض تفاصيل الفاتورة"
                      >
                        <Eye size={16} />
                                                    </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
          </div>
        )}
                    </div>

      {/* مودال عرض تفاصيل الفاتورة */}
      {showInvoiceModal && selectedInvoice && (
        <InvoiceDetailsModal
          invoice={selectedInvoice}
          onClose={() => {
            setShowInvoiceModal(false);
            setSelectedInvoice(null);
          }}
        />
      )}
                        </div>
  );
};

// مودال عرض تفاصيل الفاتورة
const InvoiceDetailsModal = ({ invoice, onClose }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-IQ', {
      style: 'currency',
      currency: 'IQD',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

                                return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">تفاصيل فاتورة صرف المستحقات</h2>
                                    <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              ✕
                            </button>
                        </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">رقم الفاتورة</label>
                <p className="text-lg font-semibold">{invoice.invoiceNumber}</p>
                    </div>
              <div>
                <label className="text-sm font-medium text-gray-500">المبلغ</label>
                <p className="text-lg font-semibold text-green-600">{formatCurrency(invoice.totalAmount)}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">تاريخ الإنشاء</label>
                <p>{formatDate(invoice.createdAt)}</p>
                        </div>
              <div>
                <label className="text-sm font-medium text-gray-500">تاريخ الاستحقاق</label>
                <p>{formatDate(invoice.dueDate)}</p>
                            </div>
                        </div>

            {invoice.description && (
              <div>
                <label className="text-sm font-medium text-gray-500">الوصف</label>
                <p>{invoice.description}</p>
                    </div>
            )}

            {invoice.notes && (
              <div>
                <label className="text-sm font-medium text-gray-500">ملاحظات</label>
                <p>{invoice.notes}</p>
                </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
        </div>
    );
};

export default MyDues;