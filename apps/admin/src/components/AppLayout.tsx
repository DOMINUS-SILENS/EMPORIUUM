import React, { useState, useEffect } from 'react';
import { getAdminDashboardData } from '@/services/api';
import { useIsMobile } from '@hooks/shared/use-mobile';
import Sidebar from './Sidebar';
import Header from './Header';
import StatsCards from './StatsCards';
import RecentOrders from './RecentOrders';
import SalesChart from './SalesChart';
import TopVendors from './TopVendors';

const AppLayout: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
    const isMobile = useIsMobile();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAdminDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      
      <div className={`transition-all duration-300 ${sidebarOpen && !isMobile ? 'lg:ml-64' : ''}`}>
        <Header onMenuClick={toggleSidebar} />
        
        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                E-Commerce Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Professional admin panel for managing your marketplace like Shopify</p>
            </div>
            
            <StatsCards stats={dashboardData?.stats} isLoading={loading} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SalesChart salesData={dashboardData?.sales_chart_data} isLoading={loading} />
              </div>
              <TopVendors vendors={dashboardData?.top_vendors} isLoading={loading} />
            </div>
            
            <RecentOrders orders={dashboardData?.recent_orders} isLoading={loading} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
