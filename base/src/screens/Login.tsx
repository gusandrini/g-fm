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

export default function Login({ navigation }: any) {
  const { login } = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      const ok = await login(email, password);

      if (!ok) {
        Alert.alert('Erro', 'Email ou senha inválidos');
        return;
      }

      navigation.replace('Home');
    } catch (err: any) {
      console.error('Erro no login:', err);

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          Alert.alert('Erro', 'Email ou senha inválidos');
        } else if (err.response?.status === 500) {
          Alert.alert('Erro no Servidor', 'Erro interno do servidor. Tente novamente mais tarde.');
        } else {
          Alert.alert('Erro', 'Erro de conexão. Verifique sua internet.');
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

        <View
          style={[
            styles.inputContainer,
            { borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' },
          ]}
        >
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

        <View
          style={[
            styles.inputContainer,
            { borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' },
          ]}
        >
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
          <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
            Entrar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('Cadastro')}
        >
          <Text style={[styles.registerText, { color: '#22C55E' }]}>
            Cadastrar
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
