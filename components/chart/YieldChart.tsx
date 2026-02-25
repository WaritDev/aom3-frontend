'use client';

import React, { useEffect, useState } from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Typography, Box, useTheme, Switch, FormControlLabel, Skeleton, 
    Paper, Tooltip, Chip, Stack, alpha 
    } from '@mui/material';
    import { CalendarMonth, InfoOutlined } from '@mui/icons-material';

    const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const THEME_PRIMARY = '#00E08F';
    const THEME_DANGER = '#FF5252';

    interface YearData {
        year: string;
        returns: Record<string, number>;
    }

    export default function VaultMonthlyTable() {
    const [data, setData] = useState<YearData[]>([]);
    const [loading, setLoading] = useState(true);
    const [annualized, setAnnualized] = useState(false);
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    useEffect(() => {
        fetch('/api/hyperliquid-apy', { method: 'POST' })
        .then(res => res.json())
        .then(json => {
            setData(json.tableData);
            setLoading(false);
        })
        .catch(() => setLoading(false));
    }, []);

    const getCellStyle = (val: number | undefined) => {
        if (val === undefined || val === 0) return {};
        
        const threshold = annualized ? 40 : 8;
        const intensity = Math.min(Math.abs(val) / threshold, 0.5);
        const baseColor = val > 0 ? THEME_PRIMARY : THEME_DANGER;

        return {
        bgcolor: alpha(baseColor, intensity),
        color: val > 0 ? (isDark ? THEME_PRIMARY : '#007a4d') : (isDark ? '#ff8a8a' : '#c62828'),
        fontWeight: 800,
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        '&:hover': {
            transform: 'scale(1.05)',
            bgcolor: alpha(baseColor, intensity + 0.15),
            zIndex: 1,
            boxShadow: `0 4px 12px ${alpha(baseColor, 0.2)}`
        }
        };
    };

    const calculateYTD = (returns: Record<string, number>) => {
        return Object.values(returns).reduce((acc, curr) => acc + curr, 0);
    };

    return (
        <Paper elevation={0} sx={{ 
        p: { xs: 2, md: 4 }, 
        borderRadius: 3, 
        bgcolor: isDark ? 'background.paper' : '#fcfcfc',
        border: `1px solid ${isDark ? '#222' : '#f0f0f0'}`,
        }}>
        
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} mb={4}>
            <Box>
            <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                <CalendarMonth sx={{ color: THEME_PRIMARY, fontSize: 20 }} />
                <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 800, letterSpacing: 1.5 }}>
                Performance Ledger
                </Typography>
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>
                Monthly Returns Analysis
            </Typography>
            </Box>

            <Stack direction="row" alignItems="center" spacing={2}>
            <Tooltip title="Switch between Monthly ROI and Projected Annual Returns">
                <FormControlLabel
                    control={
                    <Switch 
                        checked={annualized} 
                        onChange={(e) => setAnnualized(e.target.checked)} 
                        sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: THEME_PRIMARY },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: THEME_PRIMARY },
                        }}
                    />
                    }
                    label={
                    <Typography variant="caption" sx={{ fontWeight: 800, color: annualized ? THEME_PRIMARY : 'text.secondary' }}>
                        {annualized ? 'ANNUALIZED ON' : 'MONTHLY VIEW'}
                    </Typography>
                    }
                />
            </Tooltip>
            </Stack>
        </Stack>

        <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ borderCollapse: 'separate', borderSpacing: '4px 8px' }}>
            <TableHead>
                <TableRow>
                <TableCell sx={{ border: 'none', fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem' }}>YEAR</TableCell>
                {MONTHS.map(m => (
                    <TableCell key={m} align="center" sx={{ border: 'none', fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem' }}>
                    {m}
                    </TableCell>
                ))}
                <TableCell align="center" sx={{ border: 'none', fontWeight: 900, color: THEME_PRIMARY, fontSize: '0.75rem' }}>YTD</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {loading ? (
                [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                    <TableCell colSpan={14}><Skeleton variant="rounded" height={48} sx={{ my: 1, borderRadius: 3 }} /></TableCell>
                    </TableRow>
                ))
                ) : (
                data.map((row) => {
                    const ytd = calculateYTD(row.returns);
                    return (
                    <TableRow key={row.year}>
                        <TableCell sx={{ border: 'none' }}>
                        <Chip label={row.year} sx={{ fontWeight: 900, bgcolor: isDark ? '#1a1a1a' : '#eee', color: 'text.primary' }} />
                        </TableCell>
                        {MONTHS.map((_, index) => {
                        const monthKey = (index + 1).toString().padStart(2, '0');
                        let val = row.returns[monthKey];
                        
                        if (val !== undefined && annualized) {
                            val = (Math.pow(1 + val / 100, 12) - 1) * 100;
                        }

                        return (
                            <TableCell 
                            key={monthKey} 
                            align="center"
                            sx={{ 
                                ...getCellStyle(val),
                                border: 'none',
                                minWidth: 65,
                                height: 45,
                                position: 'relative'
                            }}
                            >
                            {val !== undefined ? `${val.toFixed(2)}%` : <Typography sx={{ color: 'text.disabled', fontSize: '0.8rem' }}>•</Typography>}
                            </TableCell>
                        );
                        })}
                        <TableCell align="center" sx={{ border: 'none', fontWeight: 900, color: ytd > 0 ? THEME_PRIMARY : THEME_DANGER }}>
                        {ytd > 0 ? '+' : ''}{ytd.toFixed(2)}%
                        </TableCell>
                    </TableRow>
                    );
                })
                )}
            </TableBody>
            </Table>
        </TableContainer>

        <Stack direction="row" spacing={1} alignItems="center" mt={3} sx={{ opacity: 0.6 }}>
            <InfoOutlined sx={{ fontSize: 14 }} />
            <Typography variant="caption">
            Past performance does not guarantee future results. All values calculated via UTC standards.
            </Typography>
        </Stack>
        </Paper>
    );
}