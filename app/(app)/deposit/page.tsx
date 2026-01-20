'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { 
  Container, Typography, Box, Card, CardContent, Stack, TextField, 
  InputAdornment, Button, ToggleButton, ToggleButtonGroup, 
  CircularProgress, Divider, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Fade, Zoom
} from '@mui/material';

import GavelIcon from '@mui/icons-material/Gavel';
import StarsIcon from '@mui/icons-material/Stars';
import BoltIcon from '@mui/icons-material/Bolt';

import YieldChart from '@/components/chart/YieldChart'; 
import { useRealYield } from '@/hooks/useRealYield';

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
  { symbol: 'USDC', name: 'USD Coin', coinId: 'BTC', image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' },
  { symbol: 'ETH', name: 'Ethereum', coinId: 'ETH', image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
];

const DURATIONS: DurationOption[] = [
  { label: '6 Months', value: 6, multiplier: 1.0 },
  { label: '12 Months', value: 12, multiplier: 1.2 },
  { label: '24 Months', value: 24, multiplier: 1.5 },
];

export default function DepositPage() {
  const [selectedAsset, setSelectedAsset] = useState<Asset>(ASSETS[0]);
  const [monthlyAmount, setMonthlyAmount] = useState<string>('');
  const [duration, setDuration] = useState<DurationOption>(DURATIONS[1]); 

  const { apy: realBaseApy, loading: isYieldLoading } = useRealYield(selectedAsset.coinId);

  const amountNum = parseFloat(monthlyAmount) || 0;
  const totalPrincipal = amountNum * duration.value;
  
  const failureScenarios = useMemo(() => {
    const base = realBaseApy;
    const dMult = duration.multiplier;
    return [
      { rate: '10% (High Discipline)', streakMult: 1.11, label: 'x1.11' },
      { rate: '20% (Standard)', streakMult: 1.25, label: 'x1.25' },
      { rate: '33% (Market Volatility)', streakMult: 1.50, label: 'x1.50 (Cap)' },
    ].map(s => ({
      ...s,
      calculatedApy: (base * dMult * s.streakMult).toFixed(2)
    }));
  }, [realBaseApy, duration]);

  const estimatedInterest = useMemo(() => {
    const annualRate = (realBaseApy * duration.multiplier) / 100;
    const monthlyRate = annualRate / 12;
    if (monthlyRate === 0) return 0;
    const fv = amountNum * ((Math.pow(1 + monthlyRate, duration.value) - 1) / monthlyRate);
    return fv - totalPrincipal;
  }, [amountNum, realBaseApy, duration, totalPrincipal]);

  const estimatedMaxApy = (realBaseApy * duration.multiplier * 1.5).toFixed(2);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Fade in timeout={800}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" fontWeight="900" sx={{ letterSpacing: '-2px', textTransform: 'uppercase' }}>
            Savings <Box component="span" sx={{ color: '#00E08F' }}>Quest</Box>
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            Automate wealth. Maintain discipline. Claim multipliers.
          </Typography>
        </Box>
      </Fade>

      <Stack spacing={4}>
        
        <Fade in timeout={1000}>
          <Card sx={{ bgcolor: 'rgba(255,152,0,0.03)', border: '1px solid #FF9800', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" fontWeight="800" color="#FF9800" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, textTransform: 'uppercase' }}>
                <GavelIcon fontSize="small" /> AOM3 Discipline Regulation
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} divider={<Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,152,0,0.1)' }} />}>
                <Typography variant="caption" sx={{ color: '#EEE', flex: 1 }}>
                  <b>The 7-Day Window:</b> Deposits must be made within the first 7 days of the month.
                </Typography>
                <Typography variant="caption" sx={{ color: '#EEE', flex: 1 }}>
                  <b>Default Penalty:</b> Missed windows forfeit 100% of yield to the Prize Pool.
                </Typography>
                <Typography variant="caption" sx={{ color: '#EEE', flex: 1 }}>
                  <b>Principal:</b> Your deposits are safe but locked until the maturity date.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Fade>

        <Card sx={{ bgcolor: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: 4, transition: '0.3s', '&:hover': { borderColor: '#333' } }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight="800" gutterBottom sx={{ color: '#888', fontSize: '0.9rem', textTransform: 'uppercase' }}>
              1. Choose Your Loadout
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2, mb: 4 }}>
              {ASSETS.map((asset) => (
                <Box 
                  key={asset.symbol}
                  onClick={() => setSelectedAsset(asset)}
                  sx={{ 
                    flex: 1, p: 2, borderRadius: 3, cursor: 'pointer', transition: 'all 0.2s',
                    border: `2px solid ${selectedAsset.symbol === asset.symbol ? '#00E08F' : '#1E1E1E'}`,
                    bgcolor: selectedAsset.symbol === asset.symbol ? 'rgba(0, 224, 143, 0.05)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' }
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Image src={asset.image} alt={asset.symbol} width={32} height={32} unoptimized />
                    <Box>
                      <Typography fontWeight="800">{asset.symbol}</Typography>
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Stack>
            <YieldChart coin={selectedAsset.coinId} />
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="800" gutterBottom sx={{ color: '#888', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                  2. Monthly Commitment
                </Typography>
                <TextField 
                  fullWidth variant="outlined" type="number" value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(e.target.value)}
                  placeholder="0.00"
                  InputProps={{ 
                    endAdornment: <InputAdornment position="end"><Typography fontWeight={800} color="#00E08F">{selectedAsset.symbol}</Typography></InputAdornment>,
                    sx: { borderRadius: 3, mt: 1, bgcolor: '#000', '& fieldset': { borderColor: '#333' } }
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="800" gutterBottom sx={{ color: '#888', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                  3. Power Multiplier
                </Typography>
                <ToggleButtonGroup
                  value={duration} exclusive fullWidth
                  onChange={(_, val) => val && setDuration(val)}
                  sx={{ height: 56, mt: 1, bgcolor: '#000', borderRadius: 3, p: 0.5, border: '1px solid #333' }}
                >
                  {DURATIONS.map(d => (
                    <ToggleButton 
                      key={d.value} value={d} 
                      sx={{ border: 'none', borderRadius: '8px !important', fontWeight: 800, color: '#555', '&.Mui-selected': { color: '#FFF', bgcolor: 'rgba(255,255,255,0.1)' } }}
                    >
                      {d.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Zoom in timeout={600}>
          <Card sx={{ background: 'linear-gradient(135deg, #0d2e15 0%, #050505 100%)', border: '2px solid #00E08F', borderRadius: 5, boxShadow: '0 0 30px rgba(0, 224, 143, 0.15)' }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
                <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography variant="overline" sx={{ color: '#00E08F', fontWeight: 900, letterSpacing: 3 }}>Max Potential APY</Typography>
                  <Typography variant="h2" fontWeight="900" sx={{ color: '#00E08F', fontSize: { xs: '3.5rem', md: '4.5rem' }, lineHeight: 1 }}>
                    {isYieldLoading ? <CircularProgress size={40} color="inherit" /> : `${estimatedMaxApy}%`}
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }} mt={1} alignItems="center">
                      <StarsIcon sx={{ fontSize: 18, color: '#00E08F' }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>STREAK BONUS ACTIVE</Typography>
                  </Stack>
                </Box>

                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, borderColor: 'rgba(0, 224, 143, 0.2)' }} />

                <Stack sx={{ flex: 1.2, width: '100%' }} spacing={2}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography color="text.secondary" fontWeight={600}>Total Principal</Typography>
                    <Typography fontWeight="800" variant="body1">{totalPrincipal.toLocaleString()} {selectedAsset.symbol}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography color="text.secondary" fontWeight={600}>Est. Interest</Typography>
                    <Typography fontWeight="800" variant="body1" color="#00E08F">+{estimatedInterest.toLocaleString(undefined, {maximumFractionDigits: 2})} {selectedAsset.symbol}</Typography>
                  </Box>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="900" sx={{ textTransform: 'uppercase', fontSize: '1rem' }}>Maturity Total</Typography>
                    <Typography variant="h5" fontWeight="900" color="#00E08F">
                      {(totalPrincipal + estimatedInterest).toLocaleString(undefined, {maximumFractionDigits: 2})} {selectedAsset.symbol}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
              
              <Button 
                variant="contained" fullWidth size="large" disabled={!amountNum || isYieldLoading}
                sx={{ py: 2, mt: 4, borderRadius: 3, fontWeight: 900, fontSize: '1.2rem', bgcolor: '#00E08F', color: '#000', '&:hover': { bgcolor: '#00C97F' } }}
              >
                INITIALIZE SAVINGS QUEST
              </Button>
            </CardContent>
          </Card>
        </Zoom>

        <Card sx={{ bgcolor: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: 4, overflow: 'hidden' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight="800" gutterBottom display="flex" alignItems="center" gap={1.5} sx={{ color: '#FFF', textTransform: 'uppercase', fontSize: '1rem' }}>
              <BoltIcon sx={{ color: '#00E08F' }} /> Reward Engine Logic
            </Typography>
            
            <Box sx={{ my: 3, p: 3, bgcolor: '#000', borderRadius: 3, border: '1px dashed #333', textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#666', mb: 1.5, display: 'block', fontWeight: 800 }}>MATURITY_ALGORITHM</Typography>
              <Typography variant="h6" sx={{ color: '#EEE', fontFamily: 'monospace', fontWeight: 700, letterSpacing: -0.5 }}>
                UserShare = UserDeposit × {duration.multiplier}x (Dur) × StreakMult
              </Typography>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, fontWeight: 500 }}>
              Streak multipliers are fueled by yield forfeited from pool members who break discipline.
            </Typography>
            
            <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                    <TableCell sx={{ color: '#888', borderColor: '#222', fontWeight: 800 }}>POOL STATUS</TableCell>
                    <TableCell sx={{ color: '#888', borderColor: '#222', fontWeight: 800 }}>STREAK MULT</TableCell>
                    <TableCell sx={{ color: '#888', borderColor: '#222', fontWeight: 800 }}>EST. TOTAL APY*</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {failureScenarios.map((row) => (
                    <TableRow key={row.rate} sx={{ '&:hover': { bgcolor: 'rgba(0, 224, 143, 0.02)' } }}>
                      <TableCell sx={{ color: '#EEE', borderColor: '#1A1A1A', py: 2 }}>{row.rate}</TableCell>
                      <TableCell sx={{ color: '#00E08F', borderColor: '#1A1A1A', fontWeight: 800 }}>{row.label}</TableCell>
                      <TableCell sx={{ color: '#EEE', borderColor: '#1A1A1A', fontWeight: 800 }}>~{row.calculatedApy}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block', fontStyle: 'italic' }}>
              *Total APY reflects Current Market Base ({realBaseApy.toFixed(2)}%) multiplied by Duration and Potential Streak rewards.
            </Typography>
          </CardContent>
        </Card>

      </Stack>
    </Container>
  );
}