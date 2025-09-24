import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl, getAuthHeaders, API_CONFIG } from '../../config/api';
import { SketchPicker } from 'react-color';

const AddProduct = () => {
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
    wholesalePrice: '',
    isActive: true,
    colors: [],
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
        const categoriesResponse = await axios.get('https://products-api.cbc-apps.net/supplier/categories', {
          headers: getAuthHeaders()
        });
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

      const uploadedUrls = [];
      for (const file of filesToUpload) {
        const url = await uploadImage(file);
        if (url) {
          uploadedUrls.push(url);
        }
      }

      const mediaPayload = uploadedUrls.map((url, index) => ({
        url,
        type: 'image',
        isMain: index === 0
      }));

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
      <div className="container mx-auto bg-white p-2 shadow-lg">
        <h1 className="text-2xl font-bold mb-6">إضافة منتج جديد</h1>
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

          <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">صور المنتج</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mb-8">
            <div className="md:col-span-2">
              <div className="space-y-4">
                {filesToUpload.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="w-8 h-8 flex items-center justify-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">{file.name} {index === 0 && <span className="text-xs text-red-500">(صورة رئيسية)</span>}</p>
                        <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                    </div>
                    <button type="button" onClick={() => handleDeleteFile(index)} className="text-red-500 hover:text-red-700 transition-colors">
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
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <span className="text-red-600 font-bold flex items-center space-x-2 rtl:space-x-reverse">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>إضافة صور للمنتج</span>
                  </span>
                </label>
              </div>
            </div>
          </div>

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
                  <div className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 border rounded"
                      style={{ backgroundColor: color.code }}
                    />
                    <input
                      type="text"
                      placeholder="كود اللون"
                      value={color.code}
                      onChange={(e) => handleColorChange(colorIndex, 'code', e.target.value)}
                      className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                    />
                  </div>
                  <input
                    type="number"
                    placeholder="المخزون الكلي للون"
                    value={color.stock}
                    onChange={(e) => handleColorChange(colorIndex, 'stock', Number(e.target.value))}
                    className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <SketchPicker
                  color={color.code}
                  onChange={(updatedColor) => handleColorChange(colorIndex, 'code', updatedColor.hex)}
                />
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

          {message && (
            <p className={`mt-4 text-center ${message.includes('بنجاح') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}

          <div className="flex justify-start gap-4 mt-8">
            <button
              type="submit"
              className={`bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors`}
              disabled={loading}
            >
              {loading ? 'جاري الإضافة...' : 'إضافة المنتج'}
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

export default AddProduct;