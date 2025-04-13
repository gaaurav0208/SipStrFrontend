import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const jsonValue = await AsyncStorage.getItem('cart');
    const cartItems = jsonValue ? JSON.parse(jsonValue) : [];
    setCartCount(cartItems.length);
  };

  const updateCart = async (newCartItems) => {
    setCartCount(newCartItems.length);
    await AsyncStorage.setItem('cart', JSON.stringify(newCartItems));
  };

  return (
    <CartContext.Provider value={{ cartCount, updateCart }}>
      {children}
    </CartContext.Provider>
  );
};
