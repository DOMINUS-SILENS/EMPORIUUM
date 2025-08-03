import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Store, Users, TrendingUp } from 'lucide-react';

const EcommerceHero: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 px-6 py-20 text-center text-white">
          <Badge className="mb-6 bg-white/20 text-white border-white/30 text-lg px-4 py-2">
            🏆 EMPORIUM - NOUVELLE GÉNÉRATION
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
            PLATEFORME E-COMMERCE
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-cyan-100">
            Totale & Vibrante
          </h2>
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-white/90">
            Architecture complète pour une expérience révolutionnaire
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge className="bg-green-500/80 text-white px-4 py-2 text-lg">
              🚀 Scalable
            </Badge>
            <Badge className="bg-red-500/80 text-white px-4 py-2 text-lg">
              🔒 Sécurisé
            </Badge>
            <Badge className="bg-yellow-500/80 text-white px-4 py-2 text-lg">
              ⚡ Performant
            </Badge>
            <Badge className="bg-purple-500/80 text-white px-4 py-2 text-lg">
              🤖 Intelligent
            </Badge>
            <Badge className="bg-emerald-500/80 text-white px-4 py-2 text-lg">
              🌱 Durable
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4">
              <Store className="mr-2 h-5 w-5" />
              Espace Vendeur
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-4">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Espace Acheteur
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcommerceHero;