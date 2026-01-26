'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Container, Typography, Box, Card, CardContent, Stack, TextField, 
  InputAdornment, Button, ToggleButton, ToggleButtonGroup, 
  CircularProgress, Divider, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Fade, Zoom, Alert
} from '@mui/material';

import GavelIcon from '@mui/icons-material/Gavel';
import BoltIcon from '@mui/icons-material/Bolt';
import StarsIcon from '@mui/icons-material/Stars';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import { useAOM3 } from '@/hooks/useAOM3';
import { useRealYield } from '@/hooks/useRealYield';
import { useAccount, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits } from 'viem';
import { USDC_ADDRESS, USDC_ABI } from '@/constants/contracts';

const NEON_GREEN = '#00E08F';
const NEON_ORANGE = '#FF9800';

interface Asset {
  symbol: string;
  name: string;
  coinId: string;
  image: string;
}

interface DurationOption {
  label: string;
  value: number;
  multiplier: number;
}

const ASSETS: Asset[] = [
  { symbol: 'USDC', name: 'USD Coin', coinId: 'USDC', image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' },
];

const DURATIONS: DurationOption[] = [
  { label: '6 Months', value: 6, multiplier: 1.0 },
  { label: '12 Months', value: 12, multiplier: 1.2 },
  { label: '24 Months', value: 24, multiplier: 1.5 },
];

export default function DepositPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { createQuestAction } = useAOM3();
  const [selectedAsset] = useState<Asset>(ASSETS[0]);
  const [monthlyAmount, setMonthlyAmount] = useState<string>('');
  const [duration, setDuration] = useState<DurationOption>(DURATIONS[1]);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [isDeploying, setIsDeploying] = useState(false);

  const { data: balanceData, refetch: refetchBalance, isLoading: isBalanceLoading } = useReadContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000,
    }
  });

  const walletBalance = balanceData ? formatUnits(balanceData as bigint, 6) : '0';

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const { apy: realBaseApy, loading: isYieldLoading } = useRealYield(selectedAsset.coinId);

  const amountNum = parseFloat(monthlyAmount) || 0;
  const totalPrincipal = amountNum * duration.value;
  const estimatedMaxApy = (realBaseApy * duration.multiplier * 1.5).toFixed(2);

  const estimatedInterest = useMemo(() => {
    const annualRate = (realBaseApy * duration.multiplier) / 100;
    const monthlyRate = annualRate / 12;
    if (monthlyRate === 0) return 0;
    const fv = amountNum * ((Math.pow(1 + monthlyRate, duration.value) - 1) / monthlyRate);
    return fv - totalPrincipal;
  }, [amountNum, realBaseApy, duration, totalPrincipal]);

  const failureScenarios = useMemo(() => {
    const base = realBaseApy;
    const dMult = duration.multiplier;
    return [
      { rate: '10% Default Rate', streakMult: 1.11, label: 'x1.11' },
      { rate: '20% Default Rate', streakMult: 1.25, label: 'x1.25' },
      { rate: '33% Default Rate', streakMult: 1.50, label: 'x1.50' },
    ].map(s => ({
      ...s,
      calculatedApy: (base * dMult * s.streakMult).toFixed(2)
    }));
  }, [realBaseApy, duration]);

  const handleInitializeQuest = async () => {
    if (!isConnected) return alert("Please connect your wallet first");
    
    if (Number(monthlyAmount) > Number(walletBalance)) {
        return alert(`Insufficient USDC. You need at least ${monthlyAmount} USDC for the first deposit.`);
    }
    
    setIsDeploying(true);
    try {
      const hash = await createQuestAction(monthlyAmount, duration.value);
      setTxHash(hash);
    } catch (error) {
      console.error("Transaction Failed:", error);
      setIsDeploying(false);
    }
};

  useEffect(() => {
    if (isSuccess) {
      refetchBalance();
      const timer = setTimeout(() => router.push('/overview'), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, router, refetchBalance]);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Fade in timeout={800}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" fontWeight="900" sx={{ letterSpacing: '-2px', textTransform: 'uppercase', color: 'white' }}>
            Savings <Box component="span" sx={{ color: NEON_GREEN }}>Quest</Box>
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            Automate wealth. Maintain discipline. Claim multipliers.
          </Typography>
        </Box>
      </Fade>

      <Stack spacing={4}>
        {isSuccess && (
          <Alert severity="success" sx={{ borderRadius: 3, fontWeight: 700, bgcolor: `${NEON_GREEN}20`, color: NEON_GREEN }}>
            MISSION INITIALIZED! Your yield-bearing quest has begun. Redirecting...
          </Alert>
        )}

        <Card sx={{ bgcolor: 'rgba(255,152,0,0.03)', border: `1px solid ${NEON_ORANGE}`, borderRadius: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="subtitle2" fontWeight="800" color={NEON_ORANGE} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <GavelIcon fontSize="small" /> AOM3 DISCIPLINE REGULATION
            </Typography>
            <Typography variant="caption" sx={{ color: '#CCC', display: 'block' }}>
              Your principal is 100% safe. First deposit is taken <b>immediately</b>. Missing the <b>7-Day Window</b> (Day 1-7) 
              will result in yield forfeiture.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight="800" color="#888" sx={{ fontSize: '0.8rem', mb: 2, textTransform: 'uppercase' }}>1. Select Asset</Typography>
            <Box sx={{ p: 2, borderRadius: 3, border: `2px solid ${NEON_GREEN}`, bgcolor: 'rgba(0, 224, 143, 0.05)', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
              <Image src={selectedAsset.image} alt={selectedAsset.symbol} width={32} height={32} unoptimized />
              <Typography fontWeight="800" color="white">{selectedAsset.symbol}</Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography variant="h6" fontWeight="800" color="#888" sx={{ fontSize: '0.8rem' }}>2. MONTHLY COMMITMENT</Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <AccountBalanceWalletIcon sx={{ fontSize: 14, color: '#555' }} />
                    <Typography variant="caption" sx={{ color: '#555', fontWeight: 700 }}>
                      Wallet: {isBalanceLoading ? '...' : Number(walletBalance).toLocaleString()} USDC
                    </Typography>
                  </Stack>
                </Stack>
                <TextField 
                  fullWidth variant="outlined" type="number" value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(e.target.value)}
                  placeholder="0.00"
                  InputProps={{ 
                    endAdornment: <InputAdornment position="end"><Typography fontWeight={800} color={NEON_GREEN}>{selectedAsset.symbol}</Typography></InputAdornment>,
                    sx: { borderRadius: 3, bgcolor: '#000', color: 'white', '& fieldset': { borderColor: '#333' } }
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="800" color="#888" sx={{ fontSize: '0.8rem', mb: 1 }}>3. POWER MULTIPLIER</Typography>
                <ToggleButtonGroup
                  value={duration} exclusive fullWidth
                  onChange={(_, val) => val && setDuration(val)}
                  sx={{ height: 56, bgcolor: '#000', borderRadius: 3, border: '1px solid #333', p: 0.5 }}
                >
                  {DURATIONS.map(d => (
                    <ToggleButton key={d.value} value={d} sx={{ fontWeight: 800, color: '#555', border: 'none', borderRadius: '8px !important', '&.Mui-selected': { color: '#FFF', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                      {d.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Zoom in timeout={600}>
          <Card sx={{ background: 'linear-gradient(135deg, #0d2e15 0%, #050505 100%)', border: `2px solid ${NEON_GREEN}`, borderRadius: 5, boxShadow: `0 0 30px ${NEON_GREEN}15` }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
                <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography variant="overline" sx={{ color: NEON_GREEN, fontWeight: 900, letterSpacing: 2 }}>MAX POTENTIAL APY</Typography>
                  <Typography variant="h2" fontWeight="900" sx={{ color: NEON_GREEN, letterSpacing: -2 }}>
                    {isYieldLoading ? <CircularProgress size={30} /> : `${estimatedMaxApy}%`}
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }} mt={1}>
                    <StarsIcon sx={{ fontSize: 18, color: NEON_GREEN }} />
                    <Typography variant="subtitle2" color="white" fontWeight="800">STREAK MULTIPLIER ACTIVE</Typography>
                  </Stack>
                </Box>

                <Stack sx={{ flex: 1.2, width: '100%' }} spacing={1.5}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography color="rgba(255,255,255,0.5)" fontWeight={600}>Total Principal</Typography>
                    <Typography fontWeight="800" color="white">{totalPrincipal.toLocaleString()} USDC</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography color="rgba(255,255,255,0.5)" fontWeight={600}>Est. Interest</Typography>
                    <Typography fontWeight="800" color={NEON_GREEN}>+{estimatedInterest.toLocaleString(undefined, {maximumFractionDigits: 2})} USDC</Typography>
                  </Box>
                  <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="900" color="white">MATURITY TOTAL</Typography>
                    <Typography variant="h5" fontWeight="900" color={NEON_GREEN}>
                      {(totalPrincipal + estimatedInterest).toLocaleString(undefined, {maximumFractionDigits: 2})}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
              
              <Button 
                variant="contained" fullWidth size="large" 
                disabled={!amountNum || isDeploying || isConfirming || amountNum > Number(walletBalance)}
                onClick={handleInitializeQuest}
                sx={{ py: 2.5, mt: 4, borderRadius: 3, fontWeight: 900, fontSize: '1.1rem', bgcolor: NEON_GREEN, color: '#000', '&:hover': { bgcolor: '#00C97F' } }}
              >
                {isDeploying || isConfirming ? (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <CircularProgress size={20} color="inherit" />
                    <Typography fontWeight={900}>
                      {isConfirming ? "SYNCING BLOCKCHAIN..." : "PREPARING MISSION..."}
                    </Typography>
                  </Stack>
                ) : "INITIALIZE SAVINGS QUEST"}
              </Button>
              {isDeploying && !isConfirming && (
                <Typography variant="caption" color={NEON_GREEN} sx={{ display: 'block', textAlign: 'center', mt: 1.5, fontWeight: 700 }}>
                  Step 1: Approve USDC ➔ Step 2: Create Quest
                </Typography>
              )}
            </CardContent>
          </Card>
        </Zoom>

        <Card sx={{ bgcolor: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight="800" display="flex" alignItems="center" gap={1.5} sx={{ color: '#FFF', mb: 3 }}>
              <BoltIcon sx={{ color: NEON_GREEN }} /> REWARD ENGINE LOGIC
            </Typography>
            <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                    <TableCell sx={{ color: '#666', fontWeight: 800, borderColor: '#222' }}>SCENARIO (DEFAULT RATE)</TableCell>
                    <TableCell sx={{ color: '#666', fontWeight: 800, borderColor: '#222' }}>STREAK MULTIPLIER</TableCell>
                    <TableCell sx={{ color: '#666', fontWeight: 800, borderColor: '#222' }}>EST. TOTAL APY</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {failureScenarios.map((row) => (
                    <TableRow key={row.rate} sx={{ '&:hover': { bgcolor: 'rgba(0, 224, 143, 0.02)' } }}>
                      <TableCell sx={{ color: '#EEE', borderColor: '#111' }}>{row.rate}</TableCell>
                      <TableCell sx={{ color: NEON_GREEN, borderColor: '#111', fontWeight: 800 }}>{row.label}</TableCell>
                      <TableCell sx={{ color: '#EEE', borderColor: '#111', fontWeight: 800 }}>~{row.calculatedApy}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}