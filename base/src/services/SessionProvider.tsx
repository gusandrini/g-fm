import { createContext, PropsWithChildren, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../api/apiClient";

interface User {
  idFuncionario: number;
  nome: string;
  email: string;
  cargo: string;
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
    try {
      const response = await apiClient.post("/auth/login", { email, password });

      const { token, idFuncionario, nome, email: userEmail, cargo } = response.data;

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userId", idFuncionario.toString());

      setUser({ idFuncionario, nome, email: userEmail, cargo });

      return true;
    } catch (error: any) {
      
      if (error.response && error.response.status === 401) {
        return false;
      }

      console.error("Erro inesperado no login:", error);
      return false;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userId");
    setUser(null);
  };

  return (
    <SessionContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
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
