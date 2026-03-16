import React, { createContext, useState, useContext, useCallback } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [savedCars, setSavedCars] = useState([]);

  const addToCart = useCallback((car) => {
    setCartItems(prev => {
      if (prev.find(item => item.id === car.id)) {
        toast.info('This car is already in your cart');
        return prev;
      }
      toast.success('Added to cart');
      return [...prev, car];
    });
  }, []);

  const removeFromCart = useCallback((carId) => {
    setCartItems(prev => prev.filter(item => item.id !== carId));
    toast.info('Removed from cart');
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const saveForLater = useCallback((car) => {
    setSavedCars(prev => {
      if (prev.find(item => item.id === car.id)) {
        return prev;
      }
      toast.success('Saved for later');
      return [...prev, car];
    });
  }, []);

  const moveToCart = useCallback((car) => {
    setSavedCars(prev => prev.filter(item => item.id !== car.id));
    addToCart(car);
  }, [addToCart]);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const value = {
    cartItems,
    savedCars,
    addToCart,
    removeFromCart,
    clearCart,
    saveForLater,
    moveToCart,
    cartTotal,
    cartCount: cartItems.length
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};