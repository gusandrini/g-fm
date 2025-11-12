import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from '@/screens/Home';
import SobreNos from '@/screens/SobreNos';
import Doar from '@/screens/Doar';
import OngList from '@/screens/OngList';
import HistDoacao from '@/screens/HistDoacao';

export type TabParamList = {
  Home: undefined;
  OngList: undefined;
  Doar: undefined;
  HistDoacao: undefined;
  SobreNos: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const titles: Record<keyof TabParamList, string> = {
  Home: 'Home',
  OngList: 'ONGs',
  Doar: 'Doar',
  HistDoacao: 'Histórico',
  SobreNos: 'Sobre Nós',
};

export function RootTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        title: titles[route.name],
        tabBarIcon: ({ color, size }) => {
          let icon: keyof typeof Ionicons.glyphMap = 'home-outline';
          if (route.name === 'Home') icon = 'home-outline';
          if (route.name === 'OngList') icon = 'people-outline';
          if (route.name === 'Doar') icon = 'heart-outline';
          if (route.name === 'HistDoacao') icon = 'time-outline';
          if (route.name === 'SobreNos') icon = 'information-circle-outline';
          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="OngList" component={OngList} />
      <Tab.Screen name="Doar" component={Doar} />
      <Tab.Screen name="HistDoacao" component={HistDoacao} />
      <Tab.Screen name="SobreNos" component={SobreNos} />
    </Tab.Navigator>
  );
}
