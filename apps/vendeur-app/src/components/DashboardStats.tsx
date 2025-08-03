import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { DashboardStatsData } from '@/services/api';

interface DashboardStatsProps {
  stats?: DashboardStatsData;
  loading: boolean;
}

import { StatCard } from '@ui-core/StatCard';

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, loading }) => {
  const statsList = [
    {
      title: 'Ventes du Mois',
      value: `€${stats?.monthly_sales?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Commandes',
      value: stats?.orders_count?.toString() || '0',
      icon: ShoppingCart,
      color: 'text-blue-600',
    },
    {
      title: 'Clients Actifs',
      value: stats?.active_clients_count?.toString() || '0',
      icon: Users,
      color: 'text-purple-600',
    },
    {
      title: 'Produits',
      value: stats?.products_count?.toString() || '0',
      icon: Package,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsList.map((stat) => (
        <StatCard key={stat.title} {...stat} loading={loading} />
      ))}
    </div>
  );
};


export default DashboardStats;
