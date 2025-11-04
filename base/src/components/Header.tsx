import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import { styles } from '@/styles/components/Header';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
}

export function Header({ title, showBack = false, rightIcon, onRightPress }: HeaderProps) {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
          height: theme.sizes.header,
        },
      ]}
    >
      {showBack ? (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconLeft}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconLeft} />
      )}

      {title ? (
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
          {title}
        </Text>
      ) : (
        <View style={{ flex: 1 }} />
      )}

      {rightIcon ? (
        <TouchableOpacity onPress={onRightPress} style={styles.iconRight}>
          <Ionicons name={rightIcon} size={24} color={theme.colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconRight} />
      )}
    </View>
  );
}
