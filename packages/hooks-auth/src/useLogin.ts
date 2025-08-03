// Shared authentication hook: useLogin
import { useState } from 'react';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    // Fake login logic
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    // setError('Invalid credentials'); // Uncomment to simulate error
  };

  return { login, loading, error };
} 