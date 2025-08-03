import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              EMPORIUM
            </h3>
            <p className="text-gray-300 mb-4">
              Plateforme e-commerce nouvelle génération pour une expérience révolutionnaire
            </p>
            <div className="flex space-x-3">
              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Github className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-cyan-400">Vendeurs</h4>
            <ul className="space-y-2 text-gray-300">
              <li>🏬 Boutiques personnalisées</li>
              <li>📦 Gestion produits</li>
              <li>📊 Analytics avancés</li>
              <li>📣 Marketing automation</li>
              <li>💬 Support client</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-purple-400">Acheteurs</h4>
            <ul className="space-y-2 text-gray-300">
              <li>🎯 Expérience personnalisée</li>
              <li>💳 Paiements sécurisés</li>
              <li>🎁 Programme fidélité</li>
              <li>🧠 IA intégrée</li>
              <li>🥽 Réalité augmentée</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-emerald-400">Plateforme</h4>
            <ul className="space-y-2 text-gray-300">
              <li>🚀 Scalable</li>
              <li>🔒 Sécurisé</li>
              <li>⚡ Performant</li>
              <li>🤖 Intelligent</li>
              <li>🌱 Durable</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
              <Badge className="bg-blue-600 text-white">React 18</Badge>
              <Badge className="bg-green-600 text-white">TypeScript</Badge>
              <Badge className="bg-purple-600 text-white">Tailwind CSS</Badge>
              <Badge className="bg-orange-600 text-white">AI/ML</Badge>
              <Badge className="bg-red-600 text-white">Blockchain</Badge>
            </div>
            <div className="text-gray-400 text-sm">
            ElBadji  © 2025 EMPORIUM. Architecture complète pour l'e-commerce du futur.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;