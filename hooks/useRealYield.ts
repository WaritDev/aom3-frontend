import { useState, useEffect } from "react";

export const useRealYield = (vaultAddress: string) => {
  const [data, setData] = useState({ apy: 0, vaultName: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vaultAddress) return;
    
    const fetchVaultData = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://api.hyperliquid-testnet.xyz/info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "vaultDetails",
            vaultAddress: vaultAddress,
          }),
        });

        const json = await res.json();
        if (json) {
          setData({
            apy: (json.apr || 0) * 100,
            vaultName: json.name
          });
        }
      } catch (e) {
        console.error("Vault API Error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchVaultData();
  }, [vaultAddress]);

  return { ...data, loading };
};