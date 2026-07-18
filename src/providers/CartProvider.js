'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('egadjet_cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error('Failed to parse cart items', e);
      }
    }
    setLoading(false);
  }, []);

  // Sync cart with localStorage when it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('egadjet_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  const addToCart = (gadget, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.gadget._id === gadget._id);
      if (existing) {
        // Limit quantity to stock
        const newQty = Math.min(gadget.stock, existing.quantity + quantity);
        return prev.map((item) =>
          item.gadget._id === gadget._id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { gadget, quantity: Math.min(gadget.stock, quantity) }];
    });
  };

  const removeFromCart = (gadgetId) => {
    setCartItems((prev) => prev.filter((item) => item.gadget._id !== gadgetId));
  };

  const updateQuantity = (gadgetId, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.gadget._id === gadgetId
          ? { ...item, quantity: Math.max(1, Math.min(item.gadget.stock, quantity)) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.gadget.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
