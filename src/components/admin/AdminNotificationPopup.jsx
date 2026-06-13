import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import config from '../../config/backend.js';
import {
  Bell, BellRing, X, ShoppingCart, FileImage, Droplets,
  Clock, ChevronRight, Volume2, VolumeX, Trash2
} from 'lucide-react';

import { supabase } from '../../services/supabase.js';

// Notification Sound (Web Audio API)
function playNotificationSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const playTone = (freq, startTime, duration) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    playTone(880, audioCtx.currentTime, 0.3);
    playTone(1320, audioCtx.currentTime + 0.15, 0.35);
  } catch (e) {
    console.warn('Audio not supported or blocked');
  }
}


// ──── Notification type config ────
const NOTIF_CONFIG = {
  order: {
    icon: ShoppingCart,
    gradient: 'from-emerald-500 to-teal-600',
    shadow: 'shadow-emerald-500/30',
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-500/10',
    label: 'New Order',
    labelHi: 'नया ऑर्डर',
  },
  prescription: {
    icon: FileImage,
    gradient: 'from-violet-500 to-purple-600',
    shadow: 'shadow-violet-500/30',
    border: 'border-violet-500/40',
    bg: 'bg-violet-500/10',
    label: 'New Prescription',
    labelHi: 'नया प्रिस्क्रिप्शन',
  },
  blood_test: {
    icon: Droplets,
    gradient: 'from-blue-500 to-indigo-600',
    shadow: 'shadow-blue-500/30',
    border: 'border-blue-500/40',
    bg: 'bg-blue-500/10',
    label: 'New Blood Test',
    labelHi: 'नया ब्लड टेस्ट',
  },
};

