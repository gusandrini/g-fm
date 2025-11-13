import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Doacao } from '@/models/doacao';
import { getDoacoes } from '@/api/doacao';
import { styles } from '@/styles/screens/HistDoacao';
import { useSession } from '@/services/SessionProvider';

export default function HistDoacao() {
  const { user } = useSession();
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDoacoes = async () => {
    try {
      setError(null);

      // Busca todas as doações
      const data = await getDoacoes();

      // Se tiver usuário logado, filtra por usuarioId
      const filtradas = user?.idUsuario
        ? data.filter((d) => d.usuarioId === user.idUsuario)
        : data;

      setDoacoes(filtradas);
    } catch (err: any) {
      console.error('Erro ao carregar doações:', err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Erro ao carregar histórico de doações. Verifique sua conexão.';
      setError(errorMessage);

      if (err?.response?.status === 401) {
        Alert.alert('Erro', 'Sessão expirada. Faça login novamente.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDoacoes();
    // se quiser recarregar automaticamente quando o usuário mudar:
    // }, [user]);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDoacoes();
  };

  const formatarData = (data?: string | null) => {
    if (!data) return '-';
    try {
      const date = new Date(data);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return data;
    }
  };

  const getStatusStyle = (status?: string) => {
    const base = status?.toUpperCase() || 'ABERTA';

    if (base === 'CONCLUIDA') {
      return { container: styles.statusAprovado, text: styles.statusTextAprovado };
    }
    if (base === 'CANCELADA') {
      return { container: styles.statusCancelado, text: styles.statusTextCancelado };
    }
    // ABERTA ou qualquer outro → pendente
    return { container: styles.statusPendente, text: styles.statusTextPendente };
  };

  const getStatusLabel = (status?: string) => {
    const base = status?.toUpperCase() || 'ABERTA';
    if (base === 'CONCLUIDA') return 'Concluída';
    if (base === 'CANCELADA') return 'Cancelada';
    if (base === 'ABERTA') return 'Aberta';
    return status || 'Aberta';
  };

  const renderDoacaoItem = ({ item }: { item: Doacao }) => {
    const statusStyle = getStatusStyle(item.status);
    const qtdItens = item.itens?.length ?? 0;
    const nomesItens =
      item.itens && item.itens.length > 0
        ? item.itens.map((i) => i.titulo).join(', ')
        : 'Nenhum item listado';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>
              {item.instituicaoNome || 'Instituição não informada'}
            </Text>
            <Text style={styles.cardDate}>
              Solicitada em: {formatarData(item.dtSolicitacao)}
            </Text>
            {item.dtConfirmacao && (
              <Text style={styles.cardDate}>
                Confirmada em: {formatarData(item.dtConfirmacao)}
              </Text>
            )}
          </View>
        </View>

        <View style={[styles.cardStatus, statusStyle.container]}>
          <Text style={[styles.statusText, statusStyle.text]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>

        <View style={styles.cardInfo}>
          <Ionicons name="cube-outline" size={16} color="#6B7280" />
          <Text style={styles.cardInfoText}>
            {qtdItens} item(s): {nomesItens}
          </Text>
        </View>

        <View style={styles.cardInfo}>
          <Ionicons name="person-outline" size={16} color="#6B7280" />
          <Text style={styles.cardInfoText}>
            Doado por: {item.usuarioNome || 'Usuário não informado'}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22C55E" />
          <Text style={styles.loadingText}>Carregando doações...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadDoacoes}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (doacoes.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#6B7280" />
          <Text style={styles.emptyText}>Nenhuma doação encontrada</Text>
          <Text style={[styles.emptyText, { marginTop: 8, fontSize: 14 }]}>
            Suas doações aparecerão aqui
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={doacoes}
        renderItem={renderDoacaoItem}
        keyExtractor={(item: Doacao) => item.idDoacao.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#22C55E']}
            tintColor="#22C55E"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
