'use client';

import { useState, useCallback, useMemo, useEffect} from 'react';
import { HttpTransport } from "@nktkas/hyperliquid";
import { vaultTransfer, withdraw3 } from "@nktkas/hyperliquid/api/exchange";
import { clearinghouseState, spotClearinghouseState, vaultDetails } from "@nktkas/hyperliquid/api/info";
import { useAccount, useWalletClient } from 'wagmi';
import { privateKeyToAccount } from 'viem/accounts';
import { getAddress, type Hex } from 'viem';

interface HyperliquidSpotBalance {
    coin: string;
    total: string;
    hold?: string;
}

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

    const runAutoDeposit = useCallback(async (amount: string) => {
        const agentData = getStoredAgent();
        if (!agentData || !address) return;
        
        try {
            setIsAutoInvesting(true);
            const targetUsd = parseFloat(amount);
            
            let ready = false;
            for (let i = 0; i < 5; i++) {
                const currentBalance = await refreshBalance();
                if (parseFloat(currentBalance) >= targetUsd) {
                    ready = true;
                    break;
                }
                console.log(`Waiting for bridge... attempt ${i+1}`);
                await new Promise(r => setTimeout(r, 10000));
            }

            if (!ready) throw new Error("Bridge timeout: Funds haven't arrived at HL yet");

            const agentWallet = privateKeyToAccount(agentData.privateKey as Hex);
            await vaultTransfer({ transport, wallet: agentWallet }, { 
                vaultAddress: VAULT_ADDRESS as Hex, 
                isDeposit: true, 
                usd: Math.floor(targetUsd * 1e6) 
            });

            return true;
        } catch (e) {
            throw e;
        } finally {
            setIsAutoInvesting(false);
        }
    }, [address, refreshBalance, transport, getStoredAgent]);

    const runAutoWithdraw = useCallback(async (amount: string) => {
        const agentData = getStoredAgent();
        if (!agentData || !address) return;
        
        try {
            setIsAutoInvesting(true);
            const targetUsd = parseFloat(amount);
            const agentWallet = privateKeyToAccount(agentData.privateKey as Hex);

            const vData = await vaultDetails({ transport }, { 
                vaultAddress: VAULT_ADDRESS as Hex,
                user: address as Hex
            });

            const actualEquity = parseFloat(vData?.followerState?.vaultEquity || "0");
            const withdrawAmount = Math.min(targetUsd, actualEquity);

            if (withdrawAmount <= 0) throw new Error("No equity left in vault");

            await vaultTransfer({ transport, wallet: agentWallet }, { 
                vaultAddress: VAULT_ADDRESS as Hex, 
                isDeposit: false, 
                usd: Math.floor(withdrawAmount * 1e6) 
            });

            await refreshBalance();
            return true;
        } catch (e) {
            console.error("HL Withdraw Error:", e);
            throw e;
        } finally {
            setIsAutoInvesting(false);
        }
    }, [address, refreshBalance, transport, getStoredAgent]);

    const withdrawToWallet = useCallback(async (amount: string) => {
        if (!walletClient || !address) throw new Error("Wallet not connected");
        
        try {
            setIsAutoInvesting(true);
            const targetUsd = parseFloat(amount);
            
            let availableSpot = 0;
            for (let i = 0; i < 5; i++) {
                const spotState = await spotClearinghouseState({ transport }, { user: address as Hex });
                const usdcBalance = parseFloat(
                    spotState.balances.find((b: HyperliquidSpotBalance) => b.coin === 'USDC')?.total || "0"
                );                
                if (usdcBalance >= targetUsd * 0.9) {
                    availableSpot = usdcBalance;
                    break;
                }
                console.log(`Waiting for spot balance update... attempt ${i+1}`);
                await new Promise(r => setTimeout(r, 2000));
            }

            const BRIDGE_FEE = 1.0;
            const amountToBridge = Math.min(targetUsd, availableSpot - BRIDGE_FEE);

            if (amountToBridge <= 0) {
                throw new Error("Balance too low to cover the 1 USDC bridge fee");
            }

            await withdraw3(
                { transport, wallet: walletClient },
                {
                    destination: address,
                    amount: amountToBridge.toString(),
                }
            );

            await refreshBalance();
            return true;
        } catch (e) {
            console.error("Bridge back error:", e);
            throw e;
        } finally {
            setIsAutoInvesting(false);
        }
    }, [address, walletClient, transport, refreshBalance]);

    useEffect(() => {
        if (address) {
            refreshBalance();
            const interval = setInterval(refreshBalance, 20000);
            return () => clearInterval(interval);
        }
    }, [address, refreshBalance]);

    return { 
        hlBalance, vaultEquity, vaultApr, vaultPnl,
        isAutoInvesting, hasAgent, runAutoDeposit, runAutoWithdraw, withdrawToWallet, refreshBalance
    };
}