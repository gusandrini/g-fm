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
import { SafeAreaView } from 'react-native-safe-area-context'; // ✅ IMPORT CORRETO

// se já tem seus styles em outro arquivo, mantenha o import:
// import { styles } from '@/styles/screens/Cadastro';

const COLORS = {
  primary: '#22C55E',
  primaryText: '#FFFFFF',
  background: '#F7F8FA',
  surface: '#FFFFFF',
  text: '#0B1220',
  border: '#E5E7EB',
  mutedText: '#6B7280',
};

// se não estiver importando de um arquivo externo, use este fallback:
const styles = {
  container: { flex: 1, backgroundColor: COLORS.background } as const,
  keyboard: { flex: 1 } as const,
  content: { paddingHorizontal: 16, paddingVertical: 20 } as const,
  label: { marginTop: 12, fontSize: 16, fontWeight: '500', color: COLORS.text } as const,
  input: {
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginTop: 6,
    borderColor: COLORS.border, backgroundColor: COLORS.surface, color: COLORS.text,
  } as const,
  button: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: 24, paddingVertical: 12, borderRadius: 10, backgroundColor: COLORS.primary,
  } as const,
  buttonText: { fontWeight: 'bold', marginLeft: 8, fontSize: 15, color: COLORS.primaryText } as const,
  loadingOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24,
  } as const,
  loadingText: { marginTop: 12, fontSize: 16, fontWeight: '600', textAlign: 'center', color: '#FFFFFF' } as const,
};

export default function CadastroFuncionario({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [emailCorporativo, setEmailCorporativo] = useState('');
  const [senha, setSenha] = useState('');
  const [cargo, setCargo] = useState('');
  const [idFilial, setIdFilial] = useState('');
  const [loading, setLoading] = useState(false);

  const validarEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSave = useCallback(async () => {
    const nomeTrim = nome.trim();
    const emailTrim = emailCorporativo.trim();
    const senhaTrim = senha.trim();
    const cargoTrim = cargo.trim();

    if (!nomeTrim || !emailTrim || !senhaTrim || !cargoTrim) {
      Alert.alert('Erro', 'Todos os campos obrigatórios devem ser preenchidos.');
      return;
    }
    if (!validarEmail(emailTrim)) {
      Alert.alert('Erro', 'E-mail inválido.');
      return;
    }

    const idFilialNumber = idFilial ? Number(idFilial) : 0;
    if (idFilial && Number.isNaN(idFilialNumber)) {
      Alert.alert('Erro', 'ID da Filial deve ser numérico.');
      return;
    }

    const payload = {
      idFuncionario: 0,
      idFilial: idFilialNumber,
      nome: nomeTrim,
      emailCorporativo: emailTrim,
      senhaHash: senhaTrim,
      cargo: cargoTrim,
    };

    try {
      setLoading(true);
      // await addFuncionario(payload); // reative sua chamada
      Alert.alert('Sucesso', 'Funcionário cadastrado com sucesso!', [
        { text: 'OK', onPress: () => navigation.replace('Login') },
      ]);
      setNome(''); setEmailCorporativo(''); setSenha(''); setCargo(''); setIdFilial('');
    } catch (error: any) {
      if (error?.response) {
        if (error.response.status === 401) {
          Alert.alert('Não autorizado', 'Você não tem permissão para realizar esta ação.');
        } else if (error.response.status === 403) {
          Alert.alert('Acesso negado', 'Acesso proibido para este usuário.');
        } else {
          const msg = error.response.data?.message || error.response.data?.error || 'Erro desconhecido no servidor.';
          Alert.alert(`Erro ${error.response.status}`, msg);
        }
      } else {
        Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
      }
    } finally {
      setLoading(false);
    }
  }, [nome, emailCorporativo, senha, cargo, idFilial, navigation]);

  return (
    // ✅ SafeAreaView com edges para respeitar topo/rodapé (notch e barras)
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Overlay de carregamento */}
      <Modal transparent visible={loading} animationType="fade" statusBarTranslucent>
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Salvando...</Text>
        </View>
      </Modal>

      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // ajuste se seu header custom mudar
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
            placeholder="Digite o nome"
            placeholderTextColor={COLORS.mutedText}
            autoCapitalize="words"
            returnKeyType="next"
          />

          <Text style={styles.label}>E-mail corporativo</Text>
          <TextInput
            style={styles.input}
            value={emailCorporativo}
            onChangeText={setEmailCorporativo}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            placeholder="exemplo@empresa.com"
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
            placeholder="Digite a senha"
            placeholderTextColor={COLORS.mutedText}
            returnKeyType="done"
          />

          <Text style={styles.label}>Cargo</Text>
          <TextInput
            style={styles.input}
            value={cargo}
            onChangeText={setCargo}
            placeholder="Digite o cargo"
            placeholderTextColor={COLORS.mutedText}
            autoCapitalize="sentences"
            returnKeyType="next"
          />

          <Text style={styles.label}>ID da Filial (opcional)</Text>
          <TextInput
            style={styles.input}
            value={idFilial}
            onChangeText={setIdFilial}
            keyboardType="numeric"
            placeholder="Ex: 1"
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
            <Text style={styles.buttonText}>Salvar Funcionário</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
