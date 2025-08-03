// Type utilisé pour la création/mise à jour de produit côté vendeur
export interface ProductCreate {
  name: string;
  price: number;
  description?: string;
  stock: number;
}
// Types for products and purchases (centralisé depuis achteur-app)
export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  stock: number;
  vendeur_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface Purchase {
  id: number;
  user_id: number;
  product_id: number;
  product: Product;
  created_at: string;
}

export interface BuyerStats {
  totalPurchases: number;
  totalSpent: number;
  recentPurchases: Purchase[];
  availableProducts: Product[];
}
