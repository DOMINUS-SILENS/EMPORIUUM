
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@monorepo/utils/services/authService';
import { User } from '@monorepo/types/user.zod';


type UserRole = 'vendeur' | 'acheteur' | 'admin';
type Email = string;
type Password = string;

export type LoginCredentials = {
  email: Email;
  password: Password;
};

export type RegisterData = {
  email: Email;
  password: Password;
  full_name: string;
  role: UserRole;
} & Record<string, unknown>;

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  error: Error | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Séparation de l'initialisation de l'authentification
const useAuthInitialization = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Authentication error'));
        authService.logout();
      } finally {
        setLoading(false);
      }
    };
    void checkAuth();
  }, []);

  return { user, setUser, loading, error };
};


export const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const navigate = useNavigate();
  const { user, setUser, loading, error } = useAuthInitialization();

  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    try {
      const userData = await authService.login(credentials);
      setUser(userData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Login failed');
      throw error;
    }
  }, [setUser]);

  const register = useCallback(async (userData: RegisterData): Promise<void> => {
    try {
      const newUser = await authService.register(userData);
      setUser(newUser);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Registration failed');
      throw error;
    }
  }, [setUser]);

  const logout = useCallback((): void => {
    authService.logout();
    setUser(null);
    navigate('/login');
  }, [navigate, setUser]);

  const contextValue = useMemo<AuthContextType>(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    error,
  }), [user, loading, login, register, logout, error]);

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};


export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
