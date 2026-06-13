import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createOrder, getSettings } from '../services/index.js';
import { openWhatsApp, generateOrderMessage } from '../utils/whatsapp';
import { showToast } from '../components/ui/Toast';
import { Minus, Plus, Trash2, ShoppingBag, MapPin, MessageCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import OptimizedImage from '../components/ui/OptimizedImage';

export default function Cart() {
  const { t, lang } = useLanguage();
  const { items, updateQty, removeItem, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [placing, setPlacing] = useState(false);
  const [orderDone, setOrderDone] = useState(null);
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  useEffect(() => {
    async function init() {
      try {
        const s = await getSettings();
        setDeliveryCharge(s?.delivery_charge || 0);
      } catch (e) {
        console.error(e);
      }
    }
    init();
  }, []);

  const finalTotal = totalPrice + deliveryCharge;

  async function handlePlaceOrder() {
    if (!user || user.id === 'guest') {
      showToast(lang === 'hi' ? 'कृपया पहले लॉगिन करें' : 'Please login first', 'info');
      navigate('/login');
      return;
    }
    if (!address.trim()) {
      showToast(lang === 'hi' ? 'कृपया पता दर्ज करें' : 'Please enter address', 'error');
      return;
    }

    setPlacing(true);
    try {
      const order = await createOrder({
        user_id: user.id,
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
        total_price: finalTotal,
        address,
        mobile: user.mobile,
      });
      setOrderDone(order);
      clearCart();
      showToast(t('order_placed'));
    } catch (err) {
      showToast(lang === 'hi' ? 'ऑर्डर विफल' : 'Order failed', 'error');
    } finally {
      setPlacing(false);
    }
  }

  function handleWhatsApp() {
    if (!address.trim()) {
      showToast(lang === 'hi' ? 'कृपया डिलीवरी के लिए पता दर्ज करें' : 'Please enter delivery address', 'error');
      document.getElementById('cart-address')?.focus();
      return;
    }
    const order = { 
      subtotal: totalPrice, 
      delivery_charge: deliveryCharge, 
      total_price: finalTotal, 
      address, 
      mobile: user?.mobile || '',
      patient_name: user?.name || ''
    };
    const msg = generateOrderMessage(order, items, lang);
    openWhatsApp(msg);
  }

  // Order success screen
  if (orderDone) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="animate-bounce-gentle mb-6">
          <CheckCircle size={72} className="text-green-400" />
        </div>
        <h2 className="text-2xl font-extrabold mb-2">{t('order_placed')}</h2>
        <p className="text-slate-500 dark:text-surface-400 mb-1">{t('order_id')}: <span className="text-brand-400 font-mono">{orderDone.id}</span></p>
        <p className="text-slate-500 dark:text-surface-400 mb-6">{t('total')}: <span className="text-slate-900 dark:text-white font-bold">₹{orderDone.total_price}</span></p>
        <div className="flex gap-3">
          <Link to="/orders" className="btn-primary">{t('track_order')}</Link>
          <Link to="/products" className="btn-secondary">{t('medicines')}</Link>
        </div>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShoppingBag size={64} className="text-slate-400 dark:text-surface-600 mb-4" />
        <h2 className="text-xl font-bold mb-2">{t('empty_cart')}</h2>
        <p className="text-slate-500 dark:text-surface-400 text-sm mb-6">
          {lang === 'hi' ? 'दवाइयाँ ब्राउज़ करने के लिए नीचे क्लिक करें' : 'Click below to browse medicines'}
        </p>
        <Link to="/products" className="btn-primary flex items-center gap-2">
          <ArrowLeft size={18} />
          {t('medicines')}
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2 className="section-title">{t('cart')}</h2>
      <p className="section-subtitle">{items.length} {lang === 'hi' ? 'आइटम' : 'items'}</p>

      {/* Cart Items */}
      <div className="space-y-3 mb-6">
        {items.map((item) => {
          const name = lang === 'hi' && item.name_hi ? item.name_hi : item.name;
          return (
            <div key={item.id} className="card flex items-center gap-3" id={`cart-item-${item.id}`}>
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-surface-700 flex items-center justify-center shrink-0">
                {item.image ? (
                  <OptimizedImage
                    src={item.image}
                    alt={name}
                    className="w-full h-full object-cover"
                    fallbackIcon={<ShoppingBag size={20} className="text-brand-400" />}
                  />
                ) : (
                  <ShoppingBag size={20} className="text-brand-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm truncate">{name}</h4>
                <p className="text-brand-400 font-bold text-sm">₹{item.price} {t('per_item')}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQty(item.id, item.qty - 1)}
                  className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-surface-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-surface-600 text-slate-800 dark:text-white transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-bold">{item.qty}</span>
                <button
                  onClick={() => updateQty(item.id, item.qty + 1)}
                  className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-surface-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-surface-600 text-slate-800 dark:text-white transition-colors"
                >
                  <Plus size={14} />
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors ml-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Address */}
      <div className="mb-6">
        <label className="input-label flex items-center gap-2">
          <MapPin size={14} className="text-brand-400" />
          {t('delivery_address')}
        </label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={t('enter_address')}
          rows={3}
          className="w-full resize-none"
          id="cart-address"
        />
      </div>

      {/* Total & Actions */}
      <div className="card bg-gradient-to-r from-brand-500/10 to-brand-600/10 border-brand-500/20 mb-4">
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-slate-500 dark:text-surface-400 text-sm">
            <span>{lang === 'hi' ? 'दवाइयों का मूल्य' : 'Subtotal'}</span>
            <span>₹{totalPrice}</span>
          </div>
          <div className="flex items-center justify-between text-slate-500 dark:text-surface-400 text-sm">
            <span>{lang === 'hi' ? 'डिलीवरी चार्ज' : 'Delivery Charge'}</span>
            <span>₹{deliveryCharge}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-brand-500/20">
            <span className="text-slate-800 dark:text-surface-100 font-bold">{t('total')}</span>
            <span className="text-2xl font-extrabold gradient-text">₹{finalTotal}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handlePlaceOrder}
            disabled={placing}
            className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
            id="place-order-btn"
          >
            {placing ? '⏳' : <ShoppingBag size={20} />}
            {t('place_order')}
          </button>

          <button
            onClick={handleWhatsApp}
            className="btn-whatsapp w-full"
            id="whatsapp-order-btn"
          >
            <MessageCircle size={18} />
            {t('whatsapp_order')}
          </button>
        </div>
      </div>
    </div>
  );
}
