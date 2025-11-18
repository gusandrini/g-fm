import { EnderecoDTO } from './enderecoDTO';

// src/models/usuario.ts

// Resposta do backend (UsuarioDTO)
export interface Usuario {
  idUsuario: number;
  nome: string;
  email: string;
  telefone?: string | null;
  dtCadastro: string; // LocalDateTime vem como string no JSON
}

// Corpo para criação (UsuarioCreateDTO)
export interface UsuarioCreate {
  nome: string;
  email: string;
  senha: string;
  telefone?: string | null;
  idEndereco?: number | null;
}

// Corpo para login (UsuarioLoginDTO)
export interface UsuarioLogin {
  email: string;
  senha: string;
}
