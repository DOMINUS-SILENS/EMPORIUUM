import React from 'react';
import { X, CreditCard, Smartphone, Bitcoin, MapPin, Shield } from 'lucide-react';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Separator } from '@components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';

interface PaymentMethodsProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ isOpen, onClose }) => {
  const paymentMethods = [
    {
      icon: CreditCard,
      title: 'Carte Bancaire',
      description: 'Visa, Mastercard, CB',
      badge: '100% Sécurisé',
      color: 'text-blue-600'
    },
    {
      icon: Smartphone,
      title: 'Wallets Numériques',
      description: 'Apple Pay, Google Pay, PayPal',
      badge: 'Instantané',
      color: 'text-green-600'
    },
    {
      icon: Bitcoin,
      title: 'Crypto-monnaies',
      description: 'Bitcoin, Ethereum, USDT',
      badge: 'Nouveau',
      color: 'text-orange-600'
    }
  ];

  const deliveryOptions = [
    {
      icon: MapPin,
      title: 'Livraison à Domicile',
      description: 'Suivi temps réel',
      time: '24-48h'
    },
    {
      icon: MapPin,
      title: 'Points Relais',
      description: 'Réseau national',
      time: '2-3 jours'
    },
    {
      icon: MapPin,
      title: 'Express',
      description: 'Livraison rapide',
      time: '2-4h'
    }
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
            <h2 className="text-2xl font-bold">💳 Paiements & Livraison</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Security Badge */}
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">Transactions 100% Sécurisées</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Chiffrement SSL et protection anti-fraude
            </p>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Moyens de Paiement</h3>
            <div className="space-y-3">
              {paymentMethods.map((method, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <method.icon className={`h-6 w-6 ${method.color}`} />
                      <div className="flex-1">
                        <div className="font-semibold">{method.title}</div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                      </div>
                      <Badge variant="secondary">{method.badge}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Delivery Options */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Options de Livraison</h3>
            <div className="space-y-3">
              {deliveryOptions.map((option, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <option.icon className="h-6 w-6 text-purple-600" />
                      <div className="flex-1">
                        <div className="font-semibold">{option.title}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </div>
                      <Badge variant="outline">{option.time}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Features */}
          <div className="space-y-4">
            <h3 className="font-semibold">✨ Avantages</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Suivi colis en temps réel</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Remboursement garanti</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Support client 24/7</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Livraison gratuite dès 50€</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { PaymentMethods };
