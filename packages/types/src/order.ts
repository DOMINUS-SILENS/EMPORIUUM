export interface OrderItem {
  product: {
    name: string;
  };
}

export interface Order {
  id: number;
  total_amount: number;
  status: string;
  created_at: string;
  user: {
    full_name: string;
  };
  items: OrderItem[];
}
