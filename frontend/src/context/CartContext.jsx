import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'rrr_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal  = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const addItem = (item) => {
    // item: { id, type, title, price, isSigned, image, meta }
    setItems(prev => {
      const key = item.isSigned ? `${item.id}-signed` : item.id;
      const existing = prev.find(x => (x.isSigned ? `${x.id}-signed` : x.id) === key);
      if (existing) {
        return prev.map(x =>
          (x.isSigned ? `${x.id}-signed` : x.id) === key
            ? { ...x, quantity: x.quantity + 1 }
            : x
        );
      }
      return [...prev, { ...item, quantity: 1, cartKey: key }];
    });
    setDrawerOpen(true);
  };

  const removeItem = (cartKey) => setItems(prev => prev.filter(x => x.cartKey !== cartKey));

  const updateQty = (cartKey, qty) => {
    if (qty < 1) return removeItem(cartKey);
    setItems(prev => prev.map(x => x.cartKey === cartKey ? { ...x, quantity: qty } : x));
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{
      items, totalQty, subtotal,
      drawerOpen, setDrawerOpen,
      addItem, removeItem, updateQty, clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
