// Service centralisé pour les produits acheteur
import api from '@utils/api';
import { Product, Purchase } from '@types/products';

class AcheteurApiService {
  static async getProducts(params?: any): Promise<Product[]> {
    try {
      const response = await api.get<Product[]>('/products/public', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  static async buyProduct(productId: number): Promise<Purchase> {
    try {
      const response = await api.post<Purchase>(`/products/buy/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error buying product:', error);
      throw error;
    }
  }
}

export default AcheteurApiService;
