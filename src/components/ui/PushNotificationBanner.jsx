import { useState, useEffect } from 'react';
import { Bell, BellOff, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { savePushToken } from '../../services/index.js';

export default function PushNotificationBanner() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [show, setShow] = useState(false);
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    if (!user || user.id === 'guest') return;
    if (!('Notification' in window)) return;

    const dismissed = localStorage.getItem('o2_push_dismissed');
    const perm = Notification.permission;
    setPermission(perm);

    // Show banner only if not yet decided and not dismissed recently
    if (perm === 'default' && !dismissed) {
      const timer = setTimeout(() => setShow(true), 5000); // Show after 5s
      return () => clearTimeout(timer);
    }
  }, [user]);

  async function handleAllow() {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        // Show a test notification
        new Notification('O2Clinic 🏥', {
          body: lang === 'hi' ? 'नोटिफिकेशन चालू! ऑर्डर अपडेट मिलेंगे।' : 'Notifications enabled! You\'ll get order updates.',
          icon: '/favicon.svg',
        });

        // Save FCM token if service worker is available
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          // FCM token would be obtained here with Firebase messaging
          // For now, save a placeholder indicating permission was granted
          try {
            await savePushToken(user.id, `web_push_${Date.now()}`);
          } catch (e) {
            console.log('[Push] Token save skipped (table may not exist yet)');
          }
        }
      }
    } catch (err) {
      console.error('[Push] Error:', err);
    }
    setShow(false);
  }

  function handleDismiss() {
    setShow(false);
    localStorage.setItem('o2_push_dismissed', Date.now().toString());
  }

  if (!show || permission !== 'default') return null;

  return (
    <div className="fixed top-16 left-3 right-3 z-50 max-w-lg mx-auto animate-slide-down">
      <div className="glass rounded-2xl p-4 border border-brand-500/30 shadow-[0_10px_40px_rgba(4,200,165,0.15)] flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/30">
          <Bell size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold leading-tight">
            {lang === 'hi' ? '🔔 ऑर्डर अपडेट पाएँ' : '🔔 Get Order Updates'}
          </p>
          <p className="text-surface-400 text-xs mt-0.5">
            {lang === 'hi' ? 'दवाई डिस्पैच और डिलीवरी की सूचना' : 'Medicine dispatch & delivery notifications'}
          </p>
          <div className="flex gap-2 mt-2.5">
            <button
              onClick={handleAllow}
              className="px-4 py-1.5 rounded-xl bg-brand-500 text-white text-xs font-bold hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/30"
            >
              {lang === 'hi' ? 'हाँ, चालू करें' : 'Allow'}
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-1.5 rounded-xl bg-surface-800 text-surface-400 text-xs font-semibold hover:bg-surface-700 transition-all"
            >
              {lang === 'hi' ? 'बाद में' : 'Later'}
            </button>
          </div>
        </div>
        <button onClick={handleDismiss} className="text-surface-500 hover:text-white transition-colors p-1">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
