import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Pill, Droplets, FileImage, MessageCircle, ArrowRight, Heart, Shield, Truck, Phone } from 'lucide-react';
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
  ];

  const features = [
    { icon: Heart, title: lang === 'hi' ? 'विश्वसनीय' : 'Trusted', desc: lang === 'hi' ? '100% असली दवाइयाँ' : '100% genuine medicines' },
    { icon: Truck, title: lang === 'hi' ? 'होम डिलीवरी' : 'Home Delivery', desc: lang === 'hi' ? 'आपके दरवाज़े तक' : 'Right at your doorstep' },
    { icon: Shield, title: lang === 'hi' ? 'सुरक्षित' : 'Safe & Secure', desc: lang === 'hi' ? 'आपका डेटा सुरक्षित' : 'Your data is protected' },
  ];

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600/20 via-surface-900 to-brand-900/20 border border-brand-500/10 p-6 mb-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(4,200,165,0.15),transparent_70%)]" />
        <div className="relative z-10">
          {user && user.id !== 'guest' && (
            <p className="text-brand-400 text-sm font-medium mb-2 animate-fade-in">
              {lang === 'hi' ? `नमस्ते, ${user.name} 🙏` : `Hello, ${user.name} 👋`}
            </p>
          )}
          <h2 className="text-3xl font-extrabold leading-tight mb-3 animate-slide-up">
            {t('hero_title')}
          </h2>
          <p className="text-surface-300 text-base mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {t('hero_subtitle')}
          </p>
          <div className="flex flex-wrap gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/products" className="btn-primary flex items-center gap-2">
              {t('order_medicine')} <ArrowRight size={18} />
            </Link>
            <button
              onClick={() => openWhatsApp(t('whatsapp_msg'))}
              className="btn-whatsapp"
            >
              <MessageCircle size={18} />
              {t('whatsapp_order')}
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl animate-float" />
        <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl" />
      </section>

      {/* Service Cards */}
      <section className="mb-8">
        <h3 className="section-title">{lang === 'hi' ? 'हमारी सेवाएँ' : 'Our Services'}</h3>
        <p className="section-subtitle">{lang === 'hi' ? 'अपनी ज़रूरत चुनें' : 'Choose what you need'}</p>

        <div className="grid gap-4">
          {services.map((service, i) => (
            <Link
              key={service.to}
              to={service.to}
              className="card-interactive flex items-center gap-4 animate-slide-up"
              style={{ animationDelay: `${0.1 * i}s` }}
              id={`service-${i}`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg ${service.shadow} shrink-0`}>
                <service.icon size={26} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-base">{service.label}</h4>
                <p className="text-surface-400 text-sm">{service.desc}</p>
              </div>
              <ArrowRight size={20} className="text-surface-500 shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mb-8">
        <h3 className="section-title">{lang === 'hi' ? 'हम क्यों?' : 'Why Us?'}</h3>
        <p className="section-subtitle">{lang === 'hi' ? 'आपके भरोसे के लिए' : 'Your trust is our priority'}</p>

        <div className="grid grid-cols-3 gap-3">
          {features.map((feat, i) => (
            <div key={i} className="card text-center py-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-3">
                <feat.icon size={22} className="text-brand-400" />
              </div>
              <h4 className="font-bold text-sm mb-1">{feat.title}</h4>
              <p className="text-surface-400 text-xs">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="card bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20 text-center py-6">
        <Phone size={28} className="text-green-400 mx-auto mb-3" />
        <h3 className="font-bold text-lg mb-1">{t('need_help')}</h3>
        <p className="text-surface-400 text-sm mb-4">{t('about_text')}</p>
        <button
          onClick={() => openWhatsApp(t('whatsapp_msg'))}
          className="btn-whatsapp mx-auto"
        >
          <MessageCircle size={18} />
          WhatsApp
        </button>
      </section>
    </div>
  );
}
