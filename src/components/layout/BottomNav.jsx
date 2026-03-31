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
    <nav className="bottom-nav-container">
      <div className="bottom-nav-glass">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
          >
            {({ isActive }) => (
              <div className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}>
                <div className="relative">
                  <link.icon size={22} strokeWidth={isActive ? 2.5 : 2} className="transition-all duration-300" />
                  {link.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-brand-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-lg shadow-brand-500/50 animate-bounce-gentle">
                      {link.badge > 9 ? '9+' : link.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 tracking-tight leading-none">{link.label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
