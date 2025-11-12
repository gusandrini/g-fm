import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type IconName = keyof typeof Ionicons.glyphMap;

export function Footer({
  activeScreen,
  items,
}: {
  activeScreen?: string;
  items: { label: string; icon: IconName; screen: string }[];
}) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {items.map((it) => {
        const active = activeScreen === it.screen;
        return (
          <TouchableOpacity
            key={it.screen}
            style={styles.item}
            onPress={() => navigation.navigate(it.screen as never)} // Tabs (Home/SobreNos) ou Stack (Cadastro)
          >
            <Ionicons name={it.icon} size={20} color={active ? '#22C55E' : '#6B7280'} />
            <Text style={[styles.label, { color: active ? '#22C55E' : '#6B7280' }]}>{it.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  item: { alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 12, marginTop: 4 },
});
