'use client';

import { useState, useCallback, useMemo, useEffect} from 'react';
import { HttpTransport } from "@nktkas/hyperliquid";
import { vaultTransfer, withdraw3, approveAgent } from "@nktkas/hyperliquid/api/exchange";
import { clearinghouseState, spotClearinghouseState, vaultDetails } from "@nktkas/hyperliquid/api/info";
import { useAccount, useWalletClient } from 'wagmi';
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts';
import { getAddress, type Hex } from 'viem';
import { 
    AOM3_REWARD_DISTRIBUTOR_ADDRESS,
} from '@/constants/contracts';

const rawVaultAddress = process.env.NEXT_PUBLIC_HL_TEST_VAULT_ADDRESS;
const rawDistributorAddress = AOM3_REWARD_DISTRIBUTOR_ADDRESS;

if (!rawVaultAddress) {
    throw new Error("NEXT_PUBLIC_HL_TEST_VAULT_ADDRESS is missing in your .env file");
}

export const VAULT_ADDRESS = getAddress(rawVaultAddress as Hex);
export const DISTRIBUTOR_ADDRESS = rawDistributorAddress ? getAddress(rawDistributorAddress as Hex) : undefined;

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

    const ensureAgent = useCallback(async () => {
        let agentData = getStoredAgent();
        if (agentData) return agentData;

        if (!address || !walletClient) throw new Error("Wallet not connected for Agent Setup");
        
        const agentPrivateKey = generatePrivateKey();
        const agentAccount = privateKeyToAccount(agentPrivateKey);

        await approveAgent(
            { transport, wallet: walletClient },
            {
                agentAddress: agentAccount.address,
                agentName: "AOM3_Auto_Agent",
            }
        );

        agentData = { address: agentAccount.address, privateKey: agentPrivateKey };
        localStorage.setItem(`hl_agent_${address.toLowerCase()}`, JSON.stringify(agentData));
        return agentData;
    }, [address, walletClient, transport, getStoredAgent]);

    const bridgeToExternal = useCallback(async (amount: string, destination: string) => {
        if (!walletClient || !address) throw new Error("Wallet not connected");
        
        const targetUsd = parseFloat(amount);
        let availableSpot = 0;

        for (let i = 0; i < 5; i++) {
            const spotState = await spotClearinghouseState({ transport }, { user: address as Hex });
            availableSpot = parseFloat(spotState.balances.find(b => b.coin === 'USDC')?.total || "0");                
            if (availableSpot >= targetUsd * 0.98) break; 
            await new Promise(r => setTimeout(r, 2000));
        }

        const BRIDGE_FEE = 1.0;
        const amountToBridge = Math.min(targetUsd, availableSpot - BRIDGE_FEE);

        if (amountToBridge <= 0) {
            console.warn("Insufficient balance to cover bridge fee. Skipping bridge to", destination);
            return false;
        }

        return await withdraw3(
            { transport, wallet: walletClient },
            { destination: destination as Hex, amount: amountToBridge.toFixed(6) }
        );
    }, [address, walletClient, transport]);

    const runAutoDeposit = useCallback(async (amount: string) => {
        if (!address) return;
        try {
            setIsAutoInvesting(true);
            const agentData = await ensureAgent();
            
            const targetUsd = parseFloat(amount);
            let ready = false;
            for (let i = 0; i < 5; i++) {
                const currentBalance = await refreshBalance();
                if (parseFloat(currentBalance) >= targetUsd) { ready = true; break; }
                await new Promise(r => setTimeout(r, 10000));
            }
            if (!ready) throw new Error("Bridge timeout");
            const agentWallet = privateKeyToAccount(agentData.privateKey as Hex);
            await vaultTransfer({ transport, wallet: agentWallet }, { vaultAddress: VAULT_ADDRESS as Hex, isDeposit: true, usd: Math.floor(targetUsd * 1e6) });
            return true;
        } finally { setIsAutoInvesting(false); }
    }, [address, refreshBalance, transport, ensureAgent]);

    const executeQuestExit = useCallback(async (isMatured: boolean, principalAmount: number, penaltyAmount: number) => {
        if (!address) throw new Error("Wallet not connected");
        try {
            setIsAutoInvesting(true);
            const agentData = await ensureAgent();
            const agentWallet = privateKeyToAccount(agentData.privateKey as Hex);
            const currentPnl = Math.max(0, parseFloat(vaultPnl));
            const totalToWithdrawFromVault = principalAmount + currentPnl;
            if (totalToWithdrawFromVault > 0) {
                const vData = await vaultDetails({ transport }, { vaultAddress: VAULT_ADDRESS as Hex, user: address as Hex });
                const actualEquity = parseFloat(vData?.followerState?.vaultEquity || "0");
                const safeWithdrawAmount = Math.min(totalToWithdrawFromVault, actualEquity);

                if (safeWithdrawAmount > 0) {
                    await vaultTransfer({ transport, wallet: agentWallet }, {
                        vaultAddress: VAULT_ADDRESS as Hex,
                        isDeposit: false,
                        usd: Math.floor(safeWithdrawAmount * 1e6)
                    });
                }
            }

            if (isMatured) {
                const totalReturn = principalAmount + currentPnl;
                if (totalReturn > 1.0) await bridgeToExternal(totalReturn.toString(), address);
            } else {
                const userReturn = principalAmount - penaltyAmount;
                const poolReturn = penaltyAmount + currentPnl;
                if (userReturn > 1.0) await bridgeToExternal(userReturn.toString(), address);
                
                await new Promise(r => setTimeout(r, 2000));
                
                if (poolReturn > 1.0 && DISTRIBUTOR_ADDRESS) {
                    await bridgeToExternal(poolReturn.toString(), DISTRIBUTOR_ADDRESS);
                }
            }

            await refreshBalance();
            return true;
        } finally {
            setIsAutoInvesting(false);
        }
    }, [address, vaultPnl, transport, ensureAgent, bridgeToExternal, refreshBalance]);

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
        runAutoDeposit, executeQuestExit,
        refreshBalance
    };
}