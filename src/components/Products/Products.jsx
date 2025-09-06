import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronUpOutline, IoChevronDownOutline, IoSearchOutline, IoAdd, IoEllipsisHorizontal, IoEyeOutline, IoPencilOutline, IoTrashOutline } from 'react-icons/io5';

const dummyProducts = [
    {
        id: '1',
        image: 'https://placehold.co/40x40/e0e0e0/ffffff?text=P1',
        name: 'هاتف 1 A15 128GB، سماعات بلوتوت 1x',
        price: '154.90 د.ك',
        hollyPrice: '120.00 د.ك',
        quantity: 15,
        status: 'متوفر',
        mainCategory: 'إلكترونيات',
        subCategory: 'هواتف ذكية'
    },
    {
        id: '2',
        image: 'https://placehold.co/40x40/e0e0e0/ffffff?text=P2',
        name: 'هاتف 2 Pro...',
        price: '299.00 د.ك',
        hollyPrice: '250.00 د.ك',
        quantity: 5,
        status: 'كمية منخفضة',
        mainCategory: 'إلكترونيات',
        subCategory: 'هواتف ذكية'
    },
    {
        id: '3',
        image: 'https://placehold.co/40x40/e0e0e0/ffffff?text=P3',
        name: 'سماعة بلوتوث',
        price: '75.50 د.ك',
        hollyPrice: '60.00 د.ك',
        quantity: 0,
        status: 'غير متوفر',
        mainCategory: 'إلكترونيات',
        subCategory: 'ملحقات صوتية'
    },
    {
        id: '4',
        image: 'https://placehold.co/40x40/e0e0e0/ffffff?text=P4',
        name: 'شاحن سريع',
        price: '20.00 د.ك',
        hollyPrice: '15.00 د.ك',
        quantity: 20,
        status: 'متوفر',
        mainCategory: 'إلكترونيات',
        subCategory: 'ملحقات شحن'
    },
    {
        id: '5',
        image: 'https://placehold.co/40x40/e0e0e0/ffffff?text=P5',
        name: 'هاتف 1 A15...',
        price: '154.90 د.ك',
        hollyPrice: '120.00 د.ك',
        quantity: 15,
        status: 'متوفر',
        mainCategory: 'إلكترونيات',
        subCategory: 'هواتف ذكية'
    },
    {
        id: '6',
        image: 'https://placehold.co/40x40/e0e0e0/ffffff?text=P6',
        name: 'هاتف 1 A15...',
        price: '154.90 د.ك',
        hollyPrice: '120.00 د.ك',
        quantity: 15,
        status: 'متوفر',
        mainCategory: 'إلكترونيات',
        subCategory: 'هواتف ذكية'
    },
    {
        id: '7',
        image: 'https://placehold.co/40x40/e0e0e0/ffffff?text=P7',
        name: 'هاتف 1 A15...',
        price: '154.90 د.ك',
        hollyPrice: '120.00 د.ك',
        quantity: 15,
        status: 'متوفر',
        mainCategory: 'إلكترونيات',
        subCategory: 'هواتف ذكية'
    },
    {
        id: '8',
        image: 'https://placehold.co/40x40/e0e0e0/ffffff?text=P8',
        name: 'هاتف 1 A15...',
        price: '154.90 د.ك',
        hollyPrice: '120.00 د.ك',
        quantity: 15,
        status: 'متوفر',
        mainCategory: 'إلكترونيات',
        subCategory: 'هواتف ذكية'
    },
    {
        id: '9',
        image: 'https://placehold.co/40x40/e0e0e0/ffffff?text=P9',
        name: 'هاتف 1 A15...',
        price: '154.90 د.ك',
        hollyPrice: '120.00 د.ك',
        quantity: 15,
        status: 'متوفر',
        mainCategory: 'إلكترونيات',
        subCategory: 'هواتف ذكية'
    },
    {
        id: '10',
        image: 'https://placehold.co/40x40/e0e0e0/ffffff?text=P10',
        name: 'هاتف 1 A15...',
        price: '154.90 د.ك',
        hollyPrice: '120.00 د.ك',
        quantity: 15,
        status: 'متوفر',
        mainCategory: 'إلكترونيات',
        subCategory: 'هواتف ذكية'
    },
];

