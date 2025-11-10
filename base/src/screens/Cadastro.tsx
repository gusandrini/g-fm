import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  View,
  Modal,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { FuncionarioCad } from '@/models/funcionarioCad';
import { addFuncionario } from '@/api/funcionario';

import { styles } from '@/styles/screens/Cadastro';

export default function CadastroFuncionario({ navigation }: any) {

  const [nome, setNome] = useState('');
  const [emailCorporativo, setEmailCorporativo] = useState('');
  const [senha, setSenha] = useState('');
  const [cargo, setCargo] = useState('');
  const [idFilial, setIdFilial] = useState('');
  const [loading, setLoading] = useState(false);

  const validarEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSave = async () => {
    if (!nome || !emailCorporativo || !senha || !cargo) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }
    if (!validarEmail(emailCorporativo)) {
      Alert.alert('Erro', 'Email inválido');
      return;
    }

    const payload: FuncionarioCad = {
      idFuncionario: 0,
      idFilial: idFilial ? Number(idFilial) : 0,
      nome,
      emailCorporativo,
      senhaHash: senha,
      cargo,
    };

    try {
      setLoading(true);
      await addFuncionario(payload);
      Alert.alert('Sucesso', 'Funcionário cadastrado com sucesso', [
        { text: 'OK', onPress: () => navigation.replace('Login') },
      ]);
      setNome('');
      setEmailCorporativo('');
      setSenha('');
      setCargo('');
      setIdFilial('');
    } catch (error: any) {
      if (error?.response) {
        if (error.response.status === 401) {
          Alert.alert('Erro', 'Não autorizado');
        } else if (error.response.status === 403) {
          Alert.alert('Erro', 'Acesso negado');
        } else {
          const msg =
            error.response.data?.message ||
            error.response.data?.error ||
            'Erro desconhecido do servidor';
          Alert.alert(`Erro ${error.response.status}`, msg);
        }
      } else {
        Alert.alert('Erro', 'Não foi possível conectar ao servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#F7F8FA' }]}>
      {/* overlay de carregamento */}
      <Modal transparent visible={loading}>
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#22C55E" />
          <Text style={[styles.loadingText, { color: '#0B1220' }]}>
            Carregando...
          </Text>
        </View>
      </Modal>

      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Nome */}
          <Text style={[styles.label, { color: '#0B1220' }]}>
            Nome
          </Text>
          <TextInput
            style={[
              styles.input,
              { borderColor: '#E5E7EB', color: '#0B1220', backgroundColor: '#FFFFFF' },
            ]}
            value={nome}
            onChangeText={setNome}
            placeholder="Nome completo"
            placeholderTextColor="#6B7280"
          />

          {/* Email corporativo */}
          <Text style={[styles.label, { color: '#0B1220' }]}>
            Email Corporativo
          </Text>
          <TextInput
            style={[
              styles.input,
              { borderColor: '#E5E7EB', color: '#0B1220', backgroundColor: '#FFFFFF' },
            ]}
            value={emailCorporativo}
            onChangeText={setEmailCorporativo}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="email@empresa.com"
            placeholderTextColor="#6B7280"
          />

          {/* Senha */}
          <Text style={[styles.label, { color: '#0B1220' }]}>
            Senha
          </Text>
          <TextInput
            style={[
              styles.input,
              { borderColor: '#E5E7EB', color: '#0B1220', backgroundColor: '#FFFFFF' },
            ]}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            placeholder="Senha"
            placeholderTextColor="#6B7280"
          />

          {/* Cargo */}
          <Text style={[styles.label, { color: '#0B1220' }]}>
            Cargo
          </Text>
          <TextInput
            style={[
              styles.input,
              { borderColor: '#E5E7EB', color: '#0B1220', backgroundColor: '#FFFFFF' },
            ]}
            value={cargo}
            onChangeText={setCargo}
            placeholder="Cargo"
            placeholderTextColor="#6B7280"
          />

          {/* Id Filial (opcional) */}
          <Text style={[styles.label, { color: '#0B1220' }]}>
            ID Filial (Opcional)
          </Text>
          <TextInput
            style={[
              styles.input,
              { borderColor: '#E5E7EB', color: '#0B1220', backgroundColor: '#FFFFFF' },
            ]}
            value={idFilial}
            onChangeText={setIdFilial}
            keyboardType="numeric"
            placeholder="ID da Filial"
            placeholderTextColor="#6B7280"
          />

          {/* Botão salvar */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#22C55E' }]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Ionicons name="save" size={20} color="#FFFFFF" />
            <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
              Salvar Funcionário
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
