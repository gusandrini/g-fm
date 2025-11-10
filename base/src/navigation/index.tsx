import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { RootTabs } from './RootTabs';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#22C55E',
    background: '#F7F8FA',
    card: '#FFFFFF',
    text: '#0B1220',
    border: '#E5E7EB',
    notification: '#22C55E',
  },
};

export function AppNavigation() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <RootTabs />
    </NavigationContainer>
  );
}
