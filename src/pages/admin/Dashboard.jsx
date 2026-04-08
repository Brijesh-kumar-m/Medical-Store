import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getStats } from '../../services/index.js';
import { SkeletonStats } from '../../components/ui/Loading';
import { ShoppingCart, Droplets, Users, IndianRupee, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { t, lang } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const data = await getStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <SkeletonStats count={4} />;

  const cards = [
    {
      label: t('total_orders'),
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/20',
    },
    {
      label: t('total_tests'),
      value: stats?.totalTests || 0,
      icon: Droplets,
      color: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-500/20',
    },
    {
      label: t('total_users'),
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'from-violet-500 to-purple-600',
      shadow: 'shadow-violet-500/20',
    },
    {
      label: t('revenue'),
      value: `₹${stats?.revenue || 0}`,
      icon: IndianRupee,
      color: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/20',
    },
  ];

  return (
    <div>
      <h2 className="section-title flex items-center gap-2">
        <TrendingUp size={24} className="text-brand-400" />
        {t('admin_dashboard')}
      </h2>
      <p className="section-subtitle">{lang === 'hi' ? 'आपके बिज़नेस का ओवरव्यू' : 'Overview of your business'}</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="card animate-slide-up" style={{ animationDelay: `${0.1 * i}s` }}>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg ${card.shadow} mb-3`}>
              <card.icon size={22} className="text-white" />
            </div>
            <p className="text-surface-400 text-xs font-medium mb-1">{card.label}</p>
            <p className="text-2xl font-extrabold">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
