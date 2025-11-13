export interface Doacao {
  idDoacao: number;
  status: string;
  dtSolicitacao: string;      // vem como ISO string da API
  dtConfirmacao?: string | null;

  usuarioId: number;
  usuarioNome: string;

  instituicaoId: number;
  instituicaoNome: string;

  itens?: ItemDTO[] | null;
  impacto?: ImpactoDTO | null;
}

// =========== MODELOS COMPLEMENTARES =========== //

export interface ItemDTO {
  idItem: number;
  nomeItem: string;
  quantidade: number;
}

export interface ImpactoDTO {
  idImpacto: number;
  descricao: string;
  valorEstimado: number;
}