import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { User, Phone, ArrowRight, UserCheck, Eye, Lock } from 'lucide-react';
import { showToast } from '../components/ui/Toast';

export default function Login() {
  const { t, lang } = useLanguage();
  const { loginSimple, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('simple'); // 'simple' | 'otp'
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const adminMobiles = (import.meta.env.VITE_ADMIN_MOBILES || '').split(',');
  const isAdminPhone = mobile.length === 10 && adminMobiles.includes(mobile);

  async function handleSimpleLogin(e) {
    e.preventDefault();
    if (!name.trim()) {
      showToast(lang === 'hi' ? 'कृपया नाम दर्ज करें' : 'Please enter your name', 'error');
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      showToast(lang === 'hi' ? 'कृपया 10 अंकों का मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    if (isAdminPhone) {
      const correctPin = import.meta.env.VITE_ADMIN_PIN || '123456';
      if (pin !== correctPin) {
        showToast(lang === 'hi' ? 'गलत एडमिन पिन (Incorrect PIN)' : 'Incorrect Admin Security PIN', 'error');
        return;
      }
    }

    setLoading(true);
    try {
      await loginSimple(name, mobile);
      showToast(lang === 'hi' ? `स्वागत है, ${name}! 🎉` : `Welcome, ${name}! 🎉`);
      navigate('/');
    } catch (err) {
      showToast(lang === 'hi' ? 'लॉगिन विफल' : 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  }

  function handleGuest() {
    loginAsGuest();
    navigate('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-8 pb-32">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-brand-500/30">
            <span className="text-white font-black text-2xl">O₂</span>
          </div>
          <h2 className="text-2xl font-extrabold">{t('login_title')}</h2>
          <p className="text-surface-400 mt-2">{t('login_subtitle')}</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6 p-1 bg-surface-800 rounded-2xl">
          <button
            onClick={() => setMode('simple')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              mode === 'simple'
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                : 'text-surface-400 hover:text-white'
            }`}
          >
            {t('login_simple')}
          </button>
          <button
            onClick={() => setMode('otp')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              mode === 'otp'
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                : 'text-surface-400 hover:text-white'
            }`}
          >
            {t('login_otp')}
          </button>
        </div>

        {/* Simple Login Form */}
        {mode === 'simple' && (
          <form onSubmit={handleSimpleLogin} className="space-y-4 animate-fade-in">
            <div>
              <label className="input-label">{t('name')}</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('enter_name')}
                  className="w-full !pl-12"
                  id="login-name"
                />
              </div>
            </div>

            <div>
              <label className="input-label">{t('mobile')}</label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500" />
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder={t('enter_mobile')}
                  className="w-full !pl-12"
                  id="login-mobile"
                  inputMode="numeric"
                />
              </div>
            </div>

            {isAdminPhone && (
              <div className="animate-fade-in mt-1">
                <label className="input-label text-brand-400">Admin Security PIN</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400" />
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter Secret PIN"
                    className="w-full !pl-12 !border-brand-500/50 bg-brand-500/10 text-white placeholder:text-brand-500/50"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4"
              id="login-submit"
            >
              {loading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <>
                  <UserCheck size={20} />
                  {t('login')}
                </>
              )}
            </button>
          </form>
        )}

        {/* OTP Mode */}
        {mode === 'otp' && (
          <div className="card text-center py-8 animate-fade-in">
            <Phone size={40} className="text-brand-400 mx-auto mb-4" />
            <p className="text-surface-400 text-sm mb-4">
              {lang === 'hi'
                ? 'OTP लॉगिन के लिए Firebase या Supabase Auth सेटअप करें।'
                : 'Configure Firebase or Supabase Auth for OTP login.'}
            </p>
            <p className="text-surface-500 text-xs">
              {lang === 'hi' ? 'अभी "आसान लॉगिन" का उपयोग करें' : 'Use "Quick Login" for now'}
            </p>
          </div>
        )}

        {/* Guest Mode */}
        <div className="mt-6 text-center">
          <button
            onClick={handleGuest}
            className="text-surface-400 hover:text-brand-400 transition-colors text-sm font-medium flex items-center gap-2 mx-auto"
            id="guest-btn"
          >
            <Eye size={16} />
            {t('guest_mode')}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
