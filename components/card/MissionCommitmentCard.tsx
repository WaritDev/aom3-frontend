'use client';

import React from 'react';
import { 
    Card, CardContent, Stack, Box, Typography, 
    TextField, InputAdornment, ToggleButtonGroup, ToggleButton 
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const NEON_GREEN = '#00E08F';

const DURATION_OPTIONS = [
    { label: '3M', value: 3 },
    { label: '6M', value: 6 },
    { label: '12M', value: 12 },
    { label: '18M', value: 18 },
    { label: '24M', value: 24 },
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
        <Card sx={{ bgcolor: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
            <Box sx={{ flex: 1 }}>
                <Stack direction="row" justifyContent="space-between" mb={1}>
                <Typography variant="h6" fontWeight="800" color="#888" sx={{ fontSize: '0.8rem' }}>MONTHLY COMMITMENT</Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                    <AccountBalanceWalletIcon sx={{ fontSize: 14, color: '#555' }} />
                    <Typography variant="caption" sx={{ color: '#555', fontWeight: 700 }}>
                    Wallet: {isBalanceLoading ? '...' : Number(walletBalance).toLocaleString()} {assetSymbol}
                    </Typography>
                </Stack>
                </Stack>
                <TextField 
                fullWidth variant="outlined" value={monthlyAmount}
                onChange={handleAmountChange}
                placeholder="Enter amount per month"
                InputProps={{ 
                    endAdornment: <InputAdornment position="end"><Typography fontWeight={800} color={NEON_GREEN}>{assetSymbol}</Typography></InputAdornment>,
                    sx: { borderRadius: 3, bgcolor: '#000', color: 'white', '& fieldset': { borderColor: '#333' } }
                }}
                />
            </Box>
            <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="800" color="#888" sx={{ fontSize: '0.8rem', mb: 1 }}>DURATION IN MONTHS (Streak Multiplier)</Typography>
                <ToggleButtonGroup
                value={duration} exclusive fullWidth
                onChange={(_, val) => val !== null && setDuration(val)}
                sx={{ height: 56, bgcolor: '#000', borderRadius: 3, border: '1px solid #333', p: 0.5, '& .MuiToggleButtonGroup-grouped': { border: 0, borderRadius: '8px !important' } }}
                >
                {DURATION_OPTIONS.map(d => (
                    <ToggleButton key={d.value} value={d.value} sx={{ fontWeight: 800, color: '#555', '&.Mui-selected': { color: '#FFF', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                    {d.label}
                    </ToggleButton>
                ))}
                </ToggleButtonGroup>
            </Box>
            </Stack>
        </CardContent>
        </Card>
    );
};