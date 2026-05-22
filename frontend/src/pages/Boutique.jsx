import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PageHero from '../components/PageHero';
import { productsApi } from '../services/api';
import { useCart } from '../context/CartContext';

const fallbackProducts = [
  { id: '1', name: 'RRR Motivational Mug', description: 'Start your morning with intention. "Regroup. Refocus. Rebuild." ceramic mug.', price: 18.99, category: 'Accessories', emoji: '☕' },
  { id: '2', name: 'Resilience Journal', description: 'A guided journal for single parents with prompts designed to foster reflection and growth.', price: 22.99, category: 'Journals', emoji: '📓' },
  { id: '3', name: 'RRR Tote Bag', description: 'Durable canvas tote with the Regroup Refocus Rebuild logo — carry your rebuild with pride.', price: 24.99, category: 'Accessories', emoji: '👜' },
  { id: '4', name: 'Affirmation Card Deck', description: '52 affirmation cards for single parents — one for every week of your rebuilding year.', price: 16.99, category: 'Wellness', emoji: '🃏' },
  { id: '5', name: 'RRR T-Shirt', description: 'Soft, comfortable tee featuring the RRR motto. Available in multiple sizes.', price: 28.99, category: 'Apparel', emoji: '👕' },
  { id: '6', name: 'Gratitude Planner', description: 'A 90-day planner combining daily scheduling with gratitude practice for intentional living.', price: 26.99, category: 'Journals', emoji: '📅' },
];

export default function Boutique() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [added, setAdded] = useState({});
  const { addItem } = useCart();

  useEffect(() => {
    productsApi.getAll().then(r => {
      setProducts(r.data.length > 0 ? r.data : fallbackProducts);
    }).catch(() => setProducts(fallbackProducts)).finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];
  const filtered = filter === 'All' ? products : products.filter(p => p.category === filter);

  const handleAdd = (product) => {
    addItem({
      id: product.id,
      type: 'product',
      title: product.name,
      price: Number(product.price),
      image: product.image_url || null,
      emoji: product.emoji || '🛍️',
    });
    setAdded(a => ({ ...a, [product.id]: true }));
    setTimeout(() => setAdded(a => ({ ...a, [product.id]: false })), 1500);
  };

  return (
    <>
      <Helmet><title>The Boutique | Regroup Refocus Rebuild</title></Helmet>
      <PageHero title="The Boutique" subtitle="Shop RRR Merchandise" />

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          {/* Category filter */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  filter === cat ? 'bg-accent text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading products...</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map(product => (
                <div key={product.id} className="card group">
                  <div className="h-52 bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center overflow-hidden">
                    {product.image_url
                      ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      : <span className="text-7xl">{product.emoji || '🛍️'}</span>}
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-semibold text-accent uppercase tracking-widest">{product.category}</span>
                    <h3 className="font-heading text-xl font-bold text-primary mt-1 mb-2">{product.name}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">${Number(product.price).toFixed(2)}</span>
                      <button
                        onClick={() => handleAdd(product)}
                        className={`py-2 px-4 text-sm font-semibold rounded transition-all ${
                          added[product.id]
                            ? 'bg-green-500 text-white'
                            : 'bg-accent hover:bg-accent-dark text-white'
                        }`}
                      >
                        {added[product.id] ? '✓ Added!' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-16 bg-accent/10 rounded-2xl p-8 text-center border border-accent/20">
            <p className="text-primary font-semibold text-lg mb-2">Custom Orders Welcome</p>
            <p className="text-gray-600 text-sm mb-4">Looking for branded items for your organization or event? Contact us for bulk orders.</p>
            <a href="/contact" className="btn-primary text-sm">Get a Custom Quote</a>
          </div>
        </div>
      </section>
    </>
  );
}
