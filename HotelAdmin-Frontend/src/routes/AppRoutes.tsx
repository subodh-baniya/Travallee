import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginPage from '../pages/LoginPage';
import HotelAdminLayout from '../components/layout/HotelAdminLayout';
import DashboardPage from '../pages/DashboardPage';
import BookingsPage from '../pages/BookingsPage';
import GuestsPage from '../pages/GuestsPage';
import ChatPage from '../pages/ChatPage';
import ReviewsPage from '../pages/ReviewsPage';
import EarningsPage from '../pages/EarningsPage';
import ReportsPage from '../pages/ReportsPage';
import HotelSettingsPage from '../pages/HotelSettingsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { token } = useAuth();
  
  return (
    <Routes>
      {/* Login route - no protection needed */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Root route - redirect based on auth state */}
      <Route 
        path="/" 
        element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
      />
      
      {/* Protected admin routes with layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HotelAdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="reservations" element={<BookingsPage />} />
        <Route path="guests" element={<GuestsPage />} />
        <Route path="messages" element={<ChatPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="finance" element={<EarningsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<HotelSettingsPage />} />
      </Route>
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
