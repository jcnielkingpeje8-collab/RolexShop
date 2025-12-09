import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product, color) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedColor === color);
      if (existing) {
        if(existing.qty + 1 > product.stock) return prev; // Check stock
        return prev.map(item => item.id === product.id && item.selectedColor === color ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, selectedColor: color, qty: 1 }];
    });
  };

  const updateQty = (id, color, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.selectedColor === color) {
        const newQty = item.qty + delta;
        return (newQty > 0 && newQty <= item.stock) ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id, color) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedColor === color)));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);