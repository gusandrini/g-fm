import type { FuncionarioCad } from "@/models/funcionarioCad";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Use variável de ambiente do Expo quando possível
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8080";

// cria uma instância só para este módulo (ou troque por seu apiClient global)
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// injeta Bearer token (se você usa JWT)
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function addFuncionario(data: FuncionarioCad) {
  // ajuste a rota conforme seu backend (ex.: "/funcionarios" ou "/api/funcionarios")
  const { data: resp } = await api.post("/funcionarios", data);
  return resp; // retorne o objeto criado ou mensagem do backend
}
