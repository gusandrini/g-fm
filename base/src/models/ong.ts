import { EnderecoDTO } from './enderecoDTO';

export interface Instituicao {
  idInstituicao: number;
  nome: string;
  cnpj: string;
  email: string;
  categoriasAceitas: string;
  telefone: string;
  dtCadastro: string; // ISO date string
  endereco: EnderecoDTO;
}
