import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuthHeaders } from '../../config/api';
import { SketchPicker } from 'react-color';

const AddProduct = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [product, setProduct] = useState({
    name: '',
    description: '',
    originalPrice: '',
    stock: '',
    categoryId: '',
    sectionId: '',
    wholesalePrice: '',
    isActive: true,
    colors: [],
    mainImageUrl: '',
    media: []
  });

  const [filesToUpload, setFilesToUpload] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoriesResponse = await axios.get(
          'https://products-api.cbc-apps.net/supplier/categories',
          { headers: getAuthHeaders() }
        );
        setCategories(categoriesResponse.data.categories || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('فشل في تحميل البيانات، يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      colors: [...prev.colors, { name: '', code: '#ffffff', stock: 0, sizes: [{ size: '', stock: 0 }] }]
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

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFilesToUpload(prev => [...prev, ...newFiles]);
  };

  const handleDeleteFile = (index) => {
    setFilesToUpload(prev => prev.filter((_, i) => i !== index));
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
    setLoading(true);
    setMessage('');

    try {
      if (filesToUpload.length === 0) {
        setMessage('يجب إضافة صورة واحدة على الأقل للمنتج.');
        setLoading(false);
        return;
      }

      // رفع الصور
      const uploadedUrls = [];
      for (const file of filesToUpload) {
        const url = await uploadImage(file);
        if (url) uploadedUrls.push(url);
      }

      // الصورة الرئيسية هي الأولى
      const mainImageUrl = uploadedUrls[0];
      const mediaPayload = uploadedUrls.map((url, index) => ({
        url,
        type: 'image',
        isMain: index === 0
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
        mainImageUrl,
        media: mediaPayload
      };

      const response = await axios.post(
        'https://products-api.cbc-apps.net/supplier/products',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setMessage('تم إضافة المنتج بنجاح!');
      console.log(response.data);
      navigate('/products');
    } catch (err) {
      console.error(err.response || err);
      setMessage('حدث خطأ أثناء إضافة المنتج.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSections =
    categories.find(cat => cat.id === parseInt(product.categoryId))?.sections || [];

  return (
    <div className="p-4 min-h-screen rtl:text-right font-sans">
      <div className="container mx-auto bg-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold mb-6">إضافة منتج جديد</h1>
        {message && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{message}</div>}
        <form onSubmit={handleSubmit}>
          {/* معلومات المنتج الأساسية */}
          <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">معلومات المنتج الأساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-1 font-medium text-gray-700">اسم المنتج</label>
              <input type="text" name="name" value={product.name} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-red-500" required />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">وصف المنتج</label>
              <textarea name="description" value={product.description} onChange={handleChange} rows={3} className="w-full border p-2 rounded focus:ring-2 focus:ring-red-500" required />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">التصنيف الرئيسي</label>
              <select name="categoryId" value={product.categoryId} onChange={(e) => { handleChange(e); setProduct(prev => ({ ...prev, sectionId: '' })); }} className="w-full border p-2 rounded focus:ring-2 focus:ring-red-500" required>
                <option value="">اختر التصنيف</option>
                {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">التصنيف الفرعي</label>
              <select name="sectionId" value={product.sectionId} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-red-500" disabled={!product.categoryId} required>
                <option value="">اختر التصنيف الفرعي</option>
                {filteredSections.map(sec => (<option key={sec.id} value={sec.id}>{sec.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">حالة المنتج</label>
              <select name="isActive" value={product.isActive} onChange={(e) => setProduct({ ...product, isActive: e.target.value === 'true' })} className="w-full border p-2 rounded focus:ring-2 focus:ring-red-500">
                <option value={true}>نشط</option>
                <option value={false}>غير نشط</option>
              </select>
            </div>
          </div>

          {/* التسعير والمخزون */}
          <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">التسعير والمخزون</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-1 font-medium text-gray-700">السعر</label>
              <input type="number" name="originalPrice" value={product.originalPrice} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-red-500" placeholder="السعر" required />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">المخزون</label>
              <input type="number" name="stock" value={product.stock} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-red-500" placeholder="المخزون" />
              <label className="block mt-4 mb-1 font-medium text-gray-700">سعر الجملة</label>
              <input type="number" name="wholesalePrice" value={product.wholesalePrice} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-red-500" placeholder="سعر الجملة" />
            </div>
          </div>

          {/* رفع الصور */}
          <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">صور المنتج</h2>
          <div className="mb-6">
            {filesToUpload.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded border mb-2">
                <span>{file.name} {index === 0 && "(رئيسية)"}</span>
                <button type="button" onClick={() => handleDeleteFile(index)} className="text-red-500">حذف</button>
              </div>
            ))}
            <input type="file" accept="image/*" multiple onChange={handleFileChange} className="mt-2" />
          </div>

          {/* الألوان والمقاسات */}
          <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">الألوان والمقاسات</h2>
          {product.colors.map((color, colorIndex) => (
            <div key={colorIndex} className="border p-4 rounded mb-4">
              <div className="flex gap-2 mb-2">
                <input type="text" placeholder="اسم اللون" value={color.name} onChange={(e) => handleColorChange(colorIndex, 'name', e.target.value)} className="border p-2 rounded w-1/3" />
                <input type="text" placeholder="كود اللون" value={color.code} onChange={(e) => handleColorChange(colorIndex, 'code', e.target.value)} className="border p-2 rounded w-1/3" />
                <input type="number" placeholder="المخزون الكلي" value={color.stock} onChange={(e) => handleColorChange(colorIndex, 'stock', Number(e.target.value))} className="border p-2 rounded w-1/3" />
              </div>
              <SketchPicker color={color.code} onChange={(updatedColor) => handleColorChange(colorIndex, 'code', updatedColor.hex)} />
              <div className="mt-2">
                <button type="button" onClick={() => addSize(colorIndex)} className="text-blue-500">+ إضافة مقاس</button>
                {color.sizes.map((size, sizeIndex) => (
                  <div key={sizeIndex} className="flex gap-2 mt-2">
                    <input type="text" placeholder="المقاس" value={size.size} onChange={(e) => handleSizeChange(colorIndex, sizeIndex, 'size', e.target.value)} className="border p-2 rounded w-1/2" />
                    <input type="number" placeholder="المخزون" value={size.stock} onChange={(e) => handleSizeChange(colorIndex, sizeIndex, 'stock', Number(e.target.value))} className="border p-2 rounded w-1/2" />
                    <button type="button" onClick={() => deleteSize(colorIndex, sizeIndex)} className="text-red-500">حذف</button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => deleteColor(colorIndex)} className="mt-2 text-red-600">حذف اللون</button>
            </div>
          ))}
          <button type="button" onClick={addColor} className="mb-4 text-blue-500">+ إضافة لون</button>

          <button type="submit" disabled={loading} className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors">
            {loading ? 'جاري الإضافة...' : 'إضافة المنتج'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
