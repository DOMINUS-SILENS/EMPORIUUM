// Centralized Auth types for the monorepo
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  // Add other registration fields as needed
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  // Add other response fields as needed
}
