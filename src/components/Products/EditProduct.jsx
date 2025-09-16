import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl, getAuthHeaders, API_CONFIG } from '../../config/api';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sections, setSections] = useState([]);
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        if (!id) {
            setError('لم يتم تحديد منتج للتعديل.');
            setLoading(false);
            return;
        }

        const fetchProductData = async () => {
            try {
                setLoading(true);
                
                // Fetch product details
                const productResponse = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS.DETAILS(id)), {
                    headers: getAuthHeaders()
                });
                
                // Fetch categories and sections
                const [categoriesResponse, sectionsResponse] = await Promise.all([
                    axios.get(getApiUrl(API_CONFIG.ENDPOINTS.CATEGORIES.LIST), {
                        headers: getAuthHeaders()
                    }),
                    axios.get(getApiUrl(API_CONFIG.ENDPOINTS.SECTIONS.LIST), {
                        headers: getAuthHeaders()
                    })
                ]);

                setProduct(productResponse.data);
                setCategories(categoriesResponse.data.categories || []);
                setSections(sectionsResponse.data.sections || []);
                setError(null);
            } catch (error) {
                console.error('Error fetching product data:', error);
                setError('فشل في تحميل بيانات المنتج، يرجى المحاولة لاحقاً.');
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [id]);

    const handleUpdate = async () => {
        try {
            setUpdateLoading(true);
            setError(null);
            
            let imageUrl = product.mainImageUrl;
            
            // Upload new image if exists
            if (images.length > 0 && images[0].file) {
                const formData = new FormData();
                formData.append('file', images[0].file);
                
                const uploadResponse = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.UPLOAD.IMAGE), formData, {
                    headers: {
                        ...getAuthHeaders(),
                        'Content-Type': 'multipart/form-data'
                    }
                });
                
                imageUrl = uploadResponse.data.url;
            }
            
            const productData = {
                name: product.name,
                description: product.description,
                categoryId: parseInt(product.categoryId),
                sectionId: parseInt(product.sectionId),
                price: parseFloat(product.price),
                originalPrice: parseFloat(product.originalPrice),
                stock: parseInt(product.stock),
                isActive: product.isActive,
                mainImageUrl: imageUrl
            };

            await axios.patch(getApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS.UPDATE(id)), productData, {
                headers: getAuthHeaders()
            });

            alert('تم تحديث المنتج بنجاح!');
            navigate('/products');
        } catch (error) {
            console.error('Error updating product:', error);
            setError('فشل في تحديث المنتج، يرجى المحاولة لاحقاً.');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleDeleteImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleAddImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت');
                return;
            }
            
            setImages([...images, {
                name: file.name,
                size: `${(file.size / 1024).toFixed(0)} KB`,
                file: file
            }]);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-xl">جاري تحميل بيانات المنتج...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-xl text-red-500">خطأ: {error}</div>;
    }

    if (!product) {
        return <div className="flex justify-center items-center h-screen text-xl text-red-500">لم يتم العثور على المنتج.</div>;
    }

    return (
        <div className=" p-4 min-h-screen rtl:text-right font-sans">
            <div className="container mx-auto bg-white  rounded-lg ">

                {/* Main Product Info Section */}
                <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">معلومات المنتج الأساسية</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8">
                    {/* Right Column */}
                    <div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-1">اسم المنتج</label>
                            <input
                                type="text"
                                value={product.name}
                                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-1">وصف المنتج</label>
                            <textarea
                                value={product.description}
                                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                rows="3"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">التصنيف الرئيسي</label>
                            <select
                                value={product.categoryId}
                                onChange={(e) => setProduct({ ...product, categoryId: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                            >
                                <option value="">اختر التصنيف</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Left Column */}
                    <div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-1">كود المنتج</label>
                            <input
                                type="text"
                                value={product.id}
                                disabled
                                className="w-full p-2 bg-gray-100 text-gray-500 border border-gray-300 rounded-lg focus:outline-none transition-colors cursor-not-allowed"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-1">التصنيف الفرعي</label>
                            <select
                                value={product.sectionId}
                                onChange={(e) => setProduct({ ...product, sectionId: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                            >
                                <option value="">اختر التصنيف الفرعي</option>
                                {sections.map(section => (
                                    <option key={section.id} value={section.id}>{section.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Product Images Section */}
                <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">صور المنتج</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mb-8">
                    <div className="md:col-span-2">
                        <div className="space-y-4">
                            {images.map((image, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                        <div className="w-8 h-8 flex items-center justify-center text-gray-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium">{image.name}</p>
                                            <span className="text-xs text-gray-500">{image.size}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteImage(index)} className="text-red-500 hover:text-red-700 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <label className="flex items-center justify-center p-3 mt-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleAddImage}
                                multiple
                            />
                            <span className="text-red-600 font-bold flex items-center space-x-2 rtl:space-x-reverse">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                <span>إضافة ملفات أخرى</span>
                            </span>
                        </label>
                    </div>
                </div>

                {/* Pricing and Stock Section */}
                <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">التسعير والمخزون</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8">
                    {/* Right Column */}
                    <div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-1">سعر البيع</label>
                            <input
                                type="number"
                                value={product.price}
                                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                placeholder="سعر البيع"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-1">سعر الجملة</label>
                            <input
                                type="number"
                                value={product.originalPrice || ''}
                                onChange={(e) => setProduct({ ...product, originalPrice: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                placeholder="سعر الجملة"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">الكمية</label>
                            <input
                                type="number"
                                value={product.stock}
                                onChange={(e) => setProduct({ ...product, stock: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                placeholder="الكمية في المخزون"
                            />
                        </div>
                    </div>
                    {/* Left Column */}
                    <div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-1">حالة المنتج</label>
                            <select
                                value={product.isActive}
                                onChange={(e) => setProduct({ ...product, isActive: e.target.value === 'true' })}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                            >
                                <option value={true}>نشط</option>
                                <option value={false}>غير نشط</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-start gap-4 mt-8">
                    <button
                        onClick={handleUpdate}
                        disabled={updateLoading}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors"
                    >
                        {updateLoading ? 'جاري الحفظ...' : 'حفظ'}
                    </button>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg shadow-md transition-colors"
                    >
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;
