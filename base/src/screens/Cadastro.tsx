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

import { useTheme } from '@/context/ThemeContext';
import { useI18n } from '@/i18n/I18nProvider';

import { FuncionarioCad } from '@/models/funcionarioCad';
import { addFuncionario } from '@/api/funcionario';

import { styles } from '@/styles/screens/Cadastro';

export default function CadastroFuncionario({ navigation }: any) {
  const { theme } = useTheme();
  const { t } = useI18n();

  const [nome, setNome] = useState('');
  const [emailCorporativo, setEmailCorporativo] = useState('');
  const [senha, setSenha] = useState('');
  const [cargo, setCargo] = useState('');
  const [idFilial, setIdFilial] = useState('');
  const [loading, setLoading] = useState(false);

  const validarEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSave = async () => {
    if (!nome || !emailCorporativo || !senha || !cargo) {
      Alert.alert(t('employeeForm.alerts.errorTitle'), t('employeeForm.alerts.required'));
      return;
    }
    if (!validarEmail(emailCorporativo)) {
      Alert.alert(t('employeeForm.alerts.errorTitle'), t('employeeForm.alerts.invalidEmail'));
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
      Alert.alert(t('employeeForm.alerts.successTitle'), t('employeeForm.alerts.created'), [
        { text: t('common.ok'), onPress: () => navigation.replace('Login') },
      ]);
      setNome('');
      setEmailCorporativo('');
      setSenha('');
      setCargo('');
      setIdFilial('');
    } catch (error: any) {
      if (error?.response) {
        if (error.response.status === 401) {
          Alert.alert(t('employeeForm.alerts.unauthorizedTitle'), t('employeeForm.alerts.unauthorizedMsg'));
        } else if (error.response.status === 403) {
          Alert.alert(t('employeeForm.alerts.forbiddenTitle'), t('employeeForm.alerts.forbiddenMsg'));
        } else {
          const msg =
            error.response.data?.message ||
            error.response.data?.error ||
            t('employeeForm.alerts.unknownServerError');
          Alert.alert(`${t('employeeForm.alerts.errorCode')} ${error.response.status}`, msg);
        }
      } else {
        Alert.alert(t('employeeForm.alerts.errorTitle'), t('employeeForm.alerts.cannotConnect'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* overlay de carregamento */}
      <Modal transparent visible={loading}>
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            {t('employeeForm.loading')}
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
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {t('employeeForm.labels.name')}
          </Text>
          <TextInput
            style={[
              styles.input,
              { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: theme.colors.surface },
            ]}
            value={nome}
            onChangeText={setNome}
            placeholder={t('employeeForm.placeholders.name')}
            placeholderTextColor={theme.colors.mutedText}
          />

          {/* Email corporativo */}
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {t('employeeForm.labels.corpEmail')}
          </Text>
          <TextInput
            style={[
              styles.input,
              { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: theme.colors.surface },
            ]}
            value={emailCorporativo}
            onChangeText={setEmailCorporativo}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder={t('employeeForm.placeholders.corpEmail')}
            placeholderTextColor={theme.colors.mutedText}
          />

          {/* Senha */}
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {t('employeeForm.labels.password')}
          </Text>
          <TextInput
            style={[
              styles.input,
              { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: theme.colors.surface },
            ]}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            placeholder={t('employeeForm.placeholders.password')}
            placeholderTextColor={theme.colors.mutedText}
          />

          {/* Cargo */}
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {t('employeeForm.labels.role')}
          </Text>
          <TextInput
            style={[
              styles.input,
              { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: theme.colors.surface },
            ]}
            value={cargo}
            onChangeText={setCargo}
            placeholder={t('employeeForm.placeholders.role')}
            placeholderTextColor={theme.colors.mutedText}
          />

          {/* Id Filial (opcional) */}
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {t('employeeForm.labels.branchIdOptional')}
          </Text>
          <TextInput
            style={[
              styles.input,
              { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: theme.colors.surface },
            ]}
            value={idFilial}
            onChangeText={setIdFilial}
            keyboardType="numeric"
            placeholder={t('employeeForm.placeholders.branchId')}
            placeholderTextColor={theme.colors.mutedText}
          />

          {/* Botão salvar */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Ionicons name="save" size={20} color={theme.colors.primaryText} />
            <Text style={[styles.buttonText, { color: theme.colors.primaryText }]}>
              {t('employeeForm.actions.saveEmployee')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
