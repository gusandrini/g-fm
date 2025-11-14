import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useSession } from '@/services/SessionProvider';

export default function User() {
  const navigation = useNavigation();
  const { user, logout } = useSession() as any;

  const handleLogout = useCallback(async () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout?.();
            navigation.navigate('Login' as never);
          } catch (err) {
            console.error('Erro ao fazer logout:', err);
            Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
          }
        },
      },
    ]);
  }, [logout, navigation]);

  // Monta pares label/valor de forma defensiva, sem assumir exatamente o modelo
  const userFields = (() => {
    if (!user) return [];

    const u: any = user;

    const pairs: { label: string; value?: string }[] = [
      { label: 'Nome', value: u.nome || u.name || u.fullName },
      { label: 'E-mail', value: u.email || u.emailUsuario || u.emailCorporativo },
      { label: 'CPF', value: u.cpf },
      { label: 'Telefone', value: u.telefone || u.celular },
      { label: 'Tipo de usuário', value: u.tipoUsuario || u.role || u.perfil },
      { label: 'ID', value: String(u.idUsuario ?? u.id ?? u.userId ?? '') || undefined },
    ];

    // filtra só os que realmente têm valor
    return pairs.filter(f => !!f.value);
  })();

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Meu Perfil</Text>
        <Text style={styles.subtitle}>
          Veja seus dados cadastrados e gerencie sua sessão.
        </Text>

        {!user && (
          <View style={styles.card}>
            <Text style={styles.infoText}>
              Você não está logado no momento. Faça login para visualizar seus dados.
            </Text>

            <TouchableOpacity
              style={[styles.button, { marginTop: 16 }]}
              onPress={() => navigation.navigate('Login' as never)}
            >
              <Ionicons name="log-in-outline" size={18} color="#FFFFFF" />
              <Text style={styles.buttonText}>Ir para Login</Text>
            </TouchableOpacity>
          </View>
        )}

        {user && (
          <>
            <View style={styles.card}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={36} color="#FFFFFF" />
              </View>

              <Text style={styles.userName}>
                {(user as any).nome ||
                  (user as any).name ||
                  (user as any).fullName ||
                  'Usuário'}
              </Text>

              {(user as any).email && (
                <Text style={styles.userEmail}>{(user as any).email}</Text>
              )}
              {(user as any).emailUsuario && !((user as any).email) && (
                <Text style={styles.userEmail}>{(user as any).emailUsuario}</Text>
              )}
              {(user as any).emailCorporativo && !((user as any).email) && !((user as any).emailUsuario) && (
                <Text style={styles.userEmail}>{(user as any).emailCorporativo}</Text>
              )}
            </View>

            {userFields.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Dados da conta</Text>

                {userFields.map(field => (
                  <View key={field.label} style={styles.row}>
                    <Text style={styles.rowLabel}>{field.label}</Text>
                    <Text style={styles.rowValue}>{field.value}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.card}>
              <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>
                Sessão
              </Text>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#EF4444' }]}
                onPress={handleLogout}
              >
                <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
                <Text style={styles.buttonText}>Sair da conta</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B1220',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0B1220',
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
  },
  infoText: {
    fontSize: 14,
    color: '#4B5563',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B1220',
    marginBottom: 8,
  },
  row: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  rowLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  rowValue: {
    fontSize: 14,
    color: '#111827',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#22C55E',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
