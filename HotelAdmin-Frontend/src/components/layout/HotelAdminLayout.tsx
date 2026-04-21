import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

const HotelAdminLayout: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: '■', section: 'Main' },
    { id: 'reservations', path: '/reservations', label: 'Reservations', icon: '▬', section: 'Main' },
    { id: 'guests', path: '/guests', label: 'Guests', icon: '●', section: 'Main' },
    { id: 'messages', path: '/messages', label: 'Messages', icon: '◆', section: 'Operations', badge: '4' },
    { id: 'reviews', path: '/reviews', label: 'Reviews', icon: '★', section: 'Operations' },
    { id: 'finance', path: '/finance', label: 'Finance', icon: '◈', section: 'Business' },
    { id: 'reports', path: '/reports', label: 'Reports', icon: '▲', section: 'Business' },
    { id: 'settings', path: '/settings', label: 'Settings', icon: '≡', section: 'Business' },
  ];

  const sections = ['Main', 'Operations', 'Business'];
  
  // Get current page label from URL
  const getCurrentLabel = () => {
    const currentItem = navItems.find((item) => location.pathname.endsWith(item.path));
    return currentItem?.label || 'Dashboard';
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark bg-slate-900' : 'bg-slate-50'}`}>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        } border-r transition-all duration-300 flex flex-col overflow-y-auto fixed h-screen z-50`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <div className={`text-2xl font-bold font-playfair ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {sidebarOpen ? 'TRAVALLEE' : 'T'}
            </div>
            {sidebarOpen && (
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Hotel Admin</div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {sections.map((section) => (
            <div key={section}>
              {sidebarOpen && (
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-3 py-2 mt-4 first:mt-0">
                  {section}
                </div>
              )}
              {navItems
                .filter((item) => item.section === section)
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname.endsWith(item.path)
                        ? isDarkMode
                          ? 'bg-slate-700 text-blue-400'
                          : 'bg-slate-100 text-slate-900'
                        : isDarkMode
                        ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-100'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {sidebarOpen && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-700">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              AK
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">Admin</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Super Admin</div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={toggleDarkMode}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode
                  ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              <span className="text-lg">{isDarkMode ? '☀️' : '🌙'}</span>
              {sidebarOpen && <span>{isDarkMode ? 'Light' : 'Dark'}</span>}
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/login', { replace: true });
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
            >
              <span className="text-lg">↾</span>
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ml-64 flex flex-col overflow-hidden transition-all duration-300`}>
        {/* Top Bar */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'hover:bg-slate-700 text-slate-400'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <span className="text-2xl">☰</span>
          </button>
          <h1 className={`text-2xl font-bold font-playfair ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {getCurrentLabel()}
          </h1>
          <div />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default HotelAdminLayout;
