'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
    Container, Typography, Box, Card, CardContent, Stack, 
    TextField, InputAdornment, ToggleButtonGroup, ToggleButton,
    useTheme, alpha, Skeleton, Divider, Chip, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Paper, 
    Switch, FormControlLabel
} from '@mui/material';
import { 
    XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
    Legend, ResponsiveContainer, Area, AreaChart 
} from 'recharts';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import SavingsIcon from '@mui/icons-material/Savings';
import SensorsIcon from '@mui/icons-material/Sensors';
import { CalendarMonth } from '@mui/icons-material';

const AnimatedNumber = ({ value, prefix = "", suffix = "", decimals = 2 }: { value: number, prefix?: string, suffix?: string, decimals?: number }) => {
    const [displayValue, setDisplayValue] = useState(0);
    
    useEffect(() => {
        let start = 0;
        const end = value;
        const duration = 1000;
        const incrementTime = 30;
        const steps = Math.max(Math.floor(duration / incrementTime), 1);
        const increment = end / steps;

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setDisplayValue(end);
                clearInterval(timer);
            } else {
                setDisplayValue(start);
            }
        }, incrementTime);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{prefix}{displayValue.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
};

const NEON_GREEN = '#00E08F';
const NEON_ORANGE = '#FFA500';
const THEME_DANGER = '#FF5252';
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const DURATION_OPTIONS = [
    { label: '3M', value: 3, multiplier: 1.0 },
    { label: '6M', value: 6, multiplier: 1.2 },
    { label: '12M', value: 12, multiplier: 1.5 },
    { label: '18M', value: 18, multiplier: 1.8 },
    { label: '24M', value: 24, multiplier: 2.0 },
];

interface YearData {
    year: string;
    returns: Record<string, number>;
}

interface ChartPayload {
    dataKey: string;
    value: number;
    payload: {
        MonthlyYield: number;
    };
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: ChartPayload[];
    label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    if (active && payload && payload.length) {
        const principal = payload.find((p) => p.dataKey === 'Principal')?.value || 0;
        const balance = payload.find((p) => p.dataKey === 'AOM3Balance')?.value || 0;
        const mYield = payload[0].payload.MonthlyYield || 0;
        
        return (
            <Box sx={{ bgcolor: isDark ? '#111' : '#fff', p: 2, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, boxShadow: 3 }}>
                <Typography variant="subtitle2" fontWeight={800} mb={1}>{label}</Typography>
                <Typography variant="body2" color="text.secondary">Principal: ${principal.toLocaleString()}</Typography>
                <Typography variant="body2" color={NEON_GREEN} fontWeight={800}>AOM3 Balance: ${balance.toLocaleString()}</Typography>
                {label !== 'Start' && (
                    <Typography variant="caption" color={mYield >= 0 ? NEON_GREEN : THEME_DANGER} fontWeight={800} mt={1} display="block">
                        Real Yield (inc. Multiplier): {mYield > 0 ? '+' : ''}{mYield}%
                    </Typography>
                )}
            </Box>
        );
    }
    return null;
};

