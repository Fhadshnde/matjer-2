import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl, getAuthHeaders, API_CONFIG } from '../../config/api';
import { SketchPicker } from 'react-color';

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

                setProduct(productToSet);
                if (fetchedProduct.mainImageUrl) {
                    setMainImageFile({ url: fetchedProduct.mainImageUrl, name: fetchedProduct.mainImageUrl.split('/').pop(), isExisting: true });
                }
                if (fetchedProduct.media && fetchedProduct.media.length > 0) {
                    setMediaFiles(fetchedProduct.media.map(m => ({ url: m.url, name: m.url.split('/').pop(), isExisting: true })));
                }

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

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
                media: mediaUrls
            };

            const response = await axios.put(
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
                                <label className="block text-gray-700 text-sm font-medium mb-1">القسم</label>
                                <select
                                    name="sectionId"
                                    value={product.sectionId}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                    required
                                    disabled={!product.categoryId}
                                >
                                    <option value="">اختر القسم</option>
                                    {filteredSections.map(section => (
                                        <option key={section.id} value={section.id}>{section.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">الأسعار والكمية</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8">
                        {/* <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-1">السعر الأصلي</label>
                            <input
                                type="number"
                                name="originalPrice"
                                value={product.originalPrice}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                required
                            />
                        </div> */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-1">السعر</label>
                            <input
                                type="number"
                                name="price"
                                value={product.originalPrice}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                required
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
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-1">كمية المخزون</label>
                            <input
                                type="number"
                                name="stock"
                                value={product.stock}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                required
                            />
                        </div>
                        {/* <div className="col-span-1">
                            <label className="block text-gray-700 text-sm font-medium mb-1">حالة المنتج</label>
                            <div className="flex items-center mt-2">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={product.isActive}
                                    onChange={(e) => setProduct(prev => ({ ...prev, isActive: e.target.checked }))}
                                    className="h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                />
                                <span className="ml-2 text-gray-700">منتج نشط</span>
                            </div>
                        </div> */}
                    </div>

                    <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">الصور</h2>

                    <div className="mb-8">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            الصورة الرئيسية
                        </label>
                        <input
                            type="file"
                            onChange={handleMainImageChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                            accept="image/*"
                        />
                        {mainImageFile && (
                            <div className="mt-4 flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-lg p-4">
                                <img
                                    src={mainImageFile.isExisting ? mainImageFile.url : URL.createObjectURL(mainImageFile.file)}
                                    alt="Main Product"
                                    className="max-h-64 object-contain rounded-lg mb-2"
                                />
                                <span className="text-sm text-gray-600 mb-2">{mainImageFile.name}</span>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteImage('main')}
                                    className="text-red-500 hover:text-red-700 transition-colors text-sm"
                                >
                                    حذف
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="mb-8">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            صور إضافية للمنتج
                        </label>
                        <input
                            type="file"
                            multiple
                            onChange={handleMediaChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                            accept="image/*"
                        />
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {mediaFiles.map((file, index) => (
                                <div key={index} className="relative group overflow-hidden rounded-lg shadow-md">
                                    <img
                                        src={file.isExisting ? file.url : URL.createObjectURL(file.file)}
                                        alt={`Product media ${index + 1}`}
                                        className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteImage('media', index)}
                                            className="text-white text-3xl hover:text-red-500"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">الألوان والمقاسات</h2>
                    <div className="space-y-6 mb-8">
                        {product.colors.map((color, colorIndex) => (
                            <div key={colorIndex} className="p-4 border border-gray-200 rounded-lg relative">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-medium mb-1">اسم اللون</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={color.name}
                                            onChange={(e) => handleColorChange(colorIndex, 'name', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-medium mb-1">كود اللون</label>
                                        <input
                                            type="text"
                                            name="code"
                                            value={color.code}
                                            onChange={(e) => handleColorChange(colorIndex, 'code', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                    </div>
                                    <div className="flex items-center justify-center mt-6 md:mt-0">
                                        <SketchPicker
                                            color={color.code}
                                            onChangeComplete={(color) => handleColorChange(colorIndex, 'code', color.hex)}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 p-4 border border-gray-300 rounded-lg">
                                    <h4 className="text-lg font-bold mb-2">المقاسات</h4>
                                    <div className="space-y-2">
                                        {color.sizes.map((size, sizeIndex) => (
                                            <div key={sizeIndex} className="grid grid-cols-2 gap-4 items-center">
                                                <div>
                                                    <label className="block text-gray-700 text-xs font-medium mb-1">المقاس</label>
                                                    <input
                                                        type="text"
                                                        value={size.size}
                                                        onChange={(e) => handleSizeChange(colorIndex, sizeIndex, 'size', e.target.value)}
                                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 text-xs font-medium mb-1">الكمية</label>
                                                    <input
                                                        type="number"
                                                        value={size.stock}
                                                        onChange={(e) => handleSizeChange(colorIndex, sizeIndex, 'stock', e.target.value)}
                                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteSize(colorIndex, sizeIndex)}
                                                    className="text-red-500 hover:text-red-700 transition-colors text-sm col-span-2"
                                                >
                                                    حذف المقاس
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => addSize(colorIndex)}
                                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                                        >
                                            + إضافة مقاس
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <button
                                        type="button"
                                        onClick={() => deleteColor(colorIndex)}
                                        className="text-red-500 hover:text-red-700 transition-colors text-sm"
                                    >
                                        حذف هذا اللون
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addColor} className="text-red-600 font-bold hover:text-red-800 transition-colors">
                            + إضافة لون
                        </button>
                    </div>

                    {message && (
                        <p className={`mt-4 text-center ${message.includes('بنجاح') ? 'text-green-600' : 'text-red-600'}`}>
                            {message}
                        </p>
                    )}

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