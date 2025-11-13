import { EnderecoDTO } from './enderecoDTO';

export interface Usuario {
  idUsuario: number;
  nome: string;
  email: string;
  telefone?: string | null;
  dtCadastro: string;       
  endereco: EnderecoDTO;  
}

export interface UsuarioCreate {
  nome: string;
  email: string;
  senha: string;
  telefone?: string | null;
  idEndereco: number;
}
