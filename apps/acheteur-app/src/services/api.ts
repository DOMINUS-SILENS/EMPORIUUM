
import api from '@utils/api';
import type { Product, Purchase, BuyerStats } from '@types/products';

class AcheteurApiService {
  // Get all available products for purchase
  static async getProducts(params?: any): Promise<Product[]> {
    try {
      const response = await api.get<Product[]>('/products/public', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Create an order for a single product (simplified 'buy now')
  static async buyProduct(productId: number, quantity: number = 1): Promise<Purchase> {
    try {
      // This is a simplified 'buy now' flow. A real app would have a cart.
      // The backend expects a list of items to create an order.
      const orderData = {
        items: [{ product_id: productId, quantity }],
        // In a real app, shipping info and payment details would be here
      };
      const response = await api.post<Purchase>('/orders/', orderData);
      return response.data;
    } catch (error) {
      console.error('Error purchasing product:', error);
      throw error;
    }
  }

  // Get buyer's purchase history
  static async getPurchases(): Promise<Purchase[]> {
    try {
      // This endpoint should return orders for the authenticated user
      const response = await api.get<Purchase[]>('/orders/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching purchases:', error);
      throw error;
    }
  }

  // Get buyer dashboard statistics from a dedicated endpoint
  static async getBuyerStats(): Promise<BuyerStats> {
    try {
      const response = await api.get<BuyerStats>('/analytics/acheteur/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching buyer stats:', error);
      throw error;
    }
  }
}

export default AcheteurApiService;

