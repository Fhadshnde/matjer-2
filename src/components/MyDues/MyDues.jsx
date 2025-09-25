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
    const [orders, setOrders] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);

    useEffect(() => {
        fetchDuesData();
    }, []);

    const fetchDuesData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            // جلب بيانات المستحقات من الـ endpoint الجديد
            const duesResponse = await fetch(`${API_CONFIG.BASE_URL}/supplier/dues/enhanced`, {
                headers: getAuthHeaders()
            });

            if (!duesResponse.ok) {
                throw new Error('Failed to fetch dues data');
            }

            const data = await duesResponse.json();
            
            // تحديث حالة المكون باستخدام البيانات الجديدة
            setDuesData(data.summary);
            setOrders(data.ordersTable);

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
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'قيد المعالجة': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'قيد المعالجة', icon: Clock },
            'مستلم': { bg: 'bg-green-100', text: 'text-green-800', label: 'مستلم', icon: CheckCircle },
            'ملغي': { bg: 'bg-red-100', text: 'text-red-800', label: 'ملغي', icon: AlertCircle },
            'معلق': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'معلق', icon: AlertCircle },
        };

        const config = statusConfig[status] || statusConfig['معلق'];
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
                <Icon size={12} />
                {config.label}
            </span>
        );
    };

    const handleViewInvoice = (invoice) => {
        // هذه الدالة قد تحتاج إلى تعديل إذا كانت الفواتير لها تفاصيل مختلفة
        // حالياً، لا يوجد مودال للفواتير في البيانات الجديدة، لكن أبقيتها من أجل التوافق
        setSelectedInvoice(invoice);
        setShowInvoiceModal(true);
    };

    // إعداد بيانات الرسم البياني
    const chartData = duesData ? [
        { name: 'إجمالي المستحقات', amount: duesData.totalDues, color: '#10B981' },
        { name: 'صافي المستحق', amount: duesData.netDues, color: '#3B82F6' },
        { name: 'عمولة التطبيق', amount: duesData.appCommission, color: '#F59E0B' }
    ] : [];

    // بيانات الرسم البياني الدائري للنسب
    // تُحسب من عمولة التطبيق وصافي المستحق
    const total = duesData ? duesData.netDues + duesData.appCommission : 0;
    const netDuesPercentage = total > 0 ? (duesData.netDues / total) * 100 : 0;
    const appCommissionPercentage = total > 0 ? (duesData.appCommission / total) * 100 : 0;

    const pieData = duesData ? [
        { name: 'صافي المستحق', value: parseFloat(netDuesPercentage.toFixed(2)), color: '#10B981' },
        { name: 'عمولة التطبيق', value: parseFloat(appCommissionPercentage.toFixed(2)), color: '#EF4444' }
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
                <p className="text-gray-600">عرض تفصيلي للمستحقات والطلبات الخاصة بك</p>
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
                                <p className="text-sm font-medium text-gray-600">إجمالي المستحقات</p>
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(duesData.totalDues)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                <DollarSign size={24} />
                            </div>
                            <div className="mr-4">
                                <p className="text-sm font-medium text-gray-600">صافي المستحق</p>
                                <p className="text-2xl font-bold text-blue-600">{formatCurrency(duesData.netDues)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                                <Clock size={24} />
                            </div>
                            <div className="mr-4">
                                <p className="text-sm font-medium text-gray-600">عمولة التطبيق</p>
                                <p className="text-2xl font-bold text-orange-600">{formatCurrency(duesData.appCommission)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                <Percent size={24} />
                            </div>
                            <div className="mr-4">
                                <p className="text-sm font-medium text-gray-600">عدد الطلبات</p>
                                <p className="text-2xl font-bold text-purple-600">{duesData.totalOrders}</p>
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
                            <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                            <Tooltip
                                formatter={(value, name) => [formatCurrency(value), name]}
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

            {/* جدول الطلبات */}
            <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">الطلبات</h3>
                        <button
                            onClick={fetchDuesData}
                            className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
                        >
                            تحديث البيانات
                        </button>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                        <p>لا توجد طلبات لعرضها.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        رقم الطلب
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        التاريخ
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        العميل
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        إجمالي
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        صافي المستحق
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        الحالة
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {order.orderNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(order.orderDate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.customerName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatCurrency(order.retailPrice)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                                            {formatCurrency(order.netMerchant)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(order.status)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

// تم حذف مودال الفاتورة لأن البيانات الجديدة لا تتضمن تفاصيل فواتير بالمعنى السابق
// ولكن إذا احتجت إلى مودال تفاصيل الطلب، يمكنك إنشاء مودال جديد
// const InvoiceDetailsModal = ...

export default MyDues;