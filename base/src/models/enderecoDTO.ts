export interface EnderecoDTO {
  idEndereco: number;
  logradouro: string;
  numero: string;
  cep: string;
  complemento?: string | null;
  bairroNome: string;
  cidadeNome: string;
  estadoNome: string;
  paisNome: string;
}
