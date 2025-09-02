import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const tabs = [
    { name: 'بيانات المتجر', path: '/store-info' },
    { name: 'إدارة الفريق', path: '/employees-page' },
    { name: 'الدعم الفني', path: '/tickets' },
];

const employeesData = [
    { name: 'محمد صبري', email: 'sabry@gmail.com', phone: '+962312154', role: 'موظف مالي', lastLogin: '2025-08-28', status: 'نشط' },
    { name: 'محمد صبري', email: 'sabry@gmail.com', phone: '+962312154', role: 'موظف مالي', lastLogin: '2025-08-28', status: 'غير نشط' },
    { name: 'محمد صبري', email: 'sabry@gmail.com', phone: '+962312154', role: 'موظف مالي', lastLogin: '2025-08-28', status: 'نشط' },
    { name: 'محمد صبري', email: 'sabry@gmail.com', phone: '+962312154', role: 'موظف مالي', lastLogin: '2025-08-28', status: 'غير نشط' },
    { name: 'محمد صبري', email: 'sabry@gmail.com', phone: '+962312154', role: 'موظف مالي', lastLogin: '2025-08-28', status: 'نشط' },
    { name: 'محمد صبري', email: 'sabry@gmail.com', phone: '+962312154', role: 'موظف مالي', lastLogin: '2025-08-28', status: 'غير نشط' },
    { name: 'محمد صبري', email: 'sabry@gmail.com', phone: '+962312154', role: 'موظف مالي', lastLogin: '2025-08-28', status: 'نشط' },
    { name: 'محمد صبري', email: 'sabry@gmail.com', phone: '+962312154', role: 'موظف مالي', lastLogin: '2025-08-28', status: 'غير نشط' },
];

const getStatusColors = (status) => {
    switch (status) {
        case 'نشط':
            return 'bg-green-100 text-green-700';
        case 'غير نشط':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const AddEmployeeModal = ({ show, onClose, onAdd }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto rtl:text-right">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
                    <h3 className="text-xl font-bold">إضافة موظف</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                        <input type="text" placeholder="محمد أحمد صالح" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                        <input type="email" placeholder="msaleh@info.com" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">رقم الجوال</label>
                        <div className="mt-1 relative flex rounded-md shadow-sm">
                            <input type="text" placeholder="55543456" className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
                            <div className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                <img src="https://flagcdn.com/iq.svg" alt="Iraq flag" className="w-4 h-3 ml-2" />+964 
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الدور</label>
                        <select className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500">
                            <option>مالي</option>
                            <option>إداري</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                        <div className="relative">
                            <input type="password" placeholder="********" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
                            <button type="button" className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">إعادة كلمة المرور</label>
                        <div className="relative">
                            <input type="password" placeholder="********" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
                            <button type="button" className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">إلغاء</button>
                    <button onClick={onAdd} className="px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md shadow-sm hover:bg-red-600">إضافة</button>
                </div>
            </div>
        </div>
    );
};

const ChangePasswordModal = ({ show, onClose }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto rtl:text-right">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
                    <h3 className="text-xl font-bold">تغيير كلمة المرور</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور الجديدة</label>
                        <div className="relative">
                            <input type="password" placeholder="********" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
                            <button type="button" className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">إعادة كلمة المرور</label>
                        <div className="relative">
                            <input type="password" placeholder="********" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
                            <button type="button" className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">إلغاء</button>
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md shadow-sm hover:bg-red-600">حفظ</button>
                </div>
            </div>
        </div>
    );
};

const DeleteConfirmationModal = ({ show, onClose, onDelete }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-sm mx-auto rtl:text-right text-center">
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="flex justify-center mb-4">
                    <div className="bg-red-100 rounded-full p-3">
                        <svg className="h-10 w-10 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                    </div>
                </div>
                <h3 className="text-lg font-bold mb-2">حذف الحساب</h3>
                <p className="text-sm text-gray-500 mb-6">هل أنت متأكد أنك تريد حذف الحساب؟ <br/> سوف يتم حذف الحساب من قائمة المستخدمين لديك هل انت متأكد؟</p>
                <div className="flex justify-center space-x-4">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">إلغاء</button>
                    <button onClick={onDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md shadow-sm hover:bg-red-600">حذف</button>
                </div>
            </div>
        </div>
    );
};

const MoreActionsDropdown = ({ show, onClose, onEdit, onChangePassword, onDelete }) => {
    if (!show) return null;

    return (
        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <button
                    onClick={onEdit}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    تعديل البيانات
                </button>
                <button
                    onClick={onChangePassword}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15a3 3 0 100-6 3 3 0 000 6z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2.25c0 1.38-1.12 2.5-2.5 2.5s-2.5-1.12-2.5-2.5V9M12 9V6.75c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5V9M12 15v2.25c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V15M12 15v-2.25c0-1.38-1.12-2.5-2.5-2.5s-2.5 1.12-2.5 2.5V15m0-6h5c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2h5" /></svg>
                    تغيير كلمة المرور
                </button>
                <button
                    onClick={onDelete}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                    role="menuitem"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    حذف
                </button>
            </div>
        </div>
    );
};


