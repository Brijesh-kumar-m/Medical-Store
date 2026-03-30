import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getProducts } from '../services/index.js';
import ProductCard from '../components/shared/ProductCard';
import { LoadingSpinner } from '../components/ui/Loading';
import { Search, Filter } from 'lucide-react';

const categories = [
  { id: 'all', key: 'all' },
  { id: 'fever_cold', key: 'fever_cold' },
  { id: 'pain_relief', key: 'pain_relief' },
  { id: 'vitamins', key: 'vitamins' },
  { id: 'diabetes', key: 'diabetes' },
  { id: 'first_aid', key: 'first_aid' },
  { id: 'general', key: 'general' },
];

export default function Products() {
  const { t, lang } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    loadProducts();
  }, [category]);

  async function loadProducts() {
    setLoading(true);
    try {
      const data = await getProducts(category);
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = products.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.name_hi && p.name_hi.includes(search))
    );
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-6">
        <h2 className="section-title">{t('medicines')}</h2>
        <p className="section-subtitle">
          {lang === 'hi' ? 'OTC दवाइयाँ ऑर्डर करें' : 'Order OTC medicines online'}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`${t('search')}...`}
          className="w-full pl-11 pr-4"
          id="product-search"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              category === cat.id
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                : 'bg-surface-800 text-surface-400 border border-surface-600 hover:border-brand-500/50'
            }`}
            id={`cat-${cat.id}`}
          >
            {t(cat.key)}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <LoadingSpinner text={t('loading')} />
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12">
          <Filter size={40} className="text-surface-600 mx-auto mb-3" />
          <p className="text-surface-400">{t('no_items')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
