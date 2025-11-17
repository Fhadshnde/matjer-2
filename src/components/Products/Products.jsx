import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoChevronUpOutline, IoChevronDownOutline, IoSearchOutline, IoAdd } from 'react-icons/io5';
import axios from 'axios';
import { getApiUrl, getAuthHeaders, API_CONFIG } from '../../config/api';
import * as XLSX from 'xlsx'; 

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const [isEditStockModalOpen, setIsEditStockModalOpen] = useState(false);
    const [isEditPriceModalOpen, setIsEditPriceModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isProductDetailsModalOpen, setIsProductDetailsModalOpen] = useState(false);
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [stockToUpdate, setStockToUpdate] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0,
        abandonedProducts: 0
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        pages: 1,
        total: 0,
    });
    const [searchTerm, setSearchTerm] = useState('');

    const getStatusClass = (status) => {
        switch (status) {
            case 'متوفر':
                return 'bg-green-100 text-green-700';
            case 'غير متوفر':
                return 'bg-red-100 text-red-700';
            case 'كمية منخفضة':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const fetchProducts = async (page = 1, limit = pagination.limit, search = searchTerm) => {
        try {
            setLoading(true);
            const response = await axios.get(`https://products-api.cbc-apps.net/supplier/products?page=${page}&limit=${limit}&search=${search}`, {
                headers: getAuthHeaders()
            });
            const data = response.data;
            setProducts(data.products || []);
            setPagination(prev => ({ 
                ...prev, 
                page: data.pagination.page, 
                limit: data.pagination.limit, 
                pages: data.pagination.pages,
                total: data.pagination.total
            }));

            // إحصائيات المنتجات
            const totalProducts = data.pagination?.total || 0;
            const lowStockProducts = data.products?.filter(p => p.stock < 10).length || 0;
            const outOfStockProducts = data.products?.filter(p => p.stock === 0).length || 0;
            const abandonedProducts = data.products?.filter(p => p.stock > 0 && p.stock < 5).length || 0;

            setStats({
                totalProducts,
                lowStockProducts,
                outOfStockProducts,
                abandonedProducts
            });

            setError(null);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('فشل جلب المنتجات، يرجى المحاولة لاحقاً.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const statePage = location.state?.page;
        const stateLimit = location.state?.limit;
        let pageToFetch = pagination.page;
        let limitToFetch = pagination.limit;

        if (statePage && stateLimit) {
            // الحالة 1: العودة من شاشة التعديل (استخدام الحالة الممررة)
            pageToFetch = statePage;
            limitToFetch = stateLimit;

            // تحديث حالة التصفح بالصفحة والـ limit الممررين 
            setPagination(prev => ({ 
                ...prev, 
                page: statePage, 
                limit: stateLimit 
            }));
            
            // إزالة الحالة من history لتجنب إعادة التطبيق عند الانتقالات اللاحقة
            window.history.replaceState({}, document.title, location.pathname); 
        }

        // الحالة 2: الجلب العادي، التنقل بين الصفحات، أو تغيير الـ Limit، أو البحث
        fetchProducts(pageToFetch, limitToFetch, searchTerm);
        
    }, [location.pathname, searchTerm, pagination.page, pagination.limit]); 

    const handlePageChange = (page) => {
        if (page > 0 && page <= pagination.pages) {
            setPagination(prev => ({ ...prev, page }));
        }
    };

    const handleLimitChange = (e) => {
        setPagination(prev => ({ ...prev, limit: parseInt(e.target.value, 10), page: 1 }));
    };

    const handleSearchChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleOpenProductDetails = (product) => {
        setSelectedProduct(product);
        setIsProductDetailsModalOpen(true);
    };

    const handleOpenEditProduct = (product) => {
        // تمرير الصفحة الحالية والـ limit كحالة
        navigate(`/edit-product/${product.id}`, { 
            state: { 
                prevPage: pagination.page, 
                prevLimit: pagination.limit 
            } 
        });
    };

    const handleOpenEditStock = (product) => {
        setSelectedProduct(product);
        setStockToUpdate(product.stock);
        setIsEditStockModalOpen(true);
    };

    const handleUpdateStock = async () => {
        if (!selectedProduct) return;
        try {
            await axios.patch(getApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS.UPDATE_STOCK(selectedProduct.id)), {
                stock: parseInt(stockToUpdate, 10),
                reason: "تحديث المخزون"
            }, {
                headers: getAuthHeaders()
            });
            alert('تم تحديث المخزون بنجاح!');
            fetchProducts(pagination.page, pagination.limit, searchTerm);
            setIsEditStockModalOpen(false);
        } catch (error) {
            console.error('Error updating stock:', error);
            alert('فشل تحديث المخزون، يرجى المحاولة لاحقاً.');
        }
    };

    const handleDeleteProduct = async () => {
        if (!selectedProduct) return;
        try {
            await axios.delete(getApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS.DELETE(selectedProduct.id)), {
                headers: getAuthHeaders()
            });
            alert('تم حذف المنتج بنجاح!');
            fetchProducts(pagination.page, pagination.limit, searchTerm);
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('فشل حذف المنتج، يرجى المحاولة لاحقاً.');
        }
    };

    const handleOpenEditPrice = () => {
        setIsEditPriceModalOpen(true);
    };

    const handleOpenDeleteModal = (product) => {
        setSelectedProduct(product);
        setIsDeleteModalOpen(true);
    };

    const handleExportToExcel = () => {
        // Prepare the data for export
        const dataToExport = products.map(product => ({
            'اسم المنتج': product.originalPrice,
            'سعر البيع': product.price,
            'سعر الجملة': product.wholesalePrice,
            'الكمية': product.stock,
            'الحالة': product.status,
            'القسم': product.category?.name || '',
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'المنتجات');
        
        // Write the workbook and trigger download
        XLSX.writeFile(workbook, 'products.xlsx');
    };

    const Modal = ({ isOpen, onClose, children }) => {
        if (!isOpen) return null;
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
            onClick={onClose}>
                <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative"
                onClick={(e) => e.stopPropagation()}>
                    <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                    {children}
                </div>
            </div>
        );
    };

    const renderPaginationButtons = () => {
        const pages = [];
        const startPage = Math.max(1, pagination.page - 2);
        const endPage = Math.min(pagination.pages, pagination.page + 2);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 rounded-md transition-colors ${
                        pagination.page === i ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    const cardsData = [
        {
            title: "إجمالي المنتجات",
            value: stats.totalProducts,
            growth: "+8%",
            trend: "up",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            )
        },
        {
            title: "منتجات منخفضة المخزون",
            value: stats.lowStockProducts,
            growth: "-2%",
            trend: "down",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
            )
        },
        {
            title: "منتجات غير متوفرة",
            value: stats.outOfStockProducts,
            growth: "-2%",
            trend: "down",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
            )
        },
        {
            title: "منتجات مهجورة",
            value: stats.abandonedProducts,
            growth: "+8%",
            trend: "up",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            )
        }
    ];

    return (
        <div className="bg-gray-100 min-h-screen p-8 text-right font-['Tajawal']">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {cardsData.map((card, index) => (
                    <div
                        key={index}
                        className="bg-white p-6 h-[120px] rounded-xl shadow-md flex flex-row items-center justify-between gap-4 cursor-pointer hover:shadow-lg transition-shadow"
                    >
                        <div className="bg-gray-100 p-3 rounded-xl text-red-600">
                            {card.icon}
                        </div>

                        <div className="flex flex-col text-right">
                            <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
                            <p className="text-xl font-bold text-gray-800">{card.value}</p>
                            <span
                                className={`text-lg flex items-center  ${
                                    card.trend === "up"
                                        ? "text-green-500"
                                        : card.trend === "down"
                                        ? "text-red-500"
                                        : "text-gray-500"
                                }`}
                            >
                                {card.trend === "up" && (
                                    <span className="mr-1">▲</span>
                                )}
                                {card.trend === "down" && (
                                    <span className="mr-1">▼</span>
                                )}
                                {card.growth}
                                <span className="text-gray-400 ml-3">عن الفترة السابقة</span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center"
                            onClick={() => navigate('/add-product')}
                        >
                            <IoAdd className="w-5 h-5 ml-2" />
                            إضافة منتج
                        </button>
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center"
                            onClick={handleExportToExcel}
                        >
                            تصدير إلى إكسل
                        </button>
                        <div className="relative">
                            <button
                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center hover:bg-gray-200 transition-colors"
                                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                            >
                                <span className="text-sm">الكل</span>
                                <IoChevronDownOutline className="w-4 h-4 mr-2 text-gray-500" />
                            </button>
                            {isFilterDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10">
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">متوفر</a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">غير متوفر</a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">كمية منخفضة</a>
                                </div>
                            )}
                        </div>
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                placeholder="ابحث باسم المنتج / الحالة"
                                className="bg-gray-100 text-gray-700 px-4 py-2 pr-10 rounded-lg w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-red-500 text-right"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <IoSearchOutline className="absolute right-3 text-gray-400" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">إدارة المنتجات</h2>
                </div>

                <div className="overflow-x-auto">
                <table className="min-w-full bg-white" dir="rtl">
  <thead>
    <tr className="border-b border-gray-300">
      <th className="py-3 px-4 text-gray-500 font-normal text-sm">صورة المنتج</th>
      <th className="py-3 px-4 text-gray-500 font-normal text-sm">اسم المنتج</th>
      <th className="py-3 px-4 text-gray-500 font-normal text-sm">سعر الجملة</th>
      <th className="py-3 px-4 text-gray-500 font-normal text-sm">سعر البيع</th>
      <th className="py-3 px-4 text-gray-500 font-normal text-sm">الكمية</th>
      <th className="py-3 px-4 text-gray-500 font-normal text-sm">القسم</th>
      <th className="py-3 px-4 text-gray-500 font-normal text-sm">الفئة</th>
      <th className="py-3 px-4 text-gray-500 font-normal text-sm">الإجراءات</th>
    </tr>
  </thead>
  <tbody>
    {loading ? (
      <tr>
        <td colSpan="8" className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المنتجات...</p>
        </td>
      </tr>
    ) : error ? (
      <tr>
        <td colSpan="8" className="p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchProducts()}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            إعادة المحاولة
          </button>
        </td>
      </tr>
    ) : products.length === 0 ? (
      <tr>
        <td colSpan="8" className="p-8 text-center text-gray-500">
          لا توجد منتجات
        </td>
      </tr>
    ) : (
      products.map((product) => (
        <tr
          key={product.id}
          className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {/* عمود صورة المنتج */}
          <td className="py-3 px-4">
            <img
              src={
                product.mainImageUrl && product.mainImageUrl.trim() !== ''
                  ? product.mainImageUrl
                  : product.media?.[0]?.url || '/placeholder.png'
              }
              alt={product.name}
              className="w-10 h-10 rounded-md object-cover"
            />
          </td>

          {/* عمود اسم المنتج */}
          <td className="py-3 px-4 text-sm text-gray-800">{product.name}</td>

          {/* عمود سعر الجملة */}
          <td className="py-3 px-4 text-sm text-gray-800">
            {product.wholesalePrice
              ? `${product.wholesalePrice.toLocaleString()} د.ع`
              : '-'}
          </td>

          {/* عمود سعر البيع */}
          <td className="py-3 px-4 text-sm text-gray-800">
            {product.originalPrice?.toLocaleString()} د.ع
          </td>

          {/* عمود الكمية */}
          <td className="py-3 px-4 text-sm text-gray-800">{product.stock}</td>

          {/* عمود القسم */}
          <td className="py-3 px-4 text-sm text-gray-800">
            {product.section?.name || ''}
          </td>

          {/* عمود الفئة */}
          <td className="py-3 px-4 text-sm text-gray-800">
            {product.category?.name || ''}
          </td>

          {/* عمود الإجراءات */}
          <td className="py-3 px-4">
            <div className="flex items-center space-x-2">
              <button
                className=" bg-gray-500 text-white ml-2 px-3 py-1 rounded-full text-sm  transition-colors"
                onClick={() => handleOpenProductDetails(product)}
              >
                عرض
              </button>
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm transition-colors"
                onClick={() => handleOpenEditProduct(product)}
              >
                تعديل
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded-full text-sm  transition-colors"
                onClick={() => handleOpenDeleteModal(product)}
              >
                حذف
              </button>
            </div>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>
                </div>

                <div className="flex justify-between items-center mt-4 text-gray-500 text-sm">
                    <p>إجمالي المنتجات: {pagination.total}</p>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <IoChevronDownOutline className="w-4 h-4 rotate-90" />
                        </button>
                        {renderPaginationButtons()}
                        <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.pages}
                            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <IoChevronUpOutline className="w-4 h-4 rotate-90" />
                        </button>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-sm">عرض في الصفحة</span>
                        <select
                            className="bg-gray-100 text-gray-900 rounded-md px-2 py-1 border border-gray-300"
                            value={pagination.limit}
                            onChange={handleLimitChange}
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option> {/* <-- التعديل هنا */}
                        </select>
                    </div>
                </div>
            </div>

            <Modal isOpen={isEditStockModalOpen} onClose={() => setIsEditStockModalOpen(false)}>
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">تعديل المخزون</h2>
                    {selectedProduct && <p className="mb-2 text-gray-600">المنتج: {selectedProduct.name}</p>}
                    <div className="mb-4">
                        <input
                            type="number"
                            placeholder="الكمية في المخزون"
                            className="bg-gray-100 w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 text-right"
                            value={stockToUpdate}
                            onChange={(e) => setStockToUpdate(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                        <button
                            onClick={() => setIsEditStockModalOpen(false)}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={handleUpdateStock}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                        >
                            تعديل
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isEditPriceModalOpen} onClose={() => setIsEditPriceModalOpen(false)}>
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">تعديل السعر</h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="السعر الأساسي"
                            className="bg-gray-100 w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 text-right"
                            defaultValue="150د.ع"
                        />
                        <input
                            type="text"
                            placeholder="السعر بعد الخصم"
                            className="bg-gray-100 w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 text-right"
                            defaultValue="140د.ع"
                        />
                        <input
                            type="text"
                            placeholder="نسبة الخصم"
                            className="bg-gray-100 w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 text-right"
                            defaultValue="10%"
                        />
                    </div>
                    <div className="flex justify-center mt-6 space-x-4 rtl:space-x-reverse">
                        <button
                            onClick={() => setIsEditPriceModalOpen(false)}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                        >
                            تعديل
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <div className="flex flex-col items-center text-center">
                    <div className="bg-red-100 text-red-600 p-4 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold mt-2 text-gray-800">هل أنت متأكد أنك تريد حذف المنتج؟</h3>
                    <p className="text-sm text-gray-500 mt-2">سوف يتم حذف هذا المنتج نهائيًا من قائمة المنتجات لديك</p>
                    <p className="text-sm text-gray-500 mt-1">هل أنت متأكد أنك تريد الحذف؟</p>
                    <div className="flex justify-center space-x-4 rtl:space-x-reverse mt-6 w-full">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={handleDeleteProduct}
                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                        >
                            حذف المنتج
                        </button>
                    </div>
                </div>
            </Modal>

            {isProductDetailsModalOpen && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
                onClick={() => {
                    setIsProductDetailsModalOpen(false);
                    setSelectedProduct(null);
                }}>
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">تفاصيل المنتج</h2>
                                <button
                                    onClick={() => {
                                        setIsProductDetailsModalOpen(false);
                                        setSelectedProduct(null);
                                    }}
                                    className="text-gray-400 text-2xl font-bold hover:text-gray-600"
                                >
                                    &times;
                                </button>
                            </div>
                            <div className="space-y-4 text-gray-700">
                                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                    <span className="w-1/3 text-gray-500 text-right pr-4">الاسم</span>
                                    <span className="w-2/3 text-left pl-4 text-gray-900">{selectedProduct.name}</span>
                                </div>
                                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                    <span className="w-1/3 text-gray-500 text-right pr-4">صورة المنتج</span>
                                    <span className="w-2/3 text-left pl-4">
                                        <img src={selectedProduct.mainImageUrl} alt="product" className="w-36 h-36 rounded-lg object-cover" />
                                    </span>
                                </div>
                                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                    <span className="w-1/3 text-gray-500 text-right pr-4">السعر</span>
                                    <span className="w-2/3 text-left pl-4 text-gray-900">{selectedProduct.originalPrice}</span>
                                </div>
                                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                    <span className="w-1/3 text-gray-500 text-right pr-4">المخزون</span>
                                    <span className="w-2/3 text-left pl-4 text-gray-900">{selectedProduct.stock}</span>
                                </div>
                                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                    <span className="w-1/3 text-gray-500 text-right pr-4">القسم الرئيسي</span>
                                    <span className="w-2/3 text-left pl-4 text-gray-900">{selectedProduct.category?.name || ''}</span>
                                </div>
                                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                    <span className="w-1/3 text-gray-500 text-right pr-4">القسم الفرعي</span>
                                    <span className="w-2/3 text-left pl-4 text-gray-900">{selectedProduct.section?.name || ''}</span>
                                </div>
                                <div className="p-2 bg-gray-50 rounded-lg">
                                    <span className="block text-gray-500 text-right pr-4 mb-1">وصف المنتج</span>
                                    <span className="block text-right pr-4 text-gray-900">{selectedProduct.description}</span>
                                </div>
                            </div>
                            <div className="flex justify-end mt-6 space-x-4 rtl:space-x-reverse">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsProductDetailsModalOpen(false);
                                        handleOpenEditProduct(selectedProduct);
                                    }}
                                    className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                                >
                                    تعديل
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;