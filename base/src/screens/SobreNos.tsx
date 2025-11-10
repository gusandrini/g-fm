import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

import { styles } from '@/styles/screens/SobreNos';

export default function SobreNos() {
  const navigation = useNavigation();

  const version = Constants.expoConfig?.version ?? '1.0.0';
  const commitHash = (Constants.expoConfig as any)?.extra?.commitHash ?? 'desconhecido';

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: '#F7F8FA' }]}>
      {/* Header e Footer já são globais via Navigation (RootTabs) */}

      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 32 }]}>
        <Text style={[styles.title, { color: '#22C55E' }]}>Sobre Nós</Text>

        <View style={styles.section}>
          <Ionicons name="information-circle-outline" size={24} color="#22C55E" style={styles.icon} />
          <Text style={[styles.text, { color: '#0B1220' }]}>
            Informações sobre a aplicação.
          </Text>
        </View>

        <View style={styles.section}>
          <Feather name="phone" size={24} color="#22C55E" style={styles.icon} />
          <Text style={[styles.text, { color: '#0B1220' }]}>
            Telefone: +55 11 3181-8188
          </Text>
        </View>

        <View style={styles.section}>
          <MaterialIcons name="email" size={24} color="#22C55E" style={styles.icon} />
          <Text style={[styles.text, { color: '#0B1220' }]}>
            Email: mottu@empresa.com.br
          </Text>
        </View>

        <View style={styles.section}>
          <Ionicons name="time-outline" size={24} color="#22C55E" style={styles.icon} />
          <View>
            <Text style={[styles.text, { color: '#0B1220' }]}>Horário de Atendimento</Text>
            <Text style={[styles.text, { color: '#0B1220' }]}>Segunda a Sexta: 9h às 18h</Text>
            <Text style={[styles.text, { color: '#0B1220' }]}>Sábado: 9h às 13h</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Ionicons name="git-commit-outline" size={24} color="#22C55E" style={styles.icon} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.text, { color: '#0B1220' }]}>
              Versão: <Text>{version}</Text>
            </Text>
            <Text style={[styles.text, { color: '#0B1220' }]}>
              Commit: <Text>{commitHash}</Text>
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.backButton,
            { borderColor: '#22C55E', backgroundColor: '#FFFFFF' },
          ]}
          onPress={() => navigation.navigate('Home' as never)}
          activeOpacity={0.85}
        >
          <Ionicons name="arrow-back-outline" size={20} color="#0B1220" />
          <Text style={[styles.buttonText, { color: '#0B1220' }]}>
            Voltar para Home
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
