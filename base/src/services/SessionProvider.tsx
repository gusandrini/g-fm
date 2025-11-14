import { createContext, PropsWithChildren, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import apiClient from "../api/apiClient";

interface User {
  idUsuario: number;
  nome: string;
  email: string;
  telefone?: string;
}

interface AuthResponse {
  token: string | null;
  tipo: string | null;
  usuarioId: number;
  email: string;
  nome: string;
  mensagem: string;
}

interface SessionContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const SessionProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    console.log("[SessionProvider][login] Iniciando login com:", email);

    try {
      // ✅ payload compatível com AuthRequest (email + senha)
      const payload = {
        email,
        senha: password,
      };

      console.log("[SessionProvider][login] Payload enviado:", payload);

      // ⚠️ Se o baseURL do apiClient já for "http://.../api",
      // ENTÃO a rota correta é "/auth/login" (que vira /api/auth/login).
      const response = await apiClient.post<AuthResponse>("/auth/login", payload);

      console.log("[SessionProvider][login] Resposta recebida:", response.data);

      const { token, tipo, usuarioId, nome, email: emailResposta } = response.data;

      if (!token) {
        console.log(
          "[SessionProvider][login] Token veio nulo. Provavelmente credenciais inválidas."
        );
        return false;
      }

      // ✅ Salva token
      await AsyncStorage.setItem("token", token);
      console.log("[SessionProvider][login] Token salvo no AsyncStorage");

      // ✅ Salva também o id do usuário, caso precise depois
      if (usuarioId != null) {
        await AsyncStorage.setItem("userId", String(usuarioId));
        console.log("[SessionProvider][login] userId salvo no AsyncStorage:", usuarioId);
      } else {
        console.warn("[SessionProvider][login] usuarioId veio nulo na resposta!");
      }

      // ✅ Seta o usuário real no contexto
      setUser({
        idUsuario: usuarioId ?? 0,
        nome: nome || email,
        email: emailResposta || email,
        telefone: undefined,
      });

      console.log("[SessionProvider][login] Usuário setado no contexto");

      return true;
    } catch (error: any) {
      console.error("[SessionProvider][login][ERRO]:", error);

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log(
          "[SessionProvider][login] 401 recebido - credenciais inválidas"
        );
        return false;
      }

      // Outros erros (network, 500, etc) sobem pra tela tratar
      throw error;
    }
  };

  const logout = async () => {
    console.log("[SessionProvider][logout] Limpando sessão");
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userId");
    setUser(null);
  };

  return (
    <SessionContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </SessionContext.Provider>
  );
};

const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

export { SessionProvider, useSession };
