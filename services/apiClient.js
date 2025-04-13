import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const login = {
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiJkZXZvcHNAZXZvbG90ZWsuYWkiLCJpYXQiOjE3NDQyMTYwNTUsImV4cCI6MTc0NDIxOTY1NX0.imdigsgW0-WRBCex5qpqETEiR57NAZsYqjvOlQ5P2Xw",
    "expiresIn": 3600000
  };

const apiClient = axios.create({
    baseURL: 'http://localhost:8080', // Change to your actual backend URL
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Attach token dynamically before each request
apiClient.interceptors.request.use(async (config) => {
    try {
        await AsyncStorage.setItem('authToken', login.token);

        const token = await AsyncStorage.getItem('authToken'); // Retrieve token before request
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error('Error retrieving token:', error);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;
