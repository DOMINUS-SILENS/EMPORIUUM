import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Define application URLs
const APP_URLS = {
  WELCOME: 'http://localhost:3000',
  VENDEUR: 'http://localhost:3001',
  ACHETEUR: 'http://localhost:3002',
};

// Create axios instance with base URL and default headers
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and role-based redirection
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // If we haven't already tried to refresh the token
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // No refresh token, redirect to login
          localStorage.removeItem('access_token');
          window.location.href = `${APP_URLS.WELCOME}/login`;
          return Promise.reject(error);
        }

        try {
          const response = await axios.post(
            'http://localhost:8000/api/v1/auth/refresh-token',
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );
          
          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);
          
          // Retry the original request with the new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }
          return api(originalRequest);
        } catch (refreshError) {
          // If refresh fails, log the user out
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = `${APP_URLS.WELCOME}/login`;
          return Promise.reject(refreshError);
        }
      }
    }
    
    // Handle 403 Forbidden (role-based access control)
    if (error.response?.status === 403) {
      // Redirect to the appropriate app based on user role
      const userRole = localStorage.getItem('user_role');
      if (userRole === 'vendeur') {
        window.location.href = APP_URLS.VENDEUR;
      } else if (userRole === 'acheteur') {
        window.location.href = APP_URLS.ACHETEUR;
      } else {
        // If no role is set, redirect to welcome app
        window.location.href = APP_URLS.WELCOME;
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function to get the appropriate app URL based on user role
export const getAppUrl = (role: string): string => {
  switch (role) {
    case 'vendeur':
      return APP_URLS.VENDEUR;
    case 'acheteur':
      return APP_URLS.ACHETEUR;
    default:
      return APP_URLS.WELCOME;
  }
};

// Helper function to redirect to the appropriate app based on user role
export const redirectToApp = (role: string): void => {
  window.location.href = getAppUrl(role);
};

export default api;
