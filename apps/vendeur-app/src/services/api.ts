import api from '@utils/services/api';

// Type definitions based on the backend vendeur dashboard endpoint

export interface DashboardStatsData {
  monthly_sales: number;
  orders_count: number;
  active_clients_count: number;
  products_count: number;
}

export interface RecentOrderData {
  id: number;
  total_amount: number;
  status: string;
  created_at: string;
  user: {
    full_name: string;
  };
}

export interface TopProductData {
  id: number;
  name: string;
  total_sales: number;
  total_revenue: number;
}

export interface VendeurDashboardData {
  stats: DashboardStatsData;
  recent_orders: RecentOrderData[];
  top_products: TopProductData[];
}

class VendeurApiService {
  /**
   * Fetches all the necessary data for the vendeur dashboard in a single call.
   */
  static async getDashboardData(): Promise<VendeurDashboardData> {
    try {
      const response = await api.get<VendeurDashboardData>('/analytics/vendeur/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching vendeur dashboard data:', error);
      // It's good practice to throw the error so the calling component can handle it
      throw error;
    }
  }

  // Product management methods can remain if they are used elsewhere,
  // for example, in a dedicated 'Products' page.
  // For now, we are focusing on the dashboard.
}

export default VendeurApiService;

