import { Item } from './item';

import type { DoacaoStatus } from './doacaoCreate';

export interface Doacao {
  idDoacao: number;
  status: DoacaoStatus;
  dtSolicitacao: string;
  dtConfirmacao?: string | null;

  usuarioId: number;
  usuarioNome: string;

  instituicaoId: number;
  instituicaoNome: string;

  itens?: Item[] | null;
}

