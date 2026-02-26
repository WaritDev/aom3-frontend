'use client';

import React from 'react';
import { 
    Card, CardContent, Stack, Box, Typography, 
    TextField, InputAdornment, ToggleButtonGroup, ToggleButton,
    useTheme, alpha
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
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const isUnderMin = monthlyAmount !== '' && Number(monthlyAmount) < 10;
    const isOverBalance = Number(monthlyAmount) > Number(walletBalance);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || /^\d*$/.test(value)) {
            setMonthlyAmount(value);
        }
    };

    const labelStyle = {
        color: 'text.secondary',
        fontWeight: 900,
        letterSpacing: 2,
        fontSize: '0.7rem',
        textTransform: 'uppercase' as const
    };

    return (
        <Card sx={{ 
            bgcolor: 'background.paper', 
            border: `1px solid ${isUnderMin ? ERROR_RED : theme.palette.divider}`, 
            borderRadius: 4,
            transition: 'all 0.3s ease',
            backgroundImage: 'none',
            boxShadow: isDark ? 'none' : '0 10px 40px rgba(0,0,0,0.04)'
        }}>
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={6}>
                    
                    <Box sx={{ flex: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="overline" sx={labelStyle}>
                                Monthly Commitment
                            </Typography>
                            <Stack direction="row" spacing={0.8} alignItems="center">
                                <AccountBalanceWalletIcon sx={{ fontSize: 16, color: isOverBalance ? ERROR_RED : 'text.disabled' }} />
                                <Typography variant="caption" sx={{ color: isOverBalance ? ERROR_RED : 'text.secondary', fontWeight: 800 }}>
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
                            error={isUnderMin}
                            InputProps={{ 
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Typography fontWeight={900} color={isUnderMin ? ERROR_RED : NEON_GREEN} sx={{ fontSize: '0.9rem', letterSpacing: 1 }}>
                                            {assetSymbol}
                                        </Typography>
                                    </InputAdornment>
                                ),
                                sx: { 
                                    height: 72,
                                    borderRadius: 3, 
                                    bgcolor: isDark ? alpha(theme.palette.common.white, 0.03) : alpha(theme.palette.common.black, 0.02),
                                    color: 'text.primary', 
                                    fontSize: '1.5rem',
                                    fontWeight: 900,
                                    fontFamily: 'monospace',
                                    '& fieldset': { borderColor: theme.palette.divider },
                                    '&:hover fieldset': { borderColor: isUnderMin ? ERROR_RED : alpha(NEON_GREEN, 0.5) },
                                    '&.Mui-focused fieldset': { borderColor: `${isUnderMin ? ERROR_RED : NEON_GREEN} !important`, borderWidth: '2px' }
                                }
                            }}
                        />
                        {isUnderMin && (
                            <Stack direction="row" spacing={0.5} alignItems="center" mt={1.5}>
                                <ErrorOutlineIcon sx={{ fontSize: 14, color: ERROR_RED }} />
                                <Typography variant="caption" sx={{ color: ERROR_RED, fontWeight: 800, textTransform: 'uppercase' }}>
                                    Min Commitment: 10 {assetSymbol}
                                </Typography>
                            </Stack>
                        )}
                    </Box>

                    {/* Right Section: Duration Toggle */}
                    <Box sx={{ flex: 1.2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="overline" sx={labelStyle}>
                                Quest Duration
                            </Typography>
                            <Stack direction="row" spacing={0.8} alignItems="center">
                                <BoltIcon sx={{ fontSize: 16, color: NEON_GREEN }} />
                                <Typography variant="caption" sx={{ color: NEON_GREEN, fontWeight: 900, letterSpacing: 1 }}>
                                    BOOST ACTIVE
                                </Typography>
                            </Stack>
                        </Stack>

                        <ToggleButtonGroup
                            value={duration} 
                            exclusive 
                            fullWidth
                            onChange={(_, val) => val !== null && setDuration(val)}
                            sx={{ 
                                height: 72, 
                                bgcolor: isDark ? alpha(theme.palette.common.white, 0.03) : alpha(theme.palette.common.black, 0.02), 
                                borderRadius: 3, 
                                border: `1px solid ${theme.palette.divider}`, 
                                p: '6px',
                                '& .MuiToggleButtonGroup-grouped': { 
                                    border: 0, 
                                    borderRadius: '10px !important',
                                    mx: '4px'
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
                                        color: 'text.disabled',
                                        transition: 'all 0.2s ease',
                                        '&.Mui-selected': { 
                                            color: '#000', 
                                            bgcolor: NEON_GREEN,
                                            boxShadow: `0 4px 15px ${alpha(NEON_GREEN, 0.4)}`,
                                            '&:hover': { bgcolor: NEON_GREEN },
                                            '& .multiplier-text': { color: 'rgba(0,0,0,0.6)' },
                                            '& .label-text': { color: '#000' }
                                        },
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.divider, 0.1),
                                            color: 'text.primary'
                                        }
                                    }}
                                >
                                    <Typography className="label-text" variant="body2" sx={{ fontWeight: 900, fontSize: '1rem' }}>
                                        {d.label}
                                    </Typography>
                                    <Typography 
                                        variant="caption" 
                                        className="multiplier-text"
                                        sx={{ 
                                            fontSize: '0.7rem', 
                                            fontWeight: 900, 
                                            color: NEON_GREEN,
                                            lineHeight: 1,
                                            mt: 0.2
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