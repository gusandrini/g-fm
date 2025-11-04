import React from 'react';
import { StatusBar } from 'react-native';
import { AppProviders } from '@/providers/AppProviders';
import { AppNavigation } from '@/navigation/AppNavigation';
import { useTheme } from '@/context/ThemeContext';

function Root() {
  const { theme, isDark } = useTheme();
  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.surface}
      />
      <AppNavigation />
    </>
  );
}

export default function App() {
  return (
    <AppProviders>
      <Root />
    </AppProviders>
  );
}
