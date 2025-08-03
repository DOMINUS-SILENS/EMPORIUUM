import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Store,
  Ticket,
  BarChart3,
  Settings,
  Package
} from 'lucide-react';
import { Sidebar } from '@monorepo/ui-core/components/Sidebar';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: ShoppingCart, label: 'Orders', badge: '12' },
  { icon: Package, label: 'Products' },
  { icon: Users, label: 'Customers' },
  { icon: Store, label: 'Vendors' },
  { icon: Ticket, label: 'Coupons' },
  { icon: BarChart3, label: 'Analytics' },
  { icon: Settings, label: 'Settings' }
];

const AdminSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <Sidebar
    isOpen={isOpen}
    onClose={onClose}
    menuItems={menuItems}
    header={
      <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        ShopifyPro
      </h1>
    }
  />
);

export default AdminSidebar;
