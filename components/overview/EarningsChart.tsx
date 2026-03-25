'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { TrendingUp } from 'lucide-react';

export default function EarningsChart() {
  const [timeframe, setTimeframe] = React.useState('30d');

  const handleChange = (event: React.MouseEvent<HTMLElement>, newTimeframe: string | null) => {
    if (newTimeframe !== null) {
      setTimeframe(newTimeframe);
    }
  };

  // Mock data for visual bars
  const mockData = [
    { label: 'Week 1', value: 45, color: '#4caf50' },
    { label: 'Week 2', value: 78, color: '#4caf50' },
    { label: 'Week 3', value: 62, color: '#E89C4A' },
    { label: 'Week 4', value: 95, color: '#4caf50' },
  ];

  const maxValue = Math.max(...mockData.map((d) => d.value));

  return (
    <Card sx={{ bgcolor: '#1a1a1a', borderColor: '#2d2d2d' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Earnings Over Time
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <TrendingUp size={16} color="#4caf50" />
              <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                +18.5% this month
              </Typography>
            </Box>
          </Box>
          <ToggleButtonGroup
            value={timeframe}
            exclusive
            onChange={handleChange}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                color: 'text.secondary',
                borderColor: '#2d2d2d',
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'black',
                  '&:hover': {
                    bgcolor: 'primary.main',
                  },
                },
              },
            }}
          >
            <ToggleButton value="7d">7D</ToggleButton>
            <ToggleButton value="30d">30D</ToggleButton>
            <ToggleButton value="90d">90D</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Simple Bar Chart */}
        <Box sx={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 2, pt: 2 }}>
          {mockData.map((item, index) => (
            <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box
                sx={{
                  width: '100%',
                  height: `${(item.value / maxValue) * 180}px`,
                  bgcolor: item.color,
                  borderRadius: '4px 4px 0 0',
                  transition: 'all 0.3s',
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, fontWeight: 500 }}
              >
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box mt={3} pt={3} borderTop="1px solid #2d2d2d">
          <Box display="flex" justifyContent="space-around">
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Total Earned
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#4caf50' }}>
                $1,234.56
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Avg APY
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                11.2%
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Best Week
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                $387.25
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
