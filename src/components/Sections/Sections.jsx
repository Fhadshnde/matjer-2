import React, { useState } from 'react';
import { IoAdd, IoPencilOutline, IoTrashOutline, IoEyeOutline, IoEllipsisHorizontal, IoSearchOutline, IoChevronUpOutline, IoChevronDownOutline } from 'react-icons/io5';

const mainCategoriesData = [
    {
        id: '1',
        name: 'إلكترونيات',
        image: 'https://placehold.co/40x40/e0e0e0/ffffff?text=E',
        description: 'هواتف ذكية، أجهزة لوحية، أجهزة كمبيوتر.'
    },
    {
        id: '2',
        name: 'أزياء',
        image: 'https://placehold.co/40x40/e0e0e0/ffffff?text=F',
        description: 'ملابس رجالية، نسائية، أطفال، إكسسوارات.'
    },
    {
        id: '3',
        name: 'منزل وحديقة',
        image: 'https://placehold.co/40x40/e0e0e0/ffffff?text=H',
        description: 'أثاث، ديكور، أدوات مطبخ، نباتات.'
    },
];

const subCategoriesData = [
    {
        id: '101',
        mainCategoryId: '1',
        name: 'هواتف ذكية',
        image: 'https://placehold.co/40x40/e0e0e0/ffffff?text=S',
        description: 'جميع أنواع الهواتف الذكية من مختلف العلامات التجارية.'
    },
    {
        id: '102',
        mainCategoryId: '1',
        name: 'أجهزة لوحية',
        image: 'https://placehold.co/40x40/e0e0e0/ffffff?text=T',
        description: 'أجهزة لوحية للأعمال والترفيه.'
    },
    {
        id: '201',
        mainCategoryId: '2',
        name: 'ملابس رجالية',
        image: 'https://placehold.co/40x40/e0e0e0/ffffff?text=M',
        description: 'أزياء رجالية حديثة وعصرية.'
    },
];

const CategoriesPage = () => {
    const [isAddMainCategoryModalOpen, setIsAddMainCategoryModalOpen] = useState(false);
    const [isEditMainCategoryModalOpen, setIsEditMainCategoryModalOpen] = useState(false);
    const [isAddSubCategoryModalOpen, setIsAddSubCategoryModalOpen] = useState(false);
    const [isEditSubCategoryModalOpen, setIsEditSubCategoryModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryType, setCategoryType] = useState('');

    const openAddModal = (type) => {
        if (type === 'main') {
            setIsAddMainCategoryModalOpen(true);
        } else {
            setIsAddSubCategoryModalOpen(true);
        }
    };

    const openEditModal = (category, type) => {
        setSelectedCategory(category);
        setCategoryType(type);
        if (type === 'main') {
            setIsEditMainCategoryModalOpen(true);
        } else {
            setIsEditSubCategoryModalOpen(true);
        }
    };

    const openDeleteModal = (category, type) => {
        setSelectedCategory(category);
        setCategoryType(type);
        setIsDeleteModalOpen(true);
    };

    const closeModal = () => {
        setIsAddMainCategoryModalOpen(false);
        setIsEditMainCategoryModalOpen(false);
        setIsAddSubCategoryModalOpen(false);
        setIsEditSubCategoryModalOpen(false);
        setIsDeleteModalOpen(false);
        setSelectedCategory(null);
        setCategoryType('');
    };

    const Modal = ({ isOpen, onClose, children }) => {
        if (!isOpen) return null;
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative font-['Tajawal']">
                    <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                    {children}
                </div>
            </div>
        );
    };

    const CategoryForm = ({ category, type, isEdit }) => (
        <div className="text-right">
            <h2 className="text-xl font-bold mb-4 text-gray-800">{isEdit ? `تعديل ${type === 'main' ? 'القسم الرئيسي' : 'القسم الفرعي'}` : `إضافة ${type === 'main' ? 'قسم رئيسي' : 'قسم فرعي'}`}</h2>
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="اسم القسم"
                    className="bg-gray-100 w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 text-right"
                    defaultValue={isEdit ? category.name : ''}
                />
                {type === 'sub' && (
                    <select
                        className="bg-gray-100 w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 text-right"
                    >
                        <option value="">اختر القسم الرئيسي</option>
                        {mainCategoriesData.map(mainCat => (
                            <option key={mainCat.id} value={mainCat.id} selected={isEdit && category.mainCategoryId === mainCat.id}>
                                {mainCat.name}
                            </option>
                        ))}
                    </select>
                )}
                <input
                    type="text"
                    placeholder="رابط الصورة"
                    className="bg-gray-100 w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 text-right"
                    defaultValue={isEdit ? category.image : ''}
                />
                <textarea
                    placeholder="وصف القسم"
                    className="bg-gray-100 w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800 text-right"
                    rows="4"
                    defaultValue={isEdit ? category.description : ''}
                />
            </div>
            <div className="flex justify-center mt-6 space-x-4 rtl:space-x-reverse">
                <button
                    onClick={closeModal}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                    إلغاء
                </button>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                    {isEdit ? 'تعديل' : 'إضافة'}
                </button>
            </div>
        </div>
    );

    const DeleteModal = ({ isOpen, onClose, category, type }) => {
        if (!isOpen) return null;
        return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <div className="flex flex-col items-center text-center">
                    <div className="bg-red-100 text-red-600 p-4 rounded-full mb-4">
                        <IoTrashOutline className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold mt-2 text-gray-800">هل أنت متأكد أنك تريد حذف هذا القسم؟</h3>
                    <p className="text-sm text-gray-500 mt-2">
                        سوف يتم حذف {type === 'main' ? 'القسم الرئيسي' : 'القسم الفرعي'} "<span className="font-semibold">{category?.name}</span>" بشكل نهائي.
                    </p>
                    <div className="flex justify-center space-x-4 rtl:space-x-reverse mt-6 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                        >
                            حذف القسم
                        </button>
                    </div>
                </div>
            </Modal>
        );
    };

    return (
        <div className="bg-gray-100 min-h-screen p-8 text-right font-['Tajawal']" dir="rtl">
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center"
                            onClick={() => openAddModal('sub')}
                        >
                            <IoAdd className="w-5 h-5 ml-2" />
                            إضافة قسم فرعي
                        </button>
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                placeholder="ابحث باسم القسم"
                                className="bg-gray-100 text-gray-700 px-4 py-2 pr-10 rounded-lg w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-red-500 text-right"
                            />
                            <IoSearchOutline className="absolute right-3 text-gray-400" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">الأقسام الفرعية</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-right bg-white">
                        <thead>
                            <tr className="border-b border-gray-300">
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm text-center">الإجراءات</th>
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm">الوصف</th>
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm">القسم الرئيسي</th>
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm">اسم القسم</th>
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm">صورة القسم</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subCategoriesData.map((category) => (
                                <tr key={category.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex justify-center items-center space-x-2 rtl:space-x-reverse">
                                            <button
                                                className="text-blue-500 hover:text-blue-700"
                                                onClick={() => openEditModal(category, 'sub')}
                                            >
                                                <IoPencilOutline className="w-5 h-5" />
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => openDeleteModal(category, 'sub')}
                                            >
                                                <IoTrashOutline className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{category.description}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{mainCategoriesData.find(main => main.id === category.mainCategoryId)?.name || ''}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{category.name}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex justify-start">
                                            <img src={category.image} alt={category.name} className="w-10 h-10 rounded-md object-cover" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center"
                            onClick={() => openAddModal('main')}
                        >
                            <IoAdd className="w-5 h-5 ml-2" />
                            إضافة قسم رئيسي
                        </button>
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                placeholder="ابحث باسم القسم"
                                className="bg-gray-100 text-gray-700 px-4 py-2 pr-10 rounded-lg w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-red-500 text-right"
                            />
                            <IoSearchOutline className="absolute right-3 text-gray-400" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">الأقسام الرئيسية</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-right bg-white">
                        <thead>
                            <tr className="border-b border-gray-300">
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm text-center">الإجراءات</th>
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm">الوصف</th>
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm">اسم القسم</th>
                                <th className="py-3 px-4 text-gray-500 font-normal text-sm">صورة القسم</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mainCategoriesData.map((category) => (
                                <tr key={category.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex justify-center items-center space-x-2 rtl:space-x-reverse">
                                            <button
                                                className="text-blue-500 hover:text-blue-700"
                                                onClick={() => openEditModal(category, 'main')}
                                            >
                                                <IoPencilOutline className="w-5 h-5" />
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => openDeleteModal(category, 'main')}
                                            >
                                                <IoTrashOutline className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{category.description}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{category.name}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex justify-start">
                                            <img src={category.image} alt={category.name} className="w-10 h-10 rounded-md object-cover" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isAddMainCategoryModalOpen || isEditMainCategoryModalOpen} onClose={closeModal}>
                <CategoryForm
                    category={selectedCategory}
                    type="main"
                    isEdit={isEditMainCategoryModalOpen}
                />
            </Modal>
            
            <Modal isOpen={isAddSubCategoryModalOpen || isEditSubCategoryModalOpen} onClose={closeModal}>
                <CategoryForm
                    category={selectedCategory}
                    type="sub"
                    isEdit={isEditSubCategoryModalOpen}
                />
            </Modal>

            <DeleteModal isOpen={isDeleteModalOpen} onClose={closeModal} category={selectedCategory} type={categoryType} />

        </div>
    );
};

export default CategoriesPage;