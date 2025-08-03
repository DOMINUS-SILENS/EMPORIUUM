import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, Database, Cloud, Bot, Shield } from 'lucide-react';

const TechStack: React.FC = () => {
  const techCategories = [
    {
      icon: <Code className="h-8 w-8 text-blue-500" />,
      title: "🎨 Frontend",
      techs: ["React 18", "Vue 3", "TypeScript", "Tailwind CSS", "Next.js/Nuxt.js"],
      color: "bg-blue-500"
    },
    {
      icon: <Database className="h-8 w-8 text-green-500" />,
      title: "🗄️ Bases de Données",
      techs: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "InfluxDB"],
      color: "bg-green-500"
    },
    {
      icon: <Cloud className="h-8 w-8 text-purple-500" />,
      title: "🚀 DevOps",
      techs: ["Docker", "Kubernetes", "CI/CD Pipeline", "Jenkins/GitLab CI", "Monitoring Stack"],
      color: "bg-purple-500"
    },
    {
      icon: <Bot className="h-8 w-8 text-orange-500" />,
      title: "🤖 AI/ML",
      techs: ["TensorFlow", "OpenAI GPT", "Ollama", "Computer Vision", "Recommendation Engine"],
      color: "bg-orange-500"
    },
    {
      icon: <Shield className="h-8 w-8 text-red-500" />,
      title: "🔐 Sécurité",
      techs: ["JWT Tokens", "OAuth 2.0", "AES-256", "WAF Protection", "Rate Limiting"],
      color: "bg-red-500"
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-white/20 text-white border-white/30 text-lg px-4 py-2">
            🔧 TECHNOLOGIES INTÉGRÉES
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Stack Technologique Moderne
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Technologies de pointe pour une plateforme robuste et évolutive
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {techCategories.map((category, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  {category.icon}
                  <CardTitle className="text-white text-lg">{category.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {category.techs.map((tech, idx) => (
                    <Badge key={idx} className={`${category.color} text-white text-xs px-2 py-1`}>
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">95%+</div>
              <div className="text-gray-300">Test Coverage</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-gray-300">Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">Auto</div>
              <div className="text-gray-300">Scaling</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">Global</div>
              <div className="text-gray-300">CDN</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechStack;