import { useNotifications } from '../../contexts/NotificationContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Bell, Trash2, X, ChevronRight, Clock, Volume2, VolumeX } from 'lucide-react';

export default function NotificationCenter({ isOpen, onClose }) {
  const { notifications, markAsRead, clearAll, soundEnabled, setSoundEnabled } = useNotifications();
  const { lang } = useLanguage();

  if (!isOpen) return null;

  // Format time difference
  function formatTimeAgo(timestamp) {
    const diff = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (diff < 60) return lang === 'hi' ? 'अभी' : 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ${lang === 'hi' ? 'पहले' : 'ago'}`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ${lang === 'hi' ? 'पहले' : 'ago'}`;
    return `${Math.floor(diff / 86400)}d ${lang === 'hi' ? 'पहले' : 'ago'}`;
  }

  // Choose styling details based on notification type
  const typeConfigs = {
    order: {
      icon: '💊',
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      label: lang === 'hi' ? 'ऑर्डर अपडेट' : 'Order Update'
    },
    blood_test: {
      icon: '🩸',
      bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      label: lang === 'hi' ? 'ब्लड टेस्ट' : 'Blood Test'
    },
    prescription: {
      icon: '📋',
      bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      label: lang === 'hi' ? 'प्रिस्क्रिप्शन' : 'Prescription'
    },
    alert: {
      icon: '📢',
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      label: lang === 'hi' ? 'घोषणा' : 'Alert'
    }
  };

  return (
    <>
      {/* Drawer Overlay */}
      <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-[95] animate-fade-in" onClick={onClose} />
      
      {/* Sliding Drawer Container */}
      <div className="fixed right-0 top-0 bottom-0 w-85 sm:w-96 glass border-l border-slate-200/50 dark:border-surface-700/50 shadow-2xl z-[98] flex flex-col overflow-hidden animate-slide-left">
        {/* Header */}
        <div className="p-4 border-b border-slate-200/50 dark:border-surface-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
              <Bell size={16} className="text-brand-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-none">
                {lang === 'hi' ? 'सूचना केंद्र' : 'Notification Center'}
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-surface-400 font-semibold mt-0.5">
                {notifications.length} {lang === 'hi' ? 'सूचनाएँ' : 'notifications'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Toggle sound */}
            <button
              onClick={() => setSoundEnabled(prev => !prev)}
              className="p-2 rounded-xl text-slate-500 dark:text-surface-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-800 transition-all"
              title={soundEnabled ? 'Mute Chime' : 'Unmute Chime'}
            >
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>

            {/* Clear All */}
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                title={lang === 'hi' ? 'सभी साफ़ करें' : 'Clear all'}
              >
                <Trash2 size={15} />
              </button>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-800 transition-all"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-surface-800/40 scrollbar-hide">
          {notifications.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center h-48">
              <span className="text-3xl filter saturate-50 opacity-40 mb-3 animate-[pulse_2s_infinite]">🔔</span>
              <p className="text-sm font-semibold text-slate-500 dark:text-surface-400">
                {lang === 'hi' ? 'कोई नई सूचना नहीं है' : 'No notifications yet'}
              </p>
              <p className="text-xs text-slate-400 dark:text-surface-500 mt-0.5">
                {lang === 'hi' ? 'ऑर्डर अपडेट यहाँ दिखाई देंगे।' : 'Your status updates will appear here.'}
              </p>
            </div>
          ) : (
            notifications.map((notif) => {
              const config = typeConfigs[notif.type] || typeConfigs.alert;
              return (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-4 transition-all duration-300 cursor-pointer flex gap-3.5 hover:bg-slate-50/50 dark:hover:bg-surface-800/20 relative group ${
                    !notif.read ? 'bg-brand-500/[0.02]' : ''
                  }`}
                >
                  {/* Unread indicator bar */}
                  {!notif.read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 rounded-r" />
                  )}

                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-surface-800 flex items-center justify-center shrink-0 shadow-sm text-lg border border-slate-200/30 dark:border-surface-700/30">
                    {config.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border rounded-full ${config.bg}`}>
                        {config.label}
                      </span>
                      {!notif.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-ping-once" />
                      )}
                    </div>
                    <p className={`text-xs font-bold mt-1 leading-snug truncate ${
                      !notif.read ? 'text-slate-950 dark:text-white' : 'text-slate-700 dark:text-surface-300'
                    }`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-surface-400 mt-0.5 leading-normal break-words">
                      {notif.body}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400 dark:text-surface-500 font-semibold">
                      <Clock size={10} />
                      <span>{formatTimeAgo(notif.created_at)}</span>
                    </div>
                  </div>

                  <ChevronRight size={14} className="text-slate-400 dark:text-surface-600 shrink-0 self-center opacity-0 group-hover:opacity-100 translate-x-1 transition-all" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
