import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ⚠️ AJUSTE AQUI CONFORME ONDE A API ESTÁ RODANDO:
// - Emulador Android: "http://10.0.2.2:8080/api"
// - Celular físico (Expo Go): "http://SEU_IP_LOCAL:8080/api"
const API_BASE_URL = "http://172.17.100.211:8080/api";

console.log("[apiClient] Inicializando com baseURL:", API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10s
});

// REQUEST INTERCEPTOR
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");

    const fullUrl = `${config.baseURL || ""}${config.url || ""}`;
    console.log(
      `[apiClient][REQUEST] ${config.method?.toUpperCase()} ${fullUrl}`
    );

    if (token) {
      console.log("[apiClient][REQUEST] Token presente no AsyncStorage");
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("[apiClient][REQUEST] Nenhum token no AsyncStorage");
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
    const fullUrl = `${response.config.baseURL || ""}${response.config.url || ""}`;
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
    }

    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(["userId", "token"]);
      console.log("[apiClient] 401 - Limpando sessão");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
