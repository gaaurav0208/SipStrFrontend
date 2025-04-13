import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ProductCard = ({ item, isFavorite, variant, onFavoriteToggle, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{item.productName}</Text>
        <Text style={styles.brand}>{item.brand}</Text>
        <Text style={styles.price}>From ${Math.min(...item.variantsDTO.map(v => v.unitPrice)).toFixed(2)}</Text>
        <TouchableOpacity onPress={() => onFavoriteToggle(variant.variantId)}>
          <Text style={[styles.favorite, isFavorite && styles.favorited]}>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: '#fff', margin: 10, padding: 10, borderRadius: 8, elevation: 3 },
  image: { width: '100%', height: 100, borderRadius: 6 },
  details: { marginTop: 10 },
  name: { fontSize: 16, fontWeight: 'bold' },
  brand: { fontSize: 14, color: 'gray' },
  price: { fontSize: 16, color: '#FF6600', fontWeight: '600' },
  favorite: { fontSize: 18, textAlign: 'right', marginTop: 5 },
  favorited: { color: 'red' }
});

export default ProductCard;
