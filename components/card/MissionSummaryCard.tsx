'use client';

import React, { useMemo } from 'react';
import { 
    Zoom, Card, CardContent, Stack, Box, Typography, 
    Divider, Button, CircularProgress, Tooltip
} from '@mui/material';
import StarsIcon from '@mui/icons-material/Stars';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import YieldChart from '../chart/YieldChart';
import { CheckCircleIcon } from 'lucide-react';
import { useRealYield } from '@/hooks/useRealYield';

const NEON_GREEN = '#00E08F';
const HLP_ADDRESS = "0x49d05977597b22e3c73d654c351adde9d9920e18";

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
    statusStep: number;
}

export const MissionSummaryCard: React.FC<MissionSummaryCardProps> = ({
    estimatedMaxApy: initialApy,
    amountNum,
    walletBalance,
    isDeploying,
    statusStep,
    onInitialize,
    durationMultiplier,
    durationMonths
}) => {
    const { apy: fetchedApy, loading: isApyLoading } = useRealYield(HLP_ADDRESS);
    const calculation = useMemo(() => {
        const apy = fetchedApy > 0 ? fetchedApy : (Number(initialApy) || 0);
        const monthlyRate = apy / 100 / 12;
        
        let futureValue = 0;
        if (monthlyRate > 0) {
            futureValue = amountNum * ((Math.pow(1 + monthlyRate, durationMonths) - 1) / monthlyRate);
        } else {
            futureValue = amountNum * durationMonths;
        }

        const totalPrincipal = amountNum * durationMonths;
        const estYield = Math.max(0, futureValue - totalPrincipal);

        return {
            apy: apy.toFixed(2),
            yield: estYield,
            total: futureValue,
            principal: totalPrincipal
        };
    }, [fetchedApy, initialApy, amountNum, durationMonths]);

    const isInsufficientBalance = amountNum > walletBalance;
    const isButtonDisabled = !amountNum || amountNum < 10 || isDeploying || isInsufficientBalance;

    const renderButtonContent = () => {
        if (statusStep === 3) return (
            <Stack direction="row" spacing={1} alignItems="center">
                <CheckCircleIcon /> <Typography fontWeight={900}>MISSION INITIALIZED!</Typography>
            </Stack>
        );
        
        if (statusStep === 2) return (
            <Stack direction="row" spacing={2} alignItems="center">
                <CircularProgress size={20} color="inherit" />
                <Typography fontWeight={900}>STEP 2/2: DEPLOYING TO HL VAULT...</Typography>
            </Stack>
        );
        
        if (statusStep === 1) return (
            <Stack direction="row" spacing={2} alignItems="center">
                <CircularProgress size={20} color="inherit" />
                <Typography fontWeight={900}>STEP 1/2: SIGNING AOM3 QUEST...</Typography>
            </Stack>
        );

        if (isInsufficientBalance) return `NEED ${amountNum} USDC TO START`;
        if (amountNum > 0 && amountNum < 10) return "MINIMUM 10 USDC REQUIRED";
        
        return "INITIALIZE SAVINGS QUEST";
    };

    return (
        <Zoom in timeout={600}>
            <Card sx={{ 
                background: 'linear-gradient(135deg, #0d2e15 0%, #050505 100%)', 
                border: `1px solid ${statusStep === 3 ? '#FFF' : NEON_GREEN}`,
                borderRadius: 4,
                boxShadow: statusStep === 3 ? `0 0 50px ${NEON_GREEN}40` : `0 0 30px ${NEON_GREEN}15`,
                transition: 'all 0.5s ease',
                overflow: 'hidden'
            }}>
                <CardContent sx={{ p: 4 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center" mb={4}>
                        <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                            <Typography variant="overline" sx={{ color: NEON_GREEN, fontWeight: 900, letterSpacing: 2 }}>
                                EST. MAX APY (INCL. BOOST)
                            </Typography>
                            <Typography variant="h2" fontWeight="900" sx={{ color: NEON_GREEN, letterSpacing: -2 }}>
                                {isApyLoading && fetchedApy === 0 ? (
                                    <CircularProgress size={30} color="inherit" />
                                ) : (
                                    `${calculation.apy}%`
                                )}
                            </Typography>
                            <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }} mt={1}>
                                <StarsIcon sx={{ fontSize: 18, color: NEON_GREEN }} />
                                <Typography variant="subtitle2" color="white" fontWeight="800">
                                    {durationMultiplier}x DISCIPLINE WEIGHT ACTIVE
                                </Typography>
                            </Stack>
                        </Box>

                        <Stack sx={{ flex: 1.2, width: '100%', bgcolor: 'rgba(255,255,255,0.03)', p: 2, borderRadius: 3 }} spacing={1.5}>
                            <Box display="flex" justifyContent="space-between">
                                <Typography color="rgba(255,255,255,0.5)" variant="body2" fontWeight={600}>Target Principal</Typography>
                                <Typography fontWeight="800" color="white">{calculation.principal.toLocaleString()} USDC</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Typography color="rgba(255,255,255,0.5)" variant="body2" fontWeight={600}>Est. Real Yield</Typography>
                                    <Tooltip title="Monthly Compounding Calculation">
                                        <InfoOutlinedIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }} />
                                    </Tooltip>
                                </Stack>
                                <Typography fontWeight="800" color={NEON_GREEN}>
                                    +{calculation.yield.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDC
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle1" fontWeight="900" color="white">MATURITY TOTAL</Typography>
                                <Typography variant="h5" fontWeight="900" color={NEON_GREEN}>
                                    {calculation.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </Typography>
                            </Box>
                        </Stack>
                    </Stack>

                    <Box sx={{ 
                        mb: 4, borderRadius: 3, overflow: 'hidden', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        bgcolor: '#000', height: 460, position: 'relative'
                    }}>
                        <YieldChart/>
                    </Box>
                    
                    <Button 
                        variant="contained" fullWidth size="large" 
                        disabled={isButtonDisabled || statusStep === 3}
                        onClick={onInitialize}
                        sx={{ 
                            py: 2.5, borderRadius: 3, fontWeight: 900, fontSize: '1.1rem',
                            bgcolor: statusStep === 3 ? '#FFF' : NEON_GREEN, 
                            color: '#000', 
                            boxShadow: `0 10px 30px ${NEON_GREEN}30`,
                            '&:hover': { bgcolor: '#00C97F', transform: 'translateY(-2px)' },
                            '&:disabled': { bgcolor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)' },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {renderButtonContent()}
                    </Button>
                </CardContent>
            </Card>
        </Zoom>
    );
};