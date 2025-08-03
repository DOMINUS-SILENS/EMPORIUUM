import React, { useState } from 'react';
import { X, Sparkles, Star, DollarSign, Palette, Zap } from 'lucide-react';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Slider } from '@components/ui/slider';
import { Checkbox } from '@components/ui/checkbox';
import { Separator } from '@components/ui/separator';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose }) => {
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const categories = ['Vêtements', 'Chaussures', 'Accessoires', 'Tech', 'Gaming', 'Lifestyle'];
  const brands = ['Nike', 'Adidas', 'Supreme', 'Apple', 'Samsung', 'PlayStation'];
  const colors = ['Noir', 'Blanc', 'Rouge', 'Bleu', 'Vert', 'Rose'];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}
      <div className={`fixed right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <h2 className="text-xl font-bold">Filtres Intelligents</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* AI Recommendations */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <Zap className="h-4 w-4 mr-2 text-purple-500" />
                Recommandations IA
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-purple-100 text-purple-700">Pour vous</Badge>
                <Badge className="bg-pink-100 text-pink-700">Tendance</Badge>
                <Badge className="bg-blue-100 text-blue-700">Nouveau</Badge>
              </div>
            </div>

            <Separator />

            {/* Price Range */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Prix: {priceRange[0]}€ - {priceRange[1]}€
              </h3>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={1000}
                step={10}
                className="w-full"
              />
            </div>

            <Separator />

            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-3">Catégories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([...selectedCategories, category]);
                        } else {
                          setSelectedCategories(selectedCategories.filter(c => c !== category));
                        }
                      }}
                    />
                    <label htmlFor={category} className="text-sm">{category}</label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Brands */}
            <div>
              <h3 className="font-semibold mb-3">Marques</h3>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={brand}
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedBrands([...selectedBrands, brand]);
                        } else {
                          setSelectedBrands(selectedBrands.filter(b => b !== brand));
                        }
                      }}
                    />
                    <label htmlFor={brand} className="text-sm">{brand}</label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Colors */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <Palette className="h-4 w-4 mr-2" />
                Couleurs
              </h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <Badge key={color} variant="outline" className="cursor-pointer hover:bg-gray-100">
                    {color}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="fixed bottom-0 right-0 w-80 p-6 bg-white border-t">
            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1">
                Réinitialiser
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
                Appliquer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { FilterPanel };
