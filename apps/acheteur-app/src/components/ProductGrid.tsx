
import type { Product } from '@types/products';

interface ProductGridProps {
  user: any; // TODO: Centralize User type as well if not already
}

const ProductGrid: React.FC<ProductGridProps> = ({ user }) => {
  const { products, loading, error, buyProduct } = useAcheteurProducts();
  const [purchasingId, setPurchasingId] = useState<number | null>(null);

  const handlePurchase = async (productId: number, productName: string) => {
    try {
      setPurchasingId(productId);
      await buyProduct(productId);
      toast.success(`Achat réussi: ${productName}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'achat');
    } finally {
      setPurchasingId(null);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Chargement des produits...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">Erreur: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Produits Disponibles
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de produits de qualité
          </p>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun produit disponible pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <img 
                    src="/placeholder.svg" 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  {product.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-blue-600">
                      €{product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Stock: {product.stock}
                    </span>
                  </div>
                  <Button 
                    onClick={() => handlePurchase(product.id, product.name)}
                    disabled={purchasingId === product.id || product.stock === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {purchasingId === product.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Achat en cours...
                      </>
                    ) : product.stock === 0 ? (
                      'Rupture de stock'
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Acheter
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export { ProductGrid };
