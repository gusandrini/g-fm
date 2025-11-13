import apiClient from './apiClient';
import { Categoria, CategoriaCreate } from '@/models/categoria';

// Se o baseURL já tiver "/api" no final, use:
const BASE_PATH = '/categorias';

// Se o baseURL NÃO tiver "/api", troque para:
// const BASE_PATH = '/api/categorias';

/**
 * GET /api/categorias
 * Lista todas as categorias
 */
export async function getCategorias(): Promise<Categoria[]> {
  const response = await apiClient.get<Categoria[]>(BASE_PATH);
  return response.data;
}

/**
 * GET /api/categorias/{id}
 * Busca categoria por ID
 */
export async function getCategoriaById(id: number): Promise<Categoria> {
  const response = await apiClient.get<Categoria>(`${BASE_PATH}/${id}`);
  return response.data;
}

/**
 * POST /api/categorias
 * Cria nova categoria
 */
export async function criarCategoria(
  data: CategoriaCreate
): Promise<Categoria> {
  const response = await apiClient.post<Categoria>(BASE_PATH, data);
  return response.data;
}

/**
 * PUT /api/categorias/{id}
 * Atualiza categoria existente
 */
export async function atualizarCategoria(
  id: number,
  data: CategoriaCreate
): Promise<Categoria> {
  const response = await apiClient.put<Categoria>(`${BASE_PATH}/${id}`, data);
  return response.data;
}

/**
 * DELETE /api/categorias/{id}
 * Exclui categoria
 */
export async function deletarCategoria(id: number): Promise<void> {
  await apiClient.delete(`${BASE_PATH}/${id}`);
}
