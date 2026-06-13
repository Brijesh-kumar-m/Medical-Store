import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Pill, Droplets, FileImage, MessageCircle, ArrowRight, Heart, Shield, Truck, Phone, Gift } from 'lucide-react';
import { openWhatsApp } from '../utils/whatsapp';

export default function Home() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();

  const services = [
    {
      to: '/products',
      icon: Pill,
      label: t('order_medicine'),
      desc: lang === 'hi' ? 'घर बैठे दवाइयाँ मँगाएँ' : 'Order medicines at your doorstep',
      color: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/30',
    },
    {
      to: '/blood-tests',
      icon: Droplets,
      label: t('book_blood_test'),
      desc: lang === 'hi' ? 'घर पर सैंपल कलेक्शन' : 'Home sample collection',
      color: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-500/30',
    },
    {
      to: '/prescriptions',
      icon: FileImage,
      label: t('upload_rx'),
      desc: lang === 'hi' ? 'प्रिस्क्रिप्शन फ़ोटो भेजें' : 'Send prescription photo',
      color: 'from-violet-500 to-purple-600',
      shadow: 'shadow-violet-500/30',
    },
    {
      to: '/referral',
      icon: Gift,
      label: lang === 'hi' ? 'रेफ़र करें और कमाएँ' : 'Refer & Earn',
      desc: lang === 'hi' ? 'दोस्तों को शेयर करें, रिवॉर्ड पाएँ' : 'Share & earn ₹50 per referral',
      color: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/30',
    },
  ];

  const features = [
    { icon: Heart, title: lang === 'hi' ? 'विश्वसनीय' : 'Trusted', desc: lang === 'hi' ? '100% असली दवाइयाँ' : '100% genuine medicines' },
    { icon: Truck, title: lang === 'hi' ? 'होम डिलीवरी' : 'Home Delivery', desc: lang === 'hi' ? 'आपके दरवाज़े तक' : 'Right at your doorstep' },
    { icon: Shield, title: lang === 'hi' ? 'सुरक्षित' : 'Safe & Secure', desc: lang === 'hi' ? 'आपका डेटा सुरक्षित' : 'Your data is protected' },
  ];

  return (
    <div className="page-container" style={{ paddingBottom: '120px' }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-500/20 via-slate-50/80 dark:via-surface-900/80 to-teal-600/10 dark:to-teal-900/40 border border-brand-500/20 p-8 mb-10 shadow-[0_20px_50px_rgba(4,200,165,0.1)] transition-colors duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(4,200,165,0.2),transparent_70%)]" />
        <div className="relative z-10">
          {user && user.id !== 'guest' && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-bold tracking-wide mb-4 animate-fade-in shadow-inner">
              {lang === 'hi' ? `नमस्ते, ${user.name} 🙏` : `Hello, ${user.name} 👋`}
            </div>
          )}
          <h2 className="text-4xl font-extrabold leading-tight mb-4 animate-slide-up text-slate-900 dark:text-white drop-shadow-sm transition-colors duration-300">
            {t('hero_title')}
          </h2>
          <p className="text-slate-600 dark:text-surface-300 text-lg mb-8 animate-slide-up font-medium leading-relaxed transition-colors duration-300" style={{ animationDelay: '0.1s' }}>
            {t('hero_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/products" className="btn-primary flex items-center justify-center gap-2 group w-full sm:w-auto">
              {t('order_medicine')} 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
      </section>

      {/* Service Cards */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="section-title text-2xl">{lang === 'hi' ? 'हमारी सेवाएँ' : 'Our Services'}</h3>
            <p className="section-subtitle mb-0">{lang === 'hi' ? 'अपनी ज़रूरत चुनें' : 'Choose what you need'}</p>
          </div>
        </div>

        <div className="grid gap-5">
          {services.map((service, i) => (
            <Link
              key={service.to}
              to={service.to}
              className="card-interactive flex items-center gap-5 p-5 animate-slide-up shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              <div className={`w-16 h-16 rounded-[1.25rem] bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg ${service.shadow} shrink-0`}>
                <service.icon size={28} className="text-white drop-shadow-md" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-[17px] text-slate-900 dark:text-white tracking-wide mb-1 transition-colors duration-300">{service.label}</h4>
                <p className="text-slate-500 dark:text-surface-400 text-sm font-medium transition-colors duration-300">{service.desc}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-surface-800/50 flex items-center justify-center shrink-0 border border-slate-200 dark:border-surface-700 transition-colors duration-300">
                <ArrowRight size={20} className="text-brand-400" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-10">
        <h3 className="section-title text-2xl mb-1">{lang === 'hi' ? 'हम क्यों?' : 'Why Us?'}</h3>
        <p className="section-subtitle mb-6">{lang === 'hi' ? 'आपके भरोसे के लिए' : 'Your trust is our priority'}</p>

        <div className="grid grid-cols-3 gap-4">
          {features.map((feat, i) => (
            <div key={i} className="card text-center p-5 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 rounded-[1.25rem] bg-brand-500/10 flex items-center justify-center mx-auto mb-4 border border-brand-500/20 shadow-inner">
                <feat.icon size={26} className="text-brand-400" />
              </div>
              <h4 className="font-extrabold text-[13px] mb-1.5 text-slate-900 dark:text-white leading-tight transition-colors duration-300">{feat.title}</h4>
              <p className="text-slate-500 dark:text-surface-400 text-[11px] leading-relaxed transition-colors duration-300">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="card relative overflow-hidden bg-gradient-to-br from-green-500/20 to-emerald-950/10 dark:to-emerald-900/40 border-green-500/30 text-center p-8 shadow-[0_20px_40px_rgba(34,197,94,0.05)] dark:shadow-[0_20px_40px_rgba(34,197,94,0.15)] animate-slide-up transition-colors duration-300">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-30" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-[1.25rem] bg-green-500/20 flex items-center justify-center mb-5 border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.2)] animate-pulse-slow">
            <Phone size={32} className="text-green-400" />
          </div>
          <h3 className="font-extrabold text-2xl mb-2 text-slate-900 dark:text-white tracking-wide transition-colors duration-300">{t('need_help')}</h3>
          <p className="text-slate-600 dark:text-surface-300 text-[15px] mb-6 font-medium max-w-xs mx-auto leading-relaxed transition-colors duration-300">{t('about_text')}</p>
          <button
            onClick={() => openWhatsApp(t('whatsapp_msg'))}
            className="btn-whatsapp w-full sm:w-auto"
          >
            <MessageCircle size={22} className="animate-bounce" />
            <span className="text-lg">WhatsApp</span>
          </button>
        </div>
      </section>
    </div>
  );
}
