'use client';

import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Stack, 
  TextField, 
  InputAdornment, 
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Alert,
  AlertTitle,
  Chip,
  Tooltip
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TokenIcon from '@mui/icons-material/Token';

const ASSETS = [
  { symbol: 'USDC', name: 'USD Coin', baseApy: 5.5, color: '#2775CA' },
  { symbol: 'ETH', name: 'Ethereum', baseApy: 3.8, color: '#627EEA' },
];

const DURATIONS = [
  { label: '6 Months', value: 6, multiplier: 1.0, recommended: false },
  { label: '12 Months', value: 12, multiplier: 1.2, recommended: true },
  { label: '24 Months', value: 24, multiplier: 1.5, recommended: false },
];

type DurationOption = typeof DURATIONS[0];

export default function DepositPage() {
  // --- State ---
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [monthlyAmount, setMonthlyAmount] = useState<string>('');
  const [duration, setDuration] = useState<DurationOption>(DURATIONS[1]); 

  // --- Calculations ---
  const amountNum = parseFloat(monthlyAmount) || 0;
  const totalCommitment = amountNum * duration.value;
  const estimatedMaxApy = (selectedAsset.baseApy * duration.multiplier * 1.5).toFixed(2);

  const handleDurationChange = (
    _event: React.MouseEvent<HTMLElement>, 
    newDuration: DurationOption | null
  ) => {
    if (newDuration !== null) {
      setDuration(newDuration);
    }
  };

  return (
    <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Create New Savings Plan
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Commit to a monthly savings goal. The longer you commit, the higher your reward multiplier.
        </Typography>
      </Box>


      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="flex-start">
        <Box sx={{ width: '100%', flex: { md: 7 } }}>
          <Stack spacing={4}>
            <Card sx={{ bgcolor: '#121212', border: '1px solid #333' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>1. Select Asset to Save</Typography>
                
                <Stack direction="row" spacing={2} mt={1}>
                  {ASSETS.map((asset) => {
                    const isSelected = selectedAsset.symbol === asset.symbol;
                    return (
                      <Box 
                        key={asset.symbol}
                        onClick={() => setSelectedAsset(asset)}
                        sx={{ 
                          flex: 1,
                          p: 2, 
                          borderRadius: 2, 
                          border: `1px solid ${isSelected ? '#4caf50' : '#333'}`,
                          bgcolor: isSelected ? 'rgba(76, 175, 80, 0.05)' : 'rgba(255,255,255,0.02)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': { borderColor: isSelected ? '#4caf50' : '#666' }
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <TokenIcon sx={{ color: asset.color, fontSize: 32 }} />
                          <Box>
                            <Typography fontWeight="bold">{asset.symbol}</Typography>
                            <Typography variant="caption" color="text.secondary">Base APY: {asset.baseApy}%</Typography>
                          </Box>
                        </Stack>
                      </Box>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: '#121212', border: '1px solid #333' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom display="flex" alignItems="center">
                  2. Monthly Commitment Amount
                  <Tooltip title="This is the amount you must deposit within the first 7 days of every month.">
                    <InfoOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary', ml: 1, cursor: 'help' }} />
                  </Tooltip>
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    How much can you discipline yourself to save monthly?
                </Typography>

                <TextField 
                  fullWidth
                  placeholder="e.g., 500"
                  value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(e.target.value)}
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{selectedAsset.symbol}</InputAdornment>,
                    sx: { fontSize: '1.2rem', fontWeight: 'bold' }
                  }}
                  sx={{ mb: 2 }}
                />

                {amountNum > 0 && (
                    <Stack direction="row" justifyContent="space-between" bgcolor="rgba(255,255,255,0.03)" p={2} borderRadius={2}>
                      <Typography variant="body2" color="text.secondary">Total commitment over {duration.value} months:</Typography>
                      <Typography variant="body2" fontWeight="bold">{totalCommitment.toLocaleString()} {selectedAsset.symbol}</Typography>
                    </Stack>
                )}
              </CardContent>
            </Card>

            {/* 3. Duration Commitment */}
            <Card sx={{ bgcolor: '#121212', border: '1px solid #333' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  3. Duration Commitment (Multiplier Boost)
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Lock your commitment level for a fixed period. Longer duration = higher base multiplier.
                </Typography>

                <ToggleButtonGroup
                  value={duration}
                  exclusive
                  onChange={handleDurationChange}
                  fullWidth
                  sx={{ gap: 2 }}
                >
                  {DURATIONS.map((opt) => (
                    <ToggleButton 
                      key={opt.value} 
                      value={opt}
                      sx={{ 
                        flex: 1,
                        borderRadius: '8px !important',
                        border: '1px solid #333 !important',
                        textTransform: 'none',
                        flexDirection: 'column',
                        py: 2,
                        '&.Mui-selected': {
                          borderColor: '#4caf50 !important',
                          bgcolor: 'rgba(76, 175, 80, 0.1) !important',
                          color: '#4caf50'
                        }
                      }}
                    >
                      <Stack alignItems="center" spacing={0.5}>
                        <Typography fontWeight="bold" variant="h6">{opt.label}</Typography>
                        <Chip 
                          label={`${opt.multiplier}x Multiplier`} 
                          size="small" 
                          sx={{ 
                            bgcolor: opt.multiplier > 1 ? '#4caf50' : '#666', color: '#000', fontWeight: 'bold', fontSize: '0.7rem' 
                          }} 
                        />
                        {opt.recommended && <Typography variant="caption" color="#4caf50" sx={{mt: 0.5}}>Recommended</Typography>}
                      </Stack>
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </CardContent>
            </Card>

          </Stack>
        </Box>

        <Box sx={{ width: '100%', flex: { md: 5 } }}>
            <Stack spacing={3} sx={{ position: 'sticky', top: 100 }}>
              
              <Card 
                sx={{ 
                  background: 'linear-gradient(180deg, #0d2e15 0%, #121212 100%)',
                  border: '1px solid #4caf50',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <TrendingUpIcon sx={{ color: '#4caf50', fontSize: 28 }} />
                    <Typography variant="h6" fontWeight="bold">Plan Projections</Typography>
                  </Stack>

                  <Stack spacing={2} mb={4}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Estimated Max APY</Typography>
                      <Stack direction="row" alignItems="baseline" spacing={1}>
                        <Typography variant="h3" fontWeight="bold" color="#4caf50">
                          Up to {estimatedMaxApy}%
                        </Typography>
                        <Typography variant="h6" color="text.secondary">APY</Typography>
                      </Stack>
                    </Box>

                    <Stack direction="row" justifyContent="space-between" sx={{ bgcolor: 'rgba(0,0,0,0.2)', p: 1.5, borderRadius: 2 }}>
                        <Typography variant="body2" color="text.secondary">Base APY ({selectedAsset.symbol})</Typography>
                        <Typography variant="body2" fontWeight="bold">{selectedAsset.baseApy}%</Typography>
                      </Stack>
                      
                      <Stack spacing={1} sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', p: 2, borderRadius: 2, border: '1px dashed #4caf50' }}>
                        <Typography variant="subtitle2" fontWeight="bold" color="#4caf50" display="flex" alignItems="center" gap={1}>
                          <AccessTimeFilledIcon fontSize="small"/> Discipline Multipliers Applied:
                        </Typography>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2">Duration ({duration.label})</Typography>
                          <Typography variant="body2" fontWeight="bold" color="#4caf50">x{duration.multiplier}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2">Max Streak Bonus</Typography>
                          <Typography variant="body2" fontWeight="bold" color="#4caf50">up to x1.5</Typography>
                        </Stack>
                    </Stack>
                  </Stack>

                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />
                  
                  <Stack spacing={2}>
                    <Button 
                      variant="contained" 
                      size="large" 
                      fullWidth 
                      disabled={!amountNum}
                      sx={{ py: 1.5, fontWeight: 'bold', fontSize: '1.1rem' }}
                    >
                      Approve {selectedAsset.symbol}
                    </Button>
                    <Typography variant="caption" color="text.secondary" textAlign="center">
                        1st deposit of {amountNum ? amountNum.toLocaleString() : '0'} {selectedAsset.symbol} required immediately.
                    </Typography>
                  </Stack>

                </CardContent>
              </Card>

              <Alert 
                severity="warning" 
                variant="outlined"
                icon={<WarningAmberIcon fontSize="large" />}
                sx={{ 
                  bgcolor: 'rgba(255, 152, 0, 0.05)', 
                  border: '1px solid #ff9800',
                  '& .MuiAlert-icon': { color: '#ff9800' }
                }}
              >
                <AlertTitle sx={{ fontWeight: 'bold', color: '#ff9800' }}>Penalty for breaking commitment</AlertTitle>
                If you miss a monthly deposit window, <b>all your accumulated yield will be forfeited</b> to the prize pool. Your principal remains safe but locked until maturity.
              </Alert>

            </Stack>
        </Box>

      </Stack>
    </Container>
  );
}