import apiClient from './apiClient';
import { Ong } from '@/models/ong';

export async function getOngs(): Promise<Ong[]> {
  const response = await apiClient.get<Ong[]>('/ongs');
  return response.data;
}

export async function getOngById(id: number): Promise<Ong> {
  const response = await apiClient.get<Ong>(`/ongs/${id}`);
  return response.data;
}

