import React, { useState, useEffect, useContext } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchProductDetails, fetchStores } from '../services/api';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isStoreClosedToday } from '../utils/store';
import { CartContext } from '../components/CartProvider';

const CART_KEY = 'cart';
const SIZES = ['Small', 'Medium', 'Large', 'Extra Large'];

const ProductDetailScreen = ({ navigation, route }) => {
  const productId = route?.params?.product?.productId;
  const [isInCart, setIsInCart] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(route?.params?.variant);
  const [selectedSize, setSelectedSize] = useState(SIZES[0]);
  const [quantity, setQuantity] = useState(0);
  const [selectedStore, setSelectedStore] = useState(null);
  const { updateCart } = useContext(CartContext);

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductDetails(productId),
  });

  const { data: stores, isLoading: storesLoading } = useQuery({
    queryKey: ['stores'],
    queryFn: fetchStores,
  });

  useEffect(() => {
    if (stores && stores.length > 0) {
      const firstOpenStore = stores.find((store) => !isStoreClosedToday(store));
      if (firstOpenStore) {
        setSelectedStore(firstOpenStore.storeName);
      }
    }
  }, [stores]);

  useEffect(() => {
    const fetchCartQuantity = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(CART_KEY);
        const cart = jsonValue != null ? JSON.parse(jsonValue) : [];
        const existingItem = cart.find(item => item.id === selectedVariant?.variantId);
        if (existingItem) {
          setQuantity(existingItem.quantity);
          setSelectedSize(existingItem.size);
          setSelectedStore(existingItem.store);
          setIsInCart(true);
        } else {
          setQuantity(0);
          setSelectedSize(SIZES[0]);
          setIsInCart(false);
        }
      } catch (e) {
        console.error('Error loading quantity from cart:', e);
      }
    };
    if (selectedVariant) fetchCartQuantity();
  }, [selectedVariant]);

  // 🔄 Update size in cart
  useEffect(() => {
    const updateSizeInCart = async () => {
      if (!isInCart || quantity === 0) return;
      try {
        const jsonValue = await AsyncStorage.getItem(CART_KEY);
        const cart = jsonValue != null ? JSON.parse(jsonValue) : [];
        const updatedCart = cart.map((item) =>
          item.id === selectedVariant.variantId
            ? { ...item, size: selectedSize }
            : item
        );
        await AsyncStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
        updateCart(updatedCart);
      } catch (e) {
        console.error('Error updating size in cart:', e);
      }
    };
    updateSizeInCart();
  }, [selectedSize]);

  // 🔄 Update store in cart
  useEffect(() => {
    const updateStoreInCart = async () => {
      if (!isInCart || quantity === 0) return;
      try {
        const jsonValue = await AsyncStorage.getItem(CART_KEY);
        const cart = jsonValue != null ? JSON.parse(jsonValue) : [];
        const updatedCart = cart.map((item) =>
          item.id === selectedVariant.variantId
            ? { ...item, store: selectedStore }
            : item
        );
        await AsyncStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
        updateCart(updatedCart);
      } catch (e) {
        console.error('Error updating store in cart:', e);
      }
    };
    updateStoreInCart();
  }, [selectedStore]);

  const updateQuantity = async (newQty) => {
    if (newQty === 0) {
      const jsonValue = await AsyncStorage.getItem(CART_KEY);
      const cart = jsonValue != null ? JSON.parse(jsonValue) : [];
      const updatedCart = cart.filter(item => item.id !== selectedVariant.variantId);
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
      updateCart(updatedCart);
      setQuantity(0);
      setIsInCart(false);
      return;
    }

    const jsonValue = await AsyncStorage.getItem(CART_KEY);
    const existingCart = jsonValue != null ? JSON.parse(jsonValue) : [];

    const updatedItem = {
      id: selectedVariant.variantId,
      name: `${product.productName} - ${selectedVariant.packageName}`,
      price: selectedVariant.unitPrice,
      quantity: newQty,
      size: selectedSize,
      store: selectedStore,
      image: product.image,
    };

    const withoutSameProduct = existingCart.filter((item) => item.id !== selectedVariant.variantId);
    const newCart = [...withoutSameProduct, updatedItem];

    await AsyncStorage.setItem(CART_KEY, JSON.stringify(newCart));
    updateCart(newCart);
    setQuantity(newQty);
    setIsInCart(true);
  };

  if (productLoading || storesLoading) return <Text>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        <TouchableOpacity style={styles.favoriteIcon}>
          <Ionicons name="heart-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Text style={styles.name}>{product.productName}</Text>
      <Text style={styles.price}>${selectedVariant.unitPrice.toFixed(2)}</Text>

      <Text style={styles.sectionTitle}>Select Size</Text>
      <View style={styles.sizeRow}>
        {SIZES.map((size) => (
          <TouchableOpacity
            key={size}
            onPress={() => setSelectedSize(size)}
            style={[styles.sizeButton, selectedSize === size && styles.selectedSize]}>
            <Text>{size}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Select Quantity</Text>
      {quantity === 0 ? (
        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={() => updateQuantity(1)}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.quantityRow}>
          <TouchableOpacity onPress={() => updateQuantity(Math.max(0, quantity - 1))} style={styles.qtyBtn}>
            <Text>-</Text>
          </TouchableOpacity>
          <Text>{quantity}</Text>
          <TouchableOpacity onPress={() => updateQuantity(quantity + 1)} style={styles.qtyBtn}>
            <Text>+</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.sectionTitle}>Select Store</Text>
      {stores.map((store, idx) => {
        const isClosed = isStoreClosedToday(store);
        return (
          <TouchableOpacity
            key={idx}
            onPress={() => !isClosed && setSelectedStore(store.storeName)}
            style={[
              styles.storeCard,
              selectedStore === store.storeName && styles.selectedStore,
              isClosed && styles.closedStore,
            ]}
            disabled={isClosed}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.storeName}>{store.storeName}</Text>
              <Text>Rating: {store.rating}</Text>
            </View>
            <Text style={styles.storeMeta}>Delivery Radius: {store.deliveryRadiusKm} km</Text>
            <Text style={styles.storeMeta}>Min Order: ${store.minimumOrderAmount.toFixed(2)}</Text>
            <Text style={styles.storeMeta}>Accepting Orders: {store.isCurrentlyAcceptingOrders ? 'Yes' : 'No'}</Text>
          </TouchableOpacity>
        );
      })}

      <View style={styles.detailsGrid}>
        <View style={styles.detailBox}><Text style={styles.details}>Volume: {selectedVariant.volume}</Text></View>
        <View style={styles.detailBox}><Text style={styles.details}>Brand: {product.brand}</Text></View>
        <View style={styles.detailBox}><Text style={styles.details}>Alcohol Content: {product.alcoholByVolume}%</Text></View>
        <View style={styles.detailBox}><Text style={styles.details}>Category: {product.categoryName}</Text></View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  imageContainer: { borderWidth: 1, borderColor: '#000', padding: 16, alignItems: 'center', borderRadius: 10 },
  image: { width: 150, height: 200 },
  favoriteIcon: { position: 'absolute', top: 8, right: 8 },
  name: { fontSize: 20, fontWeight: 'bold', marginTop: 16 },
  price: { fontSize: 18, marginBottom: 10 },
  sectionTitle: { fontWeight: 'bold', marginVertical: 10 },
  sizeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sizeButton: { padding: 8, borderWidth: 1, borderRadius: 8, marginRight: 8 },
  selectedSize: { backgroundColor: '#ffe0cc', borderColor: '#FF6600' },
  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginVertical: 8 },
  qtyBtn: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6 },
  addToCartBtn: { backgroundColor: '#FF6600', padding: 14, borderRadius: 30, marginVertical: 16, alignItems: 'center' },
  addToCartText: { color: '#fff', fontWeight: 'bold' },
  storeCard: { borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 8, borderColor: '#ccc' },
  selectedStore: { backgroundColor: '#ffe0cc', borderColor: '#FF6600' },
  closedStore: { backgroundColor: '#f0f0f0', borderColor: '#aaa', opacity: 0.5 },
  storeName: { fontWeight: 'bold' },
  storeMeta: { color: '#444', fontSize: 12 },
  detailsGrid: { marginTop: 20, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  detailBox: { width: '48%', padding: 10, backgroundColor: '#f5f5f5', borderRadius: 8, marginBottom: 10 },
  details: { fontSize: 14, textAlign: 'center' },
});

export default ProductDetailScreen;
