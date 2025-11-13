import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from '../styles/screens/Cadastro';

import { criarUsuario } from '@/api/usuario';
import { UsuarioCreate } from '@/models/usuario';

const COLORS = {
  primary: '#22C55E',
  primaryText: '#FFFFFF',
  background: '#F7F8FA',
  surface: '#FFFFFF',
  text: '#0B1220',
  border: '#E5E7EB',
  mutedText: '#6B7280',
};

export default function CadastroUsuario({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);

  const validarEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSave = useCallback(async () => {
    const nomeTrim = nome.trim();
    const emailTrim = email.trim();
    const senhaTrim = senha.trim();
    const telefoneTrim = telefone.trim();

    if (!nomeTrim || !emailTrim || !senhaTrim) {
      Alert.alert('Erro', 'Nome, e-mail e senha são obrigatórios.');
      return;
    }

    if (!validarEmail(emailTrim)) {
      Alert.alert('Erro', 'E-mail inválido.');
      return;
    }

    const payload: UsuarioCreate = {
      nome: nomeTrim,
      email: emailTrim,
      senha: senhaTrim,
      telefone: telefoneTrim || undefined,
    };

    try {
      setLoading(true);
      await criarUsuario(payload);

      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!', [
        { text: 'OK', onPress: () => navigation.replace('Login') },
      ]);

      setNome('');
      setEmail('');
      setSenha('');
      setTelefone('');
    } catch (error: any) {
      if (error?.response) {
        if (error.response.status === 401) {
          Alert.alert(
            'Não autorizado',
            'Você não tem permissão para realizar esta ação.'
          );
        } else if (error.response.status === 403) {
          Alert.alert('Acesso negado', 'Acesso proibido para este usuário.');
        } else {
          const msg =
            error.response.data?.message ||
            error.response.data?.error ||
            'Erro desconhecido no servidor.';
          Alert.alert(`Erro ${error.response.status}`, msg);
        }
      } else {
        Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
      }
    } finally {
      setLoading(false);
    }
  }, [nome, email, senha, telefone, navigation]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Overlay de carregamento geral */}
      <Modal transparent visible={loading} animationType="fade" statusBarTranslucent>
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cadastrando...</Text>
        </View>
      </Modal>

      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustContentInsets={false}
        >
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Digite seu nome"
            placeholderTextColor={COLORS.mutedText}
            autoCapitalize="words"
            returnKeyType="next"
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            placeholder="exemplo@helplink.com"
            placeholderTextColor={COLORS.mutedText}
            returnKeyType="next"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            textContentType="password"
            placeholder="Digite sua senha"
            placeholderTextColor={COLORS.mutedText}
            returnKeyType="next"
          />

          <Text style={styles.label}>Telefone (opcional)</Text>
          <TextInput
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
            placeholder="(11) 99999-9999"
            placeholderTextColor={COLORS.mutedText}
            returnKeyType="done"
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Ionicons name="save-outline" size={20} color={COLORS.primaryText} />
            <Text style={styles.buttonText}>Cadastrar Usuário</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
