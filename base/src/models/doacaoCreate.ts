// src/models/doacaoCreate.ts

export type DoacaoStatus = 'ABERTA' | 'CONCLUIDA' | 'CANCELADA';

export interface CriarDoacao {
  idInstituicao: number;     // obrigatório
  idItens: number[];         // lista de IDs dos itens selecionados
  itemDescricao: string;     // obrigatório
  status: DoacaoStatus;      // obrigatório
}
