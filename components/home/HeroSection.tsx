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
  Theme,
  useTheme
} from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import Link from 'next/link';

const NEON_GREEN = '#00E08F';

interface StatItemProps {
  label: string;
  value: string;
  subValue: string;
}

const StatItem = ({ label, value, subValue }: StatItemProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h5" fontWeight="900" sx={{ color: 'text.primary', lineHeight: 1 }}>
        {value}
      </Typography>
      <Typography variant="caption" sx={{ color: NEON_GREEN, fontWeight: 800, letterSpacing: 1, display: 'block', mt: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)', fontSize: '0.65rem' }}>
        {subValue}
      </Typography>
    </Box>
  );
};

const HeroSection: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

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
        bgcolor: 'background.default',
        background: isDark 
            ? `radial-gradient(circle at 50% 20%, ${NEON_GREEN}15 0%, rgba(5, 5, 5, 0) 60%),
              linear-gradient(to bottom, #050505, #0a0a0a)`
            : `radial-gradient(circle at 50% 20%, ${NEON_GREEN}10 0%, rgba(255, 255, 255, 0) 60%),
              linear-gradient(to bottom, #F5F5F5, #FFFFFF)`,
        transition: 'all 0.4s ease'
      }}
    >
      <Box 
        sx={{ 
          position: 'absolute', 
          inset: 0, 
          opacity: isDark ? 0.04 : 0.08, 
          backgroundImage: `linear-gradient(${isDark ? NEON_GREEN : '#000'} 1px, transparent 1px), 
                            linear-gradient(90deg, ${isDark ? NEON_GREEN : '#000'} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          pointerEvents: 'none'
        }} 
      />

      <Container maxWidth="lg">
        <Fade in timeout={1200}>
          <Stack spacing={5} alignItems="center" textAlign="center" sx={{ position: 'relative', zIndex: 1 }}>
            
            <Box 
              sx={{ 
                bgcolor: isDark ? `${NEON_GREEN}08` : `${NEON_GREEN}15`, 
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
              <Typography variant="caption" sx={{ color: isDark ? NEON_GREEN : '#008F5D', fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase' }}>
                AOM3: The Discipline-Driven Yield Protocol
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
                  background: isDark 
                    ? `linear-gradient(180deg, #FFF 40%, ${NEON_GREEN} 160%)`
                    : `linear-gradient(180deg, #2b2b2b 40%, ${NEON_GREEN} 160%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textTransform: 'uppercase',
                  mb: 1
                }}
              >
                DISCIPLINE <br /> <Box component="span" sx={{ textShadow: isDark ? `0 0 50px ${NEON_GREEN}60` : 'none' }}>AS A</Box> MAKER
              </Typography>
            </Box>

            <Typography 
              variant="h5" 
              sx={{ 
                maxWidth: '750px', 
                mx: 'auto', 
                fontSize: { xs: '1.05rem', md: '1.25rem' }, 
                lineHeight: 1.6,
                color: 'text.secondary',
                fontWeight: 500,
                letterSpacing: 0.5
              }}
            >
              Commit to the quest. Stack Discipline Points (DP) for <Box component="span" color="text.primary" fontWeight="800">exclusive bonuses</Box>. 
              Your assets generate real-yield through <Box component="span" color={NEON_GREEN} fontWeight="800">Hyperliquid’s Multi-Vault HLP engine</Box>.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} pt={2}>
              <Button 
                component={Link}
                href="/overview"
                variant="contained" 
                sx={launchButtonSx}
              >
                Start Your Discipline
              </Button>
              
              <Button 
                component={Link}
                href="/docs"
                variant="outlined" 
                size="large"
                sx={{ 
                  px: 5, 
                  borderRadius: '12px',
                  borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
                  color: 'text.primary',
                  fontWeight: 800,
                  borderWidth: '2px',
                  '&:hover': {
                    borderColor: NEON_GREEN,
                    bgcolor: `${NEON_GREEN}05`,
                    borderWidth: '2px',
                  }
                }}
              >
                Reward Mechanics
              </Button>
            </Stack>

            <Stack 
              direction="row" 
              spacing={{ xs: 3, md: 6 }} 
              sx={{ pt: 6 }} 
              divider={<Divider orientation="vertical" flexItem sx={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', height: '40px', alignSelf: 'center' }} />}
            >
              <StatItem label="VAULT SOURCE" value="HLP MM" subValue="7+ STRATEGIES" />
              <StatItem label="STREAK BONUS" value="UP TO 1.5x" subValue="YIELD MULTIPLIER" />
              <StatItem label="REWARD POOL" value="USDC" subValue="PENALTY-DRIVEN" />
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