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

import { useAOM3 } from '@/hooks/useAOM3';
import { AOM3_VAULT_ADDRESS, AOM3_VAULT_ABI } from '@/constants/contracts';
import { AOM3ActionModal } from '../modal/AOM3ActionModal';

const NEON_GREEN = '#00E08F';
const NEON_ORANGE = '#FFA500';
const GOLD_COLOR = '#FFD700';
const ERROR_RED = '#FF4D4D';

const SECONDS_IN_20_DAYS = 20 * 24 * 60 * 60;

type QuestData = readonly [
  `0x${string}`, // owner
  bigint,        // monthlyAmount
  bigint,        // totalDeposited
  bigint,        // currentStreak
  bigint,        // durationMonths
  bigint,        // startTimestamp
  bigint,        // lastDepositTimestamp
  bigint,        // dp
  boolean        // active
];

interface DynamicPlanCardProps {
    questId: bigint;
    onActionSuccess?: () => void;
}

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
    }, []);

    const { data: quest, isLoading, refetch } = useReadContract({
        address: AOM3_VAULT_ADDRESS,
        abi: AOM3_VAULT_ABI,
        functionName: 'quests',
        args: [questId],
    });

    const questData = quest as unknown as QuestData;

    const coolingStatus = useMemo(() => {
        if (!questData || currentTime === 0) return { isLocked: false, daysLeft: 0 };
        
        const lastDep = Number(questData[6]);
        const nextAvailable = lastDep + SECONDS_IN_20_DAYS;
        const isLocked = currentTime < nextAvailable;
        const daysLeft = Math.ceil((nextAvailable - currentTime) / (24 * 3600));

        return { isLocked, daysLeft };
    }, [questData, currentTime]);

    if (isLoading || !quest) {
        return <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 4, bgcolor: '#1A1A1A' }} />;
    }

    const [, monthlyAmount, totalDeposited, currentStreak, duration, startTimestamp, lastDepositTimestamp, dp, active] = questData;

    if (!active) return null;

    const streak = Number(currentStreak);
    const monthlyAmtStr = formatUnits(monthlyAmount, 6);
    const totalDepNum = Number(formatUnits(totalDeposited, 6));
    const userDP = Number(dp);
    const goalNum = Number(monthlyAmtStr) * Number(duration);
    const progress = (totalDepNum / goalNum) * 100;

    const networkShare = totalDP > 0 ? (userDP / Number(totalDP)) * 100 : 0;

    const maturityTimestamp = Number(startTimestamp) + (Number(duration) * 30 * 24 * 60 * 60);
    const isMatured = Math.floor(Date.now() / 1000) >= maturityTimestamp;
    const penaltyAmount = isMatured ? 0 : totalDepNum * 0.1;

    const canDeposit = isWindowOpen && !coolingStatus.isLocked;

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
                border: `1px solid ${isMatured ? NEON_GREEN : (coolingStatus.isLocked ? `${ERROR_RED}44` : '#222')}`, 
                borderRadius: 3,
                position: 'relative',
                overflow: 'visible',
                transition: '0.3s',
                '&:hover': { borderColor: isMatured ? NEON_GREEN : '#444' }
            }}>
                <Box sx={{ position: 'absolute', top: -12, right: 24, zIndex: 1 }}>
                    <Chip 
                        icon={<MilitaryTechIcon sx={{ color: '#000 !important' }} />}
                        label={`${userDP.toLocaleString()} DP`}
                        sx={{ bgcolor: GOLD_COLOR, fontWeight: 900, color: '#000', boxShadow: `0 4px 10px ${GOLD_COLOR}44` }}
                    />
                </Box>

                <CardContent sx={{ p: 4 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                        <Box sx={{ flex: 2 }}>
                            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                <Typography variant="h6" fontWeight="900" color="white">
                                    {isMatured ? "🏆 MISSION COMPLETE" : `QUEST PROGRESS`}
                                </Typography>
                                {!isMatured && (
                                    <Chip label={`Streak: ${streak}`} size="small" sx={{ bgcolor: 'rgba(0, 224, 143, 0.1)', color: NEON_GREEN, fontWeight: 800 }} />
                                )}
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
                                    <Typography variant="caption" color="text.secondary">COMMITMENT</Typography>
                                    <Typography variant="body2" color="white" fontWeight={700}>{duration.toString()} Months</Typography>
                                </Box>
                                {/* ✨ แสดงวันถอนที่แน่นอน */}
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
                            <Typography variant="h4" fontWeight="900" sx={{ color: 'white' }}>
                                ${(totalDepNum - penaltyAmount).toLocaleString()}
                            </Typography>
                            
                            <Stack direction="row" spacing={1} mt={4} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                                <Button 
                                    variant="outlined" 
                                    onClick={() => setModalConfig({ open: true, type: 'withdraw' })}
                                    sx={{ borderRadius: 2, borderColor: '#333', color: '#888', fontWeight: 700, minWidth: 100 }}
                                >
                                    Exit
                                </Button>
                                <Button 
                                    variant="contained" 
                                    disabled={!canDeposit || isProcessing}
                                    onClick={() => setModalConfig({ open: true, type: 'deposit' })}
                                    startIcon={coolingStatus.isLocked && <AccessTimeIcon />}
                                    sx={{ 
                                        borderRadius: 2, 
                                        bgcolor: canDeposit ? NEON_GREEN : '#222', 
                                        color: canDeposit ? '#000' : '#666', 
                                        fontWeight: 900, minWidth: 140,
                                        '&:hover': { bgcolor: '#00C97F' },
                                        transition: '0.2s'
                                    }}
                                >
                                    {coolingStatus.isLocked 
                                        ? `WAIT ${coolingStatus.daysLeft}D` 
                                        : (isWindowOpen ? "DEPOSIT" : "STANDBY")}
                                </Button>
                            </Stack>
                            {coolingStatus.isLocked && (
                                <Typography variant="caption" sx={{ color: ERROR_RED, mt: 1, display: 'block', fontWeight: 700 }}>
                                    Cooling down active
                                </Typography>
                            )}
                        </Box>
                    </Stack>
                </CardContent>
            </Card>

            <AOM3ActionModal 
                open={modalConfig.open}
                onClose={() => !isProcessing && setModalConfig((prev) => ({ ...prev, open: false }))}
                type={modalConfig.type}
                title={modalConfig.type === 'deposit' ? "Confirm Monthly Deposit" : "Confirm Exit Strategy"}
                amount={modalConfig.type === 'deposit' ? monthlyAmtStr : totalDepNum.toFixed(2)}
                penalty={penaltyAmount}
                streak={streak}
                loading={isProcessing}
                onConfirm={handleConfirmAction}
                lastDepositTimestamp={Number(lastDepositTimestamp)}
            />
        </>
    );
};