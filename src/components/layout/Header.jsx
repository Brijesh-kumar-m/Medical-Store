import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Globe, LogOut, LogIn, Sun, Moon } from 'lucide-react';

export default function Header() {
  const { t, lang, switchLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Simplified header for admin
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <header className="sticky top-0 z-40 bg-white/40 dark:bg-surface-950/40 backdrop-blur-2xl border-b border-slate-200/50 dark:border-white/5 shadow-sm transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-400 to-brand-600 flex items-center justify-center shadow-[0_0_15px_rgba(4,200,165,0.4)] group-hover:shadow-[0_0_25px_rgba(4,200,165,0.6)] transition-all overflow-hidden relative">
            <span className="text-white font-extrabold text-[15px] z-10 tracking-tight">O₂</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shine_1.5s_ease-out]" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white transition-colors duration-300">{t('app_name')}</h1>
            <p className="text-[11px] text-slate-500 dark:text-surface-400 font-medium tracking-wide uppercase transition-colors duration-300">{t('tagline')}</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center p-2.5 rounded-xl bg-slate-100/80 dark:bg-surface-800/60 border border-slate-200/80 dark:border-surface-600/50 hover:bg-slate-200/80 dark:hover:bg-surface-800 hover:border-brand-500/40 transition-all text-brand-500 dark:text-brand-400 shadow-inner"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            id="theme-toggle"
          >
            {theme === 'dark' ? (
              <Sun size={18} className="animate-[spin_10s_linear_infinite]" strokeWidth={2.5} />
            ) : (
              <Moon size={18} className="animate-[bounceGentle_2s_infinite]" strokeWidth={2.5} />
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => switchLanguage(lang === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-surface-800/60 border border-slate-200/80 dark:border-surface-600/50 hover:bg-slate-200/80 dark:hover:bg-surface-800 hover:border-brand-500/40 transition-all text-slate-800 dark:text-white shadow-inner"
            id="lang-toggle"
          >
            <Globe size={16} className="text-brand-400" strokeWidth={2.5} />
            <span className="text-xs font-bold text-slate-800 dark:text-white tracking-wide">{lang === 'en' ? 'हिं' : 'EN'}</span>
          </button>

          {/* Auth button */}
          {user && user.id !== 'guest' ? (
            <button
              onClick={logout}
              className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-surface-800/60 border border-slate-200/80 dark:border-surface-600/50 hover:bg-red-500/10 hover:border-red-500/30 transition-all text-slate-500 dark:text-surface-400 hover:text-red-400 shadow-inner"
              title={t('logout')}
              id="logout-btn"
            >
              <LogOut size={18} strokeWidth={2.5} />
            </button>
          ) : (
            <Link
              to="/login"
              className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-surface-800/60 border border-slate-200/80 dark:border-surface-600/50 hover:bg-brand-500/10 hover:border-brand-500/30 transition-all text-slate-500 dark:text-surface-400 hover:text-brand-400 shadow-inner group"
              id="login-btn"
            >
              <LogIn size={18} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
