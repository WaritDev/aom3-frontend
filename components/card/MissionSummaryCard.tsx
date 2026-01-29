'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { 
    Zoom, Card, CardContent, Stack, Box, Typography, 
    Divider, Button, CircularProgress 
} from '@mui/material';
import StarsIcon from '@mui/icons-material/Stars';
import YieldChart from '../chart/YieldChart';

const NEON_GREEN = '#00E08F';

interface MissionSummaryCardProps {
    isYieldLoading: boolean;
    estimatedMaxApy: string | number; 
    totalPrincipal: number;
    estimatedInterest: number;
    amountNum: number;
    walletBalance: number;
    isDeploying: boolean;
    isConfirming: boolean;
    onInitialize: () => void;
    coinSymbol?: string;
    durationMultiplier: number; 
    durationMonths: number;     
}

export const MissionSummaryCard: React.FC<MissionSummaryCardProps> = ({
    estimatedMaxApy: initialApy,
    estimatedInterest: initialInterest,
    amountNum,
    walletBalance,
    isDeploying,
    isConfirming,
    onInitialize,
    coinSymbol = 'BTC',
    durationMultiplier,
    durationMonths
}) => {
    const [liveBaseApy, setLiveBaseApy] = useState<number | null>(null);

    const handleApyLoad = useCallback((apy: number) => {
        setLiveBaseApy(apy);
    }, []);

    const memoizedChart = useMemo(() => (
        <YieldChart coin={coinSymbol} onApyLoad={handleApyLoad} />
    ), [coinSymbol, handleApyLoad]);

    const dynamicData = useMemo(() => {
        if (liveBaseApy === null) {
            return { 
                displayApy: initialApy, 
                displayInterest: initialInterest
            };
        }

        const maxPotentialApy = liveBaseApy;
        const monthlyRate = liveBaseApy / 100 / 12;
        const futureValue = amountNum * ((Math.pow(1 + monthlyRate, durationMonths) - 1) / monthlyRate);
        const baseInterest = futureValue - (amountNum * durationMonths);

        return {
            displayApy: maxPotentialApy.toFixed(2),
            displayInterest: baseInterest
        };
    }, [liveBaseApy, initialApy, initialInterest, amountNum, durationMonths]);

    const isButtonDisabled = !amountNum || isDeploying || isConfirming || amountNum > walletBalance;

    return (
        <Zoom in timeout={600}>
            <Card sx={{ 
                background: 'linear-gradient(135deg, #0d2e15 0%, #050505 100%)', 
                border: `1px solid ${NEON_GREEN}`,
                borderRadius: 3,
                boxShadow: `0 0 30px ${NEON_GREEN}15`,
                overflow: 'hidden'
            }}>
                <CardContent sx={{ p: 4 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center" mb={4}>
                        <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                            <Typography variant="overline" sx={{ color: NEON_GREEN, fontWeight: 900, letterSpacing: 2 }}>
                                ESTIMATED MAX APY (INCL. BOOST)
                            </Typography>
                            <Typography variant="h2" fontWeight="900" sx={{ color: NEON_GREEN, letterSpacing: -2 }}>
                                {liveBaseApy === null ? <CircularProgress size={30} color="inherit" /> : `${dynamicData.displayApy}%`}
                            </Typography>
                            <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }} mt={1}>
                                <StarsIcon sx={{ fontSize: 18, color: NEON_GREEN }} />
                                <Typography variant="subtitle2" color="white" fontWeight="800">
                                    {durationMultiplier}x DISCIPLINE WEIGHT ACTIVE
                                </Typography>
                            </Stack>
                        </Box>

                        <Stack sx={{ flex: 1.2, width: '100%' }} spacing={1.5}>
                            <Box display="flex" justifyContent="space-between">
                                <Typography color="rgba(255,255,255,0.5)" fontWeight={600}>Total Principal</Typography>
                                <Typography fontWeight="800" color="white">
                                    {(amountNum * durationMonths).toLocaleString()} USDC
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography color="rgba(255,255,255,0.5)" fontWeight={600}>Est. Real Yield</Typography>
                                <Typography fontWeight="800" color={NEON_GREEN}>
                                    +{dynamicData.displayInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDC
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="h6" fontWeight="900" color="white">MATURITY TOTAL</Typography>
                                    <Typography variant="caption" color="text.secondary">+ Share of Global Reward Pool</Typography>
                                </Box>
                                <Typography variant="h5" fontWeight="900" color={NEON_GREEN}>
                                    {((amountNum * durationMonths) + dynamicData.displayInterest).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </Typography>
                            </Box>
                        </Stack>
                    </Stack>

                    <Box sx={{ 
                        mb: 4, 
                        borderRadius: 2, 
                        overflow: 'hidden', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        bgcolor: 'rgba(0,0,0,0.5)',
                        height: 300,
                        position: 'relative',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Box sx={{ flex: 1, width: '100%', height: '100%' }}>
                            {memoizedChart}
                        </Box>
                    </Box>
                    
                    <Button 
                        variant="contained" fullWidth size="large" 
                        disabled={isButtonDisabled}
                        onClick={onInitialize}
                        sx={{ 
                            py: 2.5, 
                            borderRadius: 2,
                            fontWeight: 900, 
                            bgcolor: NEON_GREEN, 
                            color: '#000', 
                            '&:hover': { bgcolor: '#00C97F' } 
                        }}
                    >
                        {isConfirming ? (
                            <Stack direction="row" spacing={2} alignItems="center">
                                <CircularProgress size={20} color="inherit" />
                                <Typography fontWeight={900}>SYNCING BLOCKCHAIN...</Typography>
                            </Stack>
                        ) : "INITIALIZE SAVINGS QUEST"}
                    </Button>
                </CardContent>
            </Card>
        </Zoom>
    );
};