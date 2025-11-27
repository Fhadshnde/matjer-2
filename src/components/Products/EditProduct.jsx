import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl, getAuthHeaders, API_CONFIG } from '../../config/api';
import { SketchPicker } from 'react-color';

// المكون الفرعي للنافذة المنبثقة لعرض الصورة الكبيرة
const ImageModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4"
      onClick={onClose} // إغلاق عند الضغط خارج الصورة
    >
      <div 
        className="relative max-w-4xl max-h-full overflow-auto"
        onClick={e => e.stopPropagation()} // منع إغلاق النافذة عند الضغط داخلها
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-3xl font-bold bg-gray-900 rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 transition"
        >
          &times;
        </button>
        <img src={imageUrl} alt="صورة مكبرة" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
      </div>
    </div>
  );
};


const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 
  const { prevPage, prevLimit } = location.state || {};
  const token = localStorage.getItem('token');

  const [product, setProduct] = useState({
    name: '',
    description: '',
    originalPrice: '',
    stock: '',
    categoryId: '',
    sectionId: '',
    mainImageUrl: '',
    wholesalePrice: '',
    isActive: true, 
    colors: [],
    media: []
  });

  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null); // حالة للنافذة المنبثقة

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        if (!id) {
          setMessage('لم يتم تحديد منتج للتعديل.');
          setLoading(false);
          return;
        }

        setLoading(true);

        const [productRes, categoriesRes, sectionsRes] = await Promise.all([
          axios.get(getApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS.DETAILS(id)), { headers: getAuthHeaders() }),
          axios.get(getApiUrl(API_CONFIG.ENDPOINTS.CATEGORIES.LIST), { headers: getAuthHeaders() }),
          axios.get(getApiUrl(API_CONFIG.ENDPOINTS.SECTIONS.LIST), { headers: getAuthHeaders() })
        ]);

        const fetchedProduct = productRes.data;

        setProduct({
          ...fetchedProduct,
          originalPrice: fetchedProduct.originalPrice?.toString() || '',
          stock: fetchedProduct.stock?.toString() || '',
          wholesalePrice: fetchedProduct.wholesalePrice?.toString() || '',
          categoryId: fetchedProduct.categoryId?.toString() || '',
          sectionId: fetchedProduct.sectionId?.toString() || '',
          isActive: fetchedProduct.isActive !== undefined ? fetchedProduct.isActive : true, 
          colors: fetchedProduct.colors || [],
          media: fetchedProduct.media || []
        });

        // تحضير ملفات الميديا الموجودة
        const existingMedia = fetchedProduct.media?.map(m => ({
          url: m.url,
          name: m.url.split('/').pop(),
          isExisting: true,
          file: null // لا يوجد كائن ملف لملفات موجودة
        })) || [];

        setMediaFiles(existingMedia);

        const mainIndex = existingMedia.findIndex(m => m.url === fetchedProduct.mainImageUrl);
        setMainImageIndex(mainIndex >= 0 ? mainIndex : 0);

        setCategories(categoriesRes.data.categories || []);
        setSections(sectionsRes.data.sections || []);
        setMessage('');
      } catch (err) {
        console.error(err);
        setMessage('فشل في تحميل بيانات المنتج.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    
    // وظيفة التنظيف: تحرير عناوين URL المؤقتة
    return () => {
      mediaFiles.forEach(file => {
        if (file.file && file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
      colors: [...prev.colors, { name: '', code: '#FFFFFF', stock: 0, sizes: [{ size: '', stock: 0 }] }]
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

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files).map(file => ({
      file,
      name: file.name,
      isExisting: false,
      preview: URL.createObjectURL(file) // إنشاء URL مؤقت للمعاينة
    }));
    setMediaFiles(prev => [...prev, ...files]);
  };

  const handleDeleteMedia = (index) => {
    const fileToDelete = mediaFiles[index];
    if (fileToDelete.file && fileToDelete.preview) {
      URL.revokeObjectURL(fileToDelete.preview); // تحرير URL المؤقت إذا كان ملف جديد
    }
    
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    if (mainImageIndex === index) setMainImageIndex(0);
    else if (mainImageIndex > index) setMainImageIndex(prev => prev - 1);
  };

  const selectMainImage = (index) => setMainImageIndex(index);

  const getMediaUrl = (file) => {
    return file.isExisting ? file.url : (file.file ? file.preview : '');
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
      console.error(err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setMessage('');

    try {
      // رفع الصور الجديدة فقط والاحتفاظ بعناوين URL للصور الموجودة
      const uploadedMedia = [];
      
      for (let i = 0; i < mediaFiles.length; i++) {
        const file = mediaFiles[i];
        if (file.isExisting) {
          uploadedMedia.push({ url: file.url, type: 'image', isMain: false });
        } else if (file.file) {
          const url = await uploadImage(file.file);
          if (url) {
            uploadedMedia.push({ url, type: 'image', isMain: false });
          }
        }
      }

      // التأكد من أن مؤشر الصورة الرئيسية لا يتجاوز عدد الصور المرفوعة
      const finalMainImageIndex = Math.min(mainImageIndex, uploadedMedia.length - 1);
      
      // تحديد الصورة الرئيسية وتحديث isMain لكل صورة
      const mainUrl = uploadedMedia[finalMainImageIndex]?.url || null;
      
      const mediaPayload = uploadedMedia.map((m, idx) => ({
        ...m,
        isMain: idx === finalMainImageIndex
      }));

      const payload = {
        ...product,
        originalPrice: Number(product.originalPrice),
        stock: Number(product.stock),
        categoryId: Number(product.categoryId),
        sectionId: Number(product.sectionId),
        wholesalePrice: Number(product.wholesalePrice),
        colors: product.colors.map(c => ({
          ...c,
          stock: Number(c.stock),
          sizes: c.sizes.map(s => ({ size: s.size, stock: Number(s.stock) }))
        })),
        mainImageUrl: mainUrl,
        media: mediaPayload
      };

      await axios.put(
        getApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS.UPDATE(id)),
        payload,
        { headers: getAuthHeaders() }
      );

      setMessage('تم تحديث المنتج بنجاح!');
      
      // العودة مع تمرير حالة التصفح عند النجاح
      navigate('/products', { state: { page: prevPage, limit: prevLimit } }); 
      
    } catch (err) {
      console.error(err);
      setMessage('حدث خطأ أثناء تحديث المنتج.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const filteredSections = sections.filter(s => s.categoryId === parseInt(product.categoryId));

  if (loading) return <div className="flex justify-center items-center h-screen text-xl">جاري تحميل بيانات المنتج...</div>;

  return (
    <div className="p-4 min-h-screen rtl:text-right font-sans">
      <div className="container mx-auto bg-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold mb-6">تعديل منتج</h1>
        <form onSubmit={handleSubmit}>

          {/* معلومات المنتج الأساسية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-1 font-medium text-gray-700">اسم المنتج</label>
              <input type="text" name="name" value={product.name} onChange={handleChange} className="w-full border p-2 rounded" required />
              <label className="block mt-2 mb-1 font-medium text-gray-700">وصف المنتج</label>
              <textarea name="description" value={product.description} onChange={handleChange} rows={3} className="w-full border p-2 rounded" required />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">التصنيف الرئيسي</label>
              <select name="categoryId" value={product.categoryId} onChange={(e) => { handleChange(e); setProduct(prev => ({ ...prev, sectionId: '' })); }} className="w-full border p-2 rounded" required>
                <option value="">اختر التصنيف</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
              <label className="block mt-2 mb-1 font-medium text-gray-700">القسم</label>
              <select name="sectionId" value={product.sectionId} onChange={handleChange} className="w-full border p-2 rounded" required disabled={!product.categoryId}>
                <option value="">اختر القسم</option>
                {filteredSections.map(sec => <option key={sec.id} value={sec.id}>{sec.name}</option>)}
              </select>
            </div>
          </div>
          
          {/* حالة المنتج (isActive) */}
          <div className="mb-6">
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="isActive" 
                checked={product.isActive} 
                onChange={handleChange} 
                className="form-checkbox h-5 w-5 text-red-600 rounded" 
              />
              <span className="rtl:mr-3 ltr:ml-3 text-lg font-medium text-gray-900">المنتج فعال/نشط</span>
            </label>
          </div>

          {/* الأسعار والمخزون العام */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block mb-1 font-medium text-gray-700">السعر الأصلي</label>
              <input type="number" name="originalPrice" value={product.originalPrice} onChange={handleChange} className="w-full border p-2 rounded" required />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">سعر الجملة</label>
              <input type="number" name="wholesalePrice" value={product.wholesalePrice} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">المخزون العام</label>
              <input type="number" name="stock" value={product.stock} onChange={handleChange} className="w-full border p-2 rounded" required />
            </div>
          </div>

          {/* الألوان والأحجام */}
          <h2 className="text-xl font-bold mb-4 mt-6">الألوان والأحجام</h2>
          <div className="space-y-6 mb-6 border p-4 rounded-lg bg-gray-50">
            {product.colors.map((color, colorIndex) => (
              <div key={colorIndex} className="p-4 border rounded-lg bg-white shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">اللون {colorIndex + 1}</h3>
                  <button type="button" onClick={() => deleteColor(colorIndex)} className="text-red-500 hover:text-red-700 font-bold">
                    حذف اللون
                  </button>
                </div>
                
                {/* حقول اللون الأساسية */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end">
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">اسم اللون</label>
                        <input type="text" value={color.name} onChange={(e) => handleColorChange(colorIndex, 'name', e.target.value)} className="w-full border p-2 rounded" required />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">رمز اللون (Hex)</label>
                        <input type="text" value={color.code} onChange={(e) => handleColorChange(colorIndex, 'code', e.target.value)} className="w-full border p-2 rounded" required />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">مخزون اللون</label>
                        <input type="number" value={color.stock} onChange={(e) => handleColorChange(colorIndex, 'stock', e.target.value)} className="w-full border p-2 rounded" />
                    </div>
                    <div className="flex justify-start">
                        <div className="border p-1 rounded">
                            <SketchPicker
                                color={color.code}
                                onChangeComplete={(c) => handleColorChange(colorIndex, 'code', c.hex)}
                                presetColors={[]}
                            />
                        </div>
                    </div>
                </div>

                {/* حقول الأحجام */}
                <h4 className="font-medium text-gray-700 mt-4 mb-2">الأحجام الخاصة بهذا اللون:</h4>
                <div className="space-y-2">
                    {color.sizes.map((size, sizeIndex) => (
                        <div key={sizeIndex} className="grid grid-cols-5 gap-4 items-center p-2 bg-gray-100 rounded">
                            <div className="col-span-2">
                                <label className="block mb-1 text-sm text-gray-600">اسم الحجم</label>
                                <input type="text" value={size.size} onChange={(e) => handleSizeChange(colorIndex, sizeIndex, 'size', e.target.value)} className="w-full border p-2 rounded text-sm" required />
                            </div>
                            <div className="col-span-2">
                                <label className="block mb-1 text-sm text-gray-600">مخزون الحجم</label>
                                <input type="number" value={size.stock} onChange={(e) => handleSizeChange(colorIndex, sizeIndex, 'stock', e.target.value)} className="w-full border p-2 rounded text-sm" required />
                            </div>
                            <div className="col-span-1 text-left">
                                <button type="button" onClick={() => deleteSize(colorIndex, sizeIndex)} className="text-red-500 hover:text-red-700 text-sm p-1">
                                    حذف
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={() => addSize(colorIndex)} className="mt-3 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded text-sm">
                  + إضافة حجم جديد
                </button>
              </div>
            ))}
            <button type="button" onClick={addColor} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded w-full">
              + إضافة لون جديد
            </button>
          </div>

          {/* الصور */}
          <h2 className="text-xl font-bold mb-2">صور المنتج</h2>
          <div className="mb-4 flex flex-wrap gap-4">
            {mediaFiles.map((file, index) => (
              // تم تكبير حجم المعاينة وتفعيل النقر
              <div 
                key={index} 
                className={`relative border-2 rounded overflow-hidden cursor-pointer w-64 h-64 ${index === mainImageIndex ? 'border-red-500' : 'border-gray-300'}`}
                onClick={() => setSelectedImage(getMediaUrl(file))}
              >
                <img
                  src={getMediaUrl(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />

                {index === mainImageIndex && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-sm px-2 py-0.5 rounded-bl font-semibold">رئيسية</span>
                )}
                
                <div className="absolute inset-0 flex flex-col justify-end bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity rounded">
                    <div className='flex justify-center gap-1 p-1'>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); selectMainImage(index); }}
                        className="text-white bg-green-600 hover:bg-green-700 text-xs py-1 px-2 rounded transition-colors"
                      >
                        تعيين رئيسية
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleDeleteMedia(index); }}
                        className="text-white bg-red-600 hover:bg-red-700 text-xs py-1 px-2 rounded transition-colors"
                      >
                        حذف
                      </button>
                    </div>
                </div>
              </div>
            ))}

            <div className="border border-dashed rounded flex items-center justify-center w-64 h-64 relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleMediaChange}
                className="w-full h-full opacity-0 cursor-pointer absolute"
              />
              <span className="text-gray-500 z-10">رفع صور جديدة</span>
            </div>
          </div>

          {/* رسالة النجاح أو الخطأ */}
          {message && <p className={`mt-4 text-center ${message.includes('نجاح') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}

          <div className="flex gap-4 mt-6">
            <button type="submit" disabled={updateLoading} className="bg-red-600 hover:bg-red-700 text-white p-3 rounded">
              {updateLoading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/products', { state: { page: prevPage, limit: prevLimit } })}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-3 rounded"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>

      {/* إضافة مكون النافذة المنبثقة هنا */}
      <ImageModal 
        imageUrl={selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />
    </div>
  );
};

export default EditProduct;