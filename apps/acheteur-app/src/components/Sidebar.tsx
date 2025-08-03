import {
  X, ShoppingBag, Search, Filter, Heart, User, CreditCard, Gift, HeadphonesIcon, Settings, Sparkles
} from 'lucide-react';
import { Sidebar as SharedSidebar } from '@monorepo/ui-core/components/Sidebar';

const menuItems = [
  { icon: ShoppingBag, label: 'Catalogue', badge: 'New' },
  { icon: Search, label: 'Recherche Avancée' },
  { icon: Filter, label: 'Filtres Intelligents' },
  { icon: ShoppingBag, label: 'Mon Panier', badge: '3' },
  { icon: Heart, label: 'Wishlist', badge: '12' },
  { icon: Sparkles, label: 'Recommandations IA' },
  { icon: User, label: 'Mon Profil' },
  { icon: ShoppingBag, label: 'Historique Achats' },
  { icon: Settings, label: 'Préférences' },
  { icon: CreditCard, label: 'Paiements & Livraison' },
  { icon: Gift, label: 'Récompenses', badge: 'VIP' },
  { icon: HeadphonesIcon, label: 'Support Client' },
];

const AcheteurSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <>
    {isOpen && (
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
    )}
    <SharedSidebar
      isOpen={isOpen}
      onClose={onClose}
      menuItems={menuItems}
      header={
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          COMMERCIUM
        </h2>
      }
      className="w-80 bg-gradient-to-b from-purple-50 to-pink-50 shadow-xl"
    />
  </>
);

export { AcheteurSidebar as Sidebar };
