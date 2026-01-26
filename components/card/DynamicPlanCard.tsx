'use client';

import React, { useState } from 'react';
import { formatUnits } from 'viem';
import { useReadContract } from 'wagmi';
import { 
    Card, CardContent, Stack, Box, Typography, 
    LinearProgress, Button, Skeleton 
} from '@mui/material';

import { useAOM3 } from '@/hooks/useAOM3';
import { AOM3_VAULT_ADDRESS, AOM3_VAULT_ABI } from '@/constants/contracts';

const NEON_GREEN = '#00E08F';
const NEON_ORANGE = '#FF9800';

type QuestData = readonly [
  `0x${string}`, // owner
  bigint,        // monthlyAmount
  bigint,        // totalDeposited
  bigint,        // currentStreak
  bigint,        // durationMonths
  bigint,        // startTimestamp
  boolean        // active
];

interface DynamicPlanCardProps {
    questId: bigint;
    onActionSuccess?: () => void;
    }

    export const DynamicPlanCard: React.FC<DynamicPlanCardProps> = ({ questId, onActionSuccess }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const { isWindowOpen, depositWithApprove } = useAOM3();

    const { data: quest, isLoading, refetch } = useReadContract({
        address: AOM3_VAULT_ADDRESS,
        abi: AOM3_VAULT_ABI,
        functionName: 'quests',
        args: [questId],
    });

    if (isLoading || !quest) {
        return <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 4, bgcolor: '#1A1A1A' }} />;
    }

    const questData = quest as unknown as QuestData;
    const [, monthlyAmount, totalDeposited, currentStreak, duration, active] = questData;

    const streak = Number(currentStreak);
    const monthlyAmtStr = formatUnits(monthlyAmount, 6);
    const totalDepNum = Number(formatUnits(totalDeposited, 6));
    const goalNum = Number(monthlyAmtStr) * Number(duration);
    const progress = goalNum > 0 ? (totalDepNum / goalNum) * 100 : 0;

    const handleDeposit = async () => {
        setIsProcessing(true);
        try {
        await depositWithApprove(questId, monthlyAmtStr);
        await refetch();
        onActionSuccess?.();
        alert("Mission Successful! Streak Updated 🔥");
        } catch (error) {
        console.error("Deposit Error:", error);
        } finally {
        setIsProcessing(false);
        }
    };

    return (
        <Card sx={{ 
        bgcolor: '#0A0A0A', 
        border: `1px solid ${streak === 0 && !isWindowOpen ? NEON_ORANGE : NEON_GREEN}`, 
        borderRadius: 4,
        color: 'white',
        mb: 2
        }}>
        <CardContent sx={{ p: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
            <Box sx={{ flex: 2, width: '100%' }}>
                <Typography variant="h6" fontWeight="900">
                {streak > 0 ? "🔥 STREAK ACTIVE" : "❄️ INITIALIZING"}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight="700">
                GOAL: {goalNum.toLocaleString()} USDC
                </Typography>
                <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ height: 8, mt: 2, borderRadius: 4, bgcolor: '#1A1A1A', '& .MuiLinearProgress-bar': { bgcolor: NEON_GREEN } }} 
                />
            </Box>

            <Box sx={{ flex: 1, textAlign: 'right' }}>
                <Typography variant="caption" color="text.secondary">STREAK</Typography>
                <Typography variant="h3" fontWeight="900" sx={{ color: NEON_GREEN }}>{streak} Mo.</Typography>
                <Button 
                variant="contained" 
                onClick={handleDeposit}
                disabled={!isWindowOpen || !active || isProcessing}
                sx={{ mt: 2, bgcolor: NEON_GREEN, color: '#000', fontWeight: 900 }}
                >
                {isWindowOpen ? "Deposit" : "Locked"}
                </Button>
            </Box>
            </Stack>
        </CardContent>
        </Card>
    );
};