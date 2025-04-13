import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Screens
import CategoryScreen from './screens/CategoryScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CartScreen from './screens/CartScreen';
import {CartProvider, CartContext} from './components/CartProvider';

const HomeScreen = () => <Text style={styles.pageContent}>Home</Text>;
const SearchScreen = () => <Text style={styles.pageContent}>Search</Text>;
const ProfileScreen = () => <Text style={styles.pageContent}>Profile</Text>;

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();
export const Header = ({ navigation }) => {
  const { cartCount } = useContext(CartContext);

  return (
    <View style={styles.header}>
      <Text style={styles.greeting}>Hi Guest User!</Text>
      
      <TouchableOpacity onPress={() => navigation.navigate('CartScreen')} style={styles.cartContainer}>
        <Ionicons name="cart-outline" size={28} color="#FF6600" />
        {cartCount > -1 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const ScreenWithLayout = ({ children, navigation }) => (
  <View style={{ flex: 1 }}>
    <Header navigation={navigation} />
    <View style={{ flex: 1 }}>{children}</View>
    <FooterTabs navigation={navigation} />
  </View>
);

const FooterTabs = ({ navigation }) => (
  <View style={styles.footerTabs}>
    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
      <Ionicons name="home-outline" size={24} color="#FF6600" />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('Search')}>
      <Ionicons name="search-outline" size={24} color="#FF6600" />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
      <Ionicons name="grid-outline" size={24} color="#FF6600" />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
      <Ionicons name="person-outline" size={24} color="#FF6600" />
    </TouchableOpacity>
  </View>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
       <CartProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home">
            {({ navigation }) => (
              <ScreenWithLayout navigation={navigation}>
                <HomeScreen />
              </ScreenWithLayout>
            )}
          </Stack.Screen>
          <Stack.Screen name="Search">
            {({ navigation }) => (
              <ScreenWithLayout navigation={navigation}>
                <SearchScreen />
              </ScreenWithLayout>
            )}
          </Stack.Screen>
          <Stack.Screen name="Categories">
            {({ navigation }) => (
              <ScreenWithLayout navigation={navigation}>
                <CategoryScreen />
              </ScreenWithLayout>
            )}
          </Stack.Screen>
          <Stack.Screen name="Profile">
            {({ navigation }) => (
              <ScreenWithLayout navigation={navigation}>
                <ProfileScreen />
              </ScreenWithLayout>
            )}
          </Stack.Screen>
          <Stack.Screen name="ProductDetailScreen">
            {({ navigation, route }) => (
              <ScreenWithLayout navigation={navigation}>
                <ProductDetailScreen navigation={navigation} route={route} />
              </ScreenWithLayout>
            )}
          </Stack.Screen>
          <Stack.Screen name="CartScreen">
            {({ navigation }) => (
              <ScreenWithLayout navigation={navigation}>
                <CartScreen navigation={navigation} />
              </ScreenWithLayout>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      </CartProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 64,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF6600',
  },
  cartContainer: {
    position: 'relative',
    padding: 6,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF6600',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footerTabs: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  pageContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
  },
});