const StatusFilterDropdown = ({ show, onClose, onSelect }) => {
    if (!show) return null;

    return (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
            <div className="py-1">
                <button onClick={() => onSelect('الكل')} className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    الكل
                </button>
                <hr className="my-1 border-gray-200" />
                <button onClick={() => onSelect('نشط')} className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    نشط
                </button>
                <button onClick={() => onSelect('غير نشط')} className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    غير نشط
                </button>
            </div>
        </div>
    );
};

const EmployeesPage = () => {
    const location = useLocation();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showMoreDropdown, setShowMoreDropdown] = useState(null);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [employeeStatuses, setEmployeeStatuses] = useState(
        employeesData.map(employee => employee.status === 'نشط')
    );

    const handleMoreClick = (index) => {
        setShowMoreDropdown(showMoreDropdown === index ? null : index);
    };

    const handleFilterClick = () => {
        setShowFilterDropdown(!showFilterDropdown);
    };

    const handleToggleStatus = (index) => {
        setEmployeeStatuses(prevStatuses => {
            const newStatuses = [...prevStatuses];
            newStatuses[index] = !newStatuses[index];
            return newStatuses;
        });
    };

    return (
        <div className="rtl:text-right font-sans">
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
            <div className="p-6 bg-gray-100 min-h-screen">
                <div className="container mx-auto bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">الموظفين</h2>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => setShowAddModal(true)} className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                إضافة موظف
                            </button>
                            <div className="relative">
                                <button onClick={handleFilterClick} className="bg-gray-100 rounded-lg py-2 px-4 text-gray-700 flex items-center">
                                    الكل
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>
                                <StatusFilterDropdown
                                    show={showFilterDropdown}
                                    onClose={() => setShowFilterDropdown(false)}
                                    onSelect={() => setShowFilterDropdown(false)}
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input type="text" placeholder="ابحث..." className="border border-gray-300 rounded-lg py-2 pl-10 pr-4 text-right" />
                            </div>
                        </div>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200 text-right">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">آخر دخول</th>
                                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">الدور</th>
                                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">الجوال</th>
                                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">البريد</th>
                                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {employeesData.map((employee, index) => (
                                <tr key={index}>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2 relative">
                                            <button onClick={() => handleMoreClick(index)} className="text-gray-500 hover:text-red-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                                </svg>
                                            </button>
                                            <MoreActionsDropdown
                                                show={showMoreDropdown === index}
                                                onClose={() => setShowMoreDropdown(null)}
                                                onEdit={() => { setShowAddModal(true); setShowMoreDropdown(null); }}
                                                onChangePassword={() => { setShowPasswordModal(true); setShowMoreDropdown(null); }}
                                                onDelete={() => { setShowDeleteModal(true); setShowMoreDropdown(null); }}
                                            />
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={employeeStatuses[index]}
                                                    onChange={() => handleToggleStatus(index)}
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                                            </label>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <span className={`py-1 px-3 rounded-full text-xs font-semibold ${getStatusColors(employeeStatuses[index] ? 'نشط' : 'غير نشط')}`}>
                                            {employeeStatuses[index] ? 'نشط' : 'غير نشط'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap">{employee.lastLogin}</td>
                                    <td className="py-4 px-4 whitespace-nowrap">{employee.role}</td>
                                    <td className="py-4 px-4 whitespace-nowrap">{employee.phone}</td>
                                    <td className="py-4 px-4 whitespace-nowrap">{employee.email}</td>
                                    <td className="py-4 px-4 whitespace-nowrap">{employee.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                        <div className="flex items-center">
                            <span>إجمالي الموظفين: 24</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="p-2 rounded-full hover:bg-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                            <span className="bg-red-500 text-white py-1 px-3 rounded-full">1</span>
                            <span className="py-1 px-3">2</span>
                            <span className="py-1 px-3">3</span>
                            <span className="py-1 px-3">4</span>
                            <span className="py-1 px-3">5</span>
                            <button className="p-2 rounded-full hover:bg-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex items-center">
                            <span>عرض في الصفحة</span>
                            <select className="mx-2 bg-white border border-gray-300 rounded-lg p-1 text-sm">
                                <option>10</option>
                                <option>5</option>
                                <option>20</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <AddEmployeeModal show={showAddModal} onClose={() => setShowAddModal(false)} onAdd={() => setShowAddModal(false)} />
            <ChangePasswordModal show={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
            <DeleteConfirmationModal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} onDelete={() => setShowDeleteModal(false)} />
        </div>
    );
};

export default EmployeesPage;