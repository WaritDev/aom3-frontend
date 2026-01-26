'use client';

import { useReadContract, useWriteContract, useAccount, usePublicClient } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { 
    AOM3_VAULT_ADDRESS, 
    AOM3_VAULT_ABI, 
    USDC_ADDRESS, 
    USDC_ABI,
    AOM3_REWARD_DISTRIBUTOR_ADDRESS,
    AOM3_REWARD_DISTRIBUTOR_ABI
} from '../constants/contracts';

export function useAOM3() {
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();

    const { data: nextQuestId, refetch: refetchNextId } = useReadContract({
        address: AOM3_VAULT_ADDRESS,
        abi: AOM3_VAULT_ABI,
        functionName: 'nextQuestId',
    });

    const { data: totalDP, refetch: refetchTotalDP } = useReadContract({
        address: AOM3_VAULT_ADDRESS,
        abi: AOM3_VAULT_ABI,
        functionName: 'totalDisciplinePoints',
    });

    const { data: currentDay } = useReadContract({
        address: AOM3_VAULT_ADDRESS,
        abi: AOM3_VAULT_ABI,
        functionName: 'getDayOfMonth',
        args: [BigInt(Math.floor(Date.now() / 1000))],
    });

    const { data: isWindowOpen } = useReadContract({
        address: AOM3_VAULT_ADDRESS,
        abi: AOM3_VAULT_ABI,
        functionName: 'isInsideWindow',
    });

    const { data: rewardPoolBalance, refetch: refetchPool } = useReadContract({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: 'balanceOf',
        args: [AOM3_REWARD_DISTRIBUTOR_ADDRESS],
    });

    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: 'allowance',
        args: address ? [address, AOM3_VAULT_ADDRESS] : undefined,
    });

    const ensureAllowance = async (amountBigInt: bigint) => {
        if (!address || !publicClient) return;
        if (!allowance || (allowance as bigint) < amountBigInt) {
            const hash = await writeContractAsync({
                address: USDC_ADDRESS,
                abi: USDC_ABI,
                functionName: 'approve',
                args: [AOM3_VAULT_ADDRESS, amountBigInt],
            });
            await publicClient.waitForTransactionReceipt({ hash });
            await refetchAllowance();
        }
    };

    const createQuestAction = async (monthlyAmount: string, durationMonths: number) => {
        const amountBigInt = parseUnits(monthlyAmount, 6);
        await ensureAllowance(amountBigInt);

        const hash = await writeContractAsync({
            address: AOM3_VAULT_ADDRESS,
            abi: AOM3_VAULT_ABI,
            functionName: 'createQuest',
            args: [amountBigInt, BigInt(durationMonths)],
        });
        
        await publicClient?.waitForTransactionReceipt({ hash });
        refetchTotalDP();
        refetchNextId();
        return hash;
    };

    const depositAction = async (questId: number) => {
        const hash = await writeContractAsync({
            address: AOM3_VAULT_ADDRESS,
            abi: AOM3_VAULT_ABI,
            functionName: 'deposit',
            args: [BigInt(questId)],
        });
        await publicClient?.waitForTransactionReceipt({ hash });
        return hash;
    };

    const claimRewardAction = async (questId: number) => {
        const hash = await writeContractAsync({
            address: AOM3_REWARD_DISTRIBUTOR_ADDRESS,
            abi: AOM3_REWARD_DISTRIBUTOR_ABI,
            functionName: 'claimReward',
            args: [BigInt(questId)],
        });
        await publicClient?.waitForTransactionReceipt({ hash });
        refetchPool();
        return hash;
    };

    const withdrawAction = async (questId: number) => {
        const hash = await writeContractAsync({
            address: AOM3_VAULT_ADDRESS,
            abi: AOM3_VAULT_ABI,
            functionName: 'withdraw',
            args: [BigInt(questId)],
        });
        await publicClient?.waitForTransactionReceipt({ hash });
        refetchTotalDP();
        refetchPool();
        return hash;
    };

    return { 
        // Data
        isWindowOpen: !!isWindowOpen,
        currentDay: Number(currentDay || 0),
        totalDP: totalDP ? (totalDP as bigint) : BigInt(0),
        rewardPoolBalance: rewardPoolBalance ? formatUnits(rewardPoolBalance as bigint, 6) : "0",
        nextQuestId: nextQuestId as bigint | undefined,
        
        // Actions
        createQuestAction,
        depositAction,
        claimRewardAction,
        withdrawAction,

        // Utils
        refetchPool,
        refetchTotalDP,
        refetchNextId
    };
}