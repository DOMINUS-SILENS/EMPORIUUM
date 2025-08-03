import { useState, useEffect } from 'react';
import VendeurApiService from '@monorepo/utils/services/vendeurApiService';
import { Product, ProductCreate } from '@monorepo/types/products';

export const useVendeurProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await VendeurApiService.getProducts();
      setProducts(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (product: ProductCreate) => {
    try {
      const data = await VendeurApiService.createProduct(product);
      await fetchProducts();
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create product');
    }
  };

  const updateProduct = async (id: number, updates: ProductCreate) => {
    try {
      const data = await VendeurApiService.updateProduct(id, updates);
      await fetchProducts();
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update product');
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await VendeurApiService.deleteProduct(id);
      await fetchProducts();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts
  };
};
