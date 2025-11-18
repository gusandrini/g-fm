import apiClient from './apiClient';
import { Item } from '@/models/item'; // model baseado no ItemDTO

// baseURL = 'https://helplink-java.onrender.com'
const BASE_PATH = '/api/itens';

/**
 * GET /api/itens
 * Lista todos os itens
 */
export async function getItens(): Promise<Item[]> {
  const response = await apiClient.get<Item[]>(BASE_PATH);
  return response.data;
}

/**
 * GET /api/itens/{id}
 * Busca item por ID
 */
export async function getItemById(id: number): Promise<Item> {
  const response = await apiClient.get<Item>(`${BASE_PATH}/${id}`);
  return response.data;
}

/**
 * POST /api/itens/{usuarioId}
 * Cria novo item vinculado a um usuário
 */
export async function criarItem(
  usuarioId: number,
  data: Partial<Item>
): Promise<Item> {
  const response = await apiClient.post<Item>(
    `${BASE_PATH}/${usuarioId}`,
    data
  );
  return response.data;
}

/**
 * PUT /api/itens/{usuarioId}/{id}
 * Atualiza item existente
 */
export async function atualizarItem(
  usuarioId: number,
  id: number,
  data: Partial<Item>
): Promise<Item> {
  const response = await apiClient.put<Item>(
    `${BASE_PATH}/${usuarioId}/${id}`,
    data
  );
  return response.data;
}

/**
 * DELETE /api/itens/{id}
 * Remove item do sistema
 */
export async function deletarItem(id: number): Promise<void> {
  await apiClient.delete(`${BASE_PATH}/${id}`);
}
