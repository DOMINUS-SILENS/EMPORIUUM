import { useState, useEffect } from 'react';
import AcheteurApiService, { BuyerStats } from '@/services/api';

export const useBuyerDashboard = () => {
  const [stats, setStats] = useState<BuyerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBuyerStats = async () => {
    try {
      setLoading(true);
      const data = await AcheteurApiService.getBuyerStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch buyer stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyerStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchBuyerStats
  };
};

