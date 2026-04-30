import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useOnDataChange } from './useChartRefresh';

export const useDashboard = () => {
  const [state, setState] = useState({
    summary:            null,
    spendingByCategory: [],
    recentTransactions: [],
    loading:            true,
    error:              null,
  });

  const fetchData = useCallback(async () => {
    try {
      setState(s => ({ ...s, loading:true, error:null }));
      const res = await api.getDashboardStats();
      setState({
        summary:            res.data.summary,
        spendingByCategory: res.data.spendingByCategory,
        recentTransactions: res.data.recentTransactions,
        loading:            false,
        error:              null,
      });
    } catch (err) {
      setState(s => ({ ...s, loading:false, error:err.message }));
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useOnDataChange(fetchData);

  return { ...state, refetch: fetchData };
};
