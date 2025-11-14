import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

import { styles } from '@/styles/screens/SobreNos';

function getExpoExtra() {
  const expoConfig: any = (Constants as any).expoConfig ?? {};
  if (expoConfig.extra) return expoConfig.extra;

  // fallback pra outros ambientes (web / build)
  const manifest: any = (Constants as any).manifest2 ?? (Constants as any).manifest;
  return manifest?.extra ?? {};
}

export default function SobreNos() {
  const expoConfig: any = (Constants as any).expoConfig ?? {};
  const extra = getExpoExtra();

  const version = expoConfig.version ?? '1.0.0';
  const commitHash = extra.commitHash ?? 'desconhecido';

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: '#F7F8FA' }]}>
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 32 }]}>
        <Text style={[styles.title, { color: '#22C55E' }]}>Sobre Nós</Text>

        <View style={styles.section}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color="#22C55E"
            style={styles.icon}
          />
          <Text style={[styles.text, { color: '#0B1220' }]}>
            Informações sobre a aplicação.
          </Text>
        </View>

        <View style={styles.section}>
          <Ionicons
            name="git-commit-outline"
            size={24}
            color="#22C55E"
            style={styles.icon}
          />
          <View style={{ flex: 1 }}>
            <Text style={[styles.text, { color: '#0B1220' }]}>
              Versão: <Text>{version}</Text>
            </Text>
            <Text style={[styles.text, { color: '#0B1220' }]}>
              Commit: <Text>{commitHash}</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
