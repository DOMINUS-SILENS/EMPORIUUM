// Placeholder for useAppContext hook
import { useState } from 'react';

export const useAppContext = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return { sidebarOpen, toggleSidebar };
};
