// packages/services/src/authService.ts

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
  return response.data;
};

export const logout = async (): Promise<void> => {
  // Ceci est un placeholder : selon ta logique backend, tu peux ajouter ici une requête pour invalider le token
  console.log('Logged out.');
};

export const getProfile = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
