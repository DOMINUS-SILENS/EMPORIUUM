import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface SalesChartProps {
  salesData: { month: string; total_sales: number }[] | null;
  isLoading: boolean;
}

const SalesChart: React.FC<SalesChartProps> = ({ salesData, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!salesData || salesData.length === 0) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Sales Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">No sales data available for the selected period.</p>
        </CardContent>
      </Card>
    );
  }

  const maxSales = Math.max(...salesData.map(d => d.total_sales));

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Sales Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {salesData.map((data, index) => {
            const percentage = maxSales > 0 ? (data.total_sales / maxSales) * 100 : 0;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{data.month}</span>
                  <span className="font-semibold text-gray-900">
                    ${data.total_sales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
