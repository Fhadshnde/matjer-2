import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IoAdd, IoEye, IoPencil, IoTrash, IoPause, IoPlay, IoRefresh, IoFilter, IoSearch, IoCalendar, IoStatsChart, IoDownload, IoClose, IoCheckmark, IoAlertCircle, IoTrendingUp, IoTrendingDown, IoTime, IoCash, IoPeople, IoStar, IoImage } from 'react-icons/io5';
import axios from 'axios';
import { getApiUrl, getAuthHeaders, API_CONFIG } from '../../config/api';

const CustomTooltip = ({ active, payload, label }) => {
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
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, change, icon, color, trend, details }) => {
  const isPositive = change >= 0;
  const trendIcon = trend === 'up' ? <IoTrendingUp className="h-4 w-4" /> : <IoTrendingDown className="h-4 w-4" />;
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-2 font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
          <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trendIcon}
            <span className="mr-1 font-semibold">
              {Math.abs(change)}%
            </span>
            <span className="text-gray-500">عن الفترة السابقة</span>
          </div>
          {details && (
            <p className="text-xs text-gray-400 mt-2">{details}</p>
          )}
        </div>
        <div className={`p-4 rounded-full ${color} text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const FilterComponent = ({ onFilterChange, currentFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const filters = [
    { value: 'all', label: 'الكل', icon: <IoFilter className="w-4 h-4" /> },
    { value: 'active', label: 'نشط', icon: <IoCheckmark className="w-4 h-4" /> },
    { value: 'expired', label: 'منتهي', icon: <IoAlertCircle className="w-4 h-4" /> },
    { value: 'scheduled', label: 'مجدول', icon: <IoTime className="w-4 h-4" /> }
  ];
  const currentFilterLabel = filters.find(f => f.value === currentFilter)?.label || 'الكل';
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-white text-gray-700 font-semibold py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
      >
        <IoFilter className="h-5 w-5 ml-2" />
        {currentFilterLabel}
        <IoCalendar className="h-4 w-4 mr-2" />
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

const SearchComponent = ({ onSearchChange, searchTerm }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="ابحث في العروض..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full md:w-80 pl-10 pr-4 py-3 text-right text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500"
      />
      <IoSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
    </div>
  );
};

const Modal = ({ isOpen, onClose, children, title, size = "md" }) => {
  if (!isOpen) return null;
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl"
  };
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50" onClick={onClose}>
      <div className={`relative bg-white p-6 rounded-xl shadow-xl w-full ${sizeClasses[size]} mx-auto transform transition-all`} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <IoClose className="w-6 h-6" />
        </button>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <div className="max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

const OfferForm = ({ offer, onSubmit, onClose, isEdit = false, categories, products }) => {
  const [formData, setFormData] = useState({
    title: offer?.title || '',
    description: offer?.description || '',
    startDate: offer?.startDate ? new Date(offer.startDate).toISOString().split('T')[0] : '',
    endDate: offer?.endDate ? new Date(offer.endDate).toISOString().split('T')[0] : '',
    categoryId: offer?.categoryId || null,
    productIds: offer?.productIds?.map(id => parseInt(id)) || [],
    discountType: offer?.discountType || 'percentage',
    discountValue: offer?.discountValue || 0,
    isActive: offer?.isActive || false,
    image: null,
    imagePreview: offer?.image || ''
  });
  const [loading, setLoading] = useState(false);
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleProductChange = (productId) => {
    setFormData(prev => {
      const newProductIds = prev.productIds.includes(parseInt(productId))
        ? prev.productIds.filter(id => id !== parseInt(productId))
        : [...prev.productIds, parseInt(productId)];
      return { ...prev, productIds: newProductIds };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = formData.imagePreview;
      if (formData.image) {
        const imageData = new FormData();
        imageData.append('file', formData.image);
        const uploadResponse = await axios.post(getApiUrl('/supplier/upload/image'), imageData, {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data'
          }
        });
        imageUrl = uploadResponse.data.url;
      }

      await onSubmit({ ...formData, image: imageUrl });
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">اسم العرض</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full py-3 px-4 bg-gray-100 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">نوع الخصم</label>
          <select
            value={formData.discountType}
            onChange={(e) => setFormData({...formData, discountType: e.target.value})}
            className="w-full py-3 px-4 bg-gray-100 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="percentage">نسبة مئوية</option>
            <option value="fixed">قيمة ثابتة</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">الوصف</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full py-3 px-4 bg-gray-100 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">تاريخ البدء</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            className="w-full py-3 px-4 bg-gray-100 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">تاريخ الانتهاء</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            className="w-full py-3 px-4 bg-gray-100 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">صورة العرض</label>
          <div className="relative border border-gray-300 rounded-lg p-4 bg-gray-100 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {formData.imagePreview ? (
              <div className="flex flex-col items-center">
                <img src={formData.imagePreview} alt="Offer Preview" className="w-32 h-32 object-cover rounded-lg mb-2" />
                <p className="text-sm text-gray-500">تم تحديد صورة. انقر للتغيير.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <IoImage className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">انقر أو اسحب صورة هنا للتحميل.</p>
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">قيمة الخصم</label>
          <input
            type="number"
            value={formData.discountValue}
            onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
            className="w-full py-3 px-4 bg-gray-100 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">الفئة</label>
          <div className="max-h-60 overflow-y-auto p-4 rounded-xl border border-gray-300 bg-white shadow-inner">
            {categories.length > 0 ? categories.map(category => (
              <label
                key={category.id}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                  parseInt(formData.categoryId) === parseInt(category.id) ? 'bg-red-50' : 'hover:bg-gray-100'
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={category.id}
                  checked={parseInt(formData.categoryId) === parseInt(category.id)}
                  onChange={() => setFormData({...formData, categoryId: parseInt(category.id)})}
                  className="hidden"
                />
                <div className={`w-5 h-5 rounded-full border-2 transition-colors duration-200 flex items-center justify-center ml-3 ${
                  parseInt(formData.categoryId) === parseInt(category.id) ? 'bg-red-500 border-red-500' : 'bg-white border-gray-400'
                }`}>
                  {parseInt(formData.categoryId) === parseInt(category.id) && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">{category.name}</span>
              </label>
            )) : (
              <p className="text-sm text-gray-500">لا توجد فئات متاحة.</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">المنتجات</label>
          <div className="max-h-60 overflow-y-auto p-4 rounded-xl border border-gray-300 bg-white shadow-inner">
            {products.length > 0 ? products.map(product => (
              <label
                key={product.id}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                  formData.productIds.includes(parseInt(product.id)) ? 'bg-red-50' : 'hover:bg-gray-100'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.productIds.includes(parseInt(product.id))}
                  onChange={() => handleProductChange(product.id)}
                  className="hidden"
                />
                <span className={`w-5 h-5 rounded-md border-2 transition-colors duration-200 flex items-center justify-center ml-3 ${
                  formData.productIds.includes(parseInt(product.id)) ? 'bg-red-500 border-red-500' : 'bg-white border-gray-400'
                }`}>
                  {formData.productIds.includes(parseInt(product.id)) && (
                    <IoCheckmark className="text-white w-4 h-4" />
                  )}
                </span>
                <span className="text-sm font-medium text-gray-700">{product.name}</span>
              </label>
            )) : (
              <p className="text-sm text-gray-500">لا توجد منتجات متاحة.</p>
            )}
          </div>
        </div>
      </div>
      {isEdit && (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
            className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
          />
          <label className="text-gray-700 text-sm font-bold mr-2">تفعيل العرض</label>
        </div>
      )}
      <div className="flex justify-end space-x-4 space-x-reverse mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'جاري الحفظ...' : (isEdit ? 'تحديث' : 'إنشاء')}
        </button>
      </div>
    </form>
  );
};

const PerformanceChart = ({ data, title }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" />
            <YAxis orientation="right" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="visits" fill="#3B82F6" name="الزيارات" />
            <Bar dataKey="conversions" fill="#10B981" name="التحويلات" />
            <Bar dataKey="orders" fill="#F59E0B" name="الطلبات" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const OffersDashboard = () => {
  const [offersData, setOffersData] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalOffers: 0,
    activeOffers: 0,
    expiredOffers: 0,
    upcomingOffers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingDropdownData, setLoadingDropdownData] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [performanceData, setPerformanceData] = useState([]);
  const fetchOffers = async () => {
    try {
      setRefreshing(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('لم يتم العثور على رمز المصادقة. يرجى تسجيل الدخول مرة أخرى.');
        return;
      }
      const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.OFFERS.LIST), {
        headers: getAuthHeaders()
      });
      const { offers, totalOffers, activeOffers, expiredOffers, upcomingOffers } = response.data;
      const processedOffers = offers.map(offer => {
        const discountType = offer.discountType || 'percentage';
        const discountValue = offer.discountValue || 0;
        const productsCount = offer.productsCount || 0;
        return {
          ...offer,
          categoryId: offer.category?.id || null,
          productIds: offer.products?.map(p => p.id) || [],
          status: offer.isActive ? 'نشط' : (new Date(offer.endDate) < new Date() ? 'منتهي' : 'مجدول'),
          period: `${new Date(offer.startDate).toLocaleDateString()} - ${new Date(offer.endDate).toLocaleDateString()}`,
          name: offer.title || 'بدون عنوان',
          type: discountType === 'percentage' ? 'نسبة مئوية' : 'قيمة ثابتة',
          scope: productsCount > 0 ? `${productsCount} منتج` : 'كل المنتجات',
          value: discountType === 'percentage' ?
            `${discountValue}%` :
            `${discountValue} د.ع`,
          daysLeft: Math.ceil((new Date(offer.endDate) - new Date()) / (1000 * 60 * 60 * 24))
        };
      });
      setOffersData(processedOffers);
      setDashboardStats({ totalOffers, activeOffers, expiredOffers, upcomingOffers });
      setError(null);
    } catch (err) {
      console.error('Error fetching offers:', err);
      console.error('Error response:', err.response?.data);
      setError('فشل في جلب العروض: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const headers = getAuthHeaders();
      const categoriesRes = await axios.get(getApiUrl('/supplier/categories'), { headers });
      const productsRes = await axios.get(getApiUrl('/supplier/products?sortBy=createdAt&sortOrder=desc'), { headers });
      setCategories(categoriesRes.data.categories);
      setProducts(productsRes.data.products);
      setLoadingDropdownData(false);
    } catch (err) {
      console.error("Failed to fetch categories/products:", err);
      setLoadingDropdownData(false);
    }
  };
  useEffect(() => {
    fetchOffers();
    fetchDropdownData();
  }, []);
  const handleAddOffer = async (formData) => {
    try {
      const newOfferBody = {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        categoryId: formData.categoryId,
        sectionId: 0,
        productIds: formData.productIds,
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        image: formData.image
      };
      const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.OFFERS.ADD), newOfferBody, {
        headers: getAuthHeaders()
      });
      fetchOffers();
    } catch (err) {
      console.error('Error creating offer:', err);
      console.error('Error response:', err.response?.data);
      throw new Error('فشل في إنشاء العرض: ' + (err.response?.data?.message || err.message));
    }
  };
  const handleEditOffer = async (formData) => {
    try {
      const updatedOfferBody = {
        title: formData.title,
        description: formData.description,
        isActive: formData.isActive,
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        categoryId: formData.categoryId,
        productIds: formData.productIds,
        image: formData.image
      };
      await axios.patch(getApiUrl(API_CONFIG.ENDPOINTS.OFFERS.EDIT(selectedOffer.id)), updatedOfferBody, {
        headers: getAuthHeaders()
      });
      fetchOffers();
    } catch (err) {
      console.error('Error updating offer:', err);
      console.error('Error response:', err.response?.data);
      throw new Error('فشل في تعديل العرض: ' + (err.response?.data?.message || err.message));
    }
  };
  const handleDeleteOffer = async () => {
    try {
      await axios.delete(getApiUrl(API_CONFIG.ENDPOINTS.OFFERS.DELETE(selectedOffer.id)), {
        headers: getAuthHeaders()
      });
      fetchOffers();
    } catch (err) {
      throw new Error('فشل في حذف العرض');
    }
  };
  const handleToggleOfferStatus = async () => {
    try {
      await axios.patch(getApiUrl(API_CONFIG.ENDPOINTS.OFFERS.TOGGLE_STATUS(selectedOffer.id)), null, {
        headers: getAuthHeaders()
      });
      fetchOffers();
    } catch (err) {
      throw new Error('فشل في تغيير حالة العرض');
    }
  };
  const fetchOfferPerformance = async (offerId) => {
    try {
      const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.OFFERS.PERFORMANCE(offerId)), {
        headers: getAuthHeaders()
      });
      const { performance } = response.data;
      setPerformanceData([
        { name: 'الأداء العام', visits: performance.totalViews, conversions: performance.conversionRate, orders: performance.totalSales }
      ]);
    } catch (err) {
      console.error('Error fetching performance:', err);
      setPerformanceData([
        { name: 'الأداء العام', visits: 0, conversions: 0, orders: 0 }
      ]);
    }
  };

  const openDetailsModal = (offer) => {
    setSelectedOffer(offer);
    setIsDetailsModalOpen(true);
    setActiveDropdown(null);
  };
  const openEditModal = (offer) => {
    setSelectedOffer(offer);
    setIsEditModalOpen(true);
    setActiveDropdown(null);
  };
  const openDeleteModal = (offer) => {
    setSelectedOffer(offer);
    setIsDeleteModalOpen(true);
    setActiveDropdown(null);
  };
  const openPerformanceModal = (offer) => {
    setSelectedOffer(offer);
    fetchOfferPerformance(offer.id);
    setIsPerformanceModalOpen(true);
    setActiveDropdown(null);
  };
  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsPerformanceModalOpen(false);
    setSelectedOffer(null);
    setPerformanceData([]);
  };
  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const filteredOffers = offersData.filter(offer => {
    const matchesFilter = currentFilter === 'all' ||
      (currentFilter === 'active' && offer.status === 'نشط') ||
      (currentFilter === 'expired' && offer.status === 'منتهي') ||
      (currentFilter === 'scheduled' && offer.status === 'مجدول');
    const matchesSearch = offer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading || loadingDropdownData) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل البيانات...</p>
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
            onClick={fetchOffers}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rtl:text-right font-sans bg-gray-100 min-h-screen p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">

          <div className="flex items-center space-x-4 space-x-reverse">
            <button
              onClick={fetchOffers}
              disabled={refreshing}
              className="flex items-center bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <IoRefresh className={`h-5 w-5 ml-2 ${refreshing ? 'animate-spin' : ''}`} />
              تحديث
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center bg-red-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
              <IoAdd className="h-5 w-5 ml-2" />
              إنشاء عرض جديد
            </button>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة العروض</h1>
            <p className="text-gray-600">إدارة العروض والإعلانات</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="إجمالي العروض"
            value={dashboardStats.totalOffers}
            change={5}
            icon={<IoStar className="h-6 w-6" />}
            color="bg-blue-500"
            trend="up"
            details="جميع العروض"
          />
          <StatCard
            title="العروض النشطة"
            value={dashboardStats.activeOffers}
            change={12}
            icon={<IoCheckmark className="h-6 w-6" />}
            color="bg-green-500"
            trend="up"
            details="عروض مفعلة حالياً"
          />
          <StatCard
            title="عروض منتهية"
            value={dashboardStats.expiredOffers}
            change={-3}
            icon={<IoAlertCircle className="h-6 w-6" />}
            color="bg-red-500"
            trend="down"
            details="عروض انتهت صلاحيتها"
          />
          <StatCard
            title="عروض مجدولة"
            value={dashboardStats.upcomingOffers}
            change={8}
            icon={<IoTime className="h-6 w-6" />}
            color="bg-yellow-500"
            trend="up"
            details="عروض قادمة"
          />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <SearchComponent onSearchChange={setSearchTerm} searchTerm={searchTerm} />
              <FilterComponent onFilterChange={setCurrentFilter} currentFilter={currentFilter} />
            </div>
            <div className="text-sm text-gray-500">
              عرض {filteredOffers.length} من {offersData.length} عرض
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الفترة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">القيمة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">النطاق</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">النوع</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">صورة العرض</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم العرض</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOffers.map((offer, index) => (
                  <tr key={offer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="relative inline-block text-right">
                        <button
                          onClick={() => toggleDropdown(index)}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          <IoFilter className="h-5 w-5 transform rotate-90" />
                        </button>
                        {activeDropdown === index && (
                          <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1">
                              <button onClick={() => openDetailsModal(offer)} className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <IoEye className="w-4 h-4 ml-2" />
                                عرض التفاصيل
                              </button>
                              <button onClick={() => openEditModal(offer)} className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <IoPencil className="w-4 h-4 ml-2" />
                                تعديل العرض
                              </button>
                              <button onClick={() => openPerformanceModal(offer)} className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <IoStatsChart className="w-4 h-4 ml-2" />
                                مشاهدة الأداء
                              </button>
                              <button onClick={() => openDeleteModal(offer)} className="flex items-center w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                <IoTrash className="w-4 h-4 ml-2" />
                                حذف العرض
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        offer.status === 'نشط' ? 'bg-green-100 text-green-800' :
                        offer.status === 'منتهي' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {offer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div>{offer.period}</div>
                        {offer.daysLeft > 0 && offer.status === 'نشط' && (
                          <div className="text-xs text-green-600">
                            {offer.daysLeft} يوم متبقي
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-semibold">
                      {offer.value}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {offer.scope}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {offer.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {offer.image ? (
                        <img src={offer.image} alt={offer.name} className="h-10 w-10 object-cover rounded-lg" />
                      ) : (
                        <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <IoImage className="text-gray-400 w-6 h-6" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {offer.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredOffers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <IoAlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>لا توجد عروض تطابق المعايير المحددة</p>
            </div>
          )}
        </div>
        <Modal isOpen={isAddModalOpen} onClose={closeModal} title="إنشاء عرض جديد" size="md">
          <OfferForm onSubmit={handleAddOffer} onClose={closeModal} categories={categories} products={products} />
        </Modal>
        <Modal isOpen={isEditModalOpen} onClose={closeModal} title="تعديل العرض" size="md">
          <OfferForm offer={selectedOffer} onSubmit={handleEditOffer} onClose={closeModal} isEdit={true} categories={categories} products={products} />
        </Modal>
        <Modal isOpen={isDetailsModalOpen} onClose={closeModal} title="تفاصيل العرض" size="md">
          {selectedOffer && (
            <div className="space-y-4 text-right">
              <div className="flex justify-center mb-4">
                {selectedOffer.image ? (
                  <img src={selectedOffer.image} alt={selectedOffer.name} className="w-40 h-40 object-cover rounded-xl shadow-md" />
                ) : (
                  <div className="w-40 h-40 bg-gray-200 rounded-xl flex items-center justify-center">
                    <IoImage className="text-gray-400 w-16 h-16" />
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <p className="text-sm text-gray-500">الاسم</p>
                <p className="text-lg font-semibold">{selectedOffer.name}</p>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <p className="text-sm text-gray-500">الوصف</p>
                <p className="text-lg font-semibold">{selectedOffer.description}</p>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <p className="text-sm text-gray-500">الفترة</p>
                <p className="text-lg font-semibold">{selectedOffer.period}</p>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <p className="text-sm text-gray-500">القيمة</p>
                <p className="text-lg font-semibold">{selectedOffer.value}</p>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <p className="text-sm text-gray-500">النوع</p>
                <p className="text-lg font-semibold">{selectedOffer.type}</p>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <p className="text-sm text-gray-500">النطاق</p>
                <p className="text-lg font-semibold">{selectedOffer.scope}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">الحالة</p>
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  selectedOffer.status === 'نشط' ? 'bg-green-100 text-green-800' :
                  selectedOffer.status === 'منتهي' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedOffer.status}
                </span>
              </div>
            </div>
          )}
        </Modal>
        <Modal isOpen={isPerformanceModalOpen} onClose={closeModal} title="أداء العرض" size="lg">
          <PerformanceChart data={performanceData} title={`أداء العرض: ${selectedOffer?.name}`} />
        </Modal>
        <Modal isOpen={isDeleteModalOpen} onClose={closeModal} title="حذف العرض" size="sm">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <IoTrash className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold mb-2">هل أنت متأكد من حذف هذا العرض؟</h3>
            <p className="text-sm text-gray-500 mb-6">
              سيتم حذف العرض نهائياً ولا يمكن استرداده
            </p>
            <div className="flex justify-center space-x-4 space-x-reverse">
              <button
                onClick={closeModal}
                className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  handleDeleteOffer();
                  closeModal();
                }}
                className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                حذف
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};
export default OffersDashboard;