export interface FuncionarioCad {
  idFuncionario: number;    // pode ser 0 no cadastro
  idFilial: number;         // opcional → envie 0 ou remova se sua API aceitar null
  nome: string;
  emailCorporativo: string;
  senhaHash: string;        // envie a senha (ou hash, conforme seu backend)
  cargo: string;
}
