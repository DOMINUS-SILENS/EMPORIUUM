export * from '@hooks/AuthContext';

import { AuthContext } from "@hooks/auth/contexts/AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Exemples de fonctions à adapter
  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      // TODO: remplacer par votre logique d’authentification
      setUser({ id: '1', email: credentials.email, role: 'user' });
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    try {
      // TODO: remplacer par votre logique d’inscription
      setUser({ id: '2', email: userData.email, role: userData.role || 'user' });
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const contextValue = useMemo(() => ({
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    error,
  }), [user, loading, login, register, logout, error]);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
