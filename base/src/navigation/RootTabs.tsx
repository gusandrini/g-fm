import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

// Screens
import Home from '@/screens/Home';
import SobreNos from '@/screens/SobreNos';
import Cadastro from '@/screens/Cadastro';

// Header personalizado
import { Header } from '@/components/Header';

const Tab = createBottomTabNavigator();

export function RootTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <Header title={route.name} />, // Header global
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: theme.sizes.footer,
          paddingBottom: 4,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.mutedText,
        tabBarIcon: ({ color, size }) => {
          let icon: keyof typeof Ionicons.glyphMap = 'home-outline';
          if (route.name === 'SobreNos') icon = 'information-circle-outline';
          if (route.name === 'Cadastro') icon = 'person-outline';
          return <Ionicons name={icon} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="SobreNos" component={SobreNos} options={{ title: 'Sobre Nós' }} />
      <Tab.Screen name="Cadastro" component={Cadastro} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}
