import React, { useState } from 'react';
import { useAppContext } from '@monorepo/hooks-shared/src/contexts/AppContext';
import { useIsMobile } from '@hooks/shared/use-mobile';
import DashboardHeader from './DashboardHeader';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';
import ProductsContent from './ProductsContent';
import StoreContent from './StoreContent';

interface AppLayoutProps {
  user: any;
}

const AppLayout: React.FC<AppLayoutProps> = ({ user }) => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'products':
        return <ProductsContent />;
      case 'store':
        return <StoreContent />;
      case 'orders':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Commandes & Ventes</h2>
            <p className="text-gray-600">Tableau analytique et suivi des ventes</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Analyses & Rapports</h2>
            <p className="text-gray-600">Suivez vos performances et analysez vos paniers</p>
          </div>
        );
      case 'marketing':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Marketing & Promotions</h2>
            <p className="text-gray-600">Bons de réduction, campagnes email et recommandations AI</p>
          </div>
        );
      case 'customers':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Clients</h2>
            <p className="text-gray-600">Gérez votre base de clients</p>
          </div>
        );
      case 'chat':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Communication Client</h2>
            <p className="text-gray-600">Chat temps réel, gestion des avis et support multicanal</p>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Sécurité & Support</h2>
            <p className="text-gray-600">Authentification 2FA, journal d'activité et monitoring 24/7</p>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Paramètres</h2>
            <p className="text-gray-600">Configuration de votre compte et préférences</p>
          </div>
        );
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
