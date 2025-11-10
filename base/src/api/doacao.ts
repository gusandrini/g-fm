import apiClient from './apiClient';
import { Doacao, CriarDoacao } from '@/models/doacao';

export async function criarDoacao(doacao: CriarDoacao): Promise<Doacao> {
  const response = await apiClient.post<Doacao>('/doacoes', doacao);
  return response.data;
}

export async function getDoacoes(): Promise<Doacao[]> {
  const response = await apiClient.get<Doacao[]>('/doacoes');
  return response.data;
}

export async function getDoacaoById(id: number): Promise<Doacao> {
  const response = await apiClient.get<Doacao>(`/doacoes/${id}`);
  return response.data;
}

export async function getDoacoesByUsuario(idUsuario: number): Promise<Doacao[]> {
  const response = await apiClient.get<Doacao[]>(`/doacoes/usuario/${idUsuario}`);
  return response.data;
}

