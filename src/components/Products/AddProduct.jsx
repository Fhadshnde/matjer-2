import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuthHeaders } from '../../config/api';
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
  const [mainImageIndex, setMainImageIndex] = useState(0); 
  // حالة جديدة لفتح الصورة المكبرة
  const [selectedImage, setSelectedImage] = useState(null); 

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

    return () => {
      filesToUpload.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    const newFiles = Array.from(e.target.files).map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file) 
      })
    );
    setFilesToUpload(prev => [...prev, ...newFiles]);
  };

  const handleDeleteFile = (index) => {
    const fileToDelete = filesToUpload[index];
    URL.revokeObjectURL(fileToDelete.preview); 
    setFilesToUpload(prev => prev.filter((_, i) => i !== index));
    
    if (mainImageIndex === index) setMainImageIndex(0);
    else if (mainImageIndex > index) setMainImageIndex(prev => Math.max(0, prev - 1));
  };

  const selectMainImage = (index) => {
    setMainImageIndex(index);
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
      const filesOnly = filesToUpload.map(f => f); 
      for (const file of filesOnly) {
        const url = await uploadImage(file);
        if (url) uploadedUrls.push(url);
      }

      if (uploadedUrls.length !== filesToUpload.length) {
        setMessage('فشل رفع بعض الصور. يرجى المحاولة مرة أخرى.');
        setLoading(false);
        return;
      }
      
      const finalMainImageIndex = Math.min(mainImageIndex, uploadedUrls.length - 1);
      
      const mainImageUrl = uploadedUrls[finalMainImageIndex];
      const mediaPayload = uploadedUrls.map((url, index) => ({
        url,
        type: 'image',
        isMain: index === finalMainImageIndex
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

          ---

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

          ---

          {/* رفع الصور ومعاينتها */}
          <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">صور المنتج</h2>
          <div className="mb-6">
            <input type="file" accept="image/*" multiple onChange={handleFileChange} className="mt-2 mb-4" />

            <div className="flex flex-wrap gap-4">
              {filesToUpload.map((file, index) => (
                // تم تكبير حجم المعاينة إلى 40x40
                <div key={index} 
                  className={`relative w-40 h-40 border-2 rounded p-1 cursor-pointer transition-all duration-200 hover:shadow-lg ${index === mainImageIndex ? 'border-red-500' : 'border-gray-300'}`}
                  // عند الضغط على الصورة، يتم فتح النافذة المنبثقة
                  onClick={() => setSelectedImage(file.preview)} 
                >
                  <img src={file.preview} alt={`معاينة ${file.name}`} className="w-full h-full object-cover rounded" />
                  
                  {index === mainImageIndex && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-sm px-2 py-0.5 rounded-bl font-semibold">رئيسية</span>
                  )}

                  <div className="absolute inset-0 flex flex-col justify-end bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity rounded">
                    <div className='flex justify-center gap-1 p-1'>
                      <button type="button" onClick={(e) => { e.stopPropagation(); selectMainImage(index); }} className="text-white bg-green-600 hover:bg-green-700 text-xs py-1 px-2 rounded transition-colors">
                        تعيين رئيسية
                      </button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); handleDeleteFile(index); }} className="text-white bg-red-600 hover:bg-red-700 text-xs py-1 px-2 rounded transition-colors">
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
          </div>

          ---

          {/* الألوان والمقاسات */}
          <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">الألوان والمقاسات</h2>
          {product.colors.map((color, colorIndex) => (
            <div key={colorIndex} className="border p-4 rounded mb-4">
              <div className="flex flex-wrap gap-3 mb-4 items-center">
                <input type="text" placeholder="اسم اللون" value={color.name} onChange={(e) => handleColorChange(colorIndex, 'name', e.target.value)} className="border p-2 rounded flex-grow min-w-[150px]" />
                <input type="text" placeholder="كود اللون (مثال: #ff0000)" value={color.code} onChange={(e) => handleColorChange(colorIndex, 'code', e.target.value)} className="border p-2 rounded flex-grow min-w-[150px]" />
                <input type="number" placeholder="المخزون الكلي" value={color.stock} onChange={(e) => handleColorChange(colorIndex, 'stock', e.target.value)} className="border p-2 rounded flex-grow min-w-[150px]" />
                <button type="button" onClick={() => deleteColor(colorIndex)} className="text-white bg-red-600 p-2 rounded hover:bg-red-700 transition-colors">حذف اللون</button>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-4">
                <div className='max-w-xs'>
                  <SketchPicker color={color.code} onChange={(updatedColor) => handleColorChange(colorIndex, 'code', updatedColor.hex)} presetColors={[]} />
                </div>

                <div className='flex-grow min-w-[250px]'>
                  <h3 className="font-semibold mb-2">المقاسات المحددة لهذا اللون:</h3>
                  <button type="button" onClick={() => addSize(colorIndex)} className="text-blue-500 mb-2 border border-blue-500 p-1 rounded hover:bg-blue-50 transition-colors">+ إضافة مقاس</button>
                  {color.sizes.map((size, sizeIndex) => (
                    <div key={sizeIndex} className="flex gap-2 mt-2 items-center">
                      <input type="text" placeholder="اسم المقاس" value={size.size} onChange={(e) => handleSizeChange(colorIndex, sizeIndex, 'size', e.target.value)} className="border p-2 rounded w-2/5" />
                      <input type="number" placeholder="المخزون لهذا المقاس" value={size.stock} onChange={(e) => handleSizeChange(colorIndex, sizeIndex, 'stock', e.target.value)} className="border p-2 rounded w-2/5" />
                      <button type="button" onClick={() => deleteSize(colorIndex, sizeIndex)} className="text-red-500 hover:text-red-700 w-1/5">حذف</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={addColor} className="mb-6 text-white bg-blue-500 p-2 rounded hover:bg-blue-600 transition-colors">+ إضافة لون</button>

          <button type="submit" disabled={loading} className="w-full bg-red-500 text-white p-3 rounded hover:bg-red-600 transition-colors font-bold text-lg">
            {loading ? 'جاري الإضافة...' : 'إضافة المنتج'}
          </button>
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

export default AddProduct;