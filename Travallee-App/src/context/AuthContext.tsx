import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAxiosError } from 'axios';
import apiClient from '@/src/services/apiClient';
import { API_ENDPOINTS_AUTH } from '@/src/constants/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignOut: boolean; 
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignOut, setIsSignOut] = useState(false);

  const checkAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) {
        setUser(null);
        setIsSignOut(true);
        return;
      }
      // Token is automatically added by apiClient interceptor
      const response = await apiClient.get(API_ENDPOINTS_AUTH.USER_PROFILE);

      if (response.status === 200) {
        const userData = response.data?.data;
        setUser(userData);
        await SecureStore.setItemAsync('userData', JSON.stringify(userData));
        setIsSignOut(false);
      }
    } catch (error: any) {
      const status = isAxiosError(error) ? error.response?.status : undefined;

      // Only clear session for real auth failures (expired/invalid token).
      if (status === 401 || status === 403) {
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userData');
        await AsyncStorage.removeItem('token');
        setUser(null);
        setIsSignOut(true);
      } else {
        const cachedUser = await SecureStore.getItemAsync('userData');
        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
          setIsSignOut(false);
        } else {
          setUser(null);
          setIsSignOut(true);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

 

  const logout = async () => {
    setIsLoading(true);
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
      await AsyncStorage.removeItem('token');
      setUser(null);
      setIsSignOut(true);
    } catch (error: any) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

 

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSignOut,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
