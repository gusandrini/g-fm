import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useSession } from '@/services/SessionProvider';

import { Instituicao } from '@/models/ong';
import { Item } from '@/models/item';
import { CriarDoacao } from '@/models/doacaoCreate';

import { getInstituicoes } from '@/api/ong';
import { getItens } from '@/api/item';
import { criarDoacao } from '@/api/doacao';

import { styles } from '@/styles/screens/Doar';

export default function Doar() {
  const navigation = useNavigation();
  const { user } = useSession(); 

  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [instituicaoSelecionada, setInstituicaoSelecionada] = useState<Instituicao | null>(null);

  const [itens, setItens] = useState<Item[]>([]);
  const [itensSelecionados, setItensSelecionados] = useState<number[]>([]);

  const [observacao, setObservacao] = useState(''); 

  const [loading, setLoading] = useState(false);
  const [loadingInstituicoes, setLoadingInstituicoes] = useState(true);
  const [loadingItens, setLoadingItens] = useState(true);

  const [showInstituicaoList, setShowInstituicaoList] = useState(false);
  const [showItemList, setShowItemList] = useState(false);

  // 🔹 Carrega instituições
  const loadInstituicoes = useCallback(async () => {
    try {
      setLoadingInstituicoes(true);
      const data = await getInstituicoes();
      setInstituicoes(data);
    } catch (err) {
      console.error('Erro ao carregar instituições:', err);
      Alert.alert('Erro', 'Não foi possível carregar a lista de instituições.');
    } finally {
      setLoadingInstituicoes(false);
    }
  }, []);

  // 🔹 Carrega itens
  const loadItens = useCallback(async () => {
    try {
      setLoadingItens(true);
      const data = await getItens();
      setItens(data);
    } catch (err) {
      console.error('Erro ao carregar itens:', err);
      Alert.alert('Erro', 'Não foi possível carregar a lista de itens.');
    } finally {
      setLoadingItens(false);
    }
  }, []);

  useEffect(() => {
    loadInstituicoes();
    loadItens();
  }, [loadInstituicoes, loadItens]);

  const handleSelecionarInstituicao = (instituicao: Instituicao) => {
    setInstituicaoSelecionada(instituicao);
    setShowInstituicaoList(false);
  };

  const toggleItemSelection = (idItem: number) => {
    setItensSelecionados((prev) =>
      prev.includes(idItem) ? prev.filter((id) => id !== idItem) : [...prev, idItem]
    );
  };

  const validarFormulario = (): boolean => {
    if (!user?.idUsuario) {
      Alert.alert('Atenção', 'Você não tem permissão para este registro. Faça login com usuário adequado.');
      return false;
    }

    if (!instituicaoSelecionada) {
      Alert.alert('Atenção', 'Selecione uma instituição para doar.');
      return false;
    }

    if (itensSelecionados.length === 0) {
      Alert.alert('Atenção', 'Selecione ao menos um item para doar.');
      return false;
    }

    return true;
  };

  const handleDoar = async () => {
    if (!validarFormulario()) return;

    const payload: CriarDoacao = {
      idInstituicao: instituicaoSelecionada!.idInstituicao,
      idItens: itensSelecionados,
    };

    try {
      setLoading(true);
      await criarDoacao(user!.idUsuario, payload);

      Alert.alert('Sucesso', 'Doação registrada com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            setInstituicaoSelecionada(null);
            setItensSelecionados([]);
            setObservacao('');
            navigation.navigate('HistDoacao' as never);
          },
        },
      ]);
    } catch (err: any) {
      console.error('Erro ao registrar doação:', err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Erro ao registrar a doação. Tente novamente.';

      if (err?.response?.status === 401) {
        Alert.alert('Erro', 'Sessão expirada. Faça login novamente.');
      } else {
        Alert.alert('Erro', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Seleção de Instituição */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selecione uma instituição</Text>
            {instituicaoSelecionada ? (
              <TouchableOpacity
                style={styles.ongCard}
                onPress={() => setShowInstituicaoList(true)}
              >
                <Text style={styles.ongName}>{instituicaoSelecionada.nome}</Text>
                {instituicaoSelecionada.endereco && (
                  <Text style={styles.ongInfoText} numberOfLines={2}>
                    {instituicaoSelecionada.endereco.logradouro},{' '}
                    {instituicaoSelecionada.endereco.numero} -{' '}
                    {instituicaoSelecionada.endereco.cidadeNome}
                  </Text>
                )}
                <TouchableOpacity
                  onPress={() => setInstituicaoSelecionada(null)}
                  style={{ marginTop: 8 }}
                >
                  <Text style={{ color: '#EF4444', fontSize: 14 }}>
                    Trocar instituição
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.selectOngButton}
                onPress={() => setShowInstituicaoList(true)}
              >
                <Ionicons name="add-circle-outline" size={32} color="#22C55E" />
                <Text style={styles.selectOngButtonText}>Selecionar instituição</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Seleção de Itens */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selecione os itens para doação</Text>

            {itensSelecionados.length > 0 ? (
              <View style={styles.selectedItemsContainer}>
                <Text style={styles.selectedItemsTitle}>
                  {itensSelecionados.length} item(s) selecionado(s)
                </Text>
                <View style={styles.selectedItemsChipsContainer}>
                  {itens
                    .filter((item) => itensSelecionados.includes(item.idItem))
                    .map((item) => (
                      <View key={item.idItem} style={styles.chip}>
                        <Text style={styles.chipText}>{item.titulo}</Text>
                      </View>
                    ))}
                </View>
                <TouchableOpacity
                  onPress={() => setShowItemList(true)}
                  style={{ marginTop: 8 }}
                >
                  <Text style={{ color: '#2563EB', fontSize: 14 }}>Editar itens</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.selectOngButton}
                onPress={() => setShowItemList(true)}
              >
                <Ionicons name="add-circle-outline" size={32} color="#22C55E" />
                <Text style={styles.selectOngButtonText}>Selecionar itens</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Observação (opcional) – só front por enquanto */}
          <View style={styles.section}>
            <Text style={styles.inputLabel}>Observação (Opcional)</Text>
            <TextInput
              style={styles.observacaoInput}
              placeholder="Ex: posso entregar aos finais de semana, tamanho G, etc."
              placeholderTextColor="#6B7280"
              value={observacao}
              onChangeText={setObservacao}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Botão Doar */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleDoar}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="heart" size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>Registrar Doação</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de Seleção de Instituição */}
      <Modal
        visible={showInstituicaoList}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowInstituicaoList(false)}
      >
        <SafeAreaView style={styles.container}>
          <View
            style={{
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#E5E7EB',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: '600', color: '#0B1220' }}>
                Selecionar instituição
              </Text>
              <TouchableOpacity onPress={() => setShowInstituicaoList(false)}>
                <Ionicons name="close" size={24} color="#0B1220" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={{ flex: 1, padding: 16 }}>
            {loadingInstituicoes ? (
              <View
                style={{ alignItems: 'center', justifyContent: 'center', padding: 32 }}
              >
                <ActivityIndicator size="large" color="#22C55E" />
                <Text style={{ marginTop: 12, color: '#6B7280' }}>
                  Carregando instituições...
                </Text>
              </View>
            ) : instituicoes.length === 0 ? (
              <View style={{ alignItems: 'center', padding: 32 }}>
                <Text style={{ color: '#6B7280' }}>Nenhuma instituição disponível</Text>
              </View>
            ) : (
              instituicoes.map((inst) => (
                <TouchableOpacity
                  key={inst.idInstituicao}
                  style={styles.ongCard}
                  onPress={() => handleSelecionarInstituicao(inst)}
                >
                  <Text style={styles.ongName}>{inst.nome}</Text>
                  {inst.endereco && (
                    <Text style={styles.ongInfoText} numberOfLines={2}>
                      {inst.endereco.logradouro}, {inst.endereco.numero} -{' '}
                      {inst.endereco.cidadeNome}
                    </Text>
                  )}
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Modal de Seleção de Itens */}
      <Modal
        visible={showItemList}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowItemList(false)}
      >
        <SafeAreaView style={styles.container}>
          <View
            style={{
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#E5E7EB',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: '600', color: '#0B1220' }}>
                Selecionar itens
              </Text>
              <TouchableOpacity onPress={() => setShowItemList(false)}>
                <Ionicons name="close" size={24} color="#0B1220" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={{ flex: 1, padding: 16 }}>
            {loadingItens ? (
              <View
                style={{ alignItems: 'center', justifyContent: 'center', padding: 32 }}
              >
                <ActivityIndicator size="large" color="#22C55E" />
                <Text style={{ marginTop: 12, color: '#6B7280' }}>
                  Carregando itens...
                </Text>
              </View>
            ) : itens.length === 0 ? (
              <View style={{ alignItems: 'center', padding: 32 }}>
                <Text style={{ color: '#6B7280' }}>Nenhum item cadastrado</Text>
              </View>
            ) : (
              itens.map((item) => {
                const selected = itensSelecionados.includes(item.idItem);
                return (
                  <TouchableOpacity
                    key={item.idItem}
                    style={[
                      styles.ongCard,
                      selected && { borderColor: '#22C55E', borderWidth: 2 },
                    ]}
                    onPress={() => toggleItemSelection(item.idItem)}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={styles.ongName}>{item.titulo}</Text>
                        {item.categoriaNome && (
                          <Text style={styles.ongInfoText}>{item.categoriaNome}</Text>
                        )}
                        {item.estadoConservacao && (
                          <Text style={styles.ongInfoText}>
                            Estado: {item.estadoConservacao}
                          </Text>
                        )}
                        {item.descricao && (
                          <Text style={styles.ongInfoText} numberOfLines={2}>
                            {item.descricao}
                          </Text>
                        )}
                      </View>
                      {selected && (
                        <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>

          <View style={{ padding: 16 }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowItemList(false)}
            >
              <Text style={styles.buttonText}>Concluir seleção</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Modal de Loading geral */}
      <Modal transparent visible={loading} animationType="fade">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Registrando doação...</Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
