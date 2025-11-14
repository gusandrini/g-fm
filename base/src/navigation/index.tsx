import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '@/screens/Login';
import Cadastro from '@/screens/Cadastro';
import { RootTabs } from './RootTabs';
import Perfil from '@/screens/User';

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Perfil: undefined;
  Tabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="Tabs" component={RootTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
