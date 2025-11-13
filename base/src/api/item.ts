import apiClient from './apiClient';
import { Item } from '@/models/item'; // seu model baseado no ItemDTO

// Se seu apiClient JÁ tem baseURL com "/api", use:
const BASE_PATH = '/itens';

// Caso seu baseURL NÃO tenha "/api", troque para:
// const BASE_PATH = '/api/itens';

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
 * POST /api/itens
 * Cria novo item
 * - O backend espera um ItemDTO completo (com categoriaId, usuarioId, etc.)
 */
export async function criarItem(data: Partial<Item>): Promise<Item> {
  const response = await apiClient.post<Item>(BASE_PATH, data);
  return response.data;
}

/**
 * PUT /api/itens/{id}
 * Atualiza item existente
 */
export async function atualizarItem(id: number, data: Partial<Item>): Promise<Item> {
  const response = await apiClient.put<Item>(`${BASE_PATH}/${id}`, data);
  return response.data;
}

/**
 * DELETE /api/itens/{id}
 * Remove item do sistema
 */
export async function deletarItem(id: number): Promise<void> {
  await apiClient.delete(`${BASE_PATH}/${id}`);
}
