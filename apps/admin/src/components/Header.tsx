import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  Menu,
  Search,
  ShoppingCart,
  MessageSquare,
  ChevronDown
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products, orders, customers..."
              className="pl-10 w-80 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <MessageSquare className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-blue-500">
              3
            </Badge>
          </Button>
          
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500">
              5
            </Badge>
          </Button>
          
          <Button variant="ghost" size="sm" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-green-500">
              2
            </Badge>
          </Button>

          <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
