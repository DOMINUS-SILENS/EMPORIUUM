import { useState, useEffect } from 'react';
import AcheteurApiService from '@monorepo/utils/services/achteurApiService';
import { Product, Purchase } from '@monorepo/types/products';

export const useAcheteurProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await AcheteurApiService.getProducts();
      setProducts(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const buyProduct = async (productId: number): Promise<Purchase> => {
    try {
      const purchase = await AcheteurApiService.buyProduct(productId);
      await fetchProducts();
      return purchase;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to purchase product');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    buyProduct,
    refetch: fetchProducts,
  };
};
