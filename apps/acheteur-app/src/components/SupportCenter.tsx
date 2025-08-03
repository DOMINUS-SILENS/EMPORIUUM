import React, { useState } from 'react';
import { X, MessageCircle, Phone, Mail, HelpCircle, Headphones, Clock } from 'lucide-react';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Separator } from '@components/ui/separator';

interface SupportCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportCenter: React.FC<SupportCenterProps> = ({ isOpen, onClose }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({ subject: '', message: '' });

  const supportOptions = [
    {
      icon: MessageCircle,
      title: 'Chatbot 24/7',
      description: 'Assistance instantanée',
      status: 'En ligne',
      color: 'text-green-600'
    },
    {
      icon: Phone,
      title: 'Support Vocal',
      description: 'Assistance téléphonique',
      status: 'Disponible',
      color: 'text-blue-600'
    },
    {
      icon: Mail,
      title: 'Email Prioritaire',
      description: 'Réponse sous 2h',
      status: 'VIP',
      color: 'text-purple-600'
    }
  ];

  const faqItems = [
    {
      question: 'Comment suivre ma commande ?',
      answer: 'Rendez-vous dans "Mes Commandes" pour le suivi temps réel.'
    },
    {
      question: 'Puis-je modifier ma commande ?',
      answer: 'Oui, dans les 30 minutes après validation.'
    },
    {
      question: 'Quels sont les délais de livraison ?',
      answer: 'Standard: 2-3 jours, Express: 24h, Points relais: 2-4 jours.'
    }
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 z-50 overflow-y-auto ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">🧑‍💼 Support Client</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Support Options */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Contactez-nous</h3>
            <div className="space-y-3">
              {supportOptions.map((option, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <option.icon className={`h-6 w-6 ${option.color}`} />
                      <div className="flex-1">
                        <div className="font-semibold">{option.title}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </div>
                      <Badge variant="secondary">{option.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Quick Chat */}
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Chat Rapide
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!chatOpen ? (
                  <Button 
                    onClick={() => setChatOpen(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    Démarrer une conversation
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-semibold text-sm">Assistant IA</span>
                      </div>
                      <p className="text-sm">Bonjour! Comment puis-je vous aider aujourd'hui?</p>
                    </div>
                    <Input placeholder="Tapez votre message..." />
                    <Button size="sm" className="w-full">Envoyer</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Separator className="my-6" />

          {/* FAQ */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              F.A.Q Dynamique
            </h3>
            <div className="space-y-2">
              {faqItems.map((item, index) => (
                <Card key={index} className="cursor-pointer hover:bg-gray-50">
                  <CardContent className="p-3">
                    <div className="font-semibold text-sm mb-1">{item.question}</div>
                    <div className="text-xs text-gray-600">{item.answer}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Ticket Support */}
          <div>
            <h3 className="font-semibold mb-4">🎫 Créer un Ticket</h3>
            <div className="space-y-3">
              <Input 
                placeholder="Sujet de votre demande"
                value={ticketForm.subject}
                onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
              />
              <Textarea 
                placeholder="Décrivez votre problème..."
                value={ticketForm.message}
                onChange={(e) => setTicketForm({...ticketForm, message: e.target.value})}
                rows={3}
              />
              <Button className="w-full">
                Envoyer le Ticket
              </Button>
            </div>
          </div>

          {/* Response Time */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">Temps de réponse moyen: 15 min</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { SupportCenter };
