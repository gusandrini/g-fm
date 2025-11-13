export interface Categoria {
  idCategoria: number;
  nome: string;
}

// opcional, mas bem útil pra POST/PUT
export interface CategoriaCreate {
  nome: string;
}
