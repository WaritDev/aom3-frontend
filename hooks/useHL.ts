'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { HttpTransport } from "@nktkas/hyperliquid";
import { vaultTransfer, approveAgent } from "@nktkas/hyperliquid/api/exchange";
import { clearinghouseState, spotClearinghouseState, vaultDetails } from "@nktkas/hyperliquid/api/info";
import { useAccount, useWalletClient } from 'wagmi';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { getAddress, type Hex } from 'viem';

const rawVaultAddress = process.env.NEXT_PUBLIC_HL_VAULT_ADDRESS;
if (!rawVaultAddress) {
    throw new Error("NEXT_PUBLIC_HL_VAULT_ADDRESS is missing in your .env file");
}
export const VAULT_ADDRESS = getAddress(rawVaultAddress as Hex);

export function useHL() {
    const { address } = useAccount();
    const { data: walletClient } = useWalletClient();
    const [isAutoInvesting, setIsAutoInvesting] = useState(false);
    const [hlBalance, setHlBalance] = useState("0"); 
    const [vaultEquity, setVaultEquity] = useState("0");
    const [vaultApr, setVaultApr] = useState(0);
    const [vaultPnl, setVaultPnl] = useState("0");

    const transport = useMemo(() => new HttpTransport({ isTestnet: true }), []);

    const refreshBalance = useCallback(async () => {
        if (!address) return "0";
        try {
            const spotState = await spotClearinghouseState({ transport }, { user: address as Hex });
            const usdcBalance = spotState.balances.find(b => b.coin === 'USDC')?.total || "0";
            const perpState = await clearinghouseState({ transport }, { user: address as Hex });
            const perpUsd = perpState.marginSummary.accountValue;
            setHlBalance((parseFloat(usdcBalance) + parseFloat(perpUsd)).toString());
            const vData = await vaultDetails({ transport }, { 
                vaultAddress: VAULT_ADDRESS as Hex,
                user: address as Hex
            });

            if (vData && vData.followerState) {
                setVaultEquity(vData.followerState.vaultEquity);
                setVaultPnl(vData.followerState.allTimePnl);
                setVaultApr(vData.apr);
            }

            return (parseFloat(usdcBalance) + parseFloat(perpUsd)).toString();
        } catch (e) {
            console.error("Balance fetch error:", e);
            return "0";
        }
    }, [address, transport]);

    const getStoredAgent = useCallback(() => {
        if (typeof window === 'undefined' || !address) return null;
        const stored = localStorage.getItem(`hl_agent_${address.toLowerCase()}`);
        return stored ? JSON.parse(stored) : null;
    }, [address]);

    const hasAgent = !!getStoredAgent();

    const createAndApproveAgent = useCallback(async () => {
        if (!walletClient || !address) return;
        try {
            const pKey = generatePrivateKey();
            const agentAccount = privateKeyToAccount(pKey);
            await approveAgent({ transport, wallet: walletClient }, { agentAddress: agentAccount.address, agentName: "AOM3-Automator" });
            localStorage.setItem(`hl_agent_${address.toLowerCase()}`, JSON.stringify({ address: agentAccount.address, privateKey: pKey }));
            window.location.reload();
        } catch (e) { console.error(e); }
    }, [address, walletClient, transport]);

    const runAutoDeposit = useCallback(async (amount: string) => {
        const agentData = getStoredAgent();
        if (!agentData || !address) return;
        try {
            setIsAutoInvesting(true);
            const agentWallet = privateKeyToAccount(agentData.privateKey as Hex);
            const testAmount = Math.floor(parseFloat(amount)); 
            await vaultTransfer({ transport, wallet: agentWallet }, { vaultAddress: VAULT_ADDRESS as Hex, isDeposit: true, usd: testAmount * 1e6 });
            await refreshBalance();
        } catch (e) { console.error(e); } finally { setIsAutoInvesting(false); }
    }, [address, getStoredAgent, transport, refreshBalance]);

    useEffect(() => {
        if (address) {
            refreshBalance();
            const interval = setInterval(refreshBalance, 20000);
            return () => clearInterval(interval);
        }
    }, [address, refreshBalance]);

    return { 
        hlBalance, vaultEquity, vaultApr, vaultPnl,
        isAutoInvesting, hasAgent, 
        createAndApproveAgent, runAutoDeposit, refreshBalance 
    };
}