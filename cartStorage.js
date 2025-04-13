// utils/cartStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_KEY = 'cart';

export const getCart = async () => {
  const jsonValue = await AsyncStorage.getItem(CART_KEY);
  return jsonValue != null ? JSON.parse(jsonValue) : [];
};

export const addToCart = async (product) => {
  const existingCart = await getCart();
  const updatedCart = [...existingCart, product];
  await AsyncStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
};

export const clearCart = async () => {
  await AsyncStorage.removeItem(CART_KEY);
};

export const removeFromCart = async (productId) => {
  const existingCart = await getCart();
  const updatedCart = existingCart.filter((item) => item.id !== productId);
  await AsyncStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
};
