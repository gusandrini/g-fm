import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

import { useTheme } from '@/context/ThemeContext';
import { useI18n } from '@/i18n/I18nProvider';
import { styles } from '@/styles/screens/SobreNos';

export default function SobreNos() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useI18n();

  const version = Constants.expoConfig?.version ?? '1.0.0';
  const commitHash = (Constants.expoConfig as any)?.extra?.commitHash ?? 'desconhecido';

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      {/* Header e Footer já são globais via Navigation (RootTabs) */}

      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 32 }]}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>{t('about.title')}</Text>

        <View style={styles.section}>
          <Ionicons name="information-circle-outline" size={24} color={theme.colors.primary} style={styles.icon} />
          <Text style={[styles.text, { color: theme.colors.text }]}>
            {t('about.description')}
          </Text>
        </View>

        <View style={styles.section}>
          <Feather name="phone" size={24} color={theme.colors.primary} style={styles.icon} />
          <Text style={[styles.text, { color: theme.colors.text }]}>
            {t('about.phone')}: +55 11 3181-8188
          </Text>
        </View>

        <View style={styles.section}>
          <MaterialIcons name="email" size={24} color={theme.colors.primary} style={styles.icon} />
          <Text style={[styles.text, { color: theme.colors.text }]}>
            {t('about.email')}: mottu@empresa.com.br
          </Text>
        </View>

        <View style={styles.section}>
          <Ionicons name="time-outline" size={24} color={theme.colors.primary} style={styles.icon} />
          <View>
            <Text style={[styles.text, { color: theme.colors.text }]}>{t('about.hours.title')}</Text>
            <Text style={[styles.text, { color: theme.colors.text }]}>{t('about.hours.weekdays')}</Text>
            <Text style={[styles.text, { color: theme.colors.text }]}>{t('about.hours.saturday')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Ionicons name="git-commit-outline" size={24} color={theme.colors.primary} style={styles.icon} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.text, { color: theme.colors.text }]}>
              {t('about.version') ?? 'Versão'}: <Text>{version}</Text>
            </Text>
            <Text style={[styles.text, { color: theme.colors.text }]}>
              {t('about.commit') ?? 'Commit'}: <Text>{commitHash}</Text>
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.backButton,
            { borderColor: theme.colors.primary, backgroundColor: theme.colors.surface },
          ]}
          onPress={() => navigation.navigate('Home' as never)}
          activeOpacity={0.85}
        >
          <Ionicons name="arrow-back-outline" size={20} color={theme.colors.text} />
          <Text style={[styles.buttonText, { color: theme.colors.text }]}>
            {t('about.actions.backHome')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
