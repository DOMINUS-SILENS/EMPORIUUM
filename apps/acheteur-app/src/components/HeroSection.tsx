import React from 'react';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Sparkles, Zap, Heart, Star } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Title */}
          <div className="mb-6">
            <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              Nouvelle Génération Shopping
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                COMMERCIUM
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              L'expérience shopping Gen Z avec IA, AR, crypto et rewards gamifiés
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-white/80 backdrop-blur rounded-2xl shadow-lg">
              <Zap className="h-8 w-8 text-purple-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">IA Avancée</h3>
              <p className="text-gray-600 text-sm">Recommandations personnalisées et recherche intelligente</p>
            </div>
            <div className="p-6 bg-white/80 backdrop-blur rounded-2xl shadow-lg">
              <Heart className="h-8 w-8 text-pink-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Expérience Unique</h3>
              <p className="text-gray-600 text-sm">Interface adaptive et wishlist dynamique</p>
            </div>
            <div className="p-6 bg-white/80 backdrop-blur rounded-2xl shadow-lg">
              <Star className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Récompenses VIP</h3>
              <p className="text-gray-600 text-sm">Points, badges et challenges gamifiés</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 text-lg">
              Découvrir le Catalogue
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-purple-300 hover:bg-purple-50 px-8 py-4 text-lg">
              Rejoindre VIP
            </Button>
          </div>
        </div>
      </div>
      
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-200 rounded-full opacity-30 animate-bounce"></div>
    </section>
  );
};

export { HeroSection };
