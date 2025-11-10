import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface FooterItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  screen: string;
}

interface FooterProps {
  items: FooterItem[];
  activeScreen?: string;
}

export function Footer({ items, activeScreen }: FooterProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const isActive = item.screen === activeScreen;
        return (
          <TouchableOpacity
            key={item.label}
            style={styles.item}
            onPress={() => navigation.navigate(item.screen as never)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={isActive ? '#22C55E' : '#0B1220'}
            />
            <Text
              style={[
                styles.label,
                { color: isActive ? '#22C55E' : '#6B7280' },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    height: 64,
    paddingBottom: 4,
    paddingTop: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
});
