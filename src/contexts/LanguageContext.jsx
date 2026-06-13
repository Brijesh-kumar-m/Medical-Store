import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('o2clinic_lang') || 'en');
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTranslations() {
      try {
        const res = await fetch(`/locales/${lang}.json`);
        const data = await res.json();
        setTranslations(data);
      } catch (err) {
        console.error('Failed to load translations:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTranslations();
  }, [lang]);

  function switchLanguage(newLang) {
    setLang(newLang);
    localStorage.setItem('o2clinic_lang', newLang);
  }

  function t(key) {
    return translations[key] || key;
  }

  return (
    <LanguageContext.Provider value={{ lang, switchLanguage, t, loading }}>
      {loading ? (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #04c8a5, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 20px rgba(4,200,165,0.3)' }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>O₂</span>
            </div>
            <div style={{ width: 24, height: 24, border: '3px solid rgba(4,200,165,0.3)', borderTopColor: '#04c8a5', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        </div>
      ) : children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
