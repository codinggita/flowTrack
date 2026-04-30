import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useOnDataChange } from './useChartRefresh';

export const useReports = (period = 'this-month') => {
  const [state, setState] = useState({
    summary:            null,
    spendingByCategory: [],
    spendingByMerchant: [],
    cashFlow:           [],
    topCategories:      [],
    loading:            true,
    error:              null,
  });

  const fetchData = useCallback(async () => {
    try {
      setState(s => ({ ...s, loading:true, error:null }));
      const [summary, byCategory, byMerchant, cashFlow, topCats] = await Promise.all([
        api.getSummary(period),
        api.getSpendingByCategory(period),
        api.getSpendingByMerchant(period),
        api.getCashFlow(new Date().getFullYear()),
        api.getTopCategories(period),
      ]);
      setState({
        summary:            summary.data,
        spendingByCategory: byCategory.data.categories || [],
        spendingByMerchant: byMerchant.data            || [],
        cashFlow:           cashFlow.data.data          || [],
        topCategories:      topCats.data                || [],
        loading:            false,
        error:              null,
      });
    } catch (err) {
      setState(s => ({ ...s, loading:false, error:err.message }));
    }
  }, [period]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useOnDataChange(fetchData);

  return { ...state, refetch: fetchData };
};
