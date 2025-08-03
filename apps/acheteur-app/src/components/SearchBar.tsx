import React, { useState } from 'react';
import { Search, Filter, Mic, Camera, Sparkles } from 'lucide-react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Badge } from '@components/ui/badge';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onFilterClick?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onFilterClick }) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleVoiceSearch = () => {
    setIsListening(!isListening);
    // Voice search logic would go here
  };

  const trendingSearches = ['Sneakers', 'Hoodies', 'Tech', 'Gaming', 'Streetwear'];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="relative flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Recherche par IA, voix ou image..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 pr-4 py-3 text-lg border-2 border-purple-200 focus:border-purple-500 rounded-full"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleVoiceSearch}
              className={`h-8 w-8 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={onFilterClick}
          className="px-6 py-3 border-2 border-purple-200 hover:border-purple-500 rounded-full"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtres
          <Sparkles className="h-4 w-4 ml-2 text-purple-500" />
        </Button>
        
        <Button
          onClick={handleSearch}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full"
        >
          Rechercher
        </Button>
      </div>
      
      <div className="flex items-center space-x-2 text-sm">
        <span className="text-gray-500">Tendances:</span>
        {trendingSearches.map((trend, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="cursor-pointer hover:bg-purple-100 transition-colors"
            onClick={() => setQuery(trend)}
          >
            {trend}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export { SearchBar };
