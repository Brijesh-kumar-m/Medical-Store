import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { getOrders, getBloodTestBookings } from '../services/index.js';
import { SkeletonCard } from '../components/ui/Loading';
import { showToast } from '../components/ui/Toast';
import { Package, Droplets, Clock, CheckCircle, Truck, ClipboardCheck, FileText, Download, RefreshCw } from 'lucide-react';

const orderStatuses = ['pending', 'confirmed', 'dispatched', 'delivered'];
const testStatuses = ['requested', 'collected', 'report_ready'];

const statusConfig = {
  pending:   { color: 'badge-warning', icon: Clock, key: 'status_pending' },
  confirmed: { color: 'badge-info', icon: ClipboardCheck, key: 'status_confirmed' },
  dispatched:{ color: 'badge-info', icon: Truck, key: 'status_dispatched' },
  delivered: { color: 'badge-success', icon: CheckCircle, key: 'status_delivered' },
  requested: { color: 'badge-warning', icon: Clock, key: 'status_requested' },
  collected: { color: 'badge-info', icon: ClipboardCheck, key: 'status_collected' },
  report_ready: { color: 'badge-success', icon: FileText, key: 'status_report_ready' },
};

// Visual timeline component for order tracking
function StatusTimeline({ currentStatus, statuses, t }) {
  const currentIdx = statuses.indexOf(currentStatus);
  return (
    <div className="flex items-center gap-1 w-full my-3">
      {statuses.map((status, i) => {
        const isDone = i <= currentIdx;
        const isCurrent = i === currentIdx;
        return (
          <div key={status} className="flex items-center flex-1">
            <div className={`relative flex flex-col items-center`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                isDone
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                  : 'bg-surface-700 text-surface-500 border border-surface-600'
              } ${isCurrent ? 'ring-2 ring-brand-400/30 ring-offset-2 ring-offset-surface-900' : ''}`}>
                {isDone ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span className={`text-[9px] mt-1 font-medium leading-tight text-center ${
                isDone ? 'text-brand-400' : 'text-surface-500'
              }`}>
                {t(`status_${status}`)}
              </span>
            </div>
            {i < statuses.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 rounded transition-all ${
                i < currentIdx ? 'bg-brand-500' : 'bg-surface-700'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Orders() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { addItem } = useCart();
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

  function handleRepeatOrder(order) {
    if (!order.items || order.items.length === 0) return;
    order.items.forEach((item) => {
      for (let i = 0; i < (item.qty || 1); i++) {
        addItem({ id: item.id, name: item.name, price: item.price });
      }
    });
    showToast(
      lang === 'hi' ? 'आइटम कार्ट में जोड़े गए!' : 'Items added to cart!',
      'success'
    );
    navigate('/cart');
  }

  function handleDownloadReport(url) {
    window.open(url, '_blank');
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
        <SkeletonCard count={3} />
      ) : tab === 'orders' ? (
        orders.length === 0 ? (
          <div className="card text-center py-12">
            <Package size={40} className="text-surface-600 mx-auto mb-3" />
            <p className="text-surface-400">{t('no_orders')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="card" id={`order-${order.id}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-surface-500 font-mono">{order.id}</span>
                  <StatusBadge status={order.status} />
                </div>

                {/* Status Timeline */}
                <StatusTimeline
                  currentStatus={order.status}
                  statuses={orderStatuses}
                  t={t}
                />

                {/* Items */}
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

                {/* Repeat Order Button */}
                {order.items && order.items.length > 0 && (
                  <button
                    onClick={() => handleRepeatOrder(order)}
                    className="mt-3 w-full btn-secondary py-3 flex items-center justify-center gap-2 text-sm"
                    id={`repeat-${order.id}`}
                  >
                    <RefreshCw size={16} className="text-brand-400" />
                    {lang === 'hi' ? 'दोबारा ऑर्डर करें' : 'Repeat Order'}
                  </button>
                )}
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
          <div className="space-y-4">
            {bloodTests.map((bt) => (
              <div key={bt.id} className="card" id={`bt-${bt.id}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">{bt.test_type}</h4>
                  <StatusBadge status={bt.status} />
                </div>

                {/* Blood Test Status Timeline */}
                <StatusTimeline
                  currentStatus={bt.status}
                  statuses={testStatuses}
                  t={t}
                />

                <div className="text-xs text-surface-400 space-y-1">
                  <p>{t('date')}: {bt.date} | {t('time')}: {bt.time}</p>
                  <p>{t('address')}: {bt.address}</p>
                </div>

                {/* Report Download */}
                {bt.report_url && (
                  <button
                    onClick={() => handleDownloadReport(bt.report_url)}
                    className="mt-3 w-full btn-primary py-3 flex items-center justify-center gap-2 text-sm bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-500/30 hover:shadow-blue-500/50"
                    id={`download-report-${bt.id}`}
                  >
                    <Download size={16} />
                    {lang === 'hi' ? 'रिपोर्ट डाउनलोड करें' : 'Download Report'}
                  </button>
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
