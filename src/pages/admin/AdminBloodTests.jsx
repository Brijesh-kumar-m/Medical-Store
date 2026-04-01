import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getBloodTestBookings, updateBloodTestStatus, uploadFile } from '../../services/index.js';
import { LoadingSpinner } from '../../components/ui/Loading';
import { showToast } from '../../components/ui/Toast';
import { Droplets, ChevronDown, Upload, FileText } from 'lucide-react';

const statuses = ['requested', 'collected', 'report_ready'];

export default function AdminBloodTests() {
  const { t, lang } = useLanguage();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [uploadingId, setUploadingId] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      setBookings(await getBloodTestBookings());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function handleStatusChange(id, status) {
    try {
      await updateBloodTestStatus(id, status);
      showToast(lang === 'hi' ? 'स्थिति अपडेट हो गई' : 'Status updated');
      load();
    } catch (err) {
      showToast('Error updating status', 'error');
    }
  }

  async function handleReportUpload(bookingId, e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingId(bookingId);
    try {
      const url = await uploadFile(file, 'reports');
      await updateBloodTestStatus(bookingId, 'report_ready', url);
      showToast(lang === 'hi' ? 'रिपोर्ट अपलोड हो गई' : 'Report uploaded');
      load();
    } catch (err) {
      showToast('Upload failed', 'error');
    } finally {
      setUploadingId(null);
    }
  }

  const statusColors = {
    requested: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    collected: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    report_ready: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  if (loading) return <LoadingSpinner text={t('loading')} />;

  return (
    <div>
      <h2 className="section-title">{t('admin_blood_tests')}</h2>
      <p className="section-subtitle">{bookings.length} {lang === 'hi' ? 'बुकिंग' : 'bookings'}</p>

      {bookings.length === 0 ? (
        <div className="card text-center py-12">
          <Droplets size={40} className="text-surface-600 mx-auto mb-3" />
          <p className="text-surface-400">{lang === 'hi' ? 'कोई बुकिंग नहीं' : 'No bookings yet'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((bt) => (
            <div key={bt.id} className="card" id={`admin-bt-${bt.id}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">{bt.test_type}</h4>
                <span className="text-xs text-surface-500 font-mono">{bt.id}</span>
              </div>

              <div className="text-xs text-surface-400 space-y-1 mb-3">
                <p>👤 {bt.patient_name}</p>
                <p>📅 {bt.date} | ⏰ {bt.time}</p>
                <p>📍 {bt.address}</p>
                <p>💰 ₹{bt.price}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-surface-700 gap-2">
                {/* Status */}
                <div className="relative">
                  <select
                    value={bt.status}
                    onChange={(e) => handleStatusChange(bt.id, e.target.value)}
                    className={`appearance-none px-3 py-1.5 pr-8 rounded-xl text-xs font-semibold border cursor-pointer bg-transparent ${statusColors[bt.status] || statusColors.requested}`}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{t(`status_${s}`)}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Report Upload */}
                <div className="flex items-center gap-2">
                  {bt.report_url ? (
                    <a href={bt.report_url} target="_blank" rel="noopener noreferrer"
                       className="badge-success flex items-center gap-1 text-xs">
                      <FileText size={12} /> {t('view_report')}
                    </a>
                  ) : (
                    <label className="badge-info flex items-center gap-1 text-xs cursor-pointer hover:opacity-80">
                      <Upload size={12} />
                      {uploadingId === bt.id ? '⏳' : t('upload_report')}
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => handleReportUpload(bt.id, e)}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
