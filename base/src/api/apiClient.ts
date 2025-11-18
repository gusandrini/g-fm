import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const API_BASE_URL = "https://helplink-java.onrender.com";

console.log("[apiClient] Inicializando com baseURL:", API_BASE_URL);

// Flag para mostrar o aviso de conexão apenas uma vez
let hasShownRenderWarmupAlert = false;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 40000,
});

// REQUEST INTERCEPTOR
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");

    const fullUrl = `${config.baseURL || ""}${config.url || ""}`;
    console.log(
      `[apiClient][REQUEST] ${config.method?.toUpperCase()} ${fullUrl}`
    );

    // ⚠️ Aviso de "conectando" apenas na primeira requisição
    if (!hasShownRenderWarmupAlert) {
      hasShownRenderWarmupAlert = true;
      console.log(
        "[apiClient] Conectando ao servidor Render... a primeira chamada pode demorar alguns segundos."
      );
      Alert.alert(
        "Conectando ao servidor",
        "Estamos conectando ao servidor. A primeira conexão pode levar alguns segundos."
      );
    }

    if (token) {
      console.log("[apiClient][REQUEST] Token presente no AsyncStorage");
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    } else {
      // 👉 Isso aqui é NORMAL após logout
      console.log(
        "[apiClient][REQUEST] Sem token (usuário deslogado) – OK, seguindo sem Authorization"
      );
    }

    if (config.data) {
      console.log("[apiClient][REQUEST] Body:", config.data);
    }

    return config;
  },
  (error) => {
    console.log("[apiClient][REQUEST][ERRO]", error);
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
apiClient.interceptors.response.use(
  (response) => {
    const fullUrl = `${response.config.baseURL || ""}${
      response.config.url || ""
    }`;
    console.log(
      `[apiClient][RESPONSE] ${response.status} ${fullUrl}`,
      "Data:",
      response.data
    );
    return response;
  },
  async (error) => {
    if (error.config) {
      const fullUrl = `${error.config.baseURL || ""}${error.config.url || ""}`;
      console.log(
        `[apiClient][RESPONSE][ERRO] ${fullUrl}`,
        "Mensagem:",
        error.message
      );
    } else {
      console.log("[apiClient][RESPONSE][ERRO] Sem config na error:", error);
    }

    if (error.response) {
      console.log(
        "[apiClient][RESPONSE][ERRO] Status:",
        error.response.status,
        "Data:",
        error.response.data
      );
    } else {
      console.log(
        "[apiClient][RESPONSE][ERRO] Sem response (provavelmente NETWORK ERROR ou TIMEOUT)"
      );

      // 💬 Mensagem amigável para caso o Render esteja acordando
      Alert.alert(
        "Conexão lenta",
        "Estamos tendo dificuldade para falar com o servidor. Se for a primeira vez, o servidor pode estar iniciando. Tente novamente em alguns segundos."
      );

      return Promise.reject(error);
    }

    // 🔐 Tratamento especial de 401
    if (error.response?.status === 401) {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        // Sessão expirada de verdade
        await AsyncStorage.multiRemove(["userId", "token"]);
        console.log("[apiClient] 401 - Sessão expirada, limpando sessão");
        // aqui você poderia disparar um evento de logout global se quiser
      } else {
        // Aqui é o caso típico pós-logout: não é "erro" de verdade
        console.log(
          "[apiClient] 401 recebido com usuário já deslogado – ignorando (sem alerta para o usuário)"
        );
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
