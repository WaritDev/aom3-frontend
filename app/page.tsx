'use client';

import React from 'react';
import { Box, Divider, useTheme } from '@mui/material';
import { motion, useScroll, useSpring } from 'framer-motion';

import Navbar from '@/components/home/Navbar';
import HeroSection from '@/components/home/HeroSection';
import YieldStats from '@/components/home/YieldStats';
import StrategySection from '@/components/home/StrategySection';
import FAQSection from '@/components/home/FAQSection';
import Footer from '@/components/home/Footer';

const ScrollReveal = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 1, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export default function Home() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const NEON_GREEN = '#00E08F';

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <Box 
      component="main" 
      sx={{ 
        bgcolor: 'background.default', 
        color: 'text.primary',
        minHeight: '100vh', 
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'background-color 0.3s ease'
      }}
    >
      <motion.div
        style={{
          scaleX,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: NEON_GREEN,
          transformOrigin: '0%',
          zIndex: 2000,
          boxShadow: `0 0 10px ${NEON_GREEN}`
        }}
      />

      <Navbar /> 
      <Box sx={{ 
        position: 'relative',
      }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <HeroSection />
        </motion.div>
      </Box>

      <ScrollReveal>
        <Box sx={{ py: 8, px: 2 }}>
          <YieldStats />
        </Box>
      </ScrollReveal>

      <Divider 
        sx={{ 
          borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          mx: 'auto',
          maxWidth: 'lg'
        }} 
      />

      <ScrollReveal>
        <StrategySection />
      </ScrollReveal>

      <ScrollReveal>
        <FAQSection />
      </ScrollReveal>

      <ScrollReveal>
        <Footer />
      </ScrollReveal>
    </Box>
  );
}