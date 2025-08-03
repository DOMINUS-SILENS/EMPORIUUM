import { api } from './api-client';
import type {
  Product,
  ProductCreate,
  ProductUpdate,
  ApiResponse,
  PaginationParams
} from '@types';

export class ProductService {
  static async getProducts(params?: PaginationParams): Promise<ApiResponse<Product[]>> {
    return api.get('/products', { params });
  }

  static async getProduct(id: number): Promise<ApiResponse<Product>> {
    return api.get(`/products/${id}`);
  }

  static async createProduct(product: ProductCreate): Promise<ApiResponse<Product>> {
    return api.post('/products', product);
  }

  static async updateProduct(id: number, product: ProductUpdate): Promise<ApiResponse<Product>> {
    return api.put(`/products/${id}`, product);
  }

  static async deleteProduct(id: number): Promise<ApiResponse<void>> {
    return api.delete(`/products/${id}`);
  }

  static async getPublicProducts(params?: PaginationParams): Promise<ApiResponse<Product[]>> {
    return api.get('/products/public', { params });
  }
}

export default ProductService;
