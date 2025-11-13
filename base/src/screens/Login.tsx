import React, { useState } from 'react';
import {
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

import { useSession } from '@/services/SessionProvider';
import { styles } from '@/styles/screens/Login';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function Login() {
  const navigation = useNavigation<Nav>();
  const { login } = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
  console.log("[Login] handleLogin chamado com:", email);

  if (!email.trim() || !password.trim()) {
    Alert.alert('Atenção', 'Preencha todos os campos');
    return;
  }

  try {
    setLoading(true);
    const ok = await login(email, password);

    console.log("[Login] Resultado do login:", ok);

    if (!ok) {
      Alert.alert('Erro', 'Email ou senha inválidos');
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'Tabs' }],
    });
  } catch (err: any) {
    console.error('Erro no login:', err);

    if (axios.isAxiosError(err)) {
      if (err.message?.includes('timeout')) {
        Alert.alert(
          'Erro de conexão',
          'Tempo de conexão esgotado. Verifique se a API está rodando e se a URL está correta.'
        );
      } else if (err.response?.status === 500) {
        Alert.alert('Erro no Servidor', 'Erro interno do servidor. Tente novamente mais tarde.');
      } else if (err.response?.status === 401) {
        Alert.alert('Erro', 'Email ou senha inválidos');
      } else {
        Alert.alert('Erro', 'Erro de conexão. Verifique sua internet/API.');
      }
    } else {
      Alert.alert('Erro', 'Erro inesperado. Tente novamente.');
    }
  } finally {
    setLoading(false);
  }
}


  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#F7F8FA' }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: '#22C55E' }]}>Login</Text>
        <Text style={[styles.subtitle, { color: '#0B1220' }]}>Entre com suas credenciais</Text>

        <View style={[styles.inputContainer, { borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }]}>
          <Ionicons name="mail-outline" size={20} color="#22C55E" style={styles.icon} />
          <TextInput
            style={[styles.input, { color: '#0B1220' }]}
            placeholder="Email"
            placeholderTextColor="#6B7280"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={[styles.inputContainer, { borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }]}>
          <Ionicons name="lock-closed-outline" size={20} color="#22C55E" style={styles.icon} />
          <TextInput
            style={[styles.input, { color: '#0B1220' }]}
            placeholder="Senha"
            placeholderTextColor="#6B7280"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#22C55E' }]}
          onPress={handleLogin}
          activeOpacity={0.85}
          disabled={loading}
        >
          <Ionicons name="log-in-outline" size={22} color="#FFFFFF" />
          <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Entrar</Text>
        </TouchableOpacity>

        {/* 👉 Link para Cadastro (mesmo Stack) */}
        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')} style={{ marginTop: 12 }}>
          <Text style={{ color: '#2563EB', textAlign: 'center' }}>
            Não tem conta? Cadastrar
          </Text>
        </TouchableOpacity>
      </View>

      <Modal transparent visible={loading} animationType="fade">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22C55E" />
          <Text style={[styles.loadingText, { color: '#fff' }]}>Carregando...</Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
