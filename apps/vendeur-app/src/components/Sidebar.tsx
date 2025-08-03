import {
  Store, Package, ShoppingCart, BarChart3, Megaphone, MessageCircle, Shield, Settings, Home, Users
} from 'lucide-react';
import { Sidebar as SharedSidebar, SidebarMenuItem } from '@monorepo/ui-core/components/Sidebar';

interface SidebarProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems: SidebarMenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'store', label: 'Ma Boutique', icon: Store },
  { id: 'products', label: 'Produits', icon: Package },
  { id: 'orders', label: 'Commandes', icon: ShoppingCart },
  { id: 'analytics', label: 'Analyses', icon: BarChart3 },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
  { id: 'customers', label: 'Clients', icon: Users },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'security', label: 'Sécurité', icon: Shield },
  { id: 'settings', label: 'Paramètres', icon: Settings },
];

const VendeurSidebar: React.FC<SidebarProps> = ({ isOpen, activeTab, onTabChange }) => (
  <SharedSidebar
    isOpen={isOpen}
    menuItems={menuItems.map(item => ({
      ...item,
      active: activeTab === item.id,
      onClick: () => onTabChange(item.id)
    }))}
    header={
      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Vendeur
      </h2>
    }
    className="w-64 bg-gray-900 text-white"
  />
);

export default VendeurSidebar;
