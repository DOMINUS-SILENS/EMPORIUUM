import React from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Separator } from '@components/ui/separator';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ isOpen, onClose }) => {
  const cartItems: CartItem[] = [
    { id: '1', name: 'Sneakers Trendy', price: 89.99, quantity: 1, image: '/placeholder.svg' },
    { id: '2', name: 'Hoodie Vintage', price: 59.99, quantity: 2, image: '/placeholder.svg' },
    { id: '3', name: 'Casquette Street', price: 29.99, quantity: 1, image: '/placeholder.svg' },
  ];

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Panier Intelligent</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-purple-600 font-bold">{item.price}€</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="ghost" size="icon" className="text-red-500">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-purple-600">{total.toFixed(2)}€</span>
            </div>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Procéder au Paiement
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export { ShoppingCart };
