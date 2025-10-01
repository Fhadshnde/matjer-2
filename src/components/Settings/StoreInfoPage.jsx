import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl, getAuthHeaders } from '../../config/api';

const tabs = [
    // { name: 'الدعم الفني', path: '/tickets' },
    { name: 'إدارة الفريق', path: '/employees-page' },
    { name: 'بيانات المتجر', path: '/store-info' },

];

const StoreInfoPage = () => {
    const location = useLocation();
    const [storeInfo, setStoreInfo] = useState({
        storeName: '',
        storeDescription: '',
        storeAddress: '',
        storePhone: '',
        storeEmail: '',
        storeSector: '',
        storeLogo: null,
        bankingInfo: {
            bankName: '',
            accountNumber: '',
            iban: '',
            accountHolderName: ''
        }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const fetchStoreInfo = async () => {
        try {
            setLoading(true);
            const response = await axios.get(getApiUrl('/supplier/profile'), {
                headers: getAuthHeaders()
            });
            
            setStoreInfo({
                storeName: response.data.name || '',
                storeEmail: response.data.contactInfo || '',
                storeAddress: response.data.address || '',
                storePhone: response.data.phone || '',
                storeLogo: response.data.profileImage ? `https://products-api.cbc-apps.net${response.data.profileImage}` : null,
                storeDescription: '',
                storeSector: '',
                bankingInfo: {
                    bankName: '',
                    accountNumber: '',
                    iban: '',
                    accountHolderName: ''
                }
            });
            setError(null);
        } catch (err) {
            setError('فشل في جلب معلومات المتجر: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const saveStoreInfo = async () => {
        try {
            setSaving(true);
            setError(null);
            
            const response = await axios.patch(getApiUrl('/supplier/profile'), {
                name: storeInfo.storeName,
                contactInfo: storeInfo.storeEmail,
                address: storeInfo.storeAddress,
                phone: storeInfo.storePhone,
                bankingInfo: storeInfo.bankingInfo
            }, {
                headers: getAuthHeaders()
            });
            
            setSuccess(true);
            setIsEditing(false);
            
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError('فشل في حفظ معلومات المتجر: ' + (err.response?.data?.message || err.message));
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setStoreInfo(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setStoreInfo(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await axios.post('https://products-api.cbc-apps.net/supplier/profile/upload-image', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            setStoreInfo(prev => ({
                ...prev,
                storeLogo: response.data.url
            }));
        } catch (err) {
            setError('فشل في رفع الصورة: ' + (err.response?.data?.message || err.message));
        }
    };

    useEffect(() => {
        fetchStoreInfo();
    }, []);

    return (
        <div className="rtl:text-right font-sans bg-gray-100 min-h-screen">
            <div className="flex justify-end bg-white py-4 px-6 border-b border-gray-200 shadow-sm">
                <nav className="flex space-x-4">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.name}
                            to={tab.path}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                                location.pathname === tab.path
                                    ? 'border-red-500 text-red-500'
                                    : 'border-transparent text-gray-500 hover:border-gray-300'
                            }`}
                        >
                            {tab.name}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="p-8 pb-4">
                <div className="container mx-auto">
                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            تم حفظ معلومات المتجر بنجاح
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">معلومات المتجر</h2>
                            <div className="flex items-center space-x-3">
                                {isEditing ? (
                                    <>
                                        <button 
                                            onClick={() => setIsEditing(false)}
                                            className="text-gray-500 font-semibold text-sm"
                                        >
                                            إلغاء
                                        </button>
                                        <button 
                                            onClick={saveStoreInfo}
                                            disabled={saving}
                                            className="bg-red-500 text-white font-semibold text-sm px-4 py-2 rounded-lg disabled:opacity-50"
                                        >
                                            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {/* <button 
                                            onClick={() => setIsEditing(true)}
                                            className="text-red-500 font-semibold text-sm"
                                        >
                                            تعديل
                                        </button> */}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label 
                                            htmlFor="image-upload"
                                            className="text-red-500 font-semibold text-sm cursor-pointer"
                                        >
                                            تغيير الصورة
                                        </label>
                                        {storeInfo.storeLogo ? (
                                            <img
                                                src={storeInfo.storeLogo}
                                                alt="Store Logo"
                                                className="w-24 h-24 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-gray-500">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                                </svg>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                                <span className="mr-2 text-gray-600">جاري تحميل معلومات المتجر...</span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 text-right">
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">اسم المتجر</label>
                                    <input
                                        type="text"
                                        value={storeInfo.storeName || ''}
                                        onChange={(e) => handleInputChange('storeName', e.target.value)}
                                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 text-right border ${
                                            isEditing ? 'bg-white' : 'bg-gray-50'
                                        }`}
                                        readOnly={!isEditing}
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">البريد الرسمي</label>
                                    <input
                                        type="email"
                                        value={storeInfo.storeEmail || ''}
                                        onChange={(e) => handleInputChange('storeEmail', e.target.value)}
                                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 text-right border ${
                                            isEditing ? 'bg-white' : 'bg-gray-50'
                                        }`}
                                        readOnly={!isEditing}
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">رقم الجوال</label>
                                    <div className="flex rounded-md shadow-sm border border-gray-300 bg-gray-50">
                                        <input
                                            type="tel"
                                            value={storeInfo.storePhone || ''}
                                            onChange={(e) => handleInputChange('storePhone', e.target.value)}
                                            className={`flex-1 block w-full rounded-l-md focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 text-right border-none ${
                                                isEditing ? 'bg-white' : 'bg-gray-50'
                                            }`}
                                            readOnly={!isEditing}
                                        />
                                        <span className="inline-flex items-center px-3 rounded-r-md border-l border-gray-300 text-gray-500 text-sm bg-gray-50">
                                            <img src="https://flagcdn.com/iq.svg" alt="Iraq Flag" className="w-4 h-auto ml-2" />
                                            +964
                                        </span>
                                    </div>
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">قطاع الشركة</label>
                                    <input
                                        type="text"
                                        value={storeInfo.storeSector || ''}
                                        onChange={(e) => handleInputChange('storeSector', e.target.value)}
                                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 text-right border ${
                                            isEditing ? 'bg-white' : 'bg-gray-50'
                                        }`}
                                        readOnly={!isEditing}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={storeInfo.storeAddress || ''}
                                            onChange={(e) => handleInputChange('storeAddress', e.target.value)}
                                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 text-right border pr-8 ${
                                                isEditing ? 'bg-white' : 'bg-gray-50'
                                            }`}
                                            readOnly={!isEditing}
                                        />
                                        <div className="absolute inset-y-0 left-0 flex items-center pr-2 pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-gray-400">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 text-right">المعلومات البنكية</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-right">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">اسم البنك</label>
                                <input
                                    type="text"
                                    value={storeInfo.bankingInfo?.bankName || ''}
                                    onChange={(e) => handleInputChange('bankingInfo.bankName', e.target.value)}
                                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 text-right border ${
                                        isEditing ? 'bg-white' : 'bg-gray-50'
                                    }`}
                                    readOnly={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">اسم الحساب</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={storeInfo.bankingInfo?.accountHolderName || ''}
                                        onChange={(e) => handleInputChange('bankingInfo.accountHolderName', e.target.value)}
                                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 text-right border pr-8 ${
                                            isEditing ? 'bg-white' : 'bg-gray-50'
                                        }`}
                                        readOnly={!isEditing}
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pr-2 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-gray-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الحساب</label>
                                <input
                                    type="text"
                                    value={storeInfo.bankingInfo?.accountNumber || ''}
                                    onChange={(e) => handleInputChange('bankingInfo.accountNumber', e.target.value)}
                                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 text-right border ${
                                        isEditing ? 'bg-white' : 'bg-gray-50'
                                    }`}
                                    readOnly={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">رمز السويفت (SWIFT/BIC)</label>
                                <input
                                    type="text"
                                    value={storeInfo.bankingInfo?.iban || ''}
                                    onChange={(e) => handleInputChange('bankingInfo.iban', e.target.value)}
                                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 text-right border ${
                                        isEditing ? 'bg-white' : 'bg-gray-50'
                                    }`}
                                    readOnly={!isEditing}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreInfoPage;