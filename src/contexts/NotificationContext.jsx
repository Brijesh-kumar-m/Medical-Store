import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import config from '../config/backend.js';
import { getNotifications, markNotificationRead, clearNotifications } from '../services/index.js';
import { supabase } from '../services/supabase.js';

const NotificationContext = createContext();

// Play modern notification sound chime using Web Audio API
function playChime() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    
    // Primary Tone
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(660, now); // E5
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.45);

    // Harmonic Tone
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1320, now + 0.08); // E6
    gain2.gain.setValueAtTime(0.08, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.005, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.55);
  } catch (e) {
    console.warn('Audio context blocked or unsupported', e);
  }
}

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [activeAlert, setActiveAlert] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const notificationsRef = useRef([]);
  notificationsRef.current = notifications;

  const loadNotifications = useCallback(async () => {
    if (!user || user.id === 'guest') {
      setNotifications([]);
      return;
    }
    try {
      const data = await getNotifications(user.id);
      setNotifications(data);
    } catch (e) {
      console.error('Failed to load notifications:', e);
    }
  }, [user]);

  // Load initially
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Real-time listener setup
  useEffect(() => {
    if (!user || user.id === 'guest') return;

    // A helper to handle incoming notification
    const handleNewIncoming = (notif) => {
      // Check if it belongs to this user or is a global broadcast (user_id is null)
      if (notif.user_id && notif.user_id !== user.id) return;

      // Check if it's already in the list to avoid duplicate rendering
      const exists = notificationsRef.current.some(n => n.id === notif.id);
      if (exists) return;

      // Add to state
      setNotifications(prev => [notif, ...prev]);

      // Show floating popup
      setActiveAlert(notif);

      // Play Sound
      if (soundEnabled) {
        playChime();
      }

      // Check if we can display standard browser notification if app is closed/backgrounded
      if (document.visibilityState === 'hidden' && Notification.permission === 'granted') {
        try {
          navigator.serviceWorker.ready.then(reg => {
            reg.showNotification(notif.title, {
              body: notif.body,
              icon: '/favicon.svg',
              badge: '/favicon.svg',
              vibrate: [150, 100, 150],
              data: { url: notif.type === 'alert' ? '/' : '/orders' }
            });
          });
        } catch (e) {
          console.warn('Service worker background push failed:', e);
        }
      }
    };

    // 1. SUPABASE REALTIME
    let supabaseChannel = null;
    if (!config.useMockData && config.backendProvider === 'supabase' && supabase) {
      supabaseChannel = supabase
        .channel(`user-notifications-${user.id}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications' },
          (payload) => {
            console.log('[Realtime] New database notification:', payload.new);
            handleNewIncoming(payload.new);
          }
        )
        .subscribe();
    }

    // 2. MOCK EVENTS (or fallback for mock provider)
    const handleMockEvent = (e) => {
      if (e.detail) {
        handleNewIncoming(e.detail);
      }
    };
    window.addEventListener('mock-notification-received', handleMockEvent);

    return () => {
      if (supabaseChannel && supabase) {
        supabase.removeChannel(supabaseChannel);
      }
      window.removeEventListener('mock-notification-received', handleMockEvent);
    };
  }, [user, soundEnabled]);

  const markAsRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (e) {
      console.error('Failed to mark notification as read:', e);
    }
  };

  const clearAll = async () => {
    if (!user || user.id === 'guest') return;
    try {
      await clearNotifications(user.id);
      setNotifications([]);
    } catch (e) {
      console.error('Failed to clear notifications:', e);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      activeAlert,
      setActiveAlert,
      markAsRead,
      clearAll,
      soundEnabled,
      setSoundEnabled,
      refresh: loadNotifications
    }}>
      {children}

      {/* Modern, Floating Micro-Animated In-App Banner */}
      {activeAlert && (
        <div className="fixed top-18 right-4 z-[90] max-w-sm w-[calc(100vw-2rem)] pointer-events-none">
          <div className="pointer-events-auto glass rounded-2xl p-4 border border-brand-500/20 shadow-[0_15px_50px_rgba(4,200,165,0.18)] animate-slide-down flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-400 to-brand-600 flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20">
              <span className="text-white text-lg font-bold">🔔</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">
                  {lang === 'hi' ? 'सूचना' : 'Update'}
                </span>
                <button
                  onClick={() => setActiveAlert(null)}
                  className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                {activeAlert.title}
              </p>
              <p className="text-xs text-slate-500 dark:text-surface-400 mt-0.5 leading-normal">
                {activeAlert.body}
              </p>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
  return ctx;
}
