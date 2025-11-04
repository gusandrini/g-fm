import React, { useState } from 'react';
import {
  StyleSheet,
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
import { useSession } from '../services/SessionProvider';
import { useTheme } from '../context/ThemeContext';
import { scheduleLoginNotification } from '@/Notificacao';
import { useI18n } from '@/i18n/I18nProvider';

export default function Login({ navigation }: any) {
  const { login } = useSession();
  const { theme, toggleTheme } = useTheme();
  const { t, locale, setLocale } = useI18n();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert(t('login.alerts.warningTitle'), t('login.alerts.fillFields'));
      return;
    }

    try {
      setLoading(true);
      const ok = await login(email, password);

      if (!ok) {
        Alert.alert(t('login.alerts.invalidTitle'), t('login.alerts.invalidMessage'));
        return;
      }

      scheduleLoginNotification();
      navigation.replace('Home');
    } catch (err: any) {
      console.error('Erro no login:', err);

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          Alert.alert(t('login.alerts.invalidTitle'), t('login.alerts.invalidMessage'));
        } else if (err.response?.status === 500) {
          Alert.alert(t('login.alerts.serverErrorTitle'), t('login.alerts.serverErrorMessage'));
        } else {
          Alert.alert(t('login.alerts.errorTitle'), t('login.alerts.connectionError'));
        }
      } else {
        Alert.alert(t('login.alerts.errorTitle'), t('login.alerts.unexpectedError'));
      }
    } finally {
      setLoading(false);
    }
  }

  function toggleLanguage() {
    const nextLocale = locale === 'pt-BR' ? 'es-ES' : 'pt-BR';
    setLocale(nextLocale);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.primary }]}>{t('login.title')}</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>{t('login.subtitle')}</Text>

        <View style={[styles.inputContainer, { borderColor: theme.primary }]}>
          <Ionicons name="mail-outline" size={20} color={theme.primary} style={styles.icon} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder={t('login.placeholders.email')}
            placeholderTextColor="#888"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={[styles.inputContainer, { borderColor: theme.primary }]}>
          <Ionicons name="lock-closed-outline" size={20} color={theme.primary} style={styles.icon} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder={t('login.placeholders.password')}
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleLogin}
          activeOpacity={0.85}
        >
          <Ionicons name="log-in-outline" size={22} color="#fff" />
          <Text style={styles.buttonText}>{t('login.actions.enter')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('CadastroFuncionario')}
        >
          <Text style={[styles.registerText, { color: theme.primary }]}>
            {t('login.actions.register')}
          </Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, gap: 12 }}>
          {/* Botão de tema */}
          <TouchableOpacity style={styles.themeButton} onPress={toggleTheme} activeOpacity={0.7}>
            <Ionicons
              name={theme.background === '#000' ? 'sunny-outline' : 'moon-outline'}
              size={18}
              color={theme.text}
            />
            <Text style={[styles.themeText, { color: theme.text }]}>
              {theme.background === '#000'
                ? t('home.theme.lightMode')
                : t('home.theme.darkMode')}
            </Text>
          </TouchableOpacity>

          {/* Botão de idioma */}
          <TouchableOpacity style={styles.themeButton} onPress={toggleLanguage} activeOpacity={0.7}>
            <Ionicons name="language-outline" size={18} color={theme.text} />
            <Text style={[styles.themeText, { color: theme.text }]}>
              {locale === 'pt-BR'
                ? t('home.language.portugueseShort')
                : t('home.language.spanishShort')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal transparent visible={loading} animationType="fade">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            {t('login.loading')}
          </Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', padding: 32 },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 18,
    height: 52,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, fontSize: 16, height: '100%' },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    elevation: 2,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600', marginLeft: 8 },
  registerButton: { marginTop: 18, alignItems: 'center' },
  registerText: { fontSize: 15, fontWeight: '500' },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  themeText: { marginLeft: 6, fontSize: 14 },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#757575',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 18,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
