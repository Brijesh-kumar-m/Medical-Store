import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getOrders, getBloodTestBookings } from '../services/index.js';
import { LoadingSpinner } from '../components/ui/Loading';
import { Package, Droplets, Clock, CheckCircle, Truck, ClipboardCheck, FileText } from 'lucide-react';

const statusConfig = {
  pending:   { color: 'badge-warning', icon: Clock, key: 'status_pending' },
  confirmed: { color: 'badge-info', icon: ClipboardCheck, key: 'status_confirmed' },
  dispatched:{ color: 'badge-info', icon: Truck, key: 'status_dispatched' },
  delivered: { color: 'badge-success', icon: CheckCircle, key: 'status_delivered' },
  requested: { color: 'badge-warning', icon: Clock, key: 'status_requested' },
  collected: { color: 'badge-info', icon: ClipboardCheck, key: 'status_collected' },
  report_ready: { color: 'badge-success', icon: FileText, key: 'status_report_ready' },
};

export default function Orders() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [bloodTests, setBloodTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.id === 'guest') {
      navigate('/login');
      return;
    }
    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      try {
        const [o, bt] = await Promise.all([
          getOrders(user.id),
          getBloodTestBookings(user.id),
        ]);
        if (!cancelled) {
          setOrders(o);
          setBloodTests(bt);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, [user, navigate]);

  async function loadData() {
    setLoading(true);
    try {
      const [o, bt] = await Promise.all([
        getOrders(user.id),
        getBloodTestBookings(user.id),
      ]);
      setOrders(o);
      setBloodTests(bt);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function StatusBadge({ status }) {
    const cfg = statusConfig[status] || statusConfig.pending;
    const Icon = cfg.icon;
    return (
      <span className={cfg.color}>
        <Icon size={12} />
        {t(cfg.key)}
      </span>
    );
  }

  return (
    <div className="page-container">
      <h2 className="section-title">{t('orders')}</h2>
      <p className="section-subtitle">{t('order_history')}</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-surface-800 rounded-2xl">
        <button
          onClick={() => setTab('orders')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            tab === 'orders'
              ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
              : 'text-surface-400 hover:text-white'
          }`}
        >
          <Package size={16} />
          {t('medicines')} ({orders.length})
        </button>
        <button
          onClick={() => setTab('tests')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            tab === 'tests'
              ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
              : 'text-surface-400 hover:text-white'
          }`}
        >
          <Droplets size={16} />
          {t('blood_tests')} ({bloodTests.length})
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text={t('loading')} />
      ) : tab === 'orders' ? (
        orders.length === 0 ? (
          <div className="card text-center py-12">
            <Package size={40} className="text-surface-600 mx-auto mb-3" />
            <p className="text-surface-400">{t('no_orders')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="card" id={`order-${order.id}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-surface-500 font-mono">{order.id}</span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="space-y-1 mb-3">
                  {(order.items || []).map((item, i) => (
                    <p key={i} className="text-sm text-surface-300">
                      {item.name} × {item.qty} — ₹{item.price * item.qty}
                    </p>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-surface-700">
                  <span className="text-xs text-surface-500">{new Date(order.created_at).toLocaleDateString()}</span>
                  <span className="font-bold text-brand-400">₹{order.total_price}</span>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        bloodTests.length === 0 ? (
          <div className="card text-center py-12">
            <Droplets size={40} className="text-surface-600 mx-auto mb-3" />
            <p className="text-surface-400">{lang === 'hi' ? 'कोई टेस्ट नहीं' : 'No blood tests yet'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bloodTests.map((bt) => (
              <div key={bt.id} className="card" id={`bt-${bt.id}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">{bt.test_type}</h4>
                  <StatusBadge status={bt.status} />
                </div>
                <div className="text-xs text-surface-400 space-y-1">
                  <p>{t('date')}: {bt.date} | {t('time')}: {bt.time}</p>
                  <p>{t('address')}: {bt.address}</p>
                </div>
                {bt.report_url && (
                  <a
                    href={bt.report_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-brand-400 text-sm font-medium hover:underline"
                  >
                    <FileText size={14} />
                    {t('view_report')}
                  </a>
                )}
                <div className="mt-2 pt-2 border-t border-surface-700 flex justify-between items-center">
                  <span className="text-xs text-surface-500">{new Date(bt.created_at).toLocaleDateString()}</span>
                  <span className="text-brand-400 font-bold">₹{bt.price}</span>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
