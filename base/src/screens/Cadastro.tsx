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

import { UsuarioCreate } from '@/models/usuario';
import { registrarUsuario } from '@/api/auth';

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
      telefone: telefoneTrim || null, // opcional
      idEndereco: null,               // por enquanto sem seleção de endereço
    };

    console.log('[CadastroUsuario] Payload enviado:', payload);

    try {
      setLoading(true);

      const usuarioCriado = await registrarUsuario(payload);
      console.log('[CadastroUsuario] Usuário criado:', usuarioCriado);

      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!', [
        { text: 'OK', onPress: () => navigation.replace('Login') },
      ]);

      setNome('');
      setEmail('');
      setSenha('');
      setTelefone('');
    } catch (error: any) {
      console.log(
        '[CadastroUsuario][ERRO]',
        error?.response?.status,
        error?.response?.data || error?.message
      );

      if (error?.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 400 && data?.detalhes) {
          // Erros de validação do backend (nome/email/senha obrigatórios etc.)
          const detalhes = data.detalhes;
          const mensagens = Object.values(detalhes).join('\n');
          Alert.alert('Erro de validação', mensagens as string);
        } else {
          const msg =
            data?.mensagem ||
            data?.message ||
            data?.error ||
            data?.erro ||
            'Erro desconhecido no servidor.';
          Alert.alert(`Erro ${status}`, msg);
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
      <Modal
        transparent
        visible={loading}
        animationType="fade"
        statusBarTranslucent
      >
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
            <Ionicons
              name="save-outline"
              size={20}
              color={COLORS.primaryText}
            />
            <Text style={styles.buttonText}>Cadastrar Usuário</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
