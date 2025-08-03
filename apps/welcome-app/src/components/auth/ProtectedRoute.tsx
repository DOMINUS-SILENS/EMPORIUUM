import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string[];
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login');
    } else if (!loading && isAuthenticated && requiredRole && !requiredRole.includes(user?.role || '')) {
      // Redirect to unauthorized page if user doesn't have the required role
      navigate('/unauthorized');
    }
  }, [isAuthenticated, loading, navigate, requiredRole, user?.role]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && !requiredRole.includes(user?.role || '')) {
    return null;
  }

  return <>{children}</>;
};
