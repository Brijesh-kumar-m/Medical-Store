import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { LayoutDashboard, Package, ShoppingCart, Droplets, Settings, ArrowLeft, Shield, Menu, X } from 'lucide-react';

export default function AdminLayout() {
  const { user, isAdmin } = useAuth();
  const { t, lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin]);

  if (!isAdmin) return null;

  const links = [
    { to: '/admin', icon: LayoutDashboard, label: t('admin_dashboard'), end: true },
    { to: '/admin/products', icon: Package, label: t('admin_products') },
    { to: '/admin/orders', icon: ShoppingCart, label: t('admin_orders') },
    { to: '/admin/blood-tests', icon: Droplets, label: t('admin_blood_tests') },
    { to: '/admin/settings', icon: Settings, label: t('admin_settings') },
  ];

  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="overlay lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 glass border-r border-surface-700/50 z-50 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-4 border-b border-surface-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-sm gradient-text">{t('admin')}</h2>
              <p className="text-xs text-surface-500">{user?.name}</p>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {links.map((link) => {
            const isActive = link.end
              ? location.pathname === link.to
              : location.pathname.startsWith(link.to) && link.to !== '/admin';
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                    : 'text-surface-400 hover:text-white hover:bg-surface-800'
                }`}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Link
            to="/"
            className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"
          >
            <ArrowLeft size={16} />
            {lang === 'hi' ? 'होम पर जाएँ' : 'Go to Home'}
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 glass border-b border-surface-700/50 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl bg-surface-800 border border-surface-600">
            <Menu size={20} />
          </button>
          <h2 className="font-bold gradient-text">{t('admin')}</h2>
        </div>

        <div className="p-4 lg:p-6 max-w-6xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
