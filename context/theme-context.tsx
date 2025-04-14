import { createContext, useContext, useState, ReactNode } from 'react';
import { colors } from '../constants/colors';

type ThemeContextType = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  colors: typeof colors;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // In a real app, we would have different color sets for light and dark themes
  const themeColors = colors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}