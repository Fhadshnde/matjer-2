import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [images, setImages] = useState([
        { name: 'اسم الصورة', size: '145 KB' },
        { name: 'اسم الصورة', size: '200 KB' },
        { name: 'اسم الصورة', size: '80 KB' },
        { name: 'اسم الصورة', size: '300 KB' },
    ]);

    useEffect(() => {
        if (!id) {
            setError('لم يتم تحديد منتج للتعديل.');
            setLoading(false);
            return;
        }

        const dummyProducts = [
            {
                id: '1',
                name: 'هاتف 1 A15 128GB، سماعات بلوتوت 1x',
                shortDescription: 'جهاز محمول حديث من سامسونج',
                category: 'هاتف محمول',
                price: '154.90 د.ك',
                discountPrice: '130.90 د.ك',
                discountDetails: 'نعم',
                quantity: 15,
                availability: 'متوفر',
            },
            {
                id: '2',
                name: 'هاتف 2 Pro...',
                shortDescription: 'هاتف ذكي متطور',
                category: 'هاتف محمول',
                price: '299.00 د.ك',
                discountPrice: null,
                discountDetails: 'لا',
                quantity: 5,
                availability: 'كمية منخفضة',
            },
        ];

        const foundProduct = dummyProducts.find(p => p.id === id);

        if (foundProduct) {
            setProduct(foundProduct);
            setLoading(false);
        } else {
            setError('المنتج غير موجود.');
            setLoading(false);
        }
    }, [id]);

    const handleUpdate = () => {
        // منطق تحديث المنتج هنا
        // يمكنك استخدام 'product' و 'images'
        // لإرسال البيانات إلى قاعدة البيانات أو الخادم
        console.log("Product to be updated:", product);
        console.log("Images to be updated:", images);
        alert('تم تحديث المنتج بنجاح!');
        navigate('/dashboard');
    };

    const handleDeleteImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleAddImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImages([...images, {
                name: file.name,
                size: `${(file.size / 1024).toFixed(0)} KB`
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
                            <label className="block text-gray-700 text-sm font-medium mb-1">وصف مختصر</label>
                            <input
                                type="text"
                                value={product.shortDescription}
                                onChange={(e) => setProduct({ ...product, shortDescription: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">التصنيف الرئيسي</label>
                            <select
                                value={product.category}
                                onChange={(e) => setProduct({ ...product, category: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                            >
                                <option>هاتف محمول</option>
                                <option>ملحقات</option>
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
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                            >
                                <option>أجهزة</option>
                                <option>شواحن</option>
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
                            <label className="block text-gray-700 text-sm font-medium mb-1">السعر الأساسي</label>
                            <input
                                type="text"
                                value={product.price}
                                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-1">السعر بعد الخصم</label>
                            <input
                                type="text"
                                value={product.discountPrice || ''}
                                onChange={(e) => setProduct({ ...product, discountPrice: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">الكمية</label>
                            <input
                                type="number"
                                value={product.quantity}
                                onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                            />
                        </div>
                    </div>
                    {/* Left Column */}
                    <div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-1">تفصيل خصم</label>
                            <select
                                value={product.discountDetails}
                                onChange={(e) => setProduct({ ...product, discountDetails: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                            >
                                <option>نعم</option>
                                <option>لا</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">حالة التوفر</label>
                            <select
                                value={product.availability}
                                onChange={(e) => setProduct({ ...product, availability: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                            >
                                <option>متوفر</option>
                                <option>كمية منخفضة</option>
                                <option>غير متوفر</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-start gap-4 mt-8">
                    <button
                        onClick={handleUpdate}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors"
                    >
                        حفظ
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
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
