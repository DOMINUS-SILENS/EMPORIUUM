import axios from 'axios';
import { authService } from '@services/authService';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
});

apiClient.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAdminDashboardData = async () => {
  try {
    const response = await apiClient.get('/analytics/admin/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    throw error;
  }
};

export default apiClient;

