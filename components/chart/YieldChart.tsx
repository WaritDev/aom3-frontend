'use client';

import React, { useEffect, useState } from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Box, Typography, CircularProgress, Stack } from '@mui/material';

const THEME_COLOR = '#00E08F'; 

interface ChartData {
    date: string;
    apy: number;
    rawFunding: number;
    count?: number;
}

interface ApiResponse {
    coin: string;
    average30dApy: number;
    history: ChartData[];
}

interface YieldChartProps {
    coin?: string;
    onApyLoad?: (apy: number) => void;
}

export default function YieldChart({ coin = 'BTC', onApyLoad }: YieldChartProps) {
    const [data, setData] = useState<ChartData[]>([]);
    const [avgApy, setAvgApy] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/hyperliquid-funding', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ coin }) 
            });
            
            const json = (await res.json()) as ApiResponse;
            
            if (json.history) {
            setData(json.history);
            setAvgApy(json.average30dApy);
            if (onApyLoad) onApyLoad(json.average30dApy);
            }
        } catch (e) {
            console.error("Failed to load chart data:", e);
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, [coin, onApyLoad]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, height: 300, alignItems: 'center' }}><CircularProgress size={30} sx={{ color: THEME_COLOR }} /></Box>;
    if (!data.length) return <Typography color="error">Data unavailable</Typography>;

    return (
        <Box sx={{ width: '100%', height: 340, bgcolor: '#111', p: 3, borderRadius: 2, border: '1px solid #333' }}>
        
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                30-Day APY Performance
                </Typography>
                <Typography variant="caption" sx={{ color: '#888' }}>
                Source: Hyperliquid Funding ({coin})
                </Typography>
            </Box>
            <Box textAlign="right">
                <Typography variant="h4" sx={{ color: THEME_COLOR, fontWeight: 'bold' }}>
                    {avgApy.toFixed(2)}%
                </Typography>
                <Typography variant="caption" sx={{ color: '#888' }}>
                    Avg 30d APY
                </Typography>
            </Box>
        </Stack>
        
        <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data}>
            <defs>
                <linearGradient id="colorApy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={THEME_COLOR} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={THEME_COLOR} stopOpacity={0}/>
                </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
            
            <XAxis 
                dataKey="date" 
                tick={{ fill: '#666', fontSize: 11 }} 
                axisLine={false}
                tickLine={false}
                minTickGap={30}
            />
            
            <YAxis 
                orientation="right" 
                tick={{ fill: '#666', fontSize: 11 }} 
                axisLine={false}
                tickLine={false}
                tickFormatter={(val: number) => `${val.toFixed(1)}%`}
                domain={['auto', 'auto']}
                width={40}
            />
            
            <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}
                formatter={(value: number | string | Array<number | string> | undefined): [string, string] => {
                if (typeof value === 'number') {
                    return [`${value.toFixed(2)}%`, 'Net APY'];
                }
                return ['N/A', 'Net APY'];
                }}
                labelStyle={{ color: '#aaa', marginBottom: '0.25rem' }}
            />
            
            <Area 
                type="monotone" 
                dataKey="apy" 
                stroke={THEME_COLOR} 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorApy)" 
                isAnimationActive={true}
            />
            </AreaChart>
        </ResponsiveContainer>
        </Box>
    );
}