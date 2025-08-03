import { api } from './api-client';
import type { AuthResponse, User, ApiResponse } from '@types';

export class AuthService {
  private static readonly TOKEN_KEY = 'token';
  private static readonly USER_KEY = 'user';

  static async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem(this.TOKEN_KEY, response.data.access_token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.data.user));
    }
    return response;
  }

  static async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  }

  static async getCurrentUser(): Promise<ApiResponse<User>> {
    return api.get('/auth/me');
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  static getStoredUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}

export default AuthService;
