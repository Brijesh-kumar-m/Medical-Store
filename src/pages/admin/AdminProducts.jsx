import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../services/index.js';
import { LoadingSpinner } from '../../components/ui/Loading';
import { showToast } from '../../components/ui/Toast';
import { Plus, Edit3, Trash2, X, Save, Package } from 'lucide-react';

const categories = ['fever_cold', 'pain_relief', 'vitamins', 'diabetes', 'first_aid', 'general'];

const emptyProduct = {
  name: '', name_hi: '', price: '', category: 'general',
  image: '', requires_prescription: false, in_stock: true,
};

export default function AdminProducts() {
  const { t, lang } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | 'new' | product obj
  const [form, setForm] = useState({ ...emptyProduct });

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      setProducts(await getProducts());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  function openNew() {
    setForm({ ...emptyProduct });
    setEditing('new');
  }

  function openEdit(product) {
    setForm({ ...product });
    setEditing(product);
  }

  async function handleSave() {
    if (!form.name || !form.price) {
      showToast('Name and price are required', 'error');
      return;
    }
    try {
      if (editing === 'new') {
        await addProduct({ ...form, price: Number(form.price) });
        showToast(lang === 'hi' ? 'प्रोडक्ट जोड़ा गया' : 'Product added');
      } else {
        await updateProduct(editing.id, { ...form, price: Number(form.price) });
        showToast(lang === 'hi' ? 'प्रोडक्ट अपडेट हो गया' : 'Product updated');
      }
      setEditing(null);
      load();
    } catch (err) {
      showToast('Error saving product', 'error');
    }
  }

  async function handleDelete(id) {
    if (!confirm(lang === 'hi' ? 'क्या आप इसे हटाना चाहते हैं?' : 'Delete this product?')) return;
    try {
      await deleteProduct(id);
      showToast(lang === 'hi' ? 'प्रोडक्ट हटाया गया' : 'Product deleted');
      load();
    } catch (err) {
      showToast('Error deleting', 'error');
    }
  }

  if (loading) return <LoadingSpinner text={t('loading')} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="section-title">{t('admin_products')}</h2>
          <p className="text-surface-400 text-sm">{products.length} {lang === 'hi' ? 'प्रोडक्ट' : 'products'}</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2" id="add-product-btn">
          <Plus size={18} /> {t('add_product')}
        </button>
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className="card flex items-center gap-4" id={`admin-product-${p.id}`}>
            <div className="w-12 h-12 rounded-xl bg-surface-700 flex items-center justify-center shrink-0">
              <Package size={20} className="text-brand-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm truncate">{p.name}</h4>
              <p className="text-xs text-surface-500">{t(p.category)} • {p.in_stock ? t('in_stock') : t('out_of_stock')}</p>
            </div>
            <span className="text-brand-400 font-bold shrink-0">₹{p.price}</span>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => openEdit(p)} className="p-2 rounded-lg bg-surface-700 hover:bg-surface-600 transition-colors">
                <Edit3 size={14} className="text-blue-400" />
              </button>
              <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg bg-surface-700 hover:bg-red-500/20 transition-colors">
                <Trash2 size={14} className="text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editing !== null && (
        <>
          <div className="overlay" onClick={() => setEditing(null)} />
          <div className="modal">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">{editing === 'new' ? t('add_product') : t('edit_product')}</h3>
              <button onClick={() => setEditing(null)} className="p-2 rounded-lg hover:bg-surface-700">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="input-label">{t('product_name')} (English)</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full" />
              </div>
              <div>
                <label className="input-label">{t('product_name')} (हिंदी)</label>
                <input value={form.name_hi} onChange={(e) => setForm({ ...form, name_hi: e.target.value })} className="w-full" />
              </div>
              <div>
                <label className="input-label">{t('product_price')}</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full" />
              </div>
              <div>
                <label className="input-label">{t('product_category')}</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full">
                  {categories.map((c) => <option key={c} value={c}>{t(c)}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.requires_prescription}
                    onChange={(e) => setForm({ ...form, requires_prescription: e.target.checked })}
                    className="w-4 h-4 rounded border-surface-600 bg-surface-700"
                  />
                  <span className="text-sm">{t('requires_prescription')}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.in_stock}
                    onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
                    className="w-4 h-4 rounded border-surface-600 bg-surface-700"
                  />
                  <span className="text-sm">{t('in_stock')}</span>
                </label>
              </div>
              <button onClick={handleSave} className="btn-primary w-full flex items-center justify-center gap-2">
                <Save size={18} /> {t('save')}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
