import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Vendor {
  id: number;
  full_name: string;
  store: {
    name: string;
    logo_url: string | null;
  } | null;
  total_sales: number;
  total_orders: number;
}

interface TopVendorsProps {
  vendors: Vendor[] | null;
  isLoading: boolean;
}

const SkeletonVendor = () => (
  <div className="flex items-center justify-between p-3">
    <div className="flex items-center space-x-3">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <div className="text-right space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-3 w-16" />
    </div>
  </div>
);

const TopVendors: React.FC<TopVendorsProps> = ({ vendors, isLoading }) => {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Top Vendors
          </CardTitle>
          <Button variant="outline" size="sm" className="text-xs">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {isLoading ? (
            [...Array(4)].map((_, i) => <SkeletonVendor key={i} />)
          ) : !vendors || vendors.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No vendor data available.</p>
          ) : (
            vendors.map((vendor) => {
              const vendorName = vendor.store?.name || vendor.full_name;
              return (
                <div key={vendor.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      {vendor.store?.logo_url && <AvatarImage src={vendor.store.logo_url} />}
                      <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                        {vendorName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm text-gray-900">{vendorName}</p>
                      <p className="text-xs text-gray-500">{vendor.total_orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm text-gray-900">
                      ${vendor.total_sales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-500">Total Sales</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopVendors;
