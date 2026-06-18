import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { createNotification, getNotifications } from '../../services/index.js';
import { showToast } from '../../components/ui/Toast';
import { Megaphone, Send, Bell, Trash2, Clock, ShieldAlert } from 'lucide-react';
import { SkeletonCard } from '../../components/ui/Loading';

export default function AdminAlerts() {
  const { lang } = useLanguage();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [type, setType] = useState('alert');
  const [isPriority, setIsPriority] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    setLoadingHistory(true);
    try {
      // Fetch all system/global alerts (where user_id is null/undefined)
      const data = await getNotifications(null);
      // Filter strictly for global ones
      const globalAlerts = data.filter(n => n.user_id === null || n.user_id === undefined);
      setAlerts(globalAlerts);
    } catch (e) {
      console.error('Failed to load alert history:', e);
    } finally {
      setLoadingHistory(false);
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      showToast(lang === 'hi' ? 'कृपया सभी फ़ील्ड भरें' : 'Please fill all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        user_id: null, // Global
        title: title.trim(),
        body: body.trim(),
        type: type,
        metadata: {
          is_priority: isPriority,
          sent_by: 'admin'
        }
      };

      await createNotification(payload);
      
      showToast(lang === 'hi' ? 'अलर्ट सफलतापूर्वक भेजा गया!' : 'Alert broadcasted successfully!', 'success');
      setTitle('');
      setBody('');
      setIsPriority(false);
      loadHistory();
    } catch (err) {
      showToast(lang === 'hi' ? 'अलर्ट भेजने में विफल' : 'Failed to send alert', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="section-title flex items-center gap-2">
          <Megaphone className="text-brand-400 animate-[bounceGentle_2s_infinite]" />
          {lang === 'hi' ? 'अलर्ट और घोषणाएं' : 'Alerts & Announcements'}
        </h2>
        <p className="section-subtitle">
          {lang === 'hi' 
            ? 'सभी ग्राहकों को वास्तविक समय में सिस्टम-व्यापी सूचनाएं और पुश अलर्ट भेजें' 
            : 'Broadcast system-wide notifications and push alerts to all customers in real-time'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composer Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSend} className="card space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-2 uppercase tracking-wide flex items-center gap-2">
              <Send size={15} className="text-brand-400" />
              {lang === 'hi' ? 'नया अलर्ट लिखें' : 'Compose Alert'}
            </h3>

            {/* Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-surface-400">
                {lang === 'hi' ? 'अलर्ट प्रकार' : 'Alert Type'}
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full text-sm font-semibold"
              >
                <option value="alert">📢 {lang === 'hi' ? 'सामान्य घोषणा' : 'General Announcement'}</option>
                <option value="order">🎁 {lang === 'hi' ? 'ऑफ़र / डिस्काउंट' : 'Offer / Discount'}</option>
                <option value="prescription">⚠️ {lang === 'hi' ? 'महत्वपूर्ण सूचना' : 'Emergency / Notice'}</option>
              </select>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-surface-400">
                {lang === 'hi' ? 'शीर्षक' : 'Title'}
              </label>
              <input
                type="text"
                placeholder={lang === 'hi' ? 'शीर्षक दर्ज करें...' : 'Enter alert title...'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm font-semibold"
                maxLength={80}
              />
            </div>

            {/* Body */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-surface-400">
                {lang === 'hi' ? 'विवरण' : 'Message Body'}
              </label>
              <textarea
                placeholder={lang === 'hi' ? 'संदेश लिखें...' : 'Type announcement message here...'}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full text-sm font-medium h-24 resize-none"
                maxLength={250}
              />
            </div>

            {/* Priority Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-surface-800/40 rounded-2xl border border-slate-200/50 dark:border-surface-700/50 transition-colors">
              <div className="flex gap-2 items-center">
                <ShieldAlert size={16} className={isPriority ? 'text-amber-500' : 'text-slate-400'} />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">
                    {lang === 'hi' ? 'प्राथमिकता पुश' : 'Priority Push'}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-surface-500 mt-1 font-semibold leading-none">
                    {lang === 'hi' ? 'ऐप बंद होने पर भी मोबाइल पर भेजें' : 'Push to closed phone screens'}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isPriority}
                onChange={(e) => setIsPriority(e.target.checked)}
                className="shrink-0"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-sm"
            >
              <Megaphone size={16} />
              {loading ? (lang === 'hi' ? 'भेज रहा है...' : 'Broadcasting...') : (lang === 'hi' ? 'घोषणा प्रसारित करें' : 'Broadcast Announcement')}
            </button>
          </form>
        </div>

        {/* History / Sent items */}
        <div className="lg:col-span-2 card">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-4 uppercase tracking-wide flex items-center gap-2 border-b border-slate-200/40 dark:border-surface-700/40 pb-3">
            <Clock size={16} className="text-slate-400" />
            {lang === 'hi' ? 'प्रसारण इतिहास' : 'Broadcast History'}
          </h3>

          {loadingHistory ? (
            <SkeletonCard count={2} />
          ) : alerts.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-3xl opacity-40 mb-3 block">📜</span>
              <p className="text-sm font-semibold text-slate-500 dark:text-surface-400">
                {lang === 'hi' ? 'कोई पुराना प्रसारण नहीं मिला' : 'No announcements broadcasted yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-hide">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className="p-4 bg-slate-50/50 dark:bg-surface-800/20 border border-slate-200/30 dark:border-surface-700/30 rounded-2xl hover:border-brand-500/20 transition-all flex gap-3.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-surface-800 border border-slate-200/20 dark:border-surface-700/20 flex items-center justify-center shrink-0 text-base">
                    {alert.type === 'order' ? '🎁' : alert.type === 'prescription' ? '⚠️' : '📢'}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] bg-slate-100 dark:bg-surface-800 border border-slate-200/50 dark:border-surface-700/50 px-2 py-0.5 rounded-full font-bold text-slate-500 dark:text-surface-400">
                        {alert.type.toUpperCase()}
                      </span>
                      {alert.metadata?.is_priority && (
                        <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-black uppercase tracking-wider flex items-center gap-0.5 shadow-sm">
                          ⚡ PUSH
                        </span>
                      )}
                    </div>
                    
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                      {alert.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-surface-400 mt-1 leading-normal break-words">
                      {alert.body}
                    </p>
                    
                    <p className="text-[10px] text-slate-400 dark:text-surface-600 mt-2 font-medium flex items-center gap-1">
                      <Clock size={9} />
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
