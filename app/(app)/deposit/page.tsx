'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Container, Typography, Box, Card, CardContent, Stack, Fade, Grow, useTheme, alpha,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControlLabel, Checkbox, Divider
} from '@mui/material';

import GavelIcon from '@mui/icons-material/Gavel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

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
const NEON_RED = '#FF4D4D';

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
    
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);
    
    const [isDeploying, setIsDeploying] = useState(false);
    const [statusStep, setStatusStep] = useState<0 | 1 | 2 | 3>(0);
    
    const [l1Completed, setL1Completed] = useState(false);
    const [deployError, setDeployError] = useState<string | null>(null);

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

    const handleOpenTerms = () => {
        if (!isConnected || amountNum < 10 || amountNum > Number(walletBalance)) return;
        
        if (l1Completed) {
            handleInitializeQuest();
            return;
        }

        setIsAccepted(false);
        setIsTermsOpen(true);
    };

    const handleConfirmTerms = () => {
        setIsTermsOpen(false);
        handleInitializeQuest();
    };

    const handleInitializeQuest = async () => {
        setIsDeploying(true);
        setDeployError(null);

        try {
            if (!l1Completed) {
                setStatusStep(1);
                const hash = await createQuestAction(monthlyAmount, selectedDuration.value);
                if (!hash) {
                    setIsDeploying(false);
                    setStatusStep(0);
                    return;
                }
                setL1Completed(true);
            }

            setStatusStep(2);
            await runAutoDeposit(monthlyAmount); 
            
            setStatusStep(3);
            await Promise.all([
                refetchWalletBalance(),
                refetchAOM3Balance(),
                refreshHLBalance()
            ]);
            setTimeout(() => router.push('/overview-demo'), 1500);

        } catch (error: unknown) {
            console.error("Workflow Failed:", error);
            const err = error as Error;
            setIsDeploying(false);
            
            const isUserReject = err.message?.toLowerCase().includes("rejected") || err.message?.toLowerCase().includes("user denied");

            if (l1Completed) {
                setDeployError(isUserReject 
                    ? "Vault deposit paused. Your funds are bridged safely. Click the button again to finish step 2." 
                    : "Hyperliquid deposit failed. Click the button again to retry.");
            } else {
                setDeployError(isUserReject ? "Transaction cancelled." : "Failed to create quest.");
                setStatusStep(0);
            }
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

            {deployError && (
                <Fade in>
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha(NEON_RED, 0.1), border: `1px solid ${NEON_RED}` }}>
                        <Typography variant="body2" sx={{ color: NEON_RED, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <WarningAmberIcon fontSize="small" /> {deployError}
                        </Typography>
                    </Box>
                </Fade>
            )}

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
                onInitialize={handleOpenTerms}
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

        <Dialog 
            open={isTermsOpen} 
            onClose={() => setIsTermsOpen(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { 
                    bgcolor: 'background.paper', 
                    borderRadius: 4, 
                    border: `1px solid ${alpha(NEON_GREEN, 0.3)}`,
                    backgroundImage: 'none',
                    p: 1
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 900 }}>
                <VerifiedUserIcon sx={{ color: NEON_GREEN }} /> 
                QUEST COMMITMENT AGREEMENT
            </DialogTitle>
            <Divider sx={{ borderColor: theme.palette.divider }} />
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 4 }}>
                
                <Box>
                    <Typography variant="subtitle2" fontWeight={800} color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CheckCircleOutlineIcon sx={{ color: NEON_GREEN, fontSize: 20 }} /> 
                        1. Deposit & Maturity
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ pl: 3.5 }}>
                        You are committing to deposit <strong>${amountNum} USDC</strong> every month for <strong>{durationValue} months</strong>. 
                        Upon successful maturity, you can withdraw your <strong>100% principal + all accumulated Real Yield</strong> (Note: A standard <strong>$1 Hyperliquid Bridge fee</strong> applies upon withdrawal).
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="subtitle2" fontWeight={800} color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <WarningAmberIcon sx={{ color: NEON_RED, fontSize: 20 }} /> 
                        2. Early Exit Risk & Penalty
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ pl: 3.5 }}>
                        If you choose to withdraw your funds before maturity, you will face an <strong>Early Exit Fee between 1% to 3%</strong> (Dynamic Penalty) on your principal. Additionally, <strong>all your generated yield will be forfeited</strong> and sent to the Savers Reward Pool.
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="subtitle2" fontWeight={800} color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <GavelIcon sx={{ color: NEON_ORANGE, fontSize: 20 }} /> 
                        3. Discipline Points (DP)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ pl: 3.5 }}>
                        Your Discipline Points will dictate your share of the global reward pool. Missing deposits or exiting early will result in the <strong>burning of your Active DP</strong>, reducing your future reward shares to 0%.
                    </Typography>
                </Box>

                <Box sx={{ bgcolor: alpha(NEON_GREEN, 0.05), p: 2, borderRadius: 2, border: `1px solid ${alpha(NEON_GREEN, 0.2)}`, mt: 1 }}>
                    <FormControlLabel 
                        control={
                            <Checkbox 
                                checked={isAccepted} 
                                onChange={(e) => setIsAccepted(e.target.checked)}
                                sx={{ color: NEON_GREEN, '&.Mui-checked': { color: NEON_GREEN } }}
                            />
                        } 
                        label={
                            <Typography variant="body2" fontWeight={700} color="text.primary">
                                I understand the rules, risks, penalties, and bridge fees, and I am ready to commit to this Discipline Quest.
                            </Typography>
                        } 
                        sx={{ m: 0, alignItems: 'flex-start' }}
                    />
                </Box>

            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'space-between' }}>
                <Button 
                    onClick={() => setIsTermsOpen(false)} 
                    variant="text" 
                    sx={{ color: 'text.secondary', fontWeight: 800 }}
                >
                    CANCEL
                </Button>
                <Button 
                    onClick={handleConfirmTerms} 
                    variant="contained" 
                    disabled={!isAccepted}
                    sx={{ 
                        bgcolor: NEON_GREEN, color: '#000', fontWeight: 900, px: 4, borderRadius: 2,
                        '&:hover': { bgcolor: alpha(NEON_GREEN, 0.8) },
                        '&:disabled': { bgcolor: theme.palette.divider, color: 'text.disabled' }
                    }}
                >
                    SIGN & INITIALIZE QUEST
                </Button>
            </DialogActions>
        </Dialog>

    </Box>
    );
}