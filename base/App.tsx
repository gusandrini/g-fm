import React from 'react';
import { StatusBar } from 'react-native';
import { AppProviders } from '@/providers/AppProviders';
import { AppNavigation } from '@/navigation/AppNavigation';

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <AppProviders>
        <AppNavigation />
      </AppProviders>
    </>
  );
}
