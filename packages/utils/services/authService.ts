// Shared API client functions

export async function fetchUser(userId: string) {
  // Example fetch call
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
} 
import { z } from 'zod';
import { LoginCredentials } from '@utils/contexts/AuthContext';
import api from '@utils/lib/api';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  full_name: z.string().min(2),
  is_active: z.boolean(),
  role: z.enum(['vendeur', 'acheteur', 'admin']),
  created_at: z.string(),
  updated_at: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const RegisterDataSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  full_name: z.string().min(2),
  role: z.enum(['vendeur', 'acheteur', 'admin']),
});

export type RegisterData = z.infer<typeof RegisterDataSchema>;

export const authService = {
  async login(credentials: LoginCredentials) {
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }

    const userResponse = await api.get('/auth/me');
    const userData = userResponse.data;
    if (userData.role) {
      localStorage.setItem('user_role', userData.role);
      this.redirectToApp(userData.role);
    }
    return userData;
  },

  async register(userData: RegisterData) {
    const response = await api.post('/auth/register', userData);
    const user = response.data;
    if (user.role) {
      localStorage.setItem('user_role', user.role);
    }
    if (user.email && userData.password) {
      return this.login({ email: user.email, password: userData.password });
    }
    return user;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    const userData = response.data;
    if (userData.role && localStorage.getItem('user_role') !== userData.role) {
      localStorage.setItem('user_role', userData.role);
    }
    return userData;
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    window.location.href = 'http://localhost:3000/login';
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },

  getUserRole(): string | null {
    return localStorage.getItem('user_role');
  },

  redirectToApp(role?: string) {
    const userRole = role || this.getUserRole();
    if (userRole === 'vendeur') {
      window.location.href = 'http://localhost:3001';
    } else if (userRole === 'acheteur') {
      window.location.href = 'http://localhost:3002';
    } else {
      window.location.href = 'http://localhost:3000';
    }
  },

  getToken(): string | null {
    return localStorage.getItem('access_token');
  },
};
