import { useState, useEffect } from "react";

interface VaultDetailsResponse {
  name: string;
  apr: number;
}

interface RealYieldState {
  apy: number;
  vaultName: string;
  loading: boolean;
  error: string | null;
}

export const useRealYield = (vaultAddress: string): RealYieldState => {
  const [data, setData] = useState<Omit<RealYieldState, 'loading' | 'error'>>({ 
    apy: 0, 
    vaultName: '' 
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!vaultAddress || vaultAddress.length < 42) return;
    
    const fetchVaultData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("https://api.hyperliquid-testnet.xyz/info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "vaultDetails",
            vaultAddress: vaultAddress.trim(),
          }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || 'Failed to fetch vault data');
        }

        const json = (await res.json()) as VaultDetailsResponse;
        
        if (json) {
          setData({
            apy: (json.apr || 0) * 100,
            vaultName: json.name
          });
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown API Error';
        setError(errorMessage);
        console.error("Vault API Error:", errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchVaultData();
  }, [vaultAddress]);

  return { ...data, loading, error };
};