import React, { useState, useCallback } from 'react';
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

const COLORS = {
  primary: '#22C55E',
  primaryText: '#FFFFFF',
  background: '#F7F8FA',
  text: '#0B1220',
  mutedText: '#6B7280',
  border: '#E5E7EB',
  link: '#2563EB',
};

export default function Login() {
  const navigation = useNavigation<Nav>();
  const { login } = useSession(); // <- SessionProvider.login(email, senha)

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validarEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleLogin = useCallback(async () => {
    const emailTrim = email.trim();
    const passwordTrim = password.trim();

    console.log('[Login] handleLogin chamado com:', emailTrim);

    if (!emailTrim || !passwordTrim) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    if (!validarEmail(emailTrim)) {
      Alert.alert('Atenção', 'Informe um e-mail válido.');
      return;
    }

    try {
      setLoading(true);

      // SessionProvider deve chamar /auth/login usando UsuarioLoginDTO
      const ok = await login(emailTrim, passwordTrim);

      console.log('[Login] Resultado do login:', ok);

      if (!ok) {
        Alert.alert('Erro', 'Email ou senha inválidos.');
        return;
      }

      // Login OK → reseta pilha e vai para as Tabs
      navigation.reset({
        index: 0,
        routes: [{ name: 'Tabs' }],
      });
    } catch (err: any) {
      console.error('[Login][ERRO]', err);

      if (axios.isAxiosError(err)) {
        if (err.message?.includes('timeout')) {
          Alert.alert(
            'Erro de conexão',
            'Tempo de conexão esgotado. Verifique se a API está rodando e se a URL está correta.'
          );
        } else if (err.response) {
          const status = err.response.status;
          const data: any = err.response.data;

          console.log('[Login][ERRO][API]', status, data);

          const msgBackend =
            data?.mensagem ||
            data?.message ||
            data?.error ||
            data?.erro ||
            'Erro desconhecido no servidor.';

          if (status === 401) {
            Alert.alert(
              'Erro de autenticação',
              msgBackend || 'Email ou senha inválidos.'
            );
          } else if (status === 400) {
            Alert.alert('Erro de validação', msgBackend);
          } else if (status === 500) {
            Alert.alert(
              'Erro no servidor',
              'Erro interno do servidor. Tente novamente mais tarde.'
            );
          } else {
            Alert.alert(`Erro ${status}`, msgBackend);
          }
        } else {
          Alert.alert('Erro', 'Erro de conexão. Verifique sua internet/API.');
        }
      } else {
        Alert.alert('Erro', 'Erro inesperado. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }, [email, password, login, navigation]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: COLORS.background }]}
    >
      <View style={styles.container}>
        <Text style={[styles.title, { color: COLORS.primary }]}>Login</Text>
        <Text style={[styles.subtitle, { color: COLORS.text }]}>
          Entre com suas credenciais
        </Text>

        <View
          style={[
            styles.inputContainer,
            { borderColor: COLORS.border, backgroundColor: '#FFFFFF' },
          ]}
        >
          <Ionicons
            name="mail-outline"
            size={20}
            color={COLORS.primary}
            style={styles.icon}
          />
          <TextInput
            style={[styles.input, { color: COLORS.text }]}
            placeholder="Email"
            placeholderTextColor={COLORS.mutedText}
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
            { borderColor: COLORS.border, backgroundColor: '#FFFFFF' },
          ]}
        >
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={COLORS.primary}
            style={styles.icon}
          />
          <TextInput
            style={[styles.input, { color: COLORS.text }]}
            placeholder="Senha"
            placeholderTextColor={COLORS.mutedText}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: COLORS.primary }]}
          onPress={handleLogin}
          activeOpacity={0.85}
          disabled={loading}
        >
          <Ionicons
            name="log-in-outline"
            size={22}
            color={COLORS.primaryText}
          />
          <Text
            style={[styles.buttonText, { color: COLORS.primaryText }]}
          >
            Entrar
          </Text>
        </TouchableOpacity>

        {/* Link para Cadastro */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Cadastro')}
          style={{ marginTop: 12 }}
          disabled={loading}
        >
          <Text style={{ color: COLORS.link, textAlign: 'center' }}>
            Não tem conta? Cadastrar
          </Text>
        </TouchableOpacity>
      </View>

      <Modal transparent visible={loading} animationType="fade">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={[styles.loadingText, { color: '#fff' }]}>
            Carregando...
          </Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