const Dashboard = () => {
    const navigate = useNavigate();
    const [isEditStockModalOpen, setIsEditStockModalOpen] = useState(false);
    const [isEditPriceModalOpen, setIsEditPriceModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isProductDetailsModalOpen, setIsProductDetailsModalOpen] = useState(false);
    const [isMoreActionsDropdownOpen, setIsMoreActionsDropdownOpen] = useState(null);
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

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

    const handleOpenProductDetails = (product) => {
        setSelectedProduct(product);
        setIsProductDetailsModalOpen(true);
        setIsMoreActionsDropdownOpen(false);
    };

    const handleOpenEditProduct = (product) => {
        console.log(`Navigating to /edit-product/${product.id}`);
        navigate(`/edit-product/${product.id}`);
    };

    const handleOpenEditStock = () => {
        setIsEditStockModalOpen(true);
        setIsMoreActionsDropdownOpen(false);
    };

    const handleOpenEditPrice = () => {
        setIsEditPriceModalOpen(true);
        setIsMoreActionsDropdownOpen(false);
    };

    const handleOpenDeleteModal = () => {
        setIsDeleteModalOpen(true);
        setIsMoreActionsDropdownOpen(false);
    };

    const Modal = ({ isOpen, onClose, children }) => {
        if (!isOpen) return null;
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
                    <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                    {children}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-100 min-h-screen p-8 text-right font-['Tajawal']">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl">إجمالي المنتجات</h3>
                        <p className="text-2xl font-bold mt-1 text-gray-900">820</p>
                    </div>
                    <span className="text-sm font-semibold text-green-500">↑ 8%</span>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl">منتجات منخفضة المخزون</h3>
                        <p className="text-2xl font-bold mt-1 text-gray-900">18</p>
                    </div>
                    <span className="text-sm font-semibold text-red-500">↓ 2%</span>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl">منتجات غير متوفرة</h3>
                        <p className="text-2xl font-bold mt-1 text-gray-900">32</p>
                    </div>
                    <span className="text-sm font-semibold text-red-500">↓ 2%</span>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl">منتجات مهجورة</h3>
                        <p className="text-2xl font-bold mt-1 text-gray-900">14</p>
                    </div>
                    <span className="text-sm font-semibold text-red-500">↑ 8%</span>
                </div>
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
                            />
                            <IoSearchOutline className="absolute right-3 text-gray-400" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">إدارة المنتجات</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-right bg-white">
                        <thead>
                            <tr className="border-b border-gray-300">
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm">الإجراءات</th>
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm">القسم</th>
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm">الحالة</th>
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm">الكمية</th>
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm">سعر البيع</th>
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm">سعر الجملة</th>
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm">اسم المنتج</th>
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm">صورة المنتج</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dummyProducts.map((product) => (
                                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 relative">
                                        <button
                                            className="text-gray-500 hover:text-gray-900"
                                            onClick={() => setIsMoreActionsDropdownOpen(isMoreActionsDropdownOpen === product.id ? null : product.id)}
                                        >
                                            <IoEllipsisHorizontal className="w-5 h-5" />
                                        </button>
                                        {isMoreActionsDropdownOpen === product.id && (
                                            <div className="absolute left-5 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10 text-sm text-gray-700">
                                                <button className="flex items-center w-full text-right px-4 py-2 hover:bg-gray-100" onClick={() => handleOpenProductDetails(product)}>
                                                    <IoEyeOutline className="w-5 h-5 ml-2 text-gray-500" />
                                                    عرض التفاصيل
                                                </button>
                                                <button className="flex items-center w-full text-right px-4 py-2 hover:bg-gray-100" onClick={() => handleOpenEditProduct(product)}>
                                                    <IoPencilOutline className="w-5 h-5 ml-2 text-gray-500" />
                                                    تعديل المنتج
                                                </button>
                                                <button className="flex items-center w-full text-right px-4 py-2 hover:bg-gray-100" onClick={handleOpenEditStock}>
                                                    <IoPencilOutline className="w-5 h-5 ml-2 text-gray-500" />
                                                    تعديل المخزون
                                                </button>
                                                <button className="flex items-center w-full text-right px-4 py-2 hover:bg-gray-100" onClick={handleOpenEditPrice}>
                                                    <IoPencilOutline className="w-5 h-5 ml-2 text-gray-500" />
                                                    تعديل السعر
                                                </button>
                                                <button className="flex items-center w-full text-right px-4 py-2 text-red-600 hover:bg-red-50" onClick={handleOpenDeleteModal}>
                                                    <IoTrashOutline className="w-5 h-5 ml-2 text-red-600" />
                                                    حذف المنتج
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{product.category}</td>
                                    <td className="py-3 px-4">
                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusClass(product.status)}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{product.quantity}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{product.price}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{product.hollyPrice}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{product.name}</td>
                                    <td className="py-3 px-4">
                                        <img src={product.image} alt="product" className="w-10 h-10 rounded-md object-cover" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-4 text-gray-500 text-sm">
                    <p>إجمالي المنتجات: 8764</p>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors">
                            <IoChevronDownOutline className="w-4 h-4 rotate-90" />
                        </button>
                        <span className="bg-red-500 text-white px-3 py-1 rounded-md">1</span>
                        <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors">2</button>
                        <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors">3</button>
                        <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors">4</button>
                        <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors">5</button>
                        <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors">
                            <IoChevronUpOutline className="w-4 h-4 rotate-90" />
                        </button>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-sm">عرض في الصفحة</span>
                        <select className="bg-gray-100 text-gray-900 rounded-md px-2 py-1 border border-gray-300">
                            <option>10</option>
                            <option>20</option>
                            <option>50</option>
                        </select>
                    </div>
                </div>
            </div>

            <Modal isOpen={isEditStockModalOpen} onClose={() => setIsEditStockModalOpen(false)}>
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">تعديل المخزون</h2>
                    <div className="mb-4">
                        <input
                            type="number"
                            placeholder="الكمية في المخزون"
                            className="bg-gray-100 w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 text-right"
                            defaultValue="15"
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
                            defaultValue="150 د.ك"
                        />
                        <input
                            type="text"
                            placeholder="السعر بعد الخصم"
                            className="bg-gray-100 w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 text-right"
                            defaultValue="140 د.ك"
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
                        <IoTrashOutline className="w-10 h-10" />
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
                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                        >
                            حذف المنتج
                        </button>
                    </div>
                </div>
            </Modal>

            {isProductDetailsModalOpen && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
                                        <img src={selectedProduct.image} alt="product" className="w-16 h-16 rounded-lg object-cover" />
                                    </span>
                                </div>
                                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                    <span className="w-1/3 text-gray-500 text-right pr-4">السعر</span>
                                    <span className="w-2/3 text-left pl-4 text-gray-900">{selectedProduct.price}</span>
                                </div>
                                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                    <span className="w-1/3 text-gray-500 text-right pr-4">الحالة</span>
                                    <span className="w-2/3 text-left pl-4 text-gray-900">{selectedProduct.status}</span>
                                </div>
                                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                    <span className="w-1/3 text-gray-500 text-right pr-4">المخزون</span>
                                    <span className="w-2/3 text-left pl-4 text-gray-900">{selectedProduct.quantity}</span>
                                </div>
                                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                    <span className="w-1/3 text-gray-500 text-right pr-4">القسم الرئيسي</span>
                                    <span className="w-2/3 text-left pl-4 text-gray-900">{selectedProduct.mainCategory}</span>
                                </div>
                                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                    <span className="w-1/3 text-gray-500 text-right pr-4">القسم الفرعي</span>
                                    <span className="w-2/3 text-left pl-4 text-gray-900">{selectedProduct.subCategory}</span>
                                </div>
                                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                                    <span className="w-1/3 text-gray-500 text-right pr-4">تحديث تلقائي</span>
                                    <span className="w-2/3 text-left pl-4 text-gray-900">نشط</span>
                                </div>
                                <div className="p-2 bg-gray-50 rounded-lg">
                                    <span className="block text-gray-500 text-right pr-4 mb-1">وصف المنتج</span>
                                    <span className="block text-right pr-4 text-gray-900">جهاز محمول حديث من سامسونج</span>
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