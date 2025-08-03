// Centralized authentication service for the monorepo
export const authService = {
  getToken(): string | null {
    // Example: retrieve token from localStorage (adapt as needed)
    return localStorage.getItem('access_token');
  },
  // Add other shared auth methods here (login, logout, refresh, etc.)
};
