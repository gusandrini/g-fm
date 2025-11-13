import apiClient from './apiClient';
import { Doacao} from '@/models/doacao';
import { CriarDoacao } from '@/models/doacaoCreate';

// Se o baseURL JÁ tiver /api no final, deixe assim:
const BASE_PATH = '/doacoes';
/**
 * Criar nova doação
 * Backend: POST /api/doacoes?usuarioId=...
 */
export async function criarDoacao(
  usuarioId: number,
  doacao: CriarDoacao
): Promise<Doacao> {
  const response = await apiClient.post<Doacao>(
    BASE_PATH,
    doacao,
    {
      params: { usuarioId }, // manda como @RequestParam
    }
  );
  return response.data;
}

/**
 * Listar todas as doações
 * Backend: GET /api/doacoes
 */
export async function getDoacoes(): Promise<Doacao[]> {
  const response = await apiClient.get<Doacao[]>(BASE_PATH);
  return response.data;
}

/**
 * Buscar doação por ID
 * Backend: GET /api/doacoes/{id}
 */
export async function getDoacaoById(id: number): Promise<Doacao> {
  const response = await apiClient.get<Doacao>(`${BASE_PATH}/${id}`);
  return response.data;
}

/**
 * Atualizar status da doação
 * Backend: PUT /api/doacoes/{id}/status?status=...
 * status válido: ABERTA, CONCLUIDA, CANCELADA
 */
export async function atualizarStatusDoacao(
  id: number,
  status: string
): Promise<Doacao> {
  const response = await apiClient.put<Doacao>(
    `${BASE_PATH}/${id}/status`,
    null,
    {
      params: { status },
    }
  );
  return response.data;
}

/**
 * Deletar doação
 * Backend: DELETE /api/doacoes/{id}
 */
export async function deletarDoacao(id: number): Promise<void> {
  await apiClient.delete(`${BASE_PATH}/${id}`);
}

/**
 * ⚠️ OPCIONAL: Buscar doações por usuário
 * Só funciona se existir o endpoint /api/doacoes/usuario/{idUsuario} no backend.
 * Se ainda não tiver, ou você cria o endpoint, ou filtra no front.
 */
export async function getDoacoesByUsuario(
  idUsuario: number
): Promise<Doacao[]> {
  const response = await apiClient.get<Doacao[]>(
    `${BASE_PATH}/usuario/${idUsuario}`
  );
  return response.data;
}
