import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  timeout: 10000,
  withCredentials: true,
});

// Request interceptor - add token to every request
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Failed to retrieve token from SecureStore:', error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 (Unauthorized) - token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Clear expired token
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userData');
        await AsyncStorage.removeItem('token');
        
        // Trigger logout or redirect to login
        // This can be enhanced with an event emitter or context update
        console.warn('Token expired - user should be logged out');
        
        return Promise.reject(error);
      } catch (cleanupError) {
        console.error('Error clearing auth data:', cleanupError);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
