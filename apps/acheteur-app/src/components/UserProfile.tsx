import React from 'react';
import { X, User, Star, Gift, Trophy, Calendar, Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Progress } from '@components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Separator } from '@components/ui/separator';
import { UserProfile as UserProfileType } from '@types/index';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfileType;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose, user }) => {
  const userStats = {
    points: user.loyaltyPoints || 2450,
    nextLevel: 3000,
    orders: user.orderHistory?.length || 0,
    wishlist: user.wishlist?.length || 0,
    level: 'VIP Gold' // This can be calculated based on points
  };

  const achievements = [
    { icon: Trophy, title: 'Premier Achat', earned: true },
    { icon: Star, title: 'Client Fidèle', earned: true },
    { icon: Gift, title: 'Parrain Pro', earned: false },
    { icon: Calendar, title: 'Anniversaire', earned: true }
  ];

  const recentOrders = [
    { id: '1234', date: '2024-01-15', total: 89.99, status: 'Livré' },
    { id: '1235', date: '2024-01-10', total: 159.99, status: 'En transit' },
    { id: '1236', date: '2024-01-05', total: 45.50, status: 'Livré' }
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 z-50 overflow-y-auto ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Mon Profil</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="text-center mb-6">
            <Avatar className="w-20 h-20 mx-auto mb-4">
              <AvatarImage src={user.avatarUrl || '/placeholder.svg'} />
              <AvatarFallback>{user.firstName?.[0] || 'U'}{user.lastName?.[0] || 'D'}</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold">{user.firstName} {user.lastName}</h3>
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              {userStats.level}
            </Badge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <ShoppingBag className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">{userStats.orders}</div>
              <div className="text-sm text-gray-600">Commandes</div>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <Heart className="h-6 w-6 mx-auto mb-2 text-pink-600" />
              <div className="text-2xl font-bold text-pink-600">{userStats.wishlist}</div>
              <div className="text-sm text-gray-600">Favoris</div>
            </div>
          </div>

          {/* Points Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Points Fidélité</span>
              <span className="text-purple-600 font-bold">{userStats.points}/{userStats.nextLevel}</span>
            </div>
            <Progress value={(userStats.points / userStats.nextLevel) * 100} className="h-3" />
            <p className="text-sm text-gray-600 mt-1">
              {userStats.nextLevel - userStats.points} points pour le niveau suivant
            </p>
          </div>

          <Separator className="my-6" />

          {/* Achievements */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3">🏆 Achievements</h4>
            <div className="grid grid-cols-2 gap-2">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 text-center ${
                    achievement.earned
                      ? 'border-purple-200 bg-purple-50'
                      : 'border-gray-200 bg-gray-50 opacity-50'
                  }`}
                >
                  <achievement.icon className={`h-6 w-6 mx-auto mb-1 ${
                    achievement.earned ? 'text-purple-600' : 'text-gray-400'
                  }`} />
                  <div className="text-xs font-medium">{achievement.title}</div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Recent Orders */}
          <div>
            <h4 className="font-semibold mb-3">📦 Commandes Récentes</h4>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">#{order.id}</div>
                      <div className="text-sm text-gray-600">{order.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{order.total}€</div>
                      <Badge variant={order.status === 'Livré' ? 'default' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { UserProfile };
