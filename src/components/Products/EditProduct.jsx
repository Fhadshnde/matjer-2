import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl, getAuthHeaders, API_CONFIG } from '../../config/api';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [product, setProduct] = useState({
        name: '',
        description: '',
        originalPrice: '',
        price: '',
        stock: '',
        categoryId: '',
        sectionId: '',
        mainImageUrl: '',
        wholesalePrice: '',
        isActive: true,
        colors: [],
        media: []
    });

    const [mainImageFile, setMainImageFile] = useState(null);
    const [mediaFiles, setMediaFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [categories, setCategories] = useState([]);
    const [sections, setSections] = useState([]);

    // جلب بيانات المنتج والفئات والأقسام
    useEffect(() => {
        const fetchProductData = async () => {
            try {
                if (!id) {
                    setMessage('لم يتم تحديد منتج للتعديل.');
                    setLoading(false);
                    return;
                }
                
                setLoading(true);
                const [productResponse, categoriesResponse, sectionsResponse] = await Promise.all([
                    axios.get(getApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS.DETAILS(id)), {
                        headers: getAuthHeaders()
                    }),
                    axios.get(getApiUrl(API_CONFIG.ENDPOINTS.CATEGORIES.LIST), {
                        headers: getAuthHeaders()
                    }),
                    axios.get(getApiUrl(API_CONFIG.ENDPOINTS.SECTIONS.LIST), {
                        headers: getAuthHeaders()
                    })
                ]);
                
                const fetchedProduct = productResponse.data;
                
                // تنسيق البيانات لتتوافق مع حالة المنتج
                const productToSet = {
                    ...fetchedProduct,
                    originalPrice: fetchedProduct.originalPrice.toString(),
                    price: fetchedProduct.price.toString(),
                    stock: fetchedProduct.stock.toString(),
                    wholesalePrice: fetchedProduct.wholesalePrice ? fetchedProduct.wholesalePrice.toString() : '',
                    categoryId: fetchedProduct.categoryId.toString(),
                    sectionId: fetchedProduct.sectionId.toString(),
                    isActive: fetchedProduct.isActive,
                    colors: fetchedProduct.colors || [],
                    media: fetchedProduct.media || []
                };

                // فصل الصورة الرئيسية عن الصور الأخرى
                const mainImage = productToSet.media.find(m => m.isMain);
                const otherMedia = productToSet.media.filter(m => !m.isMain);

                setProduct(productToSet);
                setMainImageFile(mainImage ? { url: mainImage.url, name: mainImage.url.split('/').pop(), isExisting: true } : null);
                setMediaFiles(otherMedia.map(m => ({ url: m.url, name: m.url.split('/').pop(), isExisting: true })));

                setCategories(categoriesResponse.data.categories || []);
                setSections(sectionsResponse.data.sections || []);
                setMessage('');
            } catch (error) {
                console.error('Error fetching product data:', error);
                setMessage('فشل في تحميل بيانات المنتج، يرجى المحاولة لاحقاً.');
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [id]);

    // تحديث حقول المنتج الأساسية
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    // إدارة الألوان والمقاسات
    const handleColorChange = (index, field, value) => {
        const newColors = [...product.colors];
        newColors[index][field] = value;
        setProduct(prev => ({ ...prev, colors: newColors }));
    };

    const handleSizeChange = (colorIndex, sizeIndex, field, value) => {
        const newColors = [...product.colors];
        newColors[colorIndex].sizes[sizeIndex][field] = field === 'stock' ? Number(value) : value;
        setProduct(prev => ({ ...prev, colors: newColors }));
    };

    const addSize = (colorIndex) => {
        const newColors = [...product.colors];
        newColors[colorIndex].sizes.push({ size: '', stock: 0 });
        setProduct(prev => ({ ...prev, colors: newColors }));
    };

    const addColor = () => {
        setProduct(prev => ({
            ...prev,
            colors: [...prev.colors, { name: '', code: '', stock: 0, sizes: [{ size: '', stock: 0 }] }]
        }));
    };

    const deleteColor = (colorIndex) => {
        const newColors = product.colors.filter((_, i) => i !== colorIndex);
        setProduct(prev => ({ ...prev, colors: newColors }));
    };

    const deleteSize = (colorIndex, sizeIndex) => {
        const newColors = [...product.colors];
        newColors[colorIndex].sizes = newColors[colorIndex].sizes.filter((_, i) => i !== sizeIndex);
        setProduct(prev => ({ ...prev, colors: newColors }));
    };

    // إدارة الصور
    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImageFile({ file, name: file.name, isExisting: false });
        }
    };

    const handleMediaChange = (e) => {
        const files = Array.from(e.target.files).map(file => ({
            file,
            name: file.name,
            isExisting: false
        }));
        setMediaFiles(prev => [...prev, ...files]);
    };

    const handleDeleteImage = (fileType, index) => {
        if (fileType === 'main') {
            setMainImageFile(null);
        } else {
            setMediaFiles(prev => prev.filter((_, i) => i !== index));
        }
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        setMessage('');

        try {
            let finalMainImageUrl = mainImageFile && mainImageFile.isExisting ? mainImageFile.url : null;
            if (mainImageFile && mainImageFile.file) {
                const url = await uploadImage(mainImageFile.file);
                if (url) finalMainImageUrl = url;
            }
            
            const mediaUrls = await Promise.all(
                mediaFiles.map(async (file) => {
                    if (file.isExisting) return { url: file.url, type: 'image', isMain: false };
                    const url = await uploadImage(file.file);
                    return url ? { url, type: 'image', isMain: false } : null;
                })
            ).then(urls => urls.filter(Boolean));

            const payload = {
                ...product,
                originalPrice: Number(product.originalPrice),
                price: Number(product.price),
                stock: Number(product.stock),
                categoryId: Number(product.categoryId),
                sectionId: Number(product.sectionId),
                wholesalePrice: Number(product.wholesalePrice),
                colors: product.colors.map(c => ({
                    ...c,
                    stock: Number(c.stock),
                    sizes: c.sizes.map(s => ({ size: s.size, stock: Number(s.stock) }))
                })),
                mainImageUrl: finalMainImageUrl,
                media: [{ url: finalMainImageUrl, type: 'image', isMain: true }, ...mediaUrls].filter(m => m.url)
            };

            const response = await axios.patch(
                getApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS.UPDATE(id)),
                payload,
                {
                    headers: getAuthHeaders()
                }
            );

            setMessage('تم تحديث المنتج بنجاح!');
            console.log(response.data);
            navigate('/products');
        } catch (err) {
            console.error(err.response || err);
            setMessage('حدث خطأ أثناء تحديث المنتج.');
        } finally {
            setUpdateLoading(false);
        }
    };

    const filteredSections = sections.filter(section =>
        section.categoryId === parseInt(product.categoryId)
    );

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-xl">جاري تحميل بيانات المنتج...</div>;
    }

    return (
        <div className="p-4 min-h-screen rtl:text-right font-sans">
            <div className="container mx-auto bg-white p-2 shadow-lg">
                <h1 className="text-2xl font-bold mb-6">تعديل منتج</h1>
                <form onSubmit={handleSubmit}>

                    {/* معلومات المنتج الأساسية */}
                    <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">معلومات المنتج الأساسية</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8">
                        <div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-1">اسم المنتج</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={product.name}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-1">وصف المنتج</label>
                                <textarea
                                    name="description"
                                    value={product.description}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                    rows="3"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-1">التصنيف الرئيسي</label>
                                <select
                                    name="categoryId"
                                    value={product.categoryId}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setProduct(prev => ({ ...prev, sectionId: '' }));
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                    required
                                >
                                    <option value="">اختر التصنيف</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-1">التصنيف الفرعي</label>
                                <select
                                    name="sectionId"
                                    value={product.sectionId}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                    disabled={!product.categoryId}
                                    required
                                >
                                    <option value="">اختر التصنيف الفرعي</option>
                                    {filteredSections.map(section => (
                                        <option key={section.id} value={section.id}>{section.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-1">حالة المنتج</label>
                                <select
                                    name="isActive"
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

                    {/* صور المنتج */}
                    <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">صور المنتج</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mb-8">
                        <div className="md:col-span-2">
                            <div className="space-y-4">
                                {mainImageFile && (
                                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                            <div className="w-8 h-8 flex items-center justify-center text-gray-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium">الصورة الرئيسية: {mainImageFile.name}</p>
                                                {mainImageFile.size && <span className="text-xs text-gray-500">{(mainImageFile.size / 1024).toFixed(1)} KB</span>}
                                                {mainImageFile.isExisting && <span className="text-xs text-blue-500"> (موجودة حاليًا)</span>}
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => handleDeleteImage('main')} className="text-red-500 hover:text-red-700 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                                {mediaFiles.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                            <div className="w-8 h-8 flex items-center justify-center text-gray-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium">{file.name}</p>
                                                {file.size && <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>}
                                                {file.isExisting && <span className="text-xs text-blue-500"> (موجودة حاليًا)</span>}
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => handleDeleteImage('media', index)} className="text-red-500 hover:text-red-700 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col gap-4 mt-4">
                                <label className="flex items-center justify-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleMainImageChange}
                                    />
                                    <span className="text-red-600 font-bold flex items-center space-x-2 rtl:space-x-reverse">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        <span>تغيير الصورة الرئيسية</span>
                                    </span>
                                </label>
                                <label className="flex items-center justify-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleMediaChange}
                                    />
                                    <span className="text-red-600 font-bold flex items-center space-x-2 rtl:space-x-reverse">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        <span>إضافة صور أخرى</span>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* التسعير والمخزون */}
                    <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">التسعير والمخزون</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8">
                        <div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-1">السعر الأصلي</label>
                                <input
                                    type="number"
                                    name="originalPrice"
                                    value={product.originalPrice}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                    placeholder="السعر الأصلي"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-1">السعر الحالي</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={product.price}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                    placeholder="السعر الحالي"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-1">المخزون</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={product.stock}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                    placeholder="المخزون"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-1">سعر الجملة</label>
                                <input
                                    type="number"
                                    name="wholesalePrice"
                                    value={product.wholesalePrice}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                    placeholder="سعر الجملة"
                                />
                            </div>
                        </div>
                    </div>

                    {/* الألوان والمقاسات */}
                    <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">الألوان والمقاسات</h2>
                    <div className="space-y-4 mb-8">
                        {product.colors.map((color, colorIndex) => (
                            <div key={colorIndex} className="border border-gray-300 p-4 rounded-lg space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input
                                        type="text"
                                        placeholder="اسم اللون"
                                        value={color.name}
                                        onChange={(e) => handleColorChange(colorIndex, 'name', e.target.value)}
                                        className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="كود اللون"
                                        value={color.code}
                                        onChange={(e) => handleColorChange(colorIndex, 'code', e.target.value)}
                                        className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                    <input
                                        type="number"
                                        placeholder="المخزون الكلي للون"
                                        value={color.stock}
                                        onChange={(e) => handleColorChange(colorIndex, 'stock', Number(e.target.value))}
                                        className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-medium text-gray-700 flex justify-between items-center">
                                        <span>المقاسات</span>
                                        <button type="button" onClick={() => addSize(colorIndex)} className="text-blue-500 hover:text-blue-700 transition-colors text-sm font-normal">
                                            + إضافة مقاس
                                        </button>
                                    </h3>
                                    {color.sizes.map((size, sizeIndex) => (
                                        <div key={sizeIndex} className="flex items-center gap-4">
                                            <input
                                                type="text"
                                                placeholder="المقاس (مثل: S, M, L)"
                                                value={size.size}
                                                onChange={(e) => handleSizeChange(colorIndex, sizeIndex, 'size', e.target.value)}
                                                className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-1/2"
                                            />
                                            <input
                                                type="number"
                                                placeholder="الكمية في المخزون"
                                                value={size.stock}
                                                onChange={(e) => handleSizeChange(colorIndex, sizeIndex, 'stock', e.target.value)}
                                                className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-1/2"
                                            />
                                            <button type="button" onClick={() => deleteSize(colorIndex, sizeIndex)} className="text-red-500 hover:text-red-700 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end">
                                    <button type="button" onClick={() => deleteColor(colorIndex)} className="text-red-500 hover:text-red-700 transition-colors text-sm">
                                        حذف هذا اللون
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addColor} className="text-red-600 font-bold hover:text-red-800 transition-colors">
                            + إضافة لون
                        </button>
                    </div>

                    {/* رسالة الخطأ أو النجاح */}
                    {message && (
                        <p className={`mt-4 text-center ${message.includes('بنجاح') ? 'text-green-600' : 'text-red-600'}`}>
                            {message}
                        </p>
                    )}

                    {/* أزرار الإجراءات */}
                    <div className="flex justify-start gap-4 mt-8">
                        <button
                            type="submit"
                            className={`bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors`}
                            disabled={updateLoading}
                        >
                            {updateLoading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/products')}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg shadow-md transition-colors"
                        >
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;