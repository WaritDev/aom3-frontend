'use client';

import React from 'react';
import { 
    Card, CardContent, Stack, Box, Typography, 
    TextField, InputAdornment, ToggleButtonGroup, ToggleButton 
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BoltIcon from '@mui/icons-material/Bolt';

const NEON_GREEN = '#00E08F';

const DURATION_OPTIONS = [
    { label: '3M', value: 3, multiplier: '1.0x' },
    { label: '6M', value: 6, multiplier: '1.2x' },
    { label: '12M', value: 12, multiplier: '1.5x' },
    { label: '18M', value: 18, multiplier: '1.8x' },
    { label: '24M', value: 24, multiplier: '2.0x' },
];

interface MissionCommitmentCardProps {
    monthlyAmount: string;
    setMonthlyAmount: (val: string) => void;
    duration: number;
    setDuration: (val: number) => void;
    walletBalance: string | number;
    isBalanceLoading: boolean;
    assetSymbol: string;
}

export const MissionCommitmentCard: React.FC<MissionCommitmentCardProps> = ({
    monthlyAmount, setMonthlyAmount, duration, setDuration,
    walletBalance, isBalanceLoading, assetSymbol
}) => {

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || /^[1-9]\d*$/.test(value) || value === '0') {
            setMonthlyAmount(value);
        }
    };

    return (
        <Card sx={{ bgcolor: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: 2 }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                    
                    <Box sx={{ flex: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 900, letterSpacing: 1.5 }}>
                                MONTHLY COMMITMENT
                            </Typography>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <AccountBalanceWalletIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }} />
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>
                                    {isBalanceLoading ? '...' : Number(walletBalance).toLocaleString()} {assetSymbol}
                                </Typography>
                            </Stack>
                        </Stack>
                        
                        <TextField 
                            fullWidth 
                            variant="outlined" 
                            value={monthlyAmount}
                            onChange={handleAmountChange}
                            placeholder="0.00"
                            InputProps={{ 
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Typography fontWeight={900} color={NEON_GREEN} sx={{ fontSize: '0.9rem' }}>
                                            {assetSymbol}
                                        </Typography>
                                    </InputAdornment>
                                ),
                                sx: { 
                                    height: 64,
                                    borderRadius: 2, 
                                    bgcolor: '#000', 
                                    color: 'white', 
                                    fontSize: '1.2rem',
                                    fontWeight: 900,
                                    '& fieldset': { borderColor: '#222' },
                                    '&:hover fieldset': { borderColor: '#444 !important' },
                                    '&.Mui-focused fieldset': { borderColor: `${NEON_GREEN} !important` }
                                }
                            }}
                        />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 900, letterSpacing: 1.5 }}>
                                DURATION
                            </Typography>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <BoltIcon sx={{ fontSize: 14, color: NEON_GREEN }} />
                                <Typography variant="caption" sx={{ color: NEON_GREEN, fontWeight: 900 }}>
                                    BOOST YOUR DP
                                </Typography>
                            </Stack>
                        </Stack>

                        <ToggleButtonGroup
                            value={duration} 
                            exclusive 
                            fullWidth
                            onChange={(_, val) => val !== null && setDuration(val)}
                            sx={{ 
                                height: 64, 
                                bgcolor: 'rgba(0,0,0,0.8)', 
                                borderRadius: 2, 
                                border: '1px solid #222', 
                                p: '4px',
                                '& .MuiToggleButtonGroup-grouped': { 
                                    border: 0, 
                                    borderRadius: '6px !important',
                                    mx: '2px'
                                } 
                            }}
                        >
                            {DURATION_OPTIONS.map(d => (
                                <ToggleButton 
                                    key={d.value} 
                                    value={d.value} 
                                    sx={{ 
                                        display: 'flex',
                                        flexDirection: 'column',
                                        color: 'rgba(255,255,255,0.3)',
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&.Mui-selected': { 
                                            color: '#000', 
                                            bgcolor: NEON_GREEN,
                                            boxShadow: `0 0 15px ${NEON_GREEN}44`,
                                            '&:hover': { bgcolor: NEON_GREEN },
                                            '& .multiplier-text': { color: 'rgba(0,0,0,0.5)' }
                                        },
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.05)',
                                            color: '#FFF'
                                        }
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontWeight: 900, fontSize: '0.85rem' }}>
                                        {d.label}
                                    </Typography>
                                    <Typography 
                                        variant="caption" 
                                        className="multiplier-text"
                                        sx={{ 
                                            fontSize: '0.6rem', 
                                            fontWeight: 800, 
                                            color: NEON_GREEN,
                                            lineHeight: 1
                                        }}
                                    >
                                        {d.multiplier}
                                    </Typography>
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};