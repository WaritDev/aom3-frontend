'use client';

import React from 'react';
import { Container, Box, Typography, Stack, Fade, useTheme } from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import TimelineIcon from '@mui/icons-material/Timeline';
import ShieldMoonIcon from '@mui/icons-material/ShieldMoon';
import BoltIcon from '@mui/icons-material/Bolt';

const NEON_GREEN = '#00E08F';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const features: FeatureItem[] = [
  {
    icon: <WaterDropIcon sx={{ color: NEON_GREEN }} />, 
    title: 'Aggregated Liquidity',
    desc: 'Powering Hyperliquid through a basket of sub-strategies. Your capital is distributed across 7+ professional market-making vaults for optimized yield.'
  },
  {
    icon: <TimelineIcon sx={{ color: NEON_GREEN }} />, 
    title: 'Platform Fee Capture',
    desc: 'Capture real cash flow from every trade executed on the platform. You are not just a user; you are the liquidity provider earning protocol fees.'
  },
  {
    icon: <BoltIcon sx={{ color: NEON_GREEN }} />,
    title: 'Liquidation Revenue',
    desc: 'Our HLP engine actively performs liquidations across the exchange, accruing additional profits during market volatility and cascading liquidations.'
  },
  {
    icon: <ShieldMoonIcon sx={{ color: NEON_GREEN }} />, 
    title: 'Ecosystem Alignment',
    desc: 'AOM3 aligns your long-term discipline with Hyperliquid’s growth. Maintain your streak to maximize your share of the community-owned vault returns.'
  }
];

const StrategySection: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ 
      py: { xs: 10, md: 15 }, 
      bgcolor: 'background.default',
      position: 'relative',
      transition: 'background-color 0.3s ease'
    }}>
      <Box 
        sx={{ 
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: '80%', height: '400px', 
          bgcolor: isDark ? `${NEON_GREEN}05` : `${NEON_GREEN}10`, 
          filter: isDark ? 'blur(100px)' : 'blur(150px)', 
          borderRadius: '50%', zIndex: 0 
        }} 
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in timeout={1000}>
          <Box mb={10} textAlign="center">
            <Typography variant="overline" sx={{ color: NEON_GREEN, fontWeight: 900, letterSpacing: 4 }}>
              Protocol Alpha
            </Typography>
            <Typography variant="h2" fontWeight="900" sx={{ 
              mt: 2, mb: 3, letterSpacing: '-2px', textTransform: 'uppercase',
              color: 'text.primary'
            }}>
              Hyperliquid Community <br />
              <Box component="span" sx={{ 
                color: NEON_GREEN, 
                textShadow: isDark ? `0 0 30px ${NEON_GREEN}40` : 'none' 
              }}>
                Liquidity Provision
              </Box>
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 700, mx: 'auto', fontWeight: 500 }}>
              AOM3 bridges the gap between individual savers and HL Community market-making. Powered by HLP, we automate complex strategies for sustainable wealth creation.
            </Typography>
          </Box>
        </Fade>

        <Stack spacing={2.5}>
          {features.map((item, index) => (
            <Box 
              key={index}
              sx={{ 
                p: { xs: 3, md: 4 }, 
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)', 
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                borderRadius: 4,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: { xs: 2, sm: 4 },
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'default',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(0, 224, 143, 0.03)' : 'rgba(0, 224, 143, 0.05)',
                  borderColor: `${NEON_GREEN}40`,
                  transform: 'translateX(12px)',
                  boxShadow: isDark 
                    ? `0 0 30px ${NEON_GREEN}05` 
                    : `0 10px 30px rgba(0, 224, 143, 0.1)`
                }
              }}
            >
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: isDark ? `${NEON_GREEN}10` : `${NEON_GREEN}08`, 
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
                <Typography variant="h5" fontWeight="900" sx={{ 
                  mb: 1, textTransform: 'uppercase', letterSpacing: 1,
                  color: 'text.primary'
                }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7, maxWidth: '800px', fontWeight: 500 }}>
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