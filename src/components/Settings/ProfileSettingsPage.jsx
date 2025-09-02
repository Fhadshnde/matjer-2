import React, { useState } from 'react';
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

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('account');

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
            <div className="flex items-center mb-8">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User Profile"
                  className="rounded-full w-20 h-20 border-2 border-orange-400"
                />
              </div>
              <button className="flex items-center text-red-600 mr-4 font-semibold text-sm">
                <Upload className="w-4 h-4 ml-2" />
                تغيير الصورة
              </button>
            </div>
            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-gray-500 text-sm font-medium">الاسم الكامل</label>
                <div className="mt-2 relative">
                  <input
                    type="text"
                    value="سلوى عمان"
                    className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-800 pr-10"
                    readOnly
                  />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-500 text-sm font-medium">البريد الإلكتروني</label>
                <div className="mt-2 relative">
                  <input
                    type="email"
                    value="admin@nike.sa"
                    className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-800 pr-10"
                    readOnly
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-gray-500 text-sm font-medium">رقم الجوال</label>
                <div className="flex mt-2">
                  <input
                    type="tel"
                    value="55543456"
                    className="flex-1 bg-white border border-gray-300 rounded-r-lg p-3 text-gray-800"
                    readOnly
                  />
                  <div className="flex items-center bg-white border border-gray-300 rounded-l-lg p-3">
                    <span className="ml-2 text-gray-800 text-sm">+٩٦٤</span>
                    <img
                      src="https://flagcdn.com/sa.svg"
                      alt="Saudi Arabia Flag"
                      className="w-6 h-4"
                    />
                  </div>
                </div>
              </div>
            </div>
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
                    placeholder="********"
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
                    placeholder="********"
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
                    placeholder="********"
                    className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-800 pr-10"
                  />
                  <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        const notificationOptions = [
          { label: 'إشعارات الطلبات', checked: true, icon: <Package className="w-4 h-4" /> },
          { label: 'تحديثات النظام', checked: true, icon: <Mail className="w-4 h-4" /> },
          { label: 'بريد إلكتروني', checked: false, icon: <Tag className="w-4 h-4" /> },
          { label: 'رسائل SMS', checked: false, icon: <Mail className="w-4 h-4" /> },
          { label: 'إشعارات Push', checked: true, icon: <Bell className="w-4 h-4" /> },
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
                  <label htmlFor={`checkbox-${index}`} className="text-gray-900">
                    {option.label}
                  </label>
                  <div className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id={`checkbox-${index}`}
                      defaultChecked={option.checked}
                      className="hidden"
                    />
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 ${
                        option.checked
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      <CheckCircle
                        className={`w-5 h-5 transition-transform duration-200 ${
                          option.checked ? 'scale-100' : 'scale-0'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
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
              {['Firefox - Mac', 'Firefox - Mac', 'Firefox - Mac'].map((device, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-white p-4 border border-gray-200"
                >
                  <div className="flex items-center">
                    <Smartphone className="w-5 h-5 text-gray-500 ml-3" />
                    <div>
                      <p className="text-gray-900 font-medium">{device}</p>
                      <p className="text-gray-500 text-xs">
                        جدة السعودية، قبل ٥ ساعات
                      </p>
                    </div>
                  </div>
                  <button className="flex items-center text-red-600 text-sm font-medium">
                    تسجيل خروج
                    <LogOut className="w-4 h-4 mr-2" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white min-h-screen p-8" dir="rtl">
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
      <div className="flex mt-4 space-x-4 space-x-reverse">
        <button className="bg-red-600 text-white font-bold py-3 px-8 rounded-full hover:bg-red-700 transition-colors">
          حفظ التغييرات
        </button>
        <button className="bg-white text-gray-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors border border-gray-300">
          إلغاء
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;