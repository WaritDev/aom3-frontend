'use client';

import React from 'react';
import { 
    Card, CardContent, Stack, Box, Typography, 
    TextField, InputAdornment, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BoltIcon from '@mui/icons-material/Bolt';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NEON_GREEN = '#00E08F';
const ERROR_RED = '#FF4D4D';

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

    const isUnderMin = monthlyAmount !== '' && Number(monthlyAmount) < 10;
    const isOverBalance = Number(monthlyAmount) > Number(walletBalance);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || /^\d*$/.test(value)) {
            setMonthlyAmount(value);
        }
    };

    return (
        <Card sx={{ 
            bgcolor: '#0A0A0A', 
            border: `1px solid ${isUnderMin ? ERROR_RED : '#1E1E1E'}`, 
            borderRadius: 3,
            transition: 'border-color 0.2s ease'
        }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                    
                    <Box sx={{ flex: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 900, letterSpacing: 1.5 }}>
                                MONTHLY COMMITMENT
                            </Typography>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <AccountBalanceWalletIcon sx={{ fontSize: 14, color: isOverBalance ? ERROR_RED : 'rgba(255,255,255,0.3)' }} />
                                <Typography variant="caption" sx={{ color: isOverBalance ? ERROR_RED : 'rgba(255,255,255,0.3)', fontWeight: 700 }}>
                                    {isBalanceLoading ? '...' : Number(walletBalance).toLocaleString()} {assetSymbol}
                                </Typography>
                            </Stack>
                        </Stack>
                        
                        <TextField 
                            fullWidth 
                            variant="outlined" 
                            value={monthlyAmount}
                            onChange={handleAmountChange}
                            placeholder="Enter commitment amount"
                            error={isUnderMin}
                            InputProps={{ 
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Typography fontWeight={900} color={isUnderMin ? ERROR_RED : NEON_GREEN} sx={{ fontSize: '0.9rem' }}>
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
                                    fontWeight: 600,
                                    '& fieldset': { borderColor: '#222' },
                                    '&:hover fieldset': { borderColor: isUnderMin ? ERROR_RED : '#444 !important' },
                                    '&.Mui-focused fieldset': { borderColor: `${isUnderMin ? ERROR_RED : NEON_GREEN} !important` }
                                }
                            }}
                        />
                        {isUnderMin && (
                            <Stack direction="row" spacing={0.5} alignItems="center" mt={1}>
                                <ErrorOutlineIcon sx={{ fontSize: 14, color: ERROR_RED }} />
                                <Typography variant="caption" sx={{ color: ERROR_RED, fontWeight: 700 }}>
                                    MINIMUM COMMITMENT IS 10 {assetSymbol}
                                </Typography>
                            </Stack>
                        )}
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 900, letterSpacing: 1.5 }}>
                                QUEST DURATION
                            </Typography>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <BoltIcon sx={{ fontSize: 14, color: NEON_GREEN }} />
                                <Typography variant="caption" sx={{ color: NEON_GREEN, fontWeight: 900 }}>
                                    BOOST YIELD
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
                                bgcolor: '#000', 
                                borderRadius: 2, 
                                border: '1px solid #222', 
                                p: '4px',
                                '& .MuiToggleButtonGroup-grouped': { 
                                    border: 0, 
                                    borderRadius: '8px !important',
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
                                        border: '1px solid transparent !important',
                                        '&.Mui-selected': { 
                                            color: '#000', 
                                            bgcolor: NEON_GREEN,
                                            boxShadow: `0 0 20px ${NEON_GREEN}33`,
                                            '&:hover': { bgcolor: NEON_GREEN },
                                            '& .multiplier-text': { color: 'rgba(0,0,0,0.6)' },
                                            '& .label-text': { color: '#000' }
                                        },
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.05)',
                                            color: '#FFF'
                                        }
                                    }}
                                >
                                    <Typography className="label-text" variant="body2" sx={{ fontWeight: 900, fontSize: '0.9rem' }}>
                                        {d.label}
                                    </Typography>
                                    <Typography 
                                        variant="caption" 
                                        className="multiplier-text"
                                        sx={{ 
                                            fontSize: '0.65rem', 
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