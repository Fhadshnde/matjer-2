import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle,
  Mail,
  Smartphone,
  Tag,
  Eye,
  LogOut,
  Upload,
  User,
  Package,
} from 'lucide-react';
import axios from 'axios';
import { getApiUrl, getAuthHeaders } from '../../config/api';

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    address: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState({
    orders: true,
    system: true,
    email: false,
    sms: false,
    push: true
  });
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // جلب بيانات الملف الشخصي
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(getApiUrl('/supplier/profile'), {
        headers: getAuthHeaders()
      });
      
      console.log('Profile data response:', response.data);
      setProfileData({
        name: response.data.name || '',
        email: response.data.contactInfo || '',
        phone: response.data.phone || '',
        avatar: response.data.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        address: response.data.address || ''
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('فشل في جلب بيانات الملف الشخصي: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // حفظ بيانات الملف الشخصي
  const saveProfileData = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const response = await axios.patch(getApiUrl('/supplier/profile'), {
        name: profileData.name,
        contactInfo: profileData.email,
        phone: profileData.phone,
        address: profileData.address
      }, {
        headers: getAuthHeaders()
      });
      
      console.log('Profile data saved:', response.data);
      setSuccess(true);
      
      // إخفاء رسالة النجاح بعد 3 ثوان
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving profile data:', err);
      setError('فشل في حفظ بيانات الملف الشخصي: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // تغيير كلمة المرور
  const changePassword = async () => {
    try {
      setSaving(true);
      setError(null);
      
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('كلمة المرور الجديدة وتأكيدها غير متطابقتين');
        return;
      }
      
      const response = await axios.patch(getApiUrl('/supplier/change-password'), {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: getAuthHeaders()
      });
      
      console.log('Password changed:', response.data);
      setSuccess(true);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // إخفاء رسالة النجاح بعد 3 ثوان
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error changing password:', err);
      setError('فشل في تغيير كلمة المرور: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // رفع صورة الملف الشخصي
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(getApiUrl('/supplier/upload/image'), formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setProfileData(prev => ({
        ...prev,
        avatar: response.data.url
      }));
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('فشل في رفع الصورة: ' + (err.response?.data?.message || err.message));
    }
  };

  // تحديث الإشعارات
  const updateNotifications = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const response = await axios.patch(getApiUrl('/supplier/notifications/settings'), {
        orders: notifications.orders,
        system: notifications.system,
        email: notifications.email,
        sms: notifications.sms,
        push: notifications.push
      }, {
        headers: getAuthHeaders()
      });
      
      console.log('Notifications updated:', response.data);
      setSuccess(true);
      
      // إخفاء رسالة النجاح بعد 3 ثوان
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating notifications:', err);
      setError('فشل في تحديث إعدادات الإشعارات: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // جلب الجلسات النشطة
  const fetchSessions = async () => {
    try {
      const response = await axios.get(getApiUrl('/supplier/sessions'), {
        headers: getAuthHeaders()
      });
      
      console.log('Sessions response:', response.data);
      setSessions(response.data.sessions || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      // إذا لم يكن endpoint موجود، استخدم بيانات وهمية
      setSessions([
        {
          id: 1,
          device: 'Firefox - Mac',
          location: 'بغداد، العراق',
          lastActive: 'قبل 5 ساعات',
          isCurrent: true
        }
      ]);
    }
  };

  // إنهاء جلسة
  const terminateSession = async (sessionId) => {
    try {
      await axios.delete(getApiUrl(`/supplier/sessions/${sessionId}`), {
        headers: getAuthHeaders()
      });
      
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      setSuccess(true);
      
      // إخفاء رسالة النجاح بعد 3 ثوان
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error terminating session:', err);
      setError('فشل في إنهاء الجلسة: ' + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchSessions();
  }, []);

  const tabs = [
    { id: 'account', label: 'الحساب' },
    { id: 'password', label: 'كلمة المرور' },
    { id: 'notifications', label: 'الإشعارات' },
    { id: 'login', label: 'الجلسات' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="bg-white p-8 border border-gray-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">البيانات الشخصية</h2>
                <p className="text-gray-500 text-sm mt-1">
                  تظهر هذه المعلومات في النظام والتقارير
                </p>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                <span className="mr-2 text-gray-600">جاري تحميل البيانات...</span>
              </div>
            ) : (
              <>
                <div className="flex items-center mb-8">
                  <div className="relative">
                    <img
                      src={profileData.avatar}
                      alt="User Profile"
                      className="rounded-full w-20 h-20 border-2 border-orange-400 object-cover"
                    />
                  </div>
                  <div className="mr-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label 
                      htmlFor="avatar-upload"
                      className="flex items-center text-red-600 font-semibold text-sm cursor-pointer"
                    >
                      <Upload className="w-4 h-4 ml-2" />
                      تغيير الصورة
                    </label>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="mb-4">
                    <label className="block text-gray-500 text-sm font-medium">الاسم الكامل</label>
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({...prev, name: e.target.value}))}
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-800 pr-10"
                      />
                      <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-500 text-sm font-medium">البريد الإلكتروني</label>
                    <div className="mt-2 relative">
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({...prev, email: e.target.value}))}
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-800 pr-10"
                      />
                      <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-500 text-sm font-medium">رقم الجوال</label>
                    <div className="flex mt-2">
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({...prev, phone: e.target.value}))}
                        className="flex-1 bg-white border border-gray-300 rounded-r-lg p-3 text-gray-800"
                      />
                      <div className="flex items-center bg-white border border-gray-300 rounded-l-lg p-3">
                        <span className="ml-2 text-gray-800 text-sm">+٩٦٤</span>
                        <img
                          src="https://flagcdn.com/iq.svg"
                          alt="Iraq Flag"
                          className="w-6 h-4"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-500 text-sm font-medium">العنوان</label>
                    <div className="mt-2">
                      <input
                        type="text"
                        value={profileData.address}
                        onChange={(e) => setProfileData(prev => ({...prev, address: e.target.value}))}
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-800"
                        placeholder="أدخل عنوانك"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 'password':
        return (
          <div className="bg-white p-8 border border-gray-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">كلمة المرور</h2>
                <p className="text-gray-500 text-sm mt-1">
                  احرص على استخدام كلمة مرور قوية
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-500 text-sm font-medium">
                  كلمة المرور الحالية
                </label>
                <div className="relative mt-2">
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({...prev, currentPassword: e.target.value}))}
                    placeholder="أدخل كلمة المرور الحالية"
                    className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-800 pr-10"
                  />
                  <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-gray-500 text-sm font-medium">
                  كلمة المرور الجديدة
                </label>
                <div className="relative mt-2">
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({...prev, newPassword: e.target.value}))}
                    placeholder="أدخل كلمة المرور الجديدة"
                    className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-800 pr-10"
                  />
                  <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-gray-500 text-sm font-medium">
                  تأكيد كلمة المرور
                </label>
                <div className="relative mt-2">
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({...prev, confirmPassword: e.target.value}))}
                    placeholder="أكد كلمة المرور الجديدة"
                    className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-800 pr-10"
                  />
                  <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="pt-4">
                <button
                  onClick={changePassword}
                  disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'جاري التحديث...' : 'تغيير كلمة المرور'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        const notificationOptions = [
          { key: 'orders', label: 'إشعارات الطلبات', icon: <Package className="w-4 h-4" /> },
          { key: 'system', label: 'تحديثات النظام', icon: <Mail className="w-4 h-4" /> },
          { key: 'email', label: 'بريد إلكتروني', icon: <Tag className="w-4 h-4" /> },
          { key: 'sms', label: 'رسائل SMS', icon: <Mail className="w-4 h-4" /> },
          { key: 'push', label: 'إشعارات Push', icon: <Bell className="w-4 h-4" /> },
        ];
        return (
          <div className="bg-white p-8 border border-gray-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">أنواع الإشعارات</h2>
                <p className="text-gray-500 text-sm mt-1">
                  اختر ما ترغب باستلامه
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {notificationOptions.map((option, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <label htmlFor={`checkbox-${index}`} className="text-gray-900 flex items-center">
                    {option.icon}
                    <span className="mr-2">{option.label}</span>
                  </label>
                  <div className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id={`checkbox-${index}`}
                      checked={notifications[option.key]}
                      onChange={(e) => setNotifications(prev => ({
                        ...prev,
                        [option.key]: e.target.checked
                      }))}
                      className="hidden"
                    />
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 ${
                        notifications[option.key]
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      <CheckCircle
                        className={`w-5 h-5 transition-transform duration-200 ${
                          notifications[option.key] ? 'scale-100' : 'scale-0'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <button
                  onClick={updateNotifications}
                  disabled={saving}
                  className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'جاري التحديث...' : 'حفظ الإعدادات'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'login':
        return (
          <div className="bg-white p-8 border border-gray-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">أجهزة وجلسات الدخول</h2>
                <p className="text-gray-500 text-sm mt-1">
                  يمكنك إنهاء الجلسات النشطة على الأجهزة الأخرى
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {sessions.map((session, index) => (
                <div
                  key={session.id || index}
                  className="flex justify-between items-center bg-white p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center">
                    <Smartphone className="w-5 h-5 text-gray-500 ml-3" />
                    <div>
                      <p className="text-gray-900 font-medium flex items-center">
                        {session.device}
                        {session.isCurrent && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2">
                            الجلسة الحالية
                          </span>
                        )}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {session.location}، {session.lastActive}
                      </p>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <button 
                      onClick={() => terminateSession(session.id)}
                      className="flex items-center text-red-600 text-sm font-medium hover:text-red-800 transition-colors"
                    >
                      تسجيل خروج
                      <LogOut className="w-4 h-4 mr-2" />
                    </button>
                  )}
                </div>
              ))}
              {sessions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  لا توجد جلسات نشطة
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white min-h-screen p-8" dir="rtl">
      {/* رسائل النجاح والخطأ */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          تم حفظ التغييرات بنجاح
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center justify-start w-full mb-8 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-6 font-semibold text-center transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="w-full mb-8">
        {renderContent()}
      </div>

      {/* Action Buttons */}
      {activeTab === 'account' && (
        <div className="flex mt-4 space-x-4 space-x-reverse">
          <button 
            onClick={saveProfileData}
            disabled={saving}
            className="bg-red-600 text-white font-bold py-3 px-8 rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
          <button 
            onClick={() => fetchProfileData()}
            className="bg-white text-gray-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors border border-gray-300"
          >
            إلغاء
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;