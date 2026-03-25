'use client';

import React, { useMemo } from 'react';
import { 
    Zoom, Card, CardContent, Stack, Box, Typography, 
    Divider, Button, CircularProgress, Tooltip, useTheme, alpha
} from '@mui/material';
import StarsIcon from '@mui/icons-material/Stars';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import YieldChart from '../chart/YieldChart';
import { CheckCircleIcon } from 'lucide-react';
import { useRealYield } from '@/hooks/useRealYield';
import { getAddress, Hex } from 'viem';

const NEON_GREEN = '#00E08F';

const rawVaultAddress = process.env.NEXT_PUBLIC_HL_TEST_VAULT_ADDRESS;
if (!rawVaultAddress) {
    throw new Error("NEXT_PUBLIC_HL_TEST_VAULT_ADDRESS is missing in your .env file");
}
export const VAULT_ADDRESS = getAddress(rawVaultAddress as Hex);

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
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const { apy: fetchedApy, loading: isApyLoading } = useRealYield(VAULT_ADDRESS);
    
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
                <CheckCircleIcon size={20} /> <Typography fontWeight={900}>MISSION INITIALIZED!</Typography>
            </Stack>
        );
        
        const loadingTexts: Record<number, string> = {
            1: "STEP 1/2: SIGNING AOM3 QUEST...",
            2: "STEP 2/2: DEPLOYING TO HL VAULT..."
        };

        if (statusStep === 1 || statusStep === 2) return (
            <Stack direction="row" spacing={2} alignItems="center">
                <CircularProgress size={20} color="inherit" />
                <Typography fontWeight={900}>{loadingTexts[statusStep as keyof typeof loadingTexts]}</Typography>
            </Stack>
        );

        if (isInsufficientBalance) return `NEED ${amountNum} USDC TO START`;
        if (amountNum > 0 && amountNum < 10) return "MINIMUM 10 USDC REQUIRED";
        
        return "INITIALIZE SAVINGS QUEST";
    };

    return (
        <Zoom in timeout={600}>
            <Card sx={{ 
                background: isDark 
                    ? 'linear-gradient(135deg, #0d2e15 0%, #050505 100%)' 
                    : `linear-gradient(135deg, ${alpha(NEON_GREEN, 0.08)} 0%, #ffffff 100%)`, 
                border: `1px solid ${statusStep === 3 ? (isDark ? '#FFF' : NEON_GREEN) : alpha(NEON_GREEN, 0.3)}`,
                borderRadius: 4,
                boxShadow: isDark 
                    ? (statusStep === 3 ? `0 0 50px ${alpha(NEON_GREEN, 0.2)}` : `0 0 30px ${alpha(NEON_GREEN, 0.1)}`)
                    : (statusStep === 3 ? `0 15px 40px ${alpha(NEON_GREEN, 0.2)}` : `0 10px 30px rgba(0,0,0,0.05)`),
                transition: 'all 0.5s ease',
                overflow: 'hidden',
                backgroundImage: 'none'
            }}>
                <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center" mb={5}>
                        <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                            <Typography variant="overline" sx={{ color: NEON_GREEN, fontWeight: 900, letterSpacing: 3 }}>
                                Est. Max APY (Incl. Boost)
                            </Typography>
                            <Typography variant="h2" fontWeight="900" sx={{ color: isDark ? NEON_GREEN : NEON_GREEN, letterSpacing: -3 }}>
                                {isApyLoading && fetchedApy === 0 ? (
                                    <CircularProgress size={40} thickness={5} sx={{ color: NEON_GREEN }} />
                                ) : (
                                    `${calculation.apy}%`
                                )}
                            </Typography>
                            <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }} mt={1} alignItems="center">
                                <StarsIcon sx={{ fontSize: 18, color: NEON_GREEN }} />
                                <Typography variant="subtitle2" color="text.primary" fontWeight="900" sx={{ letterSpacing: 0.5 }}>
                                    {durationMultiplier}X DISCIPLINE WEIGHT ACTIVE
                                </Typography>
                            </Stack>
                        </Box>

                        <Stack sx={{ 
                            flex: 1.3, width: '100%', 
                            bgcolor: isDark ? alpha(theme.palette.common.white, 0.03) : alpha(theme.palette.common.black, 0.02), 
                            p: 3, borderRadius: 3, border: `1px solid ${theme.palette.divider}`
                        }} spacing={2}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography color="text.secondary" variant="body2" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Target Principal</Typography>
                                <Typography fontWeight="900" color="text.primary" variant="body1">{calculation.principal.toLocaleString()} USDC</Typography>
                            </Box>
                            
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Typography color="text.secondary" variant="body2" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Est. Real Yield</Typography>
                                    <Tooltip title="Monthly Compounding Calculation">
                                        <InfoOutlinedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                                    </Tooltip>
                                </Stack>
                                <Typography fontWeight="900" color={NEON_GREEN} variant="body1">
                                    +{calculation.yield.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 0.5, borderColor: theme.palette.divider }} />
                            
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle1" fontWeight="900" color="text.primary" sx={{ letterSpacing: 1 }}>MATURITY TOTAL</Typography>
                                <Typography variant="h5" fontWeight="900" color={NEON_GREEN} sx={{ fontFamily: 'monospace' }}>
                                    {calculation.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </Typography>
                            </Box>
                        </Stack>
                    </Stack>

                    <Box sx={{ 
                        mb: 4, borderRadius: 4, overflow: 'hidden', 
                        border: `1px solid ${theme.palette.divider}`, 
                        bgcolor: isDark ? '#000' : alpha(theme.palette.common.black, 0.01), 
                        height: 460, position: 'relative'
                    }}>
                        <YieldChart/>
                    </Box>
                    
                    <Button 
                        variant="contained" fullWidth size="large" 
                        disabled={isButtonDisabled || statusStep === 3}
                        onClick={onInitialize}
                        sx={{ 
                            py: 2.5, borderRadius: 3, fontWeight: 900, fontSize: '1.1rem', letterSpacing: 1,
                            bgcolor: statusStep === 3 ? (isDark ? theme.palette.common.white : '#000') : NEON_GREEN, 
                            color: statusStep === 3 ? (isDark ? '#000' : '#FFF') : '#000', 
                            boxShadow: statusStep === 3 ? 'none' : `0 10px 30px ${alpha(NEON_GREEN, 0.3)}`,
                            '&:hover': { 
                                bgcolor: statusStep === 3 ? alpha(theme.palette.common.white, 0.9) : '#00C97F', 
                                transform: 'translateY(-2px)' 
                            },
                            '&:disabled': { 
                                bgcolor: isDark ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.05), 
                                color: 'text.disabled' 
                            },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        {renderButtonContent()}
                    </Button>
                </CardContent>
            </Card>
        </Zoom>
    );
};