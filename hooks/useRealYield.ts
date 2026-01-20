import { useState, useEffect } from 'react';
import type { CalculatedYieldItem } from '@/app/api/hyperliquid-funding/route';

interface RealYieldData {
  history: CalculatedYieldItem[];
  apy: number;
}

interface ApiResponse {
  coin: string;
  average30dApy: number;
  history: CalculatedYieldItem[];
}

export const useRealYield = (coin: string = 'HYPE') => {
  const [data, setData] = useState<RealYieldData>({ history: [], apy: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/hyperliquid-funding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ coin }) 
        });
        
        const json = (await res.json()) as ApiResponse;
        
        if (json.history) {
          setData({
            history: json.history,
            apy: json.average30dApy
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchRealData();
  }, [coin]);

  return { ...data, loading };
};