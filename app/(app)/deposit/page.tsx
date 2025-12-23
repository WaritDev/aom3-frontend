'use client';
import { Box, Typography, Container } from '@mui/material';
import DepositWizard from '@/components/deposit/DepositWizard';

export default function DepositPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', pt: 4, pb: 6, px: 2 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 2,
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
      <DepositWizard />
    </Container>
  );
}