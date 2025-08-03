export const ENV = {
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000/api',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
}; 