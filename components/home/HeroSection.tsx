'use client';

import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Stack, 
  Fade, 
  Divider,
  SxProps,
  Theme
} from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import BoltIcon from '@mui/icons-material/Bolt';
import Link from 'next/link';

const NEON_GREEN = '#00E08F';

interface StatItemProps {
  label: string;
  value: string;
  subValue: string;
}

const StatItem = ({ label, value, subValue }: StatItemProps) => (
  <Box sx={{ textAlign: 'center' }}>
    <Typography variant="h5" fontWeight="900" sx={{ color: '#FFF', lineHeight: 1 }}>
      {value}
    </Typography>
    <Typography variant="caption" sx={{ color: NEON_GREEN, fontWeight: 800, letterSpacing: 1, display: 'block', mt: 0.5 }}>
      {label}
    </Typography>
    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>
      {subValue}
    </Typography>
  </Box>
);

const HeroSection: React.FC = () => {
  const launchButtonSx: SxProps<Theme> = {
    px: 6,
    py: 2,
    fontSize: '1.1rem',
    borderRadius: '12px',
    fontWeight: 900,
    bgcolor: NEON_GREEN,
    color: '#000',
    boxShadow: `0 0 25px ${NEON_GREEN}50`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      bgcolor: NEON_GREEN,
      boxShadow: `0 0 45px ${NEON_GREEN}80`,
      transform: 'translateY(-3px)',
    },
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        bgcolor: '#050505',
        background: `
          radial-gradient(circle at 50% 20%, ${NEON_GREEN}15 0%, rgba(5, 5, 5, 0) 60%),
          linear-gradient(to bottom, #050505, #0a0a0a)
        `,
      }}
    >
      <Box 
        sx={{ 
          position: 'absolute', 
          inset: 0, 
          opacity: 0.04, 
          backgroundImage: `linear-gradient(${NEON_GREEN} 1px, transparent 1px), linear-gradient(90deg, ${NEON_GREEN} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          pointerEvents: 'none'
        }} 
      />

      <Container maxWidth="lg">
        <Fade in timeout={1200}>
          <Stack spacing={5} alignItems="center" textAlign="center" sx={{ position: 'relative', zIndex: 1 }}>
            
            <Box 
              sx={{ 
                bgcolor: `${NEON_GREEN}08`, 
                px: 2.5, 
                py: 0.75, 
                borderRadius: '50px', 
                border: `1px solid ${NEON_GREEN}30`,
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                animation: 'pulse 2s infinite ease-in-out'
              }}
            >
              <BoltIcon sx={{ color: NEON_GREEN, fontSize: 18 }} />
              <Typography variant="caption" sx={{ color: NEON_GREEN, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase' }}>
                System Ready: Delta-Neutral Engine
              </Typography>
            </Box>

            <Box>
              <Typography 
                variant="h1" 
                sx={{ 
                  fontSize: { xs: '3.2rem', md: '6.5rem' },
                  fontWeight: 900,
                  lineHeight: 0.9,
                  letterSpacing: '-4px',
                  background: `linear-gradient(180deg, #FFF 40%, ${NEON_GREEN} 160%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textTransform: 'uppercase',
                  mb: 1
                }}
              >
                Yield beyond <br /> the <Box component="span" sx={{ textShadow: `0 0 50px ${NEON_GREEN}60` }}>(h)edge</Box>
              </Typography>
            </Box>

            <Typography 
              variant="h5" 
              sx={{ 
                maxWidth: '650px', 
                mx: 'auto', 
                fontSize: { xs: '1.05rem', md: '1.25rem' }, 
                lineHeight: 1.6,
                color: 'rgba(255,255,255,0.6)',
                fontWeight: 500,
                letterSpacing: 0.5
              }}
            >
              Master the art of <Box component="span" color="#FFF" fontWeight="800">Sustainable Compounding</Box>. 
              Institutional-grade strategies for the modern strategist.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} pt={2}>
              <Button 
                component={Link}
                href="/overview"
                variant="contained" 
                size="large" 
                endIcon={<RocketLaunchIcon />}
                sx={launchButtonSx}
              >
                Launch Quest
              </Button>
              
              <Button 
                component={Link}
                href="/docs"
                variant="outlined" 
                size="large"
                sx={{ 
                  px: 5, 
                  borderRadius: '12px',
                  borderColor: 'rgba(255,255,255,0.15)',
                  color: '#FFF',
                  fontWeight: 800,
                  borderWidth: '2px',
                  '&:hover': {
                    borderColor: NEON_GREEN,
                    bgcolor: `${NEON_GREEN}05`,
                    borderWidth: '2px',
                  }
                }}
              >
                Protocol Docs
              </Button>
            </Stack>

            <Stack 
              direction="row" 
              spacing={{ xs: 3, md: 6 }} 
              sx={{ pt: 6 }} 
              divider={<Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)', height: '40px', alignSelf: 'center' }} />}
            >
              <StatItem label="MAX STREAK" value="1.5x" subValue="MULTIPLIER" />
              <StatItem label="RISK MODEL" value="DELTA-0" subValue="NEUTRAL" />
            </Stack>

          </Stack>
        </Fade>
      </Container>

      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 0.8; }
          50% { opacity: 1; border-color: ${NEON_GREEN}80; }
          100% { opacity: 0.8; }
        }
      `}</style>
    </Box>
  );
};

export default HeroSection;