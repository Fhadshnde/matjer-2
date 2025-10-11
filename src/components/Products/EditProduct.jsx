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
  const [mainImageIndex, setMainImageIndex] = useState(0);

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
          isActive: fetchedProduct.isActive,
          colors: fetchedProduct.colors || [],
          media: fetchedProduct.media || []
        });

        const existingMedia = fetchedProduct.media?.map(m => ({
          url: m.url,
          name: m.url.split('/').pop(),
          isExisting: true
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

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files).map(file => ({
      file,
      name: file.name,
      isExisting: false
    }));
    setMediaFiles(prev => [...prev, ...files]);
  };

  const handleDeleteMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    if (mainImageIndex === index) setMainImageIndex(0);
    else if (mainImageIndex > index) setMainImageIndex(prev => prev - 1);
  };

  const selectMainImage = (index) => setMainImageIndex(index);

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
      // رفع الصور الجديدة فقط
      const uploadedMedia = await Promise.all(
        mediaFiles.map(async (file) => {
          if (file.isExisting) return { url: file.url, type: 'image', isMain: false };
          const url = await uploadImage(file.file);
          return url ? { url, type: 'image', isMain: false } : null;
        })
      ).then(arr => arr.filter(Boolean));

      const mainUrl = uploadedMedia[mainImageIndex]?.url || (mediaFiles[mainImageIndex]?.url || null);

      // تحديث isMain لكل صورة
      const mediaPayload = uploadedMedia.map((m, idx) => ({
        ...m,
        isMain: idx === mainImageIndex
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

      const res = await axios.put(
        getApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS.UPDATE(id)),
        payload,
        { headers: getAuthHeaders() }
      );

      setMessage('تم تحديث المنتج بنجاح!');
      navigate('/products');
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

          {/* الأسعار والمخزون */}
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
              <label className="block mb-1 font-medium text-gray-700">المخزون</label>
              <input type="number" name="stock" value={product.stock} onChange={handleChange} className="w-full border p-2 rounded" required />
            </div>
          </div>

          {/* الصور */}
{/* الصور */}
<h2 className="text-xl font-bold mb-2">صور المنتج</h2>
<div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
  {mediaFiles.map((file, index) => (
    <div key={index} className="relative border rounded overflow-hidden">
      {/* المعاينة */}
      <img
        src={file.isExisting ? file.url : URL.createObjectURL(file.file)}
        alt={file.name}
        className={`w-full h-32 object-cover ${index === mainImageIndex ? 'border-4 border-green-500' : ''}`}
      />

      {/* أزرار التحكم */}
      <div className="absolute top-1 right-1 flex flex-col gap-1">
        <button
          type="button"
          onClick={() => selectMainImage(index)}
          className="bg-green-500 text-white text-xs px-1 rounded"
        >
          رئيسية
        </button>
        <button
          type="button"
          onClick={() => handleDeleteMedia(index)}
          className="bg-red-500 text-white text-xs px-1 rounded"
        >
          حذف
        </button>
      </div>
    </div>
  ))}

  {/* رفع صور جديدة */}
  <div className="border border-dashed rounded flex items-center justify-center h-32">
    <input
      type="file"
      accept="image/*"
      multiple
      onChange={handleMediaChange}
      className="w-full h-full opacity-0 cursor-pointer absolute"
    />
    <span className="text-gray-500">رفع صور جديدة</span>
  </div>
</div>


          {/* باقي الألوان والمقاسات كما هي */}
          
          {message && <p className={`mt-4 text-center ${message.includes('نجاح') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}

          <div className="flex gap-4 mt-6">
            <button type="submit" disabled={updateLoading} className="bg-red-600 hover:bg-red-700 text-white p-3 rounded">
              {updateLoading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </button>
            <button type="button" onClick={() => navigate('/products')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-3 rounded">
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
