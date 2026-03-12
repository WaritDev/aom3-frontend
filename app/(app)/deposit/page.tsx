'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Container, Typography, Box, Card, CardContent, Stack, Fade, Grow, useTheme, alpha 
} from '@mui/material';

import GavelIcon from '@mui/icons-material/Gavel';
import { useAOM3 } from '@/hooks/useAOM3';
import { useRealYield } from '@/hooks/useRealYield';
import { useHL } from '@/hooks/useHL';
import { useAccount, useReadContract } from 'wagmi';
import { formatUnits, type Address } from 'viem';
import { USDC_ADDRESS, USDC_ABI } from '@/constants/contracts';
import { RewardEngineCard } from '@/components/card/RewardEngineCard';
import { MissionCommitmentCard } from '@/components/card/MissionCommitmentCard';
import { MissionSummaryCard } from '@/components/card/MissionSummaryCard';

const NEON_GREEN = '#00E08F';
const NEON_ORANGE = '#FF9800';

interface Asset {
    symbol: string;
    name: string;
    coinId: string;
    image: string;
    }

    const DURATIONS = [
    { label: '3 Months', value: 3, multiplier: 1.0 },
    { label: '6 Months', value: 6, multiplier: 1.0 },
    { label: '12 Months', value: 12, multiplier: 1.2 },
    { label: '18 Months', value: 18, multiplier: 1.5 },
    { label: '24 Months', value: 24, multiplier: 2.0 },
    ];

    const ASSETS: Asset[] = [
    { symbol: 'USDC', name: 'USD Coin', coinId: 'USDC', image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' },
    ];

    export default function DepositPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const router = useRouter();
    const { address, isConnected } = useAccount();
    
    const { createQuestAction, refetchBalance: refetchAOM3Balance } = useAOM3();
    const { runAutoDeposit, refreshBalance: refreshHLBalance } = useHL();

    const [selectedAsset] = useState<Asset>(ASSETS[0]);
    const [monthlyAmount, setMonthlyAmount] = useState<string>('');
    const [durationValue, setDurationValue] = useState<number>(12);
    const [isDeploying, setIsDeploying] = useState(false);

    const selectedDuration = useMemo(() => 
        DURATIONS.find(d => d.value === durationValue) || DURATIONS[1], 
        [durationValue]
    );

    const { data: balanceData, refetch: refetchWalletBalance, isLoading: isBalanceLoading } = useReadContract({
        address: USDC_ADDRESS as Address,
        abi: USDC_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
    });

    const walletBalance = balanceData ? formatUnits(balanceData as bigint, 6) : '0';

    const { apy: realBaseApy, loading: isYieldLoading } = useRealYield(selectedAsset.coinId);

    const amountNum = parseFloat(monthlyAmount) || 0;
    const totalPrincipal = amountNum * selectedDuration.value;
    const estimatedMaxApy = (realBaseApy * selectedDuration.multiplier * 1.5).toFixed(2);

    const estimatedInterest = useMemo(() => {
        const annualRate = (realBaseApy * selectedDuration.multiplier) / 100;
        const monthlyRate = annualRate / 12;
        if (monthlyRate === 0) return 0;
        const fv = amountNum * ((Math.pow(1 + monthlyRate, selectedDuration.value) - 1) / monthlyRate);
        return fv - totalPrincipal;
    }, [amountNum, realBaseApy, selectedDuration, totalPrincipal]);

    const [statusStep, setStatusStep] = useState<0 | 1 | 2 | 3>(0);

    const handleInitializeQuest = async () => {
        if (!isConnected) return;
        if (amountNum < 10) return;
        if (amountNum > Number(walletBalance)) return;

        setIsDeploying(true);
        setStatusStep(1);

        try {
            const hash = await createQuestAction(monthlyAmount, selectedDuration.value);
            if (hash) {
                setStatusStep(2);
                await runAutoDeposit(monthlyAmount); 
                setStatusStep(3);
                await Promise.all([
                    refetchWalletBalance(),
                    refetchAOM3Balance(),
                    refreshHLBalance()
                ]);
                setTimeout(() => router.push('/overview-demo'), 1500);
            }
        } catch (error) {
            console.error("Workflow Failed:", error);
            setStatusStep(0);
            setIsDeploying(false);
        }
    };

    return (
    <Box sx={{ 
        bgcolor: 'background.default', 
        minHeight: '100vh', 
        transition: 'background-color 0.3s ease',
        color: 'text.primary'
    }}>
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
        
        <Fade in timeout={800}>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant="overline" sx={{ color: NEON_GREEN, fontWeight: 900, letterSpacing: 3 }}>
                STRATEGY INITIALIZATION
            </Typography>
            <Typography variant="h2" fontWeight="900" sx={{ letterSpacing: '-2px', textTransform: 'uppercase', color: 'text.primary' }}>
                Savings <Box component="span" sx={{ color: NEON_GREEN, textShadow: isDark ? `0 0 20px ${NEON_GREEN}44` : 'none' }}>Quest</Box>
            </Typography>
            </Box>
        </Fade>

        <Stack spacing={4}>
            
            <Grow in timeout={1000}>
            <Card sx={{ 
                bgcolor: isDark ? alpha(NEON_ORANGE, 0.05) : alpha(NEON_ORANGE, 0.02), 
                border: `1px solid ${alpha(NEON_ORANGE, 0.3)}`, 
                borderRadius: 3,
                backgroundImage: 'none',
                boxShadow: 'none'
            }}>
                <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" fontWeight="900" color={NEON_ORANGE} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <GavelIcon fontSize="small" /> AOM3 DISCIPLINE REGULATION
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', display: 'block', fontWeight: 500, lineHeight: 1.6 }}>
                    Principal is 100% safe. Streak Multipliers apply to active savers only. 
                    Savers must deposit within the monthly window to maintain discipline points.
                </Typography>
                </CardContent>
            </Card>
            </Grow>

            <Fade in timeout={1100}>
            <Box>
                <MissionCommitmentCard 
                monthlyAmount={monthlyAmount}
                setMonthlyAmount={setMonthlyAmount}
                duration={durationValue}
                setDuration={setDurationValue}
                walletBalance={walletBalance}
                isBalanceLoading={isBalanceLoading}
                assetSymbol="USDC"
                />
            </Box>
            </Fade>

            <Fade in timeout={1200}>
            <Box>
                <MissionSummaryCard 
                isYieldLoading={isYieldLoading}
                estimatedMaxApy={estimatedMaxApy}
                totalPrincipal={totalPrincipal}
                estimatedInterest={estimatedInterest}
                amountNum={amountNum}
                walletBalance={Number(walletBalance)}
                isDeploying={isDeploying}
                isConfirming={isDeploying} 
                onInitialize={handleInitializeQuest}
                coinSymbol={'BTC'}
                durationMultiplier={selectedDuration.multiplier}
                durationMonths={selectedDuration.value}
                statusStep={statusStep}
                />
            </Box>
            </Fade>

            <Fade in timeout={1300}>
            <Box>
                <RewardEngineCard />
            </Box>
            </Fade>
        </Stack>
        </Container>
    </Box>
    );
}