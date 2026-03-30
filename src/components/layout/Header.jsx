import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Globe, LogOut, LogIn } from 'lucide-react';

export default function Header() {
  const { t, lang, switchLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const location = useLocation();

  // Simplified header for admin
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <header className="sticky top-0 z-40 glass border-b border-surface-700/50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
            <span className="text-white font-black text-sm">O₂</span>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight gradient-text">{t('app_name')}</h1>
            <p className="text-[10px] text-surface-400 leading-none">{t('tagline')}</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={() => switchLanguage(lang === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-800 border border-surface-600 hover:border-brand-500/50 transition-all text-sm font-medium"
            id="lang-toggle"
          >
            <Globe size={16} className="text-brand-400" />
            <span>{lang === 'en' ? 'हिं' : 'En'}</span>
          </button>

          {/* Auth button */}
          {user && user.id !== 'guest' ? (
            <button
              onClick={logout}
              className="p-2 rounded-xl bg-surface-800 border border-surface-600 hover:border-red-500/50 transition-all text-surface-400 hover:text-red-400"
              title={t('logout')}
              id="logout-btn"
            >
              <LogOut size={18} />
            </button>
          ) : (
            <Link
              to="/login"
              className="p-2 rounded-xl bg-surface-800 border border-surface-600 hover:border-brand-500/50 transition-all text-surface-400 hover:text-brand-400"
              id="login-btn"
            >
              <LogIn size={18} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
