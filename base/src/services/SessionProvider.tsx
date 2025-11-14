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
      const payload = {
        username: email, 
        password,
      };

      console.log("[SessionProvider][login] Payload enviado:", payload);

      const response = await apiClient.post("/auth/login", payload);

      console.log("[SessionProvider][login] Resposta recebida:", response.data);

      const { token, tokenType } = response.data as {
        token: string | null;
        tokenType: string;
      };

      if (!token) {
        console.log(
          "[SessionProvider][login] Token veio nulo. Provavelmente credenciais inválidas."
        );
        return false;
      }

      await AsyncStorage.setItem("token", token);
      console.log("[SessionProvider][login] Token salvo no AsyncStorage");

      // Como o /auth/login não retorna dados do usuário,
      // criamos um user mínimo aqui. Depois você pode buscar /usuarios/me.
      setUser({
        idUsuario: 0,
        nome: email,
        email: email,
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

      // Se for Network Error / timeout, repassamos para a tela de Login tratar
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
