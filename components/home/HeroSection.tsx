'use client';

import React from 'react';
import { 
  Box, Container, Typography, Button, Stack, Fade, Divider,
  SxProps, Theme, useTheme, alpha
} from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import Link from 'next/link';
import { motion } from 'framer-motion';

const NEON_GREEN = '#00E08F';

const LOGOS = [
  { name: 'Hyperliquid', url: 'https://s2.coinmarketcap.com/static/img/coins/200x200/32196.png' },
  { name: 'Arbitrum', url: 'https://arbiscan.io/assets/arbitrum/images/svg/logos/chain-light.svg?v=26.2.2.0' },
  { name: 'USDC', url: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/USD_Coin_logo_%28cropped%29.png' },
];

interface StatItemProps {
  label: string;
  value: string;
  subValue: string;
}

const StatItem = ({ label, value, subValue }: StatItemProps) => {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h5" fontWeight="900" sx={{ color: 'text.primary', lineHeight: 1, letterSpacing: -1 }}>
        {value}
      </Typography>
      <Typography variant="caption" sx={{ color: NEON_GREEN, fontWeight: 900, letterSpacing: 1.5, display: 'block', mt: 0.5, textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.65rem', fontWeight: 600 }}>
        {subValue}
      </Typography>
    </Box>
  );
};

const HeroSection: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const launchButtonSx: SxProps<Theme> = {
    px: 6, py: 2, fontSize: '1.1rem', borderRadius: '12px', fontWeight: 900,
    bgcolor: NEON_GREEN, color: '#000', boxShadow: `0 0 25px ${alpha(NEON_GREEN, 0.4)}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': { bgcolor: NEON_GREEN, boxShadow: `0 0 45px ${alpha(NEON_GREEN, 0.6)}`, transform: 'translateY(-3px)' },
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: 'auto', md: 'calc(100vh - 80px)' }, 
        pt: { xs: '80px', md: '120px' },
        pb: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        bgcolor: 'background.default',
        background: isDark 
            ? `radial-gradient(circle at 50% 30%, ${alpha(NEON_GREEN, 0.15)} 0%, rgba(5, 5, 5, 0) 60%),
              linear-gradient(to bottom, #050505, #0a0a0a)`
            : `radial-gradient(circle at 50% 30%, ${alpha(NEON_GREEN, 0.1)} 0%, rgba(255, 255, 255, 0) 60%),
              linear-gradient(to bottom, #F5F5F5, #FFFFFF)`,
        transition: 'all 0.4s ease'
      }}
    >
      <Box sx={{ position: 'absolute', inset: 0, opacity: isDark ? 0.05 : 0.08, backgroundImage: `linear-gradient(${isDark ? NEON_GREEN : '#000'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? NEON_GREEN : '#000'} 1px, transparent 1px)`, backgroundSize: '45px 45px', pointerEvents: 'none' }} />

      <Container maxWidth="lg">
        <Fade in timeout={1200}>
          <Stack spacing={5} alignItems="center" textAlign="center" sx={{ position: 'relative', zIndex: 1 }}>
            
            <Box sx={{ bgcolor: isDark ? alpha(NEON_GREEN, 0.08) : alpha(NEON_GREEN, 0.12), px: 3, py: 1, borderRadius: '50px', border: `1px solid ${alpha(NEON_GREEN, 0.3)}`, display: 'flex', alignItems: 'center', gap: 1.5, animation: 'pulse 2s infinite ease-in-out' }}>
              <BoltIcon sx={{ color: NEON_GREEN, fontSize: 18 }} />
              <Typography variant="caption" sx={{ color: isDark ? NEON_GREEN : '#008F5D', fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase' }}>
                AOM3: Protocol Intelligence V2.0
              </Typography>
            </Box>

            <Box>
              <Typography variant="h1" sx={{ fontSize: { xs: '3.5rem', md: '6.8rem' }, fontWeight: 900, lineHeight: 0.85, letterSpacing: '-5px', background: isDark ? `linear-gradient(180deg, #FFF 40%, ${NEON_GREEN} 160%)` : `linear-gradient(180deg, #111 40%, ${NEON_GREEN} 160%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textTransform: 'uppercase', mb: 1 }}>
                DISCIPLINE <br /> <Box component="span" sx={{ textShadow: isDark ? `0 0 60px ${alpha(NEON_GREEN, 0.5)}` : 'none' }}>AS A</Box> MAKER
              </Typography>
            </Box>

            <Typography variant="h5" sx={{ maxWidth: '800px', mx: 'auto', fontSize: { xs: '1.1rem', md: '1.3rem' }, lineHeight: 1.6, color: 'text.secondary', fontWeight: 500, letterSpacing: 0.2 }}>
              Master your assets through the quest. Stack <Box component="span" color="text.primary" fontWeight="900">Discipline Points (DP)</Box> for exclusive yield multipliers. Powered by <Box component="span" color={NEON_GREEN} fontWeight="900">Hyperliquid’s HLP Engine</Box>.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} pt={2}>
              <Button component={Link} href="/overview" variant="contained" sx={launchButtonSx}>Start Your Discipline</Button>
              <Button component={Link} href="/docs" variant="outlined" size="large" sx={{ px: 5, borderRadius: '12px', borderColor: theme.palette.divider, color: 'text.primary', fontWeight: 900, borderWidth: '2px', '&:hover': { borderColor: NEON_GREEN, bgcolor: alpha(NEON_GREEN, 0.05), borderWidth: '2px' } }}>Reward Mechanics</Button>
            </Stack>

            <Stack direction="row" spacing={{ xs: 3, md: 8 }} sx={{ pt: 4 }} divider={<Divider orientation="vertical" flexItem sx={{ borderColor: theme.palette.divider, height: '40px', alignSelf: 'center' }} />}>
              <StatItem label="VAULT SOURCE" value="HLP MM" subValue="ACTIVE STRATEGY" />
              <StatItem label="STREAK BONUS" value="1.5x" subValue="MAX MULTIPLIER" />
              <StatItem label="REWARD POOL" value="USDC" subValue="REAL-YIELD" />
            </Stack>

            <Box sx={{ 
                pt: 0, width: '100%', overflow: 'hidden', position: 'relative',
                maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
            }}>
                <Typography variant="overline" sx={{ color: 'text.disabled', letterSpacing: 5, fontWeight: 900, opacity: 0.5, mb: 4, display: 'block' }}>
                    Institutional Technology Stack
                </Typography>
                
                <Box sx={{ display: 'flex', width: 'max-content' }}>
                  <motion.div
                    animate={{ x: ["0%", "-50%"] }} 
                    transition={{
                      x: { repeat: Infinity, repeatType: "loop", duration: 25, ease: "linear" }
                    }}
                    style={{ display: 'flex', gap: '120px', alignItems: 'center', paddingRight: '120px' }}
                  >
                    {[...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS].map((logo, idx) => (
                      <Box 
                        key={idx} 
                        component="img" 
                        src={logo.url} 
                        alt={logo.name}
                        sx={{ 
                          height: { xs: 45, md: 60 },
                          width: 'auto',
                          opacity: isDark ? 0.4 : 0.6,
                          filter: isDark ? 'grayscale(1) brightness(1.8)' : 'grayscale(1)',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            opacity: 1,
                            filter: 'grayscale(0)',
                            transform: 'scale(1.2) rotate(2deg)',
                          }
                        }}
                      />
                    ))}
                  </motion.div>
                </Box>
            </Box>

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