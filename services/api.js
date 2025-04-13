import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://sipstrbackend.onrender.com'; // Change if using a different host

// Function to store token in AsyncStorage
export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

// Function to retrieve token
const getToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

// Generic function to make authenticated requests
const apiRequest = async (endpoint, method = 'GET', body = null) => {
 
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiJkZXZvcHNAZXZvbG90ZWsuYWkiLCJpYXQiOjE3NDQyMTcxMzQsImV4cCI6MTc0NDIyMDczNH0.6sHUpWlsj_vbpNjVZ4Y53-zHcKlNurZbqhRaNXL-OW0`,
  };

  const options = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API request error: ${error}`);
    return null;
  }
};

// Fetch categories
export const fetchCategories = async () => {
  return await apiRequest('/categories');
};

// Example usage in your component
export const fetchProductDetails = async (productId) => {
  return await apiRequest(`/products/${productId}`);
};

export const fetchProductsByCategory = async (categoryId) => {
  if (!categoryId) throw new Error("Category ID is required");

  return await apiRequest(`/category/${categoryId}/products`);
  
};

export const fetchStores = async () => {
  return await apiRequest(`/stores`);
};
