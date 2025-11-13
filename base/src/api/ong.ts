import apiClient from './apiClient';
import { Instituicao } from '@/models/ong';

// Se o baseURL DO apiClient já tiver "/api", usa:
const BASE_PATH = '/instituicoes';

// Se o baseURL NÃO tiver "/api" (ex: https://meu-backend.com),
// troque para:
// const BASE_PATH = '/api/instituicoes';

/**
 * GET /api/instituicoes
 * Lista todas as instituições
 */
export async function getInstituicoes(): Promise<Instituicao[]> {
  const response = await apiClient.get<Instituicao[]>(BASE_PATH);
  return response.data;
}

/**
 * GET /api/instituicoes/{id}
 * Busca uma instituição específica por ID
 */
export async function getInstituicaoById(id: number): Promise<Instituicao> {
  const response = await apiClient.get<Instituicao>(`${BASE_PATH}/${id}`);
  return response.data;
}

/**
 * POST /api/instituicoes
 * Cria nova instituição
 */
export async function criarInstituicao(
  instituicao: Omit<Instituicao, 'idInstituicao' | 'dtCadastro'>
): Promise<Instituicao> {
  const response = await apiClient.post<Instituicao>(BASE_PATH, instituicao);
  return response.data;
}

/**
 * PUT /api/instituicoes/{id}
 * Atualiza instituição existente
 */
export async function atualizarInstituicao(
  id: number,
  instituicao: Partial<Instituicao>
): Promise<Instituicao> {
  const response = await apiClient.put<Instituicao>(
    `${BASE_PATH}/${id}`,
    instituicao
  );
  return response.data;
}

/**
 * DELETE /api/instituicoes/{id}
 * Exclui instituição
 */
export async function deletarInstituicao(id: number): Promise<void> {
  await apiClient.delete(`${BASE_PATH}/${id}`);
}
