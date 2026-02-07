'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { formatUnits } from 'viem';
import { useReadContract } from 'wagmi';
import { 
    Card, CardContent, Stack, Box, Typography, 
    LinearProgress, Button, Skeleton, Divider, Chip
} from '@mui/material';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useAOM3 } from '@/hooks/useAOM3';
import { AOM3_VAULT_ADDRESS, AOM3_VAULT_ABI } from '@/constants/contracts';
import { AOM3ActionModal } from '../modal/AOM3ActionModal';

const NEON_GREEN = '#00E08F';
const NEON_ORANGE = '#FFA500';
const GOLD_COLOR = '#FFD700';

interface DynamicPlanCardProps {
    questId: bigint;
    onActionSuccess?: () => void;
}

type QuestData = readonly [
  `0x${string}`, // owner (0)
  bigint,        // monthlyAmount (1)
  bigint,        // totalDeposited (2)
  bigint,        // currentStreak (3)
  bigint,        // durationMonths (4)
  bigint,        // startTimestamp (5)
  bigint,        // lastDepositTimestamp (6)
  bigint,        // dp (7)
  boolean        // active (8)
];

export const DynamicPlanCard: React.FC<DynamicPlanCardProps> = ({ questId, onActionSuccess }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [modalConfig, setModalConfig] = useState<{
        open: boolean;
        type: 'deposit' | 'withdraw';
    }>({ open: false, type: 'deposit' });

    const { isWindowOpen, totalDP, depositAction, withdrawAction } = useAOM3();

    useEffect(() => {
        setCurrentTime(Math.floor(Date.now() / 1000));
        const interval = setInterval(() => setCurrentTime(Math.floor(Date.now() / 1000)), 60000);
        return () => clearInterval(interval);
    }, []);

    const { data: quest, isLoading, refetch } = useReadContract({
        address: AOM3_VAULT_ADDRESS,
        abi: AOM3_VAULT_ABI,
        functionName: 'quests',
        args: [questId],
    });

    const questData = quest as QuestData | undefined;

    const coolingStatus = useMemo(() => {
        if (!questData || currentTime === 0) return { isLocked: false, label: "" };
        
        const lastDep = Number(questData[6]);
        if (lastDep === 0) return { isLocked: false, label: "" };

        const lastDate = new Date(lastDep * 1000);
        const currDate = new Date(currentTime * 1000);

        const hasDepositedThisMonth = 
            lastDate.getMonth() === currDate.getMonth() && 
            lastDate.getFullYear() === currDate.getFullYear();

        if (hasDepositedThisMonth) {
            const nextMonth = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 1);
            const daysToNext = Math.ceil((nextMonth.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
            return { isLocked: true, label: `NEXT DEPOSIT (${daysToNext}D)` };
        }

        return { isLocked: false, label: "" };
    }, [questData, currentTime]);

    if (isLoading || !questData) {
        return <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 4, bgcolor: '#1A1A1A' }} />;
    }

    const [, monthlyAmount, totalDeposited, currentStreak, duration, startTimestamp, , dp, active] = questData;

    if (!active) return null;

    const monthlyAmtStr = formatUnits(monthlyAmount, 6);
    const totalDepNum = Number(formatUnits(totalDeposited, 6));
    const goalNum = Number(monthlyAmtStr) * Number(duration);
    const progress = Math.min((totalDepNum / goalNum) * 100, 100);

    const maturityTimestamp = Number(startTimestamp) + (Number(duration) * 30 * 24 * 60 * 60);
    const isMatured = currentTime >= maturityTimestamp;
    
    const penaltyAmount = isMatured ? 0 : totalDepNum * 0.1;

    const networkShare = totalDP > 0 ? (Number(dp) / Number(totalDP)) * 100 : 0;
    const canDeposit = isWindowOpen && !coolingStatus.isLocked && !isMatured;

    const handleConfirmAction = async () => {
        setIsProcessing(true);
        try {
            if (modalConfig.type === 'deposit') {
                await depositAction(Number(questId));
            } else {
                await withdrawAction(Number(questId));
            }
            await refetch();
            onActionSuccess?.();
            setModalConfig((prev) => ({ ...prev, open: false }));
        } catch (err) { console.error(err); } finally { setIsProcessing(false); }
    };

    return (
        <>
            <Card sx={{ 
                bgcolor: '#0D0D0D', 
                border: `1px solid ${isMatured ? NEON_GREEN : (coolingStatus.isLocked ? `${NEON_GREEN}44` : '#222')}`, 
                borderRadius: 3,
                position: 'relative',
                overflow: 'visible',
                transition: '0.3s',
                '&:hover': { borderColor: NEON_GREEN }
            }}>
                {/* DP Badge */}
                <Box sx={{ position: 'absolute', top: -12, right: 24, zIndex: 1 }}>
                    <Chip 
                        icon={<MilitaryTechIcon sx={{ color: '#000 !important' }} />}
                        label={`${Number(dp).toLocaleString()} DP`}
                        sx={{ bgcolor: GOLD_COLOR, fontWeight: 900, color: '#000', boxShadow: `0 4px 10px ${GOLD_COLOR}44` }}
                    />
                </Box>

                <CardContent sx={{ p: 4 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                        <Box sx={{ flex: 2 }}>
                            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                <Typography variant="h6" fontWeight="900" color="white" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {isMatured ? <CheckCircleIcon sx={{ color: NEON_GREEN }} /> : null}
                                    {isMatured ? "MISSION ACCOMPLISHED" : "QUEST PROGRESS"}
                                </Typography>
                                <Chip label={`Streak: ${currentStreak}`} size="small" sx={{ bgcolor: 'rgba(0, 224, 143, 0.1)', color: NEON_GREEN, fontWeight: 800 }} />
                            </Stack>
                            
                            <Typography variant="body2" color="text.secondary" mb={2}>
                                {totalDepNum.toLocaleString()} / {goalNum.toLocaleString()} USDC committed
                            </Typography>

                            <LinearProgress 
                                variant="determinate" 
                                value={progress} 
                                sx={{ 
                                    height: 8, borderRadius: 4, bgcolor: '#1A1A1A', mb: 2, 
                                    '& .MuiLinearProgress-bar': { bgcolor: isMatured ? NEON_GREEN : NEON_ORANGE } 
                                }} 
                            />

                            <Stack direction="row" spacing={3}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">NETWORK WEIGHT</Typography>
                                    <Typography variant="body2" color="white" fontWeight={700}>{networkShare.toFixed(4)}%</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">MATURITY</Typography>
                                    <Typography variant="body2" color={isMatured ? NEON_GREEN : "white"} fontWeight={700}>
                                        {new Date(maturityTimestamp * 1000).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>

                        <Divider orientation="vertical" flexItem sx={{ borderColor: '#222', display: { xs: 'none', md: 'block' } }} />

                        <Box sx={{ flex: 1, textAlign: { xs: 'left', md: 'right' } }}>
                            <Typography variant="caption" color="text.secondary" display="block">REDEEMABLE PRINCIPAL</Typography>
                            <Typography variant="h4" fontWeight="900" sx={{ color: isMatured ? NEON_GREEN : 'white' }}>
                                ${(totalDepNum - penaltyAmount).toLocaleString()}
                            </Typography>
                            
                            <Stack direction="row" spacing={1} mt={4} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                                <Button 
                                    variant="outlined" 
                                    onClick={() => setModalConfig({ open: true, type: 'withdraw' })}
                                    sx={{ borderRadius: 2, borderColor: isMatured ? NEON_GREEN : '#333', color: isMatured ? NEON_GREEN : '#888', fontWeight: 700 }}
                                >
                                    {isMatured ? "Redeem" : "Exit"}
                                </Button>
                                {!isMatured && (
                                    <Button 
                                        variant="contained" 
                                        disabled={!canDeposit || isProcessing}
                                        onClick={() => setModalConfig({ open: true, type: 'deposit' })}
                                        startIcon={coolingStatus.isLocked && <AccessTimeIcon />}
                                        sx={{ 
                                            borderRadius: 2, 
                                            bgcolor: canDeposit ? NEON_GREEN : '#222', 
                                            color: canDeposit ? '#000' : '#666', 
                                            fontWeight: 900, minWidth: 140
                                        }}
                                    >
                                        {coolingStatus.isLocked ? coolingStatus.label : (isWindowOpen ? "DEPOSIT" : "STANDBY")}
                                    </Button>
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>

            <AOM3ActionModal 
                open={modalConfig.open}
                onClose={() => !isProcessing && setModalConfig((prev) => ({ ...prev, open: false }))}
                type={modalConfig.type}
                title={modalConfig.type === 'deposit' ? "Confirm Monthly Deposit" : (isMatured ? "Redeem Full Principal" : "Emergency Exit")}
                amount={modalConfig.type === 'deposit' ? monthlyAmtStr : totalDepNum.toFixed(2)}
                penalty={penaltyAmount}
                streak={Number(currentStreak)}
                loading={isProcessing}
                onConfirm={handleConfirmAction}
            />
        </>
    );
};