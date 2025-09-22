import React, { useState, useEffect } from 'react';
import { IoAdd, IoPencilOutline, IoTrashOutline, IoEyeOutline, IoEllipsisHorizontal, IoSearchOutline, IoChevronUpOutline, IoChevronDownOutline, IoImageOutline, IoCloudUploadOutline } from 'react-icons/io5';
import { getApiUrl, getAuthHeaders, API_CONFIG } from '../../config/api';
import axios from 'axios';

const CategoriesPage = () => {
    const [isAddMainCategoryModalOpen, setIsAddMainCategoryModalOpen] = useState(false);
    const [isEditMainCategoryModalOpen, setIsEditMainCategoryModalOpen] = useState(false);
    const [isAddSubCategoryModalOpen, setIsAddSubCategoryModalOpen] = useState(false);
    const [isEditSubCategoryModalOpen, setIsEditSubCategoryModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isImageUploadModalOpen, setIsImageUploadModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryType, setCategoryType] = useState('');
    const [sectionsData, setSectionsData] = useState([]);
    const [categoriesData, setCategoriesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('sections');
    const [expandedCategories, setExpandedCategories] = useState(new Set());
    const [uploadingImage, setUploadingImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [sectionsResponse, categoriesResponse] = await Promise.all([
                    axios.get(getApiUrl(API_CONFIG.ENDPOINTS.SECTIONS.LIST), { headers: getAuthHeaders() }),
                    axios.get(getApiUrl(API_CONFIG.ENDPOINTS.CATEGORIES.LIST), { headers: getAuthHeaders() })
                ]);

                setSectionsData(sectionsResponse.data.sections || []);
                setCategoriesData(categoriesResponse.data.categories || []);
                setError(null);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('فشل في تحميل البيانات');
                setSectionsData([]);
                setCategoriesData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await axios.post(
                'https://products-api.cbc-apps.net/supplier/upload/image',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return res.data.url;
        } catch (err) {
            console.error('خطأ رفع الصورة:', err.response || err);
            return null;
        }
    };

    const handleAddSection = async (sectionData, imageFile) => {
        try {
            let imageUrl = '';
            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
                if (!imageUrl) {
                    return { success: false, message: 'فشل في رفع الصورة' };
                }
            }
            
            const payload = { ...sectionData, image: imageUrl };
            
            await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.SECTIONS.ADD), payload, {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                }
            });
            
            const fetchResponse = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.SECTIONS.LIST), {
                headers: getAuthHeaders()
            });
            
            setSectionsData(fetchResponse.data.sections || []);
            setIsAddSubCategoryModalOpen(false);
            return { success: true, message: 'تم إضافة القسم بنجاح' };
        } catch (error) {
            console.error('Error adding section:', error);
            return { success: false, message: 'فشل في إضافة القسم' };
        }
    };

    const handleAddCategory = async (categoryData, imageFile) => {
        try {
            let imageUrl = '';
            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
                if (!imageUrl) {
                    return { success: false, message: 'فشل في رفع الصورة' };
                }
            }

            const payload = { ...categoryData, image: imageUrl };

            await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.CATEGORIES.ADD), payload, {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                }
            });
            
            const fetchResponse = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.CATEGORIES.LIST), {
                headers: getAuthHeaders()
            });
            
            setCategoriesData(fetchResponse.data.categories || []);
            setIsAddMainCategoryModalOpen(false);
            return { success: true, message: 'تم إضافة الفئة بنجاح' };
        } catch (error) {
            console.error('Error adding category:', error);
            return { success: false, message: 'فشل في إضافة الفئة' };
        }
    };

    const handleUpdateSection = async (sectionId, sectionData) => {
        try {
            const response = await axios.patch(getApiUrl(API_CONFIG.ENDPOINTS.SECTIONS.EDIT(sectionId)), sectionData, {
                headers: getAuthHeaders()
            });
            
            const fetchResponse = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.SECTIONS.LIST), {
                headers: getAuthHeaders()
            });
            
            setSectionsData(fetchResponse.data.sections || []);
            setIsEditSubCategoryModalOpen(false);
            return { success: true, message: 'تم تحديث القسم بنجاح' };
        } catch (error) {
            console.error('Error updating section:', error);
            return { success: false, message: 'فشل في تحديث القسم' };
        }
    };

    const handleUpdateCategory = async (categoryId, categoryData) => {
        try {
            const response = await axios.patch(getApiUrl(API_CONFIG.ENDPOINTS.CATEGORIES.EDIT(categoryId)), categoryData, {
                headers: getAuthHeaders()
            });
            
            const fetchResponse = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.CATEGORIES.LIST), {
                headers: getAuthHeaders()
            });
            
            setCategoriesData(fetchResponse.data.categories || []);
            setIsEditMainCategoryModalOpen(false);
            return { success: true, message: 'تم تحديث الفئة بنجاح' };
        } catch (error) {
            console.error('Error updating category:', error);
            return { success: false, message: 'فشل في تحديث الفئة' };
        }
    };

    const handleDeleteSection = async (sectionId) => {
        try {
            const response = await axios.delete(getApiUrl(API_CONFIG.ENDPOINTS.SECTIONS.DELETE(sectionId)), {
                headers: getAuthHeaders()
            });
            
            const fetchResponse = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.SECTIONS.LIST), {
                headers: getAuthHeaders()
            });
            
            setSectionsData(fetchResponse.data.sections || []);
            setIsDeleteModalOpen(false);
            return { success: true, message: 'تم حذف القسم بنجاح' };
        } catch (error) {
            console.error('Error deleting section:', error);
            return { success: false, message: 'فشل في حذف القسم' };
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            const response = await axios.delete(getApiUrl(API_CONFIG.ENDPOINTS.CATEGORIES.DELETE(categoryId)), {
                headers: getAuthHeaders()
            });
            
            const fetchResponse = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.CATEGORIES.LIST), {
                headers: getAuthHeaders()
            });
            
            setCategoriesData(fetchResponse.data.categories || []);
            setIsDeleteModalOpen(false);
            return { success: true, message: 'تم حذف الفئة بنجاح' };
        } catch (error) {
            console.error('Error deleting category:', error);
            return { success: false, message: 'فشل في حذف الفئة' };
        }
    };

    const handleImageUpload = async (file, type, id) => {
        try {
            setUploadingImage(true);
            const imageUrl = await uploadImage(file);
            if (!imageUrl) {
                return { success: false, message: 'فشل في رفع الصورة' };
            }

            const endpoint = type === 'category' 
                ? `categories/${id}`
                : `sections/${id}`;

            const payload = { image: imageUrl };

            const response = await axios.patch(getApiUrl(`/supplier/${endpoint}`), payload, {
                headers: getAuthHeaders()
            });

            const [sectionsResponse, categoriesResponse] = await Promise.all([
                axios.get(getApiUrl(API_CONFIG.ENDPOINTS.SECTIONS.LIST), { headers: getAuthHeaders() }),
                axios.get(getApiUrl(API_CONFIG.ENDPOINTS.CATEGORIES.LIST), { headers: getAuthHeaders() })
            ]);

            setSectionsData(sectionsResponse.data.sections || []);
            setCategoriesData(categoriesResponse.data.categories || []);
            setIsImageUploadModalOpen(false);
            setSelectedImage(null);

            return { success: true, message: 'تم رفع الصورة بنجاح' };
        } catch (error) {
            console.error('Error uploading image:', error);
            return { success: false, message: 'فشل في رفع الصورة' };
        } finally {
            setUploadingImage(false);
        }
    };

    const openAddModal = (type) => {
        setSelectedCategory(null);
        if (type === 'main') {
            setIsAddMainCategoryModalOpen(true);
        } else {
            setIsAddSubCategoryModalOpen(true);
        }
    };

    const openEditModal = (category, type) => {
        setSelectedCategory(category);
        setCategoryType(type);
        if (type === 'main') {
            setIsEditMainCategoryModalOpen(true);
        } else {
            setIsEditSubCategoryModalOpen(true);
        }
    };

    const openDeleteModal = (category, type) => {
        setSelectedCategory(category);
        setCategoryType(type);
        setIsDeleteModalOpen(true);
    };

    const openImageUploadModal = (category, type) => {
        setSelectedCategory(category);
        setCategoryType(type);
        setIsImageUploadModalOpen(true);
    };

    const closeModal = () => {
        setIsAddMainCategoryModalOpen(false);
        setIsEditMainCategoryModalOpen(false);
        setIsAddSubCategoryModalOpen(false);
        setIsEditSubCategoryModalOpen(false);
        setIsDeleteModalOpen(false);
        setIsImageUploadModalOpen(false);
        setSelectedCategory(null);
        setCategoryType('');
        setSelectedImage(null);
    };

    const toggleCategoryExpansion = (categoryId) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    const filteredSections = sectionsData.filter(section =>
        section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredCategories = categoriesData.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const Modal = ({ isOpen, onClose, children }) => {
        if (!isOpen) return null;
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative font-['Tajawal']">
                    <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                    {children}
                </div>
            </div>
        );
    };

    const CategoryForm = ({ category, type, isEdit }) => {
        const [formData, setFormData] = useState({
            name: isEdit ? category?.name || '' : '',
            description: isEdit ? category?.description || '' : '',
            categoryId: isEdit ? category?.categoryId || '' : ''
        });
        const [selectedFile, setSelectedFile] = useState(null);

        const handleFileChange = (e) => {
            const file = e.target.files[0];
            setSelectedFile(file);
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                if (type === 'main') {
                    if (isEdit) {
                        await handleUpdateCategory(category.id, formData);
                    } else {
                        await handleAddCategory(formData, selectedFile);
                    }
                } else {
                    if (isEdit) {
                        await handleUpdateSection(category.id, formData);
                    } else {
                        // التعديل هنا: تحويل categoryId إلى رقم صحيح قبل الإرسال
                        const dataToSend = {
                            ...formData,
                            categoryId: parseInt(formData.categoryId)
                        };
                        await handleAddSection(dataToSend, selectedFile);
                    }
                }
                closeModal();
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        };

        return (
            <div className="text-right">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                    {isEdit ? `تعديل ${type === 'main' ? 'الفئة' : 'القسم'}` : `إضافة ${type === 'main' ? 'فئة' : 'قسم'}`}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="الاسم"
                        className="bg-gray-100 w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 text-right"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                    />
                    {type === 'sub' && (
                        <select
                            className="bg-gray-100 w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 text-right"
                            value={formData.categoryId}
                            onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                            required
                        >
                            <option value="">اختر الفئة</option>
                            {categoriesData.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    )}
                    <textarea
                        placeholder="الوصف"
                        className="bg-gray-100 w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 text-right"
                        rows="4"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                    
                    {!isEdit && (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-input"
                            />
                            <label htmlFor="file-input" className="cursor-pointer">
                                <IoCloudUploadOutline className="w-10 h-10 text-gray-400 mx-auto" />
                                <p className="text-sm text-gray-500 mt-2">
                                    {selectedFile ? `تم تحديد: ${selectedFile.name}` : "انقر لاختيار صورة"}
                                </p>
                            </label>
                        </div>
                    )}
                    
                    <div className="flex justify-center mt-6 space-x-4 rtl:space-x-reverse">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                        >
                            {isEdit ? 'تعديل' : 'إضافة'}
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    const ImageUploadModal = ({ isOpen, onClose, category, type }) => {
        const handleFileSelect = (e) => {
            const file = e.target.files[0];
            if (file) {
                setSelectedImage(file);
            }
        };

        const handleUpload = async () => {
            if (selectedImage) {
                await handleImageUpload(selectedImage, type, category.id);
            }
        };

        if (!isOpen) return null;
        return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <div className="text-right">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">
                        رفع صورة {type === 'main' ? 'الفئة' : 'القسم'}
                    </h2>
                    <div className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <IoCloudUploadOutline className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                اختر صورة
                            </label>
                            {selectedImage && (
                                <p className="mt-2 text-sm text-gray-600">
                                    الملف المحدد: {selectedImage.name}
                                </p>
                            )}
                        </div>
                        <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                            <button
                                onClick={onClose}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={!selectedImage || uploadingImage}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploadingImage ? 'جاري الرفع...' : 'رفع الصورة'}
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    };

    const DeleteModal = ({ isOpen, onClose, category, type }) => {
        const handleDelete = async () => {
            try {
                if (type === 'main') {
                    await handleDeleteCategory(category.id);
                } else {
                    await handleDeleteSection(category.id);
                }
            } catch (error) {
                console.error('Error deleting:', error);
            }
        };

        if (!isOpen) return null;
        return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <div className="flex flex-col items-center text-center">
                    <div className="bg-red-100 text-red-600 p-4 rounded-full mb-4">
                        <IoTrashOutline className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold mt-2 text-gray-800">هل أنت متأكد أنك تريد حذف هذا العنصر؟</h3>
                    <p className="text-sm text-gray-500 mt-2">
                        سوف يتم حذف {type === 'main' ? 'الفئة' : 'القسم'} "<span className="font-semibold">{category?.name}</span>" بشكل نهائي.
                    </p>
                    <div className="flex justify-center space-x-4 rtl:space-x-reverse mt-6 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                        >
                            حذف
                        </button>
                    </div>
                </div>
            </Modal>
        );
    };

    if (loading) {
        return (
            <div className="bg-gray-100 min-h-screen p-6 font-['Tajawal'] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">جاري تحميل البيانات...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-100 min-h-screen p-6 font-['Tajawal'] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen p-8 text-right font-['Tajawal']" dir="rtl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">إدارة الأقسام والفئات</h1>
                <p className="text-gray-600">تنظيم وإدارة أقسام المنتجات وفئاتها</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="ابحث..."
                                className="bg-gray-100 text-gray-700 px-4 py-2 pr-10 rounded-lg w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-red-500 text-right"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <IoSearchOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <select
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                        >
                            <option value="sections">الأقسام</option>
                            <option value="categories">الفئات</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center"
                            onClick={() => openAddModal('sub')}
                        >
                            <IoAdd className="w-5 h-5 ml-2" />
                            إضافة قسم
                        </button>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center"
                            onClick={() => openAddModal('main')}
                        >
                            <IoAdd className="w-5 h-5 ml-2" />
                            إضافة فئة
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">إجمالي الفئات</p>
                            <p className="text-2xl font-bold text-gray-800">{categoriesData.length}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <IoEllipsisHorizontal className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">إجمالي الأقسام</p>
                            <p className="text-2xl font-bold text-gray-800">{sectionsData.length}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <IoEllipsisHorizontal className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">إجمالي المنتجات</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {categoriesData.reduce((sum, cat) => sum + cat.productsCount, 0)}
                            </p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                            <IoEllipsisHorizontal className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6">الفئات الرئيسية</h2>
                <div className="space-y-4">
                    {filteredCategories.map((category) => (
                        <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                        {category.image ? (
                                            <img src={category.image} alt={category.name} className="w-12 h-12 rounded-lg object-cover" />
                                        ) : (
                                            <span className="text-gray-500 font-bold text-lg">
                                                {category.name.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{category.name}</h3>
                                        <p className="text-sm text-gray-500">{category.description}</p>
                                        <div className="flex items-center space-x-4 rtl:space-x-reverse mt-1">
                                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                                {category.sectionsCount} أقسام
                                            </span>
                                            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                                                {category.productsCount} منتجات
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <button
                                        className="text-purple-500 hover:text-purple-700 p-2"
                                        onClick={() => openImageUploadModal(category, 'main')}
                                        title="رفع صورة"
                                    >
                                        <IoImageOutline className="w-5 h-5" />
                                    </button>
                                    <button
                                        className="text-blue-500 hover:text-blue-700 p-2"
                                        onClick={() => openEditModal(category, 'main')}
                                        title="تعديل"
                                    >
                                        <IoPencilOutline className="w-5 h-5" />
                                    </button>
                                    {/* <button
                                        className="text-red-500 hover:text-red-700 p-2"
                                        onClick={() => openDeleteModal(category, 'main')}
                                        title="حذف"
                                    >
                                        <IoTrashOutline className="w-5 h-5" />
                                    </button> */}
                                    {category.sectionsCount > 0 && (
                                        <button
                                            className="text-gray-500 hover:text-gray-700 p-2"
                                            onClick={() => toggleCategoryExpansion(category.id)}
                                            title="عرض الأقسام"
                                        >
                                            {expandedCategories.has(category.id) ? 
                                                <IoChevronUpOutline className="w-5 h-5" /> : 
                                                <IoChevronDownOutline className="w-5 h-5" />
                                            }
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {expandedCategories.has(category.id) && category.sections && category.sections.length > 0 && (
                                <div className="mt-4 border-t border-gray-200 pt-4">
                                    <h4 className="text-sm font-semibold text-gray-600 mb-3">أقسام هذه الفئة:</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {category.sections.map((section) => (
                                            <div key={section.id} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                                                <span className="text-sm text-gray-700">{section.name}</span>
                                                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                                                    <button
                                                        className="text-blue-500 hover:text-blue-700 p-1"
                                                        onClick={() => openEditModal(section, 'sub')}
                                                        title="تعديل"
                                                    >
                                                        <IoPencilOutline className="w-4 h-4" />
                                                    </button>
                                                    {/* <button
                                                        className="text-red-500 hover:text-red-700 p-1"
                                                        onClick={() => openDeleteModal(section, 'sub')}
                                                        title="حذف"
                                                    >
                                                        <IoTrashOutline className="w-4 h-4" />
                                                    </button> */}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-6">جميع الأقسام</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-right bg-white">
                        <thead>
                            <tr className="border-b border-gray-300">
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm text-center">الإجراءات</th>
                                {/* <th className="py-3 px-4 text-gray-500 font-normal text-sm">الصورة</th> */}
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm">عدد المنتجات</th>
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm">الفئة</th>
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm">اسم القسم</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSections.map((section) => (
                                <tr key={section.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex justify-center items-center space-x-2 rtl:space-x-reverse">
                                            {/* <button
                                                className="text-purple-500 hover:text-purple-700 p-1"
                                                onClick={() => openImageUploadModal(section, 'sub')}
                                                title="رفع صورة"
                                            >
                                                <IoImageOutline className="w-5 h-5" />
                                            </button> */}
                                            <button
                                                className="text-blue-500 hover:text-blue-700 p-1"
                                                onClick={() => openEditModal(section, 'sub')}
                                                title="تعديل"
                                            >
                                                <IoPencilOutline className="w-5 h-5" />
                                            </button>
                                            {/* <button
                                                className="text-red-500 hover:text-red-700 p-1"
                                                onClick={() => openDeleteModal(section, 'sub')}
                                                title="حذف"
                                            >
                                                <IoTrashOutline className="w-5 h-5" />
                                            </button> */}
                                        </div>
                                    </td>
                                    {/* <td className="py-3 px-4">
                                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                            {section.image ? (
                                                <img src={section.image} alt={section.name} className="w-10 h-10 rounded-lg object-cover" />
                                            ) : (
                                                <span className="text-gray-500 font-bold text-sm">
                                                    {section.name.charAt(0)}
                                                </span>
                                            )}
                                        </div>
                                    </td> */}
                                    <td className="py-3 px-4 text-sm text-gray-800">
                                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                                            {section.productsCount}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{section.categoryName}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800 font-medium">{section.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isAddMainCategoryModalOpen || isEditMainCategoryModalOpen} onClose={closeModal}>
                <CategoryForm
                    category={selectedCategory}
                    type="main"
                    isEdit={isEditMainCategoryModalOpen}
                />
            </Modal>
            
            <Modal isOpen={isAddSubCategoryModalOpen || isEditSubCategoryModalOpen} onClose={closeModal}>
                <CategoryForm
                    category={selectedCategory}
                    type="sub"
                    isEdit={isEditSubCategoryModalOpen}
                />
            </Modal>

            <DeleteModal isOpen={isDeleteModalOpen} onClose={closeModal} category={selectedCategory} type={categoryType} />

            <ImageUploadModal isOpen={isImageUploadModalOpen} onClose={closeModal} category={selectedCategory} type={categoryType} />
        </div>
    );
};

export default CategoriesPage;