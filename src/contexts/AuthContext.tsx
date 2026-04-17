import React, { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUser } from '../interfaces/User';
import api from '../services/api';
import { authenticateWithKeycloak, fetchKeycloakUserInfo } from '../services/keycloakService';

const STORAGE_SESSION_KEY = '@myapp:session';

type AuthType = 'authenticated' | 'guest';

interface PersistedSession {
  user: IUser;
  authType: AuthType;
  accessToken?: string;
}

interface AuthContextData {
  isAuthenticated: boolean;
  isGuest: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  user: IUser | null;
  accessToken: string | null;
  loginGuest: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [authType, setAuthType] = useState<AuthType | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      setLoading(true);
      try {
        const storedSession = await AsyncStorage.getItem(STORAGE_SESSION_KEY);
        if (!storedSession) return;

        const parsedSession = JSON.parse(storedSession) as PersistedSession;
        setUser(parsedSession.user);
        setAuthType(parsedSession.authType);

        if (parsedSession.accessToken) {
          setAccessToken(parsedSession.accessToken);
          api.defaults.headers.common.Authorization = `Bearer ${parsedSession.accessToken}`;
        }
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  const persistSession = async (session: PersistedSession) => {
    setUser(session.user);
    setAuthType(session.authType);
    setAccessToken(session.accessToken ?? null);

    if (session.accessToken) {
      api.defaults.headers.common.Authorization = `Bearer ${session.accessToken}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }

    await AsyncStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
  };

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      const tokenResponse = await authenticateWithKeycloak(email, senha);
      const userInfo = await fetchKeycloakUserInfo(tokenResponse.access_token);

      const keycloakRoles = userInfo.realm_access?.roles ?? [];
      const usuarioAutenticado: IUser = {
        id: Number.parseInt(userInfo.sub, 16) || Date.now(),
        nome: userInfo.name ?? userInfo.preferred_username ?? userInfo.given_name ?? email,
        email: userInfo.email ?? email,
        permissoes: keycloakRoles.length > 0 ? keycloakRoles : ['USER'],
      };

      await persistSession({
        user: usuarioAutenticado,
        authType: 'authenticated',
        accessToken: tokenResponse.access_token,
      });

      return true;
    } catch (error) {
      console.error('Erro ao autenticar com Keycloak:', error);
      return false;
    }
  };

  const loginGuest = async (): Promise<boolean> => {
    try {
      const guestUser: IUser = {
        id: 0,
        nome: 'Convidado',
        email: 'guest@local',
        permissoes: ['GUEST'],
      };

      await persistSession({
        user: guestUser,
        authType: 'guest',
      });

      return true;
    } catch (error: any) {
      console.error('Erro ao entrar como convidado:', error.message || error);
      return false;
    }
  };

  const logout = async () => {
    setUser(null);
    setAuthType(null);
    setAccessToken(null);
    delete api.defaults.headers.common.Authorization;
    await AsyncStorage.removeItem(STORAGE_SESSION_KEY);
  };

  const isAuthenticated = useMemo(() => !!user && authType === 'authenticated', [user, authType]);
  const isGuest = useMemo(() => !!user && authType === 'guest', [user, authType]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isGuest, login, logout, loading, user, accessToken, loginGuest }}>
      {children}
    </AuthContext.Provider>
  );
};
