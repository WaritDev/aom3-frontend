'use client';

import React from 'react';
import { Stack, Box, Card, CardContent, Typography, Chip } from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import ShowChartIcon from '@mui/icons-material/ShowChart';

type StatCardProps = {
  label: string;
  value: string;
  isHero?: boolean;
  icon?: React.ReactNode;
};

const StatCard = ({ label, value, isHero, icon }: StatCardProps) => (
  <Card 
    sx={{ 
      height: '100%',
      bgcolor: isHero ? 'primary.main' : '#1e1e1e', 
      color: isHero ? 'black' : 'text.primary',
      borderColor: isHero ? 'primary.main' : '#333',
      position: 'relative',
      transition: 'transform 0.2s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: isHero ? '0 10px 20px rgba(76, 175, 80, 0.3)' : 'none',
      }
    }}
  >
    <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Typography variant="body2" sx={{ opacity: isHero ? 0.8 : 0.5, fontWeight: 600 }}>
          {label}
        </Typography>
        {icon && <Box sx={{ opacity: isHero ? 0.8 : 0.4 }}>{icon}</Box>}
      </Box>

      <Box mt={2}>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </Box>
      
      {isHero && (
        <Box mt={1}>
            <Chip 
              label="Delta Neutral" 
              size="small" 
              sx={{ 
                bgcolor: 'rgba(0,0,0,0.1)', 
                color: 'inherit', 
                fontWeight: 'bold',
                height: 24
              }} 
            />
        </Box>
      )}
    </CardContent>
  </Card>
);

const YieldStats = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" textAlign="center" gutterBottom sx={{ mb: 6, fontWeight: 'bold' }}>
        Competitive Yield, <span style={{ color: '#666' }}>Zero Exposure</span>
      </Typography>

      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        spacing={3} 
        justifyContent="center"
      >
        <Box sx={{ flex: 1 }}>
          <StatCard 
            label="Aave Lending APY" 
            value="~2.99%" 
            icon={<ShowChartIcon />}
          />
        </Box>
        
        <Box sx={{ flex: 1.1 }}>
          <StatCard 
            label="AOM3 Strategy APY" 
            value="15.40%" 
            isHero
            icon={<AutoGraphIcon fontSize="large" />}
          />
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <StatCard 
            label="Standard Staking" 
            value="~4.42%" 
            icon={<ShowChartIcon />}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default YieldStats;