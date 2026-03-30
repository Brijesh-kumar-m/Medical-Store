import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { Home, Pill, Droplets, ShoppingCart, User, Shield } from 'lucide-react';

export default function BottomNav() {
  const { t } = useLanguage();
  const { totalItems } = useCart();
  const { isAdmin } = useAuth();
  const location = useLocation();

  // Hide on admin pages
  if (location.pathname.startsWith('/admin')) return null;

  const links = [
    { to: '/', icon: Home, label: t('home') },
    { to: '/products', icon: Pill, label: t('medicines') },
    { to: '/blood-tests', icon: Droplets, label: t('blood_tests') },
    { to: '/cart', icon: ShoppingCart, label: t('cart'), badge: totalItems },
    { to: '/profile', icon: User, label: t('profile') },
  ];

  if (isAdmin) {
    links.push({ to: '/admin', icon: Shield, label: 'Admin' });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-surface-700/50">
      <div className="max-w-lg mx-auto flex items-center justify-around py-1 px-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `nav-item relative ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`
            }
            end={link.to === '/'}
          >
            <div className="relative">
              <link.icon size={22} strokeWidth={1.8} />
              {link.badge > 0 && (
                <span className="absolute -top-2 -right-3 bg-brand-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-brand-500/40">
                  {link.badge > 9 ? '9+' : link.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 leading-tight">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
