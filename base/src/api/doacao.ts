import apiClient from './apiClient';
import { Doacao } from '@/models/doacao';
import { CriarDoacao } from '@/models/doacaoCreate';


const BASE_PATH = '/api/doacoes';


export async function criarDoacao(
  usuarioId: number,
  doacao: CriarDoacao
): Promise<Doacao> {
  const response = await apiClient.post<Doacao>(
    BASE_PATH,
    doacao,
    {
      params: { usuarioId }, 
    }
  );
  return response.data;
}

export async function getDoacoes(): Promise<Doacao[]> {
  const response = await apiClient.get<Doacao[]>(BASE_PATH);
  return response.data;
}


export async function getDoacaoById(id: number): Promise<Doacao> {
  const response = await apiClient.get<Doacao>(`${BASE_PATH}/${id}`);
  return response.data;
}


export async function atualizarStatusDoacao(
  id: number,
  status: string
): Promise<Doacao> {
  const response = await apiClient.put<Doacao>(
    `${BASE_PATH}/${id}/status`,
    null, // corpo vazio, só query param
    {
      params: { status }, 
    }
  );
  return response.data;
}


export async function deletarDoacao(id: number): Promise<void> {
  await apiClient.delete(`${BASE_PATH}/${id}`);
}


export async function getDoacoesByUsuario(
  idUsuario: number
): Promise<Doacao[]> {
  const response = await apiClient.get<Doacao[]>(
    `${BASE_PATH}/usuario/${idUsuario}`
  );
  return response.data;
}
