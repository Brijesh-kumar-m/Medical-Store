import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, Phone, Package, Droplets, FileImage, LogOut, Shield, ArrowRight } from 'lucide-react';

export default function Profile() {
  const { t, lang } = useLanguage();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  if (!user || user.id === 'guest') {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[60vh] text-center">
        <User size={64} className="text-surface-600 mb-4" />
        <h2 className="text-xl font-bold mb-2">
          {lang === 'hi' ? 'लॉगिन करें' : 'Login Required'}
        </h2>
        <p className="text-surface-400 text-sm mb-6">
          {lang === 'hi' ? 'अपना प्रोफ़ाइल देखने के लिए लॉगिन करें' : 'Login to view your profile'}
        </p>
        <Link to="/login" className="btn-primary">{t('login')}</Link>
      </div>
    );
  }

  const menuItems = [
    { to: '/orders', icon: Package, label: t('orders'), desc: lang === 'hi' ? 'अपने सभी ऑर्डर देखें' : 'View all your orders' },
    { to: '/blood-tests', icon: Droplets, label: t('blood_tests'), desc: lang === 'hi' ? 'ब्लड टेस्ट बुक करें' : 'Book a blood test' },
    { to: '/prescriptions', icon: FileImage, label: t('prescriptions'), desc: lang === 'hi' ? 'प्रिस्क्रिप्शन अपलोड करें' : 'Upload prescriptions' },
  ];

  if (isAdmin) {
    menuItems.push({ to: '/admin', icon: Shield, label: t('admin'), desc: lang === 'hi' ? 'एडमिन पैनल' : 'Admin Panel' });
  }

  return (
    <div className="page-container">
      {/* Profile Header */}
      <div className="card bg-gradient-to-r from-brand-500/10 to-brand-600/10 border-brand-500/20 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
            <span className="text-white font-black text-xl">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-surface-400 text-sm flex items-center gap-1">
              <Phone size={12} /> {user.mobile || '—'}
            </p>
            {isAdmin && <span className="badge-success mt-1">Admin</span>}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="space-y-3 mb-8">
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="card-interactive flex items-center gap-4"
            id={`profile-${item.to.replace('/', '')}`}
          >
            <div className="w-12 h-12 rounded-xl bg-surface-700 flex items-center justify-center shrink-0">
              <item.icon size={20} className="text-brand-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{item.label}</h4>
              <p className="text-surface-500 text-xs">{item.desc}</p>
            </div>
            <ArrowRight size={16} className="text-surface-500" />
          </Link>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={() => { logout(); navigate('/login'); }}
        className="btn-danger w-full flex items-center justify-center gap-2"
        id="profile-logout"
      >
        <LogOut size={18} />
        {t('logout')}
      </button>
    </div>
  );
}
