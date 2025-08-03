import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, GraduationCap, Leaf } from 'lucide-react';

const AdvancedFeatures: React.FC = () => {
  const features = [
    {
      icon: <Calendar className="h-8 w-8 text-blue-500" />,
      title: "🔔 Abonnements & Événements",
      items: ["📅 Vente par abonnement", "🎥 Événements en live", "🎯 Précommandes", "🛒 Paniers récurrents", "📊 Analytics d'engagement"]
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "🌐 Communauté & Réseau",
      items: ["💬 Forums intégrés", "👥 Groupes vendeurs/acheteurs", "👤 Profils publics", "🤝 Networking pro", "🏆 Classements communauté"]
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-purple-500" />,
      title: "🎓 Éducation & Formation",
      items: ["🏫 Academy pour vendeurs", "📚 Modules de formation", "🏆 Certification interne", "📖 Guides pratiques", "🎯 Parcours personnalisés"]
    },
    {
      icon: <Leaf className="h-8 w-8 text-emerald-500" />,
      title: "♻️ Durabilité & Transparence",
      items: ["🌱 Produits écoresponsables", "🔗 Traçabilité blockchain", "📊 Empreinte carbone", "🌿 Certification écologique", "📈 Reporting ESG"]
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-emerald-100 text-emerald-800 text-lg px-4 py-2">
            🌟 FONCTIONNALITÉS AVANCÉES
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Innovation & Responsabilité
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fonctionnalités next-gen pour une plateforme durable et communautaire
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  {feature.icon}
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {feature.items.map((item, idx) => (
                    <li key={idx} className="text-gray-700 flex items-center">
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
            <CardContent className="py-12">
              <h3 className="text-3xl font-bold mb-4">🧱 INFRASTRUCTURE MODULAIRE</h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl mb-2">⚛️</div>
                  <div className="font-semibold">Frontend React/Vue</div>
                </div>
                <div>
                  <div className="text-2xl mb-2">🔗</div>
                  <div className="font-semibold">API REST/GraphQL</div>
                </div>
                <div>
                  <div className="text-2xl mb-2">🏗️</div>
                  <div className="font-semibold">Microservices</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFeatures;