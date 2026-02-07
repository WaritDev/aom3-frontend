'use client';

import { useCallback } from 'react';
import { useReadContract, useWriteContract, useAccount, usePublicClient } from 'wagmi';
import { parseUnits, formatUnits, type Address, type Hash } from 'viem';
import { 
    AOM3_VAULT_ADDRESS, 
    AOM3_VAULT_ABI, 
    USDC_ADDRESS, 
    USDC_ABI,
    AOM3_REWARD_DISTRIBUTOR_ADDRESS,
    AOM3_REWARD_DISTRIBUTOR_ABI,
    AOM3_RANKING_ADDRESS,
    AOM3_RANKING_ABI
} from '../constants/contracts';

export interface UserRankingStats {
    lifetimeDP: number;
    currentActiveDP: number;
    totalQuests: number;
    totalMonths: number;
}

export interface LeaderboardEntry extends UserRankingStats {
    address: Address;
}

type RankingContractResult = readonly [bigint, bigint, bigint, bigint];

export function useAOM3() {
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();

    // --- Vault & Global Stats ---
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

    // --- Ranking & User Stats ---
    const { data: rankingData, refetch: refetchRanking } = useReadContract({
        address: AOM3_RANKING_ADDRESS,
        abi: AOM3_RANKING_ABI,
        functionName: 'userStats',
        args: address ? [address] : undefined,
    });

    const { data: totalParticipants } = useReadContract({
        address: AOM3_RANKING_ADDRESS,
        abi: AOM3_RANKING_ABI,
        functionName: 'getTotalParticipants',
    });

    // --- Protocol Stats ---
    const { data: isWindowOpen } = useReadContract({
        address: AOM3_VAULT_ADDRESS,
        abi: AOM3_VAULT_ABI,
        functionName: 'isInsideWindow',
    });

    const { data: currentDayData } = useReadContract({
        address: AOM3_VAULT_ADDRESS,
        abi: AOM3_VAULT_ABI,
        functionName: 'getDayOfMonth',
        args: [BigInt(Math.floor(Date.now() / 1000))],
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

    // --- Stable Leaderboard Fetcher ---
    const fetchLeaderboard = useCallback(async (): Promise<LeaderboardEntry[]> => {
        if (!publicClient || !totalParticipants) return [];
        
        const participantsData: LeaderboardEntry[] = [];
        const count = Number(totalParticipants);

        for (let i = 0; i < count; i++) {
            try {
                const participantAddr = await publicClient.readContract({
                    address: AOM3_RANKING_ADDRESS,
                    abi: AOM3_RANKING_ABI,
                    functionName: 'allParticipants',
                    args: [BigInt(i)],
                }) as Address;

                const stats = await publicClient.readContract({
                    address: AOM3_RANKING_ADDRESS,
                    abi: AOM3_RANKING_ABI,
                    functionName: 'userStats',
                    args: [participantAddr],
                }) as RankingContractResult;

                participantsData.push({
                    address: participantAddr,
                    lifetimeDP: Number(stats[0]),
                    currentActiveDP: Number(stats[1]),
                    totalQuests: Number(stats[2]),
                    totalMonths: Number(stats[3]),
                });
            } catch (err) {
                console.error(`Error fetching participant index ${i}:`, err);
            }
        }
        return participantsData.sort((a, b) => b.currentActiveDP - a.currentActiveDP);
    }, [publicClient, totalParticipants]);

    // --- Type-Safe Actions ---
    const ensureAllowance = async (amountBigInt: bigint): Promise<void> => {
        if (!address || !publicClient) return;
        if (!allowance || (allowance as bigint) < amountBigInt) {
            const hash: Hash = await writeContractAsync({
                address: USDC_ADDRESS,
                abi: USDC_ABI,
                functionName: 'approve',
                args: [AOM3_VAULT_ADDRESS, amountBigInt],
            });
            await publicClient.waitForTransactionReceipt({ hash });
            await refetchAllowance();
        }
    };

    const createQuestAction = async (monthlyAmount: string, durationMonths: number): Promise<Hash | undefined> => {
        const amountBigInt = parseUnits(monthlyAmount, 6);
        await ensureAllowance(amountBigInt);

        const hash: Hash = await writeContractAsync({
            address: AOM3_VAULT_ADDRESS,
            abi: AOM3_VAULT_ABI,
            functionName: 'createQuest',
            args: [amountBigInt, BigInt(durationMonths)],
        });
        
        await publicClient?.waitForTransactionReceipt({ hash });
        await Promise.all([refetchTotalDP(), refetchNextId(), refetchRanking()]);
        return hash;
    };

    const depositAction = async (questId: number, amountStr?: string): Promise<Hash | undefined> => {
        if (amountStr) {
            const amountBigInt = parseUnits(amountStr, 6);
            await ensureAllowance(amountBigInt);
        }

        const hash: Hash = await writeContractAsync({
            address: AOM3_VAULT_ADDRESS,
            abi: AOM3_VAULT_ABI,
            functionName: 'deposit',
            args: [BigInt(questId)],
        });
        
        await publicClient?.waitForTransactionReceipt({ hash });
        await Promise.all([refetchRanking(), refetchTotalDP(), refetchAllowance()]);
        return hash;
    };

    const withdrawAction = async (questId: number): Promise<Hash | undefined> => {
        const hash: Hash = await writeContractAsync({
            address: AOM3_VAULT_ADDRESS,
            abi: AOM3_VAULT_ABI,
            functionName: 'withdraw',
            args: [BigInt(questId)],
        });
        await publicClient?.waitForTransactionReceipt({ hash });
        await Promise.all([refetchTotalDP(), refetchPool(), refetchRanking()]);
        return hash;
    };

    const claimRewardAction = async (questId: number): Promise<Hash | undefined> => {
        const hash: Hash = await writeContractAsync({
            address: AOM3_REWARD_DISTRIBUTOR_ADDRESS,
            abi: AOM3_REWARD_DISTRIBUTOR_ABI,
            functionName: 'claimReward',
            args: [BigInt(questId)],
        });
        await publicClient?.waitForTransactionReceipt({ hash });
        await refetchPool();
        return hash;
    };

    const rankingTyped = rankingData as RankingContractResult | undefined;
    const userRanking: UserRankingStats = {
        lifetimeDP: rankingTyped ? Number(rankingTyped[0]) : 0,
        currentActiveDP: rankingTyped ? Number(rankingTyped[1]) : 0,
        totalQuests: rankingTyped ? Number(rankingTyped[2]) : 0,
        totalMonths: rankingTyped ? Number(rankingTyped[3]) : 0,
    };

    return { 
        isWindowOpen: !!isWindowOpen,
        currentDay: Number(currentDayData || 0),
        totalDP: totalDP ? Number(totalDP) : 0,
        rewardPoolBalance: rewardPoolBalance ? formatUnits(rewardPoolBalance as bigint, 6) : "0",
        nextQuestId: nextQuestId as bigint | undefined,
        totalParticipants: Number(totalParticipants || 0),
        userRanking,
        createQuestAction,
        depositAction,
        claimRewardAction,
        withdrawAction,
        fetchLeaderboard,
        refetchPool,
        refetchTotalDP,
        refetchNextId,
        refetchRanking
    };
}