// Shared authentication utilities for all apps
export interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'vendeur' | 'acheteur' | 'admin';
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

const API_BASE_URL = 'http://localhost:8000';
const TOKEN_KEY = 'ecommerce_token';
const USER_KEY = 'ecommerce_user';

export class AuthService {
  // Store JWT token in localStorage
  static setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  // Get JWT token from localStorage
  static getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // Remove JWT token from localStorage
  static removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  // Store user data in localStorage
  static setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  // Get user data from localStorage
  static getUser(): User | null {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  // Login user with email and password
  static async login(email: string, password: string): Promise<AuthResponse> {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Login failed:', response.status, errorData);
      throw new Error(errorData.detail || 'Login failed');
    }

    const data: AuthResponse = await response.json();
    
    // Store token and user data
    this.setToken(data.access_token);
    this.setUser(data.user);
    
    return data;
  }

  // Register new user
  static async register(userData: {
    email: string;
    password: string;
    fullName: string;
    userType: 'vendeur' | 'acheteur';
  }): Promise<AuthResponse> {
    const payload = {
      email: userData.email,
      password: userData.password,
      full_name: userData.fullName,
      role: userData.userType,
    };
    
    console.log('📦 Payload envoyé à /auth/register :', JSON.stringify(payload, null, 2));
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data: AuthResponse = await response.json();
    
    // Store token and user data
    this.setToken(data.access_token);
    this.setUser(data.user);
    
    return data;
  }

  // Logout user
  static logout(): void {
    this.removeToken();
    // Redirect to welcome app
    window.location.href = 'http://localhost:3000';
  }

  // Get authorization headers for API calls
  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Make authenticated API request
  static async apiRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });

    // If unauthorized, redirect to login
    if (response.status === 401) {
      this.logout();
      throw new Error('Unauthorized');
    }

    return response;
  }

  // Redirect user to appropriate app based on role
  static redirectToApp(role?: string): void {
    const userRole = role || this.getUser()?.role;
    
    switch (userRole) {
      case 'vendeur':
        window.location.href = 'http://localhost:3001';
        break;
      case 'acheteur':
        window.location.href = 'http://localhost:3002';
        break;
      default:
        window.location.href = 'http://localhost:3000';
    }
  }

  // Check if user has required role for current app
  static hasRole(requiredRole: string): boolean {
    const user = this.getUser();
    return user?.role === requiredRole;
  }
}

// App-specific authentication guards
export class AuthGuard {
  // Guard for vendeur app
  static vendeurGuard(): User | null {
    if (!AuthService.isAuthenticated()) {
      window.location.href = 'http://localhost:3000/login';
      return null;
    }

    const user = AuthService.getUser();
    if (user?.role !== 'vendeur') {
      AuthService.redirectToApp(user?.role);
      return null;
    }

    return user;
  }

  // Guard for acheteur app
  static acheteurGuard(): User | null {
    if (!AuthService.isAuthenticated()) {
      window.location.href = 'http://localhost:3000/login';
      return null;
    }

    const user = AuthService.getUser();
    if (user?.role !== 'acheteur') {
      AuthService.redirectToApp(user?.role);
      return null;
    }

    return user;
  }
}

export default AuthService;
