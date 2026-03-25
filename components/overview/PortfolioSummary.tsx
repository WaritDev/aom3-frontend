'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import { TrendingUp, Wallet, Clock, Award } from 'lucide-react';

interface StatItemProps {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  color?: string;
}

const StatItem = ({ label, value, subValue, icon, color = '#4caf50' }: StatItemProps) => (
  <Card sx={{ height: '100%', bgcolor: '#1a1a1a', borderColor: '#2d2d2d' }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        <Box sx={{ color, opacity: 0.8 }}>
          {icon}
        </Box>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
        {value}
      </Typography>
      {subValue && (
        <Typography variant="body2" color="text.secondary">
          {subValue}
        </Typography>
      )}
    </CardContent>
  </Card>
);

export default function PortfolioSummary() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Portfolio Summary
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        sx={{ flexWrap: 'wrap' }}
      >
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
          <StatItem
            label="Total Value Locked"
            value="$12,450.00"
            subValue="≈ 0.25 BTC"
            icon={<Wallet size={24} />}
            color="#4caf50"
          />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
          <StatItem
            label="Total Earned"
            value="$1,234.56"
            subValue="+11.2% APY"
            icon={<TrendingUp size={24} />}
            color="#4caf50"
          />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
          <StatItem
            label="Active Deposits"
            value="3"
            subValue="2 Locked, 1 Flexible"
            icon={<Clock size={24} />}
            color="#E89C4A"
          />
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
          <StatItem
            label="Discipline Score"
            value="94%"
            subValue="Excellent"
            icon={<Award size={24} />}
            color="#4caf50"
          />
        </Box>
      </Stack>
    </Box>
  );
}
