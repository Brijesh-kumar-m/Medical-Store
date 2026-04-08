import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getPrescriptions, uploadFile } from '../../services/index.js';
import { SkeletonCard } from '../../components/ui/Loading';
import { showToast } from '../../components/ui/Toast';
import { FileImage, Check, X, Clock, Phone, User, ChevronDown, Eye, MessageCircle } from 'lucide-react';

export default function AdminPrescriptions() {
  const { t, lang } = useLanguage();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  useEffect(() => { loadPrescriptions(); }, []);

  async function loadPrescriptions() {
    setLoading(true);
    try {
      const data = await getPrescriptions(); // No userId = get all (admin)
      setPrescriptions(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function getStatusBadge(status) {
    const map = {
      pending: { bg: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock, text: lang === 'hi' ? 'लंबित' : 'Pending' },
      approved: { bg: 'bg-green-500/20 text-green-400 border-green-500/30', icon: Check, text: lang === 'hi' ? 'स्वीकृत' : 'Approved' },
      rejected: { bg: 'bg-red-500/20 text-red-400 border-red-500/30', icon: X, text: lang === 'hi' ? 'अस्वीकृत' : 'Rejected' },
    };
    const s = map[status] || map.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${s.bg}`}>
        <s.icon size={12} /> {s.text}
      </span>
    );
  }

  function contactOnWhatsApp(rx) {
    const phone = rx.users?.mobile || rx.mobile || '';
    const msg = encodeURIComponent(`Hi ${rx.users?.name || ''}, regarding your prescription uploaded on ${new Date(rx.created_at).toLocaleDateString()}. - O2Clinic`);
    window.open(`https://wa.me/91${phone}?text=${msg}`, '_blank');
  }

  const filtered = filter === 'all' 
    ? prescriptions 
    : prescriptions.filter(rx => (rx.status || 'pending') === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="section-title">{lang === 'hi' ? 'प्रिस्क्रिप्शन' : 'Prescriptions'}</h2>
          <p className="text-surface-400 text-sm">{filtered.length} {lang === 'hi' ? 'प्रिस्क्रिप्शन' : 'prescriptions'}</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === f
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                : 'bg-surface-800 text-surface-400 border border-surface-600'
            }`}
          >
            {f === 'all' ? (lang === 'hi' ? 'सभी' : 'All') :
             f === 'pending' ? (lang === 'hi' ? 'लंबित' : 'Pending') :
             f === 'approved' ? (lang === 'hi' ? 'स्वीकृत' : 'Approved') :
             (lang === 'hi' ? 'अस्वीकृत' : 'Rejected')}
          </button>
        ))}
      </div>

      {loading ? <SkeletonCard count={3} /> :
       filtered.length === 0 ? (
        <div className="card text-center py-12">
          <FileImage size={40} className="text-surface-600 mx-auto mb-3" />
          <p className="text-surface-400">{lang === 'hi' ? 'कोई प्रिस्क्रिप्शन नहीं' : 'No prescriptions found'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(rx => (
            <div key={rx.id} className="card">
              <div className="flex items-start gap-3">
                {/* Prescription Image Thumbnail */}
                <a href={rx.image_url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-800 border border-surface-600 hover:border-brand-500/50 transition-all cursor-pointer group">
                    <img src={rx.image_url} alt="Prescription" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                </a>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {getStatusBadge(rx.status || 'pending')}
                    <span className="text-surface-500 text-xs">
                      {new Date(rx.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  {rx.users && (
                    <div className="flex items-center gap-3 text-xs text-surface-400 mt-1">
                      <span className="flex items-center gap-1"><User size={12} /> {rx.users.name}</span>
                      <span className="flex items-center gap-1"><Phone size={12} /> {rx.users.mobile}</span>
                    </div>
                  )}

                  {rx.notes && (
                    <p className="text-surface-400 text-xs mt-1 line-clamp-2">📝 {rx.notes}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-surface-700/50">
                <a
                  href={rx.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-surface-800 text-surface-300 hover:bg-surface-700 text-xs font-semibold transition-all"
                >
                  <Eye size={14} /> {lang === 'hi' ? 'देखें' : 'View'}
                </a>
                <button
                  onClick={() => contactOnWhatsApp(rx)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500/20 text-xs font-semibold transition-all border border-green-500/20"
                >
                  <MessageCircle size={14} /> WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
