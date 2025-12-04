import React from 'react';
import { Box, Divider } from '@mui/material';
import Navbar from '@/components/home/Navbar';
import HeroSection from '@/components/home/HeroSection';
import YieldStats from '@/components/home/YieldStats';
import StrategySection from '@/components/home/StrategySection';
import FAQSection from '@/components/home/FAQSection';
import Footer from '@/components/home/Footer';

export default function Home() {
  return (
    <Box component="main" sx={{ bgcolor: 'background.default', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar /> 
      <HeroSection />
      <Box sx={{ py: 8, px: 2 }}>
        <YieldStats />
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
      <StrategySection />
      <FAQSection />
      <Footer />
    </Box>
  );
}