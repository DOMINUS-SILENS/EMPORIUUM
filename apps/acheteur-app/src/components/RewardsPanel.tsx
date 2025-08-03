import React from 'react';
import { X, Gift, Star, Trophy, Calendar, Zap, Crown } from 'lucide-react';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Progress } from '@components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Separator } from '@components/ui/separator';

interface RewardsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const RewardsPanel: React.FC<RewardsPanelProps> = ({ isOpen, onClose }) => {
  const userPoints = 2450;
  const nextTier = 3000;
  const currentTier = 'VIP Gold';

  const rewards = [
    {
      icon: Gift,
      title: 'Bon d\'achat 10€',
      points: 500,
      available: true,
      description: 'Valable sur tout le site'
    },
    {
      icon: Star,
      title: 'Livraison Gratuite',
      points: 200,
      available: true,
      description: 'Sur votre prochaine commande'
    },
    {
      icon: Crown,
      title: 'Accès VIP Platinum',
      points: 5000,
      available: false,
      description: 'Avantages exclusifs'
    }
  ];

  const challenges = [
    {
      title: 'Acheteur du Mois',
      description: 'Effectuez 5 achats ce mois',
      progress: 60,
      reward: '+500 points',
      icon: Trophy
    },
    {
      title: 'Parrain Pro',
      description: 'Parrainez 3 amis',
      progress: 33,
      reward: '+1000 points',
      icon: Star
    },
    {
      title: 'Anniversaire',
      description: 'Connectez-vous le jour J',
      progress: 100,
      reward: 'Cadeau surprise',
      icon: Calendar
    }
  ];

  const vipBenefits = [
    'Livraison gratuite illimitée',
    'Accès aux ventes privées',
    'Support client prioritaire',
    'Retours gratuits',
    'Points bonus x2'
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
            <h2 className="text-2xl font-bold">🎁 Récompenses</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Points Status */}
          <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-4">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-purple-600">{userPoints}</div>
                <div className="text-sm text-gray-600">Points disponibles</div>
                <Badge className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600">
                  {currentTier}
                </Badge>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-sm">
                  <span>Prochain niveau</span>
                  <span>{nextTier - userPoints} points</span>
                </div>
                <Progress value={(userPoints / nextTier) * 100} className="mt-1" />
              </div>
            </CardContent>
          </Card>

          {/* Available Rewards */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">💎 Récompenses Disponibles</h3>
            <div className="space-y-3">
              {rewards.map((reward, index) => (
                <Card key={index} className={`${reward.available ? 'cursor-pointer hover:shadow-md' : 'opacity-50'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <reward.icon className="h-6 w-6 text-purple-600" />
                      <div className="flex-1">
                        <div className="font-semibold">{reward.title}</div>
                        <div className="text-sm text-gray-600">{reward.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-purple-600">{reward.points} pts</div>
                        {reward.available && (
                          <Button size="sm" className="mt-1">
                            Échanger
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Challenges */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">⚡ Challenges Gamifiés</h3>
            <div className="space-y-3">
              {challenges.map((challenge, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <challenge.icon className="h-5 w-5 text-purple-600" />
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{challenge.title}</div>
                        <div className="text-xs text-gray-600">{challenge.description}</div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {challenge.reward}
                      </Badge>
                    </div>
                    <Progress value={challenge.progress} className="h-2" />
                    <div className="text-xs text-gray-500 mt-1">
                      {challenge.progress}% complété
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* VIP Benefits */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <Crown className="h-5 w-5 mr-2 text-yellow-500" />
              Avantages VIP
            </h3>
            <div className="space-y-2">
              {vipBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <Zap className="h-4 w-4 text-purple-500" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { RewardsPanel };
