// src/api/auth.ts
import apiClient from './apiClient';
import { Usuario, UsuarioCreate, UsuarioLogin } from '@/models/usuario';

export interface AuthResponse {
  token: string | null;
  tipo: string | null;
  usuarioId: number;
  email: string;
  nome: string;
  mensagem: string;
}

// LOGIN: POST /api/auth/login
export async function loginUsuario(data: UsuarioLogin): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
  return response.data;
}

// CADASTRO: POST /api/usuarios
export async function registrarUsuario(
  data: UsuarioCreate
): Promise<Usuario> {
  const response = await apiClient.post<Usuario>('/api/usuarios', data);
  return response.data;
}