// ──── Floating Popup (appears briefly on new notification) ────
function FloatingNotification({ notification, onClose }) {
  const cfg = NOTIF_CONFIG[notification.type] || NOTIF_CONFIG.order;
  const Icon = cfg.icon;

  useEffect(() => {
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`admin-notif-popup glass rounded-2xl p-4 border ${cfg.border} ${cfg.shadow} shadow-lg cursor-pointer`}
      onClick={onClose}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shrink-0 shadow-lg ${cfg.shadow}`}>
          <Icon size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${cfg.bg} ${cfg.border} border rounded-full px-2.5 py-0.5`}>
              {notification.labelHi || cfg.label}
            </span>
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-slate-500 hover:text-slate-900 dark:text-surface-500 dark:hover:text-white transition-colors">
              <X size={14} />
            </button>
          </div>
          <p className="text-sm font-semibold text-slate-950 dark:text-white mt-1.5 truncate">{notification.title}</p>
          <p className="text-xs text-slate-500 dark:text-surface-400 mt-0.5 truncate">{notification.subtitle}</p>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-500 dark:text-surface-500 font-medium">
            <Clock size={10} />
            <span>Just now</span>
          </div>
        </div>
      </div>
      {/* Animated progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden rounded-b-2xl">
        <div className={`h-full bg-gradient-to-r ${cfg.gradient} admin-notif-progress`} />
      </div>
    </div>
  );
}

// ──── Notification Bell Button ────
function NotificationBell({ count, onClick, soundEnabled, onToggleSound }) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onToggleSound}
        className="p-2 rounded-xl text-slate-500 dark:text-surface-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-800 transition-all"
        title={soundEnabled ? 'Mute' : 'Unmute'}
      >
        {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>
      <button
        onClick={onClick}
        className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-surface-800/60 border border-slate-200 dark:border-surface-700/50 hover:bg-slate-200 dark:hover:bg-surface-700 hover:border-slate-300 dark:hover:border-surface-600 transition-all group"
        id="admin-notification-bell"
      >
        {count > 0 ? (
          <BellRing size={20} className="text-brand-400 admin-bell-ring" />
        ) : (
          <Bell size={20} className="text-slate-500 dark:text-surface-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
        )}
        {count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-br from-red-500 to-rose-600 rounded-full text-[10px] font-black text-white flex items-center justify-center shadow-lg shadow-red-500/40 admin-notif-badge">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>
    </div>
  );
}

// ──── Notification Drawer ────
function NotificationDrawer({ notifications, isOpen, onClose, onClear, lang }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60]" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-h-[70vh] glass rounded-2xl border border-slate-200/50 dark:border-surface-700/50 shadow-[0_20px_60px_rgba(15,23,42,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-[70] overflow-hidden admin-drawer-enter">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-surface-700/50">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-brand-400" />
            <h3 className="font-bold text-sm">{lang === 'hi' ? 'सूचनाएँ' : 'Notifications'}</h3>
            {notifications.length > 0 && (
              <span className="text-[10px] bg-brand-500/20 text-brand-400 border border-brand-500/30 rounded-full px-2 py-0.5 font-bold">
                {notifications.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                const testEvent = new CustomEvent('force-test-notification');
                window.dispatchEvent(testEvent);
              }}
              className="px-2 py-1 rounded-lg text-[10px] bg-slate-100 dark:bg-surface-800 text-slate-500 dark:text-surface-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-surface-700 font-bold"
            >
              TEST
            </button>
            {notifications.length > 0 && (
              <button
                onClick={onClear}
                className="p-1.5 rounded-lg text-slate-400 dark:text-surface-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                title="Clear all"
              >
                <Trash2 size={14} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 dark:text-surface-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-800 transition-all"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="overflow-y-auto max-h-[calc(70vh-4rem)] scrollbar-hide">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell size={32} className="text-slate-300 dark:text-surface-700 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-surface-500 text-sm">{lang === 'hi' ? 'कोई सूचना नहीं' : 'No notifications yet'}</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200/50 dark:divide-surface-800/50">
              {notifications.map((notif) => {
                const cfg = NOTIF_CONFIG[notif.type] || NOTIF_CONFIG.order;
                const Icon = cfg.icon;
                return (
                  <div
                    key={notif.id}
                    className={`p-3.5 hover:bg-slate-100/50 dark:hover:bg-surface-800/30 transition-colors cursor-pointer ${notif.unread ? 'bg-brand-500/[0.03]' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shrink-0 shadow ${cfg.shadow}`}>
                        <Icon size={16} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${cfg.bg} rounded-full px-2 py-0.5`}>
                            {cfg.label}
                          </span>
                          {notif.unread && (
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shadow shadow-brand-400/40" />
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{notif.title}</p>
                        <p className="text-[11px] text-slate-500 dark:text-surface-400 truncate">{notif.subtitle}</p>
                        <p className="text-[10px] text-slate-400 dark:text-surface-600 mt-1 flex items-center gap-1">
                          <Clock size={9} />
                          {notif.timeAgo}
                        </p>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 dark:text-surface-600 shrink-0 mt-2" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ──── Main Admin Notification System ────
export default function AdminNotificationSystem({ lang = 'en' }) {
  const [notifications, setNotifications] = useState([]);
  const [popups, setPopups] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const subscriptionsRef = useRef([]);
  const hasInitialLoadRef = useRef({ orders: false, prescriptions: false, blood_tests: false });

  // Format time ago
  const getTimeAgo = useCallback((date) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (diff < 60) return lang === 'hi' ? 'अभी' : 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }, [lang]);

  // Add a notification
  const addNotification = useCallback((type, data) => {
    const id = `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    
    let title = '';
    let subtitle = '';

    if (type === 'order') {
      const items = data.items || [];
      const itemNames = items.map(i => i.name).join(', ');
      title = `₹${data.total_price || 0} - ${items.length || 0} item${items.length !== 1 ? 's' : ''}`;
      subtitle = itemNames || `Order #${(data.id || '').slice(0, 8)}`;
    } else if (type === 'prescription') {
      title = lang === 'hi' ? 'नई प्रिस्क्रिप्शन अपलोड' : 'New prescription uploaded';
      subtitle = `ID: ${(data.id || '').slice(0, 8)}`;
    } else if (type === 'blood_test') {
      title = data.test_name || (lang === 'hi' ? 'नई ब्लड टेस्ट बुकिंग' : 'New blood test booking');
      subtitle = `ID: ${(data.id || '').slice(0, 8)}`;
    }

    const cfg = NOTIF_CONFIG[type];
    const notif = {
      id,
      type,
      title,
      subtitle,
      labelHi: cfg.labelHi,
      timeAgo: lang === 'hi' ? 'अभी' : 'Just now',
      timestamp: Date.now(),
      unread: true,
    };

    // Add to notifications list
    setNotifications(prev => [notif, ...prev].slice(0, 50));
    setUnreadCount(prev => prev + 1);

    // Show popup
    setPopups(prev => [...prev, notif]);

    // Play sound
    if (soundEnabled) {
      playNotificationSound();
    }

    // Try browser notification
    if (Notification.permission === 'granted') {
      try {
        new Notification(`O2 Clinic - ${cfg.label}`, {
          body: title,
          icon: '/favicon.ico',
          tag: id,
        });
      } catch (e) {
        console.warn('Browser notification blocked or unsupported');
      }
    }
  }, [lang, soundEnabled]);

  // Setup Supabase Realtime subscriptions
  useEffect(() => {
    if (!supabase) {
      console.error('[AdminNotifications] Supabase client is missing. Check your environment variables.');
      return;
    }

    console.log('[AdminNotifications] Subscribing to Supabase Realtime using shared client...');

    // Subscribe to orders table
    const ordersChannel = supabase
      .channel('admin-orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('[AdminNotifications] Order payload:', payload);
          if (payload.eventType === 'INSERT') {
            addNotification('order', payload.new);
          }
        }
      )
      .subscribe((status, err) => {
        if (err) console.error('[AdminNotifications] Order channel error:', err);
        else console.log('[AdminNotifications] Order channel status:', status);
      });

    // Subscribe to prescriptions table
    const prescriptionsChannel = supabase
      .channel('admin-prescriptions-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'prescriptions' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            console.log('[AdminNotifications] New Prescription:', payload.new);
            addNotification('prescription', payload.new);
          }
        }
      )
      .subscribe((status, err) => {
        if (err) console.error('[AdminNotifications] Prescription channel error:', err);
      });

    // Subscribe to blood_tests table
    const bloodTestsChannel = supabase
      .channel('admin-blood-tests-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blood_tests' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            console.log('[AdminNotifications] New Blood Test:', payload.new);
            addNotification('blood_test', payload.new);
          }
        }
      )
      .subscribe((status, err) => {
        if (err) console.error('[AdminNotifications] Blood Test channel error:', err);
      });

    subscriptionsRef.current = [ordersChannel, prescriptionsChannel, bloodTestsChannel];

    // Global testing listener
    const handleTest = () => {
      addNotification('order', { id: `Test-${Date.now()}`, total_price: 999, items: [{name: 'Test Item', qty: 1}] });
    };
    window.addEventListener('force-test-notification', handleTest);

    return () => {
      subscriptionsRef.current.forEach(ch => supabase.removeChannel(ch));
      window.removeEventListener('force-test-notification', handleTest);
    };
  }, [addNotification]);

  // Update time ago periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(prev =>
        prev.map(n => ({ ...n, timeAgo: getTimeAgo(n.timestamp) }))
      );
    }, 60000);
    return () => clearInterval(interval);
  }, [getTimeAgo]);

  // Close popup
  const removePopup = useCallback((id) => {
    setPopups(prev => prev.filter(p => p.id !== id));
  }, []);

  // Open drawer marks all as read
  const openDrawer = useCallback(() => {
    setDrawerOpen(true);
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  }, []);

  // Clear all
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return (
    <>
      {/* Bell Button (renders in admin header) */}
      <div className="relative">
        <NotificationBell
          count={unreadCount}
          onClick={openDrawer}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(prev => !prev)}
        />
        <NotificationDrawer
          notifications={notifications}
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onClear={clearAll}
          lang={lang}
        />
      </div>

      {/* Floating popups */}
      <div className="fixed top-20 right-4 sm:right-6 z-[200] flex flex-col gap-3 pointer-events-none max-w-[320px] w-[calc(100vw-2rem)] sm:w-full">
        {popups.map((popup) => (
          <div key={popup.id} className="pointer-events-auto">
            <FloatingNotification
              notification={popup}
              onClose={() => removePopup(popup.id)}
            />
          </div>
        ))}
      </div>
    </>
  );
}
