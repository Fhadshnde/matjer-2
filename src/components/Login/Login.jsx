import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl, API_CONFIG } from '../../config/api';

const Login = ({ setIsLoggedIn }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
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

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
      }}
    >
      <div
        style={{
          padding: '40px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          width: '350px',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '20px',
            color: '#333',
          }}
        >
          تسجيل الدخول
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label
              htmlFor="phone"
              style={{ display: 'block', marginBottom: '5px', color: '#555' }}
            >
              رقم الهاتف
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box',
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="password"
              style={{ display: 'block', marginBottom: '5px', color: '#555' }}
            >
              كلمة المرور
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box',
              }}
              required
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
            disabled={loading}
          >
            {loading ? 'جاري الدخول...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
