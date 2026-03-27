'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { HttpTransport } from "@nktkas/hyperliquid";
import { vaultTransfer, withdraw3 } from "@nktkas/hyperliquid/api/exchange";
import { clearinghouseState, spotClearinghouseState, vaultDetails } from "@nktkas/hyperliquid/api/info";
import { useAccount, useWalletClient } from 'wagmi';
import { getAddress, type Hex } from 'viem';
import { AOM3_REWARD_DISTRIBUTOR_ADDRESS } from '@/constants/contracts';

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
            const usdcBalance = parseFloat(spotState.balances.find(b => b.coin === 'USDC')?.total || "0");
            
            const perpState = await clearinghouseState({ transport }, { user: address as Hex });
            const perpUsd = parseFloat(perpState.marginSummary.accountValue || "0");
            
            const totalBalance = (usdcBalance + perpUsd).toString();
            setHlBalance(totalBalance);
            
            const vData = await vaultDetails({ transport }, { 
                vaultAddress: VAULT_ADDRESS as Hex,
                user: address as Hex
            });

            if (vData && vData.followerState) {
                setVaultEquity(vData.followerState.vaultEquity);
                setVaultPnl(vData.followerState.allTimePnl);
                setVaultApr(vData.apr);
            }

            return totalBalance;
        } catch (err: unknown) {
            const e = err as Error;
            if (!e.message?.includes('Failed to fetch')) {
                console.error("Balance fetch error:", e.message);
            }
            return "0";
        }
    }, [address, transport]);

    const bridgeToExternal = useCallback(async (amount: string, destination: string) => {
        if (!walletClient || !address) throw new Error("Wallet not connected");
        
        const targetUsd = parseFloat(amount);
        let availableSpot = 0;

        for (let i = 0; i < 8; i++) {
            try {
                const spotState = await spotClearinghouseState({ transport }, { user: address as Hex });
                availableSpot = parseFloat(spotState.balances.find(b => b.coin === 'USDC')?.total || "0");                
                if (availableSpot >= targetUsd - 0.01) break; 
            } catch (err: unknown) {
                console.log("Waiting for spot state...", (err as Error).message);
            }
            await new Promise(r => setTimeout(r, 2000));
        }

        const BRIDGE_FEE = 0.0;
        const amountToBridge = Math.max(0, Math.min(targetUsd, availableSpot - BRIDGE_FEE));

        if (amountToBridge <= 0) {
            throw new Error("BRIDGE_AMOUNT_TOO_SMALL");
        }

        return await withdraw3(
            { transport, wallet: walletClient },
            { destination: destination as Hex, amount: amountToBridge.toFixed(6) }
        );
    }, [address, walletClient, transport]);

    const runAutoDeposit = useCallback(async (amount: string) => {
        if (!address || !walletClient) throw new Error("Wallet not connected");
        try {
            setIsAutoInvesting(true);
            
            const targetUsd = parseFloat(amount);
            let ready = false;
            for (let i = 0; i < 5; i++) {
                const currentBalance = await refreshBalance();
                if (parseFloat(currentBalance) >= targetUsd) { ready = true; break; }
                await new Promise(r => setTimeout(r, 10000));
            }
            if (!ready) throw new Error("Bridge timeout: Funds have not arrived in Hyperliquid Spot yet.");
            
            await vaultTransfer(
                { transport, wallet: walletClient }, 
                { vaultAddress: VAULT_ADDRESS as Hex, isDeposit: true, usd: Math.round(targetUsd * 1e6) }
            );
            return true;
        } finally { 
            setIsAutoInvesting(false); 
        }
    }, [address, walletClient, refreshBalance, transport]);

    const executeQuestExit = useCallback(async (isMatured: boolean, principalAmount: number, penaltyAmount: number, totalUserPrincipal?: number) => {
        if (!address || !walletClient) throw new Error("Wallet not connected");
        
        try {
            setIsAutoInvesting(true);
            
            const vData = await vaultDetails({ transport }, { vaultAddress: VAULT_ADDRESS as Hex, user: address as Hex });
            const actualEquity = parseFloat(vData?.followerState?.vaultEquity || "0");
            
            const basePrincipalForYield = (totalUserPrincipal && totalUserPrincipal > 0) ? totalUserPrincipal : principalAmount;
            const totalVaultYield = Math.max(0, actualEquity - basePrincipalForYield);
            const yieldShareRatio = basePrincipalForYield > 0 ? (principalAmount / basePrincipalForYield) : 0;
            const earnedYield = totalVaultYield * yieldShareRatio;
            
            const safePrincipalFromVault = Math.min(principalAmount, actualEquity); 
            const amountToWithdrawFromVault = safePrincipalFromVault + earnedYield;

            if (amountToWithdrawFromVault > 0) {
                await vaultTransfer({ transport, wallet: walletClient }, {
                    vaultAddress: VAULT_ADDRESS as Hex,
                    isDeposit: false,
                    usd: Math.round(amountToWithdrawFromVault * 1e6) 
                });
                await new Promise(r => setTimeout(r, 2000)); 
            }

            const principalToBridge = actualEquity > 0 ? safePrincipalFromVault : principalAmount;
            const yieldToBridge = actualEquity > 0 ? earnedYield : 0; 
            const totalToBridgeIfMatured = principalToBridge + yieldToBridge;

            if (isMatured) {
                if (totalToBridgeIfMatured > 0) {
                    try {
                        await bridgeToExternal(totalToBridgeIfMatured.toString(), address);
                    } catch (err: unknown) {
                        const e = err as Error;
                        if (e.message !== "BRIDGE_AMOUNT_TOO_SMALL") throw e;
                    }
                }
            } else {
                if (principalToBridge > 0) {
                    try {
                        await bridgeToExternal(principalToBridge.toString(), address);
                    } catch (err: unknown) {
                        const e = err as Error;
                        if (e.message !== "BRIDGE_AMOUNT_TOO_SMALL") throw e;
                    }
                }
                
                if (yieldToBridge > 0 && DISTRIBUTOR_ADDRESS) {
                    await new Promise(r => setTimeout(r, 2000)); 
                    try {
                        await bridgeToExternal(yieldToBridge.toString(), DISTRIBUTOR_ADDRESS);
                    } catch (err: unknown) {
                        const e = err as Error;
                        console.warn("Skipped yield forfeit transfer:", e.message); 
                    }
                }
            }

            await refreshBalance();
            return true;
        } catch (err: unknown) {
            const e = err as Error;
            throw new Error(e.message?.includes("Failed to fetch") ? "Network connection unstable. Please try again." : e.message);
        } finally {
            setIsAutoInvesting(false);
        }
    }, [address, walletClient, transport, bridgeToExternal, refreshBalance]);

    useEffect(() => {
        if (address) {
            refreshBalance();
            const interval = setInterval(refreshBalance, 20000);
            return () => clearInterval(interval);
        }
    }, [address, refreshBalance]);

    return { 
        hlBalance, vaultEquity, vaultApr, vaultPnl,
        isAutoInvesting, 
        runAutoDeposit, executeQuestExit,
        refreshBalance
    };
}