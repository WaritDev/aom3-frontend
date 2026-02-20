'use client';

import { useCallback, useMemo } from 'react';
import { useReadContract, useWriteContract, useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { parseSignature, type Abi, parseUnits, formatUnits, getAddress, Hex } from 'viem';
import { 
    AOM3_VAULT_ADDRESS, 
    AOM3_VAULT_ABI, 
    USDC_ADDRESS,
    AOM3_RANKING_ADDRESS,
    AOM3_RANKING_ABI,
    AOM3_REWARD_DISTRIBUTOR_ADDRESS,
    AOM3_REWARD_DISTRIBUTOR_ABI,
} from '../constants/contracts';

const rawBridgeAddress = process.env.NEXT_PUBLIC_HL_BRIDGE_ADDRESS;
if (!rawBridgeAddress) {
    throw new Error("NEXT_PUBLIC_HL_BRIDGE_ADDRESS is missing in .env file");
}
export const HL_BRIDGE_ADDRESS = getAddress(rawBridgeAddress as Hex);

export function useAOM3() {
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();
    const { writeContractAsync } = useWriteContract();

    const { data: virtualBalanceRaw, refetch: refetchBalance } = useReadContract({
        address: AOM3_VAULT_ADDRESS,
        abi: AOM3_VAULT_ABI as Abi,
        functionName: 'userBalance',
        args: address ? [address] : undefined,
    });

    const { data: rankingData, refetch: refetchRanking } = useReadContract({
        address: AOM3_RANKING_ADDRESS,
        abi: AOM3_RANKING_ABI as Abi,
        functionName: 'userStats',
        args: address ? [address] : undefined,
    });

    const { data: lockData } = useReadContract({
        address: AOM3_VAULT_ADDRESS,
        abi: AOM3_VAULT_ABI as Abi,
        functionName: 'getWithdrawalLockInfo',
        args: address ? [address] : undefined,
    });

    const { data: nextQuestId } = useReadContract({
        address: AOM3_VAULT_ADDRESS,
        abi: AOM3_VAULT_ABI as Abi,
        functionName: 'nextQuestId',
    });

    const { data: rewardPoolBalance } = useReadContract({
        address: USDC_ADDRESS,
        abi: [{ name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] }] as const,
        functionName: 'balanceOf',
        args: [AOM3_REWARD_DISTRIBUTOR_ADDRESS],
    });

    const { data: isWindowOpen } = useReadContract({
        address: AOM3_VAULT_ADDRESS,
        abi: AOM3_VAULT_ABI as Abi,
        functionName: 'isInsideWindow',
    });

    const signPermitForBridge = useCallback(async (amount: string, deadline: bigint) => {
        if (!address || !publicClient || !walletClient) throw new Error("Wallet not ready");
        const freshNonce = await publicClient.readContract({
            address: USDC_ADDRESS,
            abi: [{ name: 'nonces', type: 'function', stateMutability: 'view', inputs: [{ name: 'owner', type: 'address' }], outputs: [{ type: 'uint256' }] }] as const,
            functionName: 'nonces', args: [address],
        });
        const signature = await walletClient.signTypedData({
            account: address,
            domain: { name: "USDC2", version: "1", chainId: 421614, verifyingContract: USDC_ADDRESS },
            types: {
                Permit: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }, { name: "value", type: "uint256" }, { name: "nonce", type: "uint256" }, { name: "deadline", type: "uint256" }],
            },
            primaryType: 'Permit',
            message: { owner: address, spender: HL_BRIDGE_ADDRESS, value: parseUnits(amount, 6), nonce: freshNonce, deadline },
        });
        const sig = parseSignature(signature);
        return { v: Number(sig.v) < 27 ? Number(sig.v) + 27 : Number(sig.v), r: sig.r, s: sig.s };
    }, [address, publicClient, walletClient]);

    const createQuestAction = useCallback(async (monthlyAmount: string, durationMonths: number) => {
        if (!publicClient || !address || !walletClient) return;
        const deadline = BigInt(Math.floor(Date.now() / 1000) + 7200);
        try {
            const { v, r, s } = await signPermitForBridge(monthlyAmount, deadline);
            const hash = await writeContractAsync({
                address: AOM3_VAULT_ADDRESS,
                abi: AOM3_VAULT_ABI as Abi,
                functionName: 'createQuestWithPermit', 
                args: [parseUnits(monthlyAmount, 6), BigInt(durationMonths), deadline, v, r, s],
            });
            await publicClient.waitForTransactionReceipt({ hash });
            await Promise.all([refetchBalance(), refetchRanking()]);
            return hash;
        } catch (err: unknown) { console.error(err); throw err; }
    }, [address, publicClient, walletClient, signPermitForBridge, writeContractAsync, refetchBalance, refetchRanking]);

    const claimRewardAction = useCallback(async (questId: number) => {
        const hash = await writeContractAsync({
            address: AOM3_REWARD_DISTRIBUTOR_ADDRESS,
            abi: AOM3_REWARD_DISTRIBUTOR_ABI as Abi,
            functionName: 'claimReward',
            args: [BigInt(questId)],
        });
        if (publicClient) await publicClient.waitForTransactionReceipt({ hash });
        return hash;
    }, [writeContractAsync, publicClient]);

    const withdrawAction = useCallback(async (questId: number) => {
        const hash = await writeContractAsync({
            address: AOM3_VAULT_ADDRESS,
            abi: AOM3_VAULT_ABI as Abi,
            functionName: 'withdraw',
            args: [BigInt(questId)],
        });
        if (publicClient) await publicClient.waitForTransactionReceipt({ hash });
        await Promise.all([refetchBalance(), refetchRanking()]);
        return hash;
    }, [writeContractAsync, publicClient, refetchBalance, refetchRanking]);

    const stats = useMemo(() => {
        const data = rankingData as bigint[] | undefined;
        return { 
            totalDP: data ? Number(data[0]) : 0, 
            activeDP: data ? Number(data[1]) : 0 
        };
    }, [rankingData]);

    const lockInfo = useMemo(() => {
        const data = lockData as [bigint, boolean] | undefined;
        return { 
            remainingLockSeconds: data ? Number(data[0]) : 0, 
            isWithdrawLocked: data ? data[1] : false 
        };
    }, [lockData]);

    return { 
        createQuestAction, 
        withdrawAction,
        claimRewardAction,
        nextQuestId: nextQuestId ? Number(nextQuestId) : 0,
        rewardPoolBalance: rewardPoolBalance ? formatUnits(rewardPoolBalance as bigint, 6) : "0",
        currentDay: new Date().getDate(),
        virtualBalance: virtualBalanceRaw ? formatUnits(virtualBalanceRaw as bigint, 6) : "0",
        totalDP: stats.totalDP,
        activeDP: stats.activeDP,
        remainingLockSeconds: lockInfo.remainingLockSeconds,
        isWithdrawLocked: lockInfo.isWithdrawLocked,
        isWindowOpen: !!isWindowOpen,
        depositAction: createQuestAction,
        refetchBalance,
    };
}