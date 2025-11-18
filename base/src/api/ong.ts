// src/api/instituicao.ts
import apiClient from './apiClient';
import { Instituicao } from '@/models/ong';

// baseURL = 'https://helplink-java.onrender.com'
const BASE_PATH = '/api/instituicoes';

/**
 * GET /api/instituicoes
 */
export async function getInstituicoes(): Promise<Instituicao[]> {
  const response = await apiClient.get<Instituicao[]>(BASE_PATH);
  return response.data;
}

/**
 * GET /api/instituicoes/{id}
 */
export async function getInstituicaoById(id: number): Promise<Instituicao> {
  const response = await apiClient.get<Instituicao>(`${BASE_PATH}/${id}`);
  return response.data;
}
