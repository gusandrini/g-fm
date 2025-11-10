import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
}

export function Header({ title, showBack = false, rightIcon, onRightPress }: HeaderProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconLeft}>
          <Ionicons name="arrow-back" size={24} color="#0B1220" />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconLeft} />
      )}

      {title ? (
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      ) : (
        <View style={{ flex: 1 }} />
      )}

      {rightIcon ? (
        <TouchableOpacity onPress={onRightPress} style={styles.iconRight}>
          <Ionicons name={rightIcon} size={24} color="#0B1220" />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconRight} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    height: 56,
    paddingHorizontal: 16,
  },
  iconLeft: {
    width: 40,
    alignItems: 'flex-start',
  },
  iconRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#0B1220',
    textAlign: 'center',
  },
});
