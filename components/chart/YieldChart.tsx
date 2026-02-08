'use client';

import React, { useEffect, useState } from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Box, Typography, CircularProgress, Stack } from '@mui/material';

const THEME_COLOR = '#00E08F'; 
const VAULT_ADDRESS = process.env.NEXT_PUBLIC_HL_VAULT_ADDRESS || "0xdfc24b077bc1425ad1dea75bcb6f8158e10df303";

interface ChartData {
    date: string;
    apr: number;
    equity: number;
    isMock?: boolean;
}

interface ApiResponse {
    vaultAddress: string;
    tvl: number;
    averageAnnualApr: number;
    history: ChartData[];
}

interface CustomDotProps {
    cx?: number;
    cy?: number;
    payload?: ChartData;
}

interface VaultYieldChartProps {
    coin?: string;
    onApyLoad?: (apy: number) => void;
}

export default function VaultYieldChart({ coin, onApyLoad }: VaultYieldChartProps) {
    const [data, setData] = useState<ChartData[]>([]);
    const [stats, setStats] = useState({ apr: 0, tvl: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/hyperliquid-funding', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        vaultAddress: VAULT_ADDRESS,
                        coin: coin // ส่งชื่อเหรียญไปที่ API (ถ้าต้องการ)
                    }) 
                });
                
                const json = (await res.json()) as ApiResponse;
                
                if (json.history) {
                    setData(json.history);
                    setStats({
                        apr: json.averageAnnualApr,
                        tvl: json.tvl
                    });

                    if (onApyLoad) {
                        onApyLoad(json.averageAnnualApr);
                    }
                }
            } catch {
                console.error("Failed to sync with Vault API");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [coin, onApyLoad]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(val);
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, height: 400, alignItems: 'center' }}>
            <CircularProgress size={30} sx={{ color: THEME_COLOR }} />
        </Box>
    );

    return (
        <Box sx={{ 
            width: '100%', bgcolor: '#0a0a0a', p: 3, borderRadius: 2, 
            border: '1px solid #222'
        }}>
            
            <Stack direction="row" justifyContent="space-between" alignItems="flex-end" mb={4}>
                <Box>
                    <Typography variant="overline" sx={{ color: '#666', fontWeight: 800, letterSpacing: 2 }}>
                        Vault Performance
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 900 }}>
                        {VAULT_ADDRESS === "0xdfc24b077bc1425ad1dea75bcb6f8158e10df303" ? 'HLP Strategy' : 'Hyperliquidity Provider (HLP)'}
                    </Typography>
                </Box>
                
                <Stack direction="row" spacing={4} textAlign="right">
                    <Box>
                        <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>TOTAL TVL</Typography>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 800 }}>
                            {formatCurrency(stats.tvl)}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" sx={{ color: THEME_COLOR, display: 'block' }}>AVG 30 Day APR</Typography>
                        <Typography variant="h4" sx={{ color: THEME_COLOR, fontWeight: 900, lineHeight: 1 }}>
                            {stats.apr.toFixed(2)}%
                        </Typography>
                    </Box>
                </Stack>
            </Stack>

            <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorApr" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={THEME_COLOR} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={THEME_COLOR} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    
                    <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
                    
                    <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#444', fontSize: 11, fontWeight: 600 }} 
                        axisLine={false}
                        tickLine={false}
                    />
                    
                    <YAxis 
                        orientation="right" 
                        tick={{ fill: '#444', fontSize: 11, fontWeight: 600 }} 
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(val: number) => `${val}%`}
                    />
                    
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }}
                        formatter={(value: number | string | undefined) => {
                            const valNum = value !== undefined ? (typeof value === 'string' ? parseFloat(value) : value) : 0;
                            
                            return [
                                <span key="yield-info" style={{ color: THEME_COLOR, fontWeight: 800 }}>
                                    {valNum.toFixed(2)}%
                                </span>,
                                'Annual Yield'
                            ];
                        }}
                        labelFormatter={(label, payload) => {
                            const isMock = payload?.[0]?.payload?.isMock;
                            return `${label} ${isMock ? '(Projected)' : ''}`;
                        }}
                    />
                    
                    <Area 
                        type="monotone" 
                        dataKey="apr" 
                        stroke={THEME_COLOR} 
                        strokeWidth={3}
                        fill="url(#colorApr)" 
                        strokeDasharray={data.some(d => d.isMock) ? "5 5" : "0"}
                        dot={(props: CustomDotProps) => {
                            const { cx, cy, payload } = props;
                            if (typeof cx !== 'number' || typeof cy !== 'number' || payload?.isMock) {
                                return <path key={`empty-${Math.random()}`} />; 
                            }
                            
                            return (
                                <circle 
                                    key={`dot-${cx}-${cy}`} 
                                    cx={cx} 
                                    cy={cy} 
                                    r={4} 
                                    fill={THEME_COLOR} 
                                    stroke="#000" 
                                    strokeWidth={2} 
                                />
                            );
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
            
            <Stack direction="row" spacing={3} mt={2} justifyContent="center">
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: THEME_COLOR }} />
                    <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>HISTORICAL DATA</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', border: `2px dashed ${THEME_COLOR}` }} />
                    <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>PROJECTED ESTIMATE</Typography>
                </Stack>
            </Stack>
        </Box>
    );
}