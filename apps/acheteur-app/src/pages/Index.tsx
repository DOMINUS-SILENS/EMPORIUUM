
import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { AppProvider } from '@hooks/shared/contexts/AppContext';
import { AuthGuard, User } from '@utils/auth';

const Index: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication and role
    const currentUser = AuthGuard.acheteurGuard();
    setUser(currentUser);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification des autorisations...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // AuthGuard will handle redirect
  }

  return (
    <AppProvider>
      <AppLayout user={user} />
    </AppProvider>
  );
};

export default Index;

