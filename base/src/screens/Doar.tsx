import React, { useState, useEffect } from 'react';
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
import { Ong } from '@/models/ong';
import { CriarDoacao } from '@/models/doacao';
import { getOngs } from '@/api/ong';
import { criarDoacao } from '@/api/doacao';
import { styles } from '@/styles/screens/Doar';

export default function Doar() {
  const navigation = useNavigation();
  const [ongs, setOngs] = useState<Ong[]>([]);
  const [ongSelecionada, setOngSelecionada] = useState<Ong | null>(null);
  const [valor, setValor] = useState('');
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [observacao, setObservacao] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingOngs, setLoadingOngs] = useState(true);
  const [showOngList, setShowOngList] = useState(false);

  const metodosPagamento = [
    { id: 'pix', nome: 'PIX', icon: 'card-outline' },
    { id: 'cartao', nome: 'Cartão', icon: 'card-outline' },
    { id: 'boleto', nome: 'Boleto', icon: 'receipt-outline' },
  ];

  useEffect(() => {
    loadOngs();
  }, []);

  const loadOngs = async () => {
    try {
      const data = await getOngs();
      setOngs(data);
    } catch (err: any) {
      console.error('Erro ao carregar ONGs:', err);
      Alert.alert('Erro', 'Não foi possível carregar a lista de ONGs');
    } finally {
      setLoadingOngs(false);
    }
  };

  const handleSelecionarOng = (ong: Ong) => {
    setOngSelecionada(ong);
    setShowOngList(false);
  };

  const formatarValor = (text: string) => {
    const apenasNumeros = text.replace(/\D/g, '');
    const valorFormatado = (parseInt(apenasNumeros) / 100).toFixed(2);
    return valorFormatado.replace('.', ',');
  };

  const handleValorChange = (text: string) => {
    const valorFormatado = formatarValor(text);
    setValor(valorFormatado);
  };

  const getValorNumerico = (): number => {
    return parseFloat(valor.replace(',', '.')) || 0;
  };

  const validarFormulario = (): boolean => {
    if (!ongSelecionada) {
      Alert.alert('Atenção', 'Selecione uma ONG para doar');
      return false;
    }
    if (!valor || getValorNumerico() <= 0) {
      Alert.alert('Atenção', 'Informe um valor válido');
      return false;
    }
    if (!metodoPagamento) {
      Alert.alert('Atenção', 'Selecione um método de pagamento');
      return false;
    }
    return true;
  };

  const handleDoar = async () => {
    if (!validarFormulario()) return;

    try {
      setLoading(true);
      const doacao: CriarDoacao = {
        idOng: ongSelecionada!.id,
        valor: getValorNumerico(),
        metodoPagamento,
        observacao: observacao.trim() || undefined,
      };

      await criarDoacao(doacao);
      Alert.alert('Sucesso', 'Doação realizada com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            setOngSelecionada(null);
            setValor('');
            setMetodoPagamento('');
            setObservacao('');
            navigation.navigate('HistDoacao' as never);
          },
        },
      ]);
    } catch (err: any) {
      console.error('Erro ao realizar doação:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Erro ao realizar doação. Tente novamente.';
      
      if (err.response?.status === 401) {
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
          {/* Seleção de ONG */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selecione uma ONG</Text>
            {ongSelecionada ? (
              <TouchableOpacity
                style={styles.ongCard}
                onPress={() => setShowOngList(true)}
              >
                <Text style={styles.ongName}>{ongSelecionada.nome}</Text>
                {ongSelecionada.descricao && (
                  <Text style={styles.ongInfoText} numberOfLines={2}>
                    {ongSelecionada.descricao}
                  </Text>
                )}
                <TouchableOpacity
                  onPress={() => setOngSelecionada(null)}
                  style={{ marginTop: 8 }}
                >
                  <Text style={{ color: '#EF4444', fontSize: 14 }}>
                    Trocar ONG
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.selectOngButton}
                onPress={() => setShowOngList(true)}
              >
                <Ionicons name="add-circle-outline" size={32} color="#22C55E" />
                <Text style={styles.selectOngButtonText}>Selecionar ONG</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Valor */}
          <View style={styles.section}>
            <Text style={styles.inputLabel}>Valor da Doação</Text>
            <View style={styles.valorContainer}>
              <Text style={styles.valorSymbol}>R$</Text>
              <TextInput
                style={styles.valorInput}
                placeholder="0,00"
                placeholderTextColor="#6B7280"
                value={valor}
                onChangeText={handleValorChange}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Método de Pagamento */}
          <View style={styles.section}>
            <Text style={styles.inputLabel}>Método de Pagamento</Text>
            <View style={styles.metodoPagamentoContainer}>
              {metodosPagamento.map((metodo) => (
                <TouchableOpacity
                  key={metodo.id}
                  style={[
                    styles.metodoButton,
                    metodoPagamento === metodo.id && styles.metodoButtonSelected,
                  ]}
                  onPress={() => setMetodoPagamento(metodo.id)}
                >
                  <Ionicons
                    name={metodo.icon as any}
                    size={24}
                    color={metodoPagamento === metodo.id ? '#22C55E' : '#6B7280'}
                  />
                  <Text
                    style={[
                      styles.metodoButtonText,
                      metodoPagamento === metodo.id && { color: '#22C55E' },
                    ]}
                  >
                    {metodo.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Observação */}
          <View style={styles.section}>
            <Text style={styles.inputLabel}>Observação (Opcional)</Text>
            <TextInput
              style={styles.observacaoInput}
              placeholder="Deixe uma mensagem para a ONG..."
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
                <Text style={styles.buttonText}>Realizar Doação</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de Seleção de ONG */}
      <Modal
        visible={showOngList}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowOngList(false)}
      >
        <SafeAreaView style={styles.container}>
          <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: '600', color: '#0B1220' }}>
                Selecionar ONG
              </Text>
              <TouchableOpacity onPress={() => setShowOngList(false)}>
                <Ionicons name="close" size={24} color="#0B1220" />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView style={{ flex: 1, padding: 16 }}>
            {loadingOngs ? (
              <View style={{ alignItems: 'center', justifyContent: 'center', padding: 32 }}>
                <ActivityIndicator size="large" color="#22C55E" />
                <Text style={{ marginTop: 12, color: '#6B7280' }}>Carregando ONGs...</Text>
              </View>
            ) : ongs.length === 0 ? (
              <View style={{ alignItems: 'center', padding: 32 }}>
                <Text style={{ color: '#6B7280' }}>Nenhuma ONG disponível</Text>
              </View>
            ) : (
              ongs.map((ong: Ong) => (
                <TouchableOpacity
                  key={ong.id}
                  style={styles.ongCard}
                  onPress={() => handleSelecionarOng(ong)}
                >
                  <Text style={styles.ongName}>{ong.nome}</Text>
                  {ong.descricao && (
                    <Text style={styles.ongInfoText} numberOfLines={2}>
                      {ong.descricao}
                    </Text>
                  )}
                  {ong.categoria && (
                    <View style={styles.ongInfo}>
                      <Ionicons name="pricetag-outline" size={16} color="#6B7280" />
                      <Text style={styles.ongInfoText}>{ong.categoria}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Modal de Loading */}
      <Modal transparent visible={loading} animationType="fade">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Processando doação...</Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

