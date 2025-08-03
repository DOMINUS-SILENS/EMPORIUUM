import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

// TODO: à centraliser — voir packages/types/order.ts
interface OrderItem {
  product: {
    name: string;
  };
}

// TODO: à centraliser — voir packages/types/order.ts
interface Order {
  id: number;
  total_amount: number;
  status: string;
  created_at: string;
  user: {
    full_name: string;
  };
  items: OrderItem[];
}

interface RecentOrdersProps {
  orders: Order[] | null;
  isLoading: boolean;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800 hover:bg-green-100';
    case 'processing':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
    case 'cancelled':
      return 'bg-red-100 text-red-800 hover:bg-red-100';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  }
};

const SkeletonOrder = () => (
  <div className="flex items-center justify-between p-3">
    <div className="flex items-center space-x-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
    <div className="flex items-center space-x-3">
      <div className="text-right space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-12" />
      </div>
      <Skeleton className="h-6 w-20 rounded-md" />
      <Skeleton className="h-8 w-8 rounded-md" />
    </div>
  </div>
);

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders, isLoading }) => {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Recent Orders
          </CardTitle>
          <Button variant="outline" size="sm" className="text-xs">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {isLoading ? (
            [...Array(5)].map((_, i) => <SkeletonOrder key={i} />)
          ) : !orders || orders.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No recent orders found.</p>
          ) : (
            orders.map((order) => {
              const customerName = order.user.full_name;
              const productSummary = order.items.length > 0 ? `${order.items[0].product.name}${order.items.length > 1 ? ` & ${order.items.length - 1} more` : ''}` : 'N/A';

              return (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                        {customerName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm text-gray-900">{customerName}</p>
                      <p className="text-xs text-gray-500">#{order.id} • {productSummary}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-semibold text-sm text-gray-900">
                        ${order.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} capitalize`}>
                      {order.status}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
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

export default RecentOrders;
