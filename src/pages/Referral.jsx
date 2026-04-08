import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { showToast } from '../components/ui/Toast';
import { Gift, Copy, Share2, Users, Star, ArrowRight, CheckCircle } from 'lucide-react';

export default function Referral() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [referralStats, setReferralStats] = useState({ count: 0, rewards: 0 });

  // Generate referral code from user ID
  const referralCode = user?.id ? `O2-${user.id.slice(-6).toUpperCase()}` : '';
  const referralLink = user?.id
    ? `${window.location.origin}/login?ref=${referralCode}`
    : '';

  useEffect(() => {
    // Load referral stats from localStorage (would be from backend in production)
    if (user?.id) {
      const saved = localStorage.getItem(`o2_referrals_${user.id}`);
      if (saved) {
        try { setReferralStats(JSON.parse(saved)); } catch {}
      }
    }
  }, [user]);

  function handleCopy() {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      showToast(lang === 'hi' ? 'लिंक कॉपी हो गया!' : 'Link copied!');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = referralLink;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      showToast(lang === 'hi' ? 'लिंक कॉपी हो गया!' : 'Link copied!');
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleShare() {
    if (!referralLink) return;
    const shareData = {
      title: 'O2Clinic',
      text: lang === 'hi'
        ? `O2Clinic ऐप से दवाइयाँ ऑर्डर करें और ₹50 कैशबैक पाएँ! मेरा रेफ़रल कोड: ${referralCode}`
        : `Order medicines from O2Clinic and get ₹50 cashback! My referral code: ${referralCode}`,
      url: referralLink,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      handleCopy();
    }
  }

  // Not logged in
  if (!user || user.id === 'guest') {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Gift size={64} className="text-surface-600 mb-4" />
        <h2 className="text-xl font-bold mb-2">
          {lang === 'hi' ? 'लॉगिन करें' : 'Login Required'}
        </h2>
        <p className="text-surface-400 text-sm mb-6">
          {lang === 'hi' ? 'रेफ़रल प्रोग्राम का लाभ उठाने के लिए लॉगिन करें' : 'Login to access the referral program'}
        </p>
        <Link to="/login" className="btn-primary">{t('login')}</Link>
      </div>
    );
  }

  const rewards = [
    {
      icon: Gift,
      title: lang === 'hi' ? '₹50 कैशबैक' : '₹50 Cashback',
      desc: lang === 'hi' ? 'हर सफल रेफ़रल पर' : 'On every successful referral',
    },
    {
      icon: Star,
      title: lang === 'hi' ? 'दोस्त को भी ₹25' : '₹25 for your friend',
      desc: lang === 'hi' ? 'उनके पहले ऑर्डर पर' : 'On their first order',
    },
    {
      icon: Users,
      title: lang === 'hi' ? 'कोई सीमा नहीं' : 'No Limit',
      desc: lang === 'hi' ? 'जितने चाहें उतने लोगों को रेफ़र करें' : 'Refer as many friends as you want',
    },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-amber-500/30">
          <Gift size={36} className="text-white" />
        </div>
        <h2 className="text-3xl font-extrabold mb-2">
          {lang === 'hi' ? 'रेफ़र करें और कमाएँ' : 'Refer & Earn'}
        </h2>
        <p className="text-surface-400">
          {lang === 'hi' ? 'दोस्तों को शेयर करें और रिवॉर्ड पाएँ' : 'Share with friends and earn rewards'}
        </p>
      </div>

      {/* Referral Code Card */}
      <div className="card bg-gradient-to-br from-brand-500/10 via-surface-900/80 to-amber-900/20 border-brand-500/20 mb-6">
        <p className="text-surface-400 text-sm mb-2 font-medium">
          {lang === 'hi' ? 'आपका रेफ़रल कोड' : 'Your Referral Code'}
        </p>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 bg-surface-900/60 border border-surface-700/50 rounded-2xl px-5 py-4 text-xl font-mono font-extrabold text-brand-400 text-center tracking-[0.3em]">
            {referralCode}
          </div>
          <button
            onClick={handleCopy}
            className={`p-4 rounded-2xl transition-all ${
              copied
                ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                : 'bg-surface-800 border border-surface-600 text-surface-300 hover:border-brand-500/50 hover:text-brand-400'
            }`}
            id="copy-referral"
          >
            {copied ? <CheckCircle size={22} /> : <Copy size={22} />}
          </button>
        </div>

        {/* Share Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleShare}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
            id="share-referral"
          >
            <Share2 size={18} />
            {lang === 'hi' ? 'शेयर करें' : 'Share Link'}
          </button>
          <button
            onClick={() => {
              const msg = lang === 'hi'
                ? `O2Clinic ऐप से दवाइयाँ ऑर्डर करें! मेरा रेफ़रल कोड इस्तेमाल करें: ${referralCode} और ₹25 कैशबैक पाएँ! ${referralLink}`
                : `Order medicines from O2Clinic! Use my referral code: ${referralCode} and get ₹25 cashback! ${referralLink}`;
              window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
            }}
            className="btn-whatsapp flex-1"
            id="whatsapp-referral"
          >
            WhatsApp
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="card text-center">
          <Users size={24} className="text-brand-400 mx-auto mb-2" />
          <p className="text-2xl font-extrabold">{referralStats.count}</p>
          <p className="text-surface-400 text-xs font-medium">
            {lang === 'hi' ? 'रेफ़रल' : 'Referrals'}
          </p>
        </div>
        <div className="card text-center">
          <Gift size={24} className="text-amber-400 mx-auto mb-2" />
          <p className="text-2xl font-extrabold gradient-text">₹{referralStats.rewards}</p>
          <p className="text-surface-400 text-xs font-medium">
            {lang === 'hi' ? 'कमाई' : 'Earned'}
          </p>
        </div>
      </div>

      {/* How it works */}
      <h3 className="section-title text-xl mb-4">
        {lang === 'hi' ? 'कैसे काम करता है?' : 'How it Works'}
      </h3>
      <div className="space-y-3 mb-8">
        {rewards.map((reward, i) => (
          <div key={i} className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <reward.icon size={22} className="text-amber-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm">{reward.title}</h4>
              <p className="text-surface-400 text-xs">{reward.desc}</p>
            </div>
            <ArrowRight size={16} className="text-surface-600" />
          </div>
        ))}
      </div>

      {/* Terms */}
      <div className="card bg-blue-500/5 border-blue-500/20">
        <h4 className="font-bold text-sm text-blue-400 mb-2">
          {lang === 'hi' ? 'ℹ️ शर्तें' : 'ℹ️ Terms'}
        </h4>
        <ul className="text-surface-400 text-xs space-y-1">
          <li>• {lang === 'hi' ? 'रेफ़रल का पहला ऑर्डर ₹100+ होना चाहिए' : 'Referral must place first order of ₹100+'}</li>
          <li>• {lang === 'hi' ? 'कैशबैक अगले ऑर्डर पर मिलेगा' : 'Cashback will be applied to your next order'}</li>
          <li>• {lang === 'hi' ? 'O2Clinic के पास कार्यक्रम बदलने का अधिकार है' : 'O2Clinic reserves the right to modify the program'}</li>
        </ul>
      </div>
    </div>
  );
}
