import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getBackendProvider, setBackendProvider } from '../../config/backend.js';
import { getSettings, updateSettings } from '../../services/index.js';
import { showToast } from '../../components/ui/Toast';
import { Settings, Database, Globe, AlertTriangle, Truck, Save } from 'lucide-react';

export default function AdminSettings() {
  const { t, lang, switchLanguage } = useLanguage();
  const currentProvider = getBackendProvider();
  const [settings, setSettings] = useState({ delivery_charge: 50 });

  useEffect(() => {
    async function load() {
      try {
        const s = await getSettings();
        setSettings(s || { delivery_charge: 0 });
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  function handleSwitch(provider) {
    if (provider === currentProvider) return;
    if (!confirm(lang === 'hi'
      ? `बैकएंड ${provider} पर स्विच करें? ऐप रीलोड होगा।`
      : `Switch backend to ${provider}? The app will reload.`
    )) return;
    setBackendProvider(provider);
  }

  async function handleSaveSettings() {
    try {
      await updateSettings(settings);
      showToast(lang === 'hi' ? 'सेटिंग्स सेव हो गईं' : 'Settings saved');
    } catch (err) {
      showToast('Error saving settings', 'error');
    }
  }

  return (
    <div>
      <h2 className="section-title flex items-center gap-2">
        <Settings size={24} className="text-brand-400" />
        {t('admin_settings')}
      </h2>
      <p className="section-subtitle">{lang === 'hi' ? 'ऐप सेटिंग्स मैनेज करें' : 'Manage app settings'}</p>

      {/* General Settings */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Truck size={20} className="text-brand-400" />
          <h3 className="font-bold">{lang === 'hi' ? 'जनरल सेटिंग्स' : 'General Settings'}</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="input-label mb-2">Delivery Charge (₹)</label>
            <input 
              type="number" 
              value={settings.delivery_charge} 
              onChange={(e) => setSettings({ ...settings, delivery_charge: Number(e.target.value) })} 
              className="w-full" 
            />
          </div>
          <button onClick={handleSaveSettings} className="btn-primary w-full flex justify-center items-center gap-2">
            <Save size={18} /> {t('save')}
          </button>
        </div>
      </div>

      {/* Backend Switch */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Database size={20} className="text-brand-400" />
          <h3 className="font-bold">{t('backend_provider')}</h3>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => handleSwitch('supabase')}
            className={`card text-center py-6 ${
              currentProvider === 'supabase'
                ? 'border-brand-500 bg-brand-500/10'
                : 'hover:border-surface-500'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
              <span className="text-emerald-400 font-bold text-lg">S</span>
            </div>
            <p className="font-semibold text-sm">Supabase</p>
            <p className="text-xs text-surface-500 mt-1">PostgreSQL + Auth</p>
            {currentProvider === 'supabase' && (
              <span className="badge-success mt-2 text-xs">{lang === 'hi' ? 'चालू' : 'Active'}</span>
            )}
          </button>

          <button
            onClick={() => handleSwitch('firebase')}
            className={`card text-center py-6 ${
              currentProvider === 'firebase'
                ? 'border-brand-500 bg-brand-500/10'
                : 'hover:border-surface-500'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
              <span className="text-amber-400 font-bold text-lg">F</span>
            </div>
            <p className="font-semibold text-sm">Firebase</p>
            <p className="text-xs text-surface-500 mt-1">Firestore + Auth</p>
            {currentProvider === 'firebase' && (
              <span className="badge-success mt-2 text-xs">{lang === 'hi' ? 'चालू' : 'Active'}</span>
            )}
          </button>
        </div>

        <div className="card bg-amber-500/5 border-amber-500/20 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-surface-400">
            {lang === 'hi'
              ? 'बैकएंड बदलने से ऐप रीलोड होगा। मॉक मोड में डेटा localStorage में सेव रहता है।'
              : 'Switching backend will reload the app. In mock mode, data is stored in localStorage.'}
          </p>
        </div>
      </div>

      {/* Language */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Globe size={20} className="text-brand-400" />
          <h3 className="font-bold">{t('language')}</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => switchLanguage('en')}
            className={`card text-center py-4 ${
              lang === 'en' ? 'border-brand-500 bg-brand-500/10' : 'hover:border-surface-500'
            }`}
          >
            <p className="font-semibold">English</p>
            {lang === 'en' && <span className="badge-success mt-2 text-xs">Active</span>}
          </button>
          <button
            onClick={() => switchLanguage('hi')}
            className={`card text-center py-4 ${
              lang === 'hi' ? 'border-brand-500 bg-brand-500/10' : 'hover:border-surface-500'
            }`}
          >
            <p className="font-semibold">हिंदी</p>
            {lang === 'hi' && <span className="badge-success mt-2 text-xs">चालू</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
