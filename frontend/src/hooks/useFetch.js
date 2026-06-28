import { useState, useCallback } from 'react';

/**
 * Custom hook for data fetching with loading and error states
 */
export const useFetch = (fetchFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchFunction]
  );

  return { data, loading, error, execute };
};
