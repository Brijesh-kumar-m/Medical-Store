import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import { ShoppingCart, AlertTriangle, Pill } from 'lucide-react';
import { showToast } from '../ui/Toast';

export default function ProductCard({ product }) {
  const { t, lang } = useLanguage();
  const { addItem } = useCart();

  const name = lang === 'hi' && product.name_hi ? product.name_hi : product.name;

  function handleAdd() {
    if (product.requires_prescription) {
      showToast(t('prescription_required'), 'info');
      return;
    }
    addItem(product);
    showToast(`${name} ${lang === 'hi' ? 'कार्ट में जोड़ा गया' : 'added to cart'}`, 'success');
  }

  return (
    <div className="card-interactive group" id={`product-${product.id}`}>
      {/* Product Image Area */}
      <div className="relative h-32 rounded-xl bg-gradient-to-br from-surface-800 to-surface-700 mb-3 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={name} className="w-full h-full object-cover rounded-xl" />
        ) : (
          <Pill size={36} className="text-brand-500/40" />
        )}
        {product.requires_prescription && (
          <div className="absolute top-2 left-2 badge-warning text-[10px]">
            <AlertTriangle size={10} />
            Rx
          </div>
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
            <span className="badge-danger">{t('out_of_stock')}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-2">{name}</h3>
      <p className="text-brand-400 font-bold text-lg mb-3">₹{product.price}</p>

      {/* Add Button */}
      <button
        onClick={handleAdd}
        disabled={!product.in_stock}
        className="w-full btn-primary py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        id={`add-product-${product.id}`}
      >
        <ShoppingCart size={16} />
        {t('add_to_cart')}
      </button>
    </div>
  );
}
