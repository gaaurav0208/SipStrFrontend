import { useEffect, useState } from 'react';
import { Text, FlatList, StyleSheet, ActivityIndicator, View } from 'react-native';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fetchCategories, fetchProductsByCategory } from '../services/api';
import CategoryList from '../components/CategoryList';
import ProductCard from '../components/ProductCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const CategoryScreen = () => {
  const navigation = useNavigation();
const [selectedCategory, setSelectedCategory] = useState(null);
const [favorites, setFavorites] = useState({});

const { data: categories = [], isLoading: loadingCategories, error: categoryError } = useQuery({
  queryKey: ['categories'],
  queryFn: fetchCategories,
});

useEffect(() => {
  if (!selectedCategory && categories.length > 0) {
    setSelectedCategory(categories[0].categoryId);
  }
}, [categories, selectedCategory]);

const {
  data,
  isLoading: loadingProducts,
  error: productError,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ['products', selectedCategory],
  queryFn: ({ pageParam = 0 }) => fetchProductsByCategory(selectedCategory, pageParam),
  getNextPageParam: (lastPage, pages) => lastPage.totalPages > pages.length ? pages.length : undefined,
  enabled: !!selectedCategory,
});

const toggleFavorite = (id) => {
  setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
};
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      {loadingCategories ? (
        <ActivityIndicator size="large" color="#FF6600" />
      ) : categoryError ? (
        <Text style={styles.error}>Failed to load categories.</Text>
      ) : (
        <CategoryList categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
      )}
      {selectedCategory && (
        <>
          <Text style={styles.subtitle}>
            {categories.find((cat) => cat.categoryId === selectedCategory)?.categoryName || 'Category'}
          </Text>
          {loadingProducts ? (
            <ActivityIndicator size="small" color="#FF6600" />
          ) : productError ? (
            <Text style={styles.error}>Failed to load products.</Text>
          ) : (
            <FlatList
              data={data?.pages.flatMap((page) => page.content.flatMap(product => product.variantsDTO.map(variant => ({ ...product, variant })))) || []}
              keyExtractor={(item) => `${item.productId}-${item.variant.variantId}`}
              numColumns={2}
              renderItem={({ item }) => (
                <ProductCard
                  item={item}
                  variant={item.variant}
                  isFavorite={!!favorites[item.variant.variantId]}
                  onFavoriteToggle={toggleFavorite}
                  onPress={() => {
                    navigation.navigate('ProductDetailScreen', { product: item, variant: item.variant });
                  }}
                />
              )}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              contentContainerStyle={{ paddingBottom: 50, gap: 12 }}
              onEndReached={() => {
                if (hasNextPage) fetchNextPage();
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" color="#FF6600" /> : null}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { fontSize: 18, fontWeight: '600', marginVertical: 12 },
  error: { color: 'red', marginVertical: 10 },
});

export default CategoryScreen;