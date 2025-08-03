import { api } from './api-client';
import type {
  Order,
  CreateOrderDTO,
  OrderStats,
  ApiResponse,
  PaginationParams
} from '@types';

export class OrderService {
  static async getOrders(params?: PaginationParams): Promise<ApiResponse<Order[]>> {
    return api.get('/orders', { params });
  }

  static async getOrder(id: number): Promise<ApiResponse<Order>> {
    return api.get(`/orders/${id}`);
  }

  static async createOrder(orderData: CreateOrderDTO): Promise<ApiResponse<Order>> {
    return api.post('/orders', orderData);
  }

  static async cancelOrder(id: number): Promise<ApiResponse<void>> {
    return api.post(`/orders/${id}/cancel`);
  }

  static async getOrderStats(): Promise<ApiResponse<OrderStats>> {
    return api.get('/orders/stats');
  }
}

export default OrderService;
