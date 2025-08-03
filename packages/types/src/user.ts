export interface User {
  id: number;
  email: string;
  full_name?: string;
  is_active: boolean;
  role: 'vendeur' | 'acheteur' | 'admin';
  created_at: string;
  updated_at?: string;
  // Add other user properties as needed
}
