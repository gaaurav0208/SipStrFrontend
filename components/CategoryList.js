import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const CategoryList = ({ categories, selected, onSelect }) => {
  return (
    <View style={styles.container}>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.categoryId}
          onPress={() => onSelect(cat.categoryId)}
          style={[styles.button, selected === cat.categoryId && styles.active]}
        >
          <Text style={styles.text}>{cat.categoryName}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 12,
    justifyContent: 'space-around',
  },
  button: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  active: {
    backgroundColor: '#FF6600',
  },
  text: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default CategoryList;
