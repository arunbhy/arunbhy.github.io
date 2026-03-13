import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');

    if (isDarkMode) {
      document.documentElement.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
      if (meta) meta.setAttribute('content', '#1a1a1a');
    } else {
      document.documentElement.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
      if (meta) meta.setAttribute('content', '#08415c');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
