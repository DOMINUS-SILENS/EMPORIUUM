import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Store, Users, TrendingUp } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EcommercePro
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Connexion</Button>
              </Link>
              <Link to="/register">
                <Button variant="premium">S'inscrire</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Plateforme E-commerce Révolutionnaire
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Découvrez une expérience d'achat et de vente unique avec notre plateforme innovante
          </p>
          <div className="flex justify-center gap-6">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Commencer comme Acheteur
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="success">
                <Store className="h-5 w-5 mr-2" />
                Commencer comme Vendeur
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <ShoppingCart className="h-6 w-6" />
                Pour les Acheteurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• Catalogue de produits diversifié</li>
                <li>• Recherche avancée et filtres</li>
                <li>• Panier intelligent</li>
                <li>• Suivi des commandes</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Store className="h-6 w-6" />
                Pour les Vendeurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• Gestion des produits</li>
                <li>• Tableau de bord analytique</li>
                <li>• Suivi des ventes</li>
                <li>• Gestion des stocks</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-600">
                <TrendingUp className="h-6 w-6" />
                Avantages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• Interface moderne et intuitive</li>
                <li>• Sécurité renforcée</li>
                <li>• Support client 24/7</li>
                <li>• Transactions sécurisées</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Prêt à commencer?</h2>
          <div className="flex justify-center gap-4">
            <Link to="/register">
              <Button size="lg" variant="premium">
                <Users className="h-5 w-5 mr-2" />
                Créer un compte
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;