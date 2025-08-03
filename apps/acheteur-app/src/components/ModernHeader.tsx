import React, { useState } from 'react';
import { Menu, Search, ShoppingBag, Heart, User, Bell } from 'lucide-react';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Sidebar } from './Sidebar';
import { ShoppingCart } from './ShoppingCart';
import { UserProfile as UserProfilePanel } from './UserProfile';
import { SearchBar } from './SearchBar';
import { FilterPanel } from './FilterPanel';
import { PaymentMethods } from './PaymentMethods';
import { RewardsPanel } from './RewardsPanel';
import { SupportCenter } from './SupportCenter';
import { UserProfile } from '@types/index';

interface ModernHeaderProps {
  onMenuClick?: () => void;
  user: UserProfile;
}

const ModernHeader: React.FC<ModernHeaderProps> = ({ onMenuClick, user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [rewardsOpen, setRewardsOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Menu */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="hover:bg-purple-100"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                COMMERCIUM
              </div>
            </div>

            {/* Search Button */}
            <div className="flex-1 max-w-2xl mx-8">
              <Button
                variant="outline"
                onClick={() => setSearchOpen(true)}
                className="w-full justify-start text-gray-500 border-2 border-gray-200 hover:border-purple-300"
              >
                <Search className="h-4 w-4 mr-2" />
                Recherche IA, vocale, image...
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">3</Badge>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => setCartOpen(true)}
              >
                <Heart className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">12</Badge>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-purple-600">3</Badge>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setProfileOpen(true)}
              >
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Search Bar Overlay */}
        {searchOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg p-6">
            <SearchBar onFilterClick={() => setFilterOpen(true)} />
            <Button 
              variant="ghost" 
              className="absolute top-2 right-2"
              onClick={() => setSearchOpen(false)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        )}
      </header>

      {/* All Panels */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <ShoppingCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <UserProfilePanel isOpen={profileOpen} onClose={() => setProfileOpen(false)} user={user} />
      <FilterPanel isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
      <PaymentMethods isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} />
      <RewardsPanel isOpen={rewardsOpen} onClose={() => setRewardsOpen(false)} />
      <SupportCenter isOpen={supportOpen} onClose={() => setSupportOpen(false)} />
    </>
  );
};

export { ModernHeader };
