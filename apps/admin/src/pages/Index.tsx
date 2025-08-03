
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { AppProvider } from '@hooks/shared/contexts/AppContext';

const Index: React.FC = () => {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
};

export default Index;

