import api from '@monorepo/utils/lib/api';
import { Product, ProductCreate } from '@monorepo/types/products';

class VendeurApiService {
  static async getProducts(): Promise<Product[]> {
    const response = await api.get<Product[]>('/products');
    return response.data;
  }

  static async createProduct(product: ProductCreate): Promise<Product> {
    const response = await api.post<Product>('/products', product);
    return response.data;
  }

  static async updateProduct(id: number, updates: ProductCreate): Promise<Product> {
    const response = await api.put<Product>(`/products/${id}`, updates);
    return response.data;
  }

  static async deleteProduct(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
  }
}

export default VendeurApiService;
