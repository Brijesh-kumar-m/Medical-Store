import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getProducts, addProduct, updateProduct, deleteProduct, uploadFile } from '../../services/index.js';
import { SkeletonCard } from '../../components/ui/Loading';
import { showToast } from '../../components/ui/Toast';
import { Plus, Edit3, Trash2, X, Save, Package } from 'lucide-react';

const categories = ['fever_cold', 'pain_relief', 'vitamins', 'diabetes', 'first_aid', 'general'];

const emptyProduct = {
  name: '', name_hi: '', price: '', mrp: '', category: 'general',
  image: '', offer: '', requires_prescription: false, in_stock: true, sort_order: 0
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

  if (loading) return <SkeletonCard count={4} />;

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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">Selling Price (₹)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full" />
                </div>
                <div>
                  <label className="input-label">MRP / Old Price (₹)</label>
                  <input type="number" value={form.mrp || ''} onChange={(e) => setForm({ ...form, mrp: e.target.value })} className="w-full" placeholder="e.g. 50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">Offer Text (Optional)</label>
                  <input value={form.offer || ''} onChange={(e) => setForm({ ...form, offer: e.target.value })} placeholder="e.g., Free Delivery, BOGO" className="w-full" />
                </div>
                <div>
                  <label className="input-label" title="Higher number = Top rank">⭐ Top Priority (Number)</label>
                  <input type="number" value={form.sort_order === 0 ? '' : form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })} placeholder="0" className="w-full" />
                </div>
              </div>
              <div>
                <label className="input-label">Product Image (Optional)</label>
                <div className="flex gap-2 items-center">
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const url = await uploadFile(file, 'products');
                      setForm({ ...form, image: url });
                    }
                  }} className="w-full text-sm text-surface-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-surface-700 file:text-white hover:file:bg-surface-600" />
                  {form.image && (
                    <div className="relative shrink-0">
                      <img src={form.image} className="w-12 h-12 rounded-lg object-cover border border-surface-600" />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, image: '' })}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 shadow-md border-2 border-surface-800"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="input-label mb-3">{t('product_category')}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm({ ...form, category: c })}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-300 border ${
                        form.category === c
                          ? 'bg-brand-500 text-white border-brand-500 shadow-lg shadow-brand-500/30'
                          : 'bg-surface-800/80 text-surface-400 border-surface-600 hover:border-brand-500/50 hover:text-white'
                      }`}
                    >
                      {t(c)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.requires_prescription}
                    onChange={(e) => setForm({ ...form, requires_prescription: e.target.checked })}
                  />
                  <span className="text-sm">{t('requires_prescription')}</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.in_stock}
                    onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
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
