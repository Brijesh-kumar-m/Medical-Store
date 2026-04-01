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
      const payload = {
        ...settings,
        delivery_charge: Number(settings.delivery_charge) || 0
      };
      await updateSettings(payload);
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
              value={settings.delivery_charge === undefined ? '' : settings.delivery_charge} 
              onChange={(e) => setSettings({ 
                ...settings, 
                delivery_charge: e.target.value === '' ? '' : Number(e.target.value) 
              })} 
              className="w-full" 
            />
          </div>
          <button onClick={handleSaveSettings} className="btn-primary w-full flex justify-center items-center gap-2">
            <Save size={18} /> {t('save')}
          </button>
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
