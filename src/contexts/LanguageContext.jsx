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
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
