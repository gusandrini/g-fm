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
import { getDoacoes, getDoacoesByUsuario } from '@/api/doacao';
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
      let data: Doacao[];
      
      // Se tiver usuário logado, buscar doações do usuário
      // Caso contrário, buscar todas (a API pode filtrar automaticamente)
      if (user?.idFuncionario) {
        try {
          data = await getDoacoesByUsuario(user.idFuncionario);
        } catch {
          // Se não houver endpoint específico, usar o geral
          data = await getDoacoes();
        }
      } else {
        data = await getDoacoes();
      }
      
      setDoacoes(data);
    } catch (err: any) {
      console.error('Erro ao carregar doações:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Erro ao carregar histórico de doações. Verifique sua conexão.';
      setError(errorMessage);

      if (err.response?.status === 401) {
        Alert.alert('Erro', 'Sessão expirada. Faça login novamente.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDoacoes();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDoacoes();
  };

  const formatarData = (data: string) => {
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

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const getStatusStyle = (status?: string) => {
    if (!status) return { container: styles.statusPendente, text: styles.statusTextPendente };
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes('aprovado') || statusLower.includes('confirmado')) {
      return { container: styles.statusAprovado, text: styles.statusTextAprovado };
    }
    if (statusLower.includes('cancelado') || statusLower.includes('recusado')) {
      return { container: styles.statusCancelado, text: styles.statusTextCancelado };
    }
    return { container: styles.statusPendente, text: styles.statusTextPendente };
  };

  const getStatusLabel = (status?: string) => {
    if (!status) return 'Pendente';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('aprovado') || statusLower.includes('confirmado')) {
      return 'Aprovado';
    }
    if (statusLower.includes('cancelado') || statusLower.includes('recusado')) {
      return 'Cancelado';
    }
    return status;
  };

  const renderDoacaoItem = ({ item }: { item: Doacao }) => {
    const statusStyle = getStatusStyle(item.status);
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>
              {item.ong?.nome || 'ONG não informada'}
            </Text>
            <Text style={styles.cardDate}>{formatarData(item.dataDoacao)}</Text>
          </View>
          <Text style={styles.cardValor}>{formatarValor(item.valor)}</Text>
        </View>

        <View style={[styles.cardStatus, statusStyle.container]}>
          <Text style={[styles.statusText, statusStyle.text]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>

        {item.metodoPagamento && (
          <View style={styles.cardInfo}>
            <Ionicons name="card-outline" size={16} color="#6B7280" />
            <Text style={styles.cardInfoText}>
              {item.metodoPagamento.charAt(0).toUpperCase() + item.metodoPagamento.slice(1)}
            </Text>
          </View>
        )}

        {item.observacao && (
          <View style={styles.cardInfo}>
            <Ionicons name="chatbubble-outline" size={16} color="#6B7280" />
            <Text style={styles.cardInfoText} numberOfLines={2}>
              {item.observacao}
            </Text>
          </View>
        )}
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
        keyExtractor={(item: Doacao) => item.id.toString()}
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

