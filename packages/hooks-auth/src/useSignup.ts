// Shared authentication hook: useSignup
import { useState } from 'react';

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    // Fake signup logic
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    // setError('Signup failed'); // Uncomment to simulate error
  };

  return { signup, loading, error };
} 