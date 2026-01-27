import React, { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { IUser } from '../interfaces/User';

interface AuthContextData {
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  user: IUser | null;
  loginTeste: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const storedUser = await AsyncStorage.getItem('@myapp:user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Erro ao carregar o usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth', { email, senha });
      if (response.status !== 204) {
        throw new Error("Falha na autenticação: status inesperado");
      }

      const usersResponse = await api.get<{ data: IUser[] }>('/users');
      const userArray = usersResponse.data.data;

      const userEncontrado = userArray.find((item) => item.email === email);
      if (!userEncontrado) {
        throw new Error("Usuário não encontrado após autenticação");
      }

      setUser(userEncontrado);
      await AsyncStorage.setItem('@myapp:user', JSON.stringify(userEncontrado));

      return true; // Sucesso no login
    } catch (error) {
      console.error("Erro ao autenticar:", error);
      return false; // Falha no login
    }
  };

  const loginTeste = async (): Promise<boolean> => {
    try {
      // Dados simulados do usuário
      const user = {
        id: 1,
        nome: "Manejador",
        email: "generic@email.com",
        permissoes: ["USER"],
      };

      // Simula o login bem-sucedido
      setUser(user);

      // Armazena o usuário localmente
      await AsyncStorage.setItem('@myapp:user', JSON.stringify(user));

      console.log("Usuário autenticado com sucesso:", user);
      return true; // Login simulado com sucesso
    } catch (error: any) {
      console.error("Erro ao autenticar:", error.message || error);
      return false; // Caso algo dê errado na simulação
    }
  };


  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('@myapp:user');
  };

  const isAuthenticated = useMemo(() => !!user, [user]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, user, loginTeste }}>
      {children}
    </AuthContext.Provider>
  );
};
