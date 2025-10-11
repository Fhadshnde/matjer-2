import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl, API_CONFIG } from '../../config/api';
import { FaRegEye, FaRegEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';
import logo from '../../assets/logo.png';

const Login = ({ setIsLoggedIn }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // إرسال طلب تسجيل الدخول
      const response = await axios.post(
        getApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN),
        { phone, password }
      );

      // الحصول على التوكن الصحيح من response
      const token = response.data.access_token;

      if (!token) {
        throw new Error('لم يتم استلام التوكن من الخادم');
      }

      // حفظ التوكن في localStorage
      localStorage.setItem('token', token);

      // تحديث حالة تسجيل الدخول
      setIsLoggedIn(true);

      // الانتقال للصفحة الرئيسية
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      alert('فشل تسجيل الدخول، يرجى التحقق من رقم الهاتف وكلمة المرور.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white text-black font-sans">
      <div className="p-10 bg-white rounded-lg w-[450px] text-center">
        <div className="mb-5">
          {/* هنا يمكنك إضافة شعار التطبيق */}
          <img src={logo} alt="Logo" className="w-24 mb-5 mx-auto" />
        </div>
        <h2 className="text-center mb-2 text-2xl font-bold text-black">
          👋 أهلاً بك
        </h2>
        <p className="text-gray-600 mb-10">
          سجل دخولك لإدارة منتجاتك وطلباتك وأرباحك
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-5 relative text-right">
            <label htmlFor="phone" className="block mb-1 text-black">
              رقم الهاتف
            </label>
            <div className="relative">
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07777777777"
                className="w-full py-3 px-4 pl-10 border border-gray-300 rounded-lg bg-gray-100 text-black"
                required
              />
              <FaEnvelope className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="mb-5 relative text-right">
            <label htmlFor="password" className="block mb-1 text-black">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full py-3 px-4 pr-12 pl-10 border border-gray-300 rounded-lg bg-gray-100 text-black"
                required
              />
              <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-red-600 text-white border-none rounded-lg cursor-pointer text-lg font-bold hover:bg-red-700 transition-colors duration-200"
            disabled={loading}
          >
            {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;