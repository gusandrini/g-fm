import { EnderecoDTO } from './enderecoDTO';

export interface Usuario {
  idUsuario: number;
  nome: string;
  email: string;
  telefone?: string | null;
  dtCadastro: string;       // LocalDateTime -> string ISO
  endereco: EnderecoDTO;   // mesmo DTO que você já usa nas instituições
}

export interface UsuarioCreate {
  nome: string;
  email: string;
  senha: string;
  telefone?: string | null;
  idEndereco: number;
}
