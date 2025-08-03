export type UserRole = 'buyer' | 'seller' | 'admin';

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Livré' | 'En transit' | 'Annulé';
}

export interface WishlistItem {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  loyaltyPoints?: number;
  orderHistory?: Order[];
  wishlist?: WishlistItem[];
}