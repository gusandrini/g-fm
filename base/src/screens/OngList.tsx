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

import { Instituicao } from '@/models/ong';
import { getInstituicoes } from '@/api/ong';
import { styles } from '@/styles/screens/OngList';

export default function OngList() {
  const [ongs, setOngs] = useState<Instituicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOngs = async () => {
    try {
      setError(null);
      const data = await getInstituicoes();
      setOngs(data);
    } catch (err: any) {
      console.error('Erro ao carregar ONGs:', err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Erro ao carregar lista de instituições. Verifique sua conexão.';
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
    loadOngs();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadOngs();
  };

  const renderOngItem = ({ item }: { item: Instituicao }) => (
    <View style={styles.card}>
      {/* Cabeçalho */}
      <View style={styles.cardHeader}>
        <Ionicons name="business-outline" size={24} color="#22C55E" />
        <Text style={styles.cardTitle}>{item.nome}</Text>
      </View>

      {/* Categoria(s) aceitas */}
      {item.categoriasAceitas && (
        <View style={styles.cardInfo}>
          <Ionicons name="pricetag-outline" size={16} color="#6B7280" />
          <Text style={styles.cardInfoText}>{item.categoriasAceitas}</Text>
        </View>
      )}

      {/* CNPJ */}
      {item.cnpj && (
        <View style={styles.cardInfo}>
          <Ionicons name="document-text-outline" size={16} color="#6B7280" />
          <Text style={styles.cardInfoText}>{item.cnpj}</Text>
        </View>
      )}

      {/* E-mail */}
      {item.email && (
        <View style={styles.cardInfo}>
          <Ionicons name="mail-outline" size={16} color="#6B7280" />
          <Text style={styles.cardInfoText}>{item.email}</Text>
        </View>
      )}

      {/* Telefone */}
      {item.telefone && (
        <View style={styles.cardInfo}>
          <Ionicons name="call-outline" size={16} color="#6B7280" />
          <Text style={styles.cardInfoText}>{item.telefone}</Text>
        </View>
      )}

      {/* Endereço (EnderecoDTO) */}
      {item.endereco && (
        <View style={styles.cardInfo}>
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text style={styles.cardInfoText} numberOfLines={2}>
            {item.endereco.logradouro}, {item.endereco.numero} -{' '}
            {item.endereco.cidadeNome}/{item.endereco.estadoNome}
          </Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22C55E" />
          <Text style={styles.loadingText}>Carregando instituições...</Text>
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
          <TouchableOpacity style={styles.retryButton} onPress={loadOngs}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (ongs.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="business-outline" size={64} color="#6B7280" />
          <Text style={styles.emptyText}>Nenhuma instituição encontrada</Text>
          <TouchableOpacity
            style={[styles.retryButton, { marginTop: 16 }]}
            onPress={loadOngs}
          >
            <Text style={styles.retryButtonText}>Recarregar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={ongs}
        renderItem={renderOngItem}
        keyExtractor={(item: Instituicao) => item.idInstituicao.toString()}
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