export default function SimulationPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const [monthlyAmount, setMonthlyAmount] = useState<string>('100');
    const [duration, setDuration] = useState<number>(12);
    
    const [tableData, setTableData] = useState<YearData[]>([]);
    
    const [isLoading, setIsLoading] = useState<boolean>(true); 
    const [annualized, setAnnualized] = useState(false);

    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        fetch('/api/hyperliquid-apy', { method: 'POST' })
            .then(res => res.json())
            .then(json => {
                if (json && json.tableData) {
                    setTableData(json.tableData);
                }
            })
            .catch(err => console.error("Fetch Monthly Data Error:", err))
            .finally(() => {
                setIsLoading(false);
                setTimeout(() => setShowContent(true), 100); 
            });
    }, []);

    const historicalTimeline = useMemo(() => {
        if (!tableData || tableData.length === 0) return [];
        
        const sortedData = [...tableData].sort((a, b) => Number(a.year) - Number(b.year));
        const flat: { label: string, rawReturn: number }[] = [];

        sortedData.forEach(row => {
            const yearShort = row.year.slice(-2);
            for (let i = 1; i <= 12; i++) {
                const monthKey = i.toString().padStart(2, '0');
                const val = row.returns[monthKey];
                if (val !== undefined && val !== null) {
                    flat.push({ 
                        label: `${MONTHS[i-1]} '${yearShort}`, 
                        rawReturn: val 
                    });
                }
            }
        });
        return flat;
    }, [tableData]);

    const chartData = useMemo(() => {
        const amountNum = parseFloat(monthlyAmount) || 0;
        if (amountNum <= 0 || historicalTimeline.length === 0) return [];

        const selectedDuration = DURATION_OPTIONS.find(d => d.value === duration) || DURATION_OPTIONS[2];
        const mult = selectedDuration.multiplier;

        const monthsToSimulate = historicalTimeline.slice(-duration);

        let currentPrincipal = 0;
        let currentBalance = 0;
        const data = [];

        data.push({ month: 'Start', Principal: 0, AOM3Balance: 0, MonthlyYield: 0 });

        monthsToSimulate.forEach((item) => {
            currentPrincipal += amountNum;
            const effectiveMonthlyYield = (item.rawReturn / 100) * mult; 
            currentBalance = (currentBalance + amountNum) * (1 + effectiveMonthlyYield);

            data.push({
                month: item.label,
                Principal: currentPrincipal,
                AOM3Balance: Number(currentBalance.toFixed(2)),
                MonthlyYield: Number((item.rawReturn * mult).toFixed(2))
            });
        });

        return data;
    }, [monthlyAmount, duration, historicalTimeline]);

    const finalData = chartData[chartData.length - 1] || { Principal: 0, AOM3Balance: 0 };
    const totalProfit = finalData.AOM3Balance - finalData.Principal;
    const currentMultiplier = DURATION_OPTIONS.find(d => d.value === duration)?.multiplier || 1;
    const actualMonthsSimulated = chartData.length > 1 ? chartData.length - 1 : 0;

    const getCellStyle = (val: number | undefined) => {
        if (val === undefined || val === 0) return {};
        const threshold = annualized ? 40 : 8;
        const intensity = Math.min(Math.abs(val) / threshold, 0.5);
        const baseColor = val > 0 ? NEON_GREEN : THEME_DANGER;
        return {
            bgcolor: alpha(baseColor, intensity),
            color: val > 0 ? (isDark ? NEON_GREEN : '#007a4d') : (isDark ? '#ff8a8a' : '#c62828'),
            fontWeight: 800,
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            '&:hover': { transform: 'scale(1.05)', bgcolor: alpha(baseColor, intensity + 0.15), zIndex: 1, boxShadow: `0 4px 12px ${alpha(baseColor, 0.2)}` }
        };
    };

    const calculateYTD = (returns: Record<string, number>) => Object.values(returns).reduce((acc, curr) => acc + curr, 0);

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Box mb={6} textAlign="center" sx={{ opacity: showContent ? 1 : 0, transform: showContent ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out' }}>
                <Typography variant="overline" sx={{ color: NEON_GREEN, fontWeight: 900, letterSpacing: 2 }}>
                    HISTORICAL DATA SIMULATOR
                </Typography>
                <Typography variant="h3" fontWeight="900" textTransform="uppercase">
                    Savings <Box component="span" color={NEON_GREEN}>Backtest</Box>
                </Typography>
                <Typography variant="body1" color="text.secondary" mt={2} maxWidth="sm" mx="auto">
                    Simulate portfolio growth using <b>actual monthly returns</b> from Hyperliquid’s historical performance, broken down month by month, to show the real volatility that disciplined investing can overcome.
                </Typography>
            </Box>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} mb={6} sx={{ opacity: showContent ? 1 : 0, transform: showContent ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s ease-out 0.2s' }}>
                <Box sx={{ flex: 1 }}>
                    <Card sx={{ bgcolor: 'background.paper', borderRadius: 4, border: `1px solid ${theme.palette.divider}`, height: '100%', transition: '0.3s', '&:hover': { borderColor: NEON_GREEN, boxShadow: `0 0 20px ${alpha(NEON_GREEN, 0.1)}` } }}>
                        <CardContent sx={{ p: 4 }}>
                            <Stack spacing={4}>
                                <Box>
                                    <Typography variant="overline" color="text.secondary" fontWeight={800}>
                                        Monthly Deposit (USDC)
                                    </Typography>
                                    <TextField 
                                        fullWidth variant="outlined" value={monthlyAmount} onChange={(e) => setMonthlyAmount(e.target.value)}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><SavingsIcon color="primary" /></InputAdornment>, sx: { fontSize: '1.5rem', fontWeight: 900, height: 64, borderRadius: 3, transition: '0.3s' } }}
                                    />
                                </Box>

                                <Box>
                                    <Typography variant="overline" color="text.secondary" fontWeight={800} display="flex" justifyContent="space-between">
                                        <span>Backtest Period</span>
                                        <span style={{ color: NEON_GREEN }}>Multiplier: {currentMultiplier}x</span>
                                    </Typography>
                                    <ToggleButtonGroup
                                        value={duration} exclusive fullWidth onChange={(_, val) => val !== null && setDuration(val)}
                                        sx={{ height: 64, bgcolor: alpha(theme.palette.divider, 0.05), borderRadius: 1, p: '4px' }}
                                    >
                                        {DURATION_OPTIONS.map(d => (
                                            <ToggleButton key={d.value} value={d.value} sx={{ border: 'none', borderRadius: '12px !important', mx: '2px', transition: '0.2s', '&.Mui-selected': { bgcolor: NEON_GREEN, color: '#000', transform: 'scale(1.05)', '&:hover': { bgcolor: NEON_GREEN } } }}>
                                                <Typography fontWeight={900}>{d.label}</Typography>
                                            </ToggleButton>
                                        ))}
                                    </ToggleButtonGroup>
                                </Box>

                                <Divider />

                                <Box>
                                    <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={700}>
                                            DATA POINTS USED
                                        </Typography>
                                        <Chip icon={<SensorsIcon sx={{ fontSize: 12, color: `${NEON_GREEN} !important` }} />} label="REAL MONTHLY HISTORY" size="small" sx={{ height: 20, fontSize: 10, fontWeight: 900, bgcolor: alpha(NEON_GREEN, 0.1), color: NEON_GREEN, border: `1px solid ${alpha(NEON_GREEN, 0.3)}` }} />
                                    </Stack>

                                    {isLoading ? (
                                        <Skeleton height={40} width="50%" />
                                    ) : (
                                        <Typography variant="h4" fontWeight={900} color={NEON_ORANGE}>
                                            <AnimatedNumber value={actualMonthsSimulated} suffix=" Months" decimals={0} />
                                        </Typography>
                                    )}
                                    <Typography variant="caption" color="text.secondary">
                                        Using the most recent available history
                                    </Typography>
                                </Box>

                                <Box bgcolor={alpha(NEON_GREEN, 0.1)} p={3} borderRadius={3} sx={{ transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-5px)', boxShadow: `0 8px 25px ${alpha(NEON_GREEN, 0.2)}` } }}>
                                    <Typography variant="caption" color={NEON_GREEN} fontWeight={800} display="block" mb={1}>
                                        ACTUAL PROJECTED PROFIT
                                    </Typography>
                                    <Typography variant="h3" fontWeight={900} color={NEON_GREEN}>
                                        <AnimatedNumber value={Math.abs(totalProfit)} prefix={totalProfit >= 0 ? '+$' : '-$'} decimals={2} />
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" fontWeight={600} mt={1}>
                                        Final Balance: ${finalData.AOM3Balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Box>

                <Box sx={{ flex: 2 }}>
                    <Card sx={{ height: '100%', bgcolor: 'background.paper', borderRadius: 4, border: `1px solid ${theme.palette.divider}`, '&:hover': { borderColor: NEON_GREEN } }}>
                        <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" fontWeight={900} mb={4} display="flex" alignItems="center" gap={1}>
                                <AutoGraphIcon color="primary" /> Historical Reality Check
                            </Typography>
                            
                            <Box sx={{ flexGrow: 1, minHeight: 400 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorAOM3" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={NEON_GREEN} stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor={NEON_GREEN} stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                                        <XAxis dataKey="month" stroke={theme.palette.text.secondary} tick={{ fill: theme.palette.text.secondary, fontSize: 12, fontWeight: 600 }} tickMargin={10} />
                                        <YAxis stroke={theme.palette.text.secondary} tick={{ fill: theme.palette.text.secondary, fontSize: 12, fontWeight: 600 }} tickFormatter={(val) => `$${val}`} />
                                        
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{ paddingTop: 20, fontWeight: 700 }} />
                                        
                                        <Area type="monotone" dataKey="Principal" name="Your Principal" stroke={theme.palette.text.secondary} fill="transparent" strokeWidth={3} strokeDasharray="5 5" animationDuration={1500} />
                                        <Area type="monotone" dataKey="AOM3Balance" name="AOM3 + Real Yield" stroke={NEON_GREEN} fillOpacity={1} fill="url(#colorAOM3)" strokeWidth={4} animationDuration={1500} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Stack>

            <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, bgcolor: 'background.paper', border: `1px solid ${theme.palette.divider}`, opacity: showContent ? 1 : 0, transform: showContent ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.8s ease-out 0.4s' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} mb={4}>
                    <Box>
                        <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                            <CalendarMonth sx={{ color: NEON_GREEN, fontSize: 20 }} />
                            <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 800, letterSpacing: 1.5 }}>
                                Source Data Ledger
                            </Typography>
                        </Stack>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>
                            Historical Monthly Returns
                        </Typography>
                    </Box>

                    <Stack direction="row" alignItems="center" spacing={2}>
                        <FormControlLabel
                            control={<Switch checked={annualized} onChange={(e) => setAnnualized(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: NEON_GREEN }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: NEON_GREEN } }} />}
                            label={<Typography variant="caption" sx={{ fontWeight: 800, color: annualized ? NEON_GREEN : 'text.secondary' }}>{annualized ? 'ANNUALIZED ON' : 'MONTHLY VIEW'}</Typography>}
                        />
                    </Stack>
                </Stack>

                <TableContainer sx={{ overflowX: 'auto' }}>
                    <Table size="small" sx={{ borderCollapse: 'separate', borderSpacing: '4px 8px' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ border: 'none', fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem' }}>YEAR</TableCell>
                                {MONTHS.map(m => <TableCell key={m} align="center" sx={{ border: 'none', fontWeight: 900, color: 'text.secondary', fontSize: '0.75rem' }}>{m}</TableCell>)}
                                <TableCell align="center" sx={{ border: 'none', fontWeight: 900, color: NEON_GREEN, fontSize: '0.75rem' }}>YTD</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                [...Array(2)].map((_, i) => <TableRow key={i}><TableCell colSpan={14}><Skeleton variant="rounded" height={48} sx={{ my: 1, borderRadius: 3 }} /></TableCell></TableRow>)
                            ) : tableData.length === 0 ? (
                                <TableRow><TableCell colSpan={14} align="center" sx={{ py: 4, border: 'none' }}><Typography color="text.secondary" fontWeight={700}>No historical data found</Typography></TableCell></TableRow>
                            ) : (
                                tableData.map((row) => {
                                    const ytd = calculateYTD(row.returns);
                                    return (
                                        <TableRow key={row.year}>
                                            <TableCell sx={{ border: 'none' }}><Chip label={row.year} sx={{ fontWeight: 900, bgcolor: alpha(theme.palette.text.primary, 0.05), color: 'text.primary' }} /></TableCell>
                                            {MONTHS.map((_, index) => {
                                                const monthKey = (index + 1).toString().padStart(2, '0');
                                                let val = row.returns[monthKey];
                                                if (val !== undefined && annualized) val = (Math.pow(1 + val / 100, 12) - 1) * 100;

                                                return (
                                                    <TableCell key={monthKey} align="center" sx={{ ...getCellStyle(val), border: 'none', minWidth: 65, height: 45 }}>
                                                        {val !== undefined ? `${val.toFixed(2)}%` : <Typography sx={{ color: 'text.disabled', fontSize: '0.8rem' }}>•</Typography>}
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell align="center" sx={{ border: 'none', fontWeight: 900, color: ytd > 0 ? NEON_GREEN : THEME_DANGER }}>
                                                {ytd > 0 ? '+' : ''}{ytd.toFixed(2)}%
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
}