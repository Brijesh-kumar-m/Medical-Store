import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  getBloodTestBookings, updateBloodTestStatus, uploadFile,
  getBloodTestTypes, addBloodTestType, updateBloodTestType, deleteBloodTestType 
} from '../../services/index.js';
import { LoadingSpinner } from '../../components/ui/Loading';
import { showToast } from '../../components/ui/Toast';
import { Droplets, ChevronDown, Upload, FileText, Plus, Edit3, Trash2, X, Save, Calendar, MapPin, IndianRupee, User, Phone } from 'lucide-react';

const statuses = ['requested', 'collected', 'report_ready'];
const emptyTest = { name: '', name_hi: '', price: '', mrp: '', offer: '', sort_order: 0 };

export default function AdminBloodTests() {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'tests'
  
  // Bookings state
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [uploadingId, setUploadingId] = useState(null);

  // Tests state
  const [testTypes, setTestTypes] = useState([]);
  const [loadingTests, setLoadingTests] = useState(true);
  const [editingTest, setEditingTest] = useState(null);
  const [testForm, setTestForm] = useState({ ...emptyTest });

  useEffect(() => { 
    if (activeTab === 'bookings') loadBookings();
    else loadTests();
  }, [activeTab]);

  async function loadBookings() {
    setLoadingBookings(true);
    try { setBookings(await getBloodTestBookings()); } 
    catch (err) { console.error(err); }
    finally { setLoadingBookings(false); }
  }

  async function loadTests() {
    setLoadingTests(true);
    try { setTestTypes(await getBloodTestTypes()); } 
    catch (err) { console.error(err); }
    finally { setLoadingTests(false); }
  }

  // --- BOOKINGS LOGIC ---
  async function handleStatusChange(id, status) {
    try {
      await updateBloodTestStatus(id, status);
      showToast(lang === 'hi' ? 'स्थिति अपडेट हो गई' : 'Status updated');
      loadBookings();
    } catch (err) { showToast('Error updating status', 'error'); }
  }

  async function handleReportUpload(bookingId, e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingId(bookingId);
    try {
      const url = await uploadFile(file, 'reports');
      await updateBloodTestStatus(bookingId, 'report_ready', url);
      showToast(lang === 'hi' ? 'रिपोर्ट अपलोड हो गई' : 'Report uploaded');
      loadBookings();
    } catch (err) { showToast('Upload failed', 'error'); } 
    finally { setUploadingId(null); }
  }

  // --- TESTS LOGIC ---
  async function handleSaveTest() {
    if (!testForm.name || !testForm.price) return showToast('Name and price needed', 'error');
    try {
      if (editingTest === 'new') {
        await addBloodTestType({ ...testForm, price: Number(testForm.price) });
        showToast(lang === 'hi' ? 'टेस्ट जोड़ा गया' : 'Test added');
      } else {
        await updateBloodTestType(editingTest.id, { ...testForm, price: Number(testForm.price) });
        showToast(lang === 'hi' ? 'टेस्ट अपडेट हो गया' : 'Test updated');
      }
      setEditingTest(null);
      loadTests();
    } catch (err) { showToast('Error saving test', 'error'); }
  }

  async function handleDeleteTest(id) {
    if (!confirm('Delete this test type?')) return;
    try {
      await deleteBloodTestType(id);
      showToast('Deleted successfully');
      loadTests();
    } catch (err) { showToast('Error deleting', 'error'); }
  }

  const statusColors = {
    requested: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    collected: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    report_ready: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  return (
    <div>
      <h2 className="section-title">{t('admin_blood_tests')}</h2>
      
      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-surface-800 rounded-2xl">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'bookings' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'text-surface-400 hover:text-white'
          }`}
        >
          {lang === 'hi' ? 'बुकिंग्स' : 'Bookings'}
        </button>
        <button
          onClick={() => setActiveTab('tests')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'tests' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'text-surface-400 hover:text-white'
          }`}
        >
          {lang === 'hi' ? 'टेस्ट मैनेज करें' : 'Manage Tests'}
        </button>
      </div>

      {/* Bookings View */}
      {activeTab === 'bookings' && (
        loadingBookings ? <LoadingSpinner text={t('loading')} /> :
        bookings.length === 0 ? (
          <div className="card text-center py-12">
            <Droplets size={40} className="text-surface-600 mx-auto mb-3" />
            <p className="text-surface-400">{lang === 'hi' ? 'कोई बुकिंग नहीं' : 'No bookings yet'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((bt) => (
              <div key={bt.id} className="card">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">{bt.test_type}</h4>
                  <span className="text-xs text-surface-500 font-mono">{bt.id}</span>
                </div>
                <div className="text-xs text-surface-400 space-y-1.5 mb-3">
                  <p className="flex items-center gap-1.5 font-medium text-surface-200">
                    <User size={14} className="text-brand-400 shrink-0" /> {bt.patient_name}
                  </p>
                  <p className="flex items-center gap-1.5 text-surface-400">
                    <Calendar size={14} className="shrink-0" /> {bt.date} <span className="text-surface-600">|</span> ⏰ {bt.time}
                  </p>
                  <p className="flex items-start gap-1.5 text-surface-400">
                    <MapPin size={14} className="shrink-0 mt-0.5" /> <span>{bt.address}</span>
                  </p>
                  <p className="flex items-center gap-1.5 font-semibold text-brand-400 mt-1">
                    <IndianRupee size={14} className="shrink-0" /> {bt.price}
                  </p>
                  {bt.users?.mobile && (
                    <p className="flex items-center gap-1.5 mt-2 pt-2 border-t border-surface-700/50">
                      <Phone size={14} className="text-green-500 shrink-0" />
                      <a href={`https://wa.me/91${bt.users.mobile}`} target="_blank" rel="noreferrer" className="text-green-500 hover:text-green-400 hover:underline font-bold">
                        WhatsApp Contact (+91 {bt.users.mobile})
                      </a>
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-surface-700 gap-2">
                  <div className="relative">
                    <select
                      value={bt.status}
                      onChange={(e) => handleStatusChange(bt.id, e.target.value)}
                      className={`appearance-none px-3 py-1.5 pr-8 rounded-xl text-xs font-semibold border cursor-pointer bg-transparent ${statusColors[bt.status] || statusColors.requested}`}
                    >
                      {statuses.map((s) => <option key={s} value={s} className="bg-surface-800 text-white font-semibold">{t(`status_${s}`)}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <div className="flex items-center gap-2">
                    {bt.report_url ? (
                      <a href={bt.report_url} target="_blank" rel="noopener noreferrer" className="badge-success flex items-center gap-1 text-xs">
                        <FileText size={12} /> {t('view_report')}
                      </a>
                    ) : (
                      <label className="badge-info flex items-center gap-1 text-xs cursor-pointer hover:opacity-80">
                        <Upload size={12} />
                        {uploadingId === bt.id ? '⏳' : t('upload_report')}
                        <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleReportUpload(bt.id, e)} />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Tests View */}
      {activeTab === 'tests' && (
        <>
          <div className="flex justify-end mb-4">
            <button onClick={() => { setTestForm({ ...emptyTest }); setEditingTest('new'); }} className="btn-primary flex items-center gap-2">
              <Plus size={18} /> {lang === 'hi' ? 'नया टेस्ट' : 'Add Test'}
            </button>
          </div>
          {loadingTests ? <LoadingSpinner text={t('loading')} /> : (
            <div className="space-y-3">
              {testTypes.map((t) => (
                <div key={t.id} className="card flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-700 flex items-center justify-center shrink-0">
                    <Droplets size={20} className="text-brand-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{lang === 'hi' && t.name_hi ? t.name_hi : t.name}</h4>
                    {t.offer && <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full mt-1 border border-emerald-500/20 inline-block font-bold">{t.offer}</span>}
                  </div>
                  <span className="text-brand-400 font-bold shrink-0">₹{t.price}</span>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => { setEditingTest(t); setTestForm({...t}); }} className="p-2 rounded-lg bg-surface-700 hover:bg-surface-600">
                      <Edit3 size={14} className="text-blue-400" />
                    </button>
                    <button onClick={() => handleDeleteTest(t.id)} className="p-2 rounded-lg bg-surface-700 hover:bg-red-500/20">
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Test Edit Modal */}
          {editingTest && (
            <>
              <div className="overlay" onClick={() => setEditingTest(null)} />
              <div className="modal">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg">{editingTest === 'new' ? 'Add Test' : 'Edit Test'}</h3>
                  <button onClick={() => setEditingTest(null)} className="p-2 rounded-lg hover:bg-surface-700"><X size={18}/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="input-label">Test Name (English)</label>
                    <input value={testForm.name} onChange={(e) => setTestForm({...testForm, name: e.target.value})} className="w-full" />
                  </div>
                  <div>
                    <label className="input-label">Test Name (हिंदी)</label>
                    <input value={testForm.name_hi || ''} onChange={(e) => setTestForm({...testForm, name_hi: e.target.value})} className="w-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="input-label">Selling Price (₹)</label>
                      <input type="number" value={testForm.price} onChange={(e) => setTestForm({...testForm, price: e.target.value})} className="w-full" />
                    </div>
                    <div>
                      <label className="input-label">MRP / Old Price (₹)</label>
                      <input type="number" value={testForm.mrp || ''} onChange={(e) => setTestForm({...testForm, mrp: e.target.value})} className="w-full" placeholder="Optional" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="input-label">Offer Text</label>
                      <input value={testForm.offer || ''} onChange={(e) => setTestForm({...testForm, offer: e.target.value})} className="w-full" placeholder="Optional" />
                    </div>
                    <div>
                      <label className="input-label" title="Higher number = Top rank">⭐ Top Priority (Number)</label>
                      <input type="number" value={testForm.sort_order === 0 ? '' : testForm.sort_order} onChange={(e) => setTestForm({...testForm, sort_order: e.target.value === '' ? 0 : parseInt(e.target.value) || 0})} className="w-full" placeholder="0" />
                    </div>
                  </div>
                  <button onClick={handleSaveTest} className="btn-primary w-full flex items-center justify-center gap-2">
                    <Save size={18} /> {t('save')}
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
