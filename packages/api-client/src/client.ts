import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
}); 