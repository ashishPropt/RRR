import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageHero from '../components/PageHero';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, subtotal, totalQty, removeItem, updateQty } = useCart();

  return (
    <>
      <Helmet><title>Cart | Regroup Refocus Rebuild</title></Helmet>
      <PageHero title="Your Cart" subtitle="Review your items before checkout" />

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {items.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-7xl mb-6">🛒</div>
              <h2 className="font-heading text-2xl font-bold text-primary mb-3">Your cart is empty</h2>
              <p className="text-gray-500 mb-8">Explore books, boutique items, and more.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/signed-books" className="btn-primary">Shop Books</Link>
                <Link to="/the-boutique" className="btn-outline">Boutique</Link>
                <Link to="/auction-items" className="btn-outline">Auction Items</Link>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Item list */}
              <div className="md:col-span-2 space-y-4">
                <h2 className="font-heading text-xl font-bold text-primary mb-4">
                  {totalQty} Item{totalQty !== 1 ? 's' : ''}
                </h2>
                {items.map(item => (
                  <div key={item.cartKey} className="flex gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl">{item.emoji || '🛍️'}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-heading font-bold text-primary">{item.title}</p>
                      {item.isSigned && (
                        <span className="text-xs text-gold font-semibold">✍️ Personally Signed Copy</span>
                      )}
                      {item.meta && <p className="text-xs text-gray-400 mt-0.5">{item.meta}</p>}
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
                          <button onClick={() => updateQty(item.cartKey, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-100 transition text-gray-600">−</button>
                          <span className="px-3 font-semibold text-sm">{item.quantity}</span>
                          <button onClick={() => updateQty(item.cartKey, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-100 transition text-gray-600">+</button>
                        </div>
                        <button onClick={() => removeItem(item.cartKey)} className="text-red-400 hover:text-red-600 text-sm transition">Remove</button>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-400">${Number(item.price).toFixed(2)} each</p>
                      <p className="font-bold text-primary text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 h-fit">
                <h3 className="font-heading text-lg font-bold text-primary mb-4">Order Summary</h3>
                <div className="space-y-2 mb-4">
                  {items.map(item => (
                    <div key={item.cartKey} className="flex justify-between text-sm text-gray-600">
                      <span className="truncate pr-2">{item.title} × {item.quantity}</span>
                      <span className="flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-3 mb-6">
                  <div className="flex justify-between font-bold text-primary text-lg">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Shipping calculated at checkout</p>
                </div>
                <Link to="/checkout" className="btn-primary block text-center w-full py-3 text-base">
                  Checkout →
                </Link>
                <Link to="/the-boutique" className="block text-center text-sm text-gray-400 hover:text-gray-600 mt-3 transition">
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
