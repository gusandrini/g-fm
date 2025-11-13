export interface Item {
  idItem: number;
  titulo: string;
  fotoUrl?: string | null;
  estadoConservacao: string;
  descricao?: string | null;
  dtRegistro: string;  
  usuarioId: number;
  usuarioNome: string;
  categoriaId: number;
  categoriaNome: string;
}

