'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Stack,
  Button,
} from '@mui/material';
import { TrendingUp, Shield, Zap, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Position {
  id: string;
  tier: 'starter' | 'saver' | 'pro';
  amount: string;
  apy: string;
  earned: string;
  daysRemaining: number;
  totalDays: number;
  progress: number;
  status: 'active' | 'completed' | 'at-risk';
}

const MOCK_POSITIONS: Position[] = [
  {
    id: '1',
    tier: 'pro',
    amount: '$5,000.00',
    apy: '22.5%',
    earned: '$687.50',
    daysRemaining: 45,
    totalDays: 90,
    progress: 50,
    status: 'active',
  },
  {
    id: '2',
    tier: 'saver',
    amount: '$4,200.00',
    apy: '10.8%',
    earned: '$378.00',
    daysRemaining: 12,
    totalDays: 30,
    progress: 60,
    status: 'active',
  },
  {
    id: '3',
    tier: 'starter',
    amount: '$3,250.00',
    apy: '0%',
    earned: '$0.00',
    daysRemaining: 2,
    totalDays: 7,
    progress: 71,
    status: 'active',
  },
];

const getTierConfig = (tier: string) => {
  const configs = {
    starter: { color: '#6B8E9F', icon: <Shield size={20} />, label: 'Try-out' },
    saver: { color: '#4CAF50', icon: <TrendingUp size={20} />, label: 'Saver' },
    pro: { color: '#E89C4A', icon: <Zap size={20} />, label: 'Winner Takes All' },
  };
  return configs[tier as keyof typeof configs];
};

export default function ActivePositions() {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Active Positions
        </Typography>
        <Button
          component={Link}
          href="/deposit"
          variant="outlined"
          size="small"
          sx={{ borderColor: 'primary.main', color: 'primary.main' }}
        >
          + New Deposit
        </Button>
      </Box>

      <Stack spacing={2}>
        {MOCK_POSITIONS.map((position) => {
          const tierConfig = getTierConfig(position.tier);
          return (
            <Card
              key={position.id}
              sx={{
                bgcolor: '#1a1a1a',
                borderColor: '#2d2d2d',
                '&:hover': {
                  borderColor: tierConfig.color,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s',
                },
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box display="flex" gap={1} alignItems="center">
                    <Box sx={{ color: tierConfig.color }}>
                      {tierConfig.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {tierConfig.label}
                    </Typography>
                    <Chip
                      label={position.status}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(76, 175, 80, 0.2)',
                        color: '#4caf50',
                        textTransform: 'capitalize',
                      }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {position.amount}
                  </Typography>
                </Box>

                <Box display="flex" gap={4} mb={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      APY
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: tierConfig.color }}>
                      {position.apy}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Earned
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {position.earned}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Time Remaining
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Calendar size={14} />
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {position.daysRemaining} days
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Progress
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {position.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={position.progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: '#2d2d2d',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: tierConfig.color,
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
}
