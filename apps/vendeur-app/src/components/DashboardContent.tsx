import React, { useEffect, useState } from 'react';
import DashboardStats from './DashboardStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import VendeurApiServiceClass, { VendeurDashboardData } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardContent: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<VendeurDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await VendeurApiServiceClass.getDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError('Erreur lors de la récupération des données du dashboard.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Aperçu de votre boutique en ligne</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Produit
        </Button>
      </div>

      <DashboardStats loading={loading} stats={dashboardData?.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Commandes Récentes
              <Button variant="outline" size="sm">
                Voir tout
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3">
                    <div className="space-y-2">
                      <Skeleton style={{ height: '1rem', width: '6rem' }} />
                      <Skeleton style={{ height: '0.75rem', width: '8rem' }} />
                    </div>
                    <div className="text-right space-y-2">
                      <Skeleton style={{ height: '1rem', width: '4rem' }} />
                      <Skeleton style={{ height: '1.25rem', width: '5rem' }} />
                    </div>
                  </div>
                ))
              ) : (
                dashboardData?.recent_orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">#{order.id}</p>
                      <p className="text-sm text-gray-600">{order.user.full_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">€{order.total_amount.toFixed(2)}</p>
                      <Badge variant={order.status === 'LIVRE' ? 'default' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produits Top Ventes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3">
                    <div className="space-y-2">
                      <Skeleton style={{ height: '1rem', width: '8rem' }} />
                      <Skeleton style={{ height: '0.75rem', width: '6rem' }} />
                    </div>
                    <Skeleton style={{ height: '1rem', width: '5rem' }} />
                  </div>
                ))
              ) : (
                dashboardData?.top_products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.total_sales} ventes</p>
                    </div>
                    <p className="font-medium text-green-600">€{product.total_revenue.toFixed(2)}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardContent;
