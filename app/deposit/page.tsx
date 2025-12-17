import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import DepositWizard from '@/components/deposit/DepositWizard';

export default function DepositPage() {
  return (
    <Box
      component="main"
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      <Navbar />

      {/* Page Title */}
      <Box sx={{ textAlign: 'center', pt: { xs: 8, md: 12 }, pb: 4, px: 2 }}>
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
          Start Your Savings Journey
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Choose your commitment level, lock your crypto, and start earning with the power of
          discipline and DeFi.
        </Typography>
      </Box>

      {/* Deposit Wizard */}
      <DepositWizard />

      <Footer />
    </Box>
  );
}
