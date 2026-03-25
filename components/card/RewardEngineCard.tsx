'use client';

import React from 'react';
import { 
    Card, CardContent, Typography, Box, Stack, 
    Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Chip, useTheme, alpha 
} from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const NEON_GREEN = '#00E08F';
const GOLD_COLOR = '#FFD700';

const podLogic = [
    { duration: '3 Months', multiplier: '1.0x', status: 'Novice', weight: 'Base Share' },
    { duration: '6 Months', multiplier: '1.2x', status: 'Disciplined', weight: '+20% Boost' },
    { duration: '12 Months', multiplier: '1.5x', status: 'Elite', weight: '+50% Boost' },
    { duration: '18 Months', multiplier: '1.8x', status: 'Veteran', weight: '+80% Boost' },
    { duration: '24 Months', multiplier: '2.0x', status: 'Diamond Hands', weight: '2x Massive Share' },
];

export const RewardEngineCard = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const headerCellStyle = {
        color: 'text.secondary',
        fontWeight: 900,
        letterSpacing: 1.5,
        fontSize: '0.7rem',
        textTransform: 'uppercase' as const,
        borderBottom: `1px solid ${theme.palette.divider}`,
        py: 2
    };

    return (
        <Card sx={{ 
            bgcolor: 'background.paper', 
            border: `1px solid ${theme.palette.divider}`, 
            borderRadius: 4, 
            overflow: 'hidden',
            backgroundImage: 'none',
            boxShadow: isDark ? 'none' : '0 10px 40px rgba(0,0,0,0.04)'
        }}>
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ mb: 4 }}>
                    <Box>
                        <Typography variant="h6" fontWeight="900" display="flex" alignItems="center" gap={1.5} sx={{ color: 'text.primary', letterSpacing: 1 }}>
                            <BoltIcon sx={{ color: NEON_GREEN, fontSize: 28 }} /> PROOF OF DISCIPLINE (PoD)
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, mt: 0.5, display: 'block' }}>
                            Your yield share = (Your DP / Total Network DP) × Reward Pool
                        </Typography>
                    </Box>
                    <Chip 
                        label="EXPONENTIAL GROWTH" 
                        size="small" 
                        icon={<TrendingUpIcon sx={{ color: `${NEON_GREEN} !important` }} />}
                        sx={{ 
                            bgcolor: alpha(NEON_GREEN, 0.1), 
                            color: NEON_GREEN, 
                            fontWeight: 900, 
                            fontSize: '0.65rem',
                            letterSpacing: 1,
                            borderRadius: 1.5,
                            px: 1
                        }} 
                    />
                </Stack>

                <Box sx={{ 
                    p: 3, 
                    bgcolor: isDark ? alpha(theme.palette.common.white, 0.03) : alpha(theme.palette.common.black, 0.02), 
                    borderRadius: 3, 
                    mb: 3, 
                    border: `1px dashed ${theme.palette.divider}`,
                    position: 'relative'
                }}>
                    <Typography variant="overline" sx={{ color: 'text.disabled', fontWeight: 900, display: 'block', textAlign: 'center', mb: 1, letterSpacing: 2 }}>
                        Monthly Discipline Points (DP) Formula
                    </Typography>
                    <Typography 
                        variant="h5" 
                        textAlign="center" 
                        fontWeight="900" 
                        sx={{ 
                            color: 'text.primary', 
                            fontFamily: 'monospace', 
                            letterSpacing: -0.5,
                            fontSize: { xs: '1rem', sm: '1.4rem' },
                            mb: 2
                        }}
                    >
                        {`DP = DEPOSIT × PLAN_MULT × STREAK_MULT`}
                    </Typography>

                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                        <Box sx={{ bgcolor: alpha(NEON_GREEN, 0.1), p: 1.5, borderRadius: 2, flex: 1, textAlign: 'center', border: `1px solid ${alpha(NEON_GREEN, 0.2)}` }}>
                            <Typography variant="caption" sx={{ color: NEON_GREEN, fontWeight: 900, display: 'block', mb: 0.5 }}>PLAN MULTIPLIER</Typography>
                            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 700, fontSize: '0.75rem' }}>Based on your locked duration (1.0x to 2.0x). See table below.</Typography>
                        </Box>
                        <Box sx={{ bgcolor: alpha(GOLD_COLOR, 0.1), p: 1.5, borderRadius: 2, flex: 1, textAlign: 'center', border: `1px solid ${alpha(GOLD_COLOR, 0.2)}` }}>
                            <Typography variant="caption" sx={{ color: GOLD_COLOR, fontWeight: 900, display: 'block', mb: 0.5 }}>STREAK MULTIPLIER 🔥</Typography>
                            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 700, fontSize: '0.75rem' }}>Starts at 1.1x and grows by +0.1x every successful monthly deposit!</Typography>
                        </Box>
                    </Stack>
                </Box>

                <TableContainer component={Box} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: isDark ? alpha(theme.palette.common.white, 0.02) : alpha(theme.palette.common.black, 0.01) }}>
                                <TableCell sx={headerCellStyle}>Plan Duration</TableCell>
                                <TableCell sx={headerCellStyle}>Plan Multiplier</TableCell>
                                <TableCell sx={headerCellStyle}>Rank</TableCell>
                                <TableCell sx={headerCellStyle} align="right">Reward Weight</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {podLogic.map((row) => (
                                <TableRow 
                                    key={row.duration} 
                                    sx={{ 
                                        '&:hover': { bgcolor: alpha(NEON_GREEN, 0.04) }, 
                                        transition: 'background-color 0.2s ease',
                                        cursor: 'default'
                                    }}
                                >
                                    <TableCell sx={{ color: 'text.primary', borderColor: theme.palette.divider, fontWeight: 800, py: 2 }}>
                                        {row.duration}
                                    </TableCell>
                                    <TableCell sx={{ color: NEON_GREEN, borderColor: theme.palette.divider, fontWeight: 900, fontFamily: 'monospace', fontSize: '1rem' }}>
                                        {row.multiplier}
                                    </TableCell>
                                    <TableCell sx={{ borderColor: theme.palette.divider }}>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>
                                            {row.status}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.primary', borderColor: theme.palette.divider, fontWeight: 800 }} align="right">
                                        {row.weight}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ 
                    mt: 4, p: 2.5, borderRadius: 3, 
                    bgcolor: isDark ? alpha(GOLD_COLOR, 0.05) : alpha(GOLD_COLOR, 0.08), 
                    border: `1px solid ${alpha(GOLD_COLOR, 0.2)}` 
                }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ 
                            bgcolor: GOLD_COLOR, borderRadius: '50%', p: 0.5, display: 'flex', 
                            boxShadow: `0 0 15px ${alpha(GOLD_COLOR, 0.4)}` 
                        }}>
                            <WorkspacePremiumIcon sx={{ color: '#000', fontSize: 18 }} />
                        </Box>
                        <Typography variant="caption" sx={{ color: isDark ? GOLD_COLOR : '#856404', fontWeight: 900, letterSpacing: 0.5, lineHeight: 1.4 }}>
                            DIAMOND HANDS PROTOCOL: Users reaching 12 months or higher qualify for the Global Bonus Pool distribution derived from early exit penalties.
                        </Typography>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
};