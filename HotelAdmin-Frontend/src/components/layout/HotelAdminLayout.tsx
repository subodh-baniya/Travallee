import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import DashboardPage from '../../pages/DashboardPage';
import BookingsPage from '../../pages/BookingsPage';
import GuestsPage from '../../pages/GuestsPage';
import ChatPage from '../../pages/ChatPage';
import ReviewsPage from '../../pages/ReviewsPage';
import EarningsPage from '../../pages/EarningsPage';
import ReportsPage from '../../pages/ReportsPage';
import HotelSettingsPage from '../../pages/HotelSettingsPage';

const HotelAdminLayout: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState('dashboard');

  const navToPage = (page: string) => {
    setCurrentPage(page);
  };

  React.useEffect(() => {
    const elements = document.querySelectorAll('.page');
    elements.forEach(el => el.classList.remove('active'));
    const activeEl = document.getElementById(`page-${currentPage}`);
    if (activeEl) activeEl.classList.add('active');

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    const activeNav = document.querySelector(
      `.nav-item[onclick*="'${currentPage}'"]`
    );
    if (activeNav) activeNav.classList.add('active');
  }, [currentPage]);

  return (
    <>
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">AURVM</div>
          <div className="logo-sub">Hotel Admin</div>
        </div>
        <div className="nav-label">Main</div>
        <div
          className="nav-item active"
          onClick={() => navToPage('dashboard')}
        >
          <span className="icon">■</span> Dashboard
        </div>
        <div className="nav-item" onClick={() => navToPage('reservations')}>
          <span className="icon">▬</span> Reservations
        </div>
        <div className="nav-item" onClick={() => navToPage('guests')}>
          <span className="icon">●</span> Guests
        </div>
        <div className="nav-label">Operations</div>
        <div className="nav-item" onClick={() => navToPage('messages')}>
          <span className="icon">◆</span> Messages{' '}
          <span className="nav-badge">4</span>
        </div>
        <div className="nav-item" onClick={() => navToPage('reviews')}>
          <span className="icon">★</span> Reviews
        </div>
        <div className="nav-label">Business</div>
        <div className="nav-item" onClick={() => navToPage('finance')}>
          <span className="icon">◈</span> Finance
        </div>
        <div className="nav-item" onClick={() => navToPage('reports')}>
          <span className="icon">▲</span> Reports
        </div>
        <div className="nav-item" onClick={() => navToPage('settings')}>
          <span className="icon">≡</span> Settings
        </div>
        <div className="sidebar-footer">
          <div className="user-pill">
            <div className="s-avatar">AK</div>
            <div className="user-info">
              <div className="name">Arjun K.</div>
              <div className="role">Super Admin</div>
            </div>
          </div>
          <button 
            className="logout-btn"
            onClick={() => {
              alert('Logging out...');
              // Add your logout logic here
              // localStorage.removeItem('authToken');
              // window.location.href = '/login';
            }}
            title="Logout"
          >
            <span className="icon">↾</span> Logout
          </button>
          <button 
            className="logout-btn"
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            style={{
              background: isDarkMode ? 'rgba(44, 62, 80, 0.2)' : 'rgba(44, 62, 80, 0.1)',
            }}
          >
            <span className="icon">{isDarkMode ? '☀' : '🌙'}</span> {isDarkMode ? 'Light' : 'Dark'}
          </button>
        </div>
      </aside>

      <main className="main">
        <div className="page active" id="page-dashboard">
          <DashboardPage />
        </div>
        <div className="page" id="page-reservations">
          <BookingsPage />
        </div>
        <div className="page" id="page-guests">
          <GuestsPage />
        </div>
        <div className="page" id="page-messages">
          <ChatPage />
        </div>
        <div className="page" id="page-reviews">
          <ReviewsPage />
        </div>
        <div className="page" id="page-finance">
          <EarningsPage />
        </div>
        <div className="page" id="page-reports">
          <ReportsPage />
        </div>
        <div className="page" id="page-settings">
          <HotelSettingsPage />
        </div>
      </main>
    </>
  );
};

export default HotelAdminLayout;
