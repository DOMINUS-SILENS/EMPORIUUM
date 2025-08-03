import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Skeleton } from './skeleton';

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
  color?: string;
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, color, loading }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {Icon && <Icon className={`h-5 w-5 ${color}`} />}
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </>
        ) : (
          <div className="text-2xl font-bold text-gray-900">{value}</div>
        )}
      </CardContent>
    </Card>
  );
};
