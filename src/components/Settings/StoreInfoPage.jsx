import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const tabs = [
    { name: 'بيانات المتجر', path: '/store-info' },
    { name: 'إدارة الفريق', path: '/employees-page' },
    { name: 'الدعم الفني', path: '/tickets' },
];

const StoreInfoPage = () => {
    const location = useLocation();

    return (
        <div className="rtl:text-right font-sans bg-gray-100 min-h-screen">
            {/* Tabs Navigation */}
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

            {/* Page Content */}
            <div className="p-8 pb-4"> {/* Adjusted padding */}
                <div className="container mx-auto">
                    {/* معلومات المتجر */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <div className="flex justify-between items-center mb-6"> {/* Adjusted margin-bottom */}
                            <h2 className="text-xl font-bold text-gray-800">معلومات المتجر</h2>
                            <div className="flex items-center space-x-3"> {/* Adjusted space-x */}
                                <button className="text-red-500 font-semibold text-sm">تغيير الصورة</button>
                                {/* Placeholder for Nike Logo */}
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Nike_logo_black.svg"
                                    alt="Nike Logo"
                                    className="w-8 h-8 rounded-full" // Smaller and rounded as in the image
                                />
                                {/* Upload Icon SVG */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-gray-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 text-right"> {/* Adjusted gap-y and gap-x */}
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المتجر</label>
                                <input
                                    type="text"
                                    value="نايكي"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 text-right bg-gray-50 border"
                                    readOnly
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">البريد الرسمي</label>
                                <input
                                    type="email"
                                    value="admin@cbc.sa"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 text-right bg-gray-50 border"
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الجوال</label>
                                <div className="flex rounded-md shadow-sm border border-gray-300 bg-gray-50">
                                    <input
                                        type="tel"
                                        value="55543456"
                                        className="flex-1 block w-full rounded-l-md bg-gray-50 focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 text-right border-none"
                                    />
                                    <span className="inline-flex items-center px-3 rounded-r-md border-l border-gray-300 text-gray-500 text-sm bg-gray-50">
                                        <img src="https://flagcdn.com/iq.svg" alt="Iraq Flag" className="w-4 h-auto ml-2" /> {/* Iraq Flag */}
                                        +964
                                    </span>
                                </div>
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">قطاع الشركة</label>
                                <input
                                    type="text"
                                    value="ملابس رياضية"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 text-right bg-gray-50 border"
                                    readOnly
                                />
                            </div>
                            <div className="md:col-span-2"> {/* This field spans 2 columns */}
                                <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value="بغداد - الكرادة - شارع 62 - مجمع الأعمال"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 text-right bg-gray-50 border pr-8" // Added pr-8 for icon
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pr-2 pointer-events-none">
                                        {/* Dropdown arrow icon */}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-gray-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end space-x-2"> {/* Adjusted margin-top */}
                            <button className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg text-sm">إلغاء</button> {/* Adjusted padding */}
                            <button className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg text-sm">حفظ التغييرات</button> {/* Adjusted padding */}
                        </div>
                    </div>

                    {/* معلومات البنكية */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 text-right">المعلومات البنكية</h2> {/* Adjusted margin-bottom */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-right"> {/* Adjusted gap-y and gap-x */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">اسم البنك</label>
                                <input
                                    type="text"
                                    value="البنك الأهلي السعودي"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 text-right bg-gray-50 border"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">اسم الحساب</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value="شركة نايكي التجارية"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 text-right bg-gray-50 border pr-8"
                                        readOnly
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pr-2 pointer-events-none">
                                        {/* Dropdown arrow icon */}
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
                                    value="544200000001234567890000"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 text-right bg-gray-50 border"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">رمز السويفت (SWIFT/BIC)</label>
                                <input
                                    type="text"
                                    value="NCBKSAJE"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 text-right bg-gray-50 border"
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end space-x-2"> {/* Adjusted margin-top */}
                            <button className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg text-sm">إلغاء</button>
                            <button className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg text-sm">حفظ التغييرات</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreInfoPage;