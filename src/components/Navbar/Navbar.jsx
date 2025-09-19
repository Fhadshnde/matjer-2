import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  Search,
  ChevronDown,
  LayoutDashboard,
  BarChart2,
  Package,
  ShoppingCart,
  Store,
  Wallet,
  Tag,
  Truck,
  History,
  ClipboardList,
  Inbox,
  Plus,
  Globe,
  X,
  CheckCircle,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { getApiUrl, getAuthHeaders } from "../../config/api";
import { motion } from "framer-motion";
import logo from '../../assets/logo.png';

const Navbar = ({ setIsLoggedIn }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [supplierInfo, setSupplierInfo] = useState({
    name: 'محمد صالح',
    storeName: 'متجر نايكي',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facepad=2&w=256&h=256&q=80'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Create refs for the profile and notifications dropdowns
  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  const toggleNotifications = () => setIsNotificationsOpen(!isNotificationsOpen);

  // جلب معلومات المورد
  const fetchSupplierInfo = async () => {
    try {
      const response = await axios.get(getApiUrl('/supplier/profile'), {
        headers: getAuthHeaders()
      });
      
      console.log('Supplier profile response:', response.data);
      setSupplierInfo({
        name: response.data.name || 'محمد صالح',
        storeName: response.data.storeName || 'متجر نايكي',
        avatar: response.data.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facepad=2&w=256&h=256&q=80'
      });
    } catch (err) {
      console.error('Error fetching supplier info:', err);
    }
  };

  // البحث
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // يمكن إضافة منطق البحث هنا
      console.log('Searching for:', searchQuery);
    }
  };

  const handleLogout = () => {
    if (window.confirm("هل أنت متأكد من تسجيل الخروج؟")) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchSupplierInfo();
  }, []);

  // New useEffect hook to handle clicks outside the notifications modal
  useEffect(() => {
    function handleClickOutside(event) {
      // Close notifications if click is outside the notifications dropdown
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      // Close profile menu if click is outside the profile menu
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }
    
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on component cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationsRef, profileMenuRef]);

  const menuItems = [
    { path: "/", icon: <LayoutDashboard className="w-4 h-4" />, text: "نظرة عامة" },
    { path: "/products", icon: <Package className="w-4 h-4" />, text: "المنتجات" },
    { path: "/orders", icon: <ShoppingCart className="w-4 h-4" />, text: "الطلبات" },
    { path: "/product-analytics", icon: <History className="w-4 h-4" />, text: "التحليلات " },
    { path: "/my-dues", icon: <ClipboardList className="w-4 h-4" />, text: "مستحقاتي" },
    { path: "/sections", icon: <Bell className="w-4 h-4" />, text: "الاقسام" },
    // { path: "/customers", icon: <Globe className="w-4 h-4" />, text: "اعدادات التوصيل" },
    { path: "/profits", icon: <Wallet className="w-4 h-4" />, text: "الارباح" },
    { path: "/offers-dashboard", icon: <Tag className="w-4 h-4" />, text: "العروض والخصومات" },
    { path: "/store-info", icon: <Tag className="w-4 h-4" />, text: "الإعدادات" },
  ];

  const notifications = [
    { id: 1, title: "انخفاض مخزون منتج جهاز iPhone 15", time: "منذ 10 دقائق", isUnread: true, category: "منتج" },
    { id: 2, title: "إصدار حديث: Apple Watch Series 9", time: "منذ 20 دقيقة", isUnread: true, category: "منتج" },
    { id: 3, title: "تحقيق أرباح قياسية: ربع سنوي", time: "منذ 15 دقيقة", isUnread: true, category: "أرباح" },
    { id: 4, title: "تخفيض أسعار: MacBook Air", time: "منذ 25 دقيقة", isUnread: false, category: "منتج" },
    { id: 5, title: "مشاكل في التوصيل: Apple TV 4K", time: "منذ 30 دقيقة", isUnread: false, category: "توصيل" },
    { id: 6, title: "إطلاق خدمة جديدة: +Apple Fitness", time: "منذ 35 دقيقة", isUnread: false, category: "خدمات" },
    { id: 7, title: "استعراض المنتج: iPad Pro 2023", time: "منذ 40 دقيقة", isUnread: false, category: "منتج" },
    { id: 8, title: "مراجعة تطبيق: Apple Music", time: "منذ 45 دقيقة", isUnread: false, category: "تطبيق" },
    { id: 9, title: "تحقيق أرباح قياسية: ربع سنوي", time: "منذ 50 دقيقة", isUnread: false, category: "أرباح" },
    { id: 10, title: "التحديثات الأمنية: iCloud", time: "منذ 55 دقيقة", isUnread: false, category: "نظام" },
    { id: 11, title: "استطلاع رأي العملاء: تجربة المستخدم", time: "منذ ساعة", isUnread: false, category: "استطلاع" },
    { id: 12, title: "زيادة مبيعات منتج: سماعة AirPods Pro", time: "منذ 10 دقائق", isUnread: false, category: "مبيعات" },
  ];

  return (
    <div className="bg-white shadow-sm border-b border-gray-200" dir="rtl">
      <div className="flex items-center justify-between px-6 py-3">
        <div>
          <img src={logo} alt="Logo" className="w-16" />
        </div>
        <div className="flex items-center gap-4 flex-1 max-w-2xl mx-8">
          {/* <form onSubmit={handleSearch} className="relative flex-1">
            <input 
              type="text" 
              placeholder="إبحث عن طلبات، منتجات، تجار، زبائن..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm" 
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </form> */}
        </div>
        <div className="flex items-center gap-4">
          <div className="relative" ref={profileMenuRef}>
            <button onClick={toggleProfileMenu} className="flex items-center gap-2 focus:outline-none">
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isProfileMenuOpen ? "rotate-180" : "rotate-0"}`} />
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{supplierInfo.name}</p>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-yellow-500">👋</span>
                  <span className="text-xs text-gray-500">{supplierInfo.storeName}</span>
                </div>
              </div>
              <div className="relative">
                <img 
                  className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover" 
                  src={supplierInfo.avatar} 
                  alt="User Avatar" 
                />
                <span className="absolute -bottom-0.5 -left-0.5 block w-3.5 h-3.5 bg-green-400 rounded-full ring-2 ring-white"></span>
              </div>
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg">الملف الشخصي</Link>
                <Link to="/profile-settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">إعدادات الحساب</Link>
                <hr className="my-1" />
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg">تسجيل الخروج</button>
              </div>
            )}
          </div>
          <div className="relative" ref={notificationsRef}>
            <button onClick={toggleNotifications}>
              <Inbox className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
              <span className="absolute -top-1 -right-1 block w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {isNotificationsOpen && (
              <div className="absolute transform -translate-x-1/2 sm:left-[-70px] sm:transform-none mt-2 w-full max-w-sm sm:w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">الإشعارات</h3>
                  <button onClick={toggleNotifications}>
                    <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                  </button>
                </div>
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                  <span className="text-sm text-gray-500">لديك {notifications.filter(n => n.isUnread).length} إشعارات غير مقروءة</span>
                  <button className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>تحديد الكل كمقروء</span>
                  </button>
                </div>
                <div className="py-2 max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <Link key={notification.id} to={`/notifications-page`} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200 cursor-pointer border-b border-gray-100" onClick={toggleNotifications}>
                      {notification.isUnread && <span className="block w-2.5 h-2.5 bg-red-500 rounded-full flex-shrink-0" />}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{notification.time}</p>
                      </div>
                      <div className="relative flex-shrink-0">
                        <Bell className="w-4 h-4 text-gray-400" />
                        <span className="absolute -top-1 -right-1 block w-2 h-2 bg-yellow-400 rounded-full"></span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
            <Globe className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 font-medium">EN</span>
          </div>
        </div>
      </div>
      <div className="relative flex items-center gap-1 px-6 py-2 overflow-x-auto scrollbar-hide bg-gray-50/50">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={index} to={item.path} className="relative flex items-center gap-2 py-2 px-3 text-gray-600 hover:text-red-500 hover:bg-white rounded-lg transition-all duration-200 whitespace-nowrap text-sm font-medium">
              {isActive && (
                <motion.div
                  layoutId="underline"
                  className="absolute inset-0 rounded-lg bg-red-500 z-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <span className={`relative z-10 flex items-center gap-2 ${isActive ? 'text-white' : 'text-gray-600'}`}>
                {item.icon}
                <span>{item.text}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Navbar;