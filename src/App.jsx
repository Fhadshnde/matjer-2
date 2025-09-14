import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './components/HomePage/HomePage';
import Analytics from './components/Analytics/Analytics';
import CustomerBehavior from './components/Analytics/CustomerBehavior';
import Sales from './components/Analytics/Sales';
import Products from './components/Products/Products';
import AddProduct from './components/Products/AddProduct';
import EditProduct from './components/Products/EditProduct';
import Customers from './components/Customers/Customers';
import OffersDashboard from './components/OffersDashboard/OffersDashboard';
import NotificationsDashboard from './components/NotificationsDashboard/NotificationsDashboard';
import MerchantDetails from './components/Merchants/MerchantDetails';
import MerchantsDashboard from './components/Merchants/MerchantsDashboard';
import EmployeeManagement from './components/Merchants/EmployeeManagement';
import Profits from './components/Profits/Profits';
import Settings from './components/Settings/Settings';
import Powers from './components/Settings/Powers';
import Orders from './components/Orders/Orders';
import NotificationsPage from './components/NotificationsDashboard/NotificationsPage';
import ProfileSettingsPage from './components/Settings/ProfileSettingsPage';
import ProductAnalytics from './components/ProductAnalytics/ProductAnalytics';
import UserAnalytics from './components/UserAnalytics/UserAnalytics';
import MyDues from './components/MyDues/MyDues';
import EmployeesPage from './components/Settings/EmployeesPage';
import TicketsPage from './components/Settings/TicketsPage';
import StoreInfoPage from './components/Settings/StoreInfoPage';
import Sections from './components/Sections/Sections';
import Login from './components/Login/Login';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);
  }, []);

  const handleSelectMerchant = (id) => {
    navigate(`/merchants/${id}`);
  };

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <div>
      {localStorage.getItem('token') && <Navbar setIsLoggedIn={setIsLoggedIn} />}
      <Routes>
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/customer-behavior" element={<ProtectedRoute><CustomerBehavior /></ProtectedRoute>} />
        <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
        <Route path="/edit-product/:id" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
        <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsDashboard /></ProtectedRoute>} />
        <Route path="/notifications-page" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/offers-dashboard" element={<ProtectedRoute><OffersDashboard /></ProtectedRoute>} />
        <Route path="/merchants" element={<ProtectedRoute><MerchantsDashboard onSelectMerchant={handleSelectMerchant} /></ProtectedRoute>} />
        <Route path="/merchants/:id" element={<ProtectedRoute><MerchantDetails /></ProtectedRoute>} />
        <Route path="/employees" element={<ProtectedRoute><EmployeeManagement /></ProtectedRoute>} />
        <Route path="/profits" element={<ProtectedRoute><Profits /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/profile-settings" element={<ProtectedRoute><ProfileSettingsPage /></ProtectedRoute>} />
        <Route path="/powers" element={<ProtectedRoute><Powers /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/product-analytics" element={<ProtectedRoute><ProductAnalytics /></ProtectedRoute>} />
        <Route path="/user-analytics" element={<ProtectedRoute><UserAnalytics /></ProtectedRoute>} />
        <Route path="/my-dues" element={<ProtectedRoute><MyDues /></ProtectedRoute>} />
        <Route path="/employees-page" element={<ProtectedRoute><EmployeesPage /></ProtectedRoute>} />
        <Route path="/tickets" element={<ProtectedRoute><TicketsPage /></ProtectedRoute>} />
        <Route path="/store-info" element={<ProtectedRoute><StoreInfoPage /></ProtectedRoute>} />
        <Route path="/sections" element={<ProtectedRoute><Sections /></ProtectedRoute>} />
      </Routes>
    </div>
  );
};

export default App;
