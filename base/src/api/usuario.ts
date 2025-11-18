// src/api/usuario.ts

import apiClient from './apiClient';
import { Usuario, UsuarioCreate } from '@/models/usuario';

const BASE_PATH = '/api/usuarios';

/**
 * GET /api/usuarios
 * (precisa de token JWT)
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
 * → normalmente protegido (JWT), usado para CRUD interno
 * → MAS no seu caso, a gente vai usar rota de auth pública para cadastro
 */
export async function criarUsuario(data: UsuarioCreate): Promise<Usuario> {
  const response = await apiClient.post<Usuario>(BASE_PATH, data);
  return response.data;
}

/**
 * PUT /api/usuarios/{id}
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
