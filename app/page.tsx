'use client';

import React from 'react';
import { Box, Divider, useTheme } from '@mui/material';
import Navbar from '@/components/home/Navbar';
import HeroSection from '@/components/home/HeroSection';
import YieldStats from '@/components/home/YieldStats';
import StrategySection from '@/components/home/StrategySection';
import FAQSection from '@/components/home/FAQSection';
import Footer from '@/components/home/Footer';

export default function Home() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box 
      component="main" 
      sx={{ 
        bgcolor: 'background.default', 
        color: 'text.primary',
        minHeight: '100vh', 
        overflowX: 'hidden',
        transition: 'background-color 0.3s ease'
      }}
    >
      <Navbar /> 
      <HeroSection />
      <Box sx={{ py: 8, px: 2 }}>
        <YieldStats />
      </Box>

      <Divider 
        sx={{ 
          borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          mx: 'auto',
          maxWidth: 'lg'
        }} 
      />

      <StrategySection />
      <FAQSection />
      <Footer />
    </Box>
  );
}