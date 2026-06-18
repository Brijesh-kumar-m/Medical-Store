import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Link, useNavigate } from 'react-router-dom';
import { showToast } from '../components/ui/Toast';
import { User, Phone, Package, Droplets, FileImage, LogOut, Shield, ArrowRight, Gift, Sun, Moon, Bell, Volume2 } from 'lucide-react';

export default function Profile() {
  const { t, lang } = useLanguage();
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { soundEnabled, setSoundEnabled } = useNotifications();
  const navigate = useNavigate();

  const [permission, setPermission] = useState('Notification' in window ? Notification.permission : 'unsupported');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  async function requestNotificationPerm() {
    if (!('Notification' in window)) return;
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        showToast(lang === 'hi' ? 'पुश नोटिफिकेशन सक्रिय!' : 'Push notifications enabled!', 'success');
      }
    } catch (e) {
      console.error(e);
    }
  }

  function simulateClosedAppPush() {
    if (permission !== 'granted') {
      showToast(lang === 'hi' ? 'पहले नोटिफिकेशन सक्षम करें' : 'Please enable notifications first', 'error');
      return;
    }

    showToast(
      lang === 'hi' 
        ? 'सिमुलेशन 3 सेकंड में शुरू होगा। कृपया होम स्क्रीन पर जाएं या ऐप बंद करें।' 
        : 'Starting simulation in 3s. Minimize/hide the app now!', 
      'success'
    );

    setTimeout(async () => {
      try {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification('🏥 O2Clinic (Closed-App Sim)', {
          body: lang === 'hi'
            ? 'यह एक बंद ऐप पुश नोटिफिकेशन सिमुलेशन है!'
            : 'This is a simulated closed-app push notification!',
          icon: '/favicon.svg',
          badge: '/favicon.svg',
          vibrate: [200, 100, 200],
          requireInteraction: true,
          data: { url: '/orders' }
        });
      } catch (err) {
        console.error('SW simulation failed:', err);
      }
    }, 3000);
  }

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
    { to: '/referral', icon: Gift, label: lang === 'hi' ? 'रेफ़र करें और कमाएँ' : 'Refer & Earn', desc: lang === 'hi' ? 'दोस्तों को शेयर करें, रिवॉर्ड पाएँ' : 'Share with friends, earn rewards' },
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
            <p className="text-slate-500 dark:text-surface-400 text-sm flex items-center gap-1">
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
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-surface-700 flex items-center justify-center shrink-0 transition-colors">
              <item.icon size={20} className="text-brand-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{item.label}</h4>
              <p className="text-slate-500 dark:text-surface-500 text-xs">{item.desc}</p>
            </div>
            <ArrowRight size={16} className="text-slate-400 dark:text-surface-500" />
          </Link>
        ))}

        {/* Theme Toggle Option */}
        <div
          onClick={toggleTheme}
          className="card-interactive flex items-center gap-4 cursor-pointer"
          id="profile-theme-toggle"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-surface-700 flex items-center justify-center shrink-0 transition-colors">
            {theme === 'dark' ? (
              <Sun size={20} className="text-brand-400" />
            ) : (
              <Moon size={20} className="text-brand-400" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">
              {lang === 'hi' ? 'थीम बदलें' : 'Change Theme'}
            </h4>
            <p className="text-slate-500 dark:text-surface-500 text-xs">
              {lang === 'hi' 
                ? (theme === 'dark' ? 'लाइट मोड चालू करें' : 'डार्क मोड चालू करें')
                : (theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode')}
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20 capitalize">
            {theme === 'dark' ? (lang === 'hi' ? 'डार्क' : 'Dark') : (lang === 'hi' ? 'लाइट' : 'Light')}
          </span>
        </div>
      </div>

      {/* Notifications Preferences Card */}
      <div className="card space-y-4 mb-8">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2 border-b border-slate-200/40 dark:border-surface-700/40 pb-3">
          <Bell size={16} className="text-brand-400" />
          {lang === 'hi' ? 'नोटिफिकेशन सेटिंग्स' : 'Notification Settings'}
        </h3>

        <div className="space-y-4 text-xs font-semibold text-slate-700 dark:text-surface-300">
          {/* Permission status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-900 dark:text-white">{lang === 'hi' ? 'पुश नोटिफिकेशन' : 'Push Notifications'}</p>
              <p className="text-[10px] text-slate-400 dark:text-surface-500 font-medium mt-0.5">
                {lang === 'hi' ? 'आदेश स्थिति और महत्वपूर्ण घोषणाएं' : 'Order status and important updates'}
              </p>
            </div>
            
            {permission === 'granted' ? (
              <span className="badge-success lowercase">{lang === 'hi' ? 'सक्षम' : 'enabled'}</span>
            ) : permission === 'denied' ? (
              <span className="badge-danger lowercase">{lang === 'hi' ? 'अस्वीकृत' : 'blocked'}</span>
            ) : permission === 'unsupported' ? (
              <span className="badge-danger lowercase">{lang === 'hi' ? 'असमर्थित' : 'not supported'}</span>
            ) : (
              <button
                onClick={requestNotificationPerm}
                className="px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold transition-all shadow-sm"
              >
                {lang === 'hi' ? 'सक्रिय करें' : 'Enable'}
              </button>
            )}
          </div>

          {/* Sound settings */}
          <div className="flex items-center justify-between border-t border-slate-200/30 dark:border-surface-700/30 pt-3">
            <div>
              <p className="text-slate-900 dark:text-white">{lang === 'hi' ? 'नोटिफिकेशन साउंड' : 'In-App Sound'}</p>
              <p className="text-[10px] text-slate-400 dark:text-surface-500 font-medium mt-0.5">
                {lang === 'hi' ? 'नया अलर्ट आने पर ऑडियो चाइम' : 'Play a chime when alerts arrive online'}
              </p>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border transition-all ${
                soundEnabled 
                  ? 'bg-brand-500/10 text-brand-400 border-brand-500/20' 
                  : 'bg-slate-100 dark:bg-surface-800 text-slate-400 border-slate-200 dark:border-surface-700'
              }`}
            >
              <Volume2 size={16} />
            </button>
          </div>

          {/* Closed App Push Simulator */}
          {permission === 'granted' && (
            <div className="border-t border-slate-200/30 dark:border-surface-700/30 pt-4 flex flex-col gap-2">
              <p className="text-slate-900 dark:text-white">{lang === 'hi' ? 'पुश सिमुलेटर (परीक्षण)' : 'Push Simulator (Test)'}</p>
              <p className="text-[10px] text-slate-400 dark:text-surface-500 font-medium leading-relaxed">
                {lang === 'hi' 
                  ? 'ऐप को बंद करने या पृष्ठभूमि में ले जाने पर पुश नोटिफिकेशन का परीक्षण करें।'
                  : 'Test system notifications even when the app is minimized or the screen is locked.'}
              </p>
              <button
                onClick={simulateClosedAppPush}
                className="btn-secondary w-full py-3 flex items-center justify-center gap-2 text-xs font-bold mt-1 shadow-sm"
              >
                📲 {lang === 'hi' ? 'बंद ऐप नोटिफिकेशन का परीक्षण करें' : 'Simulate Closed-App Push'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={() => { logout(); navigate('/login'); }}
        className="btn-danger w-full flex items-center justify-center gap-2"
        id="profile-logout"
      >
        <LogOut size={18} />
        {lang === 'hi' ? 'लॉगआउट' : 'Logout'}
      </button>
    </div>
  );
}
