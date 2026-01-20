'use client';

import React from 'react';
import { Container, Box, Typography, Stack, Fade } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import TimelineIcon from '@mui/icons-material/Timeline';
import ShieldMoonIcon from '@mui/icons-material/ShieldMoon';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

const NEON_GREEN = '#00E08F';
const BG_DARK = '#050505';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const features: FeatureItem[] = [
  {
    icon: <WaterDropIcon sx={{ color: NEON_GREEN }} />, 
    title: 'Hyperliquid Core',
    desc: 'AOM3 execution is powered by the deepest on-chain perpetual liquidity, ensuring 1:1 hedging precision.'
  },
  {
    icon: <TimelineIcon sx={{ color: NEON_GREEN }} />, 
    title: 'Funding Rate Capture',
    desc: 'Earn real cash flow paid by market participants. No inflationary tokens—only pure, sustainable yield.'
  },
  {
    icon: <TuneIcon sx={{ color: NEON_GREEN }} />, 
    title: 'Delta-Zero Protocol',
    desc: 'Our engine maintains a neutral market position. You capture the yield while remaining immune to price swings.'
  },
  {
    icon: <ShieldMoonIcon sx={{ color: NEON_GREEN }} />, 
    title: 'Discipline Multiplier',
    desc: 'Your rewards are amplified by consistency. Maintain your streak to claim your share of the forfeited yield pool.'
  }
];

const StrategySection: React.FC = () => {
  return (
    <Box sx={{ py: { xs: 10, md: 15 }, bgcolor: BG_DARK, position: 'relative' }}>
      <Box 
        sx={{ 
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: '80%', height: '400px', bgcolor: `${NEON_GREEN}05`, 
          filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 
        }} 
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in timeout={1000}>
          <Box mb={10} textAlign="center">
            <Typography variant="overline" sx={{ color: NEON_GREEN, fontWeight: 900, letterSpacing: 4 }}>
              Advanced Mechanics
            </Typography>
            <Typography variant="h2" fontWeight="900" sx={{ mt: 2, mb: 3, letterSpacing: '-2px', textTransform: 'uppercase' }}>
              Only Possible with <br />
              <Box component="span" sx={{ color: NEON_GREEN, textShadow: `0 0 30px ${NEON_GREEN}40` }}>
                Smart Execution
              </Box>
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', maxWidth: 700, mx: 'auto', fontWeight: 500 }}>
              AOM3 automates institutional-grade delta-neutral strategies, making high-yield savings accessible, secure, and disciplined.
            </Typography>
          </Box>
        </Fade>

        
        <Stack spacing={2.5}>
          {features.map((item, index) => (
            <Box 
              key={index}
              sx={{ 
                p: { xs: 3, md: 4 }, 
                bgcolor: CARD_BG, 
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 4,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: { xs: 2, sm: 4 },
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'default',
                '&:hover': {
                  bgcolor: 'rgba(0, 224, 143, 0.03)',
                  borderColor: `${NEON_GREEN}40`,
                  transform: 'translateX(12px)',
                  boxShadow: `0 0 30px ${NEON_GREEN}05`
                }
              }}
            >
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: `${NEON_GREEN}10`, 
                  borderRadius: 3, 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${NEON_GREEN}20`
                }}
              >
                {item.icon}
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="900" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#888', lineHeight: 1.7, maxWidth: '800px', fontWeight: 500 }}>
                  {item.desc}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default StrategySection;