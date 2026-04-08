import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import { ShoppingCart, AlertTriangle, Pill, Tag, Plus } from 'lucide-react';
import { showToast } from '../ui/Toast';
import OptimizedImage from '../ui/OptimizedImage';

export default function ProductCard({ product }) {
  const { t, lang } = useLanguage();
  const { addItem } = useCart();

  const name = lang === 'hi' && product.name_hi ? product.name_hi : product.name;

  function handleAdd() {
    addItem(product);
    if (product.requires_prescription) {
      showToast(lang === 'hi' ? 'पर्चा (Prescription) अपलोड करना अनिवार्य है!' : 'Prescription upload is required for this item!', 'warning');
    } else {
      showToast(`${name} ${lang === 'hi' ? 'कार्ट में जोड़ा गया' : 'added to cart'}`, 'success');
    }
  }

  return (
    <div className="card-interactive group" id={`product-${product.id}`}>
      {/* Product Image Area */}
      <div className="relative h-28 sm:h-32 rounded-xl overflow-hidden mb-2">
        {product.image ? (
          <OptimizedImage
            src={product.image}
            alt={name}
            className="w-full h-full rounded-xl"
            fallbackIcon={<Pill size={32} className="text-brand-500/40" />}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface-800 to-surface-700 flex items-center justify-center">
            <Pill size={32} className="text-brand-500/40" />
          </div>
        )}
        {product.requires_prescription && (
          <div className="absolute top-1.5 left-1.5 badge-warning text-[10px] z-10 !px-1.5 !py-0.5">
            <AlertTriangle size={10} />
            Rx
          </div>
        )}

        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
            <span className="badge-danger text-[10px]">{t('out_of_stock')}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <h3 className="font-semibold text-xs sm:text-sm leading-tight mb-0.5 line-clamp-2">{name}</h3>
      <div className="flex items-baseline gap-1 flex-wrap">
        <p className="font-bold text-base leading-none">₹{product.price}</p>
        {product.mrp && Number(product.mrp) > Number(product.price) && (
          <>
            <p className="text-surface-500 text-[10px] font-medium line-through">₹{product.mrp}</p>
            <p className="text-[#388e3c] font-bold text-[10px]">
              {Math.round(((Number(product.mrp) - Number(product.price)) / Number(product.mrp)) * 100)}% off
            </p>
          </>
        )}
      </div>
      {product.offer && (
        <span className="text-[#388e3c] font-bold text-[10px] flex items-center gap-0.5 mt-0.5">
          <Tag size={9} className="fill-[#388e3c]/20" /> {product.offer}
        </span>
      )}

      {/* Add Button — Compact single-line */}
      <button
        onClick={handleAdd}
        disabled={!product.in_stock}
        className="w-full mt-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold
                   py-2 px-3 rounded-xl shadow-[0_4px_15px_rgba(4,200,165,0.3)]
                   hover:shadow-[0_4px_20px_rgba(4,200,165,0.5)] hover:scale-[1.02]
                   active:scale-[0.97] transition-all duration-200
                   text-xs flex items-center justify-center gap-1.5 whitespace-nowrap
                   disabled:opacity-40 disabled:cursor-not-allowed"
        id={`add-product-${product.id}`}
      >
        <Plus size={14} strokeWidth={3} />
        <span>{lang === 'hi' ? 'कार्ट में डालें' : 'Add'}</span>
      </button>
    </div>
  );
}
