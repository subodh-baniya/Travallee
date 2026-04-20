import React, { createContext, useState, useEffect, useCallback } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      // Dark mode colors - better contrast
      root.style.setProperty('--bg', '#1a1a2e');
      root.style.setProperty('--surface', '#16213e');
      root.style.setProperty('--surface2', '#0f3460');
      root.style.setProperty('--border', '#533483');
      root.style.setProperty('--accent', '#00d4ff');
      root.style.setProperty('--accent-light', '#00e6ff');
      root.style.setProperty('--text', '#e8f4f8');
      root.style.setProperty('--muted', '#a8b8c8');
    } else {
      // Light mode colors - professional
      root.style.setProperty('--bg', '#f5f5f5');
      root.style.setProperty('--surface', '#ffffff');
      root.style.setProperty('--surface2', '#f9f9f9');
      root.style.setProperty('--border', '#e0e0e0');
      root.style.setProperty('--accent', '#2c3e50');
      root.style.setProperty('--accent-light', '#34495e');
      root.style.setProperty('--text', '#2c3e50');
      root.style.setProperty('--muted', '#7f8c8d');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
