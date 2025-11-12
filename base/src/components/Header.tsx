import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type IconName = keyof typeof Ionicons.glyphMap;

export function Header({
  title,
  showBack = false,
  rightIcon,
  onRightPress,
}: {
  title?: string;
  showBack?: boolean;
  rightIcon?: IconName;
  onRightPress?: () => void;
}) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.side}>
          <Ionicons name="chevron-back" size={22} color="#0B1220" />
        </TouchableOpacity>
      ) : (
        <View style={styles.side} />
      )}

      <Text style={styles.title}>{title || ''}</Text>

      {rightIcon ? (
        <TouchableOpacity onPress={onRightPress} style={styles.side}>
          <Ionicons name={rightIcon} size={22} color="#0B1220" />
        </TouchableOpacity>
      ) : (
        <View style={styles.side} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: { width: 56, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#0B1220' },
});
