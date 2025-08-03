import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Globe, Smartphone, Eye } from 'lucide-react';

const StoreContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Ma Boutique</h2>
          <p className="text-gray-600 mt-1">Personnalisez votre vitrine en ligne</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
          <Eye className="h-4 w-4 mr-2" />
          Prévisualiser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-purple-600" />
              Branding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Personnalisez l'apparence de votre boutique</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Logo</span>
                <Badge variant="secondary">Configuré</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Couleurs</span>
                <Badge variant="secondary">Configuré</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Thème</span>
                <Badge>Moderne</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              URL Dédiée
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Votre adresse web personnalisée</p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-mono">monshop.emporium.fr</p>
            </div>
            <Button variant="outline" size="sm" className="mt-3">
              Modifier
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-green-600" />
              Responsive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Optimisé pour tous les appareils</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Mobile</span>
                <Badge variant="default">✓ Optimisé</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Tablette</span>
                <Badge variant="default">✓ Optimisé</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Desktop</span>
                <Badge variant="default">✓ Optimisé</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StoreContent;
