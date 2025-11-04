import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, type Theme } from '@/theme/theme';

type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setDark: (on: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('isDarkTheme');
        if (saved !== null) setIsDark(saved === 'true');
      } catch (e) {
        console.log('Erro ao carregar tema salvo:', e);
      }
    })();
  }, []);

  const setDark = async (on: boolean) => {
    try {
      setIsDark(on);
      await AsyncStorage.setItem('isDarkTheme', String(on));
    } catch (e) {
      console.log('Erro ao salvar tema:', e);
    }
  };

  const toggleTheme = () => setDark(!isDark);

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};
