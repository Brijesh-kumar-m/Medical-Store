import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ToastContainer from './components/ui/Toast';
import ErrorBoundary from './components/ui/ErrorBoundary';
import OfflineIndicator from './components/ui/OfflineIndicator';
import PushNotificationBanner from './components/ui/PushNotificationBanner';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Products from './pages/Products';
import Cart from './pages/Cart';
import BloodTests from './pages/BloodTests';
import Prescriptions from './pages/Prescriptions';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Referral from './pages/Referral';

// Admin
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminBloodTests from './pages/admin/AdminBloodTests';
import AdminPrescriptions from './pages/admin/AdminPrescriptions';
import AdminSettings from './pages/admin/AdminSettings';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <CartProvider>
                <OfflineIndicator />
                <PushNotificationBanner />
                <Routes>
                  {/* Public routes */}
                  <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/blood-tests" element={<BloodTests />} />
                    <Route path="/prescriptions" element={<Prescriptions />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/referral" element={<Referral />} />
                  </Route>

                  {/* Admin routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="blood-tests" element={<AdminBloodTests />} />
                    <Route path="prescriptions" element={<AdminPrescriptions />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                </Routes>
                <ToastContainer />
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
