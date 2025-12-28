'use client';

import React from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';
import PortfolioSummary from '@/components/overview/PortfolioSummary';
import ActivePositions from '@/components/overview/ActivePositions';
import EarningsChart from '@/components/overview/EarningsChart';
import RecentActivity from '@/components/overview/RecentActivity';

export default function OverviewPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 1,
            background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Overview Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your positions, earnings, and discipline progress
        </Typography>
      </Box>

      {/* Portfolio Summary Cards */}
      <Box mb={4}>
        <PortfolioSummary />
      </Box>

      {/* Main Content Grid */}
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={3}
      >
        {/* Left Column - Active Positions */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 50%' } }}>
          <ActivePositions />
        </Box>

        {/* Right Column - Charts & Activity */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 50%' } }}>
          <Box mb={3}>
            <EarningsChart />
          </Box>
          <RecentActivity />
        </Box>
      </Stack>
    </Container>
  );
}