// AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CategoryScreen from './screens/CategoryScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Categories" component={CategoryScreen} />
    <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} />
  </Stack.Navigator>
);

export default AppNavigator;
