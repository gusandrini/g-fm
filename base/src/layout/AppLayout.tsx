import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Ionicons } from '@expo/vector-icons';

interface AppLayoutProps {
  title?: string;
  children: ReactNode;
  activeScreen?: string;
  showBack?: boolean;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
}

export function AppLayout({
  title,
  children,
  activeScreen,
  showBack = false,
  rightIcon,
  onRightPress,
}: AppLayoutProps) {
  return (
    <View style={styles.container}>
      <Header title={title} showBack={showBack} rightIcon={rightIcon} onRightPress={onRightPress} />

      <View style={styles.content}>{children}</View>

      <Footer
        activeScreen={activeScreen}
        items={[
          { label: 'Home', icon: 'home-outline', screen: 'Home' },
          { label: 'Sobre', icon: 'information-circle-outline', screen: 'SobreNos' },
          { label: 'Perfil', icon: 'person-outline', screen: 'Cadastro' },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  content: { flex: 1 },
});
