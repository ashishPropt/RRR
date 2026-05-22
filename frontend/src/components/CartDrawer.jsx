import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { items, totalQty, subtotal, drawerOpen, setDrawerOpen, removeItem, updateQty } = useCart();

  return (
    <>
      {/* Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-primary text-white">
          <h2 className="font-heading text-lg font-bold">
            Your Cart {totalQty > 0 && <span className="ml-2 bg-accent text-white text-xs px-2 py-0.5 rounded-full">{totalQty}</span>}
          </h2>
          <button onClick={() => setDrawerOpen(false)} className="text-white/80 hover:text-white text-2xl leading-none">×</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">🛒</div>
              <p className="font-semibold">Your cart is empty</p>
              <p className="text-sm mt-1">Add items to get started</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.cartKey} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                {/* Image / icon */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">{item.emoji || '🛍️'}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-primary text-sm leading-tight truncate">{item.title}</p>
                  {item.isSigned && <span className="text-xs text-gold font-semibold">✍️ Signed Copy</span>}
                  {item.meta && <p className="text-xs text-gray-400">{item.meta}</p>}

                  <div className="flex items-center justify-between mt-2">
                    {/* Qty stepper */}
                    <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQty(item.cartKey, item.quantity - 1)}
                        className="px-2 py-0.5 text-gray-500 hover:bg-gray-100 transition text-sm"
                      >−</button>
                      <span className="px-2 text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.cartKey, item.quantity + 1)}
                        className="px-2 py-0.5 text-gray-500 hover:bg-gray-100 transition text-sm"
                      >+</button>
                    </div>
                    <span className="font-bold text-primary text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.cartKey)}
                  className="text-gray-300 hover:text-red-400 transition text-lg self-start mt-0.5 flex-shrink-0"
                  title="Remove"
                >×</button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-4 py-4 border-t border-gray-100 bg-white">
            <div className="flex justify-between mb-4 text-sm">
              <span className="text-gray-500">Subtotal ({totalQty} item{totalQty !== 1 ? 's' : ''})</span>
              <span className="font-bold text-primary text-lg">${subtotal.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={() => setDrawerOpen(false)}
              className="btn-primary w-full text-center block text-base py-3"
            >
              Proceed to Checkout →
            </Link>
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-full mt-2 text-sm text-gray-400 hover:text-gray-600 transition"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
