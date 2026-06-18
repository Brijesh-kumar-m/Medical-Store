import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getOrders, updateOrderStatus, createNotification } from '../../services/index.js';
import { SkeletonCard } from '../../components/ui/Loading';
import { showToast } from '../../components/ui/Toast';
import { Package, ChevronDown, Phone, MapPin, User } from 'lucide-react';

const statuses = ['pending', 'confirmed', 'dispatched', 'delivered'];

export default function AdminOrders() {
  const { t, lang } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      setOrders(await getOrders());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function handleStatusChange(orderId, newStatus) {
    try {
      await updateOrderStatus(orderId, newStatus);
      
      const order = orders.find(o => o.id === orderId);
      if (order && order.user_id) {
        const shortId = String(orderId).slice(0, 8).toUpperCase();
        await createNotification({
          user_id: order.user_id,
          title: lang === 'hi' ? `💊 ऑर्डर #${shortId} अपडेट` : `💊 Order #${shortId} Updated`,
          body: lang === 'hi'
            ? `आपके ऑर्डर की स्थिति अब है: ${t(`status_${newStatus}`)}`
            : `Your order status is now: ${newStatus.toUpperCase()}`,
          type: 'order',
          metadata: { order_id: orderId, status: newStatus }
        });
      }

      showToast(lang === 'hi' ? 'स्थिति अपडेट हो गई' : 'Status updated');
      load();
    } catch (err) {
      showToast('Error updating status', 'error');
    }
  }

  const statusColors = {
    pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    dispatched: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  if (loading) return <SkeletonCard count={3} />;

  return (
    <div>
      <h2 className="section-title">{t('admin_orders')}</h2>
      <p className="section-subtitle">{orders.length} {lang === 'hi' ? 'ऑर्डर' : 'orders'}</p>

      {orders.length === 0 ? (
        <div className="card text-center py-12">
          <Package size={40} className="text-slate-400 dark:text-surface-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-surface-400">{t('no_orders')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="card" id={`admin-order-${order.id}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 dark:text-surface-500 font-mono">{order.id}</span>
                <span className="text-xs text-slate-400 dark:text-surface-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-1 mb-3">
                {(order.items || []).map((item, i) => (
                  <p key={i} className="text-sm text-slate-700 dark:text-surface-300">
                    {item.name} × {item.qty} = ₹{item.price * item.qty}
                  </p>
                ))}
              </div>

              <div className="flex flex-col gap-2 mb-3 pt-3 border-t border-slate-200 dark:border-surface-700">
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-surface-300">
                  <User size={14} className="shrink-0 text-brand-400" />
                  <span className="font-semibold">{order.users?.name || 'Customer'}</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-surface-400 leading-tight">
                  <MapPin size={14} className="shrink-0 mt-0.5" />
                  <span>{order.address || '—'}</span>
                </div>
                {(order.mobile || order.users?.mobile) && (
                  <div className="flex items-center gap-2 text-xs">
                    <Phone size={14} className="shrink-0 text-green-500" />
                    <a href={`https://wa.me/91${order.mobile || order.users?.mobile}`} target="_blank" rel="noreferrer" className="text-green-500 hover:text-green-400 hover:underline font-bold">
                      WhatsApp Contact (+91 {order.mobile || order.users?.mobile})
                    </a>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-surface-700">
                <span className="font-bold text-brand-400 text-lg">₹{order.total_price}</span>

                {/* Status Selector */}
                <div className="relative">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`appearance-none px-3 py-1.5 pr-8 rounded-xl text-xs font-semibold border cursor-pointer bg-transparent ${statusColors[order.status] || statusColors.pending}`}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s} className="bg-white dark:bg-surface-800 text-slate-800 dark:text-white font-semibold">
                        {t(`status_${s}`)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
