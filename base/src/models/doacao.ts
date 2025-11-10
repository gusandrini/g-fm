export interface Doacao {
  id: number;
  idUsuario: number;
  idOng: number;
  valor: number;
  dataDoacao: string;
  status?: string;
  metodoPagamento?: string;
  observacao?: string;
  ong?: {
    id: number;
    nome: string;
    imagem?: string;
  };
}

export interface CriarDoacao {
  idOng: number;
  valor: number;
  metodoPagamento: string;
  observacao?: string;
}

