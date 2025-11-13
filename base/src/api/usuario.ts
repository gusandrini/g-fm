import apiClient from './apiClient';
import { Usuario, UsuarioCreate } from '@/models/usuario';

// Se o baseURL já tiver "/api", usa:
const BASE_PATH = '/usuarios';

// Se NÃO tiver "/api" no baseURL, troca para:
// const BASE_PATH = '/api/usuarios';

/**
 * GET /api/usuarios
 */
export async function getUsuarios(): Promise<Usuario[]> {
  const response = await apiClient.get<Usuario[]>(BASE_PATH);
  return response.data;
}

/**
 * GET /api/usuarios/{id}
 */
export async function getUsuarioById(id: number): Promise<Usuario> {
  const response = await apiClient.get<Usuario>(`${BASE_PATH}/${id}`);
  return response.data;
}

/**
 * POST /api/usuarios
 */
export async function criarUsuario(data: UsuarioCreate): Promise<Usuario> {
  const response = await apiClient.post<Usuario>(BASE_PATH, data);
  return response.data;
}

/**
 * PUT /api/usuarios/{id}
 * Usa o mesmo payload do create (UsuarioCreateDTO)
 */
export async function atualizarUsuario(
  id: number,
  data: UsuarioCreate
): Promise<Usuario> {
  const response = await apiClient.put<Usuario>(`${BASE_PATH}/${id}`, data);
  return response.data;
}

/**
 * DELETE /api/usuarios/{id}
 */
export async function deletarUsuario(id: number): Promise<void> {
  await apiClient.delete(`${BASE_PATH}/${id}`);
}
