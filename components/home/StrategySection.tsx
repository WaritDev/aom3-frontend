'use client';

import React from 'react';
import { Container, Box, Typography, Stack, Paper } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import TimelineIcon from '@mui/icons-material/Timeline';
import SecurityIcon from '@mui/icons-material/Security';
import OpacityIcon from '@mui/icons-material/Opacity';

const features = [
  {
    icon: <OpacityIcon sx={{ color: '#4caf50' }} />, 
    title: 'Deep Liquidity',
    desc: 'AOM3 leverages deep on-chain liquidity, enabling strategies to scale efficiently without slippage.'
  },
  {
    icon: <TimelineIcon sx={{ color: '#4caf50' }} />, 
    title: 'Funding Rates',
    desc: 'We capture yield directly from funding rates. Real cash flow paid by traders, not inflationary tokens.'
  },
  {
    icon: <TuneIcon sx={{ color: '#4caf50' }} />, 
    title: 'Delta Neutral',
    desc: 'Our automated vaults hedge your position 1:1. You earn the yield, but ignore the price volatility.'
  },
  {
    icon: <SecurityIcon sx={{ color: '#4caf50' }} />, 
    title: 'Non-Custodial',
    desc: 'You retain full control. Withdraw your funds at any time directly from the smart contract.'
  }
];

const StrategySection = () => {
  return (
    <Box sx={{ py: 12, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
            Only possible with <span style={{ color: '#4caf50' }}>Smart Execution</span>
        </Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 8, maxWidth: 700, mx: 'auto' }}>
          AOM3 is leveraging unique architecture to make delta-neutral yield strategies seamless, secure, and scalable.
        </Typography>

        <Stack spacing={2}>
          {features.map((item, index) => (
            <Paper 
              key={index}
              elevation={0}
              sx={{ 
                p: 4, 
                bgcolor: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                transition: 'all 0.3s',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.05)',
                  transform: 'translateX(10px)'
                }
              }}
            >
              <Box sx={{ p: 1.5, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 2 }}>
                {item.icon}
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.desc}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default StrategySection;