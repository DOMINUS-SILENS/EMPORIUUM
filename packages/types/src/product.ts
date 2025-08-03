export interface ProductBase {
  id: number;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  image: string;
  rating: number;
  reviews: number;
  vendeurId: number;
  isNew?: boolean;
  isSale?: boolean;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreate extends Omit<ProductBase, 'id' | 'createdAt' | 'updatedAt' | 'vendeurId'> {
  // Champs requis pour la création
  name: string;
  price: number;
  stock: number;
}

export interface ProductUpdate extends Partial<ProductCreate> {
  // Permet une mise à jour partielle
}

export interface ProductWithVendeur extends ProductBase {
  vendeur: {
    id: number;
    storeName: string;
    rating: number;
  };
}

export type Product = ProductBase;

// Stats et métriques
export interface ProductStats {
  totalSales: number;
  totalRevenue: number;
  averageRating: number;
  reviewCount: number;
}
