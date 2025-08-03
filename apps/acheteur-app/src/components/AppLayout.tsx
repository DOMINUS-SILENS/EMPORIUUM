import React, { useState } from 'react';
import { useAppContext } from '@hooks/shared/contexts/AppContext';
import { useIsMobile } from '@hooks-shared/use-mobile';
import { ModernHeader } from '@/components/ModernHeader';
import { HeroSection } from '@/components/HeroSection';
import { ProductGrid } from '@/components/ProductGrid';
import { Footer } from '@/components/Footer';
import { UserProfile } from '@types/index'; // Corrigé si @types/* pointe bien sur packages/types/src/*

interface AppLayoutProps {
  user: UserProfile;
}

const AppLayout: React.FC<AppLayoutProps> = ({ user }) => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuClick = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      toggleSidebar();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <ModernHeader onMenuClick={handleMenuClick} user={user} />
      <main>
        <HeroSection />
        <ProductGrid user={user} />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
