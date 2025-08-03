import { useState, useEffect } from 'react';

const usePostStats = () => {
  const [stats, setStats] = useState({
    totalPosts: { count: 0, formatted: '0' },
    loading: true,
    error: null,
    lastUpdated: null
  });

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const fetchPostStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch('/api/vesturo/post/stats');
      const result = await response.json();
      
      if (result.success && result.data) {
        setStats({
          totalPosts: {
            count: result.data.totalPosts.count,
            formatted: result.data.totalPosts.formatted
          },
          loading: false,
          error: null,
          lastUpdated: result.data.lastUpdated
        });
      } else {
        throw new Error(result.message || 'Failed to fetch post statistics');
      }
    } catch (error) {
      console.error('Error fetching post stats:', error);
      
      // Set fallback data on error
      setStats({
        totalPosts: { count: 0, formatted: '0' },
        loading: false,
        error: error.message,
        lastUpdated: new Date().toISOString()
      });
    }
  };

  useEffect(() => {
    fetchPostStats();
    
    // Refresh data every 2 minutes
    const interval = setInterval(fetchPostStats, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    ...stats,
    refresh: fetchPostStats
  };
};

export default usePostStats;
