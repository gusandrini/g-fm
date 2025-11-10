import React, { PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SessionProvider } from '@/services/SessionProvider';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <SessionProvider>
        {children}
      </SessionProvider>
    </SafeAreaProvider>
  );
}
