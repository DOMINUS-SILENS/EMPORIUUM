import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Store,
} from 'lucide-react';

interface StatsCardsProps {
  stats: {
    total_revenue: number;
    total_orders: number;
    total_customers: number;
    total_vendors: number;
  } | null;
  isLoading: boolean;
}

const SkeletonCard = () => (
  <Card className="relative overflow-hidden border-0 shadow-lg">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-7 w-1/3 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </CardContent>
  </Card>
);

const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center text-red-500">Failed to load stats.</div>;
  }

  const statsData = [
    {
      title: 'Total Revenue',
      value: `$${(stats.total_revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Orders',
      value: (stats.total_orders || 0).toLocaleString(),
      icon: ShoppingCart,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Customers',
      value: (stats.total_customers || 0).toLocaleString(),
      icon: Users,
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Vendors',
      value: (stats.total_vendors || 0).toLocaleString(),
      icon: Store,
      color: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <p className="text-xs text-gray-500">Total count</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;
