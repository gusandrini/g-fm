import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { styles } from '@/styles/components/Footer';

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
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: theme.sizes.footer,
        },
      ]}
    >
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
              color={isActive ? theme.colors.primary : theme.colors.text}
            />
            <Text
              style={[
                styles.label,
                { color: isActive ? theme.colors.primary : theme.colors.mutedText },
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
