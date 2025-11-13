import { Item } from './item';

export interface Doacao {
  idDoacao: number;
  status: string;
  dtSolicitacao: string;           // ISO string da API
  dtConfirmacao?: string | null;

  usuarioId: number;
  usuarioNome: string;

  instituicaoId: number;
  instituicaoNome: string;

  itens?: Item[] | null;           // usa o mesmo Item completo do modelo acima
  impacto?: ImpactoDTO | null;
}

// =========== MODELOS COMPLEMENTARES =========== //

export interface ImpactoDTO {
  idImpacto: number;
  descricao: string;
  valorEstimado: number;
}
